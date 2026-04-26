<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Innovice;
use App\Entity\Notification;
use App\Entity\Rental;
use App\Repository\RoleRepository;
use App\Repository\UserRepository;
use App\Repository\RentalRepository;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Stripe;
use Stripe\Webhook;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Controller to handle Stripe Webhooks.
 * Handles both Premium upgrades and Rental confirmations.
 */
class WebhookController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly RoleRepository $roleRepository,
        private readonly RentalRepository $rentalRepository,
        private readonly EntityManagerInterface $em,
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
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return new JsonResponse(['error' => 'Signature invalide.'], 400);
        } catch (\Exception $e) {
            // Fallback parsing if signature fails or SDK issue
            $data = json_decode($payload, true);
            if (!$data) {
                return new JsonResponse(['error' => 'Payload invalide.'], 400);
            }
            $type = $data['type'] ?? null;
        }

        if ($type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            $metadata = $paymentIntent->metadata;

            // --- Case A: Rental Confirmation ---
            if (isset($metadata->rental_id)) {
                $this->handleRentalConfirmation((int) $metadata->rental_id);
            } 
            // --- Case B: Premium Upgrade ---
            elseif (isset($metadata->user_id)) {
                $this->handlePremiumUpgrade((int) $metadata->user_id);
            }
        }

        if ($type === 'payment_intent.payment_failed') {
            $paymentIntent = $event->data->object;
            $metadata = $paymentIntent->metadata;

            if (isset($metadata->rental_id)) {
                $this->handleRentalFailure((int) $metadata->rental_id);
            }
        }

        return new JsonResponse(['status' => 'ok']);
    }

    /**
     * Confirms a rental and generates invoice/notification.
     */
    private function handleRentalConfirmation(int $rentalId): void
    {
        $rental = $this->rentalRepository->find($rentalId);
        if (!$rental) {
            return;
        }

        // 1. Update status to 'pending' (Paid, waiting for crew)
        $rental->setStatus(Rental::STATUS_PENDING);

        // 2. Create Invoice
        $invoice = new Innovice();
        $invoice->setUser($rental->getUser());
        $invoice->setInnovicePath(sprintf('invoice_%s_%d.pdf', date('Ymd'), $rental->getId()));
        $invoice->setCreatedAt(new \DateTime());
        $this->em->persist($invoice);

        // 3. Create Notification
        $boat = $rental->getBoat();
        $notification = new Notification();
        $notification->setUser($rental->getUser());
        $notification->setLabel(sprintf(
            'Votre réservation pour le bateau %s est confirmée !', 
            $boat ? $boat->getName() : 'sélectionné'
        ));
        $notification->setIsOpen(false);
        $notification->setCreatedAt(new \DateTime());
        $this->em->persist($notification);

        // 4. Notify Crew members
        $requestedRoles = $rental->getRequestedRoles() ?: [];
        $client = $rental->getUser();
        $usersToNotify = [];

        foreach ($requestedRoles as $roleLabel) {
            $eligibleUsers = $this->userRepository->findByRoleLabel($roleLabel);
            foreach ($eligibleUsers as $u) {
                // Skip the client themselves
                if ($u->getId() === $client->getId() || strtolower($u->getEmail()) === strtolower($client->getEmail())) {
                    continue;
                }
                if (!isset($usersToNotify[$u->getId()])) {
                    $usersToNotify[$u->getId()] = ['user' => $u, 'matchedRole' => $roleLabel];
                }
            }
        }

        foreach ($usersToNotify as $info) {
            $crewMember = $info['user'];
            $roleLabel = $info['matchedRole'];
            $roleDisplay = $roleLabel === 'ROLE_CAPITAINE' ? 'Capitaine' : ($roleLabel === 'ROLE_CHEF' ? 'Chef' : 'Hôtesse');

            $notif = new Notification();
            $notif->setUser($crewMember);
            $notif->setLabel(sprintf(
                'Nouvelle mission DISPONIBLE (%s) : %s demandée par %s du %s au %s',
                $roleDisplay,
                $boat?->getName() ?: 'Bateau',
                $client->getFirstname() . ' ' . $client->getNickname(),
                $rental->getRentalStart()->format('d/m/Y'),
                $rental->getRentalEnd()->format('d/m/Y')
            ));
            $notif->setIsOpen(false);
            $notif->setCreatedAt(new \DateTime());
            $this->em->persist($notif);
        }

        $this->em->flush();
    }

    /**
     * Upgrades a user to ROLE_PREMIUM.
     */
    private function handlePremiumUpgrade(int $userId): void
    {
        $user = $this->userRepository->find($userId);
        if (!$user) {
            return;
        }

        $premiumRole = $this->roleRepository->findOneBy(['label' => 'ROLE_PREMIUM']);
        if (!$premiumRole) {
            return;
        }

        $user->setRole($premiumRole);
        $this->em->flush();
    }

    /**
     * Handles payment failure for a rental.
     */
    private function handleRentalFailure(int $rentalId): void
    {
        $rental = $this->rentalRepository->find($rentalId);
        if (!$rental) {
            return;
        }

        $rental->setStatus(Rental::STATUS_CANCELLED);
        $this->em->flush();
    }
}