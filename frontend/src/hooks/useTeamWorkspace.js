import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuthContext } from '../contexts/authContext';

const useTeamWorkspace = (regattaId) => {
    const { userId } = useAuthContext();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [error, setError] = useState(null);

    const fetchUserTeam = useCallback(async () => {
        if (!userId || !regattaId) return;
        
        try {
            setLoading(true);
            // On cherche l'équipe où l'utilisateur est membre pour cette régate
            const response = await api.get(`/api/teams?regatta=${regattaId}&members.id=${userId}`);
            
            const teams = response.data['member'] || response.data['hydra:member'] || response.data || [];
            if (teams.length > 0) {
                setTeam(teams[0]);
            } else {
                setTeam(null);
            }
        } catch (err) {
            console.error("Erreur fetch user team:", err);
            setError("Impossible de charger votre équipe.");
        } finally {
            setLoading(false);
        }
    }, [userId, regattaId]);

    useEffect(() => {
        fetchUserTeam();
    }, [fetchUserTeam]);

    const createTeam = async (name) => {
        try {
            setError(null);
            const response = await api.post('/api/teams', {
                name: name || "Nouvelle Équipe",
                regatta: `/api/regattas/${regattaId}`
            });
            setTeam(response.data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.['hydra:description'] || err.response?.data?.message || "Erreur lors de la création.");
            throw err;
        }
    };

    const joinTeam = async (inviteCode) => {
        try {
            setError(null);
            const response = await api.post('/api/teams/join', {
                inviteCode: inviteCode
            });
            // Après avoir rejoint, on rafraîchit les données de l'équipe
            await fetchUserTeam();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || "Code invalide ou équipe introuvable.");
            throw err;
        }
    };

    const exportPack = () => {
        setIsExporting(true);
        setTimeout(() => setIsExporting(false), 2000);
    };

    return {
        team,
        loading,
        error,
        isExporting,
        createTeam,
        joinTeam,
        exportPack,
        refresh: fetchUserTeam
    };
};

export default useTeamWorkspace;
