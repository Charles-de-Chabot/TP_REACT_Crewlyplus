import React, { useState } from 'react';
import { Send, Radio, Shield, Anchor } from 'lucide-react';

const ChatInput = ({ onSend, connected }) => {
    const [text, setText] = useState('');
    const [category, setCategory] = useState('PASSERELLE');

    const categories = [
        { id: 'PASSERELLE', icon: Anchor, color: 'text-slate-400', label: 'Général' },
        { id: 'TACTIQUE', icon: Radio, color: 'text-cyan-400', label: 'Tactique' },
        { id: 'LOGISTIQUE', icon: Shield, color: 'text-purple-400', label: 'Logistique' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || !connected) return;
        onSend(text, category);
        setText('');
    };

    return (
        <div className="p-4 bg-slate-900/80 border-t border-white/5 backdrop-blur-md">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
                {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = category === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setCategory(cat.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                isActive 
                                    ? `bg-white/10 border-white/20 ${cat.color}` 
                                    : 'bg-transparent border-transparent text-white/30 hover:text-white/60'
                            }`}
                        >
                            <Icon size={12} />
                            {cat.label}
                        </button>
                    );
                })}
            </div>
            
            <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={connected ? "Envoyer un message..." : "Connexion au Hub..."}
                    disabled={!connected}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button
                    type="submit"
                    disabled={!text.trim() || !connected}
                    className={`p-3 rounded-xl transition-all ${
                        text.trim() && connected 
                            ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-100' 
                            : 'bg-white/5 text-white/20 scale-95 opacity-50'
                    }`}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
