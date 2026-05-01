import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'sonner';

/**
 * Hook générique pour la gestion des données dans le panel Admin
 * Gère le fetch, la recherche (debounce), la pagination et les statuts
 */
export const useAdminData = (endpoint, searchField = 'name', itemsPerPage = 30) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Debounce de la recherche
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset page quand la recherche change
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch]);

    const fetchData = async () => {
        setLoading(true);
        try {
            let url = `${endpoint}?page=${currentPage}`;
            if (debouncedSearch.trim()) {
                url += `&${searchField}=${encodeURIComponent(debouncedSearch)}`;
            }
            
            const response = await api.get(url);
            const rawMembers = response.data['member'] || response.data['hydra:member'] || [];
            setTotalItems(response.data['totalItems'] || response.data['hydra:totalItems'] || 0);

            // Gestion spécifique pour le backend Crewly (fallback IRI si références circulaires)
            const isIriOnly = rawMembers.length > 0 && typeof rawMembers[0] === 'object' && Object.keys(rawMembers[0]).length === 1 && rawMembers[0]['@id'];

            if (isIriOnly) {
                const promises = rawMembers.map(item => api.get(item['@id']).then(r => r.data).catch(() => null));
                const fullResults = (await Promise.all(promises)).filter(Boolean);
                setData(fullResults);
            } else {
                setData(rawMembers);
            }
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
            toast.error("Erreur lors de la récupération des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, debouncedSearch, endpoint]);

    const toggleStatus = async (item, statusField = 'isActive') => {
        // Supporte snake_case et camelCase pour la compatibilité backend/API
        const currentStatus = item[statusField] ?? item.isActive ?? item.is_active ?? false;
        const newStatus = !currentStatus;
        
        try {
            await api.patch(`${endpoint}/${item.id}`, 
                { [statusField]: newStatus },
                { headers: { 'Content-Type': 'application/merge-patch+json' } }
            );
            
            setData(prev => prev.map(u => u.id === item.id 
                ? { ...u, [statusField]: newStatus, isActive: newStatus, is_active: newStatus } 
                : u
            ));
            
            toast.success(`Statut mis à jour avec succès`);
            return true;
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("Erreur lors de la modification du statut");
            return false;
        }
    };

    return {
        data,
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        totalItems,
        itemsPerPage,
        refresh: fetchData,
        toggleStatus,
        setData
    };
};
