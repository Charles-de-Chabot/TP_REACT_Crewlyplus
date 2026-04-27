import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useRegatta from '../../hooks/useRegatta';
import Layout from '../../components/UI/Layout';
import GlassCard from '../../components/ui/GlassCard';
import WindyMap from '../../components/Regatta/WindyMap';
import RegattaHero from '../../components/Regatta/RegattaHero';
import RegistrationBox from '../../components/Regatta/RegistrationBox';
import PageHeader from '../../components/UI/PageHeader';
import { Trophy, Users, FileText, Anchor, ArrowRight, Wind, Thermometer, Gauge, Navigation, ChevronLeft } from 'lucide-react';

const RegattaDetails = () => {
    const { id } = useParams();
    const { regatta, weather, loading } = useRegatta(id);

    if (loading) return (
        <Layout>
            <div className="flex justify-center items-center h-screen text-cyan-500">
                <Anchor className="animate-spin h-10 w-10" />
            </div>
        </Layout>
    );

    if (!regatta) return <Layout><div className="text-white p-20 text-center">Régate introuvable.</div></Layout>;

    return (
        <Layout>
            <PageHeader 
                title="Détails" 
                subtitle="Course" 
                description={`Informations tactiques : ${regatta.name}`}
                backPath="/regattas"
                backLabel="Retour au calendrier"
            />

            {/* Hero légèrement réduit */}
            <div className="h-[350px]">
                <RegattaHero regatta={regatta} />
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Map & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Map Container - Reduced size */}
                        <div className="max-w-4xl mx-auto">
                            <WindyMap lat={regatta.latitude} lon={regatta.longitude} name={regatta.name} />
                        </div>

                        {/* Weather Dashboard - REAL DATA */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <WeatherStat 
                                icon={<Wind className="text-cyan-400" size={18} />} 
                                label="Vitesse Vent" 
                                value={weather?.windSpeed || "---"} 
                                unit="kts" 
                            />
                            <WeatherStat 
                                icon={<Gauge className="text-orange-400" size={18} />} 
                                label="Rafales" 
                                value={weather?.windGusts || "---"} 
                                unit="kts" 
                                color="text-orange-400"
                            />
                            <WeatherStat 
                                icon={<Navigation 
                                    className="text-cyan-400 transition-transform duration-1000" 
                                    size={18} 
                                    style={{ transform: `rotate(${weather?.windDir || 0}deg)` }}
                                />} 
                                label="Direction" 
                                value={weather?.windDirText || "---"} 
                                unit={`${weather?.windDir || 0}°`} 
                            />
                            <WeatherStat 
                                icon={<Thermometer className="text-gold-sanded" size={18} />} 
                                label="Température" 
                                value={weather?.temp || "---"} 
                                unit="°C" 
                            />
                        </div>

                        {/* Description & Mission */}
                        <GlassCard className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Trophy className="text-gold-sanded" size={24} />
                                <h2 className="text-xl font-heading font-bold text-white uppercase tracking-widest">
                                    Présentation de la Course
                                </h2>
                            </div>
                            <p className="text-white/70 leading-relaxed text-sm md:text-base">
                                {regatta.description}
                            </p>
                        </GlassCard>

                        {/* Expert Opinion Box */}
                        <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Anchor size={80} />
                            </div>
                            <h3 className="text-cyan-400 font-bold uppercase text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
                                <div className="w-4 h-[1px] bg-cyan-400" /> Avis de l'Expert
                            </h3>
                            <p className="text-white/80 italic text-sm relative z-10">
                                "Un parcours technique exigeant une lecture fine du plan d'eau. La gestion des courants en début de journée sera la clé du podium."
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Registration & Workspace */}
                    <div className="space-y-6">
                        <RegistrationBox regatta={regatta} />

                        <GlassCard className="p-6 border-white/5 bg-white/5">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                                <Users size={16} className="text-cyan-400" /> Votre Équipage
                            </h3>
                            <p className="text-white/40 text-xs mb-6">
                                Gérez vos équipiers, centralisez les documents et préparez votre logistique.
                            </p>
                            <Link 
                                to={`/regattas/${regatta.id}/team`}
                                className="flex items-center justify-between w-full p-4 bg-white/5 hover:bg-white/10 rounded-xl transition-all group"
                            >
                                <span className="text-white text-sm font-bold tracking-wider">ESPACE ÉQUIPE</span>
                                <ArrowRight size={18} className="text-cyan-400 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </GlassCard>

                        <div className="p-4 border border-white/5 rounded-2xl bg-black/40">
                            <h4 className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-4 font-bold">Documents Requis</h4>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-white/60 text-xs italic">
                                    <FileText size={14} className="text-cyan-400/50" /> Licence FFV en cours de validité
                                </li>
                                <li className="flex items-center gap-3 text-white/60 text-xs italic">
                                    <FileText size={14} className="text-cyan-400/50" /> Certificat médical
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

// Petit composant interne pour les stats météo
const WeatherStat = ({ icon, label, value, unit, trend, color = "text-white" }) => (
    <GlassCard className="p-4 flex flex-col items-center justify-center text-center space-y-1 border-white/5">
        <div className="mb-1">{icon}</div>
        <span className="text-[8px] uppercase tracking-widest text-white/30 font-bold">{label}</span>
        <div className="flex items-baseline gap-1">
            <span className={`text-lg font-mono font-bold ${color}`}>{value}</span>
            <span className="text-[10px] text-white/40">{unit}</span>
        </div>
        {trend && (
            <span className="text-[8px] text-green-400 font-mono tracking-tighter">{trend}</span>
        )}
    </GlassCard>
);

export default RegattaDetails;
