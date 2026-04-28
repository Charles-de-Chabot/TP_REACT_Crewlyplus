import React, { useEffect, useRef, useState } from 'react';
import { X, Radio, MessageSquare, Activity, Settings } from 'lucide-react';
import { useChat } from '../../../contexts/ChatContext';
import { useAuthContext } from '../../../contexts/authContext';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const TacticalChatDrawer = ({ isOpen, onClose }) => {
    const { messages, sendMessage, connected, loading } = useChat();
    const { userId } = useAuthContext();
    const scrollRef = useRef(null);
    const [activeTab, setActiveTab] = useState('ALL');

    // Auto-scroll au dernier message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    if (!isOpen) return null;

    const filteredMessages = activeTab === 'ALL' 
        ? messages 
        : messages.filter(m => m.category === activeTab);

    return (
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[400px] bg-slate-950/95 border-l border-white/10 backdrop-blur-2xl z-[100] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Radio size={20} className={connected ? 'text-cyan-500 animate-pulse' : 'text-slate-500'} />
                        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div>
                        <h2 className="text-xs font-black text-white uppercase tracking-widest">Canal Tactique</h2>
                        <p className="text-[9px] text-white/40 uppercase font-bold">
                            {connected ? 'Système en ligne' : 'Déconnexion...'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 bg-slate-950/50">
                {['ALL', 'PASSERELLE', 'TACTIQUE', 'LOGISTIQUE'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-[9px] font-black uppercase tracking-tighter transition-all relative ${
                            activeTab === tab ? 'text-cyan-500' : 'text-white/30 hover:text-white/60'
                        }`}
                    >
                        {tab === 'ALL' ? 'Tous' : tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Message List */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar scroll-smooth h-[calc(100vh-220px)]"
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
            <ChatInput onSend={sendMessage} connected={connected} />
        </div>
    );
};

export default TacticalChatDrawer;
