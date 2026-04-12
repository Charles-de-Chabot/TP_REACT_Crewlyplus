// src/components/Form/ContactFields.jsx
import React from 'react';

const ContactFields = ({ formData, handleChange, showNickname = true }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showNickname && (
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Nom de Skipper (Nickname)</label>
                    <input 
                        required 
                        name="nickname" 
                        value={formData.nickname || ''} 
                        onChange={handleChange} 
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-amber-500 outline-none transition-all text-white" 
                        placeholder="Ex: L'Amiral_83" 
                    />
                </div>
            )}
            <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Numéro de Téléphone</label>
                <input 
                    required 
                    name="phoneNumber" 
                    value={formData.phoneNumber || ''} 
                    onChange={handleChange} 
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 outline-none transition-all text-white" 
                    placeholder="06 00 00 00 00" 
                />
            </div>
        </div>
    );
};

export default ContactFields;