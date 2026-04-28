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
                <div className="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
                    {registrations.map((reg) => (
                        <button
                            key={reg.id}
                            onClick={() => { setSelectedReg(reg); setViewStat(null); }}
                            className={`flex-shrink-0 px-6 py-3 rounded-2xl border transition-all text-left min-w-[200px] ${
                                selectedReg.id === reg.id 
                                ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                            }`}
                        >
                            <p className={`text-[9px] font-black uppercase tracking-widest ${selectedReg.id === reg.id ? 'text-black/60' : 'text-white/40'}`}>
                                {reg.regatta?.location || 'Régate'}
                            </p>
                            <p className="text-sm font-bold truncate">{reg.regatta?.name}</p>
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
                            className="w-full py-5 bg-cyan-500/10 border border-cyan-500/30 border-dashed rounded-2xl text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 font-black uppercase tracking-widest text-[10px]"
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
                        <GlassCard className="p-8 border-cyan-500/30 animate-in slide-in-from-right-4 duration-300 relative bg-cyan-950/20">
                            <button onClick={() => setViewStat(null)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                            
                            <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6">
                                <div className="w-16 h-16 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                    <span className="text-2xl font-black text-black">J{viewStat.dayNumber}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">Débriefing Tactique</h3>
                                    <p className="text-xs text-white/40 uppercase font-black tracking-widest">{selectedReg.regatta?.name}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] text-cyan-400 uppercase font-black flex items-center gap-2">
                                        <Wind size={14} /> Météo & Mer
                                    </p>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-sm text-white/80 italic">
                                        {viewStat.windConditions || 'Non renseigné'}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-900 rounded-2xl text-center border border-white/5">
                                        <p className="text-[9px] text-white/30 uppercase font-black mb-1">Classement</p>
                                        <p className="text-2xl font-black text-white">{viewStat.ranking}</p>
                                    </div>
                                    <div className="p-4 bg-slate-900 rounded-2xl text-center border border-white/5">
                                        <p className="text-[9px] text-white/30 uppercase font-black mb-1">Vitesse Max</p>
                                        <p className="text-2xl font-black text-amber-400">{viewStat.maxSpeed}<span className="text-xs ml-1">kts</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[10px] text-cyan-400 uppercase font-black flex items-center gap-2">
                                    <BarChart3 size={14} /> Observations Skipper
                                </p>
                                <div className="p-6 bg-slate-900/50 rounded-2xl border border-white/5 text-sm text-white/90 leading-relaxed min-h-[150px]">
                                    {viewStat.notes || "Aucune note n'a été saisie pour ce débriefing."}
                                </div>
                            </div>
                        </GlassCard>
                    ) : (
                        <PerformanceCharts stats={stats} onShare={sendMessage} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamPerformance;
