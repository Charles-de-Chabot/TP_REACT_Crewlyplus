import React from 'react';

const FeatureList = () => {
    return (
        <div className="space-y-10">
            <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">1</div>
                <div>
                    <h3 className="text-2xl font-bold uppercase italic tracking-tighter">Calendrier IRC Europe</h3>
                    <p className="text-slate-400 mt-3 leading-relaxed">Accédez aux plus grandes régates : de la Giraglia à la Rolex Middle Sea Race. Ne ratez aucun départ officiel.</p>
                </div>
            </div>

            <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">2</div>
                <div>
                    <h3 className="text-2xl font-bold uppercase italic tracking-tighter">Système de Crewing</h3>
                    <p className="text-slate-400 mt-3 leading-relaxed">Créez votre crew, gérez les rôles à bord (N°1, Tactique, Embraque) et communiquez via notre messagerie cryptée.</p>
                </div>
            </div>

            <div className="flex gap-8 items-start">
                <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">3</div>
                <div>
                    <h3 className="text-2xl font-bold uppercase italic tracking-tighter">Performance Data</h3>
                    <p className="text-slate-400 mt-3 leading-relaxed">Suivez vos polaires de vitesse et vos statistiques de podium sur chaque plan d'eau européen.</p>
                </div>
            </div>
        </div>
    );
};

export default FeatureList;