import React from 'react';
import IconRenderer from '../../components/UI/IconRenderer';
import AdminPageHeader from '../../components/Admin/AdminPageHeader';
import AdminDataTable from '../../components/Admin/AdminDataTable';
import { useAdminData } from '../../hooks/useAdminData';

const AdminUsers = () => {
    const {
        data: users,
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        totalItems,
        toggleStatus
    } = useAdminData('/api/users', 'firstname');

    const columns = [
        { label: 'Utilisateur' },
        { label: 'Rôle' },
        { label: 'Date d\'inscription' },
        { label: 'Statut', className: 'text-center' },
        { label: 'Actions', className: 'text-right' }
    ];

    return (
        <div className="space-y-8">
            <AdminPageHeader 
                title="Gestion des"
                highlight="Utilisateurs"
                subtitle="Supervisez les membres de la communauté CrewlyPlus."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Rechercher un nom, email..."
            />

            <AdminDataTable
                columns={columns}
                data={users}
                loading={loading}
                totalItems={totalItems}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            >
                {users.map((user) => {
                    const isActive = user.isActive ?? user.is_active;
                    return (
                        <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center font-black text-xs text-white italic">
                                        {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white leading-tight">{user.firstname} {user.lastname}</p>
                                        <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                                    user.roleLabel === 'ROLE_ADMIN' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                    user.roleLabel === 'ROLE_PREMIUM' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    'bg-slate-500/10 border-slate-500/20 text-slate-400'
                                }`}>
                                    {user.roleLabel?.replace('ROLE_', '') || 'USER'}
                                </span>
                            </td>
                            <td className="px-6 py-5">
                                <p className="text-xs font-bold text-slate-400">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                                </p>
                            </td>
                            <td className="px-6 py-5 text-center">
                                <div className="flex justify-center">
                                    <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-red-400'}`} />
                                        {isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-5 text-right">
                                <button 
                                    onClick={() => toggleStatus(user, 'is_active')}
                                    className={`p-2 rounded-xl border transition-all ${
                                        isActive 
                                        ? 'bg-red-500/5 border-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                                        : 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                                    }`}
                                    title={isActive ? 'Désactiver' : 'Activer'}
                                >
                                    <IconRenderer icon={isActive ? '🚫' : '✅'} size={16} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </AdminDataTable>
        </div>
    );
};

export default AdminUsers;
