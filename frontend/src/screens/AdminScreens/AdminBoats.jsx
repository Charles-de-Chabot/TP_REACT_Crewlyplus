import React, { useState } from 'react';
import api from '../../api/axios';
import IconRenderer from '../../components/UI/IconRenderer';
import AdminPageHeader from '../../components/Admin/AdminPageHeader';
import AdminDataTable from '../../components/Admin/AdminDataTable';
import BoatFormModal from '../../components/Admin/BoatFormModal';
import { useAdminData } from '../../hooks/useAdminData';
import { BOAT_URL } from '../../constants/apiConstant';
import { toast } from 'sonner';

const AdminBoats = () => {
    const {
        data: boats,
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        totalItems,
        refresh,
        toggleStatus,
        setData
    } = useAdminData('/api/boats', 'name');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBoat, setCurrentBoat] = useState(null);

    const handleAddBoat = () => {
        setCurrentBoat(null);
        setIsModalOpen(true);
    };

    const handleEditBoat = (boat) => {
        setCurrentBoat(boat);
        setIsModalOpen(true);
    };

    const handleDeleteBoat = async (boat) => {
        if (!window.confirm(`🚨 ATTENTION : Êtes-vous sûr de vouloir supprimer DÉFINITIVEMENT le bateau "${boat.name}" ? Cette action est irréversible.`)) return;

        try {
            await api.delete(`/api/boats/${boat.id}`);
            setData(prev => prev.filter(b => b.id !== boat.id));
            toast.success("Bateau supprimé de la flotte");
        } catch (error) {
            console.error("Error deleting boat:", error);
            toast.error("Erreur lors de la suppression. Vérifiez que le bateau n'est pas lié à des réservations.");
        }
    };

    const columns = [
        { label: 'Bateau' },
        { label: 'Modèle / Type' },
        { label: 'Tarif (Jour/Sem)' },
        { label: 'État', className: 'text-center' },
        { label: 'Actions', className: 'text-right' }
    ];

    return (
        <div className="space-y-8">
            <AdminPageHeader 
                title="Gestion de la"
                highlight="Flotte"
                subtitle="Gerez votre inventaire de bateaux et leurs spécifications."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAdd={handleAddBoat}
                addLabel="Ajouter un Bateau"
            />

            <AdminDataTable
                columns={columns}
                data={boats}
                loading={loading}
                totalItems={totalItems}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            >
                {boats.map((boat) => {
                    const isActive = boat.isActive ?? boat.is_active;
                    return (
                        <tr key={boat.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-10 rounded-lg bg-slate-950 border border-white/10 overflow-hidden flex items-center justify-center">
                                        {boat.media?.[0]?.media_path ? (
                                            <img src={`${BOAT_URL}/${boat.media[0].media_path}`} alt={boat.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <IconRenderer icon="⛵" size={20} className="text-slate-800" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-tight flex items-center gap-2">
                                            {boat.name}
                                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                                                boat.used 
                                                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {boat.used ? 'Régate' : 'Plaisance'}
                                            </span>
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                                            {boat.address?.city || 'Sans port attitré'}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div>
                                    <p className="text-xs font-bold text-slate-300">{boat.model?.label || 'Inconnu'}</p>
                                    <p className="text-[10px] text-slate-500 font-medium">{boat.type?.label || 'N/C'}</p>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-emerald-400">{boat.dayPrice}€ <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">/ jour</span></span>
                                    <span className="text-xs font-black text-blue-400">{boat.weekPrice}€ <span className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">/ sem</span></span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className="flex justify-center">
                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                        isActive 
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}>
                                        {isActive ? 'Actif' : 'Masqué'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleEditBoat(boat)}
                                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                                        title="Modifier"
                                    >
                                        <IconRenderer icon="✏️" size={16} />
                                    </button>
                                    <button 
                                        onClick={() => toggleStatus(boat, 'is_active')}
                                        className={`p-2.5 rounded-xl border transition-all ${
                                            isActive 
                                            ? 'bg-amber-500/5 border-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white' 
                                            : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                        }`}
                                        title={isActive ? 'Masquer' : 'Afficher'}
                                    >
                                        <IconRenderer icon={isActive ? '👁️‍🗨️' : '👁️'} size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteBoat(boat)}
                                        className="p-2.5 bg-red-500/5 border border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                        title="Supprimer"
                                    >
                                        <IconRenderer icon="🗑️" size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </AdminDataTable>

            <BoatFormModal 
                isOpen={isModalOpen} 
                boat={currentBoat}
                onClose={() => setIsModalOpen(false)}
                onSave={refresh}
            />
        </div>
    );
};

export default AdminBoats;
