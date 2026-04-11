import React from 'react'
import { USER_URL } from '../../constants/apiConstant';

const HeaderDetail = ({ data }) => {
    if (!data) return null;

    // Déduction du nom à afficher (nickname en priorité, sinon prénom + nom)
    const displayName = data.nickname 
        ? data.nickname 
        : [data.firstname, data.lastname].filter(Boolean).join(' ') || 'Utilisateur';

    // Génération des initiales si pas d'image
    const getInitials = () => {
        if (data.firstname && data.lastname) {
            return `${data.firstname[0]}${data.lastname[0]}`.toUpperCase();
        } else if (data.nickname) {
            return data.nickname.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    // Récupération de l'image (logique identique aux bateaux)
    const imgUser = data?.media?.[0]?.media_path ? `${USER_URL}/${data.media[0].media_path}` : null;

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl shadow-black/30 animate-slideup">
        {/* Avatar / Image de profil */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-4 border-teal-500/30 bg-slate-800 flex items-center justify-center shadow-lg shadow-teal-500/10">
            {imgUser ? (
                <img src={imgUser} alt={displayName} className="w-full h-full object-cover" />
            ) : (
                <span className="text-3xl sm:text-4xl font-bold text-teal-400 tracking-wider">
                    {getInitials()}
                </span>
            )}
        </div>

        {/* Informations utilisateur */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                {displayName}
            </h1>
            {data.email && (
                <p className="text-slate-400 text-sm sm:text-base font-medium">
                    {data.email}
                </p>
            )}
        </div>
    </div>
  )
}

export default HeaderDetail