import React from 'react';

const MissionList = ({ missions, theme, onAccept, onReject }) => {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-black text-white px-4">Prochaines Missions</h3>
            {missions.length === 0 ? (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center">
                    <p className="text-slate-500 font-bold italic">Aucune mission pour le moment...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {missions.map(m => (
                        <div key={m.id} className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-slate-950 flex flex-col items-center justify-center border border-white/5 shrink-0">
                                    <span className="text-[10px] font-black text-teal-500 uppercase leading-none mb-1">
                                        {new Date(m.rentalStart).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                    </span>
                                    <span className="text-xl font-black text-white leading-none">
                                        {new Date(m.rentalStart).getDate()}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">{m.boat?.[0]?.name || "Bateau inconnu"}</h4>
                                    <p className="text-slate-500 text-xs font-medium">Du {new Date(m.rentalStart).toLocaleDateString()} au {new Date(m.rentalEnd).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {m.status === 'pending' ? (
                                    <>
                                        <button 
                                            onClick={() => onReject(m.id)}
                                            className="px-6 py-3 rounded-xl bg-red-500/10 text-red-500 text-xs font-black uppercase hover:bg-red-500/20 transition-all"
                                        >
                                            Refuser
                                        </button>
                                        <button 
                                            onClick={() => onAccept(m.id)}
                                            className={`px-8 py-3 rounded-xl bg-white text-slate-950 text-xs font-black uppercase hover:scale-105 active:scale-95 transition-all shadow-xl`}
                                        >
                                            Accepter
                                        </button>
                                    </>
                                ) : (
                                    <span className={`px-6 py-2 rounded-full border ${theme.border} ${theme.primary} text-[10px] font-black uppercase tracking-widest`}>
                                        {m.status === 'confirmed' ? 'Confirmée' : m.status}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MissionList;
