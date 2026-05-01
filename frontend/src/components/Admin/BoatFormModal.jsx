import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import IconRenderer from '../../components/UI/IconRenderer';
import { toast } from 'sonner';

const BoatFormModal = ({ boat, isOpen, onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [models, setModels] = useState([]);
    const [types, setTypes] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        used: false,
        dayPrice: 0,
        weekPrice: 0,
        is_active: true,
        boatinfo: {
            maxUser: 6,
            length: 10,
            width: 3.5,
            draught: 1.8,
            cabineNumber: 2,
            bedsNumber: 4,
            fuel: 'Diesel',
            powerEngine: '30 HP',
            irc: 1.0
        },
        adress: {
            houseNumber: '',
            streetName: '',
            postcode: '',
            city: ''
        },
        model: '',
        type: ''
    });

    useEffect(() => {
        if (boat) {
            setFormData({
                ...boat,
                model: boat.model?.['@id'] || '',
                type: boat.type?.['@id'] || '',
                boatinfo: boat.boatinfo || formData.boatinfo,
                adress: boat.adress || formData.adress
            });
        } else {
            // Reset form for creation
        }
    }, [boat]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [modelsRes, typesRes] = await Promise.all([
                    api.get('/api/models'),
                    api.get('/api/types')
                ]);
                setModels(modelsRes.data['member'] || modelsRes.data['hydra:member'] || []);
                setTypes(typesRes.data['member'] || typesRes.data['hydra:member'] || []);
            } catch (error) {
                console.error("Error fetching dependencies:", error);
            }
        };
        if (isOpen) fetchData();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (boat) {
                await api.patch(`/api/boats/${boat.id}`, formData, {
                    headers: { 'Content-Type': 'application/merge-patch+json' }
                });
                toast.success("Bateau mis à jour avec succès");
            } else {
                await api.post('/api/boats', formData);
                toast.success("Nouveau bateau ajouté à la flotte");
            }
            onSave();
            onClose();
        } catch (error) {
            console.error("Error saving boat:", error);
            toast.error("Erreur lors de l'enregistrement du bateau");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative bg-slate-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                            {boat ? 'Modifier le' : 'Ajouter un'} <span className="text-purple-400">Bateau</span>
                        </h3>
                        <div className="flex gap-1 mt-1">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-6 bg-purple-500' : 'w-2 bg-white/10'}`} />
                            ))}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-slate-500">
                        <IconRenderer icon="✕" size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                    {/* Step 1: Informations Générales */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nom du Navire</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Prix / Jour (€)</label>
                                    <input 
                                        type="number" required
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.dayPrice}
                                        onChange={(e) => setFormData({...formData, dayPrice: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Prix / Semaine (€)</label>
                                    <input 
                                        type="number" required
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.weekPrice}
                                        onChange={(e) => setFormData({...formData, weekPrice: parseFloat(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Modèle</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold appearance-none"
                                        value={formData.model}
                                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {models.map(m => <option key={m.id} value={m['@id']}>{m.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Type</label>
                                    <select 
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold appearance-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                    >
                                        <option value="">Sélectionner...</option>
                                        {types.map(t => <option key={t.id} value={t['@id']}>{t.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Spécifications Techniques */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Max Passagers</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.boatinfo.maxUser}
                                        onChange={(e) => setFormData({...formData, boatinfo: {...formData.boatinfo, maxUser: parseInt(e.target.value)}})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Longueur (m)</label>
                                    <input 
                                        type="number" step="0.1"
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.boatinfo.length}
                                        onChange={(e) => setFormData({...formData, boatinfo: {...formData.boatinfo, length: parseFloat(e.target.value)}})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Cabines</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.boatinfo.cabineNumber}
                                        onChange={(e) => setFormData({...formData, boatinfo: {...formData.boatinfo, cabineNumber: parseInt(e.target.value)}})}
                                    />
                                </div>
                                <div className="col-span-3 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Moteur & Puissance</label>
                                    <input 
                                        type="text"
                                        placeholder="ex: 2x Volvo Penta 300HP"
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.boatinfo.powerEngine}
                                        onChange={(e) => setFormData({...formData, boatinfo: {...formData.boatinfo, powerEngine: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Localisation & Validation */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ville Portuaire</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.adress.city}
                                        onChange={(e) => setFormData({...formData, adress: {...formData.adress, city: e.target.value}})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Code Postal</label>
                                    <input 
                                        type="text" required
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.adress.postcode}
                                        onChange={(e) => setFormData({...formData, adress: {...formData.adress, postcode: e.target.value}})}
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Rue / Port</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-slate-950 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-purple-500/50 outline-none transition-all font-bold"
                                        value={formData.adress.streetName}
                                        onChange={(e) => setFormData({...formData, adress: {...formData.adress, streetName: e.target.value}})}
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox"
                                        id="isActive"
                                        className="w-5 h-5 rounded-lg accent-purple-500"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                                    />
                                    <label htmlFor="isActive" className="text-xs font-bold text-slate-300">Rendre le bateau visible immédiatement dans le catalogue</label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="mt-12 flex gap-3">
                        {step > 1 && (
                            <button 
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 transition-all"
                            >
                                Retour
                            </button>
                        )}
                        
                        {step < 3 ? (
                            <button 
                                type="button"
                                onClick={() => setStep(step + 1)}
                                className="flex-[2] py-4 bg-purple-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-400 transition-all shadow-lg shadow-purple-500/20"
                            >
                                Suivant
                            </button>
                        ) : (
                            <button 
                                type="submit"
                                disabled={loading}
                                className="flex-[2] py-4 bg-emerald-500 text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                {loading && <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />}
                                {boat ? 'Enregistrer les modifications' : 'Créer le Bateau'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BoatFormModal;
