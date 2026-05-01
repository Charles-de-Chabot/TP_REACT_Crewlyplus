import React from 'react'
import IconRenderer from '../UI/IconRenderer';

const InfoDetail = ({ boatDetail }) => {
  return (
    <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 border-t-white/10 rounded-2xl p-10 md:p-14 shadow-2xl shadow-black/50">
        <h2 className="text-3xl font-black text-white mb-2 italic uppercase tracking-tighter">À propos de ce navire</h2>
        <span className="block text-accent-role/80 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            {boatDetail?.model?.label || boatDetail?.model?.name || 'Modèle inconnu'}
        </span>
        <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line font-medium">
            {boatDetail?.description || "Aucune description technique disponible pour ce bateau."}
        </p>
        
        <div className="mt-12 pt-8 border-t border-white/5">
            <h3 className="text-xl font-black text-white mb-8 italic uppercase tracking-tighter">Caractéristiques techniques</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {/* Catégorie : Dimensions */}
                <div>
                    <h4 className="text-[10px] font-black text-accent-role mb-4 uppercase tracking-[0.2em]">Dimensions</h4>
                    <div className="space-y-3">
                        <SpecItem label="Longueur" value={boatDetail?.boatinfo?.length} unit="m" icon="length" />
                        <SpecItem label="Largeur" value={boatDetail?.boatinfo?.width} unit="m" icon="width" />
                        <SpecItem label="Tirant d'eau" value={boatDetail?.boatinfo?.draught} unit="m" icon="⚓" />
                    </div>
                </div>

                {/* Catégorie : Aménagement */}
                <div>
                    <h4 className="text-[10px] font-black text-accent-role mb-4 uppercase tracking-[0.2em]">Aménagement</h4>
                    <div className="space-y-3">
                        <SpecItem label="Capacité" value={boatDetail?.boatinfo?.maxUser} unit="pers." icon="👥" />
                        <SpecItem label="Cabines" value={boatDetail?.boatinfo?.cabineNumber} unit="" icon="🚪" />
                        <SpecItem label="Couchages" value={boatDetail?.boatinfo?.bedsNumber} unit="" icon="bed" />
                    </div>
                </div>

                {/* Catégorie : Propulsion */}
                <div className="md:col-span-2">
                    <h4 className="text-[10px] font-black text-accent-role mb-4 uppercase tracking-[0.2em]">Propulsion</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
                        <SpecItem label="Motorisation" value={boatDetail?.boatinfo?.powerEngine} unit="" icon="⚙️" />
                        <SpecItem label="Carburant" value={boatDetail?.boatinfo?.fuel} unit="" icon="fuel" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

const SpecItem = ({ label, value, unit, icon }) => (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.03] group transition-colors hover:border-white/10">
        <div className="flex items-center gap-3">
            <div className="text-slate-600 group-hover:text-accent-role transition-colors">
                <IconRenderer icon={icon} size={14} />
            </div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-white font-black font-mono text-sm tracking-tighter">
            {value || '-'} <span className="text-[9px] font-sans font-bold text-slate-600 ml-0.5">{unit}</span>
        </span>
    </div>
);

export default InfoDetail;