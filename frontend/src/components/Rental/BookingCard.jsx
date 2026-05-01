import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BoatCalendar from '../Boat/BoatCalendar';
import { useAuthContext } from '../../contexts/authContext';
import { setSelectedBoat, setDates, setPremiumDiscount, setBookingStatus } from '../../store/booking/bookingSlice';
import IconRenderer from '../UI/IconRenderer';

const BookingCard = ({ boatDetail, searchDates, onDateChange }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { roleLabel } = useAuthContext();
    const shakeRef = useRef(null);

    // Business Rule: Premium Discount (-15%) applies if ROLE_PREMIUM AND boat is used for Regatta
    const isPremiumRegatta = roleLabel === 'ROLE_PREMIUM' && boatDetail?.used === true;

    const handleDateUpdate = (start, end) => {
        // Update local state (via parent hook)
        onDateChange(start, end);

        // Update Redux state for the booking module
        dispatch(setSelectedBoat(boatDetail));
        dispatch(setDates({ start, end }));
        dispatch(setPremiumDiscount(isPremiumRegatta));
        dispatch(setBookingStatus('idle'));
    };

    const handleBookingClick = () => {
        if (!searchDates?.start || !searchDates?.end) {
            // Trigger shake animation
            shakeRef.current?.classList.add('animate-shake');
            setTimeout(() => {
                shakeRef.current?.classList.remove('animate-shake');
            }, 500);
            return;
        }

        // On s'assure que le store de réservation a bien les infos AVANT de naviguer
        dispatch(setSelectedBoat(boatDetail));
        dispatch(setDates({ start: searchDates.start, end: searchDates.end }));
        dispatch(setPremiumDiscount(isPremiumRegatta));
        dispatch(setBookingStatus('idle'));

        // Navigate to the next step
        navigate('/configurator');
    };

    const calculatePriceBreakdown = () => {
        if (!searchDates?.start || !searchDates?.end) return null;

        const start = new Date(searchDates.start);
        const end = new Date(searchDates.end);
        const diffTime = Math.abs(end - start);
        const nbDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (nbDays <= 0) return null;

        const weeks = Math.floor(nbDays / 7);
        const extraDays = nbDays % 7;
        
        const pricePerWeek = boatDetail.weekPrice || 0;
        const pricePerDay = boatDetail.dayPrice || 0;
        
        const boatBase = (weeks * pricePerWeek) + (extraDays * pricePerDay);
        const discount = isPremiumRegatta ? boatBase * 0.15 : 0;
        const total = boatBase - discount;

        return {
            nbDays,
            weeks,
            extraDays,
            boatBase,
            discount,
            total,
            pricePerWeek,
            pricePerDay
        };
    };

    const breakdown = calculatePriceBreakdown();

    return (
        <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-10 shadow-2xl shadow-black/50">
            <h3 className="text-xl font-black text-white mb-6 italic uppercase tracking-tighter">Dates de Réservation</h3>
            
            {/* Premium Badge */}
            {isPremiumRegatta && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-4">
                    <IconRenderer icon="💎" size={20} className="text-amber-500" />
                    <div>
                        <p className="text-amber-500 text-[10px] font-black tracking-[0.2em] uppercase leading-none mb-1">Tarif Élite Activé</p>
                        <p className="text-white/60 text-[10px] font-medium uppercase tracking-tight">-15% sur toutes vos formules</p>
                    </div>
                </div>
            )}

            <div className="mb-8 flex justify-center">
                <BoatCalendar 
                    startDate={searchDates?.start || ''} 
                    endDate={searchDates?.end || ''} 
                    onDateChange={handleDateUpdate} 
                />
            </div>

            {/* Price Breakdown */}
            {breakdown && (
                <div className="mb-8 p-6 bg-white/5 border border-white/5 rounded-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Détail du séjour</span>
                        <span className="text-white">{breakdown.nbDays} Jours</span>
                    </div>
                    
                    <div className="space-y-2">
                        {breakdown.weeks > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60 font-medium">{breakdown.weeks} Semaine{breakdown.weeks > 1 ? 's' : ''} <span className="text-[10px] text-slate-600">({breakdown.pricePerWeek}€/sem)</span></span>
                                <span className="text-xs text-white font-bold">{breakdown.weeks * breakdown.pricePerWeek}€</span>
                            </div>
                        )}
                        {breakdown.extraDays > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-white/60 font-medium">{breakdown.extraDays} Jour{breakdown.extraDays > 1 ? 's' : ''} suppl. <span className="text-[10px] text-slate-600">({breakdown.pricePerDay}€/j)</span></span>
                                <span className="text-xs text-white font-bold">{breakdown.extraDays * breakdown.pricePerDay}€</span>
                            </div>
                        )}
                        
                        {isPremiumRegatta && (
                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                <span className="text-xs text-amber-500 font-bold uppercase tracking-tighter italic">Réduction Premium (-15%)</span>
                                <span className="text-xs text-amber-500 font-bold">-{Math.round(breakdown.discount * 100) / 100}€</span>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Location</span>
                        <span className="text-2xl font-black text-white italic tracking-tighter">{Math.round(breakdown.total * 100) / 100}€</span>
                    </div>
                </div>
            )}

            <div ref={shakeRef} className="transition-transform duration-200">
                <button
                    onClick={handleBookingClick}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 group ${
                        (searchDates?.start && searchDates?.end)
                            ? 'bg-accent-role text-slate-950 shadow-glow-role hover:opacity-90 hover:shadow-accent-role/30'
                            : 'bg-white/5 text-slate-500 border border-white/5'
                    }`}
                >
                    Réserver ce navire
                    <IconRenderer icon="➡️" size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                {!searchDates?.start && (
                    <p className="text-center text-slate-500 text-[9px] font-black uppercase tracking-widest mt-4 italic">
                        Sélectionnez vos dates d'embarquement
                    </p>
                )}
            </div>
        </div>
    );
};

export default BookingCard;