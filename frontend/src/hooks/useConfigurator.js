import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/authContext';
import api from '../api/axios';
import { 
    calculateTotalPrice,
    submitBooking,
    setError,
    setDates
} from '../store/booking/bookingSlice';
import {
    selectSelectedBoat, 
    selectBookingDates, 
    selectSelectedFormula, 
    selectSelectedFittings, 
    selectSelectedCrew, 
    selectTotalPrice, 
    selectIsPremiumDiscount, 
    selectBookingStatus, 
    selectBookingError
} from '../store/booking/bookingSelectors';

const CREW_ROLES = [
    { 
        role: 'ROLE_CAPITAINE', 
        label: 'Capitaine', 
        icon: '👨‍✈️', 
        price: 250, 
        description: 'Confiez la barre à un expert passionné. Au-delà de la navigation, votre capitaine sera votre guide privilégié pour découvrir des criques secrètes et garantir une sécurité absolue à votre famille.' 
    },
    { 
        role: 'ROLE_CHEF', 
        label: 'Chef', 
        icon: '👨‍🍳', 
        price: 200, 
        description: 'Transformez votre croisière en voyage gastronomique. Votre chef sélectionne les meilleurs produits locaux pour concocter des menus sur mesure, du petit-déjeuner au dîner sous les étoiles.' 
    },
    { 
        role: 'ROLE_HOTESSE', 
        label: 'Hôtesse', 
        icon: '⚜️', 
        price: 150, 
        description: "L'art de recevoir en pleine mer. Profitez d'un service hôtelier de luxe : gestion des cabines, cocktails signatures et assistance constante pour une détente totale." 
    },
];

export const useConfigurator = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useAuthContext();

    const boat = useSelector(selectSelectedBoat);
    const dates = useSelector(selectBookingDates);
    const selectedFormula = useSelector(selectSelectedFormula);
    const selectedFittings = useSelector(selectSelectedFittings);
    const selectedCrew = useSelector(selectSelectedCrew);
    const totalPrice = useSelector(selectTotalPrice);
    const isPremiumDiscount = useSelector(selectIsPremiumDiscount);
    const bookingStatus = useSelector(selectBookingStatus);
    const bookingError = useSelector(selectBookingError);

    const [formulas, setFormulas] = useState([]);
    const [fittings, setFittings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!boat || !dates.start || !dates.end) {
            navigate('/boats');
        }
    }, [boat, dates, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            if (!boat) return;
            try {
                const formulaRes = await api.get(`/api/formulas?boat.id=${boat.id}`);
                setFormulas(formulaRes.data['member'] || formulaRes.data['hydra:member'] || []);

                const fittingRes = await api.get('/api/fittings');
                setFittings(fittingRes.data['member'] || fittingRes.data['hydra:member'] || []);
            } catch (err) {
                console.error("Error loading configurator data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [boat]);

    useEffect(() => {
        dispatch(calculateTotalPrice());
    }, [selectedFormula, selectedFittings, selectedCrew, isPremiumDiscount, dates.nbDays, dispatch]);

    useEffect(() => {
        if (bookingStatus === 'paying') {
            navigate('/checkout'); 
        }
    }, [bookingStatus, navigate]);

    const handlePayment = () => {
        if (!userId) {
            dispatch(setError("Veuillez vous connecter pour finaliser la réservation."));
            return;
        }
        const payload = {
            boat: `/api/boats/${boat.id}`,
            user: `/api/users/${userId}`,
            rentalStart: dates.start,
            rentalEnd: dates.end,
            rentalPrice: totalPrice,
            formulas: selectedFormula ? [`/api/formulas/${selectedFormula.id}`] : [],
            fitting: selectedFittings.map(f => `/api/fittings/${f.id}`),
            requestedRoles: selectedCrew,
            crewMembers: [],
            status: 'created'
        };
        dispatch(submitBooking(payload));
    };

    const handleDateChange = (start, end) => {
        dispatch(setDates({ start, end }));
    };

    return {
        boat,
        dates,
        formulas,
        fittings,
        totalPrice,
        isPremiumDiscount,
        bookingStatus,
        bookingError,
        loading,
        handlePayment,
        handleDateChange,
        CREW_ROLES
    };
};
