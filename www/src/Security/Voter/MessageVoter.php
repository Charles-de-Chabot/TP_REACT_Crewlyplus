<?php

namespace App\Security\Voter;

use App\Entity\Message;
use App\Entity\TeamMembership;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

use Symfony\Component\Security\Core\Authorization\Voter\Vote;

class MessageVoter extends Voter
{
    public const VIEW = 'MESSAGE_VIEW';
    public const DELETE = 'MESSAGE_DELETE';

    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::VIEW, self::DELETE])
            && $subject instanceof Message;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token, ?Vote $vote = null): bool
    {
        $user = $token->getUser();
        if (!$user instanceof User) {
            return false;
        }

        /** @var Message $message */
        $message = $subject;
        $team = $message->getTeam();

        if (!$team) {
            return false;
        }

        // Vérifier si l'utilisateur est membre de l'équipe du message
        // OPTIMISATION DQL : On cherche une adhésion active
        $membership = $this->entityManager->getRepository(TeamMembership::class)
            ->createQueryBuilder('m')
            ->where('m.team = :team')
            ->andWhere('m.user = :user')
            ->andWhere('m.leftAt IS NULL')
            ->setParameter('team', $team)
            ->setParameter('user', $user)
            ->getQuery()
            ->getOneOrNullResult();

        $isMember = ($membership !== null);

        switch ($attribute) {
            case self::VIEW:
                return $isMember;

            case self::DELETE:
                // Seul l'auteur ou le Skipper peut supprimer
                $isAuthor = ($message->getAuthor() === $user);
                $isSkipper = ($team->getLeader() === $user);
                return $isAuthor || $isSkipper;
        }

        return false;
    }
}
