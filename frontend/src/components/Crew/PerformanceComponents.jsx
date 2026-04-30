import React from 'react';
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
                    : 'bg-white/5 border border-white/10 text-white/20 hover:text-gold-sanded hover:border-gold-sanded/30 hover:bg-gold-sanded/5'
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-2">
            <StatItem label="Meilleur Rang" value={bestRank === 999 ? '--' : bestRank} unit={bestRank === 1 ? 'er' : 'ème'} icon={<Trophy className="text-gold-sanded" size={16} />} />
            <StatItem label="Vitesse Max" value={maxSpeed} unit="kts" icon={<Gauge className="text-amber-400" size={16} />} />
            <StatItem label="Vitesse Moy." value={avgSpeed} unit="kts" icon={<Gauge className="text-gold-sanded/60" size={16} />} />
            <StatItem label="Jours de Course" value={stats.length} icon={<BarChart3 className="text-white/40" size={16} />} />
        </div>
    );
};

const StatItem = ({ label, value, unit, icon }) => (
    <div className="flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
            {icon}
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{label}</span>
        </div>
        <p className="text-3xl font-heading text-white">{value} <span className="text-xs text-white/20 font-black uppercase">{unit}</span></p>
    </div>
);

// 2. Graphiques de Performance
export const PerformanceCharts = ({ stats, onShare }) => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="h-[300px] flex flex-col p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="dayNumber" stroke="#ffffff20" fontSize={10} tickFormatter={(v) => `J${v}`} axisLine={false} tickLine={false} />
                        <YAxis reversed stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#020408', border: '1px solid #ffffff05', borderRadius: '16px', fontSize: '10px' }} />
                        <Line type="monotone" dataKey="ranking" stroke="#c5a059" strokeWidth={3} dot={{ r: 4, fill: '#c5a059', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#c5a059', stroke: '#fff', strokeWidth: 2 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="h-[300px] flex flex-col p-6 rounded-3xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
                    <Gauge size={14} className="text-gold-sanded/60" /> Courbe de Vitesse
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
                                <stop offset="5%" stopColor="#c5a059" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="dayNumber" stroke="#ffffff20" fontSize={10} tickFormatter={(v) => `J${v}`} axisLine={false} tickLine={false} />
                        <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#020408', border: '1px solid #ffffff05', borderRadius: '16px', fontSize: '10px' }} />
                        <Area type="monotone" dataKey="maxSpeed" stroke="#c5a059" strokeWidth={2} fillOpacity={1} fill="url(#colorSpeed)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
);

// 3. Liste des Jours & Journal
export const PerformanceJournal = ({ stats, onViewStat }) => (
    <div className="space-y-1">
        {stats.map((stat) => (
            <button
                key={stat.id}
                onClick={() => onViewStat(stat)}
                className="w-full group flex items-center justify-between py-3 px-4 transition-all duration-300 cursor-pointer rounded-2xl hover:bg-white/[0.02]"
            >
                <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 bg-white/[0.02] border-white/5 text-white/10 group-hover:border-gold-sanded/30 group-hover:text-gold-sanded">
                        <span className="text-sm font-black">J{stat.dayNumber}</span>
                    </div>
                    <div>
                        <p className="text-base font-bold text-white/80 group-hover:text-gold-sanded transition-colors">
                            Rang: {stat.ranking}{stat.ranking === 1 ? 'er' : 'ème'}
                        </p>
                        <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.2em] truncate max-w-[180px]">
                            {stat.windConditions || 'Conditions non renseignées'}
                        </p>
                    </div>
                </div>
                <ChevronRight size={16} className="text-white/5 group-hover:text-gold-sanded group-hover:translate-x-1 transition-all" />
            </button>
        ))}
    </div>
);
