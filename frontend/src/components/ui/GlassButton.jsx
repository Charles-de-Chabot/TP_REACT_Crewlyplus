import React from 'react';

const GlassButton = ({ children, className = '', onClick, variant = 'primary' }) => {
  const variants = {
    primary: 'border-cyan-electric/30 text-cyan-electric hover:bg-cyan-electric/10',
    gold: 'border-gold-sanded/30 text-gold-sanded hover:bg-gold-sanded/10',
    white: 'border-white/20 text-white hover:bg-white/10'
  };

  return (
    <button 
      onClick={onClick}
      className={`
        glass-button px-6 py-2.5 rounded-full border text-sm font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default GlassButton;
