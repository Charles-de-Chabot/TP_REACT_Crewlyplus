import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Trophy, ChevronRight, Clock } from 'lucide-react';

const TeamRegattaList = ({ registrations }) => {
    const navigate = useNavigate();

    // Trier du plus récent au plus ancien
    const sortedRegs = [...registrations].sort((a, b) => 
        new Date(b.regatta?.startDate) - new Date(a.regatta?.startDate)
    );

    if (sortedRegs.length === 0) {
        return (
            <div className="p-8 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-white/20 text-xs font-black uppercase tracking-widest">Aucun historique de course</p>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Clock size={12} /> Historique des courses
                </h3>
                <div className="h-px flex-1 bg-white/5 mx-6"></div>
            </div>

            {sortedRegs.map((reg) => (
                <button
                    key={reg.id}
                    onClick={() => navigate(`/my-team/history/${reg.id}`)}
                    className="w-full group flex items-center justify-between py-3 px-4 transition-all duration-300 cursor-pointer rounded-2xl hover:bg-white/[0.02]"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 bg-white/[0.02] border-white/5 text-white/10 group-hover:border-gold-sanded/30 group-hover:text-gold-sanded">
                            <Trophy size={16} />
                        </div>
                        <div>
                            <p className="text-base font-bold text-white/80 group-hover:text-gold-sanded transition-colors truncate max-w-[220px]">
                                {reg.regatta?.name}
                            </p>
                            <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em] flex items-center gap-2">
                                {reg.regatta?.startDate ? new Date(reg.regatta.startDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Date inconnue'} • {reg.regatta?.location || 'Lieu non défini'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className={`text-[10px] font-black uppercase tracking-widest ${reg.finalPosition ? 'text-gold-sanded/60' : 'text-slate-500'}`}>
                                {reg.finalPosition ? `${reg.finalPosition}${reg.finalPosition === 1 ? 'er' : 'ème'}` : 'En cours'}
                            </p>
                            <p className="text-[9px] text-white/10 uppercase font-black tracking-tighter group-hover:text-white/30 transition-colors">Consulter les stats</p>
                        </div>
                        <ChevronRight size={16} className="text-white/5 group-hover:text-gold-sanded group-hover:translate-x-1 transition-all" />
                    </div>
                </button>
            ))}
        </div>
    );
};

export default TeamRegattaList;
