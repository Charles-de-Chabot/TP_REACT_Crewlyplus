import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import PageLoader from '../../components/Loader/PageLoader';
import GlassCard from '../../components/ui/GlassCard';
import PremiumBadge from '../../components/ui/PremiumBadge';
import { MapPin, Calendar, Trophy, ArrowRight } from 'lucide-react';

const Regattas = () => {
    const [regattas, setRegattas] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegattas = async () => {
            try {
                const response = await api.get('/api/regattas');
                setRegattas(response.data['hydra:member'] || []);
            } catch (error) {
                console.error("Erreur lors de la récupération des régates:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegattas();
    }, []);

    if (loading) return <PageLoader />;

    return (
        <div className="flex flex-col w-full min-h-screen bg-nautical-dark text-white pt-24 pb-12 animate-slideup">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-heading font-bold text-glow-cyan mb-4">
                            Événements <span className="text-cyan-electric">Régates</span>
                        </h1>
                        <p className="text-white/60 max-w-xl">
                            Participez aux compétitions les plus prestigieuses. Accès exclusif aux membres Premium pour la création d'équipages.
                        </p>
                    </div>
                    <PremiumBadge className="md:mb-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regattas.map((regatta) => (
                        <GlassCard key={regatta.id} hover className="flex flex-col h-full group">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-xl bg-cyan-electric/10 border border-cyan-electric/20 text-cyan-electric">
                                    <Trophy size={24} />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 py-1 border border-white/10 rounded-full">
                                    {regatta.participants?.length || 0} participants
                                </span>
                            </div>

                            <h3 className="text-xl font-heading font-bold text-white mb-2 group-hover:text-cyan-electric transition-colors">
                                {regatta.name}
                            </h3>
                            
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <MapPin size={16} className="text-cyan-electric" />
                                    {regatta.location}
                                </div>
                                <div className="flex items-center gap-2 text-white/60 text-sm">
                                    <Calendar size={16} className="text-cyan-electric" />
                                    {new Date(regatta.startDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>

                            <p className="text-sm text-white/50 line-clamp-3 mb-8 flex-grow">
                                {regatta.description}
                            </p>

                            <button className="w-full flex items-center justify-between group/btn px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-electric/10 hover:border-cyan-electric/30 transition-all">
                                <span className="text-sm font-bold uppercase tracking-widest">Voir Détails</span>
                                <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Regattas;
