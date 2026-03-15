import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoatDetail, setSearchDates } from '../../store/boat/boatSlice';
import selectBoatData from '../../store/boat/boatSelector';
import HeaderDetail from '../../components/DetailBoat/HeaderDetail';
import BoatCalendar from '../../components/Boat/BoatCalendar';
import { 
    MdOutlineStraighten, 
    MdOutlineSwapHoriz, 
    MdOutlineAnchor, 
    MdOutlinePeople, 
    MdOutlineMeetingRoom, 
    MdOutlineBed, 
    MdOutlineEngineering, 
    MdOutlineLocalGasStation,
    MdOutlineDesignServices,
    MdOutlineDirectionsBoat,
    MdOutlineBuild
} from "react-icons/md";

const DetailBoat = () => {
    // On récupère l'ID du bateau depuis l'URL (ex: /boats/1)
    const { id } = useParams();
    const dispatch = useDispatch();
    
    // Récupération des données depuis Redux
    const { loading, boatDetail, searchDates } = useSelector(selectBoatData);

    useEffect(() => {
        // On récupère les détails du bateau à l'ouverture de la page
        if (id) {
            dispatch(fetchBoatDetail(id));
        }
    }, [dispatch, id]);

    // Si l'utilisateur modifie ses dates directement sur cette page, on met à jour Redux
    const handleDateChange = (start, end) => {
        dispatch(setSearchDates({ start, end }));
    };

    // Écran de chargement
    if (loading && (!boatDetail || boatDetail.id !== parseInt(id))) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-950 text-teal-500">
                <svg className="animate-spin h-12 w-12" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden pt-24 pb-12 animate-slideup">
            <div className="container mx-auto px-4">
                
                {/* En-tête avec l'image et les infos principales */}
                <HeaderDetail data={boatDetail} />

                {/* Corps de la page de détail */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    
                    {/* Colonne de gauche : Informations détaillées */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
                            <h2 className="text-2xl font-bold text-white mb-4">À propos de ce bateau</h2>
                            <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                                {boatDetail?.description || "Aucune description disponible pour ce bateau."}
                            </p>
                            
                            <div className="mt-12 pt-8 border-t border-white/5">
                                <h3 className="text-2xl font-bold text-white mb-8">Caractéristiques techniques</h3>
                                
                                <div className="space-y-8">
                                    {/* Catégorie : Dimensions */}
                                    <div>
                                        <h4 className="flex items-center gap-3 text-lg font-semibold text-teal-400 mb-4 border-b border-white/5 pb-2">
                                            <MdOutlineDesignServices className="w-6 h-6" />
                                            Dimensions
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                                                <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                                    <MdOutlineStraighten className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs font-medium mb-1">Longueur</span>
                                                    <span className="text-white font-semibold">{boatDetail?.boatinfo?.length ? `${boatDetail.boatinfo.length} m` : '-'}</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                                                <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                                    <MdOutlineSwapHoriz className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs font-medium mb-1">Largeur</span>
                                                    <span className="text-white font-semibold">{boatDetail?.boatinfo?.width ? `${boatDetail.boatinfo.width} m` : '-'}</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                                                <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                                    <MdOutlineAnchor className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs font-medium mb-1">Tirant d'eau</span>
                                                    <span className="text-white font-semibold">{boatDetail?.boatinfo?.draught ? `${boatDetail.boatinfo.draught} m` : '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Catégorie : Aménagement */}
                                    <div>
                                        <h4 className="flex items-center gap-3 text-lg font-semibold text-teal-400 mb-4 border-b border-white/5 pb-2">
                                            <MdOutlineDirectionsBoat className="w-6 h-6" />
                                            Aménagement & Capacité
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                                                <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                                    <MdOutlinePeople className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs font-medium mb-1">Capacité max.</span>
                                                    <span className="text-white font-semibold">{boatDetail?.boatinfo?.maxUser ? `${boatDetail.boatinfo.maxUser} pers.` : '-'}</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                                                <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                                    <MdOutlineMeetingRoom className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs font-medium mb-1">Cabines</span>
                                                    <span className="text-white font-semibold">{boatDetail?.boatinfo?.cabineNumber || '-'}</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                                                <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                                    <MdOutlineBed className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs font-medium mb-1">Couchages</span>
                                                    <span className="text-white font-semibold">{boatDetail?.boatinfo?.bedsNumber || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Catégorie : Motorisation */}
                                    <div>
                                        <h4 className="flex items-center gap-3 text-lg font-semibold text-teal-400 mb-4 border-b border-white/5 pb-2">
                                            <MdOutlineBuild className="w-6 h-6" />
                                            Motorisation
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                                                <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                                    <MdOutlineEngineering className="w-6 h-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="block text-slate-500 text-xs font-medium mb-1">Moteur</span>
                                                    <span className="text-white font-semibold block truncate" title={boatDetail?.boatinfo?.powerEngine}>{boatDetail?.boatinfo?.powerEngine || '-'}</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                                                <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                                    <MdOutlineLocalGasStation className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <span className="block text-slate-500 text-xs font-medium mb-1">Carburant</span>
                                                    <span className="text-white font-semibold">{boatDetail?.boatinfo?.fuel || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne de droite : Réservation et Calendrier */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sticky top-28 shadow-xl shadow-black/30">
                            <h3 className="text-xl font-bold text-white mb-6">Réserver ce bateau</h3>
                            
                            <div className="mb-6 flex justify-center">
                                <BoatCalendar 
                                    startDate={searchDates?.start || ''} 
                                    endDate={searchDates?.end || ''} 
                                    onDateChange={handleDateChange} 
                                />
                            </div>

                            {/* La suite du processus de réservation se mettra ici (Prix total, bouton de validation...) */}
                            
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DetailBoat;