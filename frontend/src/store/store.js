import { configureStore } from "@reduxjs/toolkit";
import boatReducer from "./boat/boatSlice";
import bookingReducer from "./booking/bookingSlice";

const store = configureStore({
    reducer: {
        boats: boatReducer,
        booking: bookingReducer,
    }
})

export default store;