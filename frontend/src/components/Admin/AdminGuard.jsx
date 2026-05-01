import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../contexts/authContext';

const AdminGuard = () => {
    const { userId, roleLabel, loading } = useAuthContext();

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
                    <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Vérification des accès...</p>
                </div>
            </div>
        );
    }

    const isAdmin = roleLabel === 'ROLE_ADMIN';

    if (!userId || !isAdmin) {
        console.warn("Accès refusé : L'utilisateur n'est pas administrateur.", { roleLabel });
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminGuard;
