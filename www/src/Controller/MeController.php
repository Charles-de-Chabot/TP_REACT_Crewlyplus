<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class MeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function __invoke(): JsonResponse
    {
        try {
            $user = $this->getUser();

            if (!$user instanceof User) {
                return new JsonResponse(['message' => 'Utilisateur non authentifié ou invalide.'], 401);
            }

            // Préparation des données de base
            $data = [
                'id'        => $user->getId(),
                'email'     => $user->getEmail(),
                'firstname'   => $user->getFirstname(),
                'lastname'    => $user->getLastname(),
                'nickname'    => $user->getNickname(),
                'phoneNumber' => $user->getPhoneNumber(),
                'position'    => $user->getPosition(),
                'roles'       => $user->getRoles(),
                'roleLabel'   => $user->getRoleLabel(),
            ];

            // Adresse
            $address = $user->getAddress();
            $data['address'] = $address ? [
                'id'           => $address->getId(),
                'houseNumber'  => $address->getHouseNumber(),
                'streetName'   => $address->getStreetName(),
                'postcode'     => $address->getPostcode(),
                'city'         => $address->getCity(),
            ] : null;

            // Rentals
            $data['rentals'] = [];
            foreach ($user->getRentals() as $r) {
                $data['rentals'][] = [
                    'id'          => $r->getId(),
                    'rentalStart' => $r->getRentalStart() ? $r->getRentalStart()->format('c') : null,
                    'rentalEnd'   => $r->getRentalEnd() ? $r->getRentalEnd()->format('c') : null,
                    'rentalPrice' => $r->getRentalPrice(),
                    'status'      => $r->getStatus(),
                    'boat'        => $r->getBoat() ? [
                        'id'   => $r->getBoat()->getId(),
                        'name' => $r->getBoat()->getName(),
                    ] : null,
                    'requestedRoles' => $r->getRequestedRoles(),
                    'crewMembers'    => array_map(fn($u) => [
                        'id'        => $u->getId(),
                        'firstname' => $u->getFirstname(),
                        'roleLabel' => $u->getRoleLabel()
                    ], $r->getCrewMembers()->toArray())
                ];
            }

            // Invoices
            $data['innovices'] = [];
            foreach ($user->getInnovices() as $i) {
                $data['innovices'][] = [
                    'id'           => $i->getId(),
                    'innovicePath' => $i->getInnovicePath(),
                    'createdAt'    => $i->getCreatedAt() ? $i->getCreatedAt()->format('c') : null,
                ];
            }

            // Media
            $data['media'] = [];
            foreach ($user->getMedia() as $m) {
                $data['media'][] = [
                    'id'         => $m->getId(),
                    'media_path' => $m->getMediaPath(),
                    'type'       => $m->getType(),
                ];
            }

            // Team Actuelle
            $currentTeam = $user->getCurrentTeam();
            $data['currentTeam'] = $currentTeam ? [
                'id' => $currentTeam->getId(),
                'name' => $currentTeam->getName(),
                'emblem' => $currentTeam->getEmblem(),
            ] : null;

            // Sailing Profile
            $sailingProfile = $user->getSailingProfile();
            $data['sailingProfile'] = $sailingProfile ? [
                'id' => $sailingProfile->getId(),
                'milesSailed' => $sailingProfile->getMilesSailed(),
                'boatTypes' => $sailingProfile->getBoatTypes(),
                'achievements' => $sailingProfile->getAchievements(),
                'currentPosition' => $sailingProfile->getCurrentPosition(),
            ] : null;

            // Memberships & CV Historique
            $data['memberships'] = [];
            foreach ($user->getMemberships() as $m) {
                $team = $m->getTeam();
                $teamData = null;
                if ($team) {
                    $registrations = [];
                    try {
                        $regCollection = $team->getRegistrations();
                        if ($regCollection && (is_array($regCollection) || $regCollection instanceof \Traversable)) {
                            $count = 0;
                            foreach ($regCollection as $reg) {
                                if ($count++ > 50) break; // Sécurité volume
                                
                                try {
                                    $regatta = $reg->getRegatta();
                                    if (!$regatta) continue;

                                    $registrations[] = [
                                        'id' => $reg->getId(),
                                        'status' => $reg->getStatus(),
                                        'finalPosition' => $reg->getFinalPosition(),
                                        'regatta' => [
                                            'id' => $regatta->getId(),
                                            'name' => $regatta->getName(),
                                            'startDate' => ($regatta->getStartDate() instanceof \DateTimeInterface) 
                                                ? $regatta->getStartDate()->format('c') 
                                                : null,
                                            'location' => $regatta->getLocation(),
                                        ],
                                        'dailyStats' => array_map(fn($s) => [
                                            'id' => $s->getId(),
                                            'dayNumber' => $s->getDayNumber(),
                                            'ranking' => $s->getRanking(),
                                            'avgSpeed' => $s->getAvgSpeed(),
                                            'maxSpeed' => $s->getMaxSpeed(),
                                            'milesSailed' => $s->getMilesSailed(),
                                            'upwindAngle' => $s->getUpwindAngle(),
                                            'seaState' => $s->getSeaState(),
                                            'incidents' => $s->getIncidents(),
                                            'sailConfig' => $s->getSailConfig(),
                                            'protests' => $s->getProtests(),
                                            'windConditions' => $s->getWindConditions(),
                                            'notes' => $s->getNotes(),
                                        ], $reg->getDailyStats()->toArray())
                                    ];
                                } catch (\Throwable $e) {
                                    // On ignore une régate qui pose problème individuellement
                                    continue;
                                }
                            }
                        }
                    } catch (\Throwable $e) {
                        // On ignore le palmarès si la collection elle-même pose problème
                    }

                    $teamData = [
                        'id' => $team->getId(),
                        'name' => $team->getName(),
                        'registrations' => $registrations,
                    ];
                }

                $data['memberships'][] = [
                    'id' => $m->getId(),
                    'team' => $teamData,
                    'position' => $m->getPosition() ? [
                        'id' => $m->getPosition()->getId(),
                        'label' => $m->getPosition()->getLabel(),
                    ] : null,
                    'leftAt' => $m->getLeftAt() ? $m->getLeftAt()->format('c') : null,
                ];
            }

            return new JsonResponse($data);

        } catch (\Throwable $e) {
            return new JsonResponse([
                'message' => 'Internal Server Error',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}
