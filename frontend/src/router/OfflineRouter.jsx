import { createBrowserRouter, Navigate } from "react-router-dom";
import HomeOffline from "../screens/OfflineScreens/HomeOffline";
import ErrorPage from "../screens/ErrorScreens/ErrorPage";
import Login from "../screens/OfflineScreens/Login";
import Register from "../screens/OfflineScreens/Register";
import App from "../App";
import Home from "../screens/OnlineScreens/Home";
import Boats from "../screens/OnlineScreens/Boats";
import DetailBoat from "../screens/OnlineScreens/DetailBoat";
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
