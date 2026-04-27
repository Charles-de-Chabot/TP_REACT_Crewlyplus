<?php

namespace App\Controller;

use App\Entity\Media;
use App\Security\Voter\TeamVoter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

#[AsController]
class MediaController extends AbstractController
{
    public function __construct(
        private ParameterBagInterface $parameterBag
    ) {
    }

    /**
     * Sert un fichier de manière sécurisée depuis le coffre-fort.
     */
    #[IsGranted(TeamVoter::DOC_VIEW, subject: 'media')]
    public function __invoke(Media $media): BinaryFileResponse
    {
        // On récupère le chemin de base du vault (configuré dans services.yaml ou par défaut)
        $vaultDir = $this->parameterBag->get('kernel.project_dir') . '/var/vault';
        $filePath = $vaultDir . '/' . $media->getMediaPath();

        if (!file_exists($filePath)) {
            throw $this->createNotFoundException("Le fichier n'existe pas dans le coffre-fort.");
        }

        $response = new BinaryFileResponse($filePath);
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            basename($media->getMediaPath())
        );

        return $response;
    }
}
