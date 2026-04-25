import { useMemo } from 'react';

export const useSidebar = (userRole) => {
    return useMemo(() => {
        const role = userRole?.replace('ROLE_', '').toLowerCase();

        // 1. LIENS UNIVERSELS
        const universalLinks = [
            { label: 'Accueil', path: '/', allowed: ['user', 'premium', 'capitaine', 'hotesse', 'chef', 'admin'] },
        ];

        // 2. LIENS CONDITIONNELS
        const roleLinks = [
            // --- CLIENTS (User & Premium) ---
            { label: 'Bateaux', path: '/boats', allowed: ['user', 'premium'] },
            
            // --- STAFF (Capitaine, Hôtesse, Chef) ---
            { label: 'Dashboard Pro', path: '/crew/dashboard', allowed: ['capitaine', 'hotesse', 'chef'] },

            // --- PREMIUM UNIQUEMENT ---
            { label: 'Régates', path: '/regattas', allowed: ['premium'] },

            // --- ADMIN UNIQUEMENT ---
            { label: 'Gestion Utilisateurs', path: '/admin/users', allowed: ['admin'] },
            { label: 'Gestion Flotte', path: '/admin/boats', allowed: ['admin'] },
        ];

        // Filtrage
        const filteredRoleLinks = roleLinks.filter(link => 
            role === 'admin' || link.allowed.includes(role)
        );

        return [...universalLinks, ...filteredRoleLinks];
    }, [userRole]);
};