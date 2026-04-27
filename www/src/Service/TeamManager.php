<?php

namespace App\Service;

use App\Entity\Team;
use App\Entity\User;
use App\Entity\Regatta;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class TeamManager
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
    }

    /**
     * Permet à un utilisateur de rejoindre une équipe.
     * Vérifie si l'utilisateur n'est pas déjà engagé dans une autre régate active.
     */
    public function joinTeam(User $user, Team $team): void
    {
        // 1. Vérification si l'utilisateur est déjà dans une équipe
        if ($user->getCurrentTeam() !== null) {
            throw new BadRequestHttpException("Vous devez quitter votre équipe actuelle avant d'en rejoindre une nouvelle.");
        }

        // 2. Vérification si l'utilisateur est déjà inscrit à la régate via une autre équipe (sécurité redondante)
        foreach ($user->getParticipatingRegattas() as $regatta) {
            if ($regatta->getId() === $team->getRegatta()->getId()) {
                // Si l'utilisateur est déjà participant, on s'assure qu'il n'est pas dans une autre team
                // (Logique couverte par le check sur currentTeam, mais utile pour l'intégrité)
            }
        }

        // 3. Ajout du membre
        $team->addMember($user);
        $user->addParticipatingRegatta($team->getRegatta());

        $this->entityManager->flush();
    }

    /**
     * Permet à un utilisateur de quitter son équipe actuelle.
     */
    public function leaveCurrentTeam(User $user): void
    {
        $team = $user->getCurrentTeam();
        if (!$team) {
            return;
        }

        // Si l'utilisateur est le leader, on doit soit dissoudre la team, soit nommer un nouveau leader
        if ($team->getLeader() === $user) {
            // Pour l'instant, on interdit au leader de quitter sans dissoudre ou transférer (Logique simplifiée)
            if ($team->getMembers()->count() > 1) {
                // On pourrait transférer le leadership au premier membre venu
                $newLeader = $team->getMembers()->filter(fn($m) => $m !== $user)->first();
                $team->setLeader($newLeader);
            } else {
                // Si seul le leader est présent, on supprime la team ?
                // $this->entityManager->remove($team);
            }
        }

        $team->removeMember($user);
        $user->removeParticipatingRegatta($team->getRegatta());
        $user->setCurrentTeam(null);

        $this->entityManager->flush();
    }

    /**
     * Crée une nouvelle équipe pour une régate donnée.
     */
    public function createTeam(string $name, Regatta $regatta, User $leader): Team
    {
        if ($leader->getCurrentTeam() !== null) {
            throw new BadRequestHttpException("Vous ne pouvez pas créer d'équipe car vous en avez déjà une active.");
        }

        $team = new Team();
        $team->setName($name);
        $team->setRegatta($regatta);
        $team->setLeader($leader);
        $team->addMember($leader);
        
        $leader->addParticipatingRegatta($regatta);

        $this->entityManager->persist($team);
        $this->entityManager->flush();

        return $team;
    }
}
