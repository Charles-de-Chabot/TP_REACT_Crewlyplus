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
import CrewDashboard from "../screens/OnlineScreens/CrewDashboard";
import CrewRegister from "../screens/OnlineScreens/CrewRegister";
import Regattas from "../screens/OnlineScreens/Regattas";
import RegattaDetails from "../screens/OnlineScreens/RegattaDetails";
import TeamWorkspace from "../screens/OnlineScreens/TeamWorkspace";
import MyTeam from "../screens/OnlineScreens/MyTeam";
import TeamHistoryDetail from "../screens/OnlineScreens/TeamHistoryDetail";

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
