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

    return (
        <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-8 shadow-2xl shadow-black/50">
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

            <div ref={shakeRef} className="transition-transform duration-200">
                <button
                    onClick={handleBookingClick}
                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 group ${
                        (searchDates?.start && searchDates?.end)
                            ? 'bg-teal-500 text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/20'
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