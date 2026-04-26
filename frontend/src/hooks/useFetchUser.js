import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useFetchUser = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        try {
            const response = await api.get('/api/me');
            setUserData(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération du profil utilisateur:", error);
        } finally {
            if (!isSilent) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    return { userData, loading, refresh: () => fetchUserData(true) };
};

export default useFetchUser;