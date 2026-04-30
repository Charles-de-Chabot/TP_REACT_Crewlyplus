import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderDetail from '../../components/User/HeaderDetail';
import UserInfoCard from '../../components/User/UserInfoCard';
import BookingHistory from '../../components/User/BookingHistory';
import PageLoader from '../../components/Loader/PageLoader';
import ProfileEditModal from '../../components/User/ProfileEditModal';
import CancelBookingModal from '../../components/User/CancelBookingModal';
import useFetchUser from '../../hooks/useFetchUser';
import SailingCV from '../../components/User/SailingCV';
import PageHeader from '../../components/UI/PageHeader';

const User = () => {
    const { userData, loading, refresh } = useFetchUser();
    const navigate = useNavigate();
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
                backPath="/"
                backLabel="Retour à l'accueil"
            />
            <div className="container mx-auto px-4 max-w-5xl">
                
                {/* En-tête avec l'avatar et les informations principales */}
                <HeaderDetail 
                    data={userData} 
                    onEdit={() => setIsEditModalOpen(true)} 
                    onAvatarUpdate={refresh}
                />

                {/* CV Nautique (Sailing Profile) - Réservé aux membres Premium */}
                {userData?.roleLabel === 'ROLE_USER' ? (
                    <div className="mt-8 p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-500/10 border border-amber-500/30 rounded-3xl relative overflow-hidden group transition-all duration-500">
                        {/* Background Decoration */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700"></div>
                        
                        <div className="relative z-10">
                            {/* Ligne principale : Texte + Bouton */}
                            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8">
                                <div className="flex-1 text-center lg:text-left">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full mb-4">
                                        <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Offre Exclusive</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 leading-none">
                                        Débloquez votre <br className="hidden lg:block" />
                                        <span className="text-amber-500 italic">Potentiel Tactique</span>
                                    </h3>
                                    <p className="text-white/60 text-sm leading-relaxed max-w-xl">
                                        Rejoignez l'élite de Crewly+ et accédez aux outils utilisés par les professionnels pour gérer leur carrière nautique.
                                    </p>
                                </div>

                                <div className="flex-shrink-0">
                                    <button 
                                        onClick={() => navigate('/register_premium')}
                                        className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-tighter rounded-2xl transition-all shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95"
                                    >
                                        Devenir Membre Premium
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <SailingCV profile={{...userData?.sailingProfile, position: userData?.position}} memberships={userData?.memberships} />
                )}

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