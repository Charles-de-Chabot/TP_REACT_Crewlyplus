import React from 'react';

const RoleCard = ({ opt, isSelected, onSelect }) => {
    return (
        <div 
            onClick={() => onSelect(opt.role)}
            className={`p-8 rounded-[3rem] border transition-all duration-500 cursor-pointer group flex flex-col ${
                isSelected
                ? `bg-${opt.color}-500/10 border-${opt.color}-500/50 shadow-2xl shadow-${opt.color}-500/10 scale-105`
                : 'bg-slate-900/40 border-white/5 hover:border-white/20'
            }`}
        >
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-8 transition-transform group-hover:scale-110 ${
                isSelected ? `bg-slate-950 border border-${opt.color}-500/30` : 'bg-slate-950 border border-white/5'
            }`}>
                {opt.icon}
            </div>
            
            <h3 className={`text-2xl font-black mb-4 ${isSelected ? `text-${opt.color}-400` : 'text-white'}`}>
                {opt.label}
            </h3>
            
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
                {opt.description}
            </p>

            <ul className="space-y-3 mb-10">
                {opt.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-500">
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? `bg-${opt.color}-400` : 'bg-slate-700'}`} />
                        {f}
                    </li>
                ))}
            </ul>

            <div className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center transition-all ${
                isSelected
                ? `bg-${opt.color}-500 text-slate-950`
                : 'bg-white/5 text-slate-400 group-hover:bg-white/10'
            }`}>
                {isSelected ? 'Rôle sélectionné' : 'Choisir ce métier'}
            </div>
        </div>
    );
};

export default RoleCard;
