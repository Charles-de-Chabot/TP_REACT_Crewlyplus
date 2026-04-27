import React from 'react';
import { TRAILER_VIDEO } from '../../constants/appConstant';

const BoatHero = ({ children }) => {
    return (
        <div className="container mx-auto px-4 mt-8 relative z-30">
            {/* 
                On utilise un conteneur principal en overflow-visible pour laisser passer les menus,
                mais on crée un calque interne pour découper la vidéo avec l'arrondi.
            */}
            <div className="relative w-full">
                
                {/* Calque de fond : Vidéo arrondie et découpée */}
                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/50 pointer-events-none">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={TRAILER_VIDEO} type="video/mp4" />
                    </video>
                    {/* Overlay sombre */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/40 to-slate-950/80"></div>
                </div>
                
                {/* Calque de contenu : Les filtres (en overflow-visible pour les menus) */}
                <div className="relative z-10 w-full">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default BoatHero;