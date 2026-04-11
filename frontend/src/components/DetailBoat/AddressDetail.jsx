import React from 'react'
import { MdOutlineLocationOn, MdOutlineHome, MdOutlineLocationCity, MdOutlinePublic } from "react-icons/md";

const AddressDetail = ({ address }) => {
  // S'il n'y a pas d'adresse, on n'affiche pas le bloc
  if (!address) return null;

  // Utilisation des clés exactes de l'API
  const streetLine = [address.houseNumber, address.streetName].filter(Boolean).join(' ');
  const zipCodeLine = address.postcode;
  const cityLine = address.city;
  const countryLine = address.country; // Laissé au cas où, ou à ignorer s'il n'y a pas de pays

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/30">
        <h3 className="flex items-center gap-3 text-lg font-bold text-white mb-4 border-b border-white/5 pb-3">
            <MdOutlineLocationOn className="w-6 h-6 text-teal-400" />
            Emplacement du bateau
        </h3>
        <div className="flex flex-col gap-4 text-slate-300">
            {streetLine && (
                <div className="flex items-center gap-3">
                    <MdOutlineHome className="w-5 h-5 text-slate-500 shrink-0" />
                    <span className="text-base">{streetLine}</span>
                </div>
            )}
            
            {(zipCodeLine || cityLine) && (
                <div className="flex items-center gap-3">
                    <MdOutlineLocationCity className="w-5 h-5 text-slate-500 shrink-0" />
                    <div>
                        {zipCodeLine && <span className="mr-2">{zipCodeLine}</span>}
                        {cityLine && <span className="font-semibold text-white">{cityLine}</span>}
                    </div>
                </div>
            )}
            
            {countryLine && (
                <div className="flex items-center gap-3">
                    <MdOutlinePublic className="w-5 h-5 text-slate-500 shrink-0" />
                    <span className="text-slate-400 text-sm">{countryLine}</span>
                </div>
            )}
        </div>
    </div>
  )
}

export default AddressDetail