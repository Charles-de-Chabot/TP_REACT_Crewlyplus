import { useMemo } from 'react';

export const useSidebar = (userRole) => {
    return useMemo(() => {
        const role = userRole?.toLowerCase();

        // 1. LIENS UNIVERSELS (Accessibles par tout le monde)
        const universalLinks = [
            { label: 'Tableau de bord', path: '/dashboard', icon: 'Layout' },
            { label: 'Mon Profil', path: '/profile', icon: 'User' }, // Tout le monde y a accès
        ];

        // 2. LIENS CONDITIONNELS (Selon le rôle)
        const roleLinks = [
            // --- CLIENTS (User & Premium) ---
            { label: 'Bateaux', path: '/boats', icon: 'Anchor', allowed: ['user', 'premium'] },
            { label: 'Mes Réservations', path: '/my-bookings', icon: 'Calendar', allowed: ['user', 'premium'] },

            // --- PREMIUM UNIQUEMENT ---
            { label: 'Régates', path: '/regattas', icon: 'Flag', allowed: ['premium'] },
            { label: 'Ma Team', path: '/teams', icon: 'Users', allowed: ['premium'] },

            // --- STAFF (Capitaine, Hôtesse, Chef) ---
            { label: 'Missions reçues', path: '/missions', icon: 'Briefcase', allowed: ['capitaine', 'hotesse', 'chef'] },
            { label: 'Mon Planning', path: '/planning', icon: 'Clock', allowed: ['capitaine', 'hotesse', 'chef'] },

            // --- ADMIN UNIQUEMENT ---
            { label: 'Gestion Utilisateurs', path: '/admin/users', icon: 'UsersSettings', allowed: ['admin'] },
            { label: 'Gestion Flotte', path: '/admin/boats', icon: 'ShipSettings', allowed: ['admin'] },
            { label: 'Configuration Site', path: '/admin/settings', icon: 'Settings', allowed: ['admin'] },
        ];

        // Filtrage : On garde les universels + les liens où l'admin a le droit ou le rôle correspond
        const filteredRoleLinks = roleLinks.filter(link => 
            role === 'admin' || link.allowed.includes(role)
        );

        return [...universalLinks, ...filteredRoleLinks];
    }, [userRole]);
};