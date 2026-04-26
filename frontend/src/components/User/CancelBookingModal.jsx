import React from 'react';
import { HiExclamationTriangle, HiClock, HiArrowPath, HiXMark } from 'react-icons/hi2';

const CancelBookingModal = ({ isOpen, onClose, onConfirm, booking }) => {
    if (!isOpen || !booking) return null;

    const startDate = new Date(booking.rentalStart);
    const now = new Date();
    const diffInHours = (startDate - now) / (1000 * 60 * 60);

    let refundPercent = 0;
    let refundMessage = "";
    let statusColor = "text-red-500";

    if (diffInHours >= 48) {
        refundPercent = 100;
        refundMessage = "Remboursement intégral (100%)";
        statusColor = "text-teal-400";
    } else if (diffInHours > 0) {
        refundPercent = 50;
        refundMessage = "Remboursement partiel (50%)";
        statusColor = "text-amber-500";
    } else {
        refundPercent = 0;
        refundMessage = "Aucun remboursement (Départ aujourd'hui ou passé)";
        statusColor = "text-red-500";
    }

    const refundAmount = (booking.rentalPrice * refundPercent) / 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fadein"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-zoomIn">
                
                {/* Header avec gradient */}
                <div className="relative p-8 pb-4">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-teal-500"></div>
                    
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <HiXMark size={24} />
                    </button>

                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                            <HiExclamationTriangle size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">
                            Annuler l'expédition
                        </h3>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Vous êtes sur le point d'annuler votre réservation pour le bateau <span className="text-teal-400 font-bold">{booking.boat?.name}</span>.
                    </p>
                </div>

                {/* Body - Politique de remboursement */}
                <div className="p-8 pt-4 space-y-6">
                    
                    <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5">
                        <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <HiClock size={14} className="text-teal-500" />
                            Politique d'annulation
                        </h4>
                        
                        <div className="space-y-3">
                            {/* Condition 100% */}
                            <div className={`flex items-center justify-between p-3 rounded-xl transition-all border ${diffInHours >= 48 ? 'bg-teal-500/10 border-teal-500/30' : 'bg-transparent border-transparent opacity-40'}`}>
                                <span className="text-sm text-slate-300">Plus de 48h avant</span>
                                <span className="text-sm font-black text-teal-400">Remboursement 100%</span>
                            </div>

                            {/* Condition 50% */}
                            <div className={`flex items-center justify-between p-3 rounded-xl transition-all border ${diffInHours > 0 && diffInHours < 48 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-transparent border-transparent opacity-40'}`}>
                                <span className="text-sm text-slate-300">Entre 0h et 48h</span>
                                <span className="text-sm font-black text-amber-500">Remboursement 50%</span>
                            </div>

                            {/* Condition 0% */}
                            <div className={`flex items-center justify-between p-3 rounded-xl transition-all border ${diffInHours <= 0 ? 'bg-red-500/10 border-red-500/30' : 'bg-transparent border-transparent opacity-40'}`}>
                                <span className="text-sm text-slate-300">Départ aujourd'hui ou passé</span>
                                <span className="text-sm font-black text-red-500">Aucun remboursement</span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 uppercase font-bold">Votre situation :</span>
                            <span className="text-xs font-black text-white italic uppercase tracking-wider">
                                {diffInHours >= 48 ? 'Plus de 48h avant' : diffInHours > 0 ? 'Entre 0h et 48h' : 'Départ aujourd\'hui ou passé'}
                            </span>
                        </div>
                    </div>

                    {/* Estimation du remboursement */}
                    <div className="flex items-center justify-between bg-teal-500/5 rounded-2xl p-6 border border-teal-500/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                                <HiArrowPath size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-teal-500/60 uppercase tracking-widest">Montant à rembourser</p>
                                <p className="text-xl font-black text-white italic">{refundAmount.toFixed(2)} €</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Prix initial</p>
                            <p className="text-sm font-bold text-slate-400">{booking.rentalPrice} €</p>
                        </div>
                    </div>

                    <p className="text-[11px] text-slate-500 text-center px-4">
                        En confirmant, votre réservation sera annulée immédiatement. Le remboursement sera traité par notre partenaire Stripe sous 5 à 10 jours ouvrés.
                    </p>
                </div>

                {/* Actions */}
                <div className="p-8 pt-0 grid grid-cols-2 gap-4">
                    <button 
                        onClick={onClose}
                        className="px-6 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-all border border-white/5"
                    >
                        Garder la réservation
                    </button>
                    <button 
                        onClick={() => onConfirm(booking.id)}
                        className="px-6 py-4 rounded-2xl bg-red-500 hover:bg-red-400 text-slate-900 font-black text-sm uppercase tracking-wider transition-all shadow-lg shadow-red-500/20"
                    >
                        Confirmer l'annulation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelBookingModal;
