<?php

namespace App\Security\Voter;

use App\Entity\TeamMembership;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class TeamMembershipVoter extends Voter
{
    public const EDIT = 'MEMBERSHIP_EDIT';
    public const DELETE = 'MEMBERSHIP_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::DELETE])
            && $subject instanceof TeamMembership;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?\Symfony\Component\Security\Core\Authorization\Voter\Vote $vote = null): bool
    {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return true;
        }

        /** @var TeamMembership $membership */
        $membership = $subject;

        switch ($attribute) {
            case self::EDIT:
                return $this->canEdit($membership, $user);
            case self::DELETE:
                return $this->canDelete($membership, $user);
        }

        return false;
    }

    private function canEdit(TeamMembership $membership, User $user): bool
    {
        // Le leader de l'équipe peut tout modifier
        if ($membership->getTeam()->getLeader() === $user) {
            return true;
        }

        // Un membre peut modifier sa propre position (mais pas son rôle ou son équipe)
        // Note: Le contrôle précis des champs modifiables se fait normalement au niveau du dénormaliseur ou du contrôleur, 
        // mais ici on autorise l'accès à l'opération PATCH si c'est son propre membership.
        return $membership->getUser() === $user;
    }

    private function canDelete(TeamMembership $membership, User $user): bool
    {
        // Le leader peut supprimer n'importe qui
        if ($membership->getTeam()->getLeader() === $user) {
            return true;
        }

        // Un membre peut "quitter" l'équipe (supprimer son membership)
        return $membership->getUser() === $user;
    }
}
