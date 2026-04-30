import React from 'react';
import GlassCard from '../ui/GlassCard';

const WindyMap = ({ lat, lon, name, fullHeight = false }) => {
    // Nettoyage et validation ultra-stricte
    const parsedLat = parseFloat(lat);
    const parsedLon = parseFloat(lon);
    
    // On considère comme invalide si :
    // - Ce n'est pas un nombre
    // - C'est exactement 0 (souvent signe d'une donnée manquante en base)
    // - C'est en dehors des limites terrestres
    const isValid = 
        !isNaN(parsedLat) && !isNaN(parsedLon) &&
        isFinite(parsedLat) && isFinite(parsedLon) &&
        parsedLat !== 0 && parsedLon !== 0 &&
        Math.abs(parsedLat) <= 90 && Math.abs(parsedLon) <= 180;
    
    const windyUrl = isValid 
        ? `https://embed.windy.com/embed2.html?lat=${parsedLat.toFixed(4)}&lon=${parsedLon.toFixed(4)}&zoom=11&level=surface&overlay=wind&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&metricWind=kt&metricTemp=%C2%B0C`
        : null;

    return (
        <div className={`flex flex-col w-full h-full overflow-hidden rounded-2xl border border-white/10 ${fullHeight ? 'h-full' : 'aspect-video'}`}>
            <div className="p-3 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                        Radar Tactique : {name}
                    </h3>
                </div>
            </div>
            
            <div className="relative flex-1 bg-[#050810] flex items-center justify-center">
                {/* Overlay radar effect */}
                <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,242,255,0.05)]" />
                
                {isValid ? (
                    <iframe 
                        title={`Windy Map - ${name}`}
                        src={windyUrl}
                        className="w-full h-full border-0 grayscale-[0.2] contrast-[1.1] brightness-[0.9]"
                        allowFullScreen
                    />
                ) : (
                    <div className="text-white/20 text-xs font-mono uppercase tracking-widest text-center px-6">
                        Attente des coordonnées GPS...
                    </div>
                )}
            </div>
        </div>
    );
};

export default WindyMap;
