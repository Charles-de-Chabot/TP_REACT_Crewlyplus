<?php

namespace App\Controller;

use Stripe\Stripe;
use Stripe\Customer;
use Stripe\Subscription;
use Stripe\Invoice;
use Stripe\PaymentIntent;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class StripeController extends AbstractController
{
    #[Route('/api/create-subscription', name: 'app_stripe_subscription', methods: ['POST'])]
    public function createSubscription(Request $request): JsonResponse
    {
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non connecté.'], 401);
        }

        try {
            $customer = Customer::create([
                'email' => $user->getEmail(),
            ]);

            $subscription = Subscription::create([
                'customer' => $customer->id,
                'items' => [['price' => 'price_1TLR5bGpNFFeiWtxk09PBkeF']],
                'payment_behavior' => 'default_incomplete',
                'payment_settings' => [
                    'save_default_payment_method' => 'on_subscription',
                    'payment_method_types' => ['card'],
                ],
                'expand' => ['latest_invoice'],
            ]);

            $latestInvoice = $subscription->latest_invoice;
            $invoiceId = is_string($latestInvoice) ? $latestInvoice : $latestInvoice->id;

            $paymentIntent = PaymentIntent::create([
                'amount'   => 2900,
                'currency' => 'eur',
                'customer' => $customer->id,
                'payment_method_types' => ['card'],
                'metadata' => [
                    'subscription_id' => $subscription->id,
                    'invoice_id'      => $invoiceId,
                    'user_id'         => $user->getId(), // ✅ L'info cruciale pour le webhook
                ],
            ]);

            return new JsonResponse([
                'subscriptionId' => $subscription->id,
                'clientSecret'   => $paymentIntent->client_secret,
            ]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    #[Route('/api/premium/verify', name: 'app_stripe_premium_verify', methods: ['POST'])]
    public function verifyPremium(Request $request, \App\Repository\UserRepository $userRepository, \App\Repository\RoleRepository $roleRepository, \Doctrine\ORM\EntityManagerInterface $em): JsonResponse
    {
        Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);
        
        $data = json_decode($request->getContent(), true);
        $paymentIntentId = $data['paymentIntentId'] ?? null;

        if (!$paymentIntentId) {
            return new JsonResponse(['error' => 'ID de paiement manquant.'], 400);
        }

        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);

            if ($paymentIntent->status === 'succeeded') {
                /** @var \App\Entity\User $user */
                $user = $this->getUser();
                if (!$user) {
                    return new JsonResponse(['error' => 'Utilisateur non connecté.'], 401);
                }

                $premiumRole = $roleRepository->findOneBy(['label' => 'ROLE_PREMIUM']);
                if ($premiumRole) {
                    $user->setRole($premiumRole);
                    $em->flush();
                    return new JsonResponse(['status' => 'success', 'message' => 'Rôle mis à jour.']);
                }
            }

            return new JsonResponse(['status' => 'pending', 'message' => 'Paiement non encore validé par Stripe.']);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}