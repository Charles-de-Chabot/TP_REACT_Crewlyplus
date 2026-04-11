import React from 'react';
import { TRAILER_VIDEO } from '../../constants/appConstant';

const BoatHero = () => {
    return (
        <div className="relative w-full py-16 lg:py-24 overflow-hidden border-b border-white/5">
            {/* Arrière-plan Vidéo */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0 blur-xs"
            >
                <source src={TRAILER_VIDEO} type="video/mp4" />
            </video>
            
            {/* Overlay sombre pour assurer la lisibilité du texte */}
            <div className="absolute inset-0 bg-slate-950/60 z-0"></div>
            
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4 drop-shadow-lg">
                    Naviguez vers l'aventure
                </h1>
                <p className="max-w-3xl text-lg text-slate-200">
                    Découvrez notre flotte de bateaux d'exception et réservez votre prochaine escapade en mer
                </p>
            </div>
        </div>
    );
};

export default BoatHero;