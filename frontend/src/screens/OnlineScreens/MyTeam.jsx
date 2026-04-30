import React, { useState, useRef } from 'react';
import Layout from '../../components/UI/Layout';
import PageHeader from '../../components/UI/PageHeader';
import GlassCard from '../../components/ui/GlassCard';
import { IMAGE_URL, TEAM_URL, USER_URL } from '../../constants/apiConstant';
import { Users, Trophy, Settings, ChevronRight, Download, FileText, Clock, CheckCircle, Plus, LogOut, Anchor } from 'lucide-react';
import { useAuthContext } from '../../contexts/authContext';
import BoatDeck from '../../components/Crew/BoatDeck';
import TeamHeader from '../../components/Crew/TeamHeader';
import TeamNoTeamView from '../../components/Crew/TeamNoTeamView';
import TeamRegattaList from '../../components/Crew/TeamRegattaList';
import DocumentVault from '../../components/User/DocumentVault';
import { useTeam } from '../../hooks/useTeam';
import api from '../../api/axios';
import InviteUserModal from '../../components/Crew/InviteUserModal';

const MyTeam = () => {
    const { userId } = useAuthContext();
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const { 
        team, positions, myMembership, loading, updating, error,
        createTeam, joinTeam, updatePosition, leaveTeam, refreshTeam
    } = useTeam();

    const handleLeave = async () => {
        if (window.confirm("Êtes-vous sûr de vouloir quitter l'équipe ? Cette action est irréversible.")) {
            try {
                await leaveTeam();
            } catch (err) {
                console.error("Failed to leave team");
            }
        }
    };

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

    const bgRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!bgRef.current) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth) * 100;
        const y = (clientY / innerHeight) * 100;
        bgRef.current.style.setProperty('--mouse-x', `${x}%`);
        bgRef.current.style.setProperty('--mouse-y', `${y}%`);
    };

    const getPositionColor = (positionLabel) => {
        if (!positionLabel) return '#00f2ff'; // Fallback to Neon Cyan if no position selected
        
        const colors = {
            'ÉQUIPIER': '#94a3b8', // Slate Blue
            'NUMéRO 1': '#00f2ff', 
            'NUMéRO 2 (MâT)': '#3d5aff',
            'BARREUR': '#0070ff',
            'TACTITIEN': '#bf00ff',
            'RéGLEUR BâBORD': '#ff8c00',
            'RéGLEUR TRIBORD': '#ff8c00',
            'RéGLEUR GV': '#ff5e00',
            'PIANO': '#00ff88',
        };
        const key = positionLabel.toUpperCase();
        return colors[key] || '#00f2ff';
    };

    const positionColor = getPositionColor(myMembership?.position?.label);

    return (
        <Layout>
            <div 
                ref={bgRef}
                className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-slate-950"
                onMouseMove={handleMouseMove}
                style={{ 
                    '--mouse-x': '50%', 
                    '--mouse-y': '50%',
                    '--pos-color': positionColor
                }}
            >
                {/* Animated Background Mesh with Interactive Point Illumination */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Base Pattern (Static) */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                    
                    {/* Base Faint Grid */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>

                    {/* Illuminated Points - High intensity, no halo */}
                    <div 
                        className="absolute inset-0 opacity-80"
                        style={{ 
                            backgroundImage: 'radial-gradient(circle, var(--pos-color) 2px, transparent 2px)',
                            backgroundSize: '60px 60px',
                            maskImage: `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)`,
                            WebkitMaskImage: `radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)`,
                        }}
                    ></div>
                    
                    {/* Subtle Scanning Line */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[1px] w-full animate-scanline pointer-events-none opacity-10"></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-950/90 pointer-events-none"></div>

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
                                            {/* Mon Poste Card */}
                                            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-8 shadow-2xl shadow-black/50 overflow-hidden group transition-all duration-500 hover:border-gold-sanded/20 relative">
                                                {/* Background Glow */}
                                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-sanded/10 rounded-full blur-3xl group-hover:bg-gold-sanded/20 transition-all duration-700" />
                                                
                                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3 relative z-10">
                                                    <div className="p-1.5 bg-gold-sanded/10 rounded-lg">
                                                        <Anchor size={18} className="text-gold-sanded" />
                                                    </div>
                                                    Mon Poste
                                                </h3>

                                                <div className="relative z-10 space-y-4">
                                                    <div className="relative">
                                                        <select 
                                                            value={myMembership?.position?.id || ''}
                                                            onChange={(e) => updatePosition(e.target.value)}
                                                            disabled={updating}
                                                            className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white focus:border-gold-sanded/50 appearance-none disabled:opacity-50 transition-all font-bold ${updating ? 'border-gold-sanded/30' : 'border-white/10 hover:border-white/20'}`}
                                                        >
                                                            <option value="" disabled className="bg-slate-950">Choisir votre poste...</option>
                                                            {(!positions.find(p => p.label === 'Équipier')) && (
                                                                <option value="default_equiper" className="bg-slate-950">Équipier</option>
                                                            )}
                                                            {positions.map(pos => (
                                                                <option key={pos.id} value={pos.id} className="bg-slate-950">{pos.label}</option>
                                                            ))}
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                                            {updating ? <div className="w-3 h-3 border-2 border-gold-sanded border-t-transparent rounded-full animate-spin"></div> : <ChevronRight size={14} className="rotate-90" />}
                                                        </div>
                                                    </div>

                                                    <button 
                                                        onClick={handleLeave}
                                                        disabled={updating}
                                                        className="w-full py-3 border border-red-500/10 hover:bg-red-500/5 text-red-500/40 hover:text-red-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <LogOut size={12} /> Quitter l'équipage
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Équipage Card */}
                                            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-8 shadow-2xl shadow-black/50 overflow-hidden group transition-all duration-500 hover:border-gold-sanded/20 relative">
                                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-sanded/10 rounded-full blur-3xl group-hover:bg-gold-sanded/20 transition-all duration-700" />
                                                
                                                <div className="flex items-center justify-between mb-6 relative z-10">
                                                    <h3 className="text-lg font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                                                        <div className="p-1.5 bg-gold-sanded/10 rounded-lg">
                                                            <Users size={18} className="text-gold-sanded" />
                                                        </div>
                                                        Équipage
                                                    </h3>
                                                    {team.leader?.id === parseInt(userId) && (
                                                        <button 
                                                            onClick={() => setIsInviteModalOpen(true)}
                                                            className="w-8 h-8 flex items-center justify-center bg-gold-sanded/10 border border-gold-sanded/30 text-gold-sanded rounded-lg hover:scale-110 transition-all shadow-lg"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                                
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto hide-scrollbar relative z-10">
                                                    {team.memberships?.filter(m => !m.leftAt).map((m) => (
                                                        <div key={m.id} className="group/member flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl transition-all hover:bg-white/[0.05] hover:border-white/10">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-8 w-8 rounded-lg bg-gold-sanded/5 border border-gold-sanded/20 flex items-center justify-center text-gold-sanded font-black text-[10px] overflow-hidden relative">
                                                                    {m.user?.media?.[0]?.media_path ? (
                                                                        <img src={`${USER_URL}/${m.user.media[0].media_path.replace(/^\//, '')}`} className="w-full h-full object-cover" alt="" />
                                                                    ) : (
                                                                        <span>{m.user?.firstname?.charAt(0) || 'U'}</span>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs font-bold text-white/90 group-hover/member:text-gold-sanded transition-colors">{m.user?.firstname}</p>
                                                                    <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">{m.position?.label || 'Sans poste'}</p>
                                                                </div>
                                                            </div>
                                                            <div className={`w-1.5 h-1.5 rounded-full ${m.position ? 'bg-gold-sanded/50 shadow-[0_0_8px_rgba(197,160,89,0.4)]' : 'bg-white/5'}`} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Documents Card */}
                                            <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-8 shadow-2xl shadow-black/50 overflow-hidden group transition-all duration-500 hover:border-gold-sanded/20 relative">
                                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-sanded/10 rounded-full blur-3xl group-hover:bg-gold-sanded/20 transition-all duration-700" />
                                                
                                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-6 flex items-center gap-3 relative z-10">
                                                    <div className="p-1.5 bg-gold-sanded/10 rounded-lg">
                                                        <FileText size={18} className="text-gold-sanded" />
                                                    </div>
                                                    Documents
                                                </h3>

                                                <div className="space-y-3 relative z-10">
                                                    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all group/doc cursor-pointer">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-2 bg-gold-sanded/5 rounded-lg">
                                                                <FileText size={16} className="text-gold-sanded/40 group-hover/doc:text-gold-sanded transition-colors" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-xs font-bold text-white/80">CNI_Exemple.pdf</p>
                                                                <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Identité • Vérifié</p>
                                                            </div>
                                                            <CheckCircle size={14} className="text-green-500/40" />
                                                        </div>
                                                    </div>

                                                    <button className="w-full py-4 bg-gold-sanded/5 border border-gold-sanded/20 border-dashed rounded-xl text-[9px] font-black text-gold-sanded/60 uppercase hover:bg-gold-sanded/10 hover:border-gold-sanded/40 transition-all flex items-center justify-center gap-2">
                                                        <Plus size={14} /> Ajouter un document
                                                    </button>
                                                    <p className="text-[8px] text-white/10 italic text-center mt-3 px-2 leading-relaxed">
                                                        Ces documents permettent de générer <br /> automatiquement vos dossiers de régate.
                                                    </p>
                                                </div>
                                            </div>
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

                {/* Modale d'invitation */}
                {team && (
                    <InviteUserModal 
                        isOpen={isInviteModalOpen} 
                        onClose={() => setIsInviteModalOpen(false)} 
                        team={team}
                    />
                )}
            </div>
        </Layout>
    );
};
export default MyTeam;
