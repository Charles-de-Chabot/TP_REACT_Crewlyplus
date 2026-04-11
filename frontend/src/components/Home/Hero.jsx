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
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 drop-shadow-2xl">
                    Embarquez avec Crewly
                </h1>
                <p className="mt-4 max-w-3xl text-xl text-slate-200 mb-10">
                    Louez le bateau de vos rêves et partez à la découverte des plus beaux horizons
                </p>
                <Link to="/boats" className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-xl transition-all shadow-lg">
                    Réserver maintenant
                </Link>
            </div>
        </div>
    );
};

export default Hero;