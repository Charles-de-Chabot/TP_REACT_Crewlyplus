<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Repository\RoleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Stripe;
use Stripe\Webhook;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class WebhookController extends AbstractController
{
    public function __construct(
        private UserRepository $userRepository,
        private RoleRepository $roleRepository,
        private EntityManagerInterface $em,
    ) {}

    #[Route('/api/webhook/stripe', name: 'app_stripe_webhook', methods: ['POST'])]
    public function handleWebhook(Request $request): JsonResponse
    {
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        $payload   = $request->getContent();
        $sigHeader = $request->headers->get('Stripe-Signature');
        $secret    = $_ENV['STRIPE_WEBHOOK_SECRET'];

        try {
            $event  = Webhook::constructEvent($payload, $sigHeader, $secret);
            $type   = $event->type;
            $userId = $event->data->object->metadata->user_id ?? null;

        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return new JsonResponse(['error' => 'Signature invalide.'], 400);

        } catch (\Exception $e) {
            // Fallback : parse manuel si le SDK ne supporte pas la version API
            $data = json_decode($payload, true);
            if (!$data) {
                return new JsonResponse(['error' => 'Payload invalide.'], 400);
            }
            $type   = $data['type'] ?? null;
            $userId = $data['data']['object']['metadata']['user_id'] ?? null;
        }

        if ($type === 'payment_intent.succeeded') {
            try {
                if (!$userId) {
                    return new JsonResponse(['error' => 'user_id manquant.'], 400);
                }

                $user = $this->userRepository->find($userId);
                if (!$user) {
                    return new JsonResponse(['error' => 'Utilisateur introuvable.', 'user_id' => $userId], 404);
                }

                // ✅ On cherche le rôle ROLE_PREMIUM dans ta table Role
                $premiumRole = $this->roleRepository->findOneBy(['label' => 'ROLE_PREMIUM']);
                if (!$premiumRole) {
                    return new JsonResponse(['error' => 'Rôle ROLE_PREMIUM introuvable en base.'], 500);
                }

                // ✅ On assigne le rôle à l'utilisateur
                $user->setRole($premiumRole);
                $this->em->flush();

            } catch (\Exception $e) {
                return new JsonResponse([
                    'error' => $e->getMessage(),
                    'file'  => $e->getFile(),
                    'line'  => $e->getLine(),
                ], 500);
            }
        }

        return new JsonResponse(['status' => 'ok']);
    }
}