import React, { useState } from 'react';
import api from '../../api/axios';
import IconRenderer from '../UI/IconRenderer';

const EditProfileModal = ({ isOpen, onClose, user, onUpdate }) => {
    const [formData, setFormData] = useState({
        phoneNumber: user?.phoneNumber || '',
        position: user?.position || '',
        houseNumber: user?.address?.houseNumber || '',
        streetName: user?.address?.streetName || '',
        postcode: user?.address?.postcode || '',
        city: user?.address?.city || ''
    });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (user?.address?.id) {
                await api.patch(`/api/addresses/${user.address.id}`, {
                    houseNumber: formData.houseNumber,
                    streetName: formData.streetName,
                    postcode: formData.postcode,
                    city: formData.city
                }, {
                    headers: { 'Content-Type': 'application/merge-patch+json' }
                });
            }

            await api.patch(`/api/users/${user.id}`, {
                phoneNumber: formData.phoneNumber,
                position: formData.position
            }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });

            onUpdate();
            onClose();
        } catch (err) {
            console.error("Error updating profile", err);
            alert("Erreur lors de la mise à jour.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
            
            <div className="bg-slate-900 border border-white/10 w-full max-w-xl rounded-2xl p-10 relative z-10 shadow-2xl animate-scale-in">
                <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-all p-2 hover:bg-white/5 rounded-xl">
                    <IconRenderer icon="❌" size={24} />
                </button>

                <h3 className="text-2xl font-black text-white mb-8 italic uppercase tracking-tighter">Modifier mon profil Pro</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Téléphone</label>
                            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-white focus:border-teal-500 outline-none transition-all" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Poste / Titre</label>
                            <input type="text" name="position" value={formData.position} onChange={handleChange} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-white focus:border-teal-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">N°</label>
                            <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleChange} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-white focus:border-teal-500 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Code Postal</label>
                            <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-white focus:border-teal-500 outline-none transition-all" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Rue</label>
                            <input type="text" name="streetName" value={formData.streetName} onChange={handleChange} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-white focus:border-teal-500 outline-none transition-all" />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Ville</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-3 text-white focus:border-teal-500 outline-none transition-all" />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-teal-500/20 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                    >
                        {loading ? <IconRenderer icon="⌛" size={16} animate /> : <IconRenderer icon="✅" size={16} />}
                        {loading ? 'Enregistrement...' : 'Sauvegarder les modifications'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
