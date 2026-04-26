import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCrewRole } from '../../store/booking/bookingSlice';
import { selectSelectedCrew } from '../../store/booking/bookingSelectors';

const CrewSelector = ({ roleConfig }) => {
    const dispatch = useDispatch();
    const selectedCrew = useSelector(selectSelectedCrew);
    
    // On considère qu'ils sont disponibles par défaut pour l'instant
    const isAvailable = true; 
    const isSelected = selectedCrew.includes(roleConfig.role);

    return (
        <div 
            onClick={() => isAvailable && dispatch(toggleCrewRole(roleConfig.role))}
            className={`p-1 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden ${
                isSelected
                ? 'bg-gradient-to-br from-teal-500/20 to-blue-500/10 border-teal-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/20'
            } ${!isAvailable && 'opacity-50 cursor-not-allowed grayscale'}`}
        >
            <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* Left Side: Icon & Price */}
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-32 shrink-0">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border transition-all ${
                        isSelected ? 'bg-slate-900 border-teal-500/50 shadow-lg shadow-teal-500/10' : 'bg-slate-900 border-white/5'
                    }`}>
                        {roleConfig.icon}
                    </div>
                    <div className="flex flex-col">
                        <h3 className={`font-black text-lg transition-colors leading-tight ${isSelected ? 'text-teal-400' : 'text-white'}`}>
                            {roleConfig.label}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
                            {roleConfig.price}€ / Jour
                        </p>
                    </div>
                </div>

                {/* Right Side: Description & Selection */}
                <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="bg-slate-950/40 rounded-2xl p-4 border border-white/5 relative">
                        <span className="absolute -top-2 -left-1 text-teal-500/30 text-4xl font-serif">“</span>
                        <p className="text-slate-300 text-xs leading-relaxed italic relative z-10">
                            {roleConfig.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isAvailable ? 'bg-teal-500' : 'bg-red-500'}`} />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-teal-500' : 'text-slate-500'}`}>
                                {isSelected ? 'Sélectionné' : (isAvailable ? 'Disponible immédiatement' : 'Indisponible')}
                            </span>
                        </div>
                        
                        {isSelected && (
                            <div className="flex items-center gap-2 bg-teal-500 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                                <span>Inclus</span>
                                <span className="w-4 h-4 bg-slate-950/20 rounded-full flex items-center justify-center">✓</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Background decoration for selected state */}
            {isSelected && (
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            )}
        </div>
    );
};

export default CrewSelector;
