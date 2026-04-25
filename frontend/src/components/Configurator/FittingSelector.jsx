import React from 'react';
import { toggleFitting } from '../../store/booking/bookingSlice';

const FittingSelector = ({ fittings, selectedFittings, dispatch }) => {
    return (
        <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-500 flex items-center justify-center text-sm font-black">2</span>
                Équipements de location
            </h2>
            <div className="space-y-3">
                {fittings.map(fit => {
                    const isSelected = selectedFittings.find(s => s.id === fit.id);
                    return (
                        <div 
                            key={fit.id}
                            onClick={() => dispatch(toggleFitting(fit))}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                                isSelected
                                ? 'bg-teal-500/10 border-teal-500/50 text-teal-400'
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                                    isSelected ? 'bg-teal-500 border-teal-500 text-slate-950' : 'border-white/20 group-hover:border-teal-500/50'
                                }`}>
                                    {isSelected && <span className="text-xs font-black">✓</span>}
                                </div>
                                <span className="font-bold text-sm">{fit.label}</span>
                            </div>
                            <p className="font-black text-sm">{fit.fittingPrice} €</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FittingSelector;
