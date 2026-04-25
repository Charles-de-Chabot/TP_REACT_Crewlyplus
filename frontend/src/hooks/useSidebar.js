import { useMemo } from 'react';

export const useSidebar = (userRole) => {
    return useMemo(() => {
        const role = userRole?.replace('ROLE_', '').toLowerCase();

        // 1. LIENS UNIVERSELS (Toujours visibles)
        const universalLinks = [
            { label: 'Accueil', path: '/', allowed: ['user', 'premium', 'capitaine', 'hotesse', 'chef', 'admin'] },
            { label: 'La Flotte', path: '/boats', allowed: ['user', 'premium', 'capitaine', 'hotesse', 'chef', 'admin'] },
        ];

        // 2. LIENS CONDITIONNELS (Selon le rôle)
        const roleLinks = [
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