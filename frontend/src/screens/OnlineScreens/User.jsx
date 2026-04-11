import React from 'react';
import HeaderDetail from '../../components/User/HeaderDetail';
import UserInfoCard from '../../components/User/UserInfoCard';
import BookingHistory from '../../components/User/BookingHistory';
import PageLoader from '../../components/Loader/PageLoader';
import useFetchUser from '../../hooks/useFetchUser';

const User = () => {
    const { userData, loading } = useFetchUser();

    // Écran de chargement (similaire à DetailBoat)
    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden pt-24 pb-12 animate-slideup">
            <div className="container mx-auto px-4 max-w-5xl">
                
                {/* En-tête avec l'avatar et les informations principales */}
                <HeaderDetail data={userData} />

                {/* Corps de la page Profil */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Colonne de gauche : Infos complémentaires */}
                    <div className="md:col-span-1">
                        <UserInfoCard userData={userData} />
                    </div>

                    {/* Colonne de droite : Historique et autres sections */}
                    <div className="md:col-span-2">
                        <BookingHistory bookings={userData?.bookings} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;