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

// Méthode qui récupère tous les bateaux avec filtres optionnels
export const fetchBoats = (filters = {}) => async (dispatch) => {
    try {
        dispatch(setLoading(true));
        
        // Construction des paramètres de requête
        const params = {};
        if (filters.start) params.start = filters.start;
        if (filters.end) params.end = filters.end;
        if (filters.type && filters.type !== '0') params.boatType = filters.type;
        if (filters.model && filters.model !== '0') params.boatModel = filters.model;
        if (filters.city && filters.city !== '0') params['address.city'] = filters.city;
        if (filters.used !== undefined) params.used = filters.used;

        const response = await api.get('/api/boats', { params });

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

        dispatch(setBoats(fetchedData));
    } catch (error) {
        console.error(`Erreur lors de la récupération des bateaux: ${error}`);
    } finally {
        dispatch(setLoading(false));
    }
};

// Méthode pour récupérer les données de filtres (Types, Modèles, Villes) de manière exhaustive
export const fetchFilterData = () => async (dispatch) => {
    try {
        const [typesRes, modelsRes, boatsRes] = await Promise.all([
            api.get('/api/types'),
            api.get('/api/models'),
            api.get('/api/boats') // On récupère tous les bateaux sans filtres pour les villes
        ]);

        const types = typesRes.data['hydra:member'] || typesRes.data.member || (Array.isArray(typesRes.data) ? typesRes.data : []);
        const models = modelsRes.data['hydra:member'] || modelsRes.data.member || (Array.isArray(modelsRes.data) ? modelsRes.data : []);
        const allBoats = boatsRes.data['hydra:member'] || boatsRes.data.member || (Array.isArray(boatsRes.data) ? boatsRes.data : []);

        const uniqueCities = [...new Set(allBoats.map(b => b.adress?.city).filter(Boolean))];

        dispatch(setFiltersData({ 
            types, 
            models, 
            cities: uniqueCities 
        }));
    } catch (error) {
        console.error("Erreur lors de la récupération des filtres:", error);
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