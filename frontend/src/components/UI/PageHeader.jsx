import React from 'react';

const PageHeader = ({ title, subtitle, description, children }) => {
    return (
        <div className="px-8 py-4 border-b border-white/5 bg-[#050810] flex items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
                <h1 className="text-xl md:text-2xl font-heading font-bold text-white">
                    {title} <span className="text-cyan-electric">{subtitle}</span>
                </h1>
                <div className="hidden sm:block h-4 w-[1px] bg-white/10" />
                <span className="hidden sm:block text-[9px] md:text-[10px] text-white/40 font-mono uppercase tracking-widest">
                    {description}
                </span>
            </div>
            {children && (
                <div className="flex items-center gap-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default PageHeader;
