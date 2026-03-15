import React from 'react';
import { BOAT_URL } from '../../constants/apiConstant';

const HeaderDetail = ({ data }) => {
    // Si aucune donnée n'est encore chargée, on peut afficher un état de chargement ou rien
    if (!data) return null;

    // Récupération de l'image (identique à la logique de BoatCard)
    const imgBoat = data?.media?.[0]?.media_path ? `${BOAT_URL}/${data.media[0].media_path}` : null;
    
    // Récupération des autres informations avec valeurs par défaut
    const boatName = data?.name ?? "Bateau inconnu";
    const typeLabel = data?.type?.label ?? "Type inconnu";
    const modelLabel = data?.model?.label ?? "Modèle inconnu";
    // L'info maxUser est parfois à la racine, parfois dans boatinfo selon votre log précédent
    const maxUser = data?.boatinfo?.maxUser ?? data?.maxUser ?? "N/A";

    return (
        <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-8 shadow-2xl animate-slideup">
            {/* Image de fond */}
            {imgBoat ? (
                <img src={imgBoat} alt={boatName} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <span className="text-slate-500">Image non disponible</span>
                </div>
            )}

            {/* Overlay dégradé pour que le texte soit lisible */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>

            {/* Contenu textuel en bas de l'image */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col items-start">
                <span className="bg-teal-500/20 text-teal-400 text-sm font-bold px-4 py-1.5 rounded-full border border-teal-500/30 mb-4 backdrop-blur-md">
                    {typeLabel} • {modelLabel}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
                    {boatName}
                </h1>
                <div className="flex items-center gap-2 text-slate-300 bg-slate-900/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span>Capacité : <strong>{maxUser} personnes</strong></span>
                </div>
            </div>
        </div>
    );
};

export default HeaderDetail;