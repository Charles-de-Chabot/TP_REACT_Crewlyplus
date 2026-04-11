import React, { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBoats } from '../../store/boat/boatSlice';
import selectBoatData from '../../store/boat/boatSelector';
import BoatCard from './BoatCard';

const BoatSuggestion = ({ currentBoat }) => {
    const dispatch = useDispatch();
    const { boats } = useSelector(selectBoatData);

    // S'assurer que les bateaux sont chargés dans Redux 
    // (cas où l'on arrive directement sur l'URL DetailBoat sans passer par l'accueil)
    useEffect(() => {
        if (boats.length === 0) {
            dispatch(fetchBoats());
        }
    }, [dispatch, boats.length]);

    const suggestedBoats = useMemo(() => {
        if (!currentBoat || !boats || boats.length === 0) return [];

        const currentType = currentBoat?.type?.id;
        // Selon la structure de votre API, used peut être dans boatinfo ou à la racine
        const currentUsed = currentBoat?.boatinfo?.used ?? currentBoat?.used;

        return boats
            .filter(boat => {
                // Exclure le bateau actuel de la liste des suggestions
                if (boat.id === currentBoat.id) return false;
                
                const boatType = boat?.type?.id;
                const boatUsed = boat?.boatinfo?.used ?? boat?.used;

                // Vérifier que le type et l'état (used) correspondent
                return boatType === currentType && boatUsed === currentUsed;
            })
            .slice(0, 4); // On limite l'affichage à 4 bateaux
    }, [currentBoat, boats]);

    if (suggestedBoats.length === 0) return null;

    return (
        <div className="mt-16 pt-8 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-8">Ces bateaux pourraient aussi vous plaire</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestedBoats.map(boat => (
                    <BoatCard key={boat.id} data={boat} />
                ))}
            </div>
        </div>
    );
};

export default BoatSuggestion;