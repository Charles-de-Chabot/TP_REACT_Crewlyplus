import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext';
import PageLoader from '../components/Loader/PageLoader';

// Layouts
import App from '../App';
import HomeOffline from '../screens/OfflineScreens/HomeOffline';

// Ecrans
import Home from '../screens/OnlineScreens/Home';
import Boats from '../screens/OnlineScreens/Boats';
import Login from '../screens/OfflineScreens/Login';
import Register from '../screens/OfflineScreens/Register';
import DetailBoat from '../screens/OnlineScreens/DetailBoat';

const AppRouter = () => {
    const { userId, loading } = useAuthContext();

    if (loading) {
        return <PageLoader />;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* 
                    GROUPE 1 : Routes Publiques 
                    Accessibles à tous (connecté ou non).
                    Utilise le layout 'App' qui contient la Topbar et le Footer.
                */}
                <Route element={<App />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/boats" element={<Boats />} />
                    <Route path="/boats/:id" element={<DetailBoat />} />
                </Route>

                {/* 
                    GROUPE 2 : Routes "Invité" (Login / Register)
                    Accessibles UNIQUEMENT si l'utilisateur n'est PAS connecté (!userId).
                    Sinon, on redirige vers l'accueil (<Navigate to="/" />).
                    Utilise le layout 'HomeOffline' (centré, sans topbar complète).
                */}
                <Route element={!userId ? <HomeOffline /> : <Navigate to="/" replace />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* 
                    GROUPE 3 : Routes Protégées
                    Accessibles UNIQUEMENT si l'utilisateur EST connecté (userId).
                    Sinon, on redirige vers le login (<Navigate to="/login" />).
                    Utilise le layout 'App' pour garder la cohérence visuelle.
                */}
                <Route element={userId ? <App /> : <Navigate to="/login" replace />}>
                    <Route path="/profile" element={<div className="text-white pt-20 text-center">Page Profil (à venir)</div>} />
                </Route>

                {/* Route 404 : Redirection vers l'accueil pour toute URL inconnue */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter
