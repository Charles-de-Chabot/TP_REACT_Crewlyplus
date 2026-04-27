<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Boat;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

final class BoatExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    public function __construct(
        private Security $security,
    ) {
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        if (Boat::class !== $resourceClass || $this->security->isGranted('ROLE_PREMIUM') || $this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        
        // Calcul de la date d'il y a 48 heures
        $fortyEightHoursAgo = new \DateTime('-48 hours');

        // L'utilisateur non-premium ne voit le bateau QUE SI :
        // 1. used est faux (bateau standard)
        // 2. OU used est vrai MAIS le bateau a été créé il y a plus de 48h
        $queryBuilder->andWhere(
            $queryBuilder->expr()->orX(
                $queryBuilder->expr()->eq(sprintf('%s.used', $rootAlias), ':false'),
                $queryBuilder->expr()->lt(sprintf('%s.created_at', $rootAlias), ':fortyEightHoursAgo')
            )
        );

        $queryBuilder->setParameter('false', false);
        $queryBuilder->setParameter('fortyEightHoursAgo', $fortyEightHoursAgo);
    }
}
