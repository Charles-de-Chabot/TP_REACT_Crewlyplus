import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import BoatCard from '../../components/Boat/BoatCard';
import BoatCalendar from '../../components/Boat/BoatCalendar';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoats, setSearchDates } from '../../store/boat/boatSlice';
import selectBoatData from '../../store/boat/boatSelector';
import { TRAILER_VIDEO } from '../../constants/appConstant';

const Boats = () => {
    const { userId } = useAuthContext();
    const dispatch = useDispatch();

    // --- RÉCUPÉRATION DEPUIS REDUX ---
    const { loading: isLoading, boats, types, models, cities, searchDates } = useSelector(selectBoatData);

    // État pour stocker les filtres sélectionnés
    // On initialise les dates avec celles de Redux (pratique si on fait un retour arrière depuis DetailBoat)
    const [filters, setFilters] = useState({
        type: '0',
        model: '0',
        city: '0',
        start: searchDates?.start || '',
        end: searchDates?.end || ''
    });

    useEffect(() => {
        // Optimisation : On ne fait l'appel réseau que si la liste Redux est vide
        if (boats.length === 0) {
            dispatch(fetchBoats());
        }
    }, [dispatch, boats.length]);

    // Mise à jour des filtres
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => {
            const newFilters = { ...prev, [name]: value };
            if (name === 'type') {
                newFilters.model = '0';
            }
            return newFilters;
        });
    };

    const resetFilters = () => {
        setFilters({ type: '0', model: '0', city: '0', start: '', end: '' });
        dispatch(setSearchDates({ start: '', end: '' }));
    };

    // Gestionnaire spécifique pour les dates du calendrier
    const handleDateChange = (start, end) => {
        setFilters(prev => ({ ...prev, start, end }));
        // On sauvegarde aussi dans Redux pour la page DetailBoat
        dispatch(setSearchDates({ start, end }));
    };

    const availableModels = useMemo(() => {
        if (filters.type === '0') return models;
        return models.filter(m => m.typeId?.toString() === filters.type);
    }, [filters.type, models]);

    const filteredBoats = useMemo(() => {
        return boats.filter(boat => {
            // Comparaison avec toString() car les inputs select renvoient des strings
            if (filters.type !== '0' && boat.type?.id?.toString() !== filters.type) return false;
            if (filters.model !== '0' && boat.model?.id?.toString() !== filters.model) return false;
            if (filters.city !== '0' && boat.adress?.city !== filters.city) return false;
            return true;
        });
    }, [filters, boats]);

    const activeFiltersCount = (filters.type !== '0' ? 1 : 0) + 
                               (filters.model !== '0' ? 1 : 0) + 
                               (filters.city !== '0' ? 1 : 0) +
                               (filters.start !== '' ? 1 : 0) +
                               (filters.end !== '' ? 1 : 0);

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden animate-slideup">
            
            {/* Hero Section */}
            <div className="relative w-full py-16 lg:py-24 overflow-hidden border-b border-white/5">
                {/* Arrière-plan Vidéo */}
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0 blur-xs"
                >
                    <source src={TRAILER_VIDEO} type="video/mp4" />
                </video>
                
                {/* Overlay sombre pour assurer la lisibilité du texte */}
                <div className="absolute inset-0 bg-slate-950/60 z-0"></div>
                
                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl mb-4 drop-shadow-lg">
                        Naviguez vers l'aventure
                    </h1>
                    <p className="max-w-3xl text-lg text-slate-200">
                        Découvrez notre flotte de bateaux d'exception et réservez votre prochaine escapade en mer
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12">
                
                {/* Section Recherche et Filtres */}
                <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 mb-12 shadow-xl shadow-black/30">
                    
                    {/* Invitation à la connexion (comme dans le Twig) */}
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
                        {/* Sélecteurs de Dates (Affiché uniquement si connecté) */}
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

                        {/* Filtres Dropdowns (Type, Modèle, Ville) */}
                        <div className="flex-grow flex flex-col justify-center">
                            <h4 className="block text-sm font-bold text-slate-300 mb-4 lg:hidden">Critères de recherche</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Type de bateau</label>
                                    <select name="type" value={filters.type} onChange={handleFilterChange} className="bg-slate-950/50 border border-white/10 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition-colors">
                                        <option value="0">Tous les types</option>
                                        {types.map(type => (
                                            <option key={type.id} value={type.id}>{type.label || type.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Modèle</label>
                                    <select name="model" value={filters.model} onChange={handleFilterChange} className="bg-slate-950/50 border border-white/10 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition-colors">
                                        <option value="0">Tous les modèles</option>
                                        {availableModels.map(model => (
                                            <option key={model.id} value={model.id}>{model.label || model.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Port d'attache</label>
                                    <select name="city" value={filters.city} onChange={handleFilterChange} className="bg-slate-950/50 border border-white/10 text-white text-sm rounded-xl focus:ring-teal-500 focus:border-teal-500 block w-full p-3 transition-colors">
                                        <option value="0">Toutes les villes</option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    {activeFiltersCount > 0 ? (
                                        <button onClick={resetFilters} className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium p-3 rounded-xl border border-white/10 transition-colors">
                                            Réinitialiser
                                        </button>
                                    ) : (
                                        <div className="w-full bg-slate-900/30 text-slate-600 text-sm font-medium p-3 rounded-xl border border-white/5 text-center cursor-not-allowed">
                                            Filtres inactifs
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Entête des résultats */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Résultats de recherche</h2>
                    <span className="bg-teal-500/10 text-teal-400 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/20">
                        {filteredBoats.length} bateau{filteredBoats.length > 1 ? 'x' : ''}
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20 text-teal-500">
                        <svg className="animate-spin h-10 w-10" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : filteredBoats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBoats.map((boat) => (
                            <BoatCard key={boat.id} data={boat} />
                        ))}
                    </div>
                ) : (
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
                )}
            </div>
        </div>
    );
};

export default Boats;