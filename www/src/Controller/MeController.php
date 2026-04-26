<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class MeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function __invoke(): JsonResponse
    {
        $user = $this->getUser();

        // L'attribut #[IsGranted] devrait empêcher ce cas, mais c'est une bonne pratique
        // de s'assurer qu'on a bien le bon objet User.
        if (!$user instanceof User) {
            // Ce cas ne devrait pas être atteint si la sécurité est bien configurée.
            return new JsonResponse(['message' => 'Utilisateur non authentifié ou invalide.'], 401);
        }

        return new JsonResponse([
            'id'        => $user->getId(),
            'email'     => $user->getEmail(),
            'firstname'   => $user->getFirstname(),
            'lastname'    => $user->getLastname(),
            'nickname'    => $user->getNickname(),
            'phoneNumber' => $user->getPhoneNumber(),
            'position'    => $user->getPosition(),
            'address'     => $user->getAddress() ? [
                'id'           => $user->getAddress()->getId(),
                'houseNumber'  => $user->getAddress()->getHouseNumber(),
                'streetName'   => $user->getAddress()->getStreetName(),
                'postcode'     => $user->getAddress()->getPostcode(),
                'city'         => $user->getAddress()->getCity(),
            ] : null,
            'roles'       => $user->getRoles(),
            'roleLabel'   => $user->getRoleLabel(),
            'rentals'   => array_map(fn($r) => [
                'id'          => $r->getId(),
                'rentalStart' => $r->getRentalStart()->format(\DateTimeInterface::ATOM),
                'rentalEnd'   => $r->getRentalEnd()->format(\DateTimeInterface::ATOM),
                'rentalPrice' => $r->getRentalPrice(),
                'status'      => $r->getStatus(),
                'boat'        => [
                    'id'   => $r->getBoat()?->getId(),
                    'name' => $r->getBoat()?->getName(),
                ],
                'requestedRoles' => $r->getRequestedRoles(),
                'crewMembers'    => array_map(fn($u) => [
                    'id'        => $u->getId(),
                    'firstname' => $u->getFirstname(),
                    'roleLabel' => $u->getRoleLabel()
                ], $r->getCrewMembers()->toArray())
            ], $user->getRentals()->toArray()),
            'innovices' => array_map(fn($i) => [
                'id'           => $i->getId(),
                'innovicePath' => $i->getInnovicePath(),
                'createdAt'    => $i->getCreatedAt()->format(\DateTimeInterface::ATOM),
            ], $user->getInnovices()->toArray()),
            'media' => array_map(fn($m) => [
                'id'         => $m->getId(),
                'media_path' => $m->getMediaPath(),
                'type'       => $m->getType(),
            ], $user->getMedia()->toArray()),
        ]);
    }
}
