import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const CheckoutSummary = ({ totalPrice, boatName, onBack }) => {
    return (
        <div className="mb-12">
            <button 
                onClick={onBack}
                className="flex items-center gap-3 text-slate-500 hover:text-teal-400 transition-colors mb-8 group mx-auto"
            >
                <IconRenderer icon="➡️" size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Modifier ma configuration</span>
            </button>

            <div className="text-center">
                <h1 className="text-4xl font-black text-white mb-2 italic uppercase tracking-tighter">Finalisation du Paiement</h1>
                <p className="text-white/60 font-medium text-sm">Paiement technique sécurisé pour <span className="text-white">{boatName}</span></p>
            </div>
            
            <div className="flex justify-between items-center mt-12 mb-4 pb-8 border-b border-white/5 max-w-lg mx-auto">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Montant total TTC</p>
                <p className="text-5xl font-black text-teal-400 italic font-mono tracking-tighter">{totalPrice} <span className="text-2xl not-italic">€</span></p>
            </div>
        </div>
    );
};

export const StripeTrustBadges = () => (
    <div className="mt-12 flex items-center justify-center gap-8 opacity-30 grayscale hover:opacity-60 transition-opacity cursor-default">
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-5" />
        <div className="h-4 w-[1px] bg-white/20" />
        <div className="flex items-center gap-2">
            <IconRenderer icon="✅" size={12} />
            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-white">SSL Encrypted</p>
        </div>
    </div>
);

export default CheckoutSummary;
