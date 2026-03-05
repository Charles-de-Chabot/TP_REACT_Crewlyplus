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
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstname' => $user->getFirstname(),
            'nickname' => $user->getNickname(),
        ]);
    }
}
