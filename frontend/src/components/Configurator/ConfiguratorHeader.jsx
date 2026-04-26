import React from 'react';
import BoatCalendar from '../Boat/BoatCalendar';

const ConfiguratorHeader = ({ boat, dates, onBack, onDateChange, isPremiumDiscount }) => {
    return (
        <>
            {/* Back Button */}
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors mb-8 group"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Retour à la fiche bateau</span>
            </button>

            {/* Header Information */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div>
                    <p className="text-teal-500 font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-teal-500/30" />
                        Configuration de l'expérience
                    </p>
                    <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter leading-none mb-6">
                        VOTRE EXPÉDITION <br />
                        <span className="text-transparent stroke-text">D'EXCEPTION.</span>
                    </h1>
                    <div className="flex items-center gap-6 text-slate-400 font-bold text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                            <span>{boat?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            <span>{dates.nbDays} jours</span>
                        </div>
                    </div>
                    {isPremiumDiscount && (
                        <p className="text-amber-500 text-[10px] font-bold mt-1 uppercase">✦ Remise Élite Incluse (-15%)</p>
                    )}
                </div>

                {/* Quick Date Picker */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl flex items-center gap-6">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-1">Dates du séjour</span>
                        <span className="text-white text-sm font-bold">
                            {dates.nbDays} Jours
                        </span>
                    </div>
                    <div className="h-10 w-[1px] bg-white/5" />
                    <BoatCalendar 
                        startDate={dates.start} 
                        endDate={dates.end} 
                        onDateChange={onDateChange} 
                    />
                </div>
            </div>
        </>
    );
};

export default ConfiguratorHeader;
