import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const MissionCard = ({ mission, onAccept, onRefuse, isProcessing, userId }) => {
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
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-teal-500/30 transition-all group">
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-slate-950 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-[10px] font-black text-teal-500 uppercase tracking-tighter mb-0.5">{month}.</span>
                    <span className="text-2xl font-black text-white italic leading-none font-mono tracking-tighter">{day}</span>
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-black text-white italic mb-1">{mission.boat?.name || 'Bateau'}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <IconRenderer icon="📅" size={12} className="text-slate-600" />
                        <span className="font-mono">
                            Du {new Date(startDateRaw).toLocaleDateString()} au {new Date(endDateRaw).toLocaleDateString()}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {isAlreadyAccepted ? (
                        <div className="flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-500 font-black text-[10px] uppercase rounded-xl border border-green-500/30">
                            <IconRenderer icon="✅" size={14} />
                            Confirmé
                        </div>
                    ) : (
                        <>
                            <button 
                                onClick={() => onRefuse(mission.id)}
                                disabled={isProcessing}
                                className="px-6 py-3 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                <IconRenderer icon="❌" size={12} />
                                Refuser
                            </button>
                            <button 
                                onClick={() => onAccept(mission.id)}
                                disabled={isProcessing}
                                className="px-8 py-3 rounded-xl bg-white text-slate-950 text-[10px] font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-lg shadow-white/5 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isProcessing ? (
                                    <IconRenderer icon="⌛" size={12} animate />
                                ) : (
                                    <>
                                        <IconRenderer icon="✅" size={12} />
                                        Accepter
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
            <div className="text-center py-20 bg-slate-900/20 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center gap-4">
                <IconRenderer icon="⚓" size={48} className="text-slate-800 opacity-20" />
                <p className="text-slate-500 font-bold italic">Aucune mission disponible pour le moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {missions.map(mission => (
                <MissionCard 
                    key={mission.id} 
                    mission={mission} 
                    userId={userId}
                    onAccept={onAccept}
                    onRefuse={onRefuse}
                    isProcessing={processingId === mission.id}
                />
            ))}
        </div>
    );
};

export default MissionCard;
