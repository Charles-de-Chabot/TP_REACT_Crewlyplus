import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/UI/Layout';
import CrewList from '../../components/Regatta/CrewList';
import DocumentVault from '../../components/User/DocumentVault';
import useTeamWorkspace from '../../hooks/useTeamWorkspace';
import { Clock, Download, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/UI/PageHeader';
import TeamHeader from '../../components/Crew/TeamHeader';
import TeamNoTeamView from '../../components/Crew/TeamNoTeamView';

const TeamWorkspace = () => {
    const { id } = useParams();
    const {
        team, loading, error, isExporting,
        createTeam, joinTeam, exportPack
    } = useTeamWorkspace(id);

    if (loading) return (
        <Layout>
            <div className="flex flex-col items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
                <div className="text-cyan-400 font-mono italic tracking-widest text-xs">CHARGEMENT_WORKSPACE...</div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <PageHeader 
                title="Espace" 
                subtitle="Équipage" 
                description={team ? `Équipe : ${team.name}` : "Gestion de l'équipage"}
                backPath={`/regattas/${id}`}
                backLabel="Détails Course"
            >
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
            </PageHeader>

            <div className="container mx-auto px-4 py-8">
                {error && (
                    <div className="max-w-4xl mx-auto mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                {!team ? (
                    <TeamNoTeamView 
                        onCreate={(name) => createTeam(name)} 
                        onJoin={(code) => joinTeam(code)} 
                    />
                ) : (
                    <div className="space-y-8 max-w-[1400px] mx-auto">
                        <TeamHeader team={team} />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            <div className="lg:col-span-1">
                                <CrewList members={team.members} team={team} />
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
