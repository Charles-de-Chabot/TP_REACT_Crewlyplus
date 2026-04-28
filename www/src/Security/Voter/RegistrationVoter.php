<?php

namespace App\Security\Voter;

use App\Entity\Registration;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class RegistrationVoter extends Voter
{
    public const VIEW = 'REGISTRATION_VIEW';
    public const EDIT = 'REGISTRATION_EDIT';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::EDIT])
            && $subject instanceof Registration;
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

        /** @var Registration $registration */
        $registration = $subject;

        switch ($attribute) {
            case self::VIEW:
                return $this->canView($registration, $user);
            case self::EDIT:
                return $this->canEdit($registration, $user);
        }

        return false;
    }

    private function canView(Registration $registration, User $user): bool
    {
        $team = $registration->getTeam();
        if (!$team) {
            return false;
        }

        // On peut voir l'inscription si on est membre ou leader de l'équipe
        return $team->getMembers()->contains($user) || $team->getLeader() === $user;
    }

    private function canEdit(Registration $registration, User $user): bool
    {
        $team = $registration->getTeam();
        if (!$team) {
            return false;
        }

        // Seul le leader de l'équipe peut modifier les stats de l'inscription
        return $team->getLeader() === $user;
    }
}
