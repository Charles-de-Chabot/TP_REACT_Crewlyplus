import React from 'react';

const STATUS_LABELS = {
    'pending': { label: 'En attente', color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    'confirmed': { label: 'Confirmée', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    'cancelled': { label: 'Annulée', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    'completed': { label: 'Terminée', color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
};

const BookingHistory = ({ bookings = [], onCancel }) => {
    if (!bookings || bookings.length === 0) {
        return (
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-12 shadow-xl shadow-black/30 text-center">
                <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                <h3 className="text-xl font-bold text-white mb-2">Historique des réservations</h3>
                <p className="text-slate-400">Vous n'avez pas encore de réservations enregistrées.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-teal-500"></span>
                Mes Expéditions
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
                {bookings.map((booking) => {
                    const status = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;
                    return (
                        <div key={booking.id} className="group bg-slate-900/60 hover:bg-slate-900 border border-white/10 hover:border-white/20 rounded-3xl p-6 transition-all duration-300">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/5 flex flex-col items-center justify-center shrink-0">
                                        <span className="text-[10px] font-black text-teal-500 uppercase leading-none mb-1">
                                            {new Date(booking.rentalStart).toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}
                                        </span>
                                        <span className="text-2xl font-black text-white leading-none">
                                            {new Date(booking.rentalStart).getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg group-hover:text-teal-400 transition-colors">
                                            {booking.boat?.name || "Bateau sélectionné"}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-slate-500 text-xs font-medium">
                                                Du {new Date(booking.rentalStart).toLocaleDateString()} au {new Date(booking.rentalEnd).toLocaleDateString()}
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                            <p className="text-teal-500 font-bold text-xs">{booking.rentalPrice} €</p>
                                        </div>

                                        {/* Crew Progress Tracking */}
                                        {booking.requestedRoles?.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {booking.requestedRoles.map((role, idx) => {
                                                    const isFilled = booking.crewMembers?.some(m => m.roleLabel === role);
                                                    return (
                                                        <span key={idx} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${isFilled ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-slate-800/50 text-slate-500 border-white/5'}`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${isFilled ? 'bg-teal-400' : 'bg-slate-600'}`}></span>
                                                            {role.replace('ROLE_', '')}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                                    <span className={`px-4 py-1.5 rounded-full border ${status.border} ${status.bg} ${status.color} text-[10px] font-black uppercase tracking-widest`}>
                                        {status.label}
                                    </span>
                                    
                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                        <button 
                                            onClick={() => onCancel && onCancel(booking.id)}
                                            className="px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                                            title="Annuler la réservation"
                                        >
                                            Annuler
                                        </button>
                                    )}

                                    {booking.status === 'confirmed' && (
                                        <button className="p-2.5 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/5" title="Télécharger la facture">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BookingHistory;