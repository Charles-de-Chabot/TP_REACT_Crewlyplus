//==========================
// Constantes de l'api
//==========================
//Ce fichier va centraliser les URL de l'API Symfony
//L'avantage: Modifier l'URL de base en un seul endroit

//L'URL racine du serveur backend
export const API_ROOT = "http://localhost:8081";

//L'URL de base de l'API Platform
export const API_URL = `${API_ROOT}/api`;

//L'URL des utilisateurs
export const URL_USERS = `${API_URL}/users`;

//L'URL de login
export const URL_LOGIN = `${API_URL}/login_check`;

//Config pour le format JSON-LD (Requis par API Platform)
export const CONFIG_JSON_LD = {
    headers: {
        'Content-Type': 'application/ld+json'
    }
};

//=================================
// URL DES RECOURSES STATIQUES
//================================

//Images générales
export const IMAGE_URL = `${API_ROOT}/images`

export const BOAT_URL = `${API_ROOT}/uploads/boats`

export const USER_URL = `${API_ROOT}/uploads/users`

export const TEAM_URL = `${API_ROOT}/uploads/teams`