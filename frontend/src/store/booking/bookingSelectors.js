import { createSelector } from "@reduxjs/toolkit";

/**
 * Basic selectors
 */
export const selectBookingState = (state) => state.booking;

export const selectSelectedBoat = (state) => state.booking.selectedBoat;
export const selectBookingDates = (state) => state.booking.dates;
export const selectSelectedFormula = (state) => state.booking.selectedFormula;
export const selectSelectedFittings = (state) => state.booking.selectedFittings;
export const selectSelectedCrew = (state) => state.booking.selectedCrew;
export const selectTotalPrice = (state) => state.booking.totalPrice;
export const selectSubTotalPrice = (state) => state.booking.subTotalPrice;
export const selectDiscountPrice = (state) => state.booking.discountPrice;
export const selectIsPremiumDiscount = (state) => state.booking.isPremiumDiscount;
export const selectBookingStatus = (state) => state.booking.bookingStatus;
export const selectStripeClientSecret = (state) => state.booking.stripeClientSecret;
export const selectBookingError = (state) => state.booking.error;

/**
 * Memoized selectors
 */

// Checks if the booking has enough information to proceed to configurator or payment
export const selectBookingIsReady = createSelector(
    [selectBookingDates, selectSelectedFormula],
    (dates, formula) => {
        return !!(dates.start && dates.end && dates.nbDays > 0 && formula);
    }
);

// Returns formatted crew with roles labels for UI
export const selectFormattedCrew = createSelector(
    [selectSelectedCrew],
    (crew) => {
        // This could be enhanced by joining with actual user names if available in store
        return crew;
    }
);
