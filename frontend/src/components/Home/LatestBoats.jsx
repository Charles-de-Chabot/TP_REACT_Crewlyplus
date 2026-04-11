import React from 'react';
import { Link } from 'react-router-dom';
import BoatCard from '../Boat/BoatCard';

const LatestBoats = ({ isLoading, latestBoats }) => {
    return (
        <div className="py-24 relative">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl font-bold text-white">Nos derniers ajouts</h2>
                        <p className="mt-2 text-slate-400">Embarquez sur nos nouveautés.</p>
                    </div>
                    <Link to="/boats" className="text-teal-400 font-semibold hover:text-teal-300 flex items-center transition-colors duration-200">
                        Tout voir <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-10 text-teal-500">
                        <svg className="animate-spin h-10 w-10" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : latestBoats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestBoats.map((boat) => (
                            <BoatCard key={boat.id} data={boat} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-slate-400">Aucun bateau n'a encore été ajouté.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LatestBoats;