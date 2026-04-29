import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '../api/axios';
import { useAuthContext } from './authContext';

const ChatContext = createContext();

export const ChatProvider = ({ children, teamId }) => {
    const { token, userId } = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({
        PASSERELLE: 0,
        TACTIQUE: 0,
        LOGISTIQUE: 0
    });
    const [activeCategory, setActiveCategory] = useState('PASSERELLE');
    const [isChatOpen, setIsChatOpen] = useState(false);

    // 🔄 RESET & REFRESH : Gérer la connexion/déconnexion
    useEffect(() => {
        if (!token || !userId) {
            // Déconnexion : On vide tout
            setMessages([]);
            setIsChatOpen(false);
            setUnreadCounts({ PASSERELLE: 0, TACTIQUE: 0, LOGISTIQUE: 0 });
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            processedIdsRef.current.clear();
        } else if (teamId) {
            // Connexion/Changement d'équipe : On recharge
            fetchMessages();
        }
    }, [token, userId, teamId]); // Réagir aux changements d'auth et de team

    // Refs pour que Mercure puisse lire les états sans se reconnecter
    const chatOpenRef = useRef(isChatOpen);
    const activeCategoryRef = useRef(activeCategory);
    const eventSourceRef = useRef(null);
    const processedIdsRef = useRef(new Set());
    
    useEffect(() => { chatOpenRef.current = isChatOpen; }, [isChatOpen]);
    useEffect(() => { activeCategoryRef.current = activeCategory; }, [activeCategory]);

    // 1. Charger l'historique des messages
    const fetchMessages = useCallback(async () => {
        if (!teamId) return;
        setLoading(true);
        try {
            // 🔄 On récupère les 50 plus récents (desc) pour être sûr d'avoir les derniers
            const response = await api.get(`/api/messages?team=${teamId}&order[createdAt]=desc&itemsPerPage=50`);
            let fetchedMessages = response.data['hydra:member'] || response.data['member'] || [];
            
            // 🔃 On les remet dans l'ordre chronologique pour l'affichage (asc)
            fetchedMessages = [...fetchedMessages].reverse();

            console.log(`📚 [Chat] ${fetchedMessages.length} messages récupérés (derniers 50)`);
            
            // 🚩 CALCUL DES NON-LUS : Comparaison avec la dernière lecture stockée
            const lastReadMap = JSON.parse(localStorage.getItem(`chat_last_read_${userId}_${teamId}`) || '{}');
            const newCounts = { PASSERELLE: 0, TACTIQUE: 0, LOGISTIQUE: 0 };

            fetchedMessages.forEach(msg => {
                const lastRead = lastReadMap[msg.category] ? new Date(lastReadMap[msg.category]).getTime() : 0;
                const msgTime = new Date(msg.createdAt).getTime();
                const isFromOthers = String(msg.author?.id || msg.author).replace('/api/users/', '') !== String(userId);

                if (isFromOthers && msgTime > lastRead) {
                    newCounts[msg.category]++;
                }
            });

            setUnreadCounts(newCounts);
            setMessages(fetchedMessages);
        } catch (error) {
            console.error("❌ Erreur lors du chargement de l'historique:", error);
        } finally {
            setLoading(false);
        }
    }, [teamId, userId]);



    // Fonction pour ouvrir/fermer le chat et reset le compteur de l'onglet actif
    const setChatStatus = useCallback((open) => {
        setIsChatOpen(open);
        if (open && teamId && userId) {
            const cat = activeCategoryRef.current;
            setUnreadCounts(prev => ({ ...prev, [cat]: 0 }));
            
            // 💾 Sauvegarde date de lecture
            const key = `chat_last_read_${userId}_${teamId}`;
            const lastReadMap = JSON.parse(localStorage.getItem(key) || '{}');
            lastReadMap[cat] = new Date().toISOString();
            localStorage.setItem(key, JSON.stringify(lastReadMap));
        }
    }, [teamId, userId]);

    // Fonction pour changer de catégorie et reset son compteur
    const changeCategory = useCallback((cat) => {
        setActiveCategory(cat);
        setUnreadCounts(prev => ({ ...prev, [cat]: 0 }));

        if (teamId && userId) {
            // 💾 Sauvegarde date de lecture
            const key = `chat_last_read_${userId}_${teamId}`;
            const lastReadMap = JSON.parse(localStorage.getItem(key) || '{}');
            lastReadMap[cat] = new Date().toISOString();
            localStorage.setItem(key, JSON.stringify(lastReadMap));
        }
    }, [teamId, userId]);

    // 2. Écouter le Hub Mercure (Temps-réel)
    useEffect(() => {
        if (!teamId || !token) {
            console.log("⏳ En attente des infos (TeamID/Token) pour Mercure...");
            return;
        }

        // 🛡️ VERROU : Si une connexion est déjà active pour cette équipe, on ne fait rien
        if (eventSourceRef.current && eventSourceRef.current.readyState !== EventSource.CLOSED) {
            return;
        }

        const cleanId = String(teamId).split('/').pop();
        const topic = encodeURIComponent(`https://crewly.plus/teams/${cleanId}/messages`);
        
        // Jeton système généré pour le développement
        const systemToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJtZXJjdXJlIjp7InN1YnNjcmliZSI6WyIqIl0sInB1Ymxpc2giOlsiKiJdfSwiZXhwIjoxODA4OTgwNjM1fQ.kZXBmYStD7Pd2PqorYrBNRJ_VVmXIht4lPLcH2gDPMU";
        const url = `http://localhost:3000/.well-known/mercure?topic=${topic}&authorization=${systemToken}`;
        
        const sessionID = Math.random().toString(36).substring(7);
        console.log(`🔌 [Session ${sessionID}] Connexion au Hub Mercure...`);

        let eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        const connect = () => {
            eventSource.onopen = () => {
                console.log("✅ Connexion Mercure établie et authentifiée");
                setConnected(true);
            };

                    eventSource.onmessage = (event) => {
                try {
                    const newMessage = JSON.parse(event.data);
                    const nId = String(newMessage.id).split('/').pop();
                    
                    const now = new Date().getTime();
                    console.log(`📡 [STREAM ${sessionID}] Message ${nId} reçu à ${now}ms`);

                    // 🛑 ANTI-DOUBLON ULTIME : Si déjà traité dans cette session, on ignore
                    if (processedIdsRef.current.has(nId)) {
                        console.log(`🚫 [STREAM ${sessionID}] Doublon ignoré pour ${nId}`);
                        return;
                    }
                    processedIdsRef.current.add(nId);
                    
                    const authorData = newMessage.author?.id || newMessage.author;
                    const authorId = String(authorData).replace('/api/users/', '');
                    const myId = String(userId).replace('/api/users/', '');
                    const isMyMessage = myId === authorId;

                    if (!isMyMessage) {
                        toast.info(`Message de ${newMessage.author?.firstname || 'Équipier'}`, {
                            description: `Canal ${newMessage.category}`,
                            action: {
                                label: 'Voir',
                                onClick: () => {
                                    setActiveCategory(newMessage.category);
                                    setIsChatOpen(true);
                                }
                            },
                        });

                        const isMessageInActiveTab = chatOpenRef.current && newMessage.category === activeCategoryRef.current;
                        if (!isMessageInActiveTab) {
                            setUnreadCounts(prevCounts => ({
                                ...prevCounts,
                                [newMessage.category]: (prevCounts[newMessage.category] || 0) + 1
                            }));
                        } else {
                            // 💾 Le chat est ouvert sur cet onglet : on marque comme lu immédiatement
                            const key = `chat_last_read_${userId}_${teamId}`;
                            const lastReadMap = JSON.parse(localStorage.getItem(key) || '{}');
                            lastReadMap[newMessage.category] = new Date().toISOString();
                            localStorage.setItem(key, JSON.stringify(lastReadMap));
                        }
                    }

                    setMessages(prev => {
                        // 1. Comparaison par ID réel
                        const idMatch = prev.find(m => {
                            const mId = String(m.id).split('/').pop();
                            const nId = String(newMessage.id).split('/').pop();
                            return mId === nId;
                        });
                        if (idMatch) return prev;

                        if (isMyMessage) {
                            const optimisticMatch = prev.find(m => m.isOptimistic && m.content === newMessage.content);
                            if (optimisticMatch) return prev;
                        }
                        
                        
                        return [...prev, newMessage];
                    });
                } catch (err) {
                    console.error("❌ Erreur parsing message:", err);
                }
            };

            eventSource.onerror = (err) => {
                console.warn("⚠️ Erreur de connexion Mercure, tentative de reconnexion...");
                eventSource.close();
                setConnected(false);
                
                setTimeout(() => {
                    if (eventSourceRef.current === eventSource) {
                        eventSource = new EventSource(url);
                        eventSourceRef.current = eventSource;
                        connect();
                    }
                }, 3000);
            };
        };

        connect();

        return () => {
            eventSource.close();
            setConnected(false);
        };
    }, [teamId, token, userId]); 

    // 3. Envoyer un message
    const sendMessage = async (content, category = 'PASSERELLE', type = 'TEXT', metadata = {}) => {
        if (!content.trim() || !teamId || !userId) return;

        const tempId = `temp-${Date.now()}`;
        const optimisticMessage = {
            id: tempId,
            content,
            category,
            type,
            metadata,
            createdAt: new Date().toISOString(),
            author: { id: userId }, 
            isOptimistic: true
        };

        setMessages(prev => [...prev, optimisticMessage]);

        const cleanTeamId = String(teamId).includes('/api/') ? teamId : `/api/teams/${teamId}`;
        const cleanUserId = String(userId).includes('/api/') ? userId : `/api/users/${userId}`;

        try {
            const response = await api.post('/api/messages', {
                content,
                category,
                type,
                metadata,
                team: cleanTeamId,
                author: cleanUserId
            });
            console.log("💾 Message sauvegardé en base:", response.data.content);
            const sId = String(response.data.id).split('/').pop();
            processedIdsRef.current.add(sId);
            setMessages(prev => prev.map(m => m.id === tempId ? response.data : m));
        } catch (error) {
            console.error("❌ Échec de l'envoi:", error);
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    return (
        <ChatContext.Provider value={{ 
            messages, 
            sendMessage, 
            loading, 
            connected,
            unreadCounts,
            totalUnreadCount: Object.values(unreadCounts).reduce((a, b) => a + b, 0),
            isChatOpen,
            setIsChatOpen: setChatStatus,
            activeCategory,
            setActiveCategory: changeCategory,
            refreshMessages: fetchMessages 
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        // 🛡️ Fallback sécurisé pour éviter les crashs hors-contexte (ex: Topbar en mode déconnecté)
        return {
            messages: [],
            loading: false,
            connected: false,
            unreadCounts: { PASSERELLE: 0, TACTIQUE: 0, LOGISTIQUE: 0 },
            totalUnreadCount: 0,
            activeCategory: 'PASSERELLE',
            isChatOpen: false,
            setIsChatOpen: () => {},
            setActiveCategory: () => {},
            sendMessage: async () => {}
        };
    }
    return context;
};
