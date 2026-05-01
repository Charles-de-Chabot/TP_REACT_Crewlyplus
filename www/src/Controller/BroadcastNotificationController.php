<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class BroadcastNotificationController extends AbstractController
{
    public function __invoke(Request $request, UserRepository $userRepository, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $message = $data['message'] ?? null;
        $type = $data['type'] ?? 'info';
        $audience = $data['audience'] ?? 'all';

        if (!$message) {
            return new JsonResponse(['error' => 'Message is required'], 400);
        }

        $users = [];
        if ($audience === 'premium') {
            $users = $userRepository->findBy(['role' => 2]); // Hypothèse: ROLE_PREMIUM id is 2
        } else {
            $users = $userRepository->findAll();
        }

        foreach ($users as $user) {
            $notification = new Notification();
            $notification->setLabel($message);
            $notification->setUser($user);
            $notification->setIsOpen(false);
            $notification->setMetadata(['type' => $type, 'broadcast' => true]);
            $em->persist($notification);
        }

        $em->flush();

        return new JsonResponse(['status' => 'success', 'count' => count($users)]);
    }
}
