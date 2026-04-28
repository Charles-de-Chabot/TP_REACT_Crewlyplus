import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuthContext } from './authContext';

const ChatContext = createContext();

export const ChatProvider = ({ children, teamId }) => {
    const { token, userId } = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);

    // 1. Charger l'historique des messages
    const fetchMessages = useCallback(async () => {
        if (!teamId) return;
        setLoading(true);
        try {
            const response = await api.get(`/api/messages?team=${teamId}&order[createdAt]=asc`);
            // API Platform renvoie les données dans hydra:member ou member
            const fetchedMessages = response.data['hydra:member'] || response.data['member'] || [];
            setMessages(fetchedMessages);
        } catch (error) {
            console.error("Erreur lors du chargement des messages:", error);
        } finally {
            setLoading(false);
        }
    }, [teamId]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // 2. Écouter le Hub Mercure (Temps-réel)
    useEffect(() => {
        if (!teamId || !token) return;

        // Configuration de l'URL du Hub
        const hubUrl = new URL('http://localhost:3000/.well-known/mercure');
        hubUrl.searchParams.append('topic', `https://crewly.plus/teams/${teamId}/messages`);

        const eventSource = new EventSource(hubUrl, { withCredentials: true });

        eventSource.onopen = () => {
            console.log(`📡 Connecté au Canal Tactique de la Team ${teamId}`);
            setConnected(true);
        };

        eventSource.onmessage = (event) => {
            try {
                const newMessage = JSON.parse(event.data);
                setMessages(prev => {
                    // Éviter les doublons si l'Optimistic UI a déjà agi
                    if (prev.find(m => m.id === newMessage.id)) return prev;
                    return [...prev, newMessage];
                });
            } catch (err) {
                console.error("Erreur parsing message Mercure:", err);
            }
        };

        eventSource.onerror = () => {
            setConnected(false);
        };

        return () => {
            eventSource.close();
            setConnected(false);
        };
    }, [teamId, token]);

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

        try {
            const response = await api.post('/api/messages', {
                content,
                category,
                type,
                metadata,
                team: `/api/teams/${teamId}`,
                author: `/api/users/${userId}`
            });

            // Remplacer le message temporaire par le message officiel
            setMessages(prev => prev.map(m => m.id === tempId ? response.data : m));
        } catch (error) {
            console.error("Erreur d'envoi du message:", error);
            setMessages(prev => prev.filter(m => m.id !== tempId));
        }
    };

    return (
        <ChatContext.Provider value={{ 
            messages, 
            sendMessage, 
            loading, 
            connected,
            refreshMessages: fetchMessages 
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat doit être utilisé à l'intérieur d'un ChatProvider");
    }
    return context;
};
