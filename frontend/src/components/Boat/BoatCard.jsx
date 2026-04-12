import React from 'react';
import { Link } from 'react-router-dom';
import { BOAT_URL } from '../../constants/apiConstant';

const BoatCard = ({ data }) => {

    // On déclare des variables. La structure de l'objet 'data' pour un bateau est différente de celle pour un album.
    // Un bateau a un tableau 'media' pour les images, on prend la première s'il en existe une.
    const imgBoat = data?.media?.[0]?.media_path ? `${BOAT_URL}/${data.media[0].media_path}` : null;
    const boatId = data?.id ?? 0;
    const boatName = data?.name ?? "Bateau inconnu";

    return (
        <div className="group bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 flex flex-col h-full">
            <Link to={`/boats/${boatId}`} className="block relative h-56 overflow-hidden">
                
                {/* Affichage des images : selon la manière dont est configuré ton Groupes de sérialisation API Platform */}
                {imgBoat ? (
                    <img 
                        src={imgBoat} 
                        alt={`Bateau ${boatName}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                        <svg className="w-16 h-16 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                )}

                <div className="absolute top-4 right-4">
                    <span className="bg-slate-950/80 backdrop-blur-md text-teal-400 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/20 shadow-lg">
                        {data?.type?.label || 'Inconnu'}
                    </span>
                </div>
            </Link>
            
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-1 line-clamp-1">
                    <Link to={`/boats/${boatId}`} className="hover:text-teal-400 transition-colors duration-200">{boatName}</Link>
                </h3>
                <span className="block text-teal-500/80 text-xs font-bold uppercase tracking-wider mb-3">
                    {data?.model?.label || data?.model?.name || 'Modèle inconnu'}
                </span>
                
                <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">
                    {data?.description || "Pas de description"}
                </p>
                
                {/* Footer de la carte */}
                <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5" title="Capacité">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            {data?.maxUser} pers.
                        </span>
                        <span className="flex items-center gap-1.5" title="Ville">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            {data?.adress?.city || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoatCard;
