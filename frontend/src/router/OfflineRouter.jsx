import { createBrowserRouter, Navigate } from "react-router-dom";
import React, { lazy } from "react";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import App from "../App";

// Lazy loading pour alléger le bundle initial
const HomeOffline = lazy(() => import("../screens/OfflineScreens/HomeOffline"));
const Login = lazy(() => import("../screens/OfflineScreens/Login"));
const Register = lazy(() => import("../screens/OfflineScreens/Register"));
const Home = lazy(() => import("../screens/OnlineScreens/Home"));
const Boats = lazy(() => import("../screens/OnlineScreens/Boats"));
const DetailBoat = lazy(() => import("../screens/OnlineScreens/DetailBoat"));

import PaymentStatus from "../components/Stripe/PaymentStatus";

const OfflineRouter = createBrowserRouter([
    {
        // 1. Les routes publiques accessibles hors connexion
        element: <App/>, 
        errorElement: <ErrorPage/>, 
        children:[
            { path: "/", element: <Home/> },
            { path: "/boats", element: <Boats/> },
            { path: "/boats/:id", element: <DetailBoat/> },
            { path: "/payment-success", element: <PaymentStatus /> },
        ]
    },
    {
        // 2. Les routes exclusives à la déconnexion (Login / Register)
        element: <HomeOffline/>,
        errorElement: <ErrorPage/>,
        children:[
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/register",
                element: <Register/>, 
            },
        ]
    },
    {
        // Redirection par défaut si l'URL n'existe pas ou est protégée
        path: "*",
        element: <Navigate to="/login" replace />
    }
])

export default OfflineRouter;
