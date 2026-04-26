import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const CrewStats = ({ theme, stats = {} }) => {
    const {
        monthlyEarnings = 0,
        totalEarnings = 0,
        missionCount = 0,
        rating = 0
    } = stats;

    const statsConfig = [
        { label: 'Revenus ce mois', value: `${monthlyEarnings} €`, icon: '💰' },
        { label: 'Total généré', value: `${totalEarnings} €`, icon: '📈' },
        { label: 'Missions effectuées', value: missionCount, icon: '⚓' },
        { label: 'Note moyenne', value: `${rating} / 5`, icon: '⭐' }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statsConfig.map((s, i) => (
                <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl relative overflow-hidden group">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <IconRenderer icon={s.icon} size={80} />
                    </div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className={`w-10 h-10 rounded-2xl ${theme.secondary} border ${theme.border} flex items-center justify-center ${theme.primary}`}>
                            <IconRenderer icon={s.icon} size={20} />
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${theme.primary.replace('text', 'bg')} shadow-[0_0_10px_currentColor]`} />
                    </div>
                    
                    <div className="relative z-10">
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{s.label}</p>
                        <p className="text-2xl font-black text-white mt-2 italic font-mono tracking-tighter">{s.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CrewStats;
