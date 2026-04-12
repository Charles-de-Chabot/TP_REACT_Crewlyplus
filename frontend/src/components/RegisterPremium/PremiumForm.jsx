// src/components/RegisterPremium/PremiumForm.jsx
import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/authContext';
import api from '../../api/axios';
import AddressFields from '../Form/AddressFields';
import ContactFields from '../Form/ContactFields';
import { CONFIG_JSON_LD } from '../../constants/apiConstant'; // Import de ta constante

const PremiumForm = ({ onComplete }) => {
    const { userId } = useAuthContext();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        nickname: '',
        phoneNumber: '',
        houseNumber: '',
        streetName: '',
        postcode: '',
        city: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Création de l'entité Adresse avec ta constante CONFIG_JSON_LD
            const addressResponse = await api.post('/api/addresses', {
                houseNumber: formData.houseNumber,
                streetName: formData.streetName,
                postcode: formData.postcode,
                city: formData.city
            }, CONFIG_JSON_LD);

            const addressIri = addressResponse.data['@id'];

            // 2. Liaison avec l'User via PATCH (Format merge-patch+json obligatoire)
            await api.patch(`/api/users/${userId}`, {
                nickname: formData.nickname,
                phoneNumber: formData.phoneNumber,
                address: addressIri
            }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });

            // 3. Succès -> On passe à l'étape 3 (Stripe)
            onComplete();
        } catch (error) {
            console.error("Erreur de finalisation :", error);
            alert("Erreur lors de l'enregistrement. Vérifiez vos informations.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            {/* Glow décoratif */}
            <div className="absolute inset-0 bg-teal-500/5 blur-[100px] rounded-full -z-10"></div>
            
            <form 
                onSubmit={handleSubmit} 
                className="bg-slate-900/40 border border-white/10 backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] shadow-2xl space-y-8 text-left"
            >
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
                        Dernière étape <span className="text-amber-500">avant l'embarquement</span>
                    </h2>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-widest">Complétez vos informations de membre</p>
                </div>

                <ContactFields formData={formData} handleChange={handleChange} />
                
                <hr className="border-white/5" />
                
                <AddressFields formData={formData} handleChange={handleChange} />

                <div className="pt-6">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-6 font-black rounded-3xl transition-all shadow-2xl uppercase tracking-tighter text-xl ${
                            loading 
                            ? 'bg-slate-800 text-slate-500 cursor-wait' 
                            : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/30 active:scale-95'
                        }`}
                    >
                        {loading ? 'Traitement en cours...' : 'Payer mon accès Élite'}
                    </button>
                    
                    <div className="flex flex-col items-center mt-6 gap-2">
                         <p className="text-[10px] text-center text-slate-500 uppercase tracking-[0.2em] font-bold">
                            Paiement 100% sécurisé via Stripe
                        </p>
                        {/* Optionnel : tu pourrais ajouter des petites icônes de cartes ici plus tard */}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PremiumForm;