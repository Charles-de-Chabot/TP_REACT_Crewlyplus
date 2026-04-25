import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../contexts/authContext';
import api from '../../api/axios';

// Components
import Layout from '../../components/UI/Layout';
import PageLoader from '../../components/Loader/PageLoader';
import CrewSelector from '../../components/Configurator/CrewSelector';
import FittingSelector from '../../components/Configurator/FittingSelector';
import ConfiguratorBasket from '../../components/Configurator/ConfiguratorBasket';

// Redux
import { 
    selectSelectedBoat, 
    selectBookingDates, 
    selectSelectedFormula, 
    selectSelectedFittings, 
    selectSelectedCrew, 
    selectTotalPrice,
    selectSubTotalPrice,
    selectDiscountPrice,
    selectIsPremiumDiscount,
    selectBookingStatus,
    selectBookingError
} from '../../store/booking/bookingSelectors';
import { 
    calculateTotalPrice,
    submitBooking 
} from '../../store/booking/bookingSlice';

// Constants
const CREW_ROLES = [
    { 
        role: 'ROLE_CAPITAINE', 
        label: 'Capitaine', 
        icon: '👨‍✈️', 
        required: true, 
        price: 250, 
        description: 'Confiez la barre à un expert passionné. Au-delà de la navigation, votre capitaine sera votre guide privilégié pour découvrir des criques secrètes et garantir une sécurité absolue à votre famille.' 
    },
    { 
        role: 'ROLE_CHEF', 
        label: 'Chef de Bord', 
        icon: '👨‍🍳', 
        required: false, 
        price: 200, 
        description: 'Transformez votre croisière en voyage gastronomique. Votre chef sélectionne les meilleurs produits locaux pour concocter des menus sur mesure, du petit-déjeuner au dîner sous les étoiles.' 
    },
    { 
        role: 'ROLE_HOTESSE', 
        label: 'Hôtesse', 
        icon: '⚜️', 
        required: false, 
        price: 150, 
        description: "L'art de recevoir en pleine mer. Profitez d'un service hôtelier de luxe : gestion des cabines, cocktails signatures et assistance constante pour une détente totale." 
    },
];

