import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import BoatCard from '../../components/Boat/BoatCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBoats } from '../../store/boat/boatSlice'
import selectBoatData from '../../store/boat/boatSelector'
import { TRAILER_VIDEO } from '../../constants/appConstant'

const Home = () => {
    const dispatch = useDispatch();
    
    // Récupération des données globales via Redux
    const { loading: isLoading, boats } = useSelector(selectBoatData);

    // On déduit les nouveautés en prenant juste les 3 premiers
    const latestBoats = boats.slice(0, 3);

    useEffect(() => {
        // On interroge l'API via Redux uniquement si on n'a pas encore de bateaux en mémoire
        if (boats.length === 0) {
            dispatch(fetchBoats());
        }
    }, [dispatch, boats.length]);

    return (
        <div className="flex flex-col w-full min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
            
            {/* Hero Section */}
            <div className="relative w-full py-24 lg:py-32 overflow-hidden pt-2">
                {/* Arrière-plan Vidéo */}
                <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    <source src={TRAILER_VIDEO} type="video/mp4" />
                </video>
                
                {/* Overlay sombre pour assurer la lisibilité du texte */}
                <div className="absolute inset-0 bg-slate-950/60 z-0"></div>
                
                <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center animate-slideup">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6 drop-shadow-2xl">
                        Embarquez avec Crewly
                    </h1>
                    <p className="mt-4 max-w-3xl text-xl text-slate-200 mb-10">
                        Louez le bateau de vos rêves et partez à la découverte des plus beaux horizons
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link 
                            to="/boats" 
                            className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-lg px-8 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-1"
                        >
                            Réserver maintenant
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-slate-900/50 relative border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white sm:text-4xl">Pourquoi choisir Crewly ?</h2>
                        <p className="mt-4 text-lg text-slate-400">Disponible partout en France: simple, rapide et sécurisé.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature 1 */}
                        <div className="text-center p-6 rounded-3xl bg-slate-800/20 border border-white/5 backdrop-blur-sm hover:bg-slate-800/40 transition-colors duration-300">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-500/10 text-teal-400 mb-6 mx-auto">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Réservation Facile</h3>
                            <p className="text-slate-400">Quelques clics suffisent pour bloquer vos dates et partir naviguer.</p>
                        </div>
                        {/* Feature 2 */}
                        <div className="text-center p-6 rounded-3xl bg-slate-800/20 border border-white/5 backdrop-blur-sm hover:bg-slate-800/40 transition-colors duration-300">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-500/10 text-teal-400 mb-6 mx-auto">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Flexibilité</h3>
                            <p className="text-slate-400">Annulation gratuite jusqu'à 48h avant le départ sur la plupart des bateaux.</p>
                        </div>
                        {/* Feature 3 */}
                        <div className="text-center p-6 rounded-3xl bg-slate-800/20 border border-white/5 backdrop-blur-sm hover:bg-slate-800/40 transition-colors duration-300">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-500/10 text-teal-400 mb-6 mx-auto">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Paiement Sécurisé</h3>
                            <p className="text-slate-400">Transactions cryptées et garanties pour votre tranquillité d'esprit.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Nouveautés */}
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
        </div>
    )
}

export default Home
