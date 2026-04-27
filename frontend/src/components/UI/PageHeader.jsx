import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const PageHeader = ({ title, subtitle, description, backPath, backLabel, children }) => {
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

            <div className="flex items-center gap-4">
                {backPath && (
                    <Link 
                        to={backPath} 
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-white/5 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
                        {backLabel || 'Retour'}
                    </Link>
                )}
                {children}
            </div>
        </div>
    );
};

export default PageHeader;
