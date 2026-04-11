import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoatDetail, setSearchDates } from '../store/boat/boatSlice';
import selectBoatData from '../store/boat/boatSelector';

const useBoatDetail = (id) => {
    const dispatch = useDispatch();
    
    // Récupération des données depuis Redux
    const { loading, boatDetail, searchDates } = useSelector(selectBoatData);

    useEffect(() => {
        if (id) {
            dispatch(fetchBoatDetail(id));
        }
    }, [dispatch, id]);

    const handleDateChange = (start, end) => {
        dispatch(setSearchDates({ start, end }));
    };

    return { loading, boatDetail, searchDates, handleDateChange };
};

export default useBoatDetail;