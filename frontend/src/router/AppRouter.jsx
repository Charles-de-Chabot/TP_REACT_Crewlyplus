import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext';
import PageLoader from '../components/Loader/PageLoader';

import OnlineRouter from './OnlineRouter';
import OfflineRouter from './OfflineRouter';

const AppRouter = () => {
    const { userId, loading } = useAuthContext();

    if (loading) {
        return <PageLoader />;
    }

    // On injecte le routeur correspondant à l'état de connexion
    return <RouterProvider router={userId ? OnlineRouter : OfflineRouter} />;
};

export default AppRouter
