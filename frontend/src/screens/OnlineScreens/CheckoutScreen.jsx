import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Layout from '../../components/UI/Layout';
import CheckoutForm from '../../components/Stripe/CheckoutForm';
import { selectStripeClientSecret, selectTotalPrice, selectSelectedBoat } from '../../store/booking/bookingSelectors';

const stripePromise = loadStripe('pk_test_51TLB0IGpNFFeiWtxVr7bdvlQBUR9lsjI9lsUgcGFuj2pjSGk1AfK8kF8Vt1TtxzdBWpoclT32XhIIDdvjT0tDreq00FjyGhLDD');

const CheckoutScreen = () => {
    const navigate = useNavigate();
    const clientSecret = useSelector(selectStripeClientSecret);
    const totalPrice = useSelector(selectTotalPrice);
    const boat = useSelector(selectSelectedBoat);

    // Redirect if no secret (meaning the booking wasn't submitted)
    useEffect(() => {
        if (!clientSecret) {
            navigate('/boats');
        }
    }, [clientSecret, navigate]);

    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#14b8a6', // Teal 500
            colorBackground: '#0f172a', // Slate 900
            colorText: '#ffffff',
            borderRadius: '1.5rem',
        },
    };

    if (!clientSecret) return null;

    return (
        <Layout className="pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-2xl">
                
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black text-white mb-2">Finalisation du Paiement</h1>
                    <p className="text-white/60">Paiement sécurisé via Stripe pour {boat?.name}</p>
                </div>

                <div className="bg-slate-900/60 border border-white/10 backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    {/* Glow */}
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />
                    
                    <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                        <p className="text-white/60 font-medium">Montant à régler</p>
                        <p className="text-3xl font-black text-teal-400">{totalPrice} €</p>
                    </div>

                    <Elements 
                        stripe={stripePromise} 
                        options={{ 
                            clientSecret, 
                            appearance,
                        }}
                    >
                        <CheckoutForm buttonText={`Payer ${totalPrice} €`} />
                    </Elements>

                    <div className="mt-10 flex items-center justify-center gap-6 opacity-40 grayscale">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
                        <div className="h-4 w-[1px] bg-white/20" />
                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white">SSL Encrypted</p>
                    </div>
                </div>

                <p className="text-center text-white/30 text-xs mt-8 px-10">
                    En cliquant sur payer, vous acceptez nos conditions générales de vente et la politique de réservation de CrewlyPlus.
                </p>
            </div>
        </Layout>
    );
};

export default CheckoutScreen;
