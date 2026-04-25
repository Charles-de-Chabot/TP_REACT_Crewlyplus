import React from 'react';

const CrewDetailsForm = ({ formData, onChange }) => {
    return (
        <div className="bg-slate-900/40 border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl animate-fade-in max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-white mb-8 italic">Informations de contact</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-2">Téléphone professionnel</label>
                    <input 
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber || ''}
                        onChange={onChange}
                        placeholder="+33 6 00 00 00 00"
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-teal-500 transition-all"
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
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-teal-500 transition-all"
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
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-teal-500 transition-all"
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
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-teal-500 transition-all"
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
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-teal-500 transition-all"
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
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:outline-none focus:border-teal-500 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

export default CrewDetailsForm;
