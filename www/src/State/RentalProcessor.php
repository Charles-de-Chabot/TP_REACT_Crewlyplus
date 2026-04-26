<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Rental;
use App\Entity\Notification;
use App\Repository\RentalRepository;
use App\Service\PriceCalculatorService;
use Doctrine\ORM\EntityManagerInterface;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Processor for creating a Rental.
 */
class RentalProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly RentalRepository $rentalRepository,
        private readonly PriceCalculatorService $priceCalculator,
        private readonly EntityManagerInterface $entityManager,
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private readonly ProcessorInterface $persistProcessor,
        #[Autowire('%env(STRIPE_SECRET_KEY)%')]
        private readonly string $stripeSecretKey
    ) {
    }

    /**
     * @param Rental $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        // 1. Availability check
        $boat = $data->getBoat();
        if (!$boat) {
            throw new UnprocessableEntityHttpException('A boat must be selected.');
        }

        $isAvailable = $this->rentalRepository->isBoatAvailable(
            $boat,
            $data->getRentalStart(),
            $data->getRentalEnd()
        );

        if (!$isAvailable) {
            throw new UnprocessableEntityHttpException('The boat is not available for the selected dates.');
        }

        // 2. Recalculate price
        $calculatedPrice = $this->priceCalculator->calculate(
            $boat,
            $data->getUser(),
            $data->getRentalStart(),
            $data->getRentalEnd(),
            $data->getFitting()->toArray(),
            $data->getFormulas()->toArray(),
            $data->getCrewMembers()->toArray(),
            $data->getRequestedRoles()
        );

        // 3. Price coherence check
        if (abs($calculatedPrice - $data->getRentalPrice()) > 1.0) {
            throw new UnprocessableEntityHttpException(sprintf(
                'Price mismatch. Server calculated %.2f, received %.2f.',
                $calculatedPrice,
                $data->getRentalPrice()
            ));
        }

        $data->setRentalPrice($calculatedPrice);
        $data->setStatus(Rental::STATUS_CREATED);

        // 4. Stripe PaymentIntent
        Stripe::setApiKey($this->stripeSecretKey);
        
        $nbDays = $this->priceCalculator->calculateNbDays($data->getRentalStart(), $data->getRentalEnd());
        
        $client = $data->getUser();
        $clientName = $client->getFirstname() . ' ' . $client->getLastname();
        $boatAddress = $boat->getAddress();
        $location = $boatAddress ? $boatAddress->getCity() : 'Lieu non défini';

        // --- Create/Get Stripe Customer (Like Premium Flow) ---
        try {
            $customer = \Stripe\Customer::create([
                'email' => $client->getEmail(),
                'name'  => $clientName,
                'metadata' => [
                    'user_id' => (string) $client->getId(),
                ]
            ]);
        } catch (\Exception $e) {
            // If customer creation fails, we can still proceed with the payment intent without a customer
            $customer = null;
        }

        $metadata = [
            'client_id'   => (string) $client->getId(),
            'user_id'     => (string) $client->getId(), // Consistent with Premium flow
            'client_name' => $clientName,
            'boat'        => $boat->getName(),
            'dates'       => $data->getRentalStart()->format('d/m/Y') . ' - ' . $data->getRentalEnd()->format('d/m/Y'),
            'duration'    => $nbDays . ' jours',
            'total'       => $calculatedPrice . ' €',
        ];

        if ($data->getFitting()->count() > 0) {
            $fittings = array_map(fn($f) => $f->getLabel() . ' (' . $f->getFittingPrice() . '€)', $data->getFitting()->toArray());
            $metadata['details_fittings'] = implode(' | ', $fittings);
        }

        if ($data->getCrewMembers()->count() > 0) {
            $crew = array_map(fn($u) => $u->getRoleLabel(), $data->getCrewMembers()->toArray());
            $metadata['details_crew'] = implode(' | ', $crew);
        } elseif (!empty($data->getRequestedRoles())) {
            $metadata['details_requested_crew'] = implode(' | ', $data->getRequestedRoles());
        }

        try {
            $paymentParams = [
                'amount' => (int) ($calculatedPrice * 100),
                'currency' => 'eur',
                'payment_method_types' => ['card'],
                'metadata' => $metadata,
            ];

            if ($customer) {
                $paymentParams['customer'] = $customer->id;
            }

            $paymentIntent = PaymentIntent::create($paymentParams);
        } catch (\Exception $e) {
            throw new UnprocessableEntityHttpException('Stripe Error: ' . $e->getMessage());
        }

        $data->setPaymentIntentId($paymentIntent->id);

        // 5. Persist the rental
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        $this->entityManager->flush();

        // 7. Update Stripe metadata with the real rental ID
        try {
            PaymentIntent::update($paymentIntent->id, [
                'metadata' => array_merge($metadata, ['rental_id' => (string) $data->getId()])
            ]);
        } catch (\Exception $e) { }

        $data->stripeClientSecret = $paymentIntent->client_secret;

        return $data;
    }
}
