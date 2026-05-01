<?php

declare(strict_types=1);

namespace App\Service;

use App\Entity\Boat;
use App\Entity\Fitting;
use App\Entity\Formula;
use App\Entity\User;

/**
 * Service responsible for calculating the total price of a rental.
 *
 * Business Rules:
 * - Premium members (ROLE_PREMIUM) get a 15% discount on the boat price IF the boat is marked as "used" (Regatta).
 * - Price is calculated based on daily price or weekly price if the duration is 7 days or more.
 * - Total = ((BasePrice * Discount) * NbDays) + Sum(FittingPrices) + Sum(FormulaPrices)
 */
class PriceCalculatorService
{
    public const PREMIUM_DISCOUNT = 0.85; // -15%

    /**
     * Calculates the total price of a rental.
     *
     * @param Boat $boat The boat being rented
     * @param User $user The user renting the boat (to check for Premium role)
     * @param \DateTimeInterface $start Start date of the rental
     * @param \DateTimeInterface $end End date of the rental
     * @param Fitting[] $fittings Optional fittings added to the rental
     * @param Formula[] $formulas Optional formulas added to the rental
     * @param User[] $crewMembers Professional crew members added to the rental (assigned)
     * @param string[] $requestedRoles Roles requested by the customer (not yet assigned)
     * @return float The calculated total price
     */
    public function calculate(
        Boat $boat,
        User $user,
        \DateTimeInterface $start,
        \DateTimeInterface $end,
        array $fittings = [],
        array $formulas = [],
        array $crewMembers = [],
        array $requestedRoles = []
    ): float {
        $nbDays = $this->calculateNbDays($start, $end);

        if ($nbDays <= 0) {
            return 0.0;
        }

        // 1. Calculate Base Price (Day vs Week)
        $basePrice = $this->calculateBaseBoatPrice($boat, $nbDays);

        // 2. Apply Premium/Regatta Discount
        if ($this->isEligibleForPremiumDiscount($user, $boat)) {
            $basePrice *= self::PREMIUM_DISCOUNT;
        }

        // 3. Add Formulas (Fixed price per formula)
        $formulasTotal = 0.0;
        foreach ($formulas as $formula) {
            $formulasTotal += $formula->getFormulaPrice();
        }

        // 4. Add Fittings (Fixed price per fitting)
        $fittingsTotal = 0.0;
        foreach ($fittings as $fitting) {
            $fittingsTotal += $fitting->getFittingPrice();
        }

        // 5. Add Crew (Daily prices based on roles)
        $crewTotal = 0.0;
        $crewPrices = [
            'ROLE_CAPITAINE' => 250.0,
            'ROLE_CHEF'      => 200.0,
            'ROLE_HOTESSE'   => 150.0,
        ];

        // Calculation from assigned crew members
        foreach ($crewMembers as $member) {
            foreach ($crewPrices as $role => $price) {
                if (in_array($role, $member->getRoles(), true)) {
                    $crewTotal += ($price * $nbDays);
                    break; 
                }
            }
        }

        // Calculation from requested roles (for new competitive booking system)
        foreach ($requestedRoles as $role) {
            if (isset($crewPrices[$role])) {
                $crewTotal += ($crewPrices[$role] * $nbDays);
            }
        }

        // Total = (Discounted Base Price) + Formulas + Fittings + Crew
        return round($basePrice + $formulasTotal + $fittingsTotal + $crewTotal, 2);
    }

    /**
     * Calculates base price based on duration.
     */
    public function calculateBaseBoatPrice(Boat $boat, int $nbDays): float
    {
        $weeks = (int) floor($nbDays / 7);
        $extraDays = $nbDays % 7;

        return (float) (($weeks * $boat->getWeekPrice()) + ($extraDays * $boat->getDayPrice()));
    }

    /**
     * Checks if the user is eligible for the 15% premium discount.
     * Criteria: User has ROLE_PREMIUM AND Boat is used for Regatta (used = true).
     */
    public function isEligibleForPremiumDiscount(User $user, Boat $boat): bool
    {
        // Get roles from the User entity. Note: roles are usually stored as an array.
        $roles = $user->getRoles();
        
        return in_array('ROLE_PREMIUM', $roles, true) && $boat->isUsed() === true;
    }

    /**
     * Helper to calculate the number of days between two dates.
     */
    public function calculateNbDays(\DateTimeInterface $start, \DateTimeInterface $end): int
    {
        $diff = $start->diff($end);
        $days = (int) $diff->days;
        
        // Si c'est le même jour (0 jours de diff), on compte 1 jour de travail
        if ($days === 0 && $start->format('Y-m-d') === $end->format('Y-m-d')) {
            return 1;
        }

        // Si la différence est de 0 mais sur des jours différents (ex: 23h), 
        // ou si on veut compter le jour de début et de fin inclusivement :
        return $days > 0 ? $days : 1;
    }
}
