import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const useRegatta = (id) => {
    const [regatta, setRegatta] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchWeather = useCallback(async (lat, lon) => {
        try {
            // Appel à l'API Open-Meteo (Gratuit, pas de clé requise)
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m&wind_speed_unit=kn`
            );
            const data = await response.json();
            
            if (data.current) {
                setWeather({
                    temp: data.current.temperature_2m,
                    windSpeed: data.current.wind_speed_10m,
                    windGusts: data.current.wind_gusts_10m,
                    windDir: data.current.wind_direction_10m,
                    windDirText: getWindDirection(data.current.wind_direction_10m)
                });
            }
        } catch (err) {
            console.error("Erreur météo:", err);
        }
    }, []);

    useEffect(() => {
        const fetchRegatta = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/api/regattas/${id}`);
                setRegatta(response.data);
                
                // Si on a des coordonnées, on va chercher la météo
                if (response.data.latitude && response.data.longitude) {
                    fetchWeather(response.data.latitude, response.data.longitude);
                }
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchRegatta();
    }, [id, fetchWeather]);

    const registerTeam = async (teamId) => {
        try {
            await api.post('/api/registrations', {
                team: `/api/teams/${teamId}`,
                regatta: `/api/regattas/${id}`,
                status: 'CONFIRMED'
            }, {
                headers: { 'Content-Type': 'application/ld+json' }
            });
            // Recharger la régate pour voir le statut
            const response = await api.get(`/api/regattas/${id}`);
            setRegatta(response.data);
            return true;
        } catch (err) {
            console.error("Error registering team", err);
            throw err;
        }
    };

    return { regatta, weather, loading, error, registerTeam };
};

// Utilitaire pour convertir les degrés en texte (NE, SW, etc.)
const getWindDirection = (deg) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
};

export default useRegatta;
