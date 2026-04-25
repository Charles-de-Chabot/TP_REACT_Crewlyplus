import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import api from '../../api/axios';
import Layout from '../../components/UI/Layout';
import PageLoader from '../../components/Loader/PageLoader';

// Sub-components
import CrewHeader from '../../components/Crew/CrewHeader';
import CrewStats from '../../components/Crew/CrewStats';
import RevenueChart from '../../components/Crew/RevenueChart';
import MissionList from '../../components/Crew/MissionList';
import CrewInfoSidebar from '../../components/Crew/CrewInfoSidebar';
import EditProfileModal from '../../components/Crew/EditProfileModal';

const ROLE_THEMES = {
    'ROLE_CAPITAINE': { 
        label: 'Capitaine', 
        primary: 'text-blue-400', 
        secondary: 'bg-blue-500/10', 
        border: 'border-blue-500/30',
        glow: 'shadow-blue-500/20',
        gradient: 'from-blue-600/20 to-blue-400/5',
        dailyPrice: 250
    },
    'ROLE_CHEF': { 
        label: 'Chef de Bord', 
        primary: 'text-orange-400', 
        secondary: 'bg-orange-500/10', 
        border: 'border-orange-500/30',
        glow: 'shadow-orange-500/20',
        gradient: 'from-orange-600/20 to-orange-400/5',
        dailyPrice: 200
    },
    'ROLE_HOTESSE': { 
        label: 'Hôtesse', 
        primary: 'text-pink-400', 
        secondary: 'bg-pink-500/10', 
        border: 'border-pink-500/30',
        glow: 'shadow-pink-500/20',
        gradient: 'from-pink-600/20 to-pink-400/5',
        dailyPrice: 150
    },
    'ROLE_USER': { 
        label: 'Utilisateur', 
        primary: 'text-teal-400', 
        secondary: 'bg-teal-500/10', 
        border: 'border-teal-500/30',
        glow: 'shadow-teal-500/20',
        gradient: 'from-teal-600/20 to-teal-400/5',
        dailyPrice: 0
    }
};

const CrewDashboard = () => {
    const { userId, roleLabel, firstname, lastname } = useAuthContext();
    const [loading, setLoading] = useState(true);
    const [userProfile, setUserProfile] = useState(null);
    const [missions, setMissions] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        monthlyEarnings: 0,
        missionCount: 0,
        rating: 5.0
    });
    const [revenueData, setRevenueData] = useState([0, 0, 0, 0, 0, 0, 0]);

    const activeRole = String(roleLabel || '').toUpperCase();
    const theme = ROLE_THEMES[activeRole] || ROLE_THEMES['ROLE_USER'];

    const fetchData = async () => {
        try {
            const userRes = await api.get(`/api/users/${userId}`);
            setUserProfile(userRes.data);

            const res = await api.get(`/api/rentals?crewMembers.id=${userId}`);
            const data = res.data['member'] || res.data['hydra:member'] || [];
            
            const confirmedMissions = data.filter(m => m.status === 'confirmed' || m.status === 'completed');
            
            let total = 0;
            let monthly = 0;
            const now = new Date();
            const monthlyPoints = [0, 0, 0, 0, 0, 0, 0];

            confirmedMissions.forEach(m => {
                const start = new Date(m.rentalStart);
                const end = new Date(m.rentalEnd);
                const nbDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
                const earnings = nbDays * theme.dailyPrice;
                
                total += earnings;
                if (start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear()) {
                    monthly += earnings;
                }
                const monthDiff = (now.getMonth() - start.getMonth() + (12 * (now.getFullYear() - start.getFullYear())));
                if (monthDiff >= 0 && monthDiff < 7) {
                    monthlyPoints[6 - monthDiff] += earnings;
                }
            });

            setMissions(data);
            setStats({
                totalEarnings: total,
                monthlyEarnings: monthly,
                missionCount: confirmedMissions.length,
                rating: 5.0
            });
            setRevenueData(monthlyPoints);
            
        } catch (err) {
            console.error("Error fetching crew data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId, theme.dailyPrice]);

    const handleAcceptMission = async (missionId) => {
        try {
            await api.patch(`/api/rentals/${missionId}`, { status: 'confirmed' }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });
            fetchData();
        } catch (err) {
            console.error("Error", err);
        }
    };

    const handleRejectMission = async (missionId) => {
        try {
            await api.patch(`/api/rentals/${missionId}`, { status: 'cancelled' }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });
            fetchData();
        } catch (err) {
            console.error("Error", err);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <Layout className="pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-7xl">
                
                <CrewHeader 
                    theme={theme} 
                    firstname={firstname} 
                    lastname={lastname} 
                    pendingCount={missions.filter(m => m.status === 'pending').length} 
                />

                <CrewStats theme={theme} stats={stats} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <RevenueChart theme={theme} data={revenueData} />
                        <MissionList 
                            missions={missions} 
                            theme={theme} 
                            onAccept={handleAcceptMission} 
                            onReject={handleRejectMission} 
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <CrewInfoSidebar 
                            theme={theme} 
                            user={userProfile} 
                            onEdit={() => setIsEditModalOpen(true)} 
                        />
                    </div>
                </div>

                <EditProfileModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    user={userProfile}
                    onUpdate={fetchData}
                />

            </div>
        </Layout>
    );
};

export default CrewDashboard;
