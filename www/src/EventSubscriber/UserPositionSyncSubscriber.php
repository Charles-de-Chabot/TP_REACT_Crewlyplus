<?php

namespace App\EventSubscriber;

use App\Entity\TeamMembership;
use App\Entity\User;
use App\Entity\Position;
use App\Entity\SailingProfile;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\ORM\Event\OnFlushEventArgs;

class UserPositionSyncSubscriber implements EventSubscriberInterface
{
    public function getSubscribedEvents(): array
    {
        return [
            Events::onFlush,
        ];
    }

    public function onFlush(OnFlushEventArgs $args): void
    {
        $em = $args->getObjectManager();
        $uow = $em->getUnitOfWork();

        // On parcourt les entités à insérer ou mettre à jour
        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            $this->processEntity($entity, $em, $uow);
        }

        foreach ($uow->getScheduledEntityInsertions() as $entity) {
            $this->processEntity($entity, $em, $uow);
        }
    }

    private function processEntity(object $entity, \Doctrine\ORM\EntityManagerInterface $em, \Doctrine\ORM\UnitOfWork $uow): void
    {
        // CAS 1 : On change le poste dans le membership -> On met à jour User ET SailingProfile
        if ($entity instanceof TeamMembership) {
            $changeset = $uow->getEntityChangeSet($entity);
            if (isset($changeset['position']) || isset($changeset['leftAt'])) {
                $user = $entity->getUser();
                $position = $entity->getPosition();
                
                if ($user && $position && !$entity->getLeftAt()) {
                    $label = $position->getLabel();
                    $this->updateUserAndProfile($user, $label, $em, $uow);
                }
            }
        }

        // CAS 2 : On change le poste dans le profil User -> On met à jour Membership ET SailingProfile
        if ($entity instanceof User) {
            $label = $entity->getPosition();
            if (!$label) return;

            // 1. Update SailingProfile (CV)
            $profile = $entity->getSailingProfile();
            if ($profile && $profile->getCurrentPosition() !== $label) {
                $profile->setCurrentPosition($label);
                $uow->recomputeSingleEntityChangeSet($em->getClassMetadata(SailingProfile::class), $profile);
            }

            // 2. Update Membership
            $activeMembership = null;
            $currentTeam = $entity->getCurrentTeam();
            $membershipRepo = $em->getRepository(TeamMembership::class);

            if ($currentTeam) {
                $activeMembership = $membershipRepo->findOneBy([
                    'user' => $entity,
                    'team' => $currentTeam,
                    'leftAt' => null
                ]);
            } else {
                // Fallback : On cherche n'importe quel membership actif si currentTeam n'est pas chargé
                $activeMembership = $membershipRepo->findOneBy([
                    'user' => $entity,
                    'leftAt' => null
                ]);
            }

            if ($activeMembership) {
                $positionRepo = $em->getRepository(Position::class);
                $targetPos = $positionRepo->findOneBy(['label' => $label]);

                if ($targetPos && $activeMembership->getPosition() !== $targetPos) {
                    $activeMembership->setPosition($targetPos);
                    $uow->recomputeSingleEntityChangeSet($em->getClassMetadata(TeamMembership::class), $activeMembership);
                }
            }
        }
    }

    private function updateUserAndProfile(User $user, string $label, \Doctrine\ORM\EntityManagerInterface $em, \Doctrine\ORM\UnitOfWork $uow): void
    {
        // 1. Update User string
        if ($user->getPosition() !== $label) {
            $user->setPosition($label);
            $uow->recomputeSingleEntityChangeSet($em->getClassMetadata(User::class), $user);
        }

        // 2. Update SailingProfile string (CV)
        $profile = $user->getSailingProfile();
        if ($profile && $profile->getCurrentPosition() !== $label) {
            $profile->setCurrentPosition($label);
            $uow->recomputeSingleEntityChangeSet($em->getClassMetadata(SailingProfile::class), $profile);
        }
    }
}
