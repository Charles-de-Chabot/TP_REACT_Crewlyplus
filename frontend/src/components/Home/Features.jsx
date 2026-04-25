// src/components/Home/Features.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';

const Features = () => {
    const { role } = useAuthContext();

    // On normalise la vérification des rôles (exact match base de données)
    const isPremium = role === 'ROLE_PREMIUM';
    const isStaff = ['ROLE_CAPITAINE', 'ROLE_HOTESSE', 'ROLE_CHEF'].includes(role);

    return (
        <div className="py-24 bg-slate-900/50 relative border-y border-white/5">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-white sm:text-4xl italic tracking-tighter">L'EXPÉRIENCE CREWLY</h2>
                    <p className="mt-4 text-lg text-slate-400">La seule plateforme qui réunit plaisanciers, compétiteurs et professionnels de la mer.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    
                    {/* CARTE 1 : BATEAUX (Public / User) */}
                    <Link to="/boats" className="group text-center p-8 rounded-[3rem] bg-slate-800/10 border border-white/5 backdrop-blur-sm hover:bg-teal-500/5 hover:border-teal-500/30 transition-all duration-500">
                        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-teal-500/10 text-teal-400 mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-teal-500/10">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Réservation Simplifiée</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Parcourez notre flotte d'exception et louez votre bateau en quelques clics. Simple, rapide et sécurisé.</p>
                        <span className="mt-4 inline-block text-[10px] font-bold text-teal-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Explorer la flotte →</span>
                    </Link>

                    {/* CARTE 2 : RÉGATES (Premium) */}
                    <Link 
                        to={isPremium ? "/regatta" : "/register_premium"} 
                        className={`group text-center p-8 rounded-[3rem] border backdrop-blur-sm transition-all duration-500 ${isPremium ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10' : 'bg-slate-800/10 border-white/5 hover:border-amber-500/30'}`}
                    >
                        <div className={`flex items-center justify-center h-16 w-16 rounded-2xl mb-6 mx-auto group-hover:rotate-12 transition-transform shadow-lg ${isPremium ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800/40 text-slate-400'}`}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">
                            {isPremium ? "Gestion de Régate" : "L'Arène des Régates"}
                        </h3>
                        
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {isPremium 
                                ? "Suivez vos performances, gérez vos teams et accédez au calendrier exclusif de la 1ère plateforme communautaire de régate."
                                : "Découvrez l'unique espace dédié aux compétiteurs : création d'équipes, classements en direct et inscriptions simplifiées."
                            }
                        </p>
                        {!isPremium && <span className="mt-4 inline-block text-[10px] font-bold text-amber-500 uppercase tracking-widest">Devenir Premium →</span>}
                    </Link>

                    {/* CARTE 3 : STAFF (Professionnels) */}
                    <Link 
                        to={isStaff ? "/crew/dashboard" : "/crew/register"} 
                        className={`group text-center p-8 rounded-[3rem] border backdrop-blur-sm transition-all duration-500 ${isStaff ? 'bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10' : 'bg-slate-800/10 border-white/5 hover:border-blue-500/30'}`}
                    >
                        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-500/10 text-blue-400 mb-6 mx-auto group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3">
                            {isStaff ? "Tableau de Bord Pro" : "Rejoignez le Crew"}
                        </h3>
                        
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {isStaff 
                                ? "Accédez à vos missions de capitaine, hôtesse ou chef. Gérez vos contrats et validez vos prochaines sorties en mer."
                                : "Capitaine, Hôtesse ou Chef ? Valorisez votre expertise professionnelle et trouvez vos futures missions sur Crewly."
                            }
                        </p>
                        {!isStaff && <span className="mt-4 inline-block text-[10px] font-bold text-blue-400 uppercase tracking-widest">Postuler comme Staff →</span>}
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default Features;