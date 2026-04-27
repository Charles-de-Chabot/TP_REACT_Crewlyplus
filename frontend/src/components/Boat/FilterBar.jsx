import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import BoatCalendar from './BoatCalendar';
import CustomSelect from '../ui/CustomSelect';
import { Ship, Anchor, MapPin, X } from 'lucide-react';

const FilterBar = ({ 
    userId, filters, handleFilterChange, handleDateChange, resetFilters, 
    types, availableModels, cities, activeCount, isLoading 
}) => {
    const [openMenus, setOpenMenus] = useState([]);

    const handleToggle = useCallback((label, isOpen) => {
        setOpenMenus(prev => {
            if (isOpen) {
                if (prev.includes(label)) return prev;
                return [...prev, label];
            } else {
                return prev.filter(item => item !== label);
            }
        });
    }, []);

    const isShifted = openMenus.length > 0;

    return (
        <div className="backdrop-blur-md p-12 md:p-20">
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
                {/* Sélecteurs de Dates (Reste statique) */}
                {userId && (
                    <div className="w-full lg:w-auto flex-shrink-0 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5 pb-8 lg:pb-0 lg:pr-8">
                        <BoatCalendar 
                            label="Dates de séjour"
                            startDate={filters.start} 
                            endDate={filters.end} 
                            onDateChange={handleDateChange} 
                        />
                        {filters.start && (
                            <button onClick={() => handleDateChange('', '')} className="mt-3 text-[10px] text-red-500 hover:text-red-400 font-black uppercase tracking-widest transition-colors flex items-center gap-1">
                                <X size={12} /> Effacer les dates
                            </button>
                        )}
                    </div>
                )}

                {/* Filtres Dropdowns (S'anime vers le haut) */}
                <div className={`flex-grow flex flex-col justify-center transition-all duration-500 ease-out transform ${isShifted ? '-translate-y-8 lg:-translate-y-16' : 'translate-y-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-end">
                        <CustomSelect 
                            name="type"
                            label="Type de bateau"
                            value={filters.type}
                            options={types}
                            onChange={handleFilterChange}
                            placeholder="Tous"
                            icon={Ship}
                            disabled={isLoading}
                            onToggle={handleToggle}
                        />

                        <CustomSelect 
                            name="model"
                            label="Modèle"
                            value={filters.model}
                            options={availableModels}
                            onChange={handleFilterChange}
                            placeholder="Tous"
                            icon={Anchor}
                            disabled={isLoading}
                            onToggle={handleToggle}
                        />

                        <CustomSelect 
                            name="city"
                            label="Port d'attache"
                            value={filters.city}
                            options={cities.map(c => ({ id: c, name: c }))}
                            onChange={handleFilterChange}
                            placeholder="Tous"
                            icon={MapPin}
                            disabled={isLoading}
                            onToggle={handleToggle}
                        />

                        <div>
                            <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2 ml-1">
                                Actions
                            </label>
                            {activeCount > 0 ? (
                                <button onClick={resetFilters} className="w-full flex items-center justify-center bg-slate-950/60 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-sm text-white transition-all shadow-lg hover:shadow-cyan-500/10 active:scale-95 group">
                                    <X size={14} className="mr-2 text-white/40 group-hover:text-red-400 transition-colors" />
                                    Réinitialiser
                                </button>
                            ) : (
                                <div className="w-full bg-slate-950/30 text-white/10 text-sm flex items-center justify-center px-4 py-3 rounded-xl border border-white/5 cursor-not-allowed">Filtres inactifs</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;