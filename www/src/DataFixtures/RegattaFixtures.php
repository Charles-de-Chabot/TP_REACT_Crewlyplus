<?php

namespace App\DataFixtures;

use App\Entity\Regatta;
use App\Entity\Team;
use App\Entity\User;
use App\Entity\SailingProfile;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;

class RegattaFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $regattasData = [
            [
                'name' => 'Spi Ouest-France Banque Populaire',
                'location' => 'La Trinité-sur-Mer, Bretagne (Atlantique)',
                'startDate' => new \DateTime('2026-04-03'),
                'endDate' => new \DateTime('2026-04-06'),
                'description' => "Le pèlerinage printanier de la voile française. Un mélange unique où les champions olympiques croisent les amateurs passionnés sur les pontons de la Trinité. L'Ambiance : L'effervescence est totale, de la préparation matinale au debriefing festif du soir. Le Challenge Technique : La Baie de Quiberon offre un terrain de jeu tactique complexe avec des effets de courant et de côte permanents. L'Avis de l'Expert : C'est LA régate test pour vos JPK 10.10 et J/99. Si vous gagnez ici, vous gagnez partout.",
                'price' => 475.0, // Moyenne de 350-600
            ],
            [
                'name' => 'SNIM (Semaine Nautique Internationale de Méditerranée)',
                'location' => 'Marseille, Vieux-Port (Méditerranée)',
                'startDate' => new \DateTime('2026-04-03'),
                'endDate' => new \DateTime('2026-04-06'),
                'description' => "Le coup d'envoi magistral de la saison méditerranéenne. Départ mythique au pied du Mucem. Marseille offre une lumière unique et un accueil chaleureux. Le Challenge Technique : La rade de Marseille est capricieuse. On peut passer d'un Mistral déchaîné à une petite brise thermique très instable en quelques minutes. L'Avis de l'Expert : Une régate physique et rapide. Votre Farr 40 y trouvera des conditions idéales pour exprimer sa puissance au près.",
                'price' => 375.0, // Moyenne de 250-500
            ],
            [
                'name' => 'Loro Piana Giraglia',
                'location' => 'Saint-Tropez (France) -> Gênes (Italie)',
                'startDate' => new \DateTime('2026-06-11'),
                'endDate' => new \DateTime('2026-06-17'),
                'description' => "Le monument offshore entre la France et l'Italie. Le summum de l'élégance offshore. Les plus beaux Maxis du monde se retrouvent pour une semaine de fête à Saint-Tropez avant le grand départ vers l'Italie. Le Challenge Technique : La navigation de nuit autour du rocher de la Giraglia est un moment mystique et stratégique crucial pour la victoire. L'Avis de l'Expert : Le Nautor Swan 45 est né pour cette course. C'est le mélange parfait de confort en mer et de performance pure sur de longues distances.",
                'price' => 625.0, // Moyenne de 400-850
            ],
            [
                'name' => 'Rolex Swan Cup',
                'location' => 'Porto Cervo, Sardaigne (Italie)',
                'startDate' => new \DateTime('2026-09-13'),
                'endDate' => new \DateTime('2026-09-19'),
                'description' => "L'exclusivité absolue dans le sanctuaire de Porto Cervo. Un événement hors norme organisé par le Yacht Club Costa Smeralda. Le luxe italien rencontre la perfection finlandaise. Le Challenge Technique : Le passage de 'Bomb Alley', un chenal étroit entre les îles où le vent s'engouffre avec force, exigeant des manœuvres millimétrées. L'Avis de l'Expert : Une compétition 'monotype' pour vos Swan 45. C'est ici que se joue la suprématie mondiale de la classe.",
                'price' => 1200.0,
            ],
            [
                'name' => 'Les Voiles de Saint-Tropez',
                'location' => 'Saint-Tropez (Méditerranée)',
                'startDate' => new \DateTime('2026-09-26'),
                'endDate' => new \DateTime('2026-10-04'),
                'description' => "La réunion de famille la plus spectaculaire du yachting mondial. C'est le festival de Cannes de la voile. Le port de Saint-Tropez devient un musée à ciel ouvert. Le Challenge Technique : Gérer le trafic intense sur la ligne de départ et naviguer dans les petits airs d'automne avec finesse. L'Avis de l'Expert : Pour le Grand Soleil 37 ou le Farr 40, c'est l'occasion de briller par son esthétique et ses performances devant les yeux du monde entier.",
                'price' => 750.0, // Moyenne de 500-1000
            ],
            [
                'name' => 'Copa del Rey MAPFRE',
                'location' => 'Palma de Majorque, Baléares (Espagne)',
                'startDate' => new \DateTime('2026-08-01'),
                'endDate' => new \DateTime('2026-08-08'),
                'description' => "Le temple de la performance sous le vent des Baléares. Une organisation royale. Le roi d'Espagne y participe souvent. Le Challenge Technique : 'L'Embat' : le vent thermique local qui se lève chaque jour à 13h00 précise. L'Avis de l'Expert : C'est le terrain de jeu favori des J/99. Rapide et agile, ce bateau excelle dans les conditions stables de Palma.",
                'price' => 900.0, // Moyenne de 600-1200
            ],
        ];

        foreach ($regattasData as $data) {
            $regatta = new Regatta();
            $regatta->setName($data['name']);
            $regatta->setLocation($data['location']);
            $regatta->setStartDate($data['startDate']);
            $regatta->setEndDate($data['endDate']);
            $regatta->setDescription($data['description']);
            $regatta->setRegistrationPrice($data['price']);
            $manager->persist($regatta);

            // Créer une team pour chaque régate
            $team = new Team();
            $team->setName('Team ' . explode(' ', $regatta->getName())[0] . ' Elite');
            $team->setRegatta($regatta);
            
            // On récupère Charles Premium comme leader
            $charles = $this->getReference('user_premium', User::class);
            $team->setLeader($charles);
            $manager->persist($team);

            // Inscrire Charles à la régate
            $regatta->addParticipant($charles);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            AppFixtures::class,
        ];
    }
}
