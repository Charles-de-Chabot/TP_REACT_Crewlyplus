import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { USER_URL, TEAM_URL } from '../../constants/apiConstant';
import IconRenderer from '../UI/IconRenderer';

const HeaderDetail = ({ data, onEdit, onAvatarUpdate }) => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);

    if (!data) return null;

    const displayName = data.nickname 
        ? data.nickname 
        : [data.firstname, data.lastname].filter(Boolean).join(' ') || 'Utilisateur';

    const getInitials = () => {
        if (data.firstname && data.lastname) {
            return `${data.firstname[0]}${data.lastname[0]}`.toUpperCase();
        } else if (data.nickname) {
            return data.nickname.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    const imgUser = data?.media?.[0]?.media_path ? `${USER_URL}/${data.media[0].media_path}` : null;
    const team = data?.currentTeam;
    const teamEmblem = team?.emblem ? `${TEAM_URL}/${team.emblem}` : null;

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

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-black/30 animate-slideup relative overflow-hidden group/header">
        {/* Decorative Background for Team */}
        {team && (
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent-role/5 rounded-full blur-3xl group-hover/header:bg-accent-role/10 transition-all duration-700"></div>
        )}

        {/* Input File Caché */}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
        />

        {/* Avatar / Image de profil */}
        <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
            <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-4 border-teal-500/30 bg-slate-800 flex items-center justify-center shadow-lg shadow-teal-500/10 transition-all duration-500 ${uploading ? 'opacity-50' : 'group-hover/avatar:scale-105'}`}>
                {uploading ? (
                    <IconRenderer icon="⌛" size={40} className="text-teal-400" animate />
                ) : imgUser ? (
                    <img src={imgUser} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-3xl sm:text-4xl font-bold text-teal-400 tracking-wider">
                        {getInitials()}
                    </span>
                )}
            </div>
            
            {/* Pastille de modification */}
            <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-teal-500 rounded-full border-4 border-slate-950 flex items-center justify-center text-slate-950 shadow-xl transform translate-x-1 translate-y-1 opacity-0 group-hover/avatar:opacity-100 group-hover/avatar:scale-110 transition-all duration-300 z-20">
                {uploading ? <IconRenderer icon="⌛" size={16} animate /> : <IconRenderer icon="📷" size={18} />}
            </div>

            {/* Overlay au survol */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-white">Modifier</span>
            </div>
        </div>

        {/* Informations utilisateur */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                {displayName}
            </h1>
            {data.email && (
                <p className="text-slate-400 text-sm sm:text-base font-medium">
                    {data.email}
                </p>
            )}
        </div>

        {/* Badge d'Équipe (Côté droit) */}
        {team && (
            <div 
                onClick={() => navigate('/my-team')}
                className="flex-shrink-0 min-w-[200px] flex items-center gap-5 bg-white/5 border border-white/5 rounded-2xl p-4 pr-8 backdrop-blur-sm cursor-pointer transition-all hover:bg-white/10 hover:border-accent-role/30 group/team hover:scale-105 active:scale-95 shadow-lg"
            >
                <div className="w-14 h-14 rounded-xl bg-slate-950/50 border border-white/10 overflow-hidden flex items-center justify-center group-hover/team:border-accent-role/50 transition-all shadow-inner">
                    {teamEmblem ? (
                        <img src={teamEmblem} alt={team.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-accent-role font-black text-xl">{team.name?.charAt(0)}</span>
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black text-accent-role uppercase tracking-[0.3em] mb-1">Ma Team</p>
                    <h4 className="text-white text-lg font-black uppercase tracking-tighter italic leading-none mb-1.5">{team.name}</h4>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 bg-accent-role/10 border border-accent-role/20 rounded text-accent-role">
                        <span className="text-[9px] font-black uppercase tracking-widest">{data.position || 'Équipier'}</span>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default HeaderDetail