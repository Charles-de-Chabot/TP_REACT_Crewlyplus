// ===========================
// CONTEXTE D'AUTHENTIFICATION (JWT)
// ===========================
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setAccessToken, clearAccessToken } from "../api/axios";
import { USER_INFOS } from "../constants/appConstant";
import { URL_LOGIN } from "../constants/apiConstant";

const AuthContext = createContext({
    userId: "",
    email: "",
    firstname: "",
    role: "",
    avatar: "",
    loading: true,
    signIn: async () => {},
    signOut: () => {},
});

export const AuthContextProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [role, setRole] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true);

    // ===========================
    // HELPER: MISE À JOUR ÉTATS
    // ===========================
    const hydrateUser = useCallback((userData) => {
        setUserId(userData.id || "");
        setEmail(userData.email || "");
        setFirstname(userData.firstname || userData.nickname || "");
        // On récupère le premier rôle du tableau (format Symfony) ou le champ role direct
        const userRole = Array.isArray(userData.roles) ? userData.roles[0] : userData.role;
        setRole(userRole || "user");
        setAvatar(userData.avatar || "");
    }, []);

    // ===========================
    // METHODE DE CONNEXION
    // ===========================
    const signIn = async (emailInput, passwordInput) => {
        try {
            const response = await api.post(URL_LOGIN, {
                email: emailInput,
                password: passwordInput
            });

            const { token, user } = response.data;

            if (!token) throw new Error("Token introuvable");

            // Stockage JWT
            setAccessToken(token);
            localStorage.setItem("token", token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Si l'API renvoie l'user complet, on hydrate, sinon on va le chercher
            if (user) {
                hydrateUser(user);
                localStorage.setItem(USER_INFOS, JSON.stringify(user));
            } else {
                const meResponse = await api.get("/api/me");
                hydrateUser(meResponse.data);
                localStorage.setItem(USER_INFOS, JSON.stringify(meResponse.data));
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            throw new Error(`Erreur connexion: ${errorMessage}`);
        }
    };

    // ===========================
    // METHODE DE DECONNEXION
    // ===========================
    const signOut = useCallback(() => {
        setUserId("");
        setEmail("");
        setFirstname("");
        setRole("");
        setAvatar("");
        
        clearAccessToken();
        localStorage.removeItem("token");
        localStorage.removeItem(USER_INFOS);
        delete api.defaults.headers.common['Authorization'];
    }, []);

    // ===========================
    // VERIFICATION SESSION (F5)
    // ===========================
    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem(USER_INFOS);

            if (token) {
                // 1. Restauration immédiate depuis le localStorage (évite le flash sidebar)
                if (storedUser) {
                    hydrateUser(JSON.parse(storedUser));
                }

                try {
                    setAccessToken(token);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // 2. Refresh des données depuis le serveur
                    const response = await api.get("/api/me");
                    hydrateUser(response.data);
                    localStorage.setItem(USER_INFOS, JSON.stringify(response.data));
                } catch (error) {
                    // Si le token est expiré (401), on déconnecte
                    signOut();
                }
            }
            setLoading(false);
        };

        checkSession();
    }, [hydrateUser, signOut]);

    const value = {
        userId,
        email,
        firstname,
        role,
        avatar,
        loading,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);