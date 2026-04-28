<?php

namespace App\Controller;

use App\Entity\Team;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;

class TeamEmblemUploadController extends AbstractController
{
    #[Route('/api/teams/{id}/emblem', name: 'api_team_emblem_upload', methods: ['POST'])]
    #[IsGranted('TEAM_EDIT', subject: 'team')]
    public function __invoke(Team $team, Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): JsonResponse
    {
        try {
            /** @var UploadedFile $file */
            $file = $request->files->get('file');
            if (!$file) {
                return new JsonResponse(['message' => 'Aucun fichier envoyé.'], 400);
            }

            // 1. Déplacer le fichier
            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$extension;

            $uploadDir = $this->getParameter('kernel.project_dir').'/public/uploads/teams';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $file->move($uploadDir, $newFilename);

            // 2. Supprimer l'ancien emblème s'il existe
            if ($team->getEmblem()) {
                $oldFilePath = $uploadDir.'/'.$team->getEmblem();
                if (file_exists($oldFilePath)) {
                    unlink($oldFilePath);
                }
            }

            // 3. Mettre à jour l'entité
            $team->setEmblem($newFilename);
            $entityManager->flush();

            return new JsonResponse([
                'emblem' => $newFilename,
                'message' => 'Emblème mis à jour avec succès.'
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(['message' => 'Erreur Serveur: ' . $e->getMessage()], 500);
        }
    }
}
