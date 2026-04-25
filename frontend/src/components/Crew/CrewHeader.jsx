import React from 'react';

const CrewHeader = ({ theme, firstname, lastname, pendingCount }) => {
    return (
        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
            <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-4xl font-black border-2 ${theme.secondary} ${theme.border} ${theme.primary} ${theme.glow} shadow-2xl`}>
                {firstname?.[0]}{lastname?.[0]}
            </div>
            <div className="text-center md:text-left">
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 block ${theme.primary}`}>
                    Espace Professionnel • {theme.label}
                </span>
                <h1 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter leading-none">
                    BONJOUR, <span className={theme.primary}>{firstname?.toUpperCase()}.</span>
                </h1>
                <p className="text-slate-500 font-bold mt-4">
                    Vous avez {pendingCount} nouvelles missions en attente.
                </p>
            </div>
        </div>
    );
};

export default CrewHeader;
