<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\Stripe;
use Stripe\Account;
use Stripe\AccountLink;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class StripeOnboardingController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        #[Autowire('%env(STRIPE_SECRET_KEY)%')]
        private readonly string $stripeSecretKey,
        #[Autowire('%env(FRONTEND_URL)%')]
        private readonly string $frontendUrl
    ) {
    }

    #[Route('/api/stripe/onboarding', name: 'stripe_onboarding', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function __invoke(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 401);
        }

        Stripe::setApiKey($this->stripeSecretKey);

        try {
            // 1. Création du compte Stripe Connect si inexistant
            $stripeAccountId = $user->getStripeAccountId();
            if (!$stripeAccountId) {
                $account = Account::create([
                    'type' => 'express',
                    'email' => $user->getEmail(),
                    'capabilities' => [
                        'transfers' => ['requested' => true],
                    ],
                ]);
                $stripeAccountId = $account->id;
                $user->setStripeAccountId($stripeAccountId);
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            }

            // 2. Création du lien d'onboarding
            $accountLink = AccountLink::create([
                'account' => $stripeAccountId,
                'refresh_url' => $this->frontendUrl . '/crew/onboarding-refresh',
                'return_url' => $this->frontendUrl . '/crew/onboarding-success',
                'type' => 'account_onboarding',
            ]);

            return new JsonResponse(['url' => $accountLink->url]);

        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}
