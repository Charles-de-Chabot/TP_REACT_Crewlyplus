import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuthContext } from '../../contexts/authContext';
import IconRenderer from '../UI/IconRenderer';

const ProfileEditModal = ({ isOpen, onClose, userData, onUpdate }) => {
    const { refreshProfile } = useAuthContext();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phoneNumber: '',
        position: '',
        address: {
            id: null,
            houseNumber: '',
            streetName: '',
            postcode: '',
            city: ''
        }
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userData && isOpen) {
            setFormData({
                firstname: userData.firstname || '',
                lastname: userData.lastname || '',
                phoneNumber: userData.phoneNumber || userData.phone_number || '',
                position: userData.position || '',
                address: {
                    id: userData.address?.id || null,
                    houseNumber: userData.address?.houseNumber || '',
                    streetName: userData.address?.streetName || '',
                    postcode: userData.address?.postcode || '',
                    city: userData.address?.city || ''
                }
            });
        }
    }, [userData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const patchData = {
                firstname: formData.firstname,
                lastname: formData.lastname,
                phoneNumber: formData.phoneNumber,
            };

            if (formData.address.city) {
                patchData.address = {
                    houseNumber: formData.address.houseNumber,
                    streetName: formData.address.streetName,
                    postcode: formData.address.postcode,
                    city: formData.address.city
                };
                if (formData.address.id) {
                    patchData.address.id = formData.address.id;
                }
            }

            // 1. Mise à jour du profil utilisateur
            await api.patch(`/api/users/${userData.id}`, patchData, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });

            // Note: La synchronisation avec TeamMembership est désormais gérée 
            // automatiquement par le backend via un Doctrine Subscriber.
            
            if (onUpdate) onUpdate();
            await refreshProfile();
            onClose();
        } catch (error) {
            console.error("Error updating profile:", error);
            if (error.response?.data?.violations) {
                const messages = error.response.data.violations.map(v => `${v.propertyPath}: ${v.message}`).join('\n');
                alert("Erreur de validation :\n" + messages);
            } else {
                alert("Une erreur est survenue lors de la mise à jour.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
            
            <div className="relative bg-slate-900 border border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl animate-slideup">
                <div className="p-8 border-b border-white/5 flex justify-between items-center text-white">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">Modifier mon profil</h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <IconRenderer icon="❌" size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Prénom</label>
                            <input 
                                type="text"
                                value={formData.firstname}
                                onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nom</label>
                            <input 
                                type="text"
                                value={formData.lastname}
                                onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Numéro de téléphone</label>
                            <input 
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-role outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <h3 className="text-sm font-black text-white mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                            <IconRenderer icon="🗺️" size={14} className="text-teal-500" />
                            Adresse de facturation
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-4 gap-4">
                                <div className="col-span-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">N°</label>
                                    <input 
                                        type="text"
                                        value={formData.address.houseNumber}
                                        onChange={(e) => setFormData({...formData, address: {...formData.address, houseNumber: e.target.value}})}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="col-span-3 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Rue</label>
                                    <input 
                                        type="text"
                                        value={formData.address.streetName}
                                        onChange={(e) => setFormData({...formData, address: {...formData.address, streetName: e.target.value}})}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">CP</label>
                                    <input 
                                        type="text"
                                        value={formData.address.postcode}
                                        onChange={(e) => setFormData({...formData, address: {...formData.address, postcode: e.target.value}})}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ville</label>
                                    <input 
                                        type="text"
                                        value={formData.address.city}
                                        onChange={(e) => setFormData({...formData, address: {...formData.address, city: e.target.value}})}
                                        className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-white focus:border-teal-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-teal-500 text-slate-950 font-black rounded-2xl hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                        >
                            {loading ? <IconRenderer icon="⌛" size={16} animate /> : <IconRenderer icon="✅" size={16} />}
                            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
