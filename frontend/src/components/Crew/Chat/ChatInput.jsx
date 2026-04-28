import React, { useState } from 'react';
import { Send, Radio, Shield, Anchor } from 'lucide-react';

const ChatInput = ({ onSend, connected }) => {
    const [text, setText] = useState('');
    const [category, setCategory] = useState('PASSERELLE');

    const [isUploading, setIsUploading] = useState(false);

    const categories = [
        { id: 'PASSERELLE', icon: Anchor, color: 'text-slate-400', label: 'Général' },
        { id: 'TACTIQUE', icon: Radio, color: 'text-cyan-400', label: 'Tactique' },
        { id: 'LOGISTIQUE', icon: Shield, color: 'text-purple-400', label: 'Logistique' },
    ];

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 800;
                    const scale = MAX_WIDTH / img.width;
                    canvas.width = MAX_WIDTH;
                    canvas.height = img.height * scale;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7)); // Compression à 70%
                };
            };
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const compressedBase64 = await compressImage(file);
            // Pour simplifier, on envoie le base64 dans le content pour le type FILE
            // Dans une version de prod, on ferait un vrai upload vers un service de stockage
            onSend("Photo partagée", category, 'FILE', { imageData: compressedBase64 });
        } catch (err) {
            console.error("Erreur compression:", err);
        } finally {
            setIsUploading(false);
        }
    };

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
                <label className={`p-3 rounded-xl border border-white/10 bg-white/5 text-white/40 hover:text-cyan-500 hover:border-cyan-500/50 cursor-pointer transition-all ${isUploading ? 'animate-pulse' : ''}`}>
                    <ImageIcon size={18} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>

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
