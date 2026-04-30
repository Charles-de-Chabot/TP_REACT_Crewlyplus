import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const CrewInfoSidebar = ({ theme, user, onEdit }) => {
    const address = user?.address;
    const location = address ? `${address.city}, ${address.postcode}` : "Emplacement non défini";

    return (
        <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-10 shadow-2xl shadow-black/50 sticky top-28 overflow-hidden group transition-all duration-500 hover:border-gold-sanded/20">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-sanded/10 rounded-full blur-3xl group-hover:bg-gold-sanded/20 transition-all duration-700" />
            
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                <IconRenderer icon="ℹ️" size={24} className="text-gold-sanded bg-gold-sanded/10 p-1.5 rounded-lg" />
                Informations
            </h3>

            <div className="space-y-8 relative z-10">
                {/* Status Section */}
                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover/item:text-gold-sanded transition-colors uppercase tracking-[0.2em]">Disponibilité</p>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                        <p className="text-white font-bold">{user?.position || "Disponible pour missions"}</p>
                    </div>
                </div>

                {/* Email/Contact Section */}
                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover/item:text-gold-sanded transition-colors uppercase tracking-[0.2em]">Contact direct</p>
                    <div className="flex items-center gap-2">
                        <IconRenderer icon="📞" size={16} className="text-gold-sanded" />
                        <p className="text-white font-bold truncate tracking-tighter">{user?.phoneNumber || user?.email}</p>
                    </div>
                </div>

                {/* Location Section */}
                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover/item:text-gold-sanded transition-colors uppercase tracking-[0.2em]">Emplacement</p>
                    <div className="flex items-center gap-2">
                        <IconRenderer icon="📍" size={16} className="text-gold-sanded" />
                        <p className="text-white font-bold">{location}</p>
                    </div>
                </div>

                {/* Address Section */}
                {address && (
                    <div className="pt-8 border-t border-white/5 group/item">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 group-hover/item:text-gold-sanded transition-colors uppercase tracking-[0.2em]">Adresse</p>
                        <p className="text-white/60 text-xs font-bold leading-relaxed font-mono">
                            {address.houseNumber} {address.streetName}<br />
                            <span className="tracking-tighter">{address.postcode}</span> {address.city}
                        </p>
                    </div>
                )}
            </div>
            
            {/* Action Button */}
            <button 
                onClick={onEdit}
                className="w-full mt-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase hover:bg-white/10 hover:border-gold-sanded/30 hover:text-gold-sanded transition-all duration-300 flex items-center justify-center gap-3 group/btn"
            >
                <span>Modifier mon profil</span>
                <IconRenderer icon="✏️" size={14} className="opacity-40 group-hover/btn:opacity-100 transition-all" />
            </button>
        </div>
    );
};

export default CrewInfoSidebar;
