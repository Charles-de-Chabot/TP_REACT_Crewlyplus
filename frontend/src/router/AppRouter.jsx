
//=====================
//ROUTER PRINCIPALE DE L'APPLICATION
//=====================
//ce router determine quel route afficher selno l'état de connexion 
//utilisateur connecté -> OnlineRouter (application complète)
//utilisateur deco -> OfflineRouteur (login/register)


import React from 'react'
import { RouterProvider } from 'react-router-dom'
import OfflineRouter from './OfflineRouter'
import { useAuthContext } from '../contexts/authContext'
import PageLoader from '../components/Loader/PageLoader'
import OnlineRouter from './OnlineRouter'


const AppRouter = () => {
    // On récupère l'utilisateur et l'état de chargement depuis le contexte d'authentification
    const { userId, loading } = useAuthContext();

    // Affiche un loader pendant que le contexte vérifie la session utilisateur
    if (loading) {
        return <PageLoader/>;
    }
    
    return (
        <RouterProvider router={userId ? OnlineRouter : OfflineRouter}/>
    )
}

export default AppRouter
