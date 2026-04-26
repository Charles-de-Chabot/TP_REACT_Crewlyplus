<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Rental;
use App\Entity\Notification;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class RentalStatusProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $persistProcessor,
        private readonly EntityManagerInterface $entityManager,
        #[Autowire('%env(STRIPE_SECRET_KEY)%')]
        private readonly string $stripeSecretKey
    ) {
    }

    /**
     * @param Rental $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        /** @var Rental|null $originalData */
        $originalData = $context['previous_data'] ?? null;
        
        // 1. Detect newly confirmed crew members
        $oldConfirmedIds = $originalData 
            ? array_map(fn($u) => $u->getId(), $originalData->getConfirmedBy()->toArray()) 
            : [];
            
        $newConfirmed = $data->getConfirmedBy()->toArray();
        $addedMembers = array_filter($newConfirmed, fn($u) => !in_array($u->getId(), $oldConfirmedIds, true));


        // 2. Persist the update
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        // 3. Notify the client for each new validation
        $client = $data->getUser();
        $boat = $data->getBoat();

        if ($client && $boat && !empty($addedMembers)) {
            foreach ($addedMembers as $member) {
                /** @var User $member */
                $roleLabel = strtolower($member->getRoleLabel() ?: 'membre d\'équipage');
                
                // Formatage plus propre (ex: "Le capitaine", "L'hôtesse")
                $prefix = in_array(substr($roleLabel, 0, 1), ['a', 'e', 'i', 'o', 'u', 'y', 'h']) ? "L'" : "Le ";
                if ($roleLabel === 'hôtesse') $prefix = "L'";

                $notification = new Notification();
                $notification->setUser($client);
                $notification->setLabel(sprintf(
                    '%s%s (%s) a validé votre réservation pour le bateau %s.',
                    $prefix,
                    $roleLabel,
                    $member->getFirstname(),
                    $boat->getName()
                ));
                $notification->setIsOpen(false);
                $notification->setCreatedAt(new \DateTime());
                $this->entityManager->persist($notification);
            }
            
        }
        
        // 4. Handle Cancellation and Refund
        if ($data->getStatus() === Rental::STATUS_CANCELLED && $originalData && $originalData->getStatus() !== Rental::STATUS_CANCELLED) {
            $this->handleRefund($data);
        }

        // 5. If ALL requested roles have been filled by crew members
        $requestedRoles = $data->getRequestedRoles();
        $totalNeeded = count($requestedRoles);
        $confirmedCount = $data->getConfirmedBy()->count();

        if ($totalNeeded > 0 && $confirmedCount === $totalNeeded && $data->getStatus() !== Rental::STATUS_CONFIRMED && $data->getStatus() !== Rental::STATUS_CANCELLED) {
            $data->setStatus(Rental::STATUS_CONFIRMED);
            $this->entityManager->persist($data);
            
            if ($client && $boat) {
                // Final global notification
                $finalNotif = new Notification();
                $finalNotif->setUser($client);
                $finalNotif->setLabel(sprintf(
                    'Votre réservation pour %s est désormais entièrement confirmée par toute l\'équipe !',
                    $boat->getName()
                ));
                $finalNotif->setIsOpen(false);
                $finalNotif->setCreatedAt(new \DateTime());
                $this->entityManager->persist($finalNotif);
            }
        }


        $this->entityManager->flush();

        return $result;
    }

    /**
     * Calcule et déclenche le remboursement via Stripe
     */
    private function handleRefund(\App\Entity\Rental $rental): void
    {
        $paymentIntentId = $rental->getPaymentIntentId();
        if (!$paymentIntentId) {
            return;
        }

        $startDate = $rental->getRentalStart();
        $now = new \DateTime();
        
        // Calcul du délai en heures
        $diff = $startDate->getTimestamp() - $now->getTimestamp();
        $diffInHours = $diff / 3600;

        $refundPercent = 0;
        if ($diffInHours >= 48) {
            $refundPercent = 100;
        } elseif ($diffInHours > 0) {
            $refundPercent = 50;
        }

        if ($refundPercent <= 0) {
            return;
        }

        $totalPrice = $rental->getRentalPrice();
        $refundAmount = ($totalPrice * $refundPercent) / 100;

        try {
            \Stripe\Stripe::setApiKey($this->stripeSecretKey);
            
            \Stripe\Refund::create([
                'payment_intent' => $paymentIntentId,
                'amount' => (int) ($refundAmount * 100), // En centimes
            ]);

            $rental->setRefundAmount($refundAmount);
            
            // Notification de remboursement
            $notification = new Notification();
            $notification->setUser($rental->getUser());
            $notification->setLabel(sprintf(
                'Votre réservation pour %s a été annulée. Un remboursement de %.2f € (%d%%) est en cours de traitement.',
                $rental->getBoat()->getName(),
                $refundAmount,
                $refundPercent
            ));
            $notification->setIsOpen(false);
            $notification->setCreatedAt(new \DateTime());
            $this->entityManager->persist($notification);


            // Notification pour l'équipage
            foreach ($rental->getConfirmedBy() as $crewMember) {
                $crewNotif = new Notification();
                $crewNotif->setUser($crewMember);
                $crewNotif->setLabel(sprintf(
                    'La mission sur le bateau %s prévue du %s au %s a été annulée par le client.',
                    $rental->getBoat()->getName(),
                    $rental->getRentalStart()->format('d/m/Y'),
                    $rental->getRentalEnd()->format('d/m/Y')
                ));
                $crewNotif->setIsOpen(false);
                $crewNotif->setCreatedAt(new \DateTime());
                $this->entityManager->persist($crewNotif);
            }

        } catch (\Exception $e) {
            // Log error or notify admin?
            // On ne bloque pas l'annulation si le remboursement Stripe échoue, 
            // mais on pourrait vouloir enregistrer l'erreur.
        }
    }
}
