<?php

namespace App\Controller;

use App\Entity\Team;
use App\Service\RegistrationService;
use App\Security\Voter\TeamVoter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[AsController]
class RegistrationController extends AbstractController
{
    public function __construct(
        private RegistrationService $registrationService
    ) {
    }

    /**
     * Génère et télécharge le dossier d'inscription de l'équipe.
     */
    #[IsGranted(TeamVoter::EDIT, subject: 'team')] // Seul le leader peut générer le dossier
    public function __invoke(Team $team): BinaryFileResponse
    {
        $zipPath = $this->registrationService->generateRegistrationPackage($team);

        $response = new BinaryFileResponse($zipPath);
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            'dossier_inscription_' . $team->getId() . '.zip'
        );
        
        // Supprimer le fichier temporaire après l'envoi
        $response->deleteFileAfterSend(true);

        return $response;
    }
}
