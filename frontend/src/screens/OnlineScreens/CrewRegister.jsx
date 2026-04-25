import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';
import api from '../../api/axios';
import Layout from '../../components/UI/Layout';
import { CONFIG_JSON_LD } from '../../constants/apiConstant';

// Sub-components
import RegisterHeader from '../../components/Crew/RegisterHeader';
import RoleCard from '../../components/Crew/RoleCard';
import RegisterActions from '../../components/Crew/RegisterActions';
import CrewDetailsForm from '../../components/Crew/CrewDetailsForm';

const CREW_OPTIONS = [
    {
        role: 'ROLE_CAPITAINE',
        label: 'Capitaine',
        icon: '👨‍✈️',
        description: 'Prenez le commandement et guidez nos clients vers des destinations d\'exception.',
        features: ['Navigation experte', 'Gestion d\'équipage', 'Sécurité à bord'],
        color: 'blue'
    },
    {
        role: 'ROLE_CHEF',
        label: 'Chef de Bord',
        icon: '👨‍🍳',
        description: 'Créez des expériences culinaires inoubliables en pleine mer.',
        features: ['Cuisine gastronomique', 'Gestion des stocks', 'Menus personnalisés'],
        color: 'orange'
    },
    {
        role: 'ROLE_HOTESSE',
        label: 'Hôtesse',
        icon: '⚜️',
        description: 'Assurez un service d\'excellence et un confort absolu pour les passagers.',
        features: ['Service hôtelier', 'Cocktails signatures', 'Conciergerie'],
        color: 'pink'
    }
];

const CrewRegister = () => {
    const navigate = useNavigate();
    const { userId, role, refreshProfile } = useAuthContext();
    const [step, setStep] = useState(1);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        phoneNumber: '',
        position: '',
        houseNumber: '',
        streetName: '',
        postcode: '',
        city: ''
    });

    const isStaff = ['ROLE_CAPITAINE', 'ROLE_CHEF', 'ROLE_HOTESSE'].includes(role);

    if (isStaff) {
        navigate('/crew/dashboard');
        return null;
    }

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegistration = async () => {
        setLoading(true);
        try {
            // 1. Fetch Role IRI by label (Robust method instead of hardcoded IDs)
            const roleRes = await api.get(`/api/roles?label=${selectedRole}`);
            const roleData = roleRes.data['member'] || roleRes.data['hydra:member'] || [];
            if (roleData.length === 0) {
                throw new Error(`Rôle ${selectedRole} non trouvé en base de données.`);
            }
            const roleIri = roleData[0]['@id'];

            // 2. Create Address
            const addressRes = await api.post('/api/addresses', {
                houseNumber: formData.houseNumber,
                streetName: formData.streetName,
                postcode: formData.postcode,
                city: formData.city
            }, CONFIG_JSON_LD);
            const addressIri = addressRes.data['@id'];

            // 3. Update User
            await api.patch(`/api/users/${userId}`, {
                role: roleIri,
                phoneNumber: formData.phoneNumber,
                position: formData.position,
                address: addressIri
            }, {
                headers: { 'Content-Type': 'application/merge-patch+json' }
            });

            // 4. Refresh profile to update UI
            await refreshProfile();

            alert("Bienvenue dans le Crew ! Votre profil est maintenant complet.");
            navigate('/crew/dashboard');
        } catch (err) {
            console.error("Error during crew registration", err);
            alert("Une erreur est survenue lors de l'inscription : " + (err.response?.data?.['hydra:description'] || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout className="pt-32 pb-20 overflow-hidden relative">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[150px] -z-10" />

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <RegisterHeader />

                {/* STEP 1: Role Selection */}
                {step === 1 && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                            {CREW_OPTIONS.map((opt) => (
                                <RoleCard 
                                    key={opt.role}
                                    opt={opt}
                                    isSelected={selectedRole === opt.role}
                                    onSelect={setSelectedRole}
                                />
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => setStep(2)}
                                disabled={!selectedRole}
                                className="px-12 py-6 bg-white text-slate-950 font-black rounded-3xl transition-all shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed text-xl uppercase italic tracking-tighter"
                            >
                                Étape Suivante →
                            </button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Details Form */}
                {step === 2 && (
                    <div className="animate-fade-in">
                        <CrewDetailsForm formData={formData} onChange={handleFormChange} />
                        <div className="flex flex-col items-center gap-6 mt-12">
                            <RegisterActions 
                                onConfirm={handleRegistration}
                                isDisabled={Object.values(formData).some(v => v === '')}
                                loading={loading}
                            />
                            <button 
                                onClick={() => setStep(1)}
                                className="text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all"
                            >
                                ← Retour au choix du rôle
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default CrewRegister;
