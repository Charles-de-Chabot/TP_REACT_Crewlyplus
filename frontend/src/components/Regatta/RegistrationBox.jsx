import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import { ShieldCheck, Download, CheckCircle, ArrowRight } from 'lucide-react';
 
const RegistrationBox = ({ onRegister, isRegistered }) => {
    return (
        <GlassCard className={`p-8 transition-all duration-500 border-t-2 ${isRegistered ? 'border-green-500/50 bg-green-500/5' : 'border-gold-sanded/50 bg-slate-900/40'}`}>
            <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3 italic uppercase tracking-tighter">
                <ShieldCheck className={isRegistered ? 'text-green-400' : 'text-gold-sanded'} size={24} />
                Inscription
            </h3>

            {isRegistered ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-700">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="text-green-400" size={18} />
                            <p className="text-sm font-black text-white uppercase tracking-tight">Équipe Inscrite</p>
                        </div>
                        <p className="text-[11px] text-white/60 leading-relaxed">
                            Félicitations ! Votre écurie est officiellement enregistrée pour cette régate. Vous pouvez maintenant accéder à votre espace tactique.
                        </p>
                    </div>

                    <Link 
                        to="/my-team"
                        className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-green-500/30 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all group"
                    >
                        <span>Espace Équipe</span>
                        <ArrowRight size={16} className="text-green-400 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            ) : (
                <>
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                            <span>Frais de dossier</span>
                            <span className="text-white">Inclus</span>
                        </div>
                        <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-widest">
                            <span>Support technique</span>
                            <span className="text-white">Elite 24/7</span>
                        </div>
                        <div className="border-t border-white/5 pt-4 flex justify-between">
                            <span className="text-white font-black text-xs uppercase tracking-widest">Total Premium</span>
                            <span className="text-gold-sanded font-black text-sm">OFFERT</span>
                        </div>
                    </div>

                    <button 
                        onClick={onRegister}
                        className="w-full py-4 bg-gold-sanded hover:bg-amber-400 text-slate-950 rounded-2xl transition-all flex items-center justify-center gap-3 group font-black text-xs uppercase tracking-widest shadow-xl shadow-gold-sanded/10 hover:scale-[1.02] active:scale-95"
                    >
                        <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                        Inscription One-Click
                    </button>
                    
                    <p className="text-[9px] text-white/20 mt-6 text-center italic leading-relaxed">
                        En cliquant, vos documents (Licence FFV, CNI) <br /> 
                        seront automatiquement transmis à l'organisation.
                    </p>
                </>
            )}
        </GlassCard>
    );
};

export default RegistrationBox;
