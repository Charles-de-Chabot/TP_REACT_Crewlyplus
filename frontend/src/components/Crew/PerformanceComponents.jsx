import React from 'react';
import GlassCard from '../ui/GlassCard';
import { Trophy, Gauge, Wind, BarChart3, ChevronRight, X, Share, CheckCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const ShareButton = ({ onClick }) => {
    const [sent, setSent] = React.useState(false);

    const handleShare = () => {
        onClick();
        setSent(true);
        setTimeout(() => setSent(false), 2000);
    };

    return (
        <button 
            onClick={handleShare}
            disabled={sent}
            className={`p-1.5 rounded-lg transition-all duration-300 flex items-center gap-2 group ${
                sent 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-white/5 border border-white/10 text-white/20 hover:text-cyan-400 hover:border-cyan-400/30 hover:bg-cyan-400/5'
            }`}
            title="Partager au Canal Tactique"
        >
            {sent ? (
                <>
                    <CheckCircle size={12} className="animate-in zoom-in duration-300" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Partagé</span>
                </>
            ) : (
                <Share size={12} className="group-hover:scale-110 transition-transform" />
            )}
        </button>
    );
};

// 1. Compteurs de Statistiques
export const PerformanceStats = ({ stats }) => {
    const bestRank = stats.length > 0 ? Math.min(...stats.map(s => s.ranking || 999)) : '--';
    const maxSpeed = stats.length > 0 ? Math.max(...stats.map(s => s.maxSpeed || 0)) : '--';
    const avgSpeed = stats.length > 0 ? (stats.reduce((acc, s) => acc + (s.avgSpeed || 0), 0) / stats.length).toFixed(1) : '--';

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatItem label="Meilleur Rang" value={bestRank === 999 ? '--' : bestRank} icon={<Trophy className="text-gold-sanded" size={14} />} />
            <StatItem label="Vitesse Max" value={maxSpeed} unit="kts" icon={<Gauge className="text-amber-400" size={14} />} />
            <StatItem label="Vitesse Moy." value={avgSpeed} unit="kts" icon={<Gauge className="text-cyan-400" size={14} />} />
            <StatItem label="Jours de Course" value={stats.length} icon={<BarChart3 className="text-white/40" size={14} />} />
        </div>
    );
};

const StatItem = ({ label, value, unit, icon }) => (
    <GlassCard className="p-4 text-center border-white/5">
        <div className="flex items-center justify-center gap-2 mb-1">
            {icon}
            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-xl font-black text-white">{value} <span className="text-[10px] text-white/40">{unit}</span></p>
    </GlassCard>
);

// 2. Graphiques de Performance
export const PerformanceCharts = ({ stats, onShare }) => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <GlassCard className="p-6 h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Trophy size={14} className="text-gold-sanded" /> Évolution du Classement
                </h4>
                {onShare && (
                    <ShareButton 
                        onClick={() => onShare(`Notre classement est passé au rang ${stats[stats.length-1]?.ranking || '--'} !`, 'TACTIQUE', 'ACTION', { chartData: true, score: 100 - (stats[stats.length-1]?.ranking * 10) })}
                    />
                )}
            </div>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="dayNumber" stroke="#ffffff40" fontSize={10} tickFormatter={(v) => `J${v}`} />
                        <YAxis reversed stroke="#ffffff40" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px', fontSize: '10px' }} />
                        <Line type="monotone" dataKey="ranking" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: '#06b6d4' }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>

        <GlassCard className="p-6 h-[300px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Gauge size={14} className="text-cyan-400" /> Courbe de Vitesse
                </h4>
                {onShare && (
                    <ShareButton 
                        onClick={() => onShare(`Vitesse max enregistrée : ${Math.max(...stats.map(s => s.maxSpeed || 0))} kts`, 'TACTIQUE', 'ACTION', { chartData: true, score: Math.max(...stats.map(s => s.maxSpeed || 0)) * 2 })}
                    />
                )}
            </div>
            <div className="flex-1 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats}>
                        <defs>
                            <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="dayNumber" stroke="#ffffff40" fontSize={10} tickFormatter={(v) => `J${v}`} />
                        <YAxis stroke="#ffffff40" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff20', borderRadius: '12px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="maxSpeed" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSpeed)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    </div>
);

// 3. Liste des Jours & Journal
export const PerformanceJournal = ({ stats, onViewStat }) => (
    <div className="space-y-3">
        {stats.map((stat) => (
            <button
                key={stat.id}
                onClick={() => onViewStat(stat)}
                className="w-full group flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-cyan-500/30 transition-all text-left"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50">
                        <span className="text-sm font-black text-white">J{stat.dayNumber}</span>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wider">
                            Rang: {stat.ranking}
                        </p>
                        <p className="text-[9px] text-white/30 uppercase font-black">
                            {stat.windConditions || 'Conditions non renseignées'}
                        </p>
                    </div>
                </div>
                <ChevronRight size={16} className="text-white/10 group-hover:text-cyan-500" />
            </button>
        ))}
    </div>
);
