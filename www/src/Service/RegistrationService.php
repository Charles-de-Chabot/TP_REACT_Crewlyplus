<?php

namespace App\Service;

use App\Entity\Team;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;
use ZipArchive;

class RegistrationService
{
    public function __construct(
        private ParameterBagInterface $parameterBag
    ) {
    }

    /**
     * Génère un dossier d'inscription complet au format ZIP.
     */
    public function generateRegistrationPackage(Team $team): string
    {
        $zip = new ZipArchive();
        $vaultDir = $this->parameterBag->get('kernel.project_dir') . '/var/vault';
        $tempDir = $this->parameterBag->get('kernel.project_dir') . '/var/tmp';
        
        if (!is_dir($tempDir)) {
            mkdir($tempDir, 0777, true);
        }

        $zipFileName = $tempDir . '/inscription_' . str_replace(' ', '_', $team->getName()) . '.zip';

        if ($zip->open($zipFileName, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new \RuntimeException("Impossible de créer le fichier ZIP.");
        }

        // 1. Création d'un récapitulatif global
        $recap = [
            'team_name' => $team->getName(),
            'regatta' => $team->getRegatta()->getName(),
            'leader' => $team->getLeader()->getFirstname() . ' ' . $team->getLeader()->getLastname(),
            'members' => []
        ];

        foreach ($team->getMembers() as $member) {
            $profile = $member->getSailingProfile();
            $memberData = [
                'name' => $member->getFirstname() . ' ' . $member->getLastname(),
                'email' => $member->getEmail(),
                'miles' => $profile?->getMilesSailed() ?? 0,
                'position' => $profile?->getCurrentPosition() ?? 'Équipier',
            ];
            $recap['members'][] = $memberData;

            // 2. Ajout des documents de chaque membre
            foreach ($member->getMedia() as $media) {
                // On ne prend que les documents du coffre-fort (pas les photos de bateaux)
                if (in_array($media->getType(), ['IDENTITY', 'LICENSE', 'MEDICAL'])) {
                    $filePath = $vaultDir . '/' . $media->getMediaPath();
                    if (file_exists($filePath)) {
                        $zip->addFile($filePath, 'membres/' . $member->getLastname() . '/' . $media->getType() . '_' . basename($media->getMediaPath()));
                    }
                }
            }
        }

        $zip->addFromString('recapitulatif_equipe.json', json_encode($recap, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $zip->close();

        return $zipFileName;
    }
}
