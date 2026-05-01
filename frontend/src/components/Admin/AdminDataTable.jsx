import React from 'react';
import IconRenderer from '../UI/IconRenderer';

const AdminDataTable = ({ 
    columns, 
    data, 
    loading, 
    totalItems, 
    currentPage, 
    setCurrentPage, 
    itemsPerPage = 30,
    emptyMessage = "Aucune donnée trouvée.",
    children 
}) => {
    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="bg-white/5">
                            {columns.map((col, idx) => (
                                <th 
                                    key={idx} 
                                    className={`px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 ${col.className || ''}`}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={columns.length} className="px-6 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/5 rounded-full" />
                                            <div className="space-y-2">
                                                <div className="w-32 h-3 bg-white/5 rounded" />
                                                <div className="w-48 h-2 bg-white/5 rounded" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : data.length > 0 ? (
                            children
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="px-6 py-20 text-center text-slate-500 font-bold italic">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-6 bg-white/5 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Affichage de {data.length} sur {totalItems} éléments
                </p>
                <div className="flex gap-2">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-2 bg-slate-950 border border-white/5 rounded-xl text-slate-400 disabled:opacity-30 hover:bg-white/5 transition-all"
                    >
                        <IconRenderer icon="⬅️" size={16} />
                    </button>
                    <button 
                        disabled={currentPage * itemsPerPage >= totalItems}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-2 bg-slate-950 border border-white/5 rounded-xl text-slate-400 disabled:opacity-30 hover:bg-white/5 transition-all"
                    >
                        <IconRenderer icon="➡️" size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDataTable;
