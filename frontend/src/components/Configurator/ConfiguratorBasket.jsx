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
import IconRenderer from '../UI/IconRenderer';

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
        <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-8 sticky top-32 max-h-[calc(100vh-160px)] flex flex-col shadow-2xl shadow-black/50">
            <h2 className="text-xl font-black text-white mb-8 shrink-0 italic uppercase tracking-tighter">Votre Panier</h2>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6 space-y-6">
                {/* Boat Item */}
                <div className="flex justify-between items-start group">
                    <div>
                        <p className="text-white font-bold text-sm uppercase tracking-tight">{boat.name}</p>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mt-1">
                            {dates.nbDays >= 7 
                                ? `Forfait Semaine` 
                                : `${dates.nbDays} jours x ${boat.dayPrice} €`
                            }
                        </p>
                    </div>
                    <p className="text-white font-mono text-sm font-black tracking-tighter">
                        {dates.nbDays >= 7 ? boat.weekPrice : boat.dayPrice * dates.nbDays} €
                    </p>
                </div>

                {/* Formula Item */}
                {selectedFormula && (
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white font-bold text-sm uppercase tracking-tight">{selectedFormula.title}</p>
                            <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mt-1">Option Formule</p>
                        </div>
                        <p className="text-white font-mono text-sm font-black tracking-tighter">{selectedFormula.formulaPrice} €</p>
                    </div>
                )}

                {/* Fittings Items */}
                {selectedFittings.map(f => (
                    <div key={f.id} className="flex justify-between items-start">
                        <div>
                            <p className="text-white font-bold text-sm uppercase tracking-tight">{f.label}</p>
                            <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mt-1">Équipement</p>
                        </div>
                        <p className="text-white font-mono text-sm font-black tracking-tighter">{f.fittingPrice} €</p>
                    </div>
                ))}

                {/* Crew Items */}
                {selectedCrew.map(role => {
                    const roleInfo = CREW_ROLES.find(r => r.role === role);
                    return (
                        <div key={role} className="flex justify-between items-start">
                            <div>
                                <p className="text-white font-bold text-sm uppercase tracking-tight">{roleInfo?.label}</p>
                                <p className="text-slate-500 text-[9px] uppercase font-black tracking-widest mt-1 italic">
                                    Crew • {dates.nbDays}j x {roleInfo?.price} €
                                </p>
                            </div>
                            <p className="text-white font-mono text-sm font-black tracking-tighter">{roleInfo ? roleInfo.price * dates.nbDays : 0} €</p>
                        </div>
                    );
                })}
            </div>

            <div className="shrink-0 pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center text-[10px]">
                    <p className="text-slate-500 font-black uppercase tracking-widest">Sous-total</p>
                    <p className="text-white font-mono font-black">{subTotalPrice} €</p>
                </div>
                
                {isPremiumDiscount && (
                    <div className="flex justify-between items-center text-[10px] text-amber-400">
                        <p className="font-black uppercase tracking-widest">Remise Élite (-15%)</p>
                        <p className="font-mono font-black">-{discountPrice} €</p>
                    </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-white/5 mb-6">
                    <p className="text-white font-black text-xl uppercase italic tracking-tighter">Total TTC</p>
                    <p className="text-3xl font-black text-teal-400 font-mono tracking-tighter italic">{totalPrice} <span className="text-lg not-italic">€</span></p>
                </div>

                <button 
                    onClick={onPayment}
                    disabled={bookingStatus === 'submitting'}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-black py-4 rounded-xl transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
                >
                    {bookingStatus === 'submitting' ? (
                        <IconRenderer icon="⌛" size={16} animate />
                    ) : (
                        <>
                            <IconRenderer icon="💳" size={16} />
                            Confirmer
                        </>
                    )}
                </button>

                {bookingError && (
                    <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] text-center font-black uppercase tracking-widest animate-shake">
                        {bookingError}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConfiguratorBasket;
