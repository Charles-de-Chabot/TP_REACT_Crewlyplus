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

        try {
            $customer = Customer::create([
                'email' => 'user_' . uniqid() . '@test.com',
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

            // ✅ On crée manuellement le PaymentIntent sur la facture ouverte
            $paymentIntent = PaymentIntent::create([
                'amount'   => 2900,
                'currency' => 'eur',
                'customer' => $customer->id,
                'payment_method_types' => ['card'],
                'metadata' => [
                    'subscription_id' => $subscription->id,
                    'invoice_id'      => $invoiceId,
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
}