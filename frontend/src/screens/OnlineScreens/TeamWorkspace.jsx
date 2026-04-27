import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../../components/UI/Layout';
import GlassCard from '../../components/ui/GlassCard';
import CrewList from '../../components/Regatta/CrewList';
import DocumentVault from '../../components/User/DocumentVault';
import useTeamWorkspace from '../../hooks/useTeamWorkspace';
import { Users, Download, Clock, ChevronLeft, Plus, Send, Shield, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/UI/PageHeader';

const TeamWorkspace = () => {
    const { id } = useParams();
    const {
        team, loading, error, isExporting,
        createTeam, joinTeam, exportPack
    } = useTeamWorkspace(id);

    const [teamNameInput, setTeamNameInput] = useState("");
    const [inviteCodeInput, setInviteCodeInput] = useState("");

    if (loading) return <Layout><div className="flex justify-center p-20 text-cyan-400 font-mono italic">CHARGEMENT_WORKSPACE...</div></Layout>;

    return (
        <Layout>
            <PageHeader 
                title="Espace" 
                subtitle="Équipage" 
                description={team ? `Équipe : ${team.name}` : "Gestion de l'équipage"}
            >
                <div className="flex items-center gap-3">
                    <Link 
                        to={`/regattas/${id}`} 
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-white/5"
                    >
                        <ChevronLeft size={14} /> Détails Course
                    </Link>
                    {team && (
                        <button 
                            onClick={exportPack}
                            disabled={isExporting}
                            className={`px-6 py-2.5 bg-gold-sanded hover:bg-[#b38f4d] text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(197,160,89,0.3)] ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isExporting ? <Clock className="animate-spin" size={14} /> : <Download size={14} />}
                            {isExporting ? 'GÉNÉRATION...' : 'EXPORT DOSSIER'}
                        </button>
                    )}
                </div>
            </PageHeader>

            <div className="container mx-auto px-4 py-8">

                {error && (
                    <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {!team ? (
                    /* SCREEN: JOIN OR CREATE */
                    <div className="max-w-4xl mx-auto space-y-12 py-12">
                        <div className="text-center space-y-4">
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white uppercase tracking-tighter">
                                Rejoindre ou <span className="text-cyan-400">Créer</span>
                            </h1>
                            <p className="text-white/40 max-w-lg mx-auto text-sm">
                                Pour participer à cette régate, vous devez faire partie d'un équipage. Choisissez votre mode d'entrée.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Option 1: Create */}
                            <GlassCard className="p-8 border-cyan-500/20 flex flex-col justify-between hover:border-cyan-500/50 transition-colors">
                                <div>
                                    <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-6">
                                        <Plus size={28} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-4">Créer une Équipe</h2>
                                    <p className="text-sm text-white/40 mb-8 leading-relaxed">
                                        Devenez le Skipper. Vous pourrez inviter vos équipiers et centraliser les documents d'inscription.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder="Nom de l'équipage..." 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                                        value={teamNameInput}
                                        onChange={(e) => setTeamNameInput(e.target.value)}
                                    />
                                    <button 
                                        onClick={() => createTeam(teamNameInput)}
                                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs tracking-widest uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)]"
                                    >
                                        CRÉER MON ÉQUIPE
                                    </button>
                                </div>
                            </GlassCard>

                            {/* Option 2: Join */}
                            <GlassCard className="p-8 border-white/10 flex flex-col justify-between hover:border-white/30 transition-colors">
                                <div>
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white/60 mb-6">
                                        <Send size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-4">Rejoindre une Équipe</h2>
                                    <p className="text-sm text-white/40 mb-8 leading-relaxed">
                                        Entrez le code d'invitation envoyé par votre Skipper pour rejoindre un équipage déjà créé.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <input 
                                        type="text" 
                                        placeholder="Code d'invitation..." 
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-all font-mono text-center uppercase tracking-widest text-sm"
                                        value={inviteCodeInput}
                                        onChange={(e) => setInviteCodeInput(e.target.value)}
                                    />
                                    <button 
                                        onClick={() => joinTeam(inviteCodeInput)}
                                        className="w-full py-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs tracking-widest uppercase rounded-xl transition-all"
                                    >
                                        REJOINDRE L'ÉQUIPE
                                    </button>
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                ) : (
                    /* SCREEN: TEAM DASHBOARD */
                    <div className="space-y-12">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-6 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                                    <Users size={32} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-heading font-bold text-white mb-1 uppercase tracking-tight">
                                        {team.name}
                                    </h1>
                                    <div className="flex items-center gap-4">
                                        <p className="text-white/40 flex items-center gap-2 text-[10px] uppercase font-black tracking-widest">
                                            <Shield size={12} className="text-cyan-400" /> Skipper : {team.leader?.firstname || 'Vous'}
                                        </p>
                                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                                            <span className="text-[9px] text-white/20 uppercase font-mono">Code :</span>
                                            <span className="text-xs font-mono text-cyan-400 font-bold tracking-widest select-all">{team.inviteCode}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-1">
                                <CrewList members={team.members} />
                            </div>
                            <div className="lg:col-span-2">
                                <DocumentVault documents={[]} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TeamWorkspace;
