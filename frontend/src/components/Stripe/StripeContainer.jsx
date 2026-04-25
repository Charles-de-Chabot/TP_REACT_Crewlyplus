import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import api from '../../api/axios';

// Clé Publique (pk_test_...)
const stripePromise = loadStripe('pk_test_51TLB0IGpNFFeiWtxVr7bdvlQBUR9lsjI9lsUgcGFuj2pjSGk1AfK8kF8Vt1TtxzdBWpoclT32XhIIDdvjT0tDreq00FjyGhLDD');

const StripeContainer = () => {
    const [clientSecret, setClientSecret] = useState('');

        useEffect(() => {
            api.post('/api/create-subscription')
                .then(res => {
                    setClientSecret(res.data.clientSecret);
                })
                .catch(err => {
                    console.error("L'APPEL API A ÉCHOUÉ :", err.response?.data || err.message);
                });
        }, []);

    // Style sombre pour coller à ton interface Crewly
    const appearance = {
        theme: 'night',
        variables: {
            colorPrimary: '#f59e0b', // Amber 500
            colorBackground: '#0f172a', // Slate 900
            colorText: '#ffffff',
        },
    };

    return (
        <div className="bg-slate-900/60 border border-white/10 backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] shadow-2xl">
            {clientSecret ? (
                <Elements 
                    stripe={stripePromise} 
                    options={{ 
                        clientSecret, 
                        appearance,
                        // Stripe détecte automatiquement le bon formulaire selon le type de secret
                    }}
                >
                    <CheckoutForm buttonText="Payer mon accès Élite" />
                </Elements>
            ) : (
                <div className="text-center py-10">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 uppercase text-[10px] tracking-[0.2em] font-bold">Initialisation sécurisée...</p>
                </div>
            )}
        </div>
    );
};

export default StripeContainer;