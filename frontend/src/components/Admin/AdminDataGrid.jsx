import React from 'react';

const AdminDataGrid = ({ 
    data, 
    loading, 
    emptyMessage = "Aucun élément trouvé.",
    renderItem,
    gridClassName = "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
}) => {
    return (
        <div className={gridClassName}>
            {loading ? (
                Array(6).fill(0).map((_, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 animate-pulse">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl" />
                            <div className="space-y-2 flex-1">
                                <div className="w-3/4 h-4 bg-white/5 rounded" />
                                <div className="w-1/2 h-3 bg-white/5 rounded" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-10 bg-white/5 rounded-xl" />
                            <div className="h-10 bg-white/5 rounded-xl" />
                        </div>
                    </div>
                ))
            ) : data.length > 0 ? (
                data.map((item, index) => renderItem(item, index))
            ) : (
                <div className="col-span-full py-20 text-center text-slate-500 font-bold italic">
                    {emptyMessage}
                </div>
            )}
        </div>
    );
};

export default AdminDataGrid;
