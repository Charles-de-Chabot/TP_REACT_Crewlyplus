<?php

namespace App\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;

final class BoatAvailabilityFilter extends AbstractFilter
{
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        // On n'agit que si les deux paramètres sont présents
        // API Platform appelle filterProperty pour chaque paramètre
        // On va stocker les valeurs et n'appliquer le filtre que quand on a tout
        if ($property !== 'start' && $property !== 'end') {
            return;
        }

        // On récupère l'autre paramètre depuis le contexte ou la requête
        $request = $context['filters'] ?? [];
        $startStr = $request['start'] ?? null;
        $endStr = $request['end'] ?? null;

        if (!$startStr || !$endStr) {
            return;
        }

        // Pour éviter d'appliquer le filtre deux fois (une fois pour 'start', une fois pour 'end')
        // On ne l'applique que lors du traitement du paramètre 'end'
        if ($property === 'start') {
            return;
        }

        try {
            $startDate = new \DateTime($startStr);
            $endDate = new \DateTime($endStr);
        } catch (\Exception $e) {
            return; // Dates invalides, on ne filtre pas
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        
        // Sous-requête pour trouver les bateaux déjà réservés (uniquement payés ou confirmés)
        $subQuery = $queryBuilder->getEntityManager()->createQueryBuilder()
            ->select('r_sub')
            ->from('App\Entity\Rental', 'r_sub')
            ->where('r_sub.boat = ' . $rootAlias)
            ->andWhere('r_sub.rentalStart < :endDate')
            ->andWhere('r_sub.rentalEnd > :startDate')
            ->andWhere('r_sub.status IN (:activeStatuses)');

        $queryBuilder
            ->andWhere($queryBuilder->expr()->not($queryBuilder->expr()->exists($subQuery->getDQL())))
            ->setParameter('startDate', $startDate)
            ->setParameter('endDate', $endDate)
            ->setParameter('activeStatuses', [
                \App\Entity\Rental::STATUS_PENDING, 
                \App\Entity\Rental::STATUS_CONFIRMED, 
                \App\Entity\Rental::STATUS_COMPLETED
            ]);
    }

    public function getDescription(string $resourceClass): array
    {
        return [
            'start' => [
                'property' => 'start',
                'type' => 'string',
                'required' => false,
                'description' => 'Date de début (YYYY-MM-DD)',
                'openapi' => [
                    'example' => '2024-06-01',
                    'allowReserved' => false,
                    'allowEmptyValue' => false,
                    'explode' => false,
                ],
            ],
            'end' => [
                'property' => 'end',
                'type' => 'string',
                'required' => false,
                'description' => 'Date de fin (YYYY-MM-DD)',
                'openapi' => [
                    'example' => '2024-06-08',
                    'allowReserved' => false,
                    'allowEmptyValue' => false,
                    'explode' => false,
                ],
            ],
        ];
    }
}
