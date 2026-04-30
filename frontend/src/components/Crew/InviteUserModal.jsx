import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { USER_URL } from '../../constants/apiConstant';
import IconRenderer from '../UI/IconRenderer';
import GlassCard from '../ui/GlassCard';
import { Search, UserPlus, ShieldCheck, X } from 'lucide-react';

const InviteUserModal = ({ isOpen, onClose, team }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [filterPosition, setFilterPosition] = useState('All');
    const [invitedUserIds, setInvitedUserIds] = useState({});

    const positions = ['All', 'Équipier', 'Numéro 1', 'Numéro 2', 'Barreur', 'Tacticien', 'Embraqueur', 'Régleur', 'Piano'];

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            // On récupère les utilisateurs Premium. 
            // Note: En prod on filtrerait via l'API, ici on prend une liste et on filtre
            const response = await api.get('/api/users');
            const allUsers = response.data['member'] || response.data['hydra:member'] || response.data || [];
            
            // Liste des IDs déjà dans l'équipe pour les exclure
            const existingMemberIds = team.memberships?.map(m => m.user?.id || m.user) || [];
            
            // Filtre : Uniquement les "Régatiers" (Comptes Premium standards)
            // On exclut les rôles pro (Capitaine, Chef, Hôtesse) 
            // ET on exclut ceux qui sont déjà membres de l'équipe
            const eligibleUsers = allUsers.filter(u => 
                u.roleLabel === 'ROLE_PREMIUM' &&
                u.position && u.position !== '' &&
                !u.currentTeam && // Exclure ceux qui sont déjà en équipe
                u.is_active !== false && // Exclure les comptes inactifs
                !existingMemberIds.includes(u.id)
            );
            
            setUsers(eligibleUsers);

            // Récupérer les invitations déjà envoyées (non lues)
            // On cherche les notifications non ouvertes qui commencent par "Invitation Équipage"
            try {
                const notifRes = await api.get(`/api/notifications?isOpen=false&label=Invitation%20%C3%89quipage%20%3A%20${team.leader?.firstname}`);
                const activeNotifs = notifRes.data['member'] || notifRes.data['hydra:member'] || [];
                const invited = {};
                activeNotifs.forEach(n => {
                    const uId = n.user?.id || (typeof n.user === 'string' ? n.user.split('/').pop() : null);
                    if (uId) invited[uId] = true;
                });
                setInvitedUserIds(invited);
            } catch (e) {
                console.warn("Could not fetch existing invitations state", e);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = `${u.firstname} ${u.lastname}`.toLowerCase().includes(search.toLowerCase());
        const matchesPosition = filterPosition === 'All' || u.position === filterPosition;
        return matchesSearch && matchesPosition;
    });

    const handleInvite = async (user) => {
        try {
            // Création d'une notification pour l'utilisateur invité
            await api.post('/api/notifications', {
                label: `Invitation Équipage : ${team.leader?.firstname} vous invite à rejoindre "${team.name}". Code : ${team.inviteCode}`,
                isOpen: false,
                user: `/api/users/${user.id}`,
                metadata: {
                    type: 'TEAM_INVITATION',
                    inviteCode: team.inviteCode,
                    teamName: team.name
                }
            });
            setInvitedUserIds(prev => ({ ...prev, [user.id]: true }));
            // alert(`Invitation envoyée à ${user.firstname} !`);
        } catch (error) {
            console.error("Error sending invitation:", error);
            alert("Erreur lors de l'envoi de l'invitation.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
            
            <div className="relative bg-[#050810] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-slideup">
                
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Recrutement Élite</h2>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Invitez des équipiers Premium certifiés</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Filters */}
                <div className="p-6 bg-slate-950/50 border-b border-white/5 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input 
                            type="text"
                            placeholder="Rechercher un marin..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-white focus:border-accent-role outline-none transition-all text-sm"
                        />
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {positions.map(pos => (
                            <button
                                key={pos}
                                onClick={() => setFilterPosition(pos)}
                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                                    filterPosition === pos 
                                    ? 'bg-accent-role text-slate-950 border-accent-role' 
                                    : 'bg-white/5 text-white/40 border-white/5 hover:border-white/20'
                                }`}
                            >
                                {pos}
                            </button>
                        ))}
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar bg-[#020408]">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-accent-role mx-auto mb-4"></div>
                            <p className="text-white/20 text-[10px] uppercase tracking-[0.3em]">Scan_du_port_en_cours...</p>
                        </div>
                    ) : filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-accent-role/10 border border-accent-role/20 flex items-center justify-center text-accent-role relative overflow-hidden shrink-0 shadow-inner">
                                        {user.media?.[0]?.media_path ? (
                                            <img 
                                                src={`${USER_URL}/${user.media[0].media_path.replace(/^\//, '')}`} 
                                                className="w-full h-full object-cover" 
                                                alt="" 
                                                onError={(e) => e.target.style.display = 'none'}
                                            />
                                        ) : null}
                                        <span className="font-black text-lg absolute z-[-1]">{user.firstname[0]}</span>
                                        <div className="absolute inset-0 bg-gradient-to-t from-accent-role/20 to-transparent opacity-50" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-white font-bold text-sm uppercase tracking-tight">{user.firstname} {user.lastname}</h4>
                                            <ShieldCheck size={14} className="text-accent-role" />
                                        </div>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] bg-white/5 text-white/60 px-2 py-0.5 rounded-md font-bold border border-white/5 uppercase">
                                                {user.position}
                                            </span>
                                            <span className="text-[10px] text-accent-role/60 font-black italic uppercase">Premium</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => !invitedUserIds[user.id] && handleInvite(user)}
                                    className={`p-3 rounded-xl transition-all shadow-lg group-hover:scale-110 active:scale-95 flex items-center justify-center ${
                                        invitedUserIds[user.id] 
                                        ? 'bg-emerald-500/20 text-emerald-500 cursor-default border border-emerald-500/30' 
                                        : 'bg-white/5 hover:bg-accent-role text-white hover:text-slate-950'
                                    }`}
                                    title={invitedUserIds[user.id] ? "Invitation déjà envoyée" : "Inviter dans l'équipage"}
                                >
                                    {invitedUserIds[user.id] ? <ShieldCheck size={18} /> : <UserPlus size={18} />}
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center text-white/20">
                            <p className="text-sm italic">Aucun équipier disponible avec ces critères.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-900/50 border-t border-white/5 text-center">
                    <p className="text-[9px] text-white/20 uppercase tracking-[0.2em]">Seuls les membres certifiés Premium apparaissent dans le radar.</p>
                </div>
            </div>
        </div>
    );
};

export default InviteUserModal;
