import React, { memo, useState } from 'react';
import { Users, CheckCircle, Plus } from 'lucide-react';
import { useAuthContext } from '../../contexts/authContext';
import InviteUserModal from '../Crew/InviteUserModal';
import IconRenderer from '../UI/IconRenderer';

const CrewList = memo(({ members, team }) => {
    const { userId } = useAuthContext();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    
    const isLeader = team?.leader?.id === parseInt(userId) || team?.leader === `/api/users/${userId}`;

    return (
        <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-10 shadow-2xl shadow-black/50 overflow-hidden group transition-all duration-500 hover:border-gold-sanded/20 relative">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-sanded/10 rounded-full blur-3xl group-hover:bg-gold-sanded/20 transition-all duration-700" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                    <IconRenderer icon="👥" size={24} className="text-gold-sanded bg-gold-sanded/10 p-1.5 rounded-lg" />
                    Mon Équipage
                </h3>
                
                {isLeader && (
                    <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-8 h-8 flex items-center justify-center bg-gold-sanded/10 border border-gold-sanded/30 text-gold-sanded rounded-lg hover:scale-110 transition-all shadow-lg"
                        title="Inviter un équipier"
                    >
                        <Plus size={16} />
                    </button>
                )}
            </div>

            <div className="space-y-4 relative z-10">
                {members && members.length > 0 ? (
                    members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gold-sanded/5 flex items-center justify-center text-gold-sanded font-black border border-gold-sanded/20">
                                    {member.firstname ? member.firstname.charAt(0) : member.name?.charAt(0) || '?'}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white/90">{member.firstname || member.name}</p>
                                    <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-black italic">{member.position || 'Équipier'}</p>
                                </div>
                            </div>
                            {member.is_active !== false ? (
                                <CheckCircle className="text-green-500/60" size={16} />
                            ) : (
                                <div className="text-[8px] bg-amber-500/10 text-amber-500/60 px-2 py-0.5 rounded border border-amber-500/20 font-black uppercase tracking-widest">
                                    Incomplet
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">Aucun membre</p>
                    </div>
                )}

                {isLeader && (
                    <button 
                        onClick={() => setIsInviteModalOpen(true)}
                        className="w-full py-4 border border-dashed border-white/10 rounded-xl text-white/20 hover:text-gold-sanded hover:border-gold-sanded/50 hover:bg-gold-sanded/5 transition-all text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                    >
                        <Plus size={14} /> Inviter
                    </button>
                )}
            </div>

            {team && (
                <InviteUserModal 
                    isOpen={isInviteModalOpen} 
                    onClose={() => setIsInviteModalOpen(false)} 
                    team={team}
                />
            )}
        </div>
    );
});

export default CrewList;
