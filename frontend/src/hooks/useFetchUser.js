import { useState, useEffect } from 'react';
import api from '../api/axios';

const useFetchUser = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/api/me');
                setUserData(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération du profil utilisateur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    return { userData, loading };
};

export default useFetchUser;