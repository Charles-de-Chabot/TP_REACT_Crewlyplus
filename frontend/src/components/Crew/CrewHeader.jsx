import React, { useRef, useState } from 'react';
import api from '../../api/axios';
import { USER_URL } from '../../constants/apiConstant';
import IconRenderer from '../UI/IconRenderer';

const CrewHeader = ({ theme, firstname, lastname, avatar, pendingCount, onAvatarUpdate }) => {
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleAvatarClick = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/api/users/avatar', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (onAvatarUpdate) onAvatarUpdate();
        } catch (error) {
            console.error("Error uploading avatar:", error);
            const msg = error.response?.data?.message || "Erreur lors de l'envoi de l'image.";
            alert(msg);
        } finally {
            setUploading(false);
        }
    };

    const imgUser = avatar ? `${USER_URL}/${avatar}` : null;

    return (
        <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
            {/* Input File Caché */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
            />

            <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
                <div className={`w-32 h-32 rounded-[2.5rem] overflow-hidden flex items-center justify-center text-4xl font-black border-2 ${theme.secondary} ${theme.border} ${theme.primary} ${theme.glow} shadow-2xl transition-all duration-500 ${uploading ? 'opacity-50' : 'group-hover/avatar:scale-105'}`}>
                    {uploading ? (
                        <IconRenderer icon="⌛" size={40} className={theme.primary} animate />
                    ) : imgUser ? (
                        <img src={imgUser} alt={firstname} className="w-full h-full object-cover" />
                    ) : (
                        <>
                            {firstname?.[0]}{lastname?.[0]}
                        </>
                    )}
                </div>
                
                {/* Pastille de modification */}
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 bg-slate-950 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-xl transform opacity-0 group-hover/avatar:opacity-100 group-hover/avatar:scale-110 transition-all duration-300 z-20`}>
                    {uploading ? (
                        <IconRenderer icon="⌛" size={16} className={theme.primary} animate />
                    ) : (
                        <IconRenderer icon="📷" size={18} className={theme.primary} />
                    )}
                </div>

                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 rounded-[2.5rem]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Modifier</span>
                </div>
            </div>
            <div className="text-center md:text-left">
                <span className={`text-[10px] font-black uppercase tracking-[0.4em] mb-2 block ${theme.primary}`}>
                    Espace Professionnel • {theme.label}
                </span>
                <h1 className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter leading-none">
                    BONJOUR, <span className={theme.primary}>{firstname?.toUpperCase()}.</span>
                </h1>
                <p className="text-slate-500 font-bold mt-4">
                    Vous avez {pendingCount} nouvelles missions en attente.
                </p>
            </div>
        </div>
    );
};

export default CrewHeader;