const Configurator = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userId } = useAuthContext();

    // Redux State
    const boat = useSelector(selectSelectedBoat);
    const dates = useSelector(selectBookingDates);
    const selectedFormula = useSelector(selectSelectedFormula);
    const selectedFittings = useSelector(selectSelectedFittings);
    const selectedCrew = useSelector(selectSelectedCrew);
    const totalPrice = useSelector(selectTotalPrice);
    const subTotalPrice = useSelector(selectSubTotalPrice);
    const discountPrice = useSelector(selectDiscountPrice);
    const isPremiumDiscount = useSelector(selectIsPremiumDiscount);
    const bookingStatus = useSelector(selectBookingStatus);
    const bookingError = useSelector(selectBookingError);

    // Local State for available options
    const [formulas, setFormulas] = useState([]);
    const [fittings, setFittings] = useState([]);
    const [crewMembers, setCrewMembers] = useState({}); // { role: [users] }
    const [loading, setLoading] = useState(true);

    // Redirect if no boat or dates selected
    useEffect(() => {
        if (!boat || !dates.start || !dates.end) {
            navigate('/boats');
        }
    }, [boat, dates, navigate]);

    // Fetch formulas, fittings and crew
    useEffect(() => {
        const fetchData = async () => {
            if (!boat) return;
            try {
                // 1. Fetch Formulas for this boat
                const formulaRes = await api.get(`/api/formulas?boat.id=${boat.id}`);
                setFormulas(formulaRes.data['member'] || formulaRes.data['hydra:member'] || []);

                // 2. Fetch Fittings
                const fittingRes = await api.get('/api/fittings', {
                    headers: { 'Accept': 'application/ld+json' }
                });
                const fittingData = fittingRes.data['member'] || fittingRes.data['hydra:member'] || (Array.isArray(fittingRes.data) ? fittingRes.data : []);
                setFittings(fittingData);

                // 3. Fetch Crew by Roles
                const crewData = {};
                for (const roleObj of CREW_ROLES) {
                    const res = await api.get(`/api/users?role.label=${roleObj.role}&is_active=true`);
                    crewData[roleObj.role] = res.data['member'] || res.data['hydra:member'] || [];
                }
                setCrewMembers(crewData);

            } catch (err) {
                console.error("Error fetching configurator data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [boat]);

    useEffect(() => {
        dispatch(calculateTotalPrice());
    }, [selectedFormula, selectedFittings, selectedCrew, isPremiumDiscount, dates.nbDays, dispatch]);

    const handlePayment = () => {
        const payload = {
            boat: `/api/boats/${boat.id}`,
            user: `/api/users/${userId}`,
            rentalStart: dates.start,
            rentalEnd: dates.end,
            rentalPrice: totalPrice,
            formulas: selectedFormula ? [`/api/formulas/${selectedFormula.id}`] : [],
            fitting: selectedFittings.map(f => `/api/fittings/${f.id}`),
            crewMembers: [], // Modified for role-based selection, backend logic to be implemented later
            status: 'pending'
        };
        dispatch(submitBooking(payload));
    };

    // Redirect to checkout when payment intent is ready
    useEffect(() => {
        if (bookingStatus === 'paying') {
            navigate('/checkout'); 
        }
    }, [bookingStatus, navigate]);

    if (loading || !boat) return <PageLoader />;

    return (
        <Layout className="pt-32 pb-20 relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />

            <div className="container mx-auto px-6 max-w-[1400px]">
                
                {/* Header Information */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <p className="text-teal-500 font-black uppercase tracking-[0.3em] text-xs mb-4 flex items-center gap-2">
                            <span className="w-8 h-[1px] bg-teal-500/30" />
                            Configuration de l'expérience
                        </p>
                        <h1 className="text-5xl lg:text-7xl font-black text-white italic tracking-tighter leading-none mb-6">
                            VOTRE EXPÉDITION <br />
                            <span className="text-transparent stroke-text">D'EXCEPTION.</span>
                        </h1>
                        <div className="flex items-center gap-6 text-slate-400 font-bold text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-teal-500" />
                                <span>{boat.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                <span>{dates.nbDays} jours</span>
                            </div>
                        </div>
                        {isPremiumDiscount && (
                            <p className="text-amber-500 text-[10px] font-bold mt-1 uppercase">✦ Remise Élite Incluse (-15%)</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Left Column : Options */}
                    <div className="lg:col-span-2 space-y-16">
                        
                        {/* Section 1 : Crew Selector */}
                        <CrewSelector 
                            crewMembers={crewMembers}
                            selectedCrew={selectedCrew}
                            dates={dates}
                            crewRoles={CREW_ROLES}
                            dispatch={dispatch}
                        />

                        {/* Section 2 : Fitting Selector */}
                        <FittingSelector 
                            fittings={fittings}
                            selectedFittings={selectedFittings}
                            dispatch={dispatch}
                        />
                    </div>

                    {/* Right Column : Basket Summary */}
                    <aside className="lg:col-span-1">
                        <ConfiguratorBasket 
                            boat={boat}
                            dates={dates}
                            selectedFormula={selectedFormula}
                            selectedFittings={selectedFittings}
                            selectedCrew={selectedCrew}
                            crewMembers={crewMembers}
                            crewRoles={CREW_ROLES}
                            subTotalPrice={subTotalPrice}
                            discountPrice={discountPrice}
                            totalPrice={totalPrice}
                            isPremiumDiscount={isPremiumDiscount}
                            bookingStatus={bookingStatus}
                            bookingError={bookingError}
                            onPayment={handlePayment}
                        />
                    </aside>

                </div>
            </div>
        </Layout>
    );
};

export default Configurator;
