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
        
        // Stratégie de poste : 
        // 1. On regarde si l'utilisateur a déjà un poste défini sur son profil
        // 2. On cherche l'entité Position correspondante
        // 3. Sinon on prend "Équipier" par défaut
        $positionRepo = $em->getRepository(\App\Entity\Position::class);
        $userPosLabel = $user->getPosition();
        $targetPos = null;

        if ($userPosLabel) {
            $targetPos = $positionRepo->findOneBy(['label' => $userPosLabel]);
        }

        if (!$targetPos) {
            $targetPos = $positionRepo->findOneBy(['label' => 'Équipier']);
        }

        if ($targetPos) {
            foreach ($team->getMemberships() as $membership) {
                if ($membership->getUser() === $user && !$membership->getLeftAt()) {
                    $membership->setPosition($targetPos);
                    // On harmonise le profil utilisateur au cas où (ex: si on a pris Équipier par défaut)
                    $user->setPosition($targetPos->getLabel());
                }
            }
        }
        
        $em->flush();

        return new JsonResponse([
            'message' => 'Vous avez rejoint l\'équipe avec succès.',
            'teamName' => $team->getName(),
            'teamId' => $team->getId()
        ], 200);
    }
}
