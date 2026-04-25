import { createBrowserRouter, Navigate } from "react-router-dom";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import App from "../App";
import Home from "../screens/OnlineScreens/Home";
import Boats from "../screens/OnlineScreens/Boats";
import DetailBoat from "../screens/OnlineScreens/DetailBoat";
import User from "../screens/OnlineScreens/User";
import RegisterPremium from "../screens/OnlineScreens/RegisterPremium";
import Configurator from "../screens/OnlineScreens/Configurator";
import CheckoutScreen from "../screens/OnlineScreens/CheckoutScreen";
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
            { path: "/boats/:id", element: <DetailBoat /> },
            { path: "/configurator", element: <Configurator /> },
            { path: "/checkout", element: <CheckoutScreen /> },
            
            // 2. Les routes privées
            { path: "/user", element: <User/> },
            { path: "/register_premium", element: <RegisterPremium /> },
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
