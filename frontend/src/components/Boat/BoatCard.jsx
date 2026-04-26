import React from 'react';
import { Link } from 'react-router-dom';
import { BOAT_URL } from '../../constants/apiConstant';
import IconRenderer from '../UI/IconRenderer';

const BoatCard = ({ data }) => {
    const imgBoat = data?.media?.[0]?.media_path ? `${BOAT_URL}/${data.media[0].media_path}` : null;
    const boatId = data?.id ?? 0;
    const boatName = data?.name ?? "Bateau inconnu";

    return (
        <div className="group bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-teal-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 flex flex-col h-full">
            <Link to={`/boats/${boatId}`} className="block relative h-56 overflow-hidden">
                {imgBoat ? (
                    <img 
                        src={imgBoat} 
                        alt={`Bateau ${boatName}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                        <IconRenderer icon="🖼️" size={64} className="text-slate-700 opacity-30" />
                    </div>
                )}

                <div className="absolute top-4 right-4">
                    <span className="bg-slate-950/80 backdrop-blur-md text-teal-400 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-teal-500/20 shadow-lg">
                        {data?.type?.label || 'Inconnu'}
                    </span>
                </div>
            </Link>
            
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-white mb-1 line-clamp-1 italic italic-none tracking-tighter">
                    <Link to={`/boats/${boatId}`} className="hover:text-teal-400 transition-colors duration-200 uppercase">{boatName}</Link>
                </h3>
                <span className="block text-teal-500/80 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    {data?.model?.label || data?.model?.name || 'Modèle inconnu'}
                </span>
                
                <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 line-clamp-2 flex-grow">
                    {data?.description || "Pas de description technique disponible pour ce navire."}
                </p>
                
                {/* Footer de la carte */}
                <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" title="Capacité">
                            <IconRenderer icon="👥" size={14} className="text-teal-500/50" />
                            <span className="font-mono tracking-tighter">{data?.maxUser}</span> Pers.
                        </span>
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" title="Ville">
                            <IconRenderer icon="📍" size={14} className="text-teal-500/50" />
                            {data?.adress?.city || 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoatCard;
