import React, { useState, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';
import { Plus, X, BarChart3, Wind } from 'lucide-react';
import DailyStatForm from './DailyStatForm';
import { PerformanceStats, PerformanceCharts, PerformanceJournal } from './PerformanceComponents';
import { useChat } from '../../contexts/ChatContext';

const TeamPerformance = ({ registrations, isLeader, onRefresh }) => {
    const { sendMessage } = useChat();
    const [selectedReg, setSelectedReg] = useState(registrations[0] || null);
    const [showForm, setShowForm] = useState(false);
    const [viewStat, setViewStat] = useState(null);

    // CRUCIAL: Synchroniser avec les nouvelles données reçues du parent
    useEffect(() => {
        if (registrations.length > 0) {
            // Trouver la version à jour de la régate sélectionnée
            const updated = registrations.find(r => r.id === selectedReg?.id) || registrations[0];
            setSelectedReg(updated);
        }
    }, [registrations, selectedReg?.id]);

    if (!selectedReg) return null;

    const stats = [...(selectedReg.dailyStats || [])].sort((a, b) => a.dayNumber - b.dayNumber);

    return (
        <div className="space-y-8 pb-20">
            {/* Modal pour le formulaire de saisie */}
            {showForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowForm(false)}></div>
                    <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-200">
                        <DailyStatForm 
                            registration={selectedReg} 
                            onStatAdded={() => { setShowForm(false); onRefresh(); }} 
                            onCancel={() => setShowForm(false)} 
                        />
                    </div>
                </div>
            )}

            {/* Sélecteur de régate (si plusieurs) */}
            {registrations.length > 1 && (
                <div className="flex items-center gap-6 overflow-x-auto pb-4 hide-scrollbar px-2">
                    {registrations.map((reg) => (
                        <button
                            key={reg.id}
                            onClick={() => { setSelectedReg(reg); setViewStat(null); }}
                            className={`flex-shrink-0 transition-all duration-300 text-left group ${
                                selectedReg.id === reg.id ? 'scale-105' : 'opacity-40 hover:opacity-100'
                            }`}
                        >
                            <p className={`text-[9px] font-black uppercase tracking-[0.3em] mb-1 transition-colors ${
                                selectedReg.id === reg.id ? 'text-gold-sanded' : 'text-white/20'
                            }`}>
                                {reg.regatta?.location || 'Régate'}
                            </p>
                            <p className={`text-sm font-bold border-b-2 pb-1 transition-all ${
                                selectedReg.id === reg.id ? 'border-gold-sanded text-white' : 'border-transparent text-white/60'
                            }`}>
                                {reg.regatta?.name}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {/* Statistiques Globales */}
            <PerformanceStats stats={stats} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Journal de Bord (Sidebar) */}
                <div className="lg:col-span-4 space-y-6">
                    {isLeader && (
                        <button 
                            onClick={() => setShowForm(true)}
                            className="w-full py-5 bg-gold-sanded/5 border border-gold-sanded/20 border-dashed rounded-2xl text-gold-sanded/80 hover:bg-gold-sanded/10 hover:border-gold-sanded/40 transition-all flex items-center justify-center gap-2 font-black uppercase tracking-[0.2em] text-[10px]"
                        >
                            <Plus size={18} /> Saisir les résultats du jour
                        </button>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2 pl-2">
                            <BarChart3 size={12} /> Journal Tactique
                        </h3>
                        
                        {stats.length === 0 ? (
                            <div className="p-10 text-center border border-dashed border-white/5 rounded-2xl">
                                <p className="text-[9px] text-white/20 uppercase font-black">Aucune journée enregistrée</p>
                            </div>
                        ) : (
                            <PerformanceJournal stats={stats} onViewStat={setViewStat} />
                        )}
                    </div>
                </div>

                {/* Graphiques & Détails (Main View) */}
                <div className="lg:col-span-8 space-y-8">
                    {viewStat ? (
                        <div className="p-8 rounded-3xl animate-in slide-in-from-right-4 duration-500 relative bg-white/[0.02] border border-white/5">
                            <button onClick={() => setViewStat(null)} className="absolute top-6 right-6 text-white/10 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                            
                            <div className="flex items-center gap-8 mb-10 border-b border-white/5 pb-8">
                                <div className="w-16 h-16 rounded-2xl bg-gold-sanded/10 border border-gold-sanded/30 flex items-center justify-center shadow-lg">
                                    <span className="text-3xl font-black text-gold-sanded">J{viewStat.dayNumber}</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Débriefing Tactique</h3>
                                    <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">{selectedReg.regatta?.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                                <div className="space-y-3">
                                    <p className="text-[10px] text-gold-sanded/60 uppercase font-black tracking-[0.2em] flex items-center gap-2">
                                        <Wind size={14} /> Météo & Mer
                                    </p>
                                    <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 text-sm text-white/60 leading-relaxed italic">
                                        {viewStat.windConditions || 'Non renseigné'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="p-5 bg-white/[0.01] rounded-2xl text-center border border-white/5">
                                        <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">Classement</p>
                                        <p className="text-3xl font-black text-white">{viewStat.ranking}{viewStat.ranking === 1 ? 'er' : 'ème'}</p>
                                    </div>
                                    <div className="p-5 bg-white/[0.01] rounded-2xl text-center border border-white/5">
                                        <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">Vitesse Max</p>
                                        <p className="text-3xl font-black text-amber-400">{viewStat.maxSpeed}<span className="text-xs ml-1 font-black opacity-20">KTS</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] text-gold-sanded/60 uppercase font-black tracking-[0.2em] flex items-center gap-2">
                                    <BarChart3 size={14} /> Observations Skipper
                                </p>
                                <div className="p-8 bg-white/[0.01] rounded-3xl border border-white/5 text-base text-white/70 leading-relaxed min-h-[180px] italic">
                                    "{viewStat.notes || "Aucune note n'a été saisie pour ce débriefing."}"
                                </div>
                            </div>
                        </div>
                    ) : (
                        <PerformanceCharts stats={stats} onShare={sendMessage} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamPerformance;
