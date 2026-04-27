import React from 'react';
import { useAuthContext } from '../../contexts/authContext';
import BoatCard from '../../components/Boat/BoatCard';
import BoatHero from '../../components/Boat/BoatHero';
import FilterBar from '../../components/Boat/FilterBar';
import NoResults from '../../components/Boat/NoResults';
import Layout from '../../components/UI/Layout';
import useBoatsFilter from '../../hooks/useBoatsFilter';

import PageHeader from '../../components/UI/PageHeader';

const Boats = () => {
    const { userId } = useAuthContext();
    const {
        loading, boats, types, cities, availableModels,
        filters, activeCount, handleFilterChange, handleDateChange, resetFilters
    } = useBoatsFilter();

    return (
        <Layout>
            <PageHeader 
                title="La" 
                subtitle="Flotte" 
                description="Réservez votre navire d'exception"
                backPath="/"
                backLabel="Retour à l'accueil"
            />
            <BoatHero>
                <FilterBar 
                    userId={userId}
                    filters={filters}
                    handleFilterChange={handleFilterChange}
                    handleDateChange={handleDateChange}
                    resetFilters={resetFilters}
                    types={types}
                    availableModels={availableModels}
                    cities={cities}
                    activeCount={activeCount}
                    isLoading={loading}
                />
            </BoatHero>

            <div className="container mx-auto px-4 py-12">
                {/* Entête des résultats */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white">Résultats de recherche</h2>
                    <span className="bg-teal-500/10 text-teal-400 text-xs font-bold px-3 py-1 rounded-full border border-teal-500/20">
                        {boats.length} bateau{boats.length > 1 ? 'x' : ''}
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-teal-500">
                        <svg className="animate-spin h-10 w-10" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : boats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {boats.map((boat) => (
                            <BoatCard key={boat.id} data={boat} />
                        ))}
                    </div>
                ) : (
                    <NoResults resetFilters={resetFilters} />
                )}
            </div>
        </Layout>
    );
};

export default Boats;