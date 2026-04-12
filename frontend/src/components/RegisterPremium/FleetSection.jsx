import React from 'react';

const FleetSection = () => {
    return (
        <div>
            <h2 className="text-4xl font-black italic uppercase mb-6 text-center">Notre Flotte <span className="text-amber-500">High-Performance</span></h2>
            <p className="text-center text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                Les membres Premium bénéficient de réductions exclusives sur la location de l'ensemble de nos bateaux de régate.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* JPK 10.10 */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-amber-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <h4 className="text-2xl font-bold uppercase italic">JPK 10.10</h4>
                        <span className="bg-amber-500/10 text-amber-500 text-[10px] px-2 py-1 rounded font-bold uppercase">Pro Choice</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 font-light leading-relaxed">
                        La machine de guerre absolue pour la Transquadra. Préparé pour le portant, ce monocoque iconique du chantier JPK est une référence mondiale en IRC.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <div>Longeur: 10.10m</div>
                        <div>IRC: 1.005</div>
                        <div>Poids: Optimisé</div>
                        <div>Voiles: Carbone</div>
                    </div>
                </div>

                {/* FARR 40 */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-amber-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <h4 className="text-2xl font-bold uppercase italic">Farr 40</h4>
                        <span className="bg-teal-500/10 text-teal-500 text-[10px] px-2 py-1 rounded font-bold uppercase">Pure Racing</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 font-light leading-relaxed">
                        L'ADN de la Coupe de l'America. Un bateau exigeant, sans compromis, conçu pour les parcours bananes et les manœuvres millimétrées.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <div>Longeur: 12.41m</div>
                        <div>IRC: 1.170</div>
                        <div>Équipage: 10</div>
                        <div>Safran: Double</div>
                    </div>
                </div>

                {/* SWAN 45 */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:border-amber-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-6">
                        <h4 className="text-2xl font-bold uppercase italic">Swan 45</h4>
                        <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-1 rounded font-bold uppercase">Luxury Power</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 font-light leading-relaxed">
                        L'élégance légendaire de Nautor Swan alliée à une préparation Offshore brutale. Idéal pour briller lors de la Swan Cup ou les championnats d'Europe.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        <div>Longeur: 13.83m</div>
                        <div>IRC: 1.188</div>
                        <div>Confort: Élevé</div>
                        <div>Vitesse: Exceptionnelle</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FleetSection;