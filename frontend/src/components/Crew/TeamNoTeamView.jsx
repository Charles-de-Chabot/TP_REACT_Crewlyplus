import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import { Users, Target, Anchor } from 'lucide-react';

const TeamNoTeamView = ({ onCreate, onJoin, updating }) => {
    const [newTeamName, setNewTeamName] = useState("");
    const [newTeamDesc, setNewTeamDesc] = useState("");
    const [emblemFile, setEmblemFile] = useState(null);
    const [inviteCode, setInviteCode] = useState("");

    return (
        <div className="h-full flex flex-col items-center justify-center max-w-4xl mx-auto py-12">
            <div className="text-center mb-12 animate-fade-in">
                <Users size={64} className="mx-auto mb-4 text-cyan-500/20" />
                <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter">Votre Écurie vous attend</h2>
                <p className="text-slate-400 mt-2">Créez votre propre équipe ou rejoignez un équipage existant.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4">
                {/* Create Team */}
                <GlassCard className="p-8 border-t-4 border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all">
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                        <Target className="text-cyan-400" size={20} /> Créer mon Écurie
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); onCreate(newTeamName, newTeamDesc, emblemFile); }} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Nom de l'équipe</label>
                            <input 
                                type="text" 
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                                placeholder="Ex: Black Pearl Racing"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Description</label>
                            <textarea 
                                value={newTeamDesc}
                                onChange={(e) => setNewTeamDesc(e.target.value)}
                                placeholder="Votre philosophie..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500 transition-all outline-none h-20 resize-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Emblème</label>
                            <input 
                                type="file" 
                                onChange={(e) => setEmblemFile(e.target.files[0])}
                                className="hidden" 
                                id="emblem-upload"
                                accept="image/*"
                            />
                            <label 
                                htmlFor="emblem-upload"
                                className="flex items-center justify-center gap-2 w-full bg-white/5 border border-white/10 border-dashed rounded-xl px-4 py-3 text-white/60 hover:text-cyan-400 hover:border-cyan-500/50 transition-all cursor-pointer text-xs font-bold"
                            >
                                <Target size={16} />
                                {emblemFile ? emblemFile.name : "Choisir une image..."}
                            </label>
                        </div>
                        <button 
                            disabled={updating}
                            className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
                        >
                            {updating ? "CRÉATION..." : "FONDER L'ÉCURIE"}
                        </button>
                    </form>
                </GlassCard>

                {/* Join Team */}
                <GlassCard className="p-8 border-t-4 border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.1)] transition-all">
                    <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                        <Anchor className="text-amber-400" size={20} /> Rejoindre un Équipage
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); onJoin(inviteCode); }} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest block mb-2">Code d'invitation</label>
                            <input 
                                type="text" 
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                placeholder="Ex: CREW-XXXXX"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber-500 transition-all outline-none uppercase font-mono text-center tracking-widest"
                            />
                        </div>
                        <div className="py-2">
                            <p className="text-[10px] text-white/30 italic">Le code secret est fourni par votre Skipper.</p>
                        </div>
                        <button 
                            disabled={updating}
                            className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                        >
                            {updating ? "JONCTION..." : "INTÉGRER L'ÉQUIPAGE"}
                        </button>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
};

export default TeamNoTeamView;
