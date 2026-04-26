import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuthContext } from '../contexts/authContext';

const THEME_CONFIG = {
    'ROLE_CAPITAINE': { 
        primary: 'text-blue-400', 
        secondary: 'bg-blue-500/10', 
        border: 'border-blue-500/30', 
        glow: 'shadow-blue-500/20',
        label: 'Capitaine'
    },
    'ROLE_CHEF': { 
        primary: 'text-orange-400', 
        secondary: 'bg-orange-500/10', 
        border: 'border-orange-500/30', 
        glow: 'shadow-orange-500/20',
        label: 'Chef'
    },
    'ROLE_HOTESSE': { 
        primary: 'text-pink-400', 
        secondary: 'bg-pink-500/10', 
        border: 'border-pink-500/30', 
        glow: 'shadow-pink-500/20',
        label: 'Hôtesse'
    }
};

export const useCrewDashboard = () => {
    const { 
        userId, 
        firstname, 
        lastname, 
        email, 
        roleLabel, 
        phoneNumber, 
        position, 
        address,
        avatar
    } = useAuthContext();
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchData = useCallback(async (isSilent = false) => {
        if (!userId) return;
        if (!isSilent) setLoading(true);
        try {
            const res = await api.get('/api/rentals');
            const data = res.data;
            const allRentals = data['hydra:member'] || data['member'] || (Array.isArray(data) ? data : []);
            
            const myMissions = allRentals.filter(m => {
                const isPaid = m.status === 'pending' || m.status === 'confirmed';
                if (!isPaid) return false;

                const isAssigned = m.crewMembers?.some(u => {
                    const uId = typeof u === 'string' ? parseInt(u.split('/').pop()) : u.id;
                    return uId === parseInt(userId);
                });

                if (isAssigned) return true;

                const isRequestedRole = m.requestedRoles?.includes(roleLabel);
                const isOpenForMe = m.status === 'pending' && isRequestedRole;

                return isOpenForMe;
            });

            setMissions(myMissions);
        } catch (err) {
            console.error("Error fetching crew data", err);
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, [userId, roleLabel]);

    useEffect(() => {
        fetchData();
    }, [userId, fetchData]);

    const handleAccept = async (missionId) => {
        setProcessingId(missionId);
        try {
            const mission = missions.find(m => m.id === missionId);
            const currentCrewIris = mission.crewMembers?.map(u => typeof u === 'string' ? u : (u['@id'] || `/api/users/${u.id}`)) || [];
            const currentConfirmedIris = mission.confirmedBy?.map(u => typeof u === 'string' ? u : (u['@id'] || `/api/users/${u.id}`)) || [];
            
            const newCrew = [...new Set([...currentCrewIris, `/api/users/${userId}`])];
            const newConfirmedBy = [...new Set([...currentConfirmedIris, `/api/users/${userId}`])];

            await api.patch(`/api/rentals/${missionId}`, { 
                crewMembers: newCrew,
                confirmedBy: newConfirmedBy 
            }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });
            
            await fetchData(true); // Rafraîchissement silencieux après acceptation
        } catch (err) {
            console.error("Error accepting mission", err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleRefuse = async (missionId) => {
        try {
            await api.patch(`/api/rentals/${missionId}`, { status: 'cancelled' }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });
            await fetchData(true);
        } catch (err) {
            console.error("Error refusing mission", err);
        }
    };

    const confirmedMissions = missions.filter(m => m.status === 'confirmed');

    const theme = THEME_CONFIG[roleLabel] || THEME_CONFIG['ROLE_CAPITAINE'];
    
    return {
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
        refresh: () => fetchData(true) // Le refresh est silencieux par défaut
    };
};
