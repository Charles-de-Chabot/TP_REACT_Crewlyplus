import React from 'react';

const RegisterActions = ({ onConfirm, isDisabled, loading }) => {
    return (
        <div className="flex flex-col items-center gap-8">
            <button
                onClick={onConfirm}
                disabled={isDisabled || loading}
                className="px-12 py-6 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-3xl transition-all shadow-2xl shadow-teal-500/20 disabled:opacity-30 disabled:cursor-not-allowed text-xl uppercase italic tracking-tighter"
            >
                {loading ? 'Traitement en cours...' : 'Confirmer mon inscription pro'}
            </button>
            
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center max-w-sm">
                En vous inscrivant, vous certifiez posséder les diplômes et assurances nécessaires à l'exercice de votre fonction.
            </p>
        </div>
    );
};

export default RegisterActions;
