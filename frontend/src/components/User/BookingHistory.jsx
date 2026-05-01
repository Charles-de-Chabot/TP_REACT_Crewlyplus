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
                  <div className="grid grid-cols-1 gap-6">
                {bookings.map((booking) => {
                    const status = STATUS_LABELS[booking.status] || STATUS_LABELS.pending;
                    return (
                        <div key={booking.id} className="group bg-slate-900/60 border border-white/5 rounded-[2.5rem] p-8 transition-all duration-500 hover:bg-slate-900 hover:border-white/10 relative overflow-hidden">
                            {/* Accent Decoration */}
                            <div className={`absolute top-0 left-0 w-1.5 h-full ${status.bg.replace('bg-', 'bg-opacity-40 bg-')}`}></div>
                            
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                                {/* Date Block */}
                                <div className="flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 bg-slate-950 rounded-3xl border border-white/5 shadow-xl">
                                    <span className="text-[10px] font-black text-teal-500 uppercase tracking-widest mb-1">
                                        {new Date(booking.rentalStart).toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}
                                    </span>
                                    <span className="text-3xl font-black text-white italic leading-none">
                                        {new Date(booking.rentalStart).getDate()}
                                    </span>
                                </div>

                                {/* Core Info */}
                                <div className="flex-grow space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic group-hover:text-teal-400 transition-colors">
                                            {booking.boat?.name || "Bateau sélectionné"}
                                        </h4>
                                        <div className={`hidden sm:block w-1.5 h-1.5 rounded-full ${status.color.replace('text', 'bg')}`}></div>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${status.bg} ${status.color} text-[9px] font-black uppercase tracking-widest`}>
                                            {status.label}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Période</span>
                                            <p className="text-slate-300 text-sm font-bold">
                                                {new Date(booking.rentalStart).toLocaleDateString()} — {new Date(booking.rentalEnd).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Montant</span>
                                            <p className="text-teal-500 font-black text-lg font-mono italic">{booking.rentalPrice} €</p>
                                        </div>
                                    </div>

                                    {/* Crew Badges */}
                                    {booking.requestedRoles?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {booking.requestedRoles.map((role, idx) => {
                                                const isFilled = booking.crewMembers?.some(m => m.roleLabel === role);
                                                return (
                                                    <span key={idx} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all ${isFilled ? 'bg-teal-500/10 text-teal-400 border-teal-500/30' : 'bg-slate-800/30 text-slate-600 border-white/5'}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${isFilled ? 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]' : 'bg-slate-700'}`}></div>
                                                        {role.replace('ROLE_', '')}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex-shrink-0 flex items-center lg:flex-col lg:justify-center gap-4">
                                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                        <button 
                                            onClick={() => onCancel && onCancel(booking.id)}
                                            className="px-8 py-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/10 transition-all text-xs font-black uppercase tracking-widest shadow-lg active:scale-95"
                                        >
                                            Annuler
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