<?php

namespace App\Controller;

use App\Repository\TeamRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class JoinTeamController extends AbstractController
{
    public function __invoke(Request $request, TeamRepository $teamRepository, EntityManagerInterface $em, Security $security): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $inviteCode = $data['inviteCode'] ?? null;

        if (!$inviteCode) {
            return new JsonResponse(['message' => 'Le code d\'invitation est requis.'], 400);
        }

        $team = $teamRepository->findOneBy(['inviteCode' => $inviteCode]);

        if (!$team) {
            return new JsonResponse(['message' => 'Équipe introuvable pour ce code.'], 404);
        }

        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Utilisateur non connecté.'], 401);
        }

        // Ajouter l'utilisateur à l'équipe
        $team->addMember($user);
        $em->flush();

        return new JsonResponse([
            'message' => 'Vous avez rejoint l\'équipe avec succès.',
            'teamName' => $team->getName(),
            'teamId' => $team->getId()
        ], 200);
    }
}
