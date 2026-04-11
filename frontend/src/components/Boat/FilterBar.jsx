import React from 'react';
import { Link } from 'react-router-dom';
import BoatCalendar from './BoatCalendar';

const FilterBar = ({ 
    userId, filters, handleFilterChange, handleDateChange, resetFilters, 
    types, availableModels, cities, activeCount, isLoading 
}) => {
    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 mb-12 shadow-xl shadow-black/30">
            {/* Invitation à la connexion */}
            {!userId && (
                <div className="mb-8 pb-8 border-b border-white/5">
                    <div className="flex flex-col md:flex-row items-center justify-between bg-teal-500/10 rounded-2xl p-6 border border-teal-500/20">
                        <div className="mb-4 md:mb-0 text-center md:text-left">
                            <h3 className="text-lg font-bold text-white mb-1">Prêt à naviguer ?</h3>
                            <p className="text-teal-200/70 text-sm">Connectez-vous pour vérifier les disponibilités et réserver.</p>
                        </div>
                        <Link to="/login" className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40">
                            Se connecter
                        </Link>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sélecteurs de Dates */}
                {userId && (
                    <div className="w-full lg:w-auto flex-shrink-0 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-8">
                        <h4 className="block text-sm font-bold text-slate-300 mb-4">Dates de reservation</h4>
                        <BoatCalendar 
                            startDate={filters.start} 
                            endDate={filters.end} 
                            onDateChange={handleDateChange} 
                        />
                        {filters.start && (
                            <button onClick={() => handleDateChange('', '')} className="mt-3 text-sm text-red-500 hover:text-red-400 font-medium transition-colors">
                                Effacer la sélection
                            </button>
                        )}
                    </div>
                )}

                {/* Filtres Dropdowns */}
                <div className="flex-grow flex flex-col justify-center">
                    <h4 className="block text-sm font-bold text-slate-300 mb-4 lg:hidden">Critères de recherche</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Type de bateau</label>
                            <select name="type" value={filters.type} onChange={handleFilterChange} disabled={isLoading || types.length === 0} className="bg-slate-950/50 border border-white/10 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition-colors disabled:opacity-50">
                                <option value="0">{isLoading ? "Chargement..." : "Tous les types"}</option>
                                {types.map(type => (<option key={type.id} value={type.id}>{type.label || type.name}</option>))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Modèle</label>
                            <select name="model" value={filters.model} onChange={handleFilterChange} disabled={isLoading || availableModels.length === 0} className="bg-slate-950/50 border border-white/10 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition-colors disabled:opacity-50">
                                <option value="0">{isLoading ? "Chargement..." : "Tous les modèles"}</option>
                                {availableModels.map(model => (<option key={model.id} value={model.id}>{model.label || model.name}</option>))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1">Port d'attache</label>
                            <select name="city" value={filters.city} onChange={handleFilterChange} disabled={isLoading || cities.length === 0} className="bg-slate-950/50 border border-white/10 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition-colors disabled:opacity-50">
                                <option value="0">{isLoading ? "Chargement..." : "Toutes les villes"}</option>
                                {cities.map(city => (<option key={city} value={city}>{city}</option>))}
                            </select>
                        </div>

                        <div>
                            {activeCount > 0 ? (
                                <button onClick={resetFilters} className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium p-3 rounded-xl border border-white/10 transition-colors">
                                    Réinitialiser
                                </button>
                            ) : (
                                <div className="w-full bg-slate-900/30 text-slate-600 text-sm font-medium p-3 rounded-xl border border-white/5 text-center cursor-not-allowed">Filtres inactifs</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;