import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/axios';
import { useAuthContext } from '../contexts/authContext';

export const useTeam = () => {
    const { userId } = useAuthContext();
    const [team, setTeam] = useState(null);
    const [positions, setPositions] = useState([]);
    const [myMembership, setMyMembership] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);

    const isFirstLoad = useRef(true);

    const fetchTeamData = useCallback(async () => {
        if (!userId) return;
        
        if (isFirstLoad.current) {
            setLoading(true);
        }
        try {
            // 1. Charger les positions disponibles
            const posRes = await api.get('/api/positions');
            setPositions(posRes.data['member'] || posRes.data['hydra:member'] || []);

            // 2. Charger l'utilisateur et sa team actuelle
            const userRes = await api.get(`/api/users/${userId}`);
            const userData = userRes.data;
            
            if (userData.currentTeam) {
                const teamRes = await api.get(`${userData.currentTeam['@id'] || userData.currentTeam}?t=${Date.now()}`);
                const teamData = teamRes.data;
                setTeam(teamData);

                // Trouver le membership de l'utilisateur (Comparaison robuste)
                const me = teamData.memberships?.find(m => {
                    const mUserId = m.user?.id || (typeof m.user === 'string' ? m.user.split('/').pop() : null);
                    return String(mUserId) === String(userId);
                });
                setMyMembership(me);
                isFirstLoad.current = false;
            } else {
                setTeam(null);
                setMyMembership(null);
            }
        } catch (err) {
            console.error("Error fetching team data", err);
            setError("Impossible de charger les données de l'équipe.");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchTeamData();
    }, [fetchTeamData]);

    const createTeam = async (name, description, emblemFile = null) => {
        setUpdating(true);
        try {
            const res = await api.post('/api/teams', { name, description }, {
                headers: { 'Content-Type': 'application/ld+json' }
            });
            const createdTeam = res.data;

            if (emblemFile) {
                const formData = new FormData();
                formData.append('file', emblemFile);
                await api.post(`/api/teams/${createdTeam.id}/emblem`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            await fetchTeamData();
            return createdTeam;
        } catch (err) {
            console.error("Error creating team", err);
            throw err;
        } finally {
            setUpdating(false);
        }
    };

    const joinTeam = async (inviteCode) => {
        setUpdating(true);
        try {
            await api.post('/api/teams/join', { inviteCode }, {
                headers: { 'Content-Type': 'application/ld+json' }
            });
            await fetchTeamData();
        } catch (err) {
            console.error("Error joining team", err);
            throw err;
        } finally {
            setUpdating(false);
        }
    };

    const updatePosition = async (positionId) => {
        if (!myMembership?.id) {
            console.error("No membership ID found for current user");
            return;
        }
        setUpdating(true);
        try {
            await api.patch(`/api/team_memberships/${myMembership.id}`, {
                position: `/api/positions/${positionId}`
            }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });

            // Synchronisation du champ 'position' sur le profil User pour le chat
            const selectedPos = positions.find(p => String(p.id) === String(positionId));
            if (selectedPos) {
                await api.patch(`/api/users/${userId}`, {
                    position: selectedPos.label
                }, {
                    headers: { 'Content-Type': 'application/merge-patch+json' }
                });
            }

            await fetchTeamData();
        } catch (err) {
            console.error("Error updating position", err);
            alert("Erreur lors de la mise à jour du poste.");
        } finally {
            setUpdating(false);
        }
    };

    return {
        team,
        positions,
        myMembership,
        loading,
        updating,
        error,
        createTeam,
        joinTeam,
        updatePosition,
        refreshTeam: fetchTeamData
    };
};
