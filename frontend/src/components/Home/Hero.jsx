import React from 'react';
import { Link } from 'react-router-dom';
import { TRAILER_VIDEO } from '../../constants/appConstant';

const Hero = () => {
    return (
        <div className="relative w-full py-24 lg:py-32 overflow-hidden pt-2">
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
            
            {/* Overlay sombre pour assurer la lisibilité du texte */}
            <div className="absolute inset-0 bg-slate-950/60 z-0"></div>
            
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center animate-slideup">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 drop-shadow-2xl">
                    Embarquez avec Crewly
                </h1>
                <p className="mt-4 max-w-3xl text-xl text-slate-200 mb-10">
                    Louez le bateau de vos rêves et partez à la découverte des plus beaux horizons
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/boats" className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1">
                        Réserver maintenant
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;