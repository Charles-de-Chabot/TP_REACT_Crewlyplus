import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setAccessToken, clearAccessToken } from "../api/axios";
import { USER_INFOS } from "../constants/appConstant";
import { URL_LOGIN } from "../constants/apiConstant";

const AuthContext = createContext({
    userId: "",
    email: "",
    firstname: "",
    role: "",
    roleLabel: "", // Ajouté pour la Topbar
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
    const [roleLabel, setRoleLabel] = useState(""); // Nouveau State
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true);

    const hydrateUser = useCallback((userData) => {
        setUserId(userData.id || "");
        setEmail(userData.email || "");
        setFirstname(userData.firstname || userData.nickname || "");
        
        // On récupère le rôle technique (ex: ROLE_USER)
        const technicalRole = Array.isArray(userData.roles) ? userData.roles[0] : userData.role;
        setRole(technicalRole || "user");

        // On récupère le label de l'entité (ex: ROLE_PREMIUM) ou on prend le technique par défaut
        // C'est ici que la magie opère pour ta Topbar
        setRoleLabel(userData.roleLabel || technicalRole || "user");
        
        setAvatar(userData.avatar || "");
    }, []);

    const signIn = async (emailInput, passwordInput) => {
        try {
            const response = await api.post(URL_LOGIN, {
                email: emailInput,
                password: passwordInput
            });

            const { token, user } = response.data;
            if (!token) throw new Error("Token introuvable");

            setAccessToken(token);
            localStorage.setItem("token", token);
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

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

    const signOut = useCallback(() => {
        setUserId("");
        setEmail("");
        setFirstname("");
        setRole("");
        setRoleLabel(""); // On vide aussi le label
        setAvatar("");
        clearAccessToken();
        localStorage.removeItem("token");
        localStorage.removeItem(USER_INFOS);
        delete api.defaults.headers.common['Authorization'];
    }, []);

    const refreshProfile = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                // IMPORTANT : On doit s'assurer que le token est bien configuré pour Axios
                setAccessToken(token);
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
                const response = await api.get("/api/me");
                hydrateUser(response.data);
                localStorage.setItem(USER_INFOS, JSON.stringify(response.data));
            } catch (error) {
                console.error("Erreur refresh profile:", error);
                // Si le token est expiré ou invalide, on déconnecte
                if (error.response?.status === 401) {
                    signOut();
                }
            }
        }
    }, [hydrateUser, signOut]);

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem(USER_INFOS);

            if (token) {
                // On pré-charge les infos locales pour éviter les flashs
                if (storedUser) {
                    hydrateUser(JSON.parse(storedUser));
                }
                // On lance la vérification/mise à jour réelle auprès de l'API
                await refreshProfile();
            }
            setLoading(false);
        };
        checkSession();
    }, [refreshProfile, hydrateUser]);

    const value = {
        userId,
        email,
        firstname,
        role,
        roleLabel, 
        avatar,
        loading,
        signIn,
        signOut,
        refreshProfile, // On l'expose ici
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);