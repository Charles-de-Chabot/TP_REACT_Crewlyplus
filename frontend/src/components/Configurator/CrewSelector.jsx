import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleCrewRole } from '../../store/booking/bookingSlice';
import { selectSelectedCrew } from '../../store/booking/bookingSelectors';
import IconRenderer from '../UI/IconRenderer';

const CrewSelector = memo(({ roleConfig }) => {
    const dispatch = useDispatch();
    const selectedCrew = useSelector(selectSelectedCrew);
    
    // On considère qu'ils sont disponibles par défaut pour l'instant
    const isAvailable = true; 
    const isSelected = selectedCrew.includes(roleConfig.role);

    return (
        <div 
            onClick={() => isAvailable && dispatch(toggleCrewRole(roleConfig.role))}
            className={`p-1 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden ${
                isSelected
                ? 'bg-accent-role/10 border-accent-role/50 shadow-glow-role'
                : 'bg-white/5 border-white/5 hover:border-white/10'
            } ${!isAvailable && 'opacity-50 cursor-not-allowed grayscale'}`}
        >
            <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* Left Side: Icon & Price */}
                <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:w-32 shrink-0">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center border transition-all ${
                        isSelected ? 'bg-slate-900 border-teal-500/50 text-teal-400' : 'bg-slate-900 border-white/5 text-slate-500'
                    }`}>
                        <IconRenderer icon={roleConfig.icon} size={32} />
                    </div>
                    <div className="flex flex-col">
                        <h3 className={`font-black text-sm uppercase tracking-tighter transition-colors leading-tight italic ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                            {roleConfig.label}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                            <span className="font-mono text-teal-500/80">{roleConfig.price}€</span> / Jour
                        </p>
                    </div>
                </div>

                {/* Right Side: Description & Selection */}
                <div className="flex-1 flex flex-col justify-between gap-4">
                    <div className="bg-slate-950/40 rounded-xl p-4 border border-white/5 relative">
                        <p className="text-slate-500 text-[11px] leading-relaxed italic relative z-10">
                            {roleConfig.description}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.4)] animate-pulse' : 'bg-red-500'}`} />
                            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isSelected ? 'text-teal-500' : 'text-slate-500'}`}>
                                {isSelected ? 'Poste assigné' : (isAvailable ? 'Disponible' : 'Indisponible')}
                            </span>
                        </div>
                        
                        {isSelected && (
                            <div className="flex items-center gap-2 bg-teal-500/10 text-teal-400 px-3 py-1 rounded-lg border border-teal-500/20 text-[9px] font-black uppercase tracking-widest">
                                <span>Inclus</span>
                                <IconRenderer icon="✅" size={10} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CrewSelector;
