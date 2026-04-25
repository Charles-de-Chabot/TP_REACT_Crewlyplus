import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BoatCalendar from '../Boat/BoatCalendar';
import { useAuthContext } from '../../contexts/authContext';
import { setSelectedBoat, setDates, setPremiumDiscount } from '../../store/booking/bookingSlice';

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

        // Navigate to the next step
        navigate('/configurator');
    };

    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/30">
            <h3 className="text-xl font-bold text-white mb-4">Dates de Réservation</h3>
            
            {/* Premium Badge */}
            {isPremiumRegatta && (
                <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-3">
                    <span className="text-xl">✦</span>
                    <div>
                        <p className="text-amber-500 text-[10px] font-bold tracking-widest uppercase">Tarif Élite Activé</p>
                        <p className="text-white/70 text-xs">Une remise de 15% sera appliquée sur vos formules.</p>
                    </div>
                </div>
            )}

            <div className="mb-6 flex justify-center">
                <BoatCalendar 
                    startDate={searchDates?.start || ''} 
                    endDate={searchDates?.end || ''} 
                    onDateChange={handleDateUpdate} 
                />
            </div>

            <div ref={shakeRef} className="transition-transform duration-200">
                <button
                    onClick={handleBookingClick}
                    className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group ${
                        (searchDates?.start && searchDates?.end)
                            ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/20'
                            : 'bg-white/5 text-white/40 border border-white/5'
                    }`}
                >
                    Continuer la réservation
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
                
                {!searchDates?.start && (
                    <p className="text-center text-white/30 text-[10px] mt-3 italic">
                        Veuillez sélectionner vos dates pour continuer
                    </p>
                )}
            </div>
        </div>
    );
};

export default BookingCard;