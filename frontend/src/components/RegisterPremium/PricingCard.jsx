import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';

// On passe "onUpgrade" en paramètre ici (destructuring des props)
const PricingCard = ({ onUpgrade }) => {
    const { userId, role } = useAuthContext();
    const navigate = useNavigate();

    const handleClick = () => {
        // 1. Si pas connecté, on dégage vers le login
        if (!userId) {
            navigate('/login');
            return;
        }
        
        // 2. Si déjà premium, on ne fait rien
        if (role === 'ROLE_PREMIUM') return;

        // 3. SINON, on déclenche la fonction reçue en prop
        // C'est ce qui fera passer la page principale à l'étape 2 (Formulaire)
        onUpgrade();
    };

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-[120px] rounded-full -z-10"></div>
            <div className="bg-slate-900/60 border border-white/10 backdrop-blur-3xl p-12 rounded-[4rem] shadow-3xl text-center border-t-amber-500/30">
                <h2 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Full Access</h2>
                <div className="flex justify-center items-baseline gap-3 my-10">
                    <span className="text-7xl font-black text-amber-500">29€</span>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-sm">/ mois</span>
                </div>

                <button 
                    onClick={handleClick}
                    disabled={role === 'ROLE_PREMIUM'}
                    className={`w-full py-6 font-black rounded-3xl transition-all shadow-2xl uppercase tracking-tighter text-lg ${
                        role === 'ROLE_PREMIUM' 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                        : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/40 active:scale-95'
                    }`}
                >
                    {role === 'ROLE_PREMIUM' ? 'Vous êtes Membre Élite' : 'Prendre la barre'}
                </button>
            </div>
        </div>
    );
};

export default PricingCard;