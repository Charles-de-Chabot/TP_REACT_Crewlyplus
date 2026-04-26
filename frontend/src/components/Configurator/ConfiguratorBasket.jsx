import React from 'react';
import { useSelector } from 'react-redux';
import { 
    selectSelectedBoat, 
    selectBookingDates, 
    selectSelectedFormula, 
    selectSelectedFittings, 
    selectSelectedCrew, 
    selectSubTotalPrice, 
    selectDiscountPrice, 
    selectTotalPrice, 
    selectIsPremiumDiscount, 
    selectBookingStatus 
} from '../../store/booking/bookingSelectors';

const CREW_ROLES = [
    { role: 'ROLE_CAPITAINE', label: 'Capitaine', price: 250 },
    { role: 'ROLE_CHEF', label: 'Chef', price: 200 },
    { role: 'ROLE_HOTESSE', label: 'Hôtesse', price: 150 },
];

const ConfiguratorBasket = ({ onPayment, bookingError }) => {
    const boat = useSelector(selectSelectedBoat);
    const dates = useSelector(selectBookingDates);
    const selectedFormula = useSelector(selectSelectedFormula);
    const selectedFittings = useSelector(selectSelectedFittings);
    const selectedCrew = useSelector(selectSelectedCrew);
    const subTotalPrice = useSelector(selectSubTotalPrice);
    const discountPrice = useSelector(selectDiscountPrice);
    const totalPrice = useSelector(selectTotalPrice);
    const isPremiumDiscount = useSelector(selectIsPremiumDiscount);
    const bookingStatus = useSelector(selectBookingStatus);

    if (!boat) return null;

    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 sticky top-32 max-h-[calc(100vh-160px)] flex flex-col">
            <h2 className="text-xl font-black text-white mb-6 shrink-0">Votre Panier</h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4 space-y-4">
                {/* Boat Item */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-white font-bold text-sm">{boat.name}</p>
                        <p className="text-teal-500/60 text-[9px] font-black uppercase tracking-widest mt-1">
                            {dates.nbDays >= 7 
                                ? `Forfait Semaine : ${boat.weekPrice} €` 
                                : `${dates.nbDays} jours x ${boat.dayPrice} €`
                            }
                        </p>
                    </div>
                    <p className="text-white font-bold text-sm">
                        {dates.nbDays >= 7 ? boat.weekPrice : boat.dayPrice * dates.nbDays} €
                    </p>
                </div>

                {/* Formula Item */}
                {selectedFormula && (
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white font-bold text-sm">{selectedFormula.title}</p>
                            <p className="text-white/40 text-[10px] uppercase font-bold tracking-tighter">Formule</p>
                        </div>
                        <p className="text-white font-bold text-sm">{selectedFormula.formulaPrice} €</p>
                    </div>
                )}

                {/* Fittings Items */}
                {selectedFittings.map(f => (
                    <div key={f.id} className="flex justify-between items-start">
                        <div>
                            <p className="text-white font-bold text-sm">{f.label}</p>
                            <p className="text-white/40 text-[9px] uppercase font-bold tracking-tighter">Équipement</p>
                        </div>
                        <p className="text-white font-bold text-sm">{f.fittingPrice} €</p>
                    </div>
                ))}

                {/* Crew Items */}
                {selectedCrew.map(role => {
                    const roleInfo = CREW_ROLES.find(r => r.role === role);
                    return (
                        <div key={role} className="flex justify-between items-start">
                            <div>
                                <p className="text-white font-bold text-sm">{roleInfo?.label}</p>
                                <p className="text-white/40 text-[9px] italic">
                                    Équipage • {dates.nbDays} j x {roleInfo?.price} €/j
                                </p>
                            </div>
                            <p className="text-white font-bold text-sm">{roleInfo ? roleInfo.price * dates.nbDays : 0} €</p>
                        </div>
                    );
                })}
            </div>

            <div className="shrink-0 pt-4 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                    <p className="text-slate-400 font-bold">Sous-total</p>
                    <p className="text-white font-bold">{subTotalPrice} €</p>
                </div>
                
                {isPremiumDiscount && (
                    <div className="flex justify-between items-center text-xs text-amber-500">
                        <p className="font-bold">Remise Élite (-15%)</p>
                        <p className="font-black">-{discountPrice} €</p>
                    </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-white/5 mb-4">
                    <p className="text-white font-black text-lg uppercase italic">Total TTC</p>
                    <p className="text-2xl font-black text-teal-400">{totalPrice} €</p>
                </div>

                <button 
                    onClick={onPayment}
                    disabled={bookingStatus === 'submitting'}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-3 text-sm"
                >
                    {bookingStatus === 'submitting' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                            Validation...
                        </>
                    ) : (
                        <>Procéder au paiement 💳</>
                    )}
                </button>

                {bookingError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-[10px] text-center font-medium animate-shake">
                        ⚠️ {bookingError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfiguratorBasket;
