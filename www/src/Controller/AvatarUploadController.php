<?php

namespace App\Controller;

use App\Entity\Media;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\Slugger\SluggerInterface;

class AvatarUploadController extends AbstractController
{
    #[Route('/api/users/avatar', name: 'api_user_avatar_upload', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function __invoke(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): JsonResponse
    {
        try {
            $user = $this->getUser();
            if (!$user instanceof User) {
                return new JsonResponse(['message' => 'Utilisateur non trouvé.'], 401);
            }

            /** @var UploadedFile $file */
            $file = $request->files->get('file');
            if (!$file) {
                return new JsonResponse(['message' => 'Aucun fichier envoyé. Reçu: ' . json_encode($request->files->all())], 400);
            }

            // 1. Déplacer le fichier
            $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename.'-'.uniqid().'.'.$extension;

            $uploadDir = $this->getParameter('kernel.project_dir').'/public/uploads/users';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $file->move($uploadDir, $newFilename);

            // 2. Supprimer les anciens avatars s'ils existent (base + fichier)
            foreach ($user->getMedia() as $oldMedia) {
                if ($oldMedia->getType() === 'avatar') {
                    $oldFilePath = $uploadDir.'/'.$oldMedia->getMediaPath();
                    if (file_exists($oldFilePath)) {
                        unlink($oldFilePath);
                    }
                    $entityManager->remove($oldMedia);
                }
            }

            // 3. Créer le nouveau Media
            $media = new Media();
            $media->setMediaPath($newFilename);
            $media->setType('avatar');
            $media->setUser($user);

            $entityManager->persist($media);
            $entityManager->flush();

            return new JsonResponse([
                'id' => $media->getId(),
                'mediaPath' => $newFilename,
                'message' => 'Avatar mis à jour avec succès.'
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'message' => 'Erreur Serveur: ' . $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}
