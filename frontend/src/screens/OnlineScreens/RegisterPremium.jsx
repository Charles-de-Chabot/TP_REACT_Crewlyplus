import React, { useState } from 'react';
import PremiumHero from '../../components/RegisterPremium/PremiumHero';
import FeatureList from '../../components/RegisterPremium/FeatureList';
import PricingCard from '../../components/RegisterPremium/PricingCard';
import CommunitySection from '../../components/RegisterPremium/CommunitySection';
import FleetSection from '../../components/RegisterPremium/FleetSection';
import PremiumForm from '../../components/RegisterPremium/PremiumForm'; 
import StripeContainer from '../../components/Stripe/StripeContainer'; 

const RegisterPremium = () => {
    const [step, setStep] = useState(1); 

    return (
        <div className="min-h-screen bg-slate-950 text-white pt-16 pb-20">
            <div className="container mx-auto px-6">
                
                <PremiumHero />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
                    <FeatureList />

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

                        {/* ÉTAPE 3 : LE VRAI TUNNEL STRIPE */}
                        {step === 3 && (
                            <div className="animate-fade-in">
                                <StripeContainer />
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