import React from 'react';
import { User } from 'lucide-react';
import { USER_URL } from '../../constants/apiConstant';

const BoatDeck = ({ members = [] }) => {
    // Coordonnées par défaut si les données API sont manquantes (fallback)
    const renderMember = (membership) => {
        if (!membership.position) return null;

        let { x, y, label } = membership.position;
        
        // Position par défaut pour l'équipier si non définie en BDD
        if (label === 'Équipier' && (!x || !y)) {
            x = 50;
            y = 70;
        }

        const initials = membership.user?.firstname?.charAt(0) || 'U';

        return (
            <div 
                key={membership.id}
                className="absolute transition-all duration-700 ease-in-out group"
                style={{ 
                    left: `${x}%`, 
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                    <div className="bg-slate-900 border border-cyan-500/50 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap shadow-xl">
                        <p className="font-black uppercase tracking-tighter">{membership.user?.firstname} {membership.user?.lastname}</p>
                        <p className="text-cyan-400 text-[8px] font-bold">{label}</p>
                    </div>
                    <div className="w-2 h-2 bg-slate-900 border-r border-b border-cyan-500/50 rotate-45 mx-auto -mt-1"></div>
                </div>

                {/* Avatar */}
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-cyan-500/50 flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:scale-125 group-hover:border-cyan-400 transition-all cursor-help overflow-hidden">
                        {membership.user?.media?.[0]?.media_path ? (
                            <img 
                                src={`${USER_URL}/${membership.user.media[0].media_path}`} 
                                alt={membership.user.firstname} 
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <span className="italic">{initials}</span>
                        )}
                    </div>
                    {/* Role Indicator */}
                    {membership.role === 'LEADER' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border border-slate-950 shadow-lg">
                            <span className="text-[8px]">⭐</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 bg-[#050810]/30 rounded-3xl overflow-hidden border border-white/5">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#06b6d4 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }}></div>

            <div className="relative h-full w-full max-w-[500px] py-4">
                {/* The Boat Hull (SVG) */}
                <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-[0_0_40px_rgba(6,182,212,0.15)] preserve-3d" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="hullGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#0891b2" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                    
                    {/* Hull Shape */}
                    <path 
                        d="M 50 5 Q 95 60 90 180 L 10 180 Q 5 60 50 5 Z" 
                        fill="url(#hullGradient)" 
                        stroke="#06b6d4" 
                        strokeWidth="1"
                        strokeDasharray="4 2"
                        className="opacity-40"
                    />

                    {/* Internal Structures (Deck lines) */}
                    <line x1="50" y1="5" x2="50" y2="180" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2" opacity="0.1" />
                    <line x1="15" y1="140" x2="85" y2="140" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2" opacity="0.1" />
                    <line x1="25" y1="100" x2="75" y2="100" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2" opacity="0.1" />
                    <line x1="40" y1="50" x2="60" y2="50" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2" opacity="0.1" />

                    {/* Compass/Target marks */}
                    <circle cx="50" cy="100" r="40" fill="none" stroke="#06b6d4" strokeWidth="0.1" strokeDasharray="1" opacity="0.2" />
                </svg>

                {/* Member Avatars (Positioned relative to the container) */}
                {/* We map the 0-100 X/Y from the Position entity to the 0-100% of the container */}
                {/* Note: The SVG is 100x200, but the container is aspect 1/2, so % works fine if we assume Y is 0-100% of height */}
                <div className="absolute inset-0">
                    {members.map(renderMember)}
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 text-[8px] font-black uppercase tracking-widest text-white/20 space-y-1">
                <p>Radar v2.4 // Hull: Racing Monohull</p>
                <p>Status: Synchronized with Crewly Engine</p>
            </div>
        </div>
    );
};

export default BoatDeck;
