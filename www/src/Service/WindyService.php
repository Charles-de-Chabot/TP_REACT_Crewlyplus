<?php

namespace App\Service;

use App\Entity\Regatta;
use Symfony\Component\DependencyInjection\ParameterBag\ParameterBagInterface;

class WindyService
{
    private string $apiKey;

    public function __construct(
        private ParameterBagInterface $parameterBag
    ) {
        // À configurer dans services.yaml ou .env : WINDY_API_KEY
        $this->apiKey = $this->parameterBag->get('windy_api_key') ?? 'VOTRE_CLE_WINDY_ICI';
    }

    /**
     * Récupère les données météo brutes via l'API Windy Point Forecast.
     */
    public function getForecast(Regatta $regatta): array
    {
        if (!$regatta->getLatitude() || !$regatta->getLongitude()) {
            return ['error' => 'Coordonnées GPS manquantes pour cette régate.'];
        }

        $url = "https://api.windy.com/api/point-forecast/v2";
        
        $data = [
            'lat' => $regatta->getLatitude(),
            'lon' => $regatta->getLongitude(),
            'model' => 'gfs', // ou 'ecmwf' pour plus de précision (payant)
            'parameters' => ['wind', 'gust', 'precip', 'temp'],
            'levels' => ['surface'],
            'key' => $this->apiKey
        ];

        // Simulation de l'appel API (Mock si pas de clé)
        if ($this->apiKey === 'VOTRE_CLE_WINDY_ICI') {
            return [
                'status' => 'mock',
                'wind_speed' => 12, // nœuds
                'wind_direction' => 240, // Sud-Ouest
                'gust' => 18,
                'message' => 'Configurez une clé Windy réelle pour avoir les vraies données.'
            ];
        }

        // Logique réelle avec file_get_contents ou curl
        $options = [
            'http' => [
                'header'  => "Content-type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data)
            ]
        ];
        $context  = stream_context_create($options);
        $result = file_get_contents($url, false, $context);

        return $result ? json_decode($result, true) : ['error' => 'Échec de l\'appel Windy API'];
    }

    /**
     * Génère l'URL de l'Iframe Windy pour le frontend.
     */
    public function getIframeUrl(Regatta $regatta): string
    {
        $lat = $regatta->getLatitude() ?? 43.29;
        $lon = $regatta->getLongitude() ?? 5.36;
        
        // URL de base Windy pour Iframe
        return sprintf(
            "https://www.windy.com/?%f,%f,10",
            $lat,
            $lon
        );
    }
}
