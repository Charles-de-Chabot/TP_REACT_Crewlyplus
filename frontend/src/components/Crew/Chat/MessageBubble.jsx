import React, { memo } from 'react';
import { USER_URL } from '../../../constants/apiConstant';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessageBubble = memo(({ message, isMe }) => {
    const { author, content, createdAt, category, type } = message;
    
    // Déterminer la couleur selon la catégorie
    const categoryColors = {
        'TACTIQUE': 'border-cyan-500 text-cyan-400',
        'LOGISTIQUE': 'border-purple-500 text-purple-400',
        'PASSERELLE': 'border-slate-500 text-slate-400'
    };

    return (
        <div className={`flex flex-col mb-4 ${isMe ? 'items-end' : 'items-start'}`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-slate-900 border border-white/10 overflow-hidden flex-shrink-0">
                    {author?.media?.[0]?.media_path ? (
                        <img 
                            src={`${USER_URL}/${author.media[0].media_path}`} 
                            alt={author.firstname} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/40">
                            {author?.firstname?.charAt(0) || 'U'}
                        </div>
                    )}
                </div>

                {/* Bulle */}
                <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[10px] font-bold text-white/60">{author?.firstname}</span>
                        <span className={`text-[8px] font-black border px-1.5 rounded-full ${categoryColors[category] || categoryColors.PASSERELLE}`}>
                            {category}
                        </span>
                    </div>
                    
                    <div className={`px-4 py-2.5 rounded-2xl text-sm transition-all ${
                        isMe 
                            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-50 rounded-tr-none' 
                            : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}>
                        {content}
                    </div>
                    
                    <span className="text-[9px] text-white/20 mt-1 px-1">
                        {format(new Date(createdAt), 'HH:mm', { locale: fr })}
                    </span>
                </div>
            </div>
        </div>
    );
});

export default MessageBubble;
