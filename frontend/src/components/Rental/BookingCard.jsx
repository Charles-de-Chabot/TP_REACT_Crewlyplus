import React from 'react';
import BoatCalendar from '../Boat/BoatCalendar';

const BookingCard = ({ searchDates, onDateChange }) => {
    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/30">
            <h3 className="text-xl font-bold text-white mb-6">Dates de Réservation</h3>
            
            <div className="mb-6 flex justify-center">
                <BoatCalendar 
                    startDate={searchDates?.start || ''} 
                    endDate={searchDates?.end || ''} 
                    onDateChange={onDateChange} 
                />
            </div>

            {/* La suite du processus de réservation se mettra ici (Prix total, bouton de validation...) */}
        </div>
    );
};

export default BookingCard;