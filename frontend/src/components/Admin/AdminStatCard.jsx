import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const AdminStatCard = ({ label, value, icon, change = "Total", loading }) => {
    return (
        <div className="group bg-slate-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[2.5rem] hover:border-teal-500/30 transition-all duration-500 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-2xl border border-white/5 group-hover:scale-110 transition-transform">
                    <IconRenderer icon={icon} size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-500 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 uppercase tracking-widest">
                    {change}
                </span>
            </div>
            
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{label}</h3>
            {loading ? (
                <div className="h-9 w-24 bg-white/5 rounded-lg animate-pulse" />
            ) : (
                <p className="text-4xl font-black text-white tracking-tighter italic">{value.toLocaleString()}</p>
            )}
        </div>
    );
};

export default AdminStatCard;
