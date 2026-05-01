import React from 'react';
import { Link } from 'react-router-dom';
import { TRAILER_VIDEO } from '../../constants/appConstant';

const Hero = () => {
    return (
        /* On remplace w-full par w-screen et on ajoute left-1/2 -translate-x-1/2 
           pour forcer la sortie du container si nécessaire */
        <div className="relative w-full min-h-[60vh] lg:min-h-[80vh] flex items-center overflow-hidden">
            {/* Arrière-plan Vidéo */}
            <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src={TRAILER_VIDEO} type="video/mp4" />
            </video>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 z-0"></div>
            
            {/* Contenu - Toujours centré dans un container */}
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center animate-slideup">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white mb-6">
                    Embarquez <br className="sm:hidden" />
                    <span className="text-teal-400">avec Crewly</span>
                </h1>
                <p className="max-w-3xl text-lg md:text-2xl text-slate-300 mb-12 font-medium tracking-wide">
                    Où le prestige rencontre la rigueur <br /> 
                    <span className="text-slate-400 text-sm md:text-lg font-bold uppercase tracking-[0.3em]">
                        Louez, Travaillez et Naviguez avec l'excellence
                    </span>
                </p>
                <Link to="/boats" className="group relative px-12 py-5 bg-teal-500 text-slate-950 font-black uppercase italic tracking-tighter text-xl rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(20,184,166,0.3)] overflow-hidden">
                    <span className="relative z-10">Réserver maintenant</span>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                </Link>
            </div>
        </div>
    );
};

export default Hero;