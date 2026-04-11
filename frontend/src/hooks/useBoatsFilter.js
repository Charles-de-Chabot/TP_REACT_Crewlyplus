import { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoats, setSearchDates } from '../store/boat/boatSlice';
import selectBoatData from '../store/boat/boatSelector';

const useBoatsFilter = () => {
    const dispatch = useDispatch();
    const { loading, boats, types, models, cities, searchDates } = useSelector(selectBoatData);

    const [filters, setFilters] = useState({
        type: '0',
        model: '0',
        city: '0',
        start: searchDates?.start || '',
        end: searchDates?.end || ''
    });

    useEffect(() => {
        if (boats.length === 0) dispatch(fetchBoats());
    }, [dispatch, boats.length]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'type' ? { model: '0' } : {})
        }));
    };

    const handleDateChange = (start, end) => {
        setFilters(prev => ({ ...prev, start, end }));
        dispatch(setSearchDates({ start, end }));
    };

    const resetFilters = () => {
        const empty = { type: '0', model: '0', city: '0', start: '', end: '' };
        setFilters(empty);
        dispatch(setSearchDates({ start: '', end: '' }));
    };

    // Logique de filtrage
    const availableModels = useMemo(() => 
        filters.type === '0' ? models : models.filter(m => m.typeId?.toString() === filters.type)
    , [filters.type, models]);

    const filteredBoats = useMemo(() => {
        return boats.filter(boat => {
            if (filters.type !== '0' && boat.type?.id?.toString() !== filters.type) return false;
            if (filters.model !== '0' && boat.model?.id?.toString() !== filters.model) return false;
            if (filters.city !== '0' && boat.adress?.city !== filters.city) return false;
            return true;
        });
    }, [filters, boats]);

    const activeCount = Object.values(filters).filter(v => v !== '0' && v !== '').length;

    return {
        loading, boats: filteredBoats, types, cities, availableModels,
        filters, activeCount, handleFilterChange, handleDateChange, resetFilters
    };
};

export default useBoatsFilter;