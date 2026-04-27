import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Users, CheckCircle, Plus } from 'lucide-react';

const CrewList = ({ members }) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
                <Users className="text-cyan-400" size={24} />
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Équipage</h2>
            </div>
            <div className="space-y-4">
                {members.map(member => (
                    <GlassCard key={member.id} className="p-4 flex items-center justify-between border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">{member.name}</p>
                                <p className="text-[10px] text-white/40 uppercase">{member.role}</p>
                            </div>
                        </div>
                        {member.verified ? (
                            <CheckCircle className="text-green-500" size={18} />
                        ) : (
                            <div className="text-[10px] bg-gold-sanded/10 text-gold-sanded px-2 py-0.5 rounded border border-gold-sanded/20 font-bold uppercase">
                                Docs manquants
                            </div>
                        )}
                    </GlassCard>
                ))}
                <button className="w-full py-4 border border-dashed border-white/10 rounded-xl text-white/40 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all text-sm font-bold flex items-center justify-center gap-2">
                    <Plus size={18} /> INVITER UN ÉQUIPIER
                </button>
            </div>
        </div>
    );
};

export default CrewList;
