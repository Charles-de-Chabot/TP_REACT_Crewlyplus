import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import { MapPin, Calendar, Trophy, ChevronRight, Anchor } from 'lucide-react';

const RegattaCard = ({ regatta, isSelected, onSelect }) => {
    // Calcul de la durée
    const start = new Date(regatta.startDate);
    const end = new Date(regatta.endDate);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    return (
        <GlassCard 
            onClick={() => onSelect(regatta)}
            className={`group cursor-pointer transition-all duration-300 border-white/5 overflow-hidden ${
                isSelected ? 'border-cyan-500/50 bg-cyan-500/10' : 'hover:border-white/20 hover:bg-white/5'
            }`}
        >
            <div className="flex h-40">
                {/* Image miniature plus large */}
                <div className="w-40 h-full relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050810] z-10" />
                    <img 
                        src={`https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094`} 
                        alt={regatta.name}
                        className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 opacity-60"
                    />
                    <div className="absolute bottom-2 left-2 z-20">
                        <span className="text-[9px] font-mono text-cyan-400 bg-black/60 px-2 py-0.5 rounded border border-cyan-500/30 uppercase">
                            {regatta.latitude?.toFixed(2)}°N
                        </span>
                    </div>
                </div>

                {/* Content plus détaillé */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start gap-2">
                            <h3 className={`font-heading font-bold text-lg leading-tight transition-colors ${
                                isSelected ? 'text-cyan-400' : 'text-white group-hover:text-cyan-400'
                            }`}>
                                {regatta.name}
                            </h3>
                            <ChevronRight size={20} className={`transition-transform flex-shrink-0 ${
                                isSelected ? 'text-cyan-400 translate-x-1' : 'text-white/10'
                            }`} />
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-white/40 uppercase tracking-widest">
                            <MapPin size={12} className="text-cyan-400" />
                            {regatta.location}
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-[10px] text-white/60">
                                <Calendar size={12} className="text-cyan-400" />
                                {new Date(regatta.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })} • {diffDays} jours
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-gold-sanded">
                                {regatta.registrationPrice}€
                            </span>
                            <Link 
                                to={`/regattas/${regatta.id}`}
                                className="p-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Anchor size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default RegattaCard;
