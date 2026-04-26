import React from 'react'
import IconRenderer from '../UI/IconRenderer';

const AddressDetail = ({ address }) => {
  // S'il n'y a pas d'adresse, on n'affiche pas le bloc
  if (!address) return null;

  // Utilisation des clés exactes de l'API
  const streetLine = [address.houseNumber, address.streetName].filter(Boolean).join(' ');
  const zipCodeLine = address.postcode;
  const cityLine = address.city;
  const countryLine = address.country;

  return (
    <div className="bg-slate-950/60 backdrop-blur-md border border-white/5 border-t-white/10 rounded-2xl p-8 shadow-2xl shadow-black/50 group transition-all duration-500 hover:border-accent-role/20">
        <h3 className="flex items-center gap-4 text-sm font-black text-white mb-8 italic uppercase tracking-tighter border-b border-white/5 pb-4">
            <IconRenderer icon="📍" size={20} className="text-accent-role" />
            Port d'attache
        </h3>
        
        <div className="space-y-6">
            {streetLine && (
                <div className="flex items-start gap-4 group/item">
                    <div className="bg-slate-950 p-2 rounded-lg border border-white/5 text-slate-600 group-hover/item:text-accent-role transition-colors">
                        <IconRenderer icon="home" size={16} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Rue / Quai</p>
                        <p className="text-white text-sm font-bold">{streetLine}</p>
                    </div>
                </div>
            )}
            
            {(zipCodeLine || cityLine) && (
                <div className="flex items-start gap-4 group/item">
                    <div className="bg-slate-950 p-2 rounded-lg border border-white/5 text-slate-600 group-hover/item:text-accent-role transition-colors">
                        <IconRenderer icon="📍" size={16} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Localisation</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-accent-role font-mono text-sm font-black tracking-tighter">{zipCodeLine}</span>
                            <span className="text-white text-sm font-bold uppercase tracking-tight">{cityLine}</span>
                        </div>
                    </div>
                </div>
            )}
            
            {countryLine && (
                <div className="flex items-start gap-4 group/item">
                    <div className="bg-slate-950 p-2 rounded-lg border border-white/5 text-slate-600 group-hover/item:text-accent-role transition-colors">
                        <IconRenderer icon="globe" size={16} />
                    </div>
                    <div>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Région / Pays</p>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{countryLine}</p>
                    </div>
                </div>
            )}
        </div>
    </div>
  )
}

export default AddressDetail