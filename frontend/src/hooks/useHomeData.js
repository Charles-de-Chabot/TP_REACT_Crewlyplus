import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoats } from '../store/boat/boatSlice';
import selectBoatData from '../store/boat/boatSelector';

const useHomeData = () => {
    const dispatch = useDispatch();
    const { loading: isLoading, boats } = useSelector(selectBoatData);

    // On déduit les nouveautés en prenant juste les 3 premiers
    const latestBoats = boats.slice(0, 3);

    useEffect(() => {
        if (boats.length === 0) {
            dispatch(fetchBoats());
        }
    }, [dispatch, boats.length]);

    return { isLoading, latestBoats };
};

export default useHomeData;