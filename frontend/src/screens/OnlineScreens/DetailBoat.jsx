import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoatDetail, setSearchDates } from '../../store/boat/boatSlice';
import selectBoatData from '../../store/boat/boatSelector';
import HeaderDetail from '../../components/DetailBoat/HeaderDetail';
import InfoDetail from '../../components/DetailBoat/InfoDetail';
import BoatCalendar from '../../components/Boat/BoatCalendar';
import BoatSuggestion from '../../components/Boat/BoatSuggestion';

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
                        <InfoDetail boatDetail={boatDetail} />
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

                {/* Section Suggestions */}
                <BoatSuggestion currentBoat={boatDetail} />
            </div>
        </div>
    );
};

export default DetailBoat;