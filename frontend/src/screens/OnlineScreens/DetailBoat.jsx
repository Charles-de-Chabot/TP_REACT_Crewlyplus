import React from 'react';
import { useParams } from 'react-router-dom';
import HeaderDetail from '../../components/DetailBoat/HeaderDetail';
import InfoDetail from '../../components/DetailBoat/InfoDetail';
import BoatSuggestion from '../../components/Boat/BoatSuggestion';
import AddressDetail from '../../components/DetailBoat/AddressDetail';
import BookingCard from '../../components/Rental/BookingCard';
import Layout from '../../components/UI/Layout';
import PageLoader from '../../components/Loader/PageLoader';
import useBoatDetail from '../../hooks/useBoatDetail';
import PageHeader from '../../components/UI/PageHeader';

const DetailBoat = () => {
    const { id } = useParams();
    const { loading, boatDetail, searchDates, handleDateChange } = useBoatDetail(id);

    // Écran de chargement
    if (loading && (!boatDetail || boatDetail.id !== parseInt(id))) {
        return <PageLoader />;
    }

    return (
        <Layout className="pb-12">
            <PageHeader 
                title="Détails" 
                subtitle="Bateau" 
                description={boatDetail ? `${boatDetail.name} - ${boatDetail.model?.name}` : "Caractéristiques du navire"}
                backPath="/boats"
                backLabel="Retour à la flotte"
            />
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
                        <div className="sticky top-28 space-y-6">
                            <BookingCard boatDetail={boatDetail} searchDates={searchDates} onDateChange={handleDateChange} />
                            
                            {/* Section Emplacement / Adresse */}
                            <AddressDetail address={boatDetail?.adress} />
                        </div>
                    </div>

                </div>

                {/* Section Suggestions */}
                <BoatSuggestion currentBoat={boatDetail} />
            </div>
        </Layout>
    );
};

export default DetailBoat; 