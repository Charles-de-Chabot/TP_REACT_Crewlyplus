import React from 'react';
import Layout from '../../components/UI/Layout';

// Components
import RegisterHeader from '../../components/Crew/RegisterHeader';
import RoleCard from '../../components/Crew/RoleCard';
import RegisterActions from '../../components/Crew/RegisterActions';
import CrewDetailsForm from '../../components/Crew/CrewDetailsForm';

// Custom Hook
import { useCrewRegister } from '../../hooks/useCrewRegister';
import { Navigate } from 'react-router-dom';

const CREW_OPTIONS = [
    { role: 'ROLE_CAPITAINE', label: 'Capitaine', icon: '👨‍✈️', description: 'Prenez le commandement.', features: ['Navigation experte'], color: 'blue' },
    { role: 'ROLE_CHEF', label: 'Chef', icon: '👨‍🍳', description: 'Cuisine gastronomique.', features: ['Menus personnalisés'], color: 'orange' },
    { role: 'ROLE_HOTESSE', label: 'Hôtesse', icon: '⚜️', description: 'Service d\'excellence.', features: ['Conciergerie'], color: 'pink' }
];

const CrewRegister = () => {
    const {
        step,
        setStep,
        selectedRole,
        setSelectedRole,
        formData,
        loading,
        handleFormChange,
        handleRegistration,
        role
    } = useCrewRegister();

    const isStaff = ['ROLE_CAPITAINE', 'ROLE_CHEF', 'ROLE_HOTESSE'].includes(role);
    if (isStaff) return <Navigate to="/crew/dashboard" replace />;

    return (
        <Layout className="pt-32 pb-20 relative">
            <div className="container mx-auto px-6 max-w-6xl">
                <RegisterHeader />

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
                                className="px-12 py-6 bg-white text-slate-950 font-black rounded-3xl transition-all shadow-2xl disabled:opacity-30 text-xl uppercase italic tracking-tighter"
                            >
                                Étape Suivante →
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <CrewDetailsForm formData={formData} onChange={handleFormChange} />
                        <div className="flex flex-col items-center gap-6 mt-12">
                            <RegisterActions 
                                onConfirm={handleRegistration}
                                isDisabled={Object.values(formData).some(v => v === '')}
                                loading={loading}
                            />
                            <button onClick={() => setStep(1)} className="text-slate-500 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all">
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
