import React from 'react';

const RegisterHeader = () => {
    return (
        <div className="text-center mb-16">
            <p className="text-blue-400 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Rejoindre l'élite du nautisme</p>
            <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter leading-none mb-6">
                DEVENEZ UN <br />
                <span className="text-transparent stroke-text">PRO DU CREW.</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto font-medium">
                Valorisez vos compétences maritimes et accédez à des missions exclusives sur les plus beaux yachts de la plateforme.
            </p>
        </div>
    );
};

export default RegisterHeader;
