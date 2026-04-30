import React from 'react';
import { Anchor, Shield, Settings } from 'lucide-react';
import { TEAM_URL } from '../../constants/apiConstant';

const TeamHeader = ({ team, onEdit }) => {
    if (!team) return null;

    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-black/30 animate-slideup relative overflow-hidden group/header mb-8">
            {/* Decorative Background */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-gold-sanded/5 rounded-full blur-3xl group-hover/header:bg-gold-sanded/10 transition-all duration-700"></div>

            <div className="relative group/emblem cursor-pointer">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-4 border-gold-sanded/30 bg-slate-800 flex items-center justify-center shadow-lg shadow-gold-sanded/10 transition-all duration-500 group-hover/emblem:scale-105">
                    {team.emblem ? (
                        <img src={`${TEAM_URL}/${team.emblem}`} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                        <Anchor size={48} className="text-gold-sanded" />
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 drop-shadow-lg uppercase tracking-tighter italic">
                    {team.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                    <p className="text-slate-400 text-sm font-medium flex items-center gap-2">
                        <Shield size={14} className="text-gold-sanded" /> Skipper : {team.leader?.firstname || 'Vous'}
                    </p>
                    <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2 transition-all hover:border-gold-sanded/30">
                        <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">Invite Code :</span>
                        <span className="text-xs font-mono text-gold-sanded font-bold tracking-widest select-all">{team.inviteCode}</span>
                    </div>
                </div>
            </div>

            {onEdit && (
                <button 
                    onClick={onEdit}
                    className="flex-shrink-0 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-black text-xs uppercase hover:bg-white/10 hover:border-gold-sanded/30 hover:text-gold-sanded transition-all duration-300 flex items-center gap-3 group/btn shadow-lg"
                >
                    <Settings size={14} className="opacity-40 group-hover/btn:opacity-100 group-hover/btn:rotate-90 transition-all duration-500" />
                    <span>Gérer l'équipe</span>
                </button>
            )}
        </div>
    );
};

export default TeamHeader;
