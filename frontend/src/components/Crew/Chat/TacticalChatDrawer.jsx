import React, { useEffect, useRef, useState, useMemo } from 'react';
import { X, Radio, MessageSquare, Activity, Settings } from 'lucide-react';
import { useChat } from '../../../contexts/ChatContext';
import { useAuthContext } from '../../../contexts/authContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

// Styles pour la scrollbar du chat déplacés hors du composant pour éviter la recréation à chaque render
const CHAT_STYLES = `
    .chat-scroll::-webkit-scrollbar { width: 4px; }
    .chat-scroll::-webkit-scrollbar-track { background: transparent; }
    .chat-scroll::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.2); border-radius: 10px; }
    .chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.5); }
`;

const TacticalChatDrawer = () => {
    const { 
        isChatOpen, 
        setIsChatOpen, 
        messages, 
        sendMessage, 
        connected, 
        loading, 
        activeCategory, 
        setActiveCategory, 
        unreadCounts 
    } = useChat();
    const { userId } = useAuthContext();

    const isOpen = isChatOpen;
    const onClose = () => setIsChatOpen(false);
    const scrollRef = useRef(null);

    // Mémorisation des messages filtrés pour éviter le recalcul si les messages ou la catégorie ne changent pas
    const filteredMessages = useMemo(() => 
        messages.filter(m => m.category === activeCategory),
    [messages, activeCategory]);

    // Auto-scroll au dernier message
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            requestAnimationFrame(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                }
            });
        }
    }, [filteredMessages, isOpen]);

    if (!isOpen) return null;

    return (
        <div className={`fixed top-[100px] bottom-[30px] right-[20px] w-full sm:w-[380px] bg-slate-950/80 border border-cyan-500/30 backdrop-blur-3xl z-[9999] shadow-[-20px_0_80px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out transform rounded-[32px] flex flex-col overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+40px)]'}`}>
            <style>{CHAT_STYLES}</style>
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="relative p-6 border-b border-white/10 flex items-center justify-between bg-slate-900/40">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className={`absolute -inset-1 rounded-full blur-sm ${connected ? 'bg-cyan-500/50 animate-pulse' : 'bg-red-500/50'}`} />
                        <div className={`relative w-3 h-3 rounded-full border-2 border-slate-900 ${connected ? 'bg-cyan-400' : 'bg-red-500'}`} />
                    </div>
                    <div>
                        <h2 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Tactical Feed v2.4</h2>
                        <div className="flex items-center gap-2">
                            <span className="text-[8px] text-cyan-400/60 font-mono uppercase tracking-widest">
                                {connected ? 'System.Encrypted.Active' : 'System.Link.Failure'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={onClose}
                    className="group relative p-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 rounded-xl transition-all duration-300"
                >
                    <X size={18} className="text-white/40 group-hover:text-red-400 group-hover:rotate-90 transition-all duration-300" />
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex p-2 gap-1 bg-black/20 border-b border-white/5">
                {['PASSERELLE', 'TACTIQUE', 'LOGISTIQUE'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveCategory(tab)}
                        className={`flex-1 py-3 text-[9px] font-black uppercase tracking-[0.2em] transition-all rounded-lg flex items-center justify-center gap-2 ${
                            activeCategory === tab 
                                ? 'bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_15px_rgba(6,182,212,0.1)] border border-cyan-500/20' 
                                : 'text-white/20 hover:text-white/50 hover:bg-white/5'
                        }`}
                    >
                        <span className="relative">
                            {tab}
                            {unreadCounts[tab] > 0 && (
                                <div className="absolute -top-1.5 -right-2.5 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse" />
                            )}
                        </span>
                    </button>
                ))}
            </div>

            {/* Message List */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 chat-scroll scroll-smooth"
            >
                {loading && messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 opacity-20">
                        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Initialisation...</span>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-8">
                        <MessageSquare size={40} className="mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                            Aucun message sur ce canal.<br/>Soyez le premier à poster.
                        </p>
                    </div>
                ) : (
                    filteredMessages.map((msg) => (
                        <MessageBubble 
                            key={msg.id} 
                            message={msg} 
                            isMe={msg.author?.id === userId || msg.author?.id === parseInt(userId)} 
                        />
                    ))
                )}
            </div>

            {/* Input */}
            <ChatInput 
                onSend={sendMessage} 
                connected={connected} 
                forcedCategory={activeCategory} 
            />
        </div>
    );
};

export default TacticalChatDrawer;
