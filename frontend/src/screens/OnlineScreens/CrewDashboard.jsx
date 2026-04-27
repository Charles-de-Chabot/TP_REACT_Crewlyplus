import React, { useState } from 'react';
import Layout from '../../components/UI/Layout';
import PageLoader from '../../components/Loader/PageLoader';

// Components
import CrewHeader from '../../components/Crew/CrewHeader';
import CrewStats from '../../components/Crew/CrewStats';
import { MissionList } from '../../components/Crew/MissionList';
import RevenueChart from '../../components/Crew/RevenueChart';
import CrewInfoSidebar from '../../components/Crew/CrewInfoSidebar';
import ProfileEditModal from '../../components/User/ProfileEditModal';

// Custom Hook
import { useCrewDashboard } from '../../hooks/useCrewDashboard';
import PageHeader from '../../components/UI/PageHeader';

const CrewDashboard = () => {
    const {
        missions,
        confirmedMissions,
        loading,
        processingId,
        handleAccept,
        handleRefuse,
        firstname,
        lastname,
        email,
        phoneNumber,
        position,
        address,
        userId,
        avatar,
        theme,
        refresh
    } = useCrewDashboard();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (loading) return <PageLoader />;

    return (
        <Layout className="pb-20 bg-slate-950 min-h-screen">
            <PageHeader 
                title="Tableau" 
                subtitle="De Bord Pro" 
                description={`Bienvenue à bord, ${firstname}`}
                backPath="/"
                backLabel="Retour à l'accueil"
            />
            <div className="container mx-auto px-6 max-w-7xl">
                <CrewHeader 
                    theme={theme}
                    firstname={firstname} 
                    lastname={lastname}
                    avatar={avatar}
                    pendingCount={missions.filter(m => m.status === 'pending').length} 
                    onAvatarUpdate={refresh}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Stats & List */}
                    <div className="lg:col-span-8 space-y-8">
                        <CrewStats 
                            theme={theme}
                            stats={{
                                monthlyEarnings: 0, 
                                totalEarnings: 0,
                                missionCount: confirmedMissions.length,
                                rating: 5.0
                            }}
                        />

                        <RevenueChart theme={theme} missions={confirmedMissions} />

                        <div className="bg-slate-950/40 p-10 rounded-2xl border border-white/5 border-t-white/10 shadow-2xl shadow-black/50">
                            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-10">Missions Disponibles</h2>
                            <MissionList 
                                missions={missions} 
                                theme={theme}
                                userId={userId}
                                onAccept={handleAccept}
                                onRefuse={handleRefuse}
                                processingId={processingId}
                            />
                        </div>
                    </div>

                    {/* Right Column: Profile & Info */}
                    <div className="lg:col-span-4 sticky top-32">
                        <CrewInfoSidebar 
                            theme={theme} 
                            user={{ id: userId, firstname, lastname, email, phoneNumber, position, address }}
                            onEdit={() => setIsEditModalOpen(true)}
                        />
                    </div>
                </div>
            </div>

            {/* Modale de modification */}
            <ProfileEditModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                userData={{ id: userId, firstname, lastname, email, phoneNumber, position, address }}
                onUpdate={refresh}
            />
        </Layout>
    );
};

export default CrewDashboard;
