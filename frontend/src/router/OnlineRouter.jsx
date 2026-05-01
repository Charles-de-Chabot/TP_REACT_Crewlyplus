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

// Admin Screens (Lazy loaded)
const AdminDashboard = lazy(() => import("../screens/AdminScreens/AdminDashboard"));
const AdminGuard = lazy(() => import("../components/Admin/AdminGuard"));
const AdminLayout = lazy(() => import("../components/Admin/AdminLayout"));

const AdminUsers = lazy(() => import("../screens/AdminScreens/AdminUsers"));

const AdminTeams = lazy(() => import("../screens/AdminScreens/AdminTeams"));

const AdminBoats = lazy(() => import("../screens/AdminScreens/AdminBoats"));
const AdminModels = lazy(() => import("../screens/AdminScreens/AdminModels"));
const AdminRegattas = lazy(() => import("../screens/AdminScreens/AdminRegattas"));
const AdminPositions = lazy(() => import("../screens/AdminScreens/AdminPositions"));
const AdminNotifications = lazy(() => import("../screens/AdminScreens/AdminNotifications"));

const OnlineRouter = createBrowserRouter([
    {
        element: <App/>,
        errorElement: <ErrorPage />,
        children: [
            // ... (keep existing children)
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
            
            { path: "/user", element: <User/> },
            { path: "/crew/dashboard", element: <CrewDashboard /> },
            { path: "/crew/register", element: <CrewRegister /> },
            { path: "/register_premium", element: <RegisterPremium /> },
            { path: "/my-team", element: <MyTeam /> },
            { path: "/my-team/history/:id", element: <TeamHistoryDetail /> },
            { path: "/payment-success", element: <PaymentStatus /> },

            { path: "/login", element: <Navigate to="/" replace /> },
            { path: "/register", element: <Navigate to="/" replace /> },
        ]
    },
    // 4. Routes Administration
    {
        path: "/admin",
        element: <AdminGuard />,
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <AdminDashboard /> },
                    { path: "users", element: <AdminUsers /> },
                    { path: "teams", element: <AdminTeams /> },
                    { path: "boats", element: <AdminBoats /> },
                    { path: "catalog", element: <AdminModels /> },
                    { path: "regattas", element: <AdminRegattas /> },
                    { path: "positions", element: <AdminPositions /> },
                    { path: "notifications", element: <AdminNotifications /> },
                ]
            }
        ]
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
])

export default OnlineRouter
