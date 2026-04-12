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

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem("token");
            const storedUser = localStorage.getItem(USER_INFOS);

            if (token) {
                if (storedUser) {
                    hydrateUser(JSON.parse(storedUser));
                }

                try {
                    setAccessToken(token);
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    const response = await api.get("/api/me");
                    hydrateUser(response.data);
                    localStorage.setItem(USER_INFOS, JSON.stringify(response.data));
                } catch (error) {
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
        roleLabel, // On transmet bien le state ici
        avatar,
        loading,
        signIn,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);