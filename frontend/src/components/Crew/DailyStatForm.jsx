import React, { useState, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';
import { Trophy, Wind, Gauge, Calendar, Save, X, Plus } from 'lucide-react';
import api from '../../api/axios';

const DailyStatForm = ({ registration, onStatAdded, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [existingId, setExistingId] = useState(null);
    const [formData, setFormData] = useState({
        dayNumber: registration.dailyStats?.length + 1 || 1,
        ranking: '',
        avgSpeed: '',
        maxSpeed: '',
        windConditions: '',
        notes: ''
    });

    // Détecter si le jour existe déjà
    useEffect(() => {
        const existing = registration.dailyStats?.find(s => parseInt(s.dayNumber) === parseInt(formData.dayNumber));
        if (existing) {
            setIsEditing(true);
            setExistingId(existing.id);
            setFormData({
                dayNumber: existing.dayNumber,
                ranking: existing.ranking || '',
                avgSpeed: existing.avgSpeed || '',
                maxSpeed: existing.maxSpeed || '',
                windConditions: existing.windConditions || '',
                notes: existing.notes || ''
            });
        } else {
            setIsEditing(false);
            setExistingId(null);
            // On ne reset pas tout pour permettre de naviguer entre les jours
        }
    }, [formData.dayNumber, registration.dailyStats]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                dayNumber: parseInt(formData.dayNumber),
                ranking: formData.ranking ? parseInt(formData.ranking) : null,
                avgSpeed: formData.avgSpeed ? parseFloat(formData.avgSpeed) : null,
                maxSpeed: formData.maxSpeed ? parseFloat(formData.maxSpeed) : null,
                windConditions: formData.windConditions,
                notes: formData.notes,
                registration: `/api/registrations/${registration.id}`
            };

            if (isEditing) {
                await api.patch(`/api/daily_stats/${existingId}`, payload, {
                    headers: { 'Content-Type': 'application/merge-patch+json' }
                });
            } else {
                await api.post('/api/daily_stats', payload, {
                    headers: { 'Content-Type': 'application/ld+json' }
                });
            }
            onStatAdded();
        } catch (err) {
            console.error("Error saving daily stat", err);
            alert("Erreur lors de l'enregistrement des statistiques.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className={`p-6 border-cyan-500/30 animate-fade-in transition-all ${isEditing ? 'ring-2 ring-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : ''}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-1">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                        <Plus size={16} className={isEditing ? 'text-amber-500' : 'text-cyan-400'} /> 
                        {isEditing ? 'Modification du Jour' : 'Saisie du Jour'}
                    </h3>
                    {isEditing && (
                        <span className="inline-block text-[8px] bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded border border-amber-500/30 font-black uppercase">
                            Données existantes chargées
                        </span>
                    )}
                </div>
                <button onClick={onCancel} className="text-white/20 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Jour n°</label>
                        <div className="relative">
                            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                            <input 
                                type="number" 
                                value={formData.dayNumber}
                                onChange={(e) => setFormData({...formData, dayNumber: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Classement</label>
                        <div className="relative">
                            <Trophy size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-sanded" />
                            <input 
                                type="number" 
                                value={formData.ranking}
                                onChange={(e) => setFormData({...formData, ranking: e.target.value})}
                                placeholder="Pos."
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Vitesse Moy. (kts)</label>
                        <div className="relative">
                            <Gauge size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                            <input 
                                type="number" 
                                step="0.1"
                                value={formData.avgSpeed}
                                onChange={(e) => setFormData({...formData, avgSpeed: e.target.value})}
                                placeholder="0.0"
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Vitesse Max. (kts)</label>
                        <div className="relative">
                            <Gauge size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" />
                            <input 
                                type="number" 
                                step="0.1"
                                value={formData.maxSpeed}
                                onChange={(e) => setFormData({...formData, maxSpeed: e.target.value})}
                                placeholder="0.0"
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Conditions Vent</label>
                        <div className="relative">
                            <Wind size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
                            <input 
                                type="text" 
                                value={formData.windConditions}
                                onChange={(e) => setFormData({...formData, windConditions: e.target.value})}
                                placeholder="ex: 15-20 kts NW, Mer hachée"
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:border-cyan-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="md:col-span-2 space-y-1">
                        <label className="text-[9px] font-black text-white/40 uppercase tracking-widest">Notes tactiques & Débriefing</label>
                        <textarea 
                            rows="4"
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                            placeholder="Détaillez ici les observations tactiques, les casses éventuelles ou les réglages à conserver..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-cyan-500 outline-none min-h-[100px] resize-none"
                        ></textarea>
                    </div>
                </div>

                <div className="pt-2">
                    <button 
                        disabled={loading}
                        className={`w-full py-3 ${isEditing ? 'bg-amber-500 hover:bg-amber-400' : 'bg-cyan-500 hover:bg-cyan-400'} text-black font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50`}
                    >
                        {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-black"></div> : <Save size={16} />}
                        {isEditing ? 'METTRE À JOUR LA JOURNÉE' : 'ENREGISTRER LA JOURNÉE'}
                    </button>
                </div>
            </form>
        </GlassCard>
    );
};

export default DailyStatForm;
