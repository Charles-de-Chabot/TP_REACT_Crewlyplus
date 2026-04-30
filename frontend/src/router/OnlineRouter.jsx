import { createBrowserRouter, Navigate } from "react-router-dom";
import React, { lazy } from "react";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import App from "../App";

// Lazy loading des pages pour optimiser le bundle initial
const Home = lazy(() => import("../screens/OnlineScreens/Home"));
const Boats = lazy(() => import("../screens/OnlineScreens/Boats"));
const DetailBoat = lazy(() => import("../screens/OnlineScreens/DetailBoat"));
const User = lazy(() => import("../screens/OnlineScreens/User"));
const RegisterPremium = lazy(() => import("../screens/OnlineScreens/RegisterPremium"));
const Configurator = lazy(() => import("../screens/OnlineScreens/Configurator"));
const CheckoutScreen = lazy(() => import("../screens/OnlineScreens/CheckoutScreen"));
const CrewDashboard = lazy(() => import("../screens/OnlineScreens/CrewDashboard"));
const CrewRegister = lazy(() => import("../screens/OnlineScreens/CrewRegister"));
const Regattas = lazy(() => import("../screens/OnlineScreens/Regattas"));
const RegattaDetails = lazy(() => import("../screens/OnlineScreens/RegattaDetails"));
const TeamWorkspace = lazy(() => import("../screens/OnlineScreens/TeamWorkspace"));
const MyTeam = lazy(() => import("../screens/OnlineScreens/MyTeam"));
const TeamHistoryDetail = lazy(() => import("../screens/OnlineScreens/TeamHistoryDetail"));

import PaymentStatus from "../components/Stripe/PaymentStatus";

const OnlineRouter = createBrowserRouter([
    {
        element: <App/>,
        errorElement: <ErrorPage />,
        children: [
            // 1. Les routes publiques partagées
            {
                path: "/",
                element: <Home />,
            },
            { path: "/boats", element: <Boats/> },
            { path: "/regattas", element: <Regattas /> },
            { path: "/regattas/:id", element: <RegattaDetails /> },
            { path: "/regattas/:id/team", element: <Navigate to="/my-team" replace /> },
            { path: "/boats/:id", element: <DetailBoat /> },
            { path: "/configurator", element: <Configurator /> },
            { path: "/checkout", element: <CheckoutScreen /> },
            
            // 2. Les routes privées
            { path: "/user", element: <User/> },
            { path: "/crew/dashboard", element: <Navigate to="/my-team" replace /> },
            { path: "/crew/register", element: <Navigate to="/my-team" replace /> },
            { path: "/register_premium", element: <RegisterPremium /> },
            { path: "/my-team", element: <MyTeam /> },
            { path: "/my-team/history/:id", element: <TeamHistoryDetail /> },
            { path: "/payment-success", element: <PaymentStatus /> },

            // 3. Redirections pour les pages hors-ligne si l'utilisateur est déjà connecté
            { path: "/login", element: <Navigate to="/" replace /> },
            { path: "/register", element: <Navigate to="/" replace /> },
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
])

export default OnlineRouter
