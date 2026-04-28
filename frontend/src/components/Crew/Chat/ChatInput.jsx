import React, { useState } from 'react';
import { Send, Radio, Shield, Anchor, Image as ImageIcon } from 'lucide-react';

const ChatInput = ({ onSend, connected, forcedCategory }) => {
    const [text, setText] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const categories = {
        'PASSERELLE': { icon: Anchor, color: 'text-slate-400', label: 'Passerelle' },
        'TACTIQUE': { icon: Radio, color: 'text-cyan-400', label: 'Tactique' },
        'LOGISTIQUE': { icon: Shield, color: 'text-purple-400', label: 'Logistique' },
    };

    const currentCat = categories[forcedCategory] || categories['PASSERELLE'];
    const Icon = currentCat.icon;

    const compressImage = (file) => {
        // ... (logique de compression inchangée)
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
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
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
            onSend("Photo partagée", forcedCategory, 'FILE', { imageData: compressedBase64 });
        } catch (err) {
            console.error("Erreur compression:", err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text, forcedCategory);
        setText('');
    };

    return (
        <div className="p-6 bg-slate-950/80 border-t border-white/10 backdrop-blur-3xl relative">
            {/* Input Status Line */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md bg-white/5 border border-white/10`}>
                        <Icon size={10} className={currentCat.color} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${currentCat.color}`}>
                        Transmission : {currentCat.label}
                    </span>
                </div>
                {connected && (
                    <span className="text-[8px] font-mono text-cyan-400/40 animate-pulse uppercase tracking-widest">Link.Sync.Stable</span>
                )}
            </div>
            
            <form onSubmit={handleSubmit} className="relative flex items-center gap-3">
                <label className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                    isUploading 
                        ? 'bg-cyan-500/20 border-cyan-500 animate-pulse text-cyan-400' 
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/5'
                }`}>
                    <ImageIcon size={20} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </label>

                <div className="relative flex-1">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Saisir une commande ou un message..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all duration-300"
                    />
                    {/* Inner Input Glow */}
                    <div className="absolute inset-x-4 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none" />
                </div>

                <button
                    type="submit"
                    disabled={!text.trim()}
                    className={`p-3.5 rounded-2xl transition-all duration-500 ${
                        text.trim()
                            ? 'bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.5)] scale-100 hover:rotate-6 active:scale-90' 
                            : 'bg-white/5 text-white/10 scale-95 opacity-50 grayscale'
                    }`}
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
