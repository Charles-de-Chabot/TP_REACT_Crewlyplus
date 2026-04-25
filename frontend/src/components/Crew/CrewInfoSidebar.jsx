import React from 'react';

const CrewInfoSidebar = ({ theme, user, onEdit }) => {
    const address = user?.address;
    const location = address ? `${address.city}, ${address.postcode}` : "Emplacement non défini";

    return (
        <div className={`p-8 rounded-[3rem] border ${theme.border} relative overflow-hidden bg-gradient-to-br ${theme.gradient} backdrop-blur-3xl`}>
            <h3 className="text-white font-black text-xl mb-8">Informations</h3>
            <div className="space-y-6">
                <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Status professionnel</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-white font-bold">{user?.position || "Disponible pour missions"}</p>
                    </div>
                </div>
                <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Emplacement actuel</p>
                    <p className="text-white font-bold">{location}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Contact</p>
                    <p className="text-white font-bold">{user?.phoneNumber || user?.email}</p>
                </div>
                {address && (
                    <div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Adresse de facturation</p>
                        <p className="text-white/60 text-xs font-bold leading-relaxed">
                            {address.houseNumber} {address.streetName}<br />
                            {address.postcode} {address.city}
                        </p>
                    </div>
                )}
            </div>
            
            <button 
                onClick={onEdit}
                className="w-full mt-12 py-4 border border-white/10 rounded-2xl text-white font-black text-xs uppercase hover:bg-white/5 transition-all"
            >
                Modifier mon profil
            </button>
        </div>
    );
};

export default CrewInfoSidebar;
