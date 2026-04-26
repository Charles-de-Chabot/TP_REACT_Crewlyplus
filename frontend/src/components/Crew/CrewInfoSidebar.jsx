import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const CrewInfoSidebar = ({ theme, user, onEdit }) => {
    const address = user?.address;
    const location = address ? `${address.city}, ${address.postcode}` : "Emplacement non défini";

    return (
        <div className={`p-8 rounded-2xl border ${theme.border} relative overflow-hidden bg-gradient-to-br ${theme.gradient} backdrop-blur-3xl`}>
            {/* Ambient Background Icon */}
            <div className={`absolute -top-10 -right-10 opacity-[0.03] ${theme.primary}`}>
                <IconRenderer icon="⚓" size={200} />
            </div>

            <h3 className="text-white font-black text-xl mb-8 italic uppercase tracking-tighter flex items-center gap-3">
                <IconRenderer icon="ℹ️" size={20} className={theme.primary} />
                Informations
            </h3>

            <div className="space-y-8 relative z-10">
                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Status professionnel</p>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                        <p className="text-white font-bold">{user?.position || "Disponible pour missions"}</p>
                    </div>
                </div>

                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Emplacement actuel</p>
                    <div className="flex items-center gap-3">
                        <IconRenderer icon="📍" size={16} className={theme.primary} />
                        <p className="text-white font-bold">{location}</p>
                    </div>
                </div>

                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Contact</p>
                    <div className="flex items-center gap-3">
                        <IconRenderer icon="📞" size={16} className={theme.primary} />
                        <p className="text-white font-bold truncate">{user?.phoneNumber || user?.email}</p>
                    </div>
                </div>

                {address && (
                    <div className="pt-8 border-t border-white/5 group/item">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 group-hover:text-white transition-colors">Adresse de facturation</p>
                        <div className="flex gap-3">
                            <IconRenderer icon="🗺️" size={16} className="text-slate-600 mt-0.5" />
                            <p className="text-white/60 text-xs font-bold leading-relaxed">
                                {address.houseNumber} {address.streetName}<br />
                                {address.postcode} {address.city}
                            </p>
                        </div>
                    </div>
                )}
            </div>
            
            <button 
                onClick={onEdit}
                className={`w-full mt-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 group/btn`}
            >
                Modifier mon profil
                <IconRenderer icon="✏️" size={12} className="opacity-40 group-hover/btn:opacity-100 transition-all" />
            </button>
        </div>
    );
};

export default CrewInfoSidebar;
