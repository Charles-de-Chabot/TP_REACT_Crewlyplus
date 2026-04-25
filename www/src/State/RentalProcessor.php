<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Rental;
use App\Repository\RentalRepository;
use App\Service\PriceCalculatorService;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;

/**
 * Processor for creating a Rental.
 * 
 * Flow:
 * 1. Validate boat availability.
 * 2. Recalculate price on server.
 * 3. Validate price coherence with client.
 * 4. Create Stripe PaymentIntent.
 * 5. Persist rental with 'pending' status.
 */
class RentalProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly RentalRepository $rentalRepository,
        private readonly PriceCalculatorService $priceCalculator,
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
        $boat = $data->getBoat()->first(); // Rental has a OneToMany relation to Boat in this project
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
            $data->getCrewMembers()->toArray()
        );

        // 3. Price coherence check (1€ tolerance)
        if (abs($calculatedPrice - $data->getRentalPrice()) > 1.0) {
            throw new UnprocessableEntityHttpException(sprintf(
                'Price mismatch. Server calculated %.2f, received %.2f.',
                $calculatedPrice,
                $data->getRentalPrice()
            ));
        }

        // Ensure we use the server calculated price
        $data->setRentalPrice($calculatedPrice);
        $data->setStatus(Rental::STATUS_PENDING);

        // 4. Stripe PaymentIntent
        Stripe::setApiKey($this->stripeSecretKey);
        
        try {
            $paymentIntent = PaymentIntent::create([
                'amount' => (int) ($calculatedPrice * 100), // In cents
                'currency' => 'eur',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'metadata' => [
                    'rental_id' => null, // Will be updated after persist or use a temporary ID
                ],
            ]);
        } catch (\Exception $e) {
            throw new UnprocessableEntityHttpException('Stripe Error: ' . $e->getMessage());
        }

        // 5. Persist the rental
        // We persist first to get an ID for the Stripe metadata update if needed,
        // or we just return the clientSecret.
        $result = $this->persistProcessor->process($data, $operation, $uriVariables, $context);

        // Update Stripe metadata with the real rental ID
        try {
            PaymentIntent::update($paymentIntent->id, [
                'metadata' => ['rental_id' => $data->getId()]
            ]);
        } catch (\Exception $e) {
            // Log error but don't break the flow as the rental is created
        }

        // 6. Return response with Stripe client secret
        // Note: API Platform expects the entity as return by default. 
        // If we want a custom response, we should use a DTO or wrap the result.
        // However, for this task, we will add the clientSecret to the Rental entity 
        // as a non-persistent property for the response.
        
        $data->stripeClientSecret = $paymentIntent->client_secret;

        return $result;
    }
}
