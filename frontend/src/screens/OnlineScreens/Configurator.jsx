import React from 'react';
import PageLoader from '../../components/Loader/PageLoader';
import Layout from '../../components/UI/Layout';

// Components
import CrewSelector from '../../components/Configurator/CrewSelector';
import FittingSelector from '../../components/Configurator/FittingSelector';
import ConfiguratorBasket from '../../components/Configurator/ConfiguratorBasket';
import ConfiguratorHeader from '../../components/Configurator/ConfiguratorHeader';

// Custom Hook
import { useConfigurator } from '../../hooks/useConfigurator';
import { useNavigate } from 'react-router-dom';

const Configurator = () => {
    const navigate = useNavigate();
    const {
        boat,
        dates,
        fittings,
        totalPrice,
        isPremiumDiscount,
        bookingError,
        loading,
        handlePayment,
        handleDateChange,
        CREW_ROLES
    } = useConfigurator();

    if (loading || !boat) return <PageLoader />;

    return (
        <Layout className="pt-32 pb-20 bg-slate-950 min-h-screen relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[150px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6 max-w-[1400px]">
                
                <ConfiguratorHeader 
                    boat={boat}
                    dates={dates}
                    isPremiumDiscount={isPremiumDiscount}
                    onBack={() => navigate(`/boat/${boat.id}`)}
                    onDateChange={handleDateChange}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Colonne de Gauche : Options */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Crew Selection */}
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Votre Équipage</h2>
                                <div className="flex-1 h-[1px] bg-white/5" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {CREW_ROLES.map((role) => (
                                    <CrewSelector key={role.role} roleConfig={role} />
                                ))}
                            </div>
                        </section>

                        {/* Fittings Selection */}
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Équipements & Services</h2>
                                <div className="flex-1 h-[1px] bg-white/5" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {fittings.map((fitting) => (
                                    <FittingSelector key={fitting.id} fitting={fitting} />
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Colonne de Droite : Panier */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32">
                            <ConfiguratorBasket 
                                onPayment={handlePayment} 
                                bookingError={bookingError}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Configurator;
