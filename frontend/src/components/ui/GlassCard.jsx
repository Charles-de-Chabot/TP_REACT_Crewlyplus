import React from 'react';

const GlassCard = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      {...props}
      className={`
        glass-card p-6 rounded-2xl 
        ${hover ? 'hover:border-white/20 hover:bg-white/5 transition-all duration-500' : ''} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
