import React from 'react';
import { Crown } from 'lucide-react';

const PremiumBadge = ({ className = '' }) => {
  return (
    <div className={`
      flex items-center gap-1.5 px-3 py-1 rounded-full 
      bg-gold-sanded/10 border border-gold-sanded/30 
      text-gold-sanded text-[10px] font-bold uppercase tracking-widest
      shadow-[0_0_15px_rgba(197,160,89,0.1)]
      ${className}
    `}>
      <Crown size={12} />
      Premium
    </div>
  );
};

export default PremiumBadge;
