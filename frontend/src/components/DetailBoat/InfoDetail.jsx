import React from 'react'
import { 
    MdOutlineStraighten, 
    MdOutlineSwapHoriz, 
    MdOutlineAnchor, 
    MdOutlinePeople, 
    MdOutlineMeetingRoom, 
    MdOutlineBed, 
    MdOutlineEngineering, 
    MdOutlineLocalGasStation,
    MdOutlineDesignServices,
    MdOutlineDirectionsBoat,
    MdOutlineBuild
} from "react-icons/md";

const InfoDetail = ({ boatDetail }) => {
  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
        <h2 className="text-2xl font-bold text-white mb-1">À propos de ce bateau</h2>
        <span className="block text-teal-500/80 text-sm font-bold uppercase tracking-wider mb-4">
            {boatDetail?.model?.label || boatDetail?.model?.name || 'Modèle inconnu'}
        </span>
        <p className="text-slate-400 leading-relaxed whitespace-pre-line">
            {boatDetail?.description || "Aucune description disponible pour ce bateau."}
        </p>
        
        <div className="mt-12 pt-8 border-t border-white/5">
            <h3 className="text-2xl font-bold text-white mb-8">Caractéristiques techniques</h3>
            
            <div className="space-y-8">
                {/* Catégorie : Dimensions */}
                <div>
                    <h4 className="flex items-center gap-3 text-lg font-semibold text-teal-400 mb-4 border-b border-white/5 pb-2">
                        <MdOutlineDesignServices className="w-6 h-6" />
                        Dimensions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                            <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                <MdOutlineStraighten className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs font-medium mb-1">Longueur</span>
                                <span className="text-white font-semibold">{boatDetail?.boatinfo?.length ? `${boatDetail.boatinfo.length} m` : '-'}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                            <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                <MdOutlineSwapHoriz className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs font-medium mb-1">Largeur</span>
                                <span className="text-white font-semibold">{boatDetail?.boatinfo?.width ? `${boatDetail.boatinfo.width} m` : '-'}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                            <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                <MdOutlineAnchor className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs font-medium mb-1">Tirant d'eau</span>
                                <span className="text-white font-semibold">{boatDetail?.boatinfo?.draught ? `${boatDetail.boatinfo.draught} m` : '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catégorie : Aménagement */}
                <div>
                    <h4 className="flex items-center gap-3 text-lg font-semibold text-teal-400 mb-4 border-b border-white/5 pb-2">
                        <MdOutlineDirectionsBoat className="w-6 h-6" />
                        Aménagement & Capacité
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                            <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                <MdOutlinePeople className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs font-medium mb-1">Capacité max.</span>
                                <span className="text-white font-semibold">{boatDetail?.boatinfo?.maxUser ? `${boatDetail.boatinfo.maxUser} pers.` : '-'}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                            <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                <MdOutlineMeetingRoom className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs font-medium mb-1">Cabines</span>
                                <span className="text-white font-semibold">{boatDetail?.boatinfo?.cabineNumber || '-'}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                            <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                <MdOutlineBed className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs font-medium mb-1">Couchages</span>
                                <span className="text-white font-semibold">{boatDetail?.boatinfo?.bedsNumber || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Catégorie : Motorisation */}
                <div>
                    <h4 className="flex items-center gap-3 text-lg font-semibold text-teal-400 mb-4 border-b border-white/5 pb-2">
                        <MdOutlineBuild className="w-6 h-6" />
                        Motorisation
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                            <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                <MdOutlineEngineering className="w-6 h-6" />
                            </div>
                            <div className="min-w-0">
                                <span className="block text-slate-500 text-xs font-medium mb-1">Moteur</span>
                                <span className="text-white font-semibold block truncate" title={boatDetail?.boatinfo?.powerEngine}>{boatDetail?.boatinfo?.powerEngine || '-'}</span>
                            </div>
                        </div>
                        <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                            <div className="bg-slate-900/50 p-3 rounded-xl text-teal-500 border border-white/5 shrink-0">
                                <MdOutlineLocalGasStation className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="block text-slate-500 text-xs font-medium mb-1">Carburant</span>
                                <span className="text-white font-semibold">{boatDetail?.boatinfo?.fuel || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default InfoDetail