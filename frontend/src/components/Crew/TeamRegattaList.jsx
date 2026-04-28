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
        <div className="space-y-3">
            {sortedRegs.map((reg) => (
                <button
                    key={reg.id}
                    onClick={() => navigate(`/my-team/history/${reg.id}`)}
                    className="w-full group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-cyan-500/30 transition-all text-left"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex flex-col items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                            <Calendar size={14} className="text-white/40 mb-0.5" />
                            <span className="text-[7px] font-black text-white/60">
                                {reg.regatta?.startDate ? new Date(reg.regatta.startDate).getFullYear() : '--'}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate max-w-[180px]">
                                {reg.regatta?.name}
                            </p>
                            <p className="text-[9px] text-white/30 uppercase font-black tracking-widest">
                                {reg.regatta?.startDate ? new Date(reg.regatta.startDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }) : 'Date inconnue'} • {reg.regatta?.location || 'Lieu non défini'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gold-sanded uppercase">
                                {reg.finalPosition ? `Rang: ${reg.finalPosition}` : 'En cours'}
                            </p>
                            <p className="text-[8px] text-white/20 uppercase font-black">Voir stats</p>
                        </div>
                        <ChevronRight size={16} className="text-white/10 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all" />
                    </div>
                </button>
            ))}
        </div>
    );
};

export default TeamRegattaList;
