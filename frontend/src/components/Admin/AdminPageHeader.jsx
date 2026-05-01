import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const AdminPageHeader = ({ title, highlight, subtitle, searchTerm, setSearchTerm, placeholder = "Rechercher...", onAdd, addLabel }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    {title} <span className="text-teal-400">{highlight}</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-1">{subtitle}</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
                {setSearchTerm && (
                    <div className="relative group flex-1 md:w-80">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-teal-400 transition-colors">
                            <IconRenderer icon="🔍" size={18} />
                        </div>
                        <input 
                            type="text" 
                            placeholder={placeholder}
                            className="w-full bg-slate-900/50 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-teal-500/50 outline-none transition-all placeholder:text-slate-600 font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}
                {onAdd && (
                    <button 
                        onClick={onAdd}
                        className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-slate-950 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 active:scale-95 whitespace-nowrap"
                    >
                        <IconRenderer icon="➕" size={14} />
                        {addLabel || "Ajouter"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AdminPageHeader;
