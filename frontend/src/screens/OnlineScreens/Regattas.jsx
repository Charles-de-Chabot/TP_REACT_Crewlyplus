import React, { useState, useEffect } from 'react';
import useRegattas from '../../hooks/useRegattas';
import Layout from '../../components/UI/Layout';
import PageLoader from '../../components/Loader/PageLoader';
import RegattaCard from '../../components/Regatta/RegattaCard';
import WindyMap from '../../components/Regatta/WindyMap';
import PremiumBadge from '../../components/ui/PremiumBadge';
import GlassCard from '../../components/ui/GlassCard';
import { AlertCircle, Map as MapIcon, List, Trophy, ShieldCheck, ArrowRight, Anchor } from 'lucide-react';
import { Link } from 'react-router-dom';

import PageHeader from '../../components/UI/PageHeader';

const Regattas = () => {
    const { regattas, loading, error } = useRegattas();
    const [selectedRegatta, setSelectedRegatta] = useState(null);

    useEffect(() => {
        if (regattas.length > 0 && !selectedRegatta) {
            setSelectedRegatta(regattas[0]);
        }
    }, [regattas, selectedRegatta]);

    if (loading) return <PageLoader />;

    return (
        <Layout>
            <div className="min-h-screen bg-[#050810]">
                
                <PageHeader 
                    title="Explorer" 
                    subtitle="Régates" 
                    description="Calendrier de Course 2026"
                    backPath="/"
                    backLabel="Retour à l'accueil"
                />

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row">
                    
                    {/* Left Sidebar - Regatta List (Sticky) */}
                    <div className="w-full lg:w-[450px] border-r border-white/5 bg-[#050810]/80 backdrop-blur-xl p-6 space-y-6 lg:sticky lg:top-[80px] lg:h-[calc(100vh-80px)] overflow-y-auto custom-scrollbar">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs flex items-center gap-3">
                                <AlertCircle size={14} />
                                <span>{error}</span>
                            </div>
                        )}
                        
                        {regattas.length > 0 ? (
                            regattas.map((regatta) => (
                                <RegattaCard 
                                    key={regatta.id} 
                                    regatta={regatta} 
                                    isSelected={selectedRegatta?.id === regatta.id}
                                    onSelect={setSelectedRegatta}
                                />
                            ))
                        ) : (
                            <div className="py-20 text-center text-white/20 text-sm italic">
                                Aucune régate trouvée...
                            </div>
                        )}
                    </div>

                    {/* Right Area - Details (Global Scroll) */}
                    <div className="flex-1 bg-[#020408] p-8 lg:p-12 min-h-screen">
                        {selectedRegatta ? (
                            <div className="max-w-4xl mx-auto space-y-8">
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                    {/* Square Map */}
                                    <div className="aspect-square w-full shadow-2xl shadow-cyan-500/10">
                                        <WindyMap 
                                            key={selectedRegatta.id}
                                            lat={selectedRegatta.latitude} 
                                            lon={selectedRegatta.longitude} 
                                            name={selectedRegatta.name} 
                                            fullHeight={true}
                                        />
                                    </div>

                                    {/* Quick Stats Panel */}
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Trophy className="text-gold-sanded" size={24} />
                                            <h2 className="text-3xl font-heading font-bold text-white leading-tight uppercase">
                                                {selectedRegatta.name}
                                            </h2>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                                <p className="text-[10px] text-white/40 uppercase mb-1">Localisation</p>
                                                <p className="text-sm font-bold text-white">{selectedRegatta.location}</p>
                                            </div>
                                            <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                                <p className="text-[10px] text-white/40 uppercase mb-1">Frais d'inscription</p>
                                                <p className="text-sm font-bold text-cyan-400 font-mono">{selectedRegatta.registrationPrice}€</p>
                                            </div>
                                        </div>

                                        <GlassCard className="p-6 bg-cyan-500/5 border-cyan-500/20">
                                            <div className="flex items-center gap-2 text-cyan-400 mb-3">
                                                <ShieldCheck size={18} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Avantage Premium</span>
                                            </div>
                                            <p className="text-sm text-white/70 leading-relaxed mb-6">
                                                Accès direct au team workspace et gestion simplifiée des documents d'équipage.
                                            </p>
                                            <Link 
                                                to={`/regattas/${selectedRegatta.id}`}
                                                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
                                            >
                                                VOIR LA FICHE COMPLÈTE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </GlassCard>
                                    </div>
                                </div>

                                {/* Bottom Detail Section */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <Anchor className="text-white/20" size={20} />
                                        <h3 className="text-lg font-heading font-bold text-white uppercase tracking-widest">
                                            Analyse de l'expert
                                        </h3>
                                    </div>
                                    <GlassCard className="p-8 border-l-4 border-gold-sanded relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-5">
                                            <Trophy size={80} />
                                        </div>
                                        <p className="text-lg text-white/80 italic leading-relaxed relative z-10">
                                            "{selectedRegatta.description}"
                                        </p>
                                    </GlassCard>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-white/20">
                                <MapIcon size={64} className="mb-4 opacity-10" />
                                <p className="text-xl font-heading font-light tracking-widest uppercase">Radar Tactique Hors-Ligne</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Regattas;
