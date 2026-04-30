<?php

namespace App\EventSubscriber;

use App\Entity\Team;
use App\Entity\TeamMembership;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\EventSubscriber\EventSubscriberInterface;
use Doctrine\ORM\Events;
use Doctrine\ORM\Event\OnFlushEventArgs;

class TeamActivitySubscriber implements EventSubscriberInterface
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

        // On surveille les User et TeamMembership qui changent
        $entities = array_merge(
            $uow->getScheduledEntityUpdates(),
            $uow->getScheduledEntityInsertions(),
            $uow->getScheduledEntityDeletions()
        );

        $teamsToCheck = [];

        foreach ($entities as $entity) {
            if ($entity instanceof User) {
                if ($entity->getCurrentTeam()) {
                    $teamsToCheck[$entity->getCurrentTeam()->getId()] = $entity->getCurrentTeam();
                }
                // Vérifier aussi l'ancienne équipe si elle a changé
                $changeset = $uow->getEntityChangeSet($entity);
                if (isset($changeset['currentTeam'])) {
                    [$oldTeam, $newTeam] = $changeset['currentTeam'];
                    if ($oldTeam instanceof Team) {
                        $teamsToCheck[$oldTeam->getId()] = $oldTeam;
                    }
                    if ($newTeam instanceof Team) {
                        $teamsToCheck[$newTeam->getId()] = $newTeam;
                    }
                }
            }
            if ($entity instanceof TeamMembership) {
                if ($entity->getTeam()) {
                    $teamsToCheck[$entity->getTeam()->getId()] = $entity->getTeam();
                }
            }
        }

        foreach ($teamsToCheck as $team) {
            $activeMembersCount = $team->getMembers()->count();
            
            // Si l'équipe est en train de perdre son dernier membre
            // (Note: le count() peut ne pas être à jour dans l'UOW si on ne fait pas attention)
            // Mais ici on simplifie la logique : si count == 0 -> inactive
            
            if ($activeMembersCount === 0 && $team->isActive()) {
                $team->setIsActive(false);
                $uow->computeChangeSet($em->getClassMetadata(Team::class), $team);
            } elseif ($activeMembersCount > 0 && !$team->isActive()) {
                $team->setIsActive(true);
                $uow->computeChangeSet($em->getClassMetadata(Team::class), $team);
            }
        }
    }
}
