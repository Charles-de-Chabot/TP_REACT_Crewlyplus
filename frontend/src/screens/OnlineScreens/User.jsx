import React, { useState } from 'react';
import HeaderDetail from '../../components/User/HeaderDetail';
import UserInfoCard from '../../components/User/UserInfoCard';
import BookingHistory from '../../components/User/BookingHistory';
import PageLoader from '../../components/Loader/PageLoader';
import ProfileEditModal from '../../components/User/ProfileEditModal';
import CancelBookingModal from '../../components/User/CancelBookingModal';
import useFetchUser from '../../hooks/useFetchUser';
import SailingCV from '../../components/User/SailingCV';
import DocumentVault from '../../components/User/DocumentVault';
import PageHeader from '../../components/UI/PageHeader';

const User = () => {
    const { userData, loading, refresh } = useFetchUser();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const handleCancelClick = (bookingId) => {
        const booking = userData.rentals.find(r => r.id === bookingId);
        setSelectedBooking(booking);
        setIsCancelModalOpen(true);
    };

    const confirmCancel = async (bookingId) => {
        try {
            const api = (await import('../../api/axios')).default;
            await api.patch(`/api/rentals/${bookingId}`, 
                { status: 'cancelled' },
                { headers: { 'Content-Type': 'application/merge-patch+json' } }
            );
            setIsCancelModalOpen(false);
            refresh();
        } catch (error) {
            console.error("Erreur lors de l'annulation:", error);
            alert("Une erreur est survenue lors de l'annulation.");
        }
    };

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden pb-12 animate-slideup">
            <PageHeader 
                title="Mon" 
                subtitle="Profil" 
                description="Espace Personnel & Documents"
            />
            <div className="container mx-auto px-4 max-w-5xl">
                
                {/* En-tête avec l'avatar et les informations principales */}
                <HeaderDetail 
                    data={userData} 
                    onEdit={() => setIsEditModalOpen(true)} 
                    onAvatarUpdate={refresh}
                />

                {/* CV Nautique (Sailing Profile) */}
                <SailingCV profile={userData?.sailingProfile} />

                {/* Corps de la page Profil */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Colonne de gauche : Infos complémentaires */}
                    <div className="md:col-span-1">
                        <UserInfoCard 
                            userData={userData} 
                            onEdit={() => setIsEditModalOpen(true)} 
                        />
                    </div>

                    {/* Colonne de droite : Historique et autres sections */}
                    <div className="md:col-span-2">
                        <BookingHistory 
                            bookings={userData?.rentals} 
                            onCancel={handleCancelClick}
                        />
                    </div>
                </div>
            </div>

            {/* Modale de modification */}
            <ProfileEditModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={userData}
                onUpdate={refresh}
            />

            {/* Modale d'annulation avec politique de remboursement */}
            <CancelBookingModal 
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={confirmCancel}
                booking={selectedBooking}
            />
        </div>
    );
};

export default User;