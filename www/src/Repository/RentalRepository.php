<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Boat;
use App\Entity\Rental;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Rental>
 */
class RentalRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Rental::class);
    }

    /**
     * Checks if a boat is available for a given period.
     * Overlaps with any rental that is not cancelled.
     *
     * @param Boat $boat The boat to check
     * @param \DateTimeInterface $start Start of requested period
     * @param \DateTimeInterface $end End of requested period
     * @return bool True if available
     */
    public function isBoatAvailable(Boat $boat, \DateTimeInterface $start, \DateTimeInterface $end): bool
    {
        $qb = $this->createQueryBuilder('r')
            ->join('r.boat', 'b')
            ->where('b = :boat')
            ->andWhere('r.status IN (:confirmed_statuses)')
            ->andWhere('r.rentalStart < :end')
            ->andWhere('r.rentalEnd > :start')
            ->setParameter('boat', $boat)
            ->setParameter('end', $end)
            ->setParameter('start', $start)
            ->setParameter('confirmed_statuses', [Rental::STATUS_PENDING, Rental::STATUS_CONFIRMED, Rental::STATUS_COMPLETED]);

        $results = $qb->getQuery()->getResult();

        return count($results) === 0;
    }
}
