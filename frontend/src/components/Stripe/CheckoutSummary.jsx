import React from 'react';

const CheckoutSummary = ({ totalPrice, boatName, onBack }) => {
    return (
        <div className="mb-12">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors mb-6 group mx-auto"
            >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Modifier ma configuration</span>
            </button>

            <div className="text-center">
                <h1 className="text-3xl font-black text-white mb-2">Finalisation du Paiement</h1>
                <p className="text-white/60">Paiement sécurisé via Stripe pour {boatName}</p>
            </div>
            
            <div className="flex justify-between items-center mt-10 mb-2 pb-6 border-b border-white/5 max-w-md mx-auto">
                <p className="text-white/60 font-medium">Montant à régler</p>
                <p className="text-3xl font-black text-teal-400">{totalPrice} €</p>
            </div>
        </div>
    );
};

export const StripeTrustBadges = () => (
    <div className="mt-10 flex items-center justify-center gap-6 opacity-40 grayscale">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
        <div className="h-4 w-[1px] bg-white/20" />
        <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white">SSL Encrypted</p>
    </div>
);

export default CheckoutSummary;
