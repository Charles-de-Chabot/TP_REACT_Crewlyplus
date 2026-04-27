import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Layout from '../../components/UI/Layout';
import CheckoutForm from '../../components/Stripe/CheckoutForm';
import CheckoutSummary, { StripeTrustBadges } from '../../components/Stripe/CheckoutSummary';
import { selectStripeClientSecret, selectTotalPrice, selectSelectedBoat } from '../../store/booking/bookingSelectors';
import PageHeader from '../../components/UI/PageHeader';

const stripePromise = loadStripe('pk_test_51TLB0IGpNFFeiWtxVr7bdvlQBUR9lsjI9lsUgcGFuj2pjSGk1AfK8kF8Vt1TtxzdBWpoclT32XhIIDdvjT0tDreq00FjyGhLDD');

const CheckoutScreen = () => {
    const navigate = useNavigate();
    const clientSecret = useSelector(selectStripeClientSecret);
    const totalPrice = useSelector(selectTotalPrice);
    const boat = useSelector(selectSelectedBoat);

    useEffect(() => {
        if (!clientSecret) {
            navigate('/boats');
        }
    }, [clientSecret, navigate]);

    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#14b8a6',
            colorBackground: '#0f172a',
            colorText: '#ffffff',
            borderRadius: '1.5rem',
        },
    };

    if (!clientSecret) return null;

    return (
        <Layout className="pb-12">
            <PageHeader 
                title="Paiement" 
                subtitle="Sécurisé" 
                description="Finalisez votre réservation"
                backPath="/configurator"
                backLabel="Retour au configurateur"
            />
            <div className="container mx-auto px-4 max-w-2xl">
                
                <CheckoutSummary 
                    totalPrice={totalPrice} 
                    boatName={boat?.name} 
                    onBack={() => navigate('/configurator')} 
                />

                <div className="bg-slate-900/60 border border-white/10 backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />
                    
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
                        <CheckoutForm buttonText={`Payer ${totalPrice} €`} />
                    </Elements>

                    <StripeTrustBadges />
                </div>

                <p className="text-center text-white/30 text-xs mt-8 px-10">
                    En confirmant ce paiement, vous acceptez nos conditions générales de location et notre politique de confidentialité.
                </p>
            </div>
        </Layout>
    );
};

export default CheckoutScreen;
