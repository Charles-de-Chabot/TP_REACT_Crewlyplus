import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";
import { CONFIG_JSON_LD } from "../../constants/apiConstant";

/**
 * bookingSlice
 * Manages the state of a current booking process.
 */
const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        selectedBoat: null,       // Boat object { id, name, dayPrice, weekPrice, used, formulas }
        dates: {
            start: null,            // ISO string "YYYY-MM-DD"
            end: null,              // ISO string "YYYY-MM-DD"
            nbDays: 0               // Calculated duration
        },
        selectedFormula: null,    // Formula object { id, title, formulaPrice }
        selectedFittings: [],     // Array of Fitting objects { id, label, fittingPrice }
        selectedCrew: [],         // Array of { userId, role }
        totalPrice: 0,            // Final price after discount
        subTotalPrice: 0,         // Price before discount
        discountPrice: 0,         // The discount amount (negative)
        isPremiumDiscount: false, // Applied if ROLE_PREMIUM + Boat.used === true
        bookingStatus: 'idle',    // 'idle' | 'configuring' | 'submitting' | 'success' | 'error'
        stripeClientSecret: null, // From POST /api/rentals
        rentalId: null,           // From POST /api/rentals
        error: null
    },
    reducers: {
        setSelectedBoat: (state, action) => {
            state.selectedBoat = action.payload;
        },
        setPremiumDiscount: (state, action) => {
            state.isPremiumDiscount = action.payload;
        },
        setDates: (state, action) => {
            const { start, end } = action.payload;
            state.dates.start = start;
            state.dates.end = end;

            if (start && end) {
                const startDate = new Date(start);
                const endDate = new Date(end);
                const diffTime = Math.abs(endDate - startDate);
                state.dates.nbDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            } else {
                state.dates.nbDays = 0;
            }
        },
        setSelectedFormula: (state, action) => {
            state.selectedFormula = action.payload;
        },
        toggleFitting: (state, action) => {
            const fitting = action.payload;
            const index = state.selectedFittings.findIndex(f => f.id === fitting.id);
            if (index >= 0) {
                state.selectedFittings.splice(index, 1);
            } else {
                state.selectedFittings.push(fitting);
            }
        },
        toggleCrewRole: (state, action) => {
            const role = action.payload;
            const index = state.selectedCrew.indexOf(role);
            if (index >= 0) {
                state.selectedCrew.splice(index, 1);
            } else {
                state.selectedCrew.push(role);
            }
        },
        calculateTotalPrice: (state) => {
            if (!state.selectedBoat || !state.dates.nbDays) {
                state.totalPrice = 0;
                state.subTotalPrice = 0;
                state.discountPrice = 0;
                return;
            }

            const nbDays = state.dates.nbDays;
            
            // 1. Base Boat Price (without discount yet)
            const boatBase = nbDays >= 7 ? state.selectedBoat.weekPrice : state.selectedBoat.dayPrice * nbDays;

            // 2. Formulas
            const formulasTotal = state.selectedFormula ? state.selectedFormula.formulaPrice : 0;

            // 3. Fittings
            const fittingsTotal = state.selectedFittings.reduce((sum, f) => sum + f.fittingPrice, 0);

            // 4. Crew
            const CREW_DAILY_PRICES = {
                'ROLE_CAPITAINE': 250,
                'ROLE_CHEF': 200,
                'ROLE_HOTESSE': 150
            };
            const crewTotal = state.selectedCrew.reduce((sum, role) => {
                const dailyPrice = CREW_DAILY_PRICES[role] || 0;
                return sum + (dailyPrice * nbDays);
            }, 0);

            // Calculation
            const subTotal = boatBase + formulasTotal + fittingsTotal + crewTotal;
            const discount = state.isPremiumDiscount ? boatBase * 0.15 : 0;

            state.subTotalPrice = Math.round(subTotal * 100) / 100;
            state.discountPrice = Math.round(discount * 100) / 100;
            state.totalPrice = Math.round((subTotal - discount) * 100) / 100;
        },
        setBookingStatus: (state, action) => {
            state.bookingStatus = action.payload;
        },
        setStripeData: (state, action) => {
            state.stripeClientSecret = action.payload.clientSecret;
            state.rentalId = action.payload.rentalId;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetBooking: (state) => {
            // Reset to initialState
            state.selectedBoat = null;
            state.dates = { start: null, end: null, nbDays: 0 };
            state.selectedFormula = null;
            state.selectedFittings = [];
            state.selectedCrew = [];
            state.totalPrice = 0;
            state.isPremiumDiscount = false;
            state.bookingStatus = 'idle';
            state.stripeClientSecret = null;
            state.rentalId = null;
            state.error = null;
        }
    }
});

export const { 
    setSelectedBoat, 
    setPremiumDiscount,
    setDates, 
    setSelectedFormula, 
    toggleFitting, 
    toggleCrewRole, 
    calculateTotalPrice,
    setBookingStatus,
    setStripeData,
    setError,
    resetBooking
} = bookingSlice.actions;

/**
 * THUNKS
 */

// Submit the booking to the backend to get Stripe Client Secret
export const submitBooking = (bookingPayload) => async (dispatch) => {
    try {
        dispatch(setBookingStatus('submitting'));
        dispatch(setError(null));

        const response = await api.post('/api/rentals', bookingPayload, CONFIG_JSON_LD);

        // API Platform returns the created Rental with stripeClientSecret property
        if (response.data && response.data.stripeClientSecret) {
            dispatch(setStripeData({
                clientSecret: response.data.stripeClientSecret,
                rentalId: response.data.id
            }));
            dispatch(setBookingStatus('paying'));
        } else {
            throw new Error("Impossible de récupérer le secret Stripe.");
        }
    } catch (error) {
        const message = error.response?.data?.['hydra:description'] || error.message;
        dispatch(setError(message));
        dispatch(setBookingStatus('error'));
    }
};

export default bookingSlice.reducer;
