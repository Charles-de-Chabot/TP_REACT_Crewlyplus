import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFitting } from '../../store/booking/bookingSlice';
import { selectSelectedFittings } from '../../store/booking/bookingSelectors';

const FittingSelector = ({ fitting }) => {
    const dispatch = useDispatch();
    const selectedFittings = useSelector(selectSelectedFittings);
    const isSelected = selectedFittings.some(s => s.id === fitting.id);

    return (
        <div 
            onClick={() => dispatch(toggleFitting(fitting))}
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
                <span className="font-bold text-sm">{fitting.label}</span>
            </div>
            <p className="font-black text-sm">{fitting.fittingPrice} €</p>
        </div>
    );
};

export default FittingSelector;
