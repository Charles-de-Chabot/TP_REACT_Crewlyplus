// src/components/Form/AddressFields.jsx
import React from 'react';

const AddressFields = ({ formData, handleChange }) => {
    return (
        <div className="space-y-4">
            <label className="text-xs font-bold uppercase text-slate-500 tracking-widest">Adresse de facturation / Résidence</label>
            <div className="grid grid-cols-4 gap-4">
                <input 
                    name="houseNumber" 
                    value={formData.houseNumber || ''} 
                    onChange={handleChange} 
                    className="col-span-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 outline-none transition-all text-white" 
                    placeholder="N°" 
                />
                <input 
                    required 
                    name="streetName" 
                    value={formData.streetName || ''} 
                    onChange={handleChange} 
                    className="col-span-3 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 outline-none transition-all text-white" 
                    placeholder="Nom de la rue" 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input 
                    required 
                    name="postcode" 
                    value={formData.postcode || ''} 
                    onChange={handleChange} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 outline-none transition-all text-white" 
                    placeholder="Code Postal" 
                />
                <input 
                    required 
                    name="city" 
                    value={formData.city || ''} 
                    onChange={handleChange} 
                    className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 outline-none transition-all text-white" 
                    placeholder="Ville" 
                />
            </div>
        </div>
    );
};

export default AddressFields;