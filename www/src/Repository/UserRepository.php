<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findByRoleLabel(string $roleLabel): array
    {
        return $this->createQueryBuilder('u')
            ->join('u.role', 'r')
            ->andWhere('r.label = :role')
            ->andWhere('u.isActive = true')

            ->setParameter('role', $roleLabel)
            ->getQuery()
            ->getResult();
    }
}
