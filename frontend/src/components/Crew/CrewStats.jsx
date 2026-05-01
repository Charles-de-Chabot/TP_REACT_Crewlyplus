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
        { label: 'Missions effectuées', value: missionCount, icon: '⚓' }
    ];

    if (rating > 0) {
        statsConfig.push({ label: 'Note moyenne', value: `${rating} / 5`, icon: '⭐' });
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${statsConfig.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
            {statsConfig.map((s, i) => (
                <div 
                    key={i} 
                    className="bg-slate-950/40 border border-white/5 border-t-white/10 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 animate-stagger-fade opacity-0"
                    style={{ animationDelay: `${i * 150}ms` }}
                >
                    {/* Background Detail */}
                    <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <IconRenderer icon={s.icon} size={100} />
                    </div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-accent-role shadow-lg`}>
                            <IconRenderer icon={s.icon} size={20} />
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-role shadow-[0_0_15px_var(--role-color)]" />
                    </div>
                    
                    <div className="relative z-10">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{s.label}</p>
                        <p className="text-3xl font-black text-white italic font-mono tracking-tighter">{s.value}</p>
                    </div>
                    
                    {/* Progress Bar Detail (Aesthetic only) */}
                    <div className="mt-6 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-accent-role opacity-20 w-2/3 group-hover:w-full transition-all duration-1000" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CrewStats;
