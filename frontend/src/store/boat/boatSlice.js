import { createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios"; // On utilise l'instance axios déjà configurée

const boatSlice = createSlice({
    name: "boats",
    initialState: {
        loading: false,
        boats: [],
        boatDetail: {},
        // On stocke les filtres ici pour ne pas avoir à les recalculer partout
        types: [],
        models: [],
        cities: [],
        // Pour conserver les dates entre les pages
        searchDates: { start: '', end: '' }
    },
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setBoats: (state, action) => {
            state.boats = action.payload;
        },
        setBoatDetail: (state, action) => {
            state.boatDetail = action.payload;
        },
        setFiltersData: (state, action) => {
            state.types = action.payload.types;
            state.models = action.payload.models;
            state.cities = action.payload.cities;
        },
        setSearchDates: (state, action) => {
            state.searchDates = action.payload;
        }
    }
});

export const { setLoading, setBoats, setBoatDetail, setFiltersData, setSearchDates } = boatSlice.actions;

/**=============================
 * PARTIE DES REQUETES SUR L'API
 * =============================
 */

// Méthode qui récupère tous les bateaux
export const fetchBoats = () => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        const response = await api.get('/api/boats');

        // Gestion du format JSON-LD vs JSON classique
        let fetchedData = [];
        if (response.data && response.data['hydra:member']) {
            fetchedData = response.data['hydra:member'];
        } else if (response.data && response.data.member) {
            fetchedData = response.data.member;
        } else if (Array.isArray(response.data)) {
            fetchedData = response.data;
        }

        dispatch(setBoats(fetchedData));

        // Extraction dynamique des filtres
        const uniqueTypes = [];
        const uniqueModels = [];
        const uniqueCities = [];

        fetchedData.forEach(boat => {
            if (boat.type && !uniqueTypes.find(t => t.id === boat.type.id)) uniqueTypes.push(boat.type);
            if (boat.model && !uniqueModels.find(m => m.id === boat.model.id)) uniqueModels.push({ ...boat.model, typeId: boat.type?.id });
            if (boat.adress?.city && !uniqueCities.includes(boat.adress.city)) uniqueCities.push(boat.adress.city);
        });

        dispatch(setFiltersData({ types: uniqueTypes, models: uniqueModels, cities: uniqueCities }));

    } catch (error) {
        console.error(`Erreur lors de la récupération des bateaux: ${error}`);
    } finally {
        dispatch(setLoading(false));
    }
};

// Méthode qui récupère le détail d'un bateau (Pour la future page BoatShow)
export const fetchBoatDetail = (id) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        // Requête vers API Platform pour un seul bateau
        const response = await api.get(`/api/boats/${id}`);
        dispatch(setBoatDetail(response.data));
    } catch (error) {
        console.error(`Erreur lors de la récupération du détail du bateau: ${error}`);
    } finally {
        dispatch(setLoading(false));
    }
};

export default boatSlice.reducer;