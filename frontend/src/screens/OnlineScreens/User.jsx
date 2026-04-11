import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import HeaderDetail from '../../components/User/HeaderDetail';

const User = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // On récupère les informations fraîches de l'utilisateur depuis l'API
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

    // Écran de chargement (similaire à DetailBoat)
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-950 text-teal-500">
                <svg className="animate-spin h-12 w-12" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden pt-24 pb-12 animate-slideup">
            <div className="container mx-auto px-4 max-w-5xl">
                
                {/* En-tête avec l'avatar et les informations principales */}
                <HeaderDetail data={userData} />

                {/* Corps de la page Profil */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Colonne de gauche : Infos complémentaires */}
                    <div className="md:col-span-1">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/30 sticky top-28">
                            <h3 className="text-xl font-bold text-white mb-4">Mes Informations</h3>
                            <ul className="space-y-3 text-slate-400">
                                <li><span className="font-semibold text-slate-300">Email :</span> {userData?.email}</li>
                                {userData?.phone && <li><span className="font-semibold text-slate-300">Téléphone :</span> {userData?.phone}</li>}
                            </ul>
                        </div>
                    </div>

                    {/* Colonne de droite : Historique et autres sections */}
                    <div className="md:col-span-2">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/30 min-h-[300px] flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                <h3 className="text-xl font-bold text-white mb-2">Historique des réservations</h3>
                                <p className="text-slate-400">Vous n'avez pas encore de réservations enregistrées.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default User;