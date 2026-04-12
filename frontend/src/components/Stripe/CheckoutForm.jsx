import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ buttonText = "Confirmer le paiement" }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Cette URL devra peut-être changer selon le contexte (Location vs Premium)
                return_url: `${window.location.origin}/payment-success`,
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("Une erreur inattendue est survenue.");
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            <button
                disabled={isLoading || !stripe || !elements}
                className={`w-full py-6 font-black rounded-3xl transition-all uppercase tracking-tighter text-xl ${
                    isLoading 
                    ? 'bg-slate-800 text-slate-500 cursor-wait' 
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30'
                }`}
            >
                {isLoading ? "Traitement..." : buttonText}
            </button>
            {message && <div className="text-red-500 text-sm italic font-bold">{message}</div>}
        </form>
    );
};

export default CheckoutForm;