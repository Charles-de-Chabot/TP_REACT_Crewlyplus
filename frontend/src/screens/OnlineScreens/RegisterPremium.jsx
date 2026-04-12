import React, { useState } from 'react';
import PremiumHero from '../../components/RegisterPremium/PremiumHero';
import FeatureList from '../../components/RegisterPremium/FeatureList';
import PricingCard from '../../components/RegisterPremium/PricingCard';
import CommunitySection from '../../components/RegisterPremium/CommunitySection';
import FleetSection from '../../components/RegisterPremium/FleetSection';
// Import de ton nouveau composant de formulaire
import PremiumForm from '../../components/RegisterPremium/PremiumForm'; 

const RegisterPremium = () => {
    // Étape 1 : Présentation / Étape 2 : Formulaire / Étape 3 : Stripe
    const [step, setStep] = useState(1); 

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-16 pb-20">
            <div className="container mx-auto px-6">
                
                <PremiumHero />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <FeatureList />

                    {/* Zone dynamique : On gère les 3 étapes */}
                    <div className="relative">
                        {/* ÉTAPE 1 : PRIX */}
                        {step === 1 && (
                            <PricingCard onUpgrade={() => setStep(2)} />
                        )}

                        {/* ÉTAPE 2 : FORMULAIRE INFOS */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <PremiumForm onComplete={() => setStep(3)} />
                                <button 
                                    onClick={() => setStep(1)}
                                    className="mt-6 flex items-center gap-2 text-slate-500 text-xs hover:text-amber-500 transition-colors uppercase font-bold tracking-widest"
                                >
                                    <span>←</span> Retour aux avantages
                                </button>
                            </div>
                        )}

                        {/* ÉTAPE 3 : PAIEMENT STRIPE (Placeholder en attendant l'install) */}
                        {step === 3 && (
                            <div className="bg-slate-900/60 border border-teal-500/30 backdrop-blur-3xl p-12 rounded-[4rem] text-center shadow-2xl animate-fade-in">
                                <div className="w-16 h-16 bg-teal-500/10 border border-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                                <h2 className="text-2xl font-black italic uppercase text-white mb-2">Sécurisation</h2>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Préparation de votre tunnel de paiement sécurisé...
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="border-white/5 mb-32" />
                <CommunitySection />
                <FleetSection />
            </div>
        </div>
    );
};

export default RegisterPremium;