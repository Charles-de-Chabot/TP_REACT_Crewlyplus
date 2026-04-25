import React, { useEffect, useState } from 'react';
import { useStripe, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';

// 1. On charge Stripe
const stripePromise = loadStripe('pk_test_51TLB0IGpNFFeiWtxVr7bdvlQBUR9lsjI9lsUgcGFuj2pjSGk1AfK8kF8Vt1TtxzdBWpoclT32XhIIDdvjT0tDreq00FjyGhLDD');

const PaymentStatusContent = () => {
    const stripe = useStripe();
    const [status, setStatus] = useState('loading');
    const { refreshProfile } = useAuthContext();

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            setStatus('error');
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (paymentIntent.status === "succeeded") {
                setStatus('success');
                refreshProfile(); // On rafraîchit les infos de l'utilisateur (rôle premium)
            } else {
                setStatus('error');
            }
        });
    }, [stripe, refreshProfile]);

    return (
        <div className="py-20 text-center">
            {status === 'success' ? (
                <div className="bg-slate-900/60 p-10 rounded-[3rem] border border-teal-500/30 inline-block">
                    <h2 className="text-3xl font-black text-white uppercase italic mb-4">Paiement Réussi !</h2>
                    <p className="text-slate-400 mb-6">Bienvenue parmi nos membres Élite.</p>
                    <Link to="/" className="bg-amber-500 text-black px-8 py-3 rounded-xl font-bold uppercase">
                        Retour à l'accueil
                    </Link>
                </div>
            ) : (
                <p className="text-white">Vérification du statut du paiement...</p>
            )}
        </div>
    );
};

// 2. Le composant principal qui entoure le contenu avec Elements
const PaymentStatus = () => (
    <Elements stripe={stripePromise}>
        <PaymentStatusContent />
    </Elements>
);

export default PaymentStatus;