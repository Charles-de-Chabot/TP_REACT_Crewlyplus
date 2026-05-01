import React from 'react';
import IconRenderer from '../../components/UI/IconRenderer';
import AdminPageHeader from '../../components/Admin/AdminPageHeader';
import AdminDataGrid from '../../components/Admin/AdminDataGrid';
import { useAdminData } from '../../hooks/useAdminData';

const AdminRegattas = () => {
    const {
        data: regattas,
        loading,
        searchTerm,
        setSearchTerm
    } = useAdminData('/api/regattas', 'name');

    const renderRegattaCard = (regatta) => {
        const isFuture = new Date(regatta.startDate || regatta.start_date) > new Date();
        return (
            <div key={regatta.id} className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-orange-500/10 transition-colors" />
                
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-[0.2em] ${
                                isFuture ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-slate-500/10 border-white/5 text-slate-500'
                            }`}>
                                {isFuture ? 'À venir' : 'Terminée'}
                            </span>
                            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                <IconRenderer icon="📍" size={10} />
                                {regatta.location}
                            </span>
                        </div>
                        
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-tight">
                            {regatta.name}
                        </h3>
                        
                        <p className="text-sm text-slate-400 line-clamp-2 font-medium leading-relaxed">
                            {regatta.description || "Aucune description fournie pour cet événement."}
                        </p>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Inscription</p>
                            <p className="text-xl font-black text-white">{regatta.registrationPrice}€</p>
                        </div>
                        <div className="h-10 w-[1px] bg-white/5 hidden md:block" />
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1">Équipes</p>
                            <p className="text-xl font-black text-orange-400">{regatta.teams?.length || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Début</span>
                            <span className="text-xs font-bold text-slate-200">
                                {new Date(regatta.startDate || regatta.start_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                            </span>
                        </div>
                        <IconRenderer icon="➡️" size={12} className="text-slate-700" />
                        <div className="flex flex-col">
                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Fin</span>
                            <span className="text-xs font-bold text-slate-200">
                                {new Date(regatta.endDate || regatta.end_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white transition-all">
                            Détails
                        </button>
                        <button className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-500 hover:bg-orange-500 hover:text-slate-950 transition-all">
                            <IconRenderer icon="✏️" size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <AdminPageHeader 
                title="Gestion des"
                highlight="Régates"
                subtitle="Planifiez et supervisez les événements nautiques officiels."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAdd={() => {}} // TODO: Implémenter l'ajout
                addLabel="Nouvel Événement"
                placeholder="Rechercher une régate..."
            />

            <AdminDataGrid
                data={regattas}
                loading={loading}
                renderItem={renderRegattaCard}
                gridClassName="grid grid-cols-1 lg:grid-cols-2 gap-6"
                emptyMessage="Aucune régate programmée pour le moment."
            />
        </div>
    );
};

export default AdminRegattas;
