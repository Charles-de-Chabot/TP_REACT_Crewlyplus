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
        private readonly EntityManagerInterface $entityManager
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
        
        // 4. If ALL requested roles have been filled by crew members (Checked outside the addedMembers block)
        $requestedRoles = $data->getRequestedRoles();
        $totalNeeded = count($requestedRoles);
        $confirmedCount = $data->getConfirmedBy()->count();

        // Debug log if status not changing
        if ($totalNeeded > 0 && $confirmedCount === $totalNeeded && $data->getStatus() !== Rental::STATUS_CONFIRMED) {
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
}
