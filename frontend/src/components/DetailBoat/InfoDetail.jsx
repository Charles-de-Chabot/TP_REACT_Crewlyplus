import React from 'react'
import IconRenderer from '../UI/IconRenderer';

const InfoDetail = ({ boatDetail }) => {
  return (
    <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 border-t-white/10 rounded-2xl p-10 md:p-14 shadow-2xl shadow-black/50">
        <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">À propos de ce navire</h2>
        <span className="block text-teal-500/80 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            {boatDetail?.model?.label || boatDetail?.model?.name || 'Modèle inconnu'}
        </span>
        <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line font-medium">
            {boatDetail?.description || "Aucune description technique disponible pour ce bateau."}
        </p>
        
        <div className="mt-16 pt-10 border-t border-white/5">
            <h3 className="text-xl font-black text-white mb-10 italic uppercase tracking-tighter">Caractéristiques techniques</h3>
            
            <div className="space-y-12">
                {/* Catégorie : Dimensions */}
                <div>
                    <h4 className="flex items-center gap-3 text-[10px] font-black text-teal-500 mb-6 uppercase tracking-[0.2em] border-l-2 border-teal-500 pl-4">
                        Dimensions de la coque
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <TechnicalCard label="Longueur" value={boatDetail?.boatinfo?.length} unit="m" icon="📏" />
                        <TechnicalCard label="Largeur" value={boatDetail?.boatinfo?.width} unit="m" icon="↔️" />
                        <TechnicalCard label="Tirant d'eau" value={boatDetail?.boatinfo?.draught} unit="m" icon="⚓" />
                    </div>
                </div>

                {/* Catégorie : Aménagement */}
                <div>
                    <h4 className="flex items-center gap-3 text-[10px] font-black text-teal-500 mb-6 uppercase tracking-[0.2em] border-l-2 border-teal-500 pl-4">
                        Aménagement & Logistique
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        <TechnicalCard label="Capacité max." value={boatDetail?.boatinfo?.maxUser} unit="pers." icon="👥" />
                        <TechnicalCard label="Cabines" value={boatDetail?.boatinfo?.cabineNumber} unit="" icon="🚪" />
                        <TechnicalCard label="Couchages" value={boatDetail?.boatinfo?.bedsNumber} unit="" icon="🛏️" />
                    </div>
                </div>

                {/* Catégorie : Motorisation */}
                <div>
                    <h4 className="flex items-center gap-3 text-[10px] font-black text-teal-500 mb-6 uppercase tracking-[0.2em] border-l-2 border-teal-500 pl-4">
                        Propulsion technique
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <TechnicalCard label="Moteur" value={boatDetail?.boatinfo?.powerEngine} unit="" icon="⚙️" fullWidth />
                        <TechnicalCard label="Carburant" value={boatDetail?.boatinfo?.fuel} unit="" icon="⛽" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

const TechnicalCard = ({ label, value, unit, icon, fullWidth }) => (
    <div className={`bg-slate-950/20 rounded-xl p-5 border border-white/5 border-t-white/10 flex items-center gap-5 hover:bg-slate-900/40 hover:border-white/10 transition-all group ${fullWidth ? 'col-span-full md:col-span-2' : ''}`}>
        <div className="bg-slate-900 border border-white/5 p-3 rounded-lg text-slate-500 group-hover:text-teal-400 transition-colors shrink-0">
            <IconRenderer icon={icon} size={20} />
        </div>
        <div className="min-w-0">
            <span className="block text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</span>
            <span className="text-white font-black font-mono text-base tracking-tighter truncate block">
                {value || '-'} <span className="text-[10px] font-sans font-bold text-slate-600 ml-1">{unit}</span>
            </span>
        </div>
    </div>
);

export default InfoDetail