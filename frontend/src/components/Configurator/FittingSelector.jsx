import React, { memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFitting } from '../../store/booking/bookingSlice';
import { selectSelectedFittings } from '../../store/booking/bookingSelectors';
import IconRenderer from '../UI/IconRenderer';

const FittingSelector = memo(({ fitting }) => {
    const dispatch = useDispatch();
    const selectedFittings = useSelector(selectSelectedFittings);
    const isSelected = selectedFittings.some(s => s.id === fitting.id);

    return (
        <div 
            onClick={() => dispatch(toggleFitting(fitting))}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                isSelected
                ? 'bg-accent-role/5 border-accent-role/50 text-accent-role shadow-glow-role'
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10 hover:text-white'
            }`}
        >
            <div className="flex items-center gap-4">
                <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                    isSelected ? 'bg-teal-500 border-teal-500 text-slate-950 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 'border-white/10 group-hover:border-teal-500/50'
                }`}>
                    {isSelected && <IconRenderer icon="✅" size={12} />}
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest ${isSelected ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {fitting.label}
                </span>
            </div>
            <p className="font-mono text-xs font-black italic tracking-tighter">
                {fitting.fittingPrice} <span className="text-[10px] not-italic text-slate-500">€</span>
            </p>
        </div>
    );
});

export default FittingSelector;
