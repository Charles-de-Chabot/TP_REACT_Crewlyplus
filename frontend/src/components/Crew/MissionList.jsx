import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const MissionCard = ({ mission, onAccept, onRefuse, isProcessing, userId, index }) => {
    const startDateRaw = mission?.rentalStart || mission?.rental_start;
    const endDateRaw = mission?.rentalEnd || mission?.rental_end;

    if (!mission || !startDateRaw) return null;

    // Check if I am already in the crew
    const isAlreadyAccepted = mission.crewMembers?.some(u => {
        const uId = typeof u === 'string' ? parseInt(u.split('/').pop()) : u.id;
        return uId === parseInt(userId);
    });

    const startDate = new Date(startDateRaw);
    const day = startDate.getDate();
    const month = startDate.toLocaleString('default', { month: 'short' });

    return (
        <div 
            className="bg-slate-950/40 backdrop-blur-sm border border-white/5 border-t-white/10 p-8 rounded-2xl hover:border-teal-500/30 transition-all group shadow-lg shadow-black/20 animate-stagger-fade opacity-0"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center gap-8">
                <div className="flex flex-col items-center justify-center w-20 h-20 bg-slate-950 rounded-xl border border-white/5 shadow-inner shrink-0 group-hover:border-teal-500/20 transition-colors">
                    <span className="text-[10px] font-black text-teal-500 uppercase tracking-[0.2em] mb-1">{month}.</span>
                    <span className="text-3xl font-black text-white italic leading-none font-mono tracking-tighter">{day}</span>
                </div>

                <div className="flex-1">
                    <h3 className="text-2xl font-black text-white italic mb-2 uppercase tracking-tighter group-hover:text-teal-400 transition-colors">
                        {mission.boat?.name || 'Bateau'}
                    </h3>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <IconRenderer icon="📅" size={14} className="text-slate-600" />
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                <span className="font-mono text-white/80">
                                    {new Date(startDateRaw).toLocaleDateString()}
                                </span>
                                <span className="mx-2 text-slate-700">→</span>
                                <span className="font-mono text-white/80">
                                    {new Date(endDateRaw).toLocaleDateString()}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isAlreadyAccepted ? (
                        <div className="flex items-center gap-3 px-8 py-4 bg-teal-500/10 text-teal-500 font-black text-[10px] uppercase tracking-widest rounded-xl border border-teal-500/20 shadow-glow-teal">
                            <IconRenderer icon="✅" size={16} />
                            Mission Confirmée
                        </div>
                    ) : (
                        <>
                            <button 
                                onClick={() => onRefuse(mission.id)}
                                disabled={isProcessing}
                                className="px-8 py-4 rounded-xl text-slate-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/5 transition-all disabled:opacity-50 flex items-center gap-3"
                            >
                                <IconRenderer icon="❌" size={14} />
                                Refuser
                            </button>
                            <button 
                                onClick={() => onAccept(mission.id)}
                                disabled={isProcessing}
                                className="px-10 py-4 rounded-xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl shadow-white/5 disabled:opacity-50 flex items-center gap-3"
                            >
                                {isProcessing ? (
                                    <IconRenderer icon="⌛" size={14} animate />
                                ) : (
                                    <>
                                        <IconRenderer icon="✅" size={14} />
                                        Prendre le poste
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export const MissionList = ({ missions, onAccept, onRefuse, processingId, userId }) => {
    if (missions.length === 0) {
        return (
            <div className="text-center py-24 bg-slate-950/20 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-6">
                <div className="p-6 bg-slate-900/50 rounded-full border border-white/5">
                    <IconRenderer icon="⚓" size={48} className="text-slate-800 opacity-20" />
                </div>
                <p className="text-slate-500 font-black italic uppercase tracking-[0.2em] text-xs">Alerte : Aucune mission disponible</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {missions.map((mission, index) => (
                <MissionCard 
                    key={mission.id} 
                    mission={mission} 
                    userId={userId}
                    index={index}
                    onAccept={onAccept}
                    onRefuse={onRefuse}
                    isProcessing={processingId === mission.id}
                />
            ))}
        </div>
    );
};

export default MissionCard;
