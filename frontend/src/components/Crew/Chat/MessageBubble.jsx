import React, { memo } from 'react';
import { USER_URL } from '../../../constants/apiConstant';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { BarChart2, Image as ImageIcon, Star } from 'lucide-react';

const MessageBubble = memo(({ message, isMe }) => {
    const { author, content, createdAt, category, type, metadata } = message;
    
    // Debug pour voir les infos reçues du serveur
    if (isMe) {
        console.log("👤 Infos auteur (Moi):", { 
            name: author?.firstname, 
            pos: author?.tacticalPosition, 
            skipper: author?.isSkipper 
        });
    }
    // Rendu spécial pour les statistiques partagées
    const renderActionContent = () => {
        if (type === 'ACTION' && metadata?.chartData) {
            return (
                <div className="mt-2 p-3 bg-slate-900/50 rounded-xl border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <BarChart2 size={14} className="text-cyan-500" />
                        <span className="text-[10px] font-black uppercase text-white/60">Statistiques de Performance</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" 
                            style={{ width: `${metadata.score || 70}%` }}
                        ></div>
                    </div>
                    <p className="text-[10px] text-white/40 mt-2 italic">"{content}"</p>
                </div>
            );
        }

        if (type === 'FILE' && metadata?.imageData) {
            return (
                <div className="mt-2">
                    <img 
                        src={metadata.imageData} 
                        alt="Shared" 
                        className="rounded-xl border border-white/10 max-h-60 w-full object-cover cursor-zoom-in" 
                    />
                </div>
            );
        }

        return <div className="text-sm">{content}</div>;
    };
    
    const positionColors = {
        'Skipper': 'border-yellow-400 text-yellow-400 bg-yellow-400/5',
        'Barreur': 'border-indigo-500 text-indigo-400 bg-indigo-500/5',
        'Tacticien': 'border-fuchsia-500 text-fuchsia-400 bg-fuchsia-500/5',
        'Régleur GV': 'border-lime-500 text-lime-400 bg-lime-500/5',
        'Régleur Bâbord': 'border-emerald-500 text-emerald-400 bg-emerald-500/5',
        'Régleur Tribord': 'border-teal-500 text-teal-400 bg-teal-500/5',
        'Piano': 'border-orange-500 text-orange-400 bg-orange-500/5',
        'Numéro 1': 'border-pink-500 text-pink-400 bg-pink-500/5',
        'Numéro 2 (Mât)': 'border-rose-500 text-rose-400 bg-rose-500/5',
    };

    const getPositionStyle = () => {
        return positionColors[author?.tacticalPosition] || 'border-white/20 text-white/40 bg-white/5';
    };

    return (
        <div className={`flex flex-col mb-6 ${isMe ? 'items-end' : 'items-start'} group animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            {/* Meta Info */}
            <div className={`flex items-center gap-3 mb-1.5 px-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                    {isMe ? 'Vous' : `${author?.firstname} ${author?.lastname || ''}`}
                </span>
                <span className={`text-[8px] font-black px-2 py-0.5 border rounded-md uppercase tracking-tighter flex items-center gap-1 transition-all duration-500 ${getPositionStyle()} ${
                    author?.isSkipper ? 'shadow-[0_0_10px_rgba(234,179,8,0.15)] border-yellow-500/30' : ''
                }`}>
                    {author?.isSkipper && <Star size={10} fill="currentColor" className="text-yellow-400 animate-pulse" />}
                    {author?.tacticalPosition || 'Équipier'}
                </span>
                <span className="text-[9px] font-mono text-white/20">
                    {format(new Date(createdAt), 'HH:mm:ss', { locale: fr })}
                </span>
            </div>

            <div className={`flex items-start gap-3 max-w-[90%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar with Glow */}
                <div className={`h-10 w-10 rounded-2xl bg-slate-900 border overflow-hidden flex-shrink-0 transition-all duration-300 ${
                    isMe ? 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-white/10'
                }`}>
                    {author?.media?.[0]?.media_path ? (
                        <img 
                            src={`${USER_URL}/${author.media[0].media_path}`} 
                            alt={author.firstname} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm font-black text-white/30 bg-gradient-to-br from-slate-800 to-slate-900">
                            {author?.firstname?.charAt(0) || 'U'}
                        </div>
                    )}
                </div>

                {/* Message Box */}
                <div className={`relative px-5 py-4 rounded-3xl border transition-all duration-300 ${
                    isMe 
                        ? 'bg-cyan-500/5 border-cyan-500/30 text-white rounded-tr-none hover:bg-cyan-500/10' 
                        : 'bg-white/5 border-white/10 text-white/90 rounded-tl-none hover:bg-white/10'
                }`}>
                    {/* Corner Tech Accent */}
                    <div className={`absolute top-0 ${isMe ? 'right-0' : 'left-0'} w-3 h-3 border-t-2 border-l-2 ${isMe ? 'border-cyan-500/40' : 'border-white/20'} -translate-x-[1px] -translate-y-[1px]`} />
                    
                    {renderActionContent()}

                    {isMe && (
                        <div className="absolute -bottom-5 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-[7px] font-black text-cyan-500/40 uppercase tracking-[0.2em]">Data.Link.Confirmed</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default MessageBubble;
