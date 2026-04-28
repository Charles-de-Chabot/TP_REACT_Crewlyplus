import React from 'react';
import { Anchor, Shield } from 'lucide-react';
import { TEAM_URL } from '../../constants/apiConstant';
import GlassCard from '../ui/GlassCard';

const TeamHeader = ({ team, onEdit }) => {
    if (!team) return null;

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-6 rounded-3xl border border-white/5 backdrop-blur-md mb-8">
            <div className="flex items-center gap-6">
                <div className="p-1 bg-cyan-500/10 rounded-2xl text-cyan-400 w-16 h-16 flex items-center justify-center overflow-hidden border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                    {team.emblem ? (
                        <img src={`${TEAM_URL}/${team.emblem}`} alt="emblem" className="w-full h-full object-cover" />
                    ) : (
                        <Anchor size={28} />
                    )}
                </div>
                <div>
                    <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
                        {team.name}
                    </h1>
                    <div className="flex items-center gap-4">
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <Shield size={12} className="text-cyan-400" /> Skipper : {team.leader?.firstname || 'Vous'}
                        </p>
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                            <span className="text-[9px] text-white/20 uppercase font-black">Invite Code :</span>
                            <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest select-all">{team.inviteCode}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {onEdit && (
                <button 
                    onClick={onEdit}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                >
                    Modifier les infos
                </button>
            )}
        </div>
    );
};

export default TeamHeader;
