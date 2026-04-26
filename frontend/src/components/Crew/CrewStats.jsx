import React from 'react';

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
                <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-2xl">{s.icon}</span>
                        <div className={`w-2 h-2 rounded-full ${theme.primary.replace('text', 'bg')}`} />
                    </div>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{s.label}</p>
                    <p className="text-2xl font-black text-white mt-1">{s.value}</p>
                </div>
            ))}
        </div>
    );
};

export default CrewStats;
