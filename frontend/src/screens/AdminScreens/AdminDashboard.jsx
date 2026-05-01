import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminStatCard from '../../components/Admin/AdminStatCard';
import api from '../../api/axios';

const AdminDashboard = () => {
    const [counts, setCounts] = useState({ users: 0, teams: 0, boats: 0, regattas: 0 });
    const [recentUsers, setRecentUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [usersRes, teamsRes, boatsRes, regattasRes, recentRes] = await Promise.all([
                api.get('/api/users?page=1'),
                api.get('/api/teams?page=1'),
                api.get('/api/boats?page=1'),
                api.get('/api/regattas?page=1'),
                api.get('/api/users?order[id]=desc&itemsPerPage=4')
            ]);

            setCounts({
                users: usersRes.data['totalItems'] || usersRes.data['hydra:totalItems'] || 0,
                teams: teamsRes.data['totalItems'] || teamsRes.data['hydra:totalItems'] || 0,
                boats: boatsRes.data['totalItems'] || boatsRes.data['hydra:totalItems'] || 0,
                regattas: regattasRes.data['totalItems'] || regattasRes.data['hydra:totalItems'] || 0
            });

            setRecentUsers(recentRes.data['member'] || recentRes.data['hydra:member'] || []);
        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const statsConfig = [
        { label: 'Utilisateurs', value: counts.users, icon: 'users' },
        { label: 'Équipes Actives', value: counts.teams, icon: 'teams' },
        { label: 'Bateaux', value: counts.boats, icon: 'boats' },
        { label: 'Régates', value: counts.regattas, icon: 'regattas' },
    ];

    return (
        <div className="space-y-10 pb-10">
            {/* Hero Welcome */}
            <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 border border-white/5 p-12">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] -mr-40 -mt-40" />
                <div className="relative z-10">
                    <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">
                        Espace <span className="text-teal-400">Admin</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl text-lg font-medium leading-relaxed italic">
                        Tableau de bord de gestion centralisée. Toutes les données ci-dessous sont issues en temps réel de votre base de données.
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsConfig.map((stat) => (
                    <AdminStatCard 
                        key={stat.label} 
                        {...stat} 
                        loading={loading} 
                    />
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-10 shadow-2xl">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                        <div className="w-2 h-2 bg-teal-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                        Dernières Inscriptions
                    </h3>
                    <Link to="/admin/users" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Gérer les utilisateurs</Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse" />
                        ))
                    ) : recentUsers.length > 0 ? (
                        recentUsers.map((user, index) => (
                            <div key={user.id || index} className="flex items-center gap-5 p-5 bg-white/[0.02] rounded-3xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all group">
                                <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center text-sm font-black text-teal-500 border border-white/5 shadow-inner italic">
                                    {user.firstname?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{user.firstname} {user.lastname}</p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 opacity-60">{user.email}</p>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-500 text-[8px] font-black uppercase tracking-widest border border-teal-500/20">
                                    Nouveau
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 p-10 text-center text-slate-500 italic font-medium">Aucun utilisateur récent.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
