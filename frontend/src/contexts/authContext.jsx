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
    const [teamId, setTeamId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

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

        console.log("👤 Hydration User Data:", { 
            currentTeam: userData.currentTeam, 
            membershipsCount: userData.memberships?.length 
        });

        // 🎯 Extraction de la Team pour le Chat Global
        if (userData.currentTeam) {
            setTeamId(userData.currentTeam.id || userData.currentTeam);
        } else if (userData.memberships?.length > 0) {
            const activeMembership = userData.memberships.find(m => !m.leftAt);
            if (activeMembership) {
                const id = activeMembership.team?.id || activeMembership.team;
                setTeamId(id);
            }
        }
    }, []);

    const signIn = async (emailInput, passwordInput) => {
        try {
            const response = await api.post(URL_LOGIN, {
                email: emailInput,
                password: passwordInput
            });

            const { token: receivedToken, user } = response.data;
            if (!receivedToken) throw new Error("Token introuvable");

            setAccessToken(receivedToken);
            setToken(receivedToken);
            localStorage.setItem("token", receivedToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${receivedToken}`;

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
        setToken("");
        clearAccessToken();
        localStorage.removeItem("token");
        localStorage.removeItem(USER_INFOS);
        delete api.defaults.headers.common['Authorization'];
    }, []);

    const refreshProfile = useCallback(async () => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                setAccessToken(storedToken);
                setToken(storedToken);
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                
                const response = await api.get("/api/me");
                hydrateUser(response.data);
                localStorage.setItem(USER_INFOS, JSON.stringify(response.data));
            } catch (error) {
                console.error("Erreur refresh profile:", error);
                if (error.response?.status === 401) {
                    signOut();
                }
            }
        }
    }, [hydrateUser, signOut]);

    useEffect(() => {
        const checkSession = async () => {
            const storedToken = localStorage.getItem("token");
            const storedUser = localStorage.getItem(USER_INFOS);

            if (storedToken) {
                setToken(storedToken);
                if (storedUser) {
                    hydrateUser(JSON.parse(storedUser));
                }
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

        if (roleLabel === 'ROLE_CAPITAINE') {
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
        teamId,
        loading,
        token,
        signIn,
        signOut,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);