import React from 'react';

const NoResults = ({ resetFilters }) => {
    return (
        <div className="text-center py-16 bg-slate-900/20 rounded-3xl border border-white/5 backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4 text-slate-500 border border-white/5">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Aucun résultat trouvé</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">Nous n'avons trouvé aucun bateau correspondant à vos critères de recherche. Essayez de modifier vos filtres.</p>
            <button onClick={resetFilters} className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-xl border border-white/10 transition-colors">
                Réinitialiser les filtres
            </button>
        </div>
    );
};

export default NoResults;