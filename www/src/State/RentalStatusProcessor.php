<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Rental;
use App\Entity\Notification;
use App\Entity\User;
use App\Service\PriceCalculatorService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class RentalStatusProcessor implements ProcessorInterface
{
    public function __construct(
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $persistProcessor,
        private readonly EntityManagerInterface $entityManager,
        private readonly PriceCalculatorService $priceCalculator,
        #[Autowire('%env(STRIPE_SECRET_KEY)%')]
        private readonly string $stripeSecretKey
    ) {
    }

    /**
     * @param Rental $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        error_log("PAYOUT: Entering RentalStatusProcessor::process");
        /** @var Rental|null $originalData */
        $originalData = $context['previous_data'] ?? null;
        
        // 1. Detect newly confirmed crew members (DIRECT DB CHECK to bypass cache)
        $rentalId = $data->getId();
        $oldConfirmedIds = [];
        if ($rentalId) {
            $conn = $this->entityManager->getConnection();
            $oldConfirmedIds = $conn->fetchFirstColumn(
                "SELECT user_id FROM rental_confirmed_by WHERE rental_id = ?",
                [$rentalId]
            );
        }
            
        $newConfirmed = $data->getConfirmedBy()->toArray();
        $newConfirmedIds = array_map(fn($u) => $u->getId(), $newConfirmed);
        
        $addedMembers = array_filter($newConfirmed, fn($u) => !in_array($u->getId(), $oldConfirmedIds));

        error_log(sprintf("PAYOUT TRACE (Anti-Cache): Old DB IDs [%s], New Request IDs [%s], Added Count: %d", 
            implode(',', $oldConfirmedIds), 
            implode(',', $newConfirmedIds),
            count($addedMembers)
        ));

        // 2. Handle Payout and Notifications BEFORE persisting
        $client = $data->getUser();
        $boat = $data->getBoat();

        if ($client && $boat && !empty($addedMembers)) {
            foreach ($addedMembers as $member) {
                /** @var User $member */
                $this->handleCrewPayout($member, $data);
                
                // Notification client
                $roleLabel = strtolower($member->getRoleLabel() ?: 'membre d\'équipage');
                $prefix = in_array(substr($roleLabel, 0, 1), ['a', 'e', 'i', 'o', 'u', 'y', 'h']) ? "L'" : "Le ";
                if ($roleLabel === 'hôtesse') $prefix = "L'";

                $notification = new Notification();
                $notification->setUser($client);
                $notification->setLabel(sprintf(
                    '%s%s (%s) a validé votre réservation pour le bateau %s.',
                    $prefix, $roleLabel, $member->getFirstname(), $boat->getName()
                ));
                $notification->setIsOpen(false);
                $notification->setCreatedAt(new \DateTime());
                $this->entityManager->persist($notification);
            }
        }

        // 3. Persist the update
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        
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

    /**
     * Calcule et effectue le virement vers le membre du staff
     */
    private function handleCrewPayout(User $member, Rental $rental): void
    {
        $nbDays = $this->priceCalculator->calculateNbDays($rental->getRentalStart(), $rental->getRentalEnd());
        
        $role = $member->getRoleLabel();
        $roleKey = strtoupper($role);
        
        $crewPrices = [
            'ROLE_CAPITAINE' => 250.0,
            'CAPITAINE'      => 250.0,
            'ROLE_CHEF'      => 200.0,
            'CHEF'           => 200.0,
            'ROLE_HOTESSE'   => 150.0,
            'HOTESSE'        => 150.0,
            'HÔTESSE'        => 150.0,
        ];

        $dailyRate = $crewPrices[$roleKey] ?? $crewPrices[$role] ?? 0;
        
        error_log(sprintf("PAYOUT STEP 1: User %s, Role %s, Rate %f, Days %d", $member->getFirstname(), $role, $dailyRate, $nbDays));

        if ($dailyRate > 0) {
            $grossAmount = $dailyRate * $nbDays;
            $netAmount = $grossAmount * 0.90; // 90% pour le membre
            
            error_log(sprintf("PAYOUT STEP 2: Gross %f, Net %f", $grossAmount, $netAmount));

            // Mise à jour balance locale
            $currentBalance = $member->getBalance() ?: 0;
            $member->setBalance($currentBalance + $netAmount);
            $this->entityManager->persist($member);
            $this->entityManager->flush($member); // Forcer l'écriture immédiate
            
            error_log(sprintf("PAYOUT STEP 3: New Local Balance %f", $member->getBalance()));

            // Transfert Stripe réel
            if ($member->getStripeAccountId()) {
                try {
                    error_log("PAYOUT STEP 4: Attempting Stripe Transfer to " . $member->getStripeAccountId());
                    \Stripe\Stripe::setApiKey($this->stripeSecretKey);
                    $transfer = \Stripe\Transfer::create([
                        'amount' => (int)($netAmount * 100),
                        'currency' => 'eur',
                        'destination' => $member->getStripeAccountId(),
                        'description' => sprintf('Paiement mission %s - %s', $rental->getId(), $member->getFirstname()),
                        'metadata' => ['rental_id' => (string) $rental->getId()]
                    ]);
                    error_log("PAYOUT STEP 5: Stripe Transfer Success! ID: " . $transfer->id);
                    
                    // Notification spécifique Stripe
                    $notif = new Notification();
                    $notif->setUser($member);
                    $notif->setLabel(sprintf('Virement effectué : %.2f € ont été transférés vers votre compte Stripe Connect.', $netAmount));
                    $notif->setIsOpen(false);
                    $notif->setCreatedAt(new \DateTime());
                    $this->entityManager->persist($notif);

                } catch (\Exception $e) {
                    // En cas d'erreur Stripe, la balance virtuelle reste à jour
                    // On pourrait logger l'erreur ici.
                }
            } else {
                // Notification simple de balance
                $notif = new Notification();
                $notif->setUser($member);
                $notif->setLabel(sprintf('Mission confirmée ! %.2f € ont été ajoutés à votre solde CrewlyPlus.', $netAmount));
                $notif->setIsOpen(false);
                $notif->setCreatedAt(new \DateTime());
                $this->entityManager->persist($notif);
            }
        }
    }
}
