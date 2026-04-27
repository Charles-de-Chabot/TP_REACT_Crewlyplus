<?php

namespace App\MessageHandler;

use App\Message\WindShiftAlert;
use App\Repository\RegattaRepository;
use App\Service\WindyService;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class WindShiftAlertHandler
{
    public function __construct(
        private RegattaRepository $regattaRepository,
        private WindyService $windyService
    ) {
    }

    public function __invoke(WindShiftAlert $message)
    {
        $regatta = $this->regattaRepository->find($message->getRegattaId());
        if (!$regatta) {
            return;
        }

        // On récupère les prévisions Windy
        $forecast = $this->windyService->getForecast($regatta);

        // Logique de détection de bascule de vent (Exemple simplifié)
        // Si la direction du vent change de plus de 30 degrés par rapport à la normale...
        
        $this->sendNotification($regatta, $forecast);
    }

    private function sendNotification($regatta, $forecast)
    {
        // Ici, on utiliserait le Mailer ou un service de SMS
        // Pour l'instant, on simule l'envoi
        $logMessage = sprintf(
            "ALERTE METEO : Bascule de vent détectée pour la régate %s. Vent actuel : %d° à %d nœuds.",
            $regatta->getName(),
            $forecast['wind_direction'] ?? 0,
            $forecast['wind_speed'] ?? 0
        );

        // On pourrait écrire dans un log ou une entité Notification
        file_put_contents('var/log/regatta_alerts.log', $logMessage . PHP_EOL, FILE_APPEND);
    }
}
