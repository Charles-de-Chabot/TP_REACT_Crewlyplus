import React from 'react';
import GlassCard from '../ui/GlassCard';
import { ShieldCheck, Download } from 'lucide-react';

const RegistrationBox = ({ onRegister }) => {
    return (
        <GlassCard className="p-8 border-cyan-500/30">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="text-cyan-400" />
                Inscription Premium
            </h3>
            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-white/60">
                    <span>Frais de dossier</span>
                    <span className="text-white">Inclus</span>
                </div>
                <div className="flex justify-between text-white/60">
                    <span>Support technique</span>
                    <span className="text-white">24/7</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between font-bold">
                    <span className="text-white">Total Premium</span>
                    <span className="text-cyan-400">OFFERT</span>
                </div>
            </div>
            <button 
                onClick={onRegister}
                className="w-full py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all flex items-center justify-center gap-2 group"
            >
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                Inscription One-Click
            </button>
            <p className="text-[10px] text-white/40 mt-4 text-center">
                Vos documents (Licence, CNI) seront automatiquement joints au dossier.
            </p>
        </GlassCard>
    );
};

export default RegistrationBox;
