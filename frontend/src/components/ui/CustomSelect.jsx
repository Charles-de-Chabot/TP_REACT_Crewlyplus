import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

const CustomSelect = ({ label, value, options, onChange, placeholder, icon: Icon, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Fermer le menu si on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => String(opt.id) === String(value));

    const handleSelect = (optionId) => {
        // Simuler un événement pour rester compatible avec handleFilterChange
        onChange({ target: { name: label.toLowerCase() === 'modèle' ? 'model' : label.toLowerCase() === 'type de bateau' ? 'type' : 'city', value: optionId } });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">
                {label}
            </label>
            
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-slate-950/60 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-sm text-white transition-all outline-none focus:ring-1 focus:ring-cyan-500/50 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {Icon && <Icon size={16} className="text-cyan-400 flex-shrink-0" />}
                    <span className="truncate">
                        {selectedOption ? (selectedOption.label || selectedOption.name) : placeholder}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-white/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-[100] mt-2 w-full bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slideup min-w-[200px]">
                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                        <div 
                            onClick={() => handleSelect('0')}
                            className="px-4 py-3 text-xs text-white/60 hover:bg-white/5 hover:text-cyan-400 cursor-pointer transition-colors flex items-center justify-between"
                        >
                            <span>Tous</span>
                            {String(value) === '0' && <Check size={14} />}
                        </div>
                        {options.map((option) => (
                            <div
                                key={option.id || option}
                                onClick={() => handleSelect(option.id || option)}
                                className={`px-4 py-3 text-xs cursor-pointer transition-colors flex items-center justify-between border-t border-white/5 ${String(value) === String(option.id || option) ? 'bg-cyan-500/10 text-cyan-400' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                            >
                                <span className="truncate">{option.label || option.name || option}</span>
                                {String(value) === String(option.id || option) && <Check size={14} />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
