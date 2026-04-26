import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { setAccessToken, clearAccessToken } from "../api/axios";
import { USER_INFOS } from "../constants/appConstant";
import { URL_LOGIN } from "../constants/apiConstant";

const AuthContext = createContext({
    userId: "",
    email: "",
    firstname: "",
    lastname: "",
    role: "",
    roleLabel: "",
    avatar: "",
    phoneNumber: "",
    position: "",
    address: null,
    loading: true,
    signIn: async () => {},
    signOut: () => {},
    refreshProfile: async () => {},
});

export const AuthContextProvider = ({ children }) => {
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [role, setRole] = useState("");
    const [roleLabel, setRoleLabel] = useState("");
    const [avatar, setAvatar] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [position, setPosition] = useState("");
    const [address, setAddress] = useState(null);
    const [loading, setLoading] = useState(true);

    const hydrateUser = useCallback((userData) => {
        setUserId(userData.id || "");
        setEmail(userData.email || "");
        setFirstname(userData.firstname || userData.nickname || "");
        setLastname(userData.lastname || "");
        
        const technicalRole = Array.isArray(userData.roles) ? userData.roles[0] : userData.role;
        setRole(technicalRole || "user");
        setRoleLabel(userData.roleLabel || technicalRole || "user");
        
        const avatarPath = userData.media?.[0]?.media_path || "";
        setAvatar(avatarPath);
        setPhoneNumber(userData.phoneNumber || userData.phone_number || "");
        setPosition(userData.position || "");
        setAddress(userData.address || null);
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
        setLastname("");
        setRole("");
        setRoleLabel("");
        setAvatar("");
        setPhoneNumber("");
        setPosition("");
        setAddress(null);
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

    // Dynamic Theme Injector
    useEffect(() => {
        const root = document.documentElement;
        let color = "#14b8a6"; // Default Teal
        let rgb = "20, 184, 166";

        if (roleLabel === 'ROLE_CAPTAIN') {
            color = "#3b82f6";
            rgb = "59, 130, 246";
        } else if (roleLabel === 'ROLE_CHEF') {
            color = "#f97316";
            rgb = "249, 115, 22";
        } else if (roleLabel === 'ROLE_HOTESSE') {
            color = "#a855f7";
            rgb = "168, 85, 247";
        } else if (roleLabel === 'ROLE_PREMIUM') {
            color = "#f59e0b";
            rgb = "245, 158, 11";
        }

        root.style.setProperty('--role-color', color);
        root.style.setProperty('--role-color-rgb', rgb);
    }, [roleLabel]);

    const value = {
        userId,
        email,
        firstname,
        lastname,
        role,
        roleLabel, 
        avatar,
        phoneNumber,
        position,
        address,
        loading,
        signIn,
        signOut,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);