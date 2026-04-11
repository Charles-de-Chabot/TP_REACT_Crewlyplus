import React from 'react';

const BookingHistory = ({ bookings }) => {
    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/30 min-h-[300px] flex items-center justify-center">
            <div className="text-center">
                <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Historique des réservations</h3>
                <p className="text-slate-400">Vous n'avez pas encore de réservations enregistrées.</p>
            </div>
        </div>
    );
};

export default BookingHistory;