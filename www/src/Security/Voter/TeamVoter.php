<?php

namespace App\Security\Voter;

use App\Entity\Team;
use App\Entity\User;
use App\Entity\Media;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class TeamVoter extends Voter
{
    public const VIEW = 'TEAM_VIEW';
    public const EDIT = 'TEAM_EDIT';
    public const DOC_VIEW = 'TEAM_DOC_VIEW';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT, self::DOC_VIEW])
            && ($subject instanceof Team || $subject instanceof Media);
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?\Symfony\Component\Security\Core\Authorization\Voter\Vote $vote = null): bool
    {
        $user = $token->getUser();

        // Si l'utilisateur n'est pas connecté, pas d'accès
        if (!$user instanceof User) {
            return false;
        }

        // Les admins ont accès à tout
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        switch ($attribute) {
            case self::VIEW:
                return $this->canView($subject, $user);
            case self::EDIT:
                return $this->canEdit($subject, $user);
            case self::DOC_VIEW:
                return $this->canViewDocument($subject, $user);
        }

        return false;
    }

    private function canView(Team $team, User $user): bool
    {
        // On peut voir la team si on en est membre
        return $team->getMembers()->contains($user) || $team->getLeader() === $user;
    }

    private function canEdit(Team $team, User $user): bool
    {
        // Seul le leader peut modifier la team (nom, avitaillement)
        return $team->getLeader() === $user;
    }

    private function canViewDocument(Media $media, User $user): bool
    {
        $owner = $media->getUser();
        if (!$owner) {
            return false;
        }

        // On peut voir le document si c'est le nôtre
        if ($owner === $user) {
            return true;
        }

        // OU si le propriétaire du document est dans la même équipe que nous
        $ownerTeam = $owner->getCurrentTeam();
        $userTeam = $user->getCurrentTeam();

        return $ownerTeam !== null && $ownerTeam === $userTeam;
    }
}
