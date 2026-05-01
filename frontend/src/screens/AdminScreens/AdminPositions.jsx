import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import IconRenderer from '../../components/UI/IconRenderer';
import AdminPageHeader from '../../components/Admin/AdminPageHeader';
import { toast } from 'sonner';

const AdminPositions = () => {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPosition, setSelectedPosition] = useState(null);
    const containerRef = useRef(null);

    const fetchPositions = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/positions');
            setPositions(response.data['member'] || response.data['hydra:member'] || []);
        } catch (error) {
            console.error("Error fetching positions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    const handleContainerClick = (e) => {
        if (!selectedPosition) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        updatePosition(selectedPosition.id, x, y);
    };

    const updatePosition = async (id, x, y) => {
        try {
            await api.patch(`/api/positions/${id}`, 
                { x, y },
                { headers: { 'Content-Type': 'application/merge-patch+json' } }
            );
            setPositions(positions.map(p => p.id === id ? { ...p, x, y } : p));
            toast.success("Coordonnées tactiques mises à jour");
        } catch (error) {
            console.error("Error updating position:", error);
            toast.error("Erreur lors de la mise à jour");
        }
    };

    return (
        <div className="space-y-8 h-full flex flex-col">
            <AdminPageHeader 
                title="Éditeur"
                highlight="Tactique"
                subtitle="Placez les rôles sur le plan de pont pour la vue stratégique."
            />

            <div className="flex-1 grid grid-cols-1 xl:grid-cols-4 gap-8 min-h-[600px]">
                {/* Liste des postes */}
                <div className="xl:col-span-1 space-y-4">
                    <div className="bg-slate-900/40 border border-white/5 rounded-[2rem] p-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
                            <IconRenderer icon="positions" size={14} />
                            Postes Disponibles
                        </h3>
                        <div className="space-y-2">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-14 bg-white/5 rounded-2xl animate-pulse" />
                                ))
                            ) : positions.map((pos) => (
                                <button 
                                    key={pos.id}
                                    onClick={() => setSelectedPosition(selectedPosition?.id === pos.id ? null : pos)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                                        selectedPosition?.id === pos.id 
                                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                                        : 'bg-white/5 border-transparent text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    <span className="text-xs font-black uppercase tracking-widest">{pos.label}</span>
                                    <span className="text-[10px] font-bold opacity-50">X:{Math.round(pos.x)} Y:{Math.round(pos.y)}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-[2rem]">
                        <p className="text-[10px] text-cyan-400/70 font-bold leading-relaxed italic">
                            <span className="text-cyan-400 font-black">MODE D'EMPLOI :</span> Sélectionnez un poste dans la liste, puis cliquez sur le plan du bateau pour définir sa position tactique.
                        </p>
                    </div>
                </div>

                {/* Zone d'édition visuelle */}
                <div className="xl:col-span-3 bg-slate-900/40 border border-white/5 rounded-[3rem] p-12 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    
                    <div 
                        ref={containerRef}
                        onClick={handleContainerClick}
                        className={`relative w-full max-w-sm aspect-[1/2] bg-slate-950/50 rounded-3xl border border-white/5 shadow-2xl flex items-center justify-center cursor-crosshair transition-all duration-500 ${selectedPosition ? 'ring-2 ring-cyan-500/20' : ''}`}
                    >
                        {/* Background Hull SVG */}
                        <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none">
                            <svg viewBox="0 0 100 200" className="w-full h-full drop-shadow-[0_0_40px_rgba(6,182,212,0.15)]" preserveAspectRatio="xMidYMid meet">
                                <defs>
                                    <linearGradient id="hullGradientAdmin" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#0891b2" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#0891b2" stopOpacity="0.05" />
                                    </linearGradient>
                                </defs>
                                <path 
                                    d="M 50 5 Q 95 60 90 180 L 10 180 Q 5 60 50 5 Z" 
                                    fill="url(#hullGradientAdmin)" 
                                    stroke="#06b6d4" 
                                    strokeWidth="1"
                                    strokeDasharray="4 2"
                                    className="opacity-40"
                                />
                                <line x1="50" y1="5" x2="50" y2="180" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2" opacity="0.1" />
                                <line x1="15" y1="140" x2="85" y2="140" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2" opacity="0.1" />
                                <line x1="25" y1="100" x2="75" y2="100" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2" opacity="0.1" />
                                <line x1="40" y1="50" x2="60" y2="50" stroke="#ffffff" strokeWidth="0.2" strokeDasharray="2" opacity="0.1" />
                            </svg>
                        </div>

                        {/* Markers */}
                        {positions.map((pos) => (
                            <div 
                                key={pos.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${selectedPosition?.id === pos.id ? 'z-20 scale-125' : 'z-10'}`}
                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                            >
                                <div className="relative group/marker">
                                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shadow-lg font-black text-xs italic ${
                                        selectedPosition?.id === pos.id 
                                        ? 'bg-cyan-500 border-white text-slate-950 scale-110' 
                                        : 'bg-slate-900 border-cyan-500/50 text-cyan-400 group-hover/marker:border-cyan-400'
                                    }`}>
                                        {pos.label?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2 py-1 bg-slate-950 border border-white/10 rounded-lg whitespace-nowrap opacity-0 group-hover/marker:opacity-100 transition-opacity pointer-events-none">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-white">{pos.label}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Active Selection Indicator */}
                        {selectedPosition && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-cyan-500 text-slate-950 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce">
                                Placez : {selectedPosition.label}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPositions;
