import React from 'react';
import IconRenderer from '../../components/UI/IconRenderer';
import AdminPageHeader from '../../components/Admin/AdminPageHeader';
import AdminDataGrid from '../../components/Admin/AdminDataGrid';
import { useAdminData } from '../../hooks/useAdminData';
import { TEAM_URL } from '../../constants/apiConstant';

const AdminTeams = () => {
    const {
        data: teams,
        loading,
        searchTerm,
        setSearchTerm,
        toggleStatus
    } = useAdminData('/api/teams', 'name');

    const renderTeamCard = (team) => {
        const isActive = team.isActive ?? team.is_active;
        return (
            <div key={team.id} className={`group bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-500 ${!isActive && 'opacity-60 grayscale'}`}>
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-white/10 flex items-center justify-center overflow-hidden">
                            {team.emblem ? (
                                <img src={`${TEAM_URL}/${team.emblem}`} alt={team.name} className="w-full h-full object-cover" />
                            ) : (
                                <IconRenderer icon="teams" size={32} className="text-slate-700" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">{team.name}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                                Capitaine : {team.leader?.firstname || 'Inconnu'} {team.leader?.lastname || ''}
                            </p>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {isActive ? 'Active' : 'Inactif'}
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500 uppercase tracking-widest text-[9px]">Équipage</span>
                        <span className="text-white">{team.members?.length || 0} membres</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500 uppercase tracking-widest text-[9px]">Régate</span>
                        <span className="text-slate-300 truncate max-w-[150px]">{team.regatta?.name || 'Aucune'}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => toggleStatus(team)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            isActive 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                        }`}
                    >
                        <IconRenderer icon={isActive ? '🚫' : '✅'} size={14} />
                        {isActive ? 'Désactiver' : 'Réactiver'}
                    </button>
                    <button className="w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                        <IconRenderer icon="👁️" size={16} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            <AdminPageHeader 
                title="Gestion des"
                highlight="Équipes"
                subtitle="Surveillez les équipages et leurs activités."
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                placeholder="Rechercher une équipe..."
            />

            <AdminDataGrid
                data={teams}
                loading={loading}
                renderItem={renderTeamCard}
                emptyMessage="Aucune équipe trouvée."
            />
        </div>
    );
};

export default AdminTeams;
