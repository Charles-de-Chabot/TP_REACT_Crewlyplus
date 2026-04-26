import React from 'react';
import { Link } from 'react-router-dom';
import { BOAT_URL } from '../../constants/apiConstant';
import IconRenderer from '../UI/IconRenderer';

const BoatCard = ({ data }) => {
    const imgBoat = data?.media?.[0]?.media_path ? `${BOAT_URL}/${data.media[0].media_path}` : null;
    const boatId = data?.id ?? 0;
    const boatName = data?.name ?? "Bateau inconnu";

    return (
        <div className="group bg-slate-950/60 backdrop-blur-md border border-white/5 border-t-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-glow-teal hover:border-teal-500/20">
            <Link to={`/boats/${boatId}`} className="block relative h-60 overflow-hidden scan-line">
                {imgBoat ? (
                    <img 
                        src={imgBoat} 
                        alt={`Bateau ${boatName}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    />
                ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-1000">
                        <IconRenderer icon="🖼️" size={64} className="text-slate-800 opacity-20" />
                    </div>
                )}

                <div className="absolute top-4 right-4">
                    <span className="bg-slate-950/80 backdrop-blur-md text-teal-500 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-lg border border-white/5 shadow-xl shadow-black/50">
                        {data?.type?.label || 'Inconnu'}
                    </span>
                </div>
                
                {/* Overlay Gradient for image depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            
            <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-white mb-1 line-clamp-1 italic tracking-tighter">
                    <Link to={`/boats/${boatId}`} className="hover:text-teal-400 transition-colors duration-300 uppercase">{boatName}</Link>
                </h3>
                <span className="block text-teal-500/80 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                    {data?.model?.label || data?.model?.name || 'Modèle inconnu'}
                </span>
                
                <p className="text-slate-500 text-xs font-medium leading-relaxed mb-8 line-clamp-2 flex-grow">
                    {data?.description || "Pas de description technique disponible pour ce navire d'exception."}
                </p>
                
                {/* Footer de la carte */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 group/stat">
                            <IconRenderer icon="👥" size={16} className="text-slate-600 group-hover/stat:text-teal-500 transition-colors" />
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Capacité</p>
                                <p className="text-sm font-black font-mono text-white tracking-tighter">{data?.maxUser || '-'}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 group/stat">
                            <IconRenderer icon="📍" size={16} className="text-slate-600 group-hover/stat:text-teal-500 transition-colors" />
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">Port</p>
                                <p className="text-sm font-black text-white/80 tracking-tight uppercase">{data?.adress?.city || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BoatCard;
