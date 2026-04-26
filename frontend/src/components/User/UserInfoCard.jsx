import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const UserInfoCard = ({ userData, onEdit }) => {
    const address = userData?.address;
    const location = address ? `${address.city}, ${address.postcode}` : "Emplacement non défini";
    const phone = userData?.phoneNumber || userData?.phone_number || "Non renseigné";

    return (
        <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-10 shadow-2xl shadow-black/50 sticky top-28 overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl group-hover:bg-teal-500/20 transition-all duration-700" />
            
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                <IconRenderer icon="ℹ️" size={24} className="text-teal-500 bg-teal-500/10 p-1.5 rounded-lg" />
                Mes Infos
            </h3>

            <div className="space-y-8 relative z-10">
                {/* Email Section */}
                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover/item:text-teal-500 transition-colors">Email de contact</p>
                    <p className="text-white font-bold break-all">{userData?.email}</p>
                </div>

                {/* Phone Section */}
                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover/item:text-teal-500 transition-colors">Téléphone</p>
                    <div className="flex items-center gap-2">
                        <IconRenderer icon="📞" size={16} className="text-teal-500" />
                        <p className="text-white font-bold font-mono tracking-tighter">{phone}</p>
                    </div>
                </div>

                {/* Location Section */}
                <div className="group/item">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 group-hover/item:text-teal-500 transition-colors">Emplacement</p>
                    <div className="flex items-center gap-2">
                        <IconRenderer icon="📍" size={16} className="text-teal-500" />
                        <p className="text-white font-bold">{location}</p>
                    </div>
                </div>

                {/* Full Address if exists */}
                {address && (
                    <div className="pt-6 border-t border-white/5 group/item">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 group-hover/item:text-teal-500 transition-colors">Adresse de facturation</p>
                        <p className="text-white/60 text-xs font-bold leading-relaxed font-mono">
                            {address.houseNumber} {address.streetName}<br />
                            <span className="tracking-tighter">{address.postcode}</span> {address.city}
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Button */}
            <button 
                onClick={onEdit}
                className="w-full mt-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase hover:bg-white/10 hover:border-teal-500/30 hover:text-teal-400 transition-all duration-300 flex items-center justify-center gap-3 group/btn"
            >
                <span>Modifier mon profil</span>
                <IconRenderer icon="✏️" size={14} className="opacity-40 group-hover/btn:opacity-100 transition-opacity" />
            </button>
        </div>
    );
};

export default UserInfoCard;