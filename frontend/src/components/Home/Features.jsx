import React from 'react';

const Features = () => {
    return (
        <div className="py-24 bg-slate-900/50 relative border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl">Pourquoi choisir Crewly ?</h2>
                    <p className="mt-4 text-lg text-slate-400">Disponible partout en France: simple, rapide et sécurisé.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center p-6 rounded-3xl bg-slate-800/20 border border-white/5 backdrop-blur-sm hover:bg-slate-800/40 transition-colors duration-300">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-500/10 text-teal-400 mb-6 mx-auto">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Réservation Facile</h3>
                        <p className="text-slate-400">Quelques clics suffisent pour bloquer vos dates et partir naviguer.</p>
                    </div>
                    <div className="text-center p-6 rounded-3xl bg-slate-800/20 border border-white/5 backdrop-blur-sm hover:bg-slate-800/40 transition-colors duration-300">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-500/10 text-teal-400 mb-6 mx-auto">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Flexibilité</h3>
                        <p className="text-slate-400">Annulation gratuite jusqu'à 48h avant le départ sur la plupart des bateaux.</p>
                    </div>
                    <div className="text-center p-6 rounded-3xl bg-slate-800/20 border border-white/5 backdrop-blur-sm hover:bg-slate-800/40 transition-colors duration-300">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-500/10 text-teal-400 mb-6 mx-auto">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Paiement Sécurisé</h3>
                        <p className="text-slate-400">Transactions cryptées et garanties pour votre tranquillité d'esprit.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Features;