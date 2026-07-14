import React from 'react';
import { X } from 'lucide-react';

const CrewDetailsForm = ({ formData, onChange, roleData, onClose }) => {
    const color = roleData?.color || 'teal';

    return (
        <div className={`relative bg-slate-900/40 border border-${color}-500/20 p-10 rounded-[3rem] backdrop-blur-xl animate-fade-in max-w-2xl mx-auto shadow-2xl shadow-${color}-500/5`}>
            <button 
                onClick={onClose}
                className="absolute top-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-slate-950 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all z-10 hover:scale-110"
            >
                <X size={18} />
            </button>

            <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-950 border border-${color}-500/30 text-${color}-400`}>
                    {roleData?.icon}
                </div>
                <div>
                    <h3 className={`text-2xl font-black text-${color}-400 italic`}>Dossier {roleData?.label}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Informations de contact</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Téléphone professionnel</label>
                    <input 
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={onChange}
                        placeholder="+33 6 00 00 00 00"
                        className={`w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-${color}-500 transition-all`}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Titre professionnel / Position</label>
                    <input 
                        type="text"
                        name="position"
                        value={formData.position || ''}
                        onChange={onChange}
                        placeholder="Ex: Skipper expérimenté Méditerranée"
                        className={`w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-${color}-500 transition-all`}
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Numéro</label>
                    <input 
                        type="text"
                        name="houseNumber"
                        value={formData.houseNumber || ''}
                        onChange={onChange}
                        placeholder="12 bis"
                        className={`w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-${color}-500 transition-all`}
                    />
                </div>

                <div className="md:col-span-1">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Code Postal</label>
                    <input 
                        type="text"
                        name="postcode"
                        value={formData.postcode || ''}
                        onChange={onChange}
                        placeholder="83000"
                        className={`w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-${color}-500 transition-all`}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Rue</label>
                    <input 
                        type="text"
                        name="streetName"
                        value={formData.streetName || ''}
                        onChange={onChange}
                        placeholder="Quai de l'Épi"
                        className={`w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-${color}-500 transition-all`}
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Ville</label>
                    <input 
                        type="text"
                        name="city"
                        value={formData.city || ''}
                        onChange={onChange}
                        placeholder="Saint-Tropez"
                        className={`w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-${color}-500 transition-all`}
                    />
                </div>
            </div>
        </div>
    );
};

export default CrewDetailsForm;
