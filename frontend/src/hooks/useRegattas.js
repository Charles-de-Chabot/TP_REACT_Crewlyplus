import { useState, useEffect } from 'react';
import api from '../api/axios';

const useRegattas = () => {
    const [regattas, setRegattas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRegattas = async () => {
            try {
                setLoading(true);
                const response = await api.get('/api/regattas');
                
                let data = [];
                if (Array.isArray(response.data)) {
                    data = response.data;
                } else if (response.data) {
                    data = response.data['member'] || 
                           response.data['hydra:member'] || 
                           response.data['items'] || 
                           [];
                }
                setRegattas(data);
            } catch (err) {
                console.error("Erreur fetch regattas:", err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegattas();
    }, []);

    return { regattas, loading, error };
};

export default useRegattas;
