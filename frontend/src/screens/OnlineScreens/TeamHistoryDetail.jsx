import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/UI/Layout';
import PageHeader from '../../components/UI/PageHeader';
import GlassCard from '../../components/ui/GlassCard';
import { useAuthContext } from '../../contexts/authContext';
import { useTeam } from '../../hooks/useTeam';
import TeamPerformance from '../../components/Crew/TeamPerformance';
import { Anchor, ChevronLeft, Trophy, Calendar } from 'lucide-react';
import { ChatProvider } from '../../contexts/ChatContext';

const TeamHistoryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuthContext();
    const { team, loading, refreshTeam } = useTeam();
    
    // Trouver la registration spécifique
    const registration = team?.registrations?.find(r => String(r.id) === String(id));

    if (loading) return (
        <Layout>
            <div className="flex items-center justify-center h-screen">
                <Anchor className="animate-spin text-cyan-500" size={48} />
            </div>
        </Layout>
    );

    if (!registration) return (
        <Layout>
            <div className="p-20 text-center text-white">Régate introuvable dans l'historique.</div>
        </Layout>
    );

    const isLeader = team?.leader?.id === parseInt(userId);

    return (
        <Layout>
            <ChatProvider teamId={team.id}>
                <div className="min-h-screen bg-slate-950 pb-20">
                <PageHeader 
                    title={registration.regatta?.name} 
                    subtitle="Analyse de Performance" 
                    description={`${registration.regatta?.location} • ${new Date(registration.regatta?.startDate).toLocaleDateString()}`}
                    backPath="/my-team"
                    backLabel="Retour au Cockpit"
                />

                <div className="container mx-auto px-4 mt-8">
                    <TeamPerformance 
                        registrations={[registration]} 
                        isLeader={isLeader}
                        onRefresh={refreshTeam}
                    />
                </div>
            </div>
        </ChatProvider>
        </Layout>
    );
};

export default TeamHistoryDetail;
