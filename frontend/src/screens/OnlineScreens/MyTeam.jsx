import React, { useState } from 'react';
import Layout from '../../components/UI/Layout';
import PageHeader from '../../components/UI/PageHeader';
import GlassCard from '../../components/ui/GlassCard';
import { IMAGE_URL, TEAM_URL, USER_URL } from '../../constants/apiConstant';
import { Users, Trophy, Settings, ChevronRight, Download, FileText, Clock, CheckCircle, Plus } from 'lucide-react';
import { useAuthContext } from '../../contexts/authContext';
import BoatDeck from '../../components/Crew/BoatDeck';
import TeamHeader from '../../components/Crew/TeamHeader';
import TeamNoTeamView from '../../components/Crew/TeamNoTeamView';
import TeamRegattaList from '../../components/Crew/TeamRegattaList';
import DocumentVault from '../../components/User/DocumentVault';
import { useTeam } from '../../hooks/useTeam';
import api from '../../api/axios';

const MyTeam = () => {
    const { userId } = useAuthContext();
    const { 
        team, positions, myMembership, loading, updating, error,
        createTeam, joinTeam, updatePosition, refreshTeam
    } = useTeam();

    const handleCreate = async (name, desc, file) => {
        try {
            await createTeam(name, desc, file);
        } catch (err) {
            alert("Erreur lors de la création.");
        }
    };

    const handleJoin = async (code) => {
        try {
            await joinTeam(code);
        } catch (err) {
            alert("Code invalide ou équipe introuvable.");
        }
    };

    const exportPack = () => {
        alert("Génération du dossier d'inscription (Licences + CNI) en cours...");
    };

    return (
        <Layout>
            <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950">
                {/* Video Background */}
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale blur-[3px]">
                    <source src={`${IMAGE_URL}/trailer.mp4`} type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/40 to-slate-950"></div>

                <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between pr-8">
                        <PageHeader title="Ecurie Elite" subtitle="Ma Team" description="Dashboard Skipper" backPath="/" />
                        {team && (
                            <button 
                                onClick={exportPack}
                                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                            >
                                <Download size={14} /> EXPORT DOSSIER
                            </button>
                        )}
                    </div>

                    <div className="flex-1 p-6">
                        {loading ? (
                            <div className="h-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                            </div>
                        ) : team ? (
                            <div className="max-w-[1700px] mx-auto">
                                    <TeamHeader team={team} />

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                                        {/* Column 1 - Crew & Documents (Span 3) */}
                                        <div className="lg:col-span-3 space-y-4">
                                            <GlassCard className="p-4 border-l-4 border-cyan-500">
                                                <h3 className="text-[9px] font-black text-cyan-500 uppercase tracking-[0.2em] mb-3">Mon Poste</h3>
                                                <div className="relative">
                                                    <select 
                                                        value={myMembership?.position?.id || ''}
                                                        onChange={(e) => updatePosition(e.target.value)}
                                                        disabled={updating}
                                                        className={`w-full bg-slate-900/50 border rounded-xl px-4 py-2 text-sm text-white focus:border-cyan-500 appearance-none disabled:opacity-50 transition-colors ${updating ? 'border-cyan-500/50' : 'border-white/10'}`}
                                                    >
                                                        <option value="" disabled>Choisir...</option>
                                                        {positions.map(pos => (
                                                            <option key={pos.id} value={pos.id}>{pos.label}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                                        {updating ? <div className="w-3 h-3 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div> : <ChevronRight size={14} className="rotate-90" />}
                                                    </div>
                                                </div>
                                            </GlassCard>

                                            <GlassCard className="p-4 border-white/5">
                                                <h3 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                                                    <Users size={12} /> Équipage ({team.memberships?.length})
                                                </h3>
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                                                    {team.memberships?.filter(m => !m.leftAt).map((m) => (
                                                        <div key={m.id} className="group flex items-center justify-between p-2 bg-white/5 border border-white/5 rounded-lg transition-all hover:bg-white/10">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-7 w-7 rounded-full bg-slate-900 flex items-center justify-center font-bold text-[9px] text-white group-hover:border-cyan-500/50 border border-white/10 overflow-hidden">
                                                                    {m.user?.media?.[0]?.media_path ? (
                                                                        <img 
                                                                            src={`${USER_URL}/${m.user.media[0].media_path}`} 
                                                                            alt={m.user.firstname} 
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        m.user?.firstname?.charAt(0) || 'U'
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">{m.user?.firstname}</p>
                                                                    <p className="text-[8px] text-white/30 uppercase font-black tracking-widest">{m.position?.label || 'Sans poste'}</p>
                                                                </div>
                                                            </div>
                                                            <div className={`w-1 h-1 rounded-full ${m.position ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'bg-white/10'}`} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </GlassCard>

                                            <GlassCard className="p-4 border-white/5">
                                                <h3 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                                                    <FileText size={12} /> Documents
                                                </h3>
                                                <div className="space-y-2">
                                                    {/* Placeholder Style */}
                                                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl opacity-50 grayscale relative overflow-hidden group">
                                                        <div className="absolute top-0 right-0 bg-white/10 px-2 py-0.5 text-[7px] font-black text-white/40 uppercase tracking-widest rounded-bl-lg">
                                                            Exemple
                                                        </div>
                                                        <p className="text-[10px] text-white font-bold mb-1 italic">CNI_Exemple.pdf</p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[8px] text-white/40 uppercase font-black">Identité (Démo)</span>
                                                            <CheckCircle size={10} className="text-white/20" />
                                                        </div>
                                                    </div>

                                                    <button className="w-full py-3 bg-cyan-500/10 border border-cyan-500/30 border-dashed rounded-xl text-[9px] font-black text-cyan-400 uppercase hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2">
                                                        <Plus size={12} /> Ajouter un document
                                                    </button>
                                                    <p className="text-[8px] text-white/20 italic text-center mt-2 px-2">
                                                        Les documents servent à la génération automatique du dossier de régate.
                                                    </p>
                                                </div>
                                            </GlassCard>
                                        </div>

                                        {/* Column 2 - Tactical Radar (Span 5) */}
                                        <div className="lg:col-span-5 h-[700px]">
                                            <GlassCard className="h-full relative overflow-hidden bg-[#050810]/60 border-cyan-500/10 shadow-2xl">
                                                <div className="absolute top-4 left-6 z-20">
                                                    <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                                        Radar Tactique
                                                    </h3>
                                                </div>
                                                <BoatDeck members={team.memberships || []} />
                                            </GlassCard>
                                        </div>

                                        {/* Column 3 - History List (Span 4) */}
                                        <div className="lg:col-span-4 space-y-4">
                                            <div className="flex items-center gap-2 pl-2">
                                                <Trophy size={14} className="text-gold-sanded" />
                                                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Historique des Régates</h3>
                                            </div>
                                            <TeamRegattaList 
                                                registrations={team.registrations || []} 
                                            />
                                        </div>
                                    </div>

                                </div>
                        ) : (
                            <TeamNoTeamView onCreate={handleCreate} onJoin={handleJoin} updating={updating} />
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};
export default MyTeam;
