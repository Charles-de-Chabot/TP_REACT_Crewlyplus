<?php

declare(strict_types=1);

namespace App\Security\Voter;

use App\Entity\Rental;
use App\Entity\User;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Voter to secure access to Rental entities.
 */
class RentalVoter extends Voter
{
    public const CREATE = 'RENTAL_CREATE';
    public const VIEW   = 'RENTAL_VIEW';
    public const EDIT   = 'RENTAL_EDIT';
    public const DELETE = 'RENTAL_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // If the attribute is RENTAL_CREATE, we don't necessarily need a subject (or it can be null)
        if ($attribute === self::CREATE) {
            return true;
        }

        // For other attributes, the subject must be a Rental instance
        return in_array($attribute, [self::VIEW, self::EDIT, self::DELETE], true)
            && $subject instanceof Rental;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, mixed $vote = null): bool
    {
        $user = $token->getUser();

        // 1. User must be logged in
        if (!$user instanceof User) {
            return false;
        }

        // 2. User must be active (Business Rule)
        if ($user->isActive() === false) {
            return false;
        }

        // 3. Admin has all rights
        if (in_array('ROLE_ADMIN', $user->getRoles(), true)) {
            return true;
        }

        return match ($attribute) {
            self::CREATE => $this->canCreate($user),
            self::VIEW   => $this->canView($subject, $user),
            self::EDIT   => $this->canEdit($subject, $user),
            self::DELETE => $this->canDelete($subject, $user),
            default      => false,
        };
    }

    private function canCreate(User $user): bool
    {
        // Any active authenticated user can create a rental request
        return true;
    }

    private function canView(Rental $rental, User $user): bool
    {
        // A user can view their own rental
        return $rental->getUser() === $user;
    }

    private function canEdit(Rental $rental, User $user): bool
    {
        // A user can only edit their own rental if it's still in 'pending' status
        // (Once confirmed or paid, editing should be restricted)
        return $rental->getUser() === $user && $rental->getStatus() === Rental::STATUS_PENDING;
    }

    private function canDelete(Rental $rental, User $user): bool
    {
        // A user can delete (cancel) their own rental if it's still 'pending'
        return $rental->getUser() === $user && $rental->getStatus() === Rental::STATUS_PENDING;
    }
}
