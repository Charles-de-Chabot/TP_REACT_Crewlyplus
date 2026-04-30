import React, { useState, useEffect } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuthContext } from '../../contexts/authContext'
import { useSidebar } from '../../hooks/useSidebar'
import { IMAGE_URL } from '../../constants/apiConstant'
import api from '../../api/axios'
import NotificationModal from './NotificationModal'
import IconRenderer from './IconRenderer'
import { useDispatch } from 'react-redux'
import { resetBooking } from '../../store/booking/bookingSlice'
import { MessageSquare, Crown } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';

// Configuration visuelle par rôle
const ROLE_CONFIG = {
  'ROLE_ADMIN': { label: 'Administrateur', color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' },
  'ROLE_CAPITAINE': { label: 'Capitaine', color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
  'ROLE_CHEF': { label: 'Chef', color: 'text-orange-400', border: 'border-orange-500/30', bg: 'bg-orange-500/10' },
  'ROLE_HOTESSE': { label: 'Hôtesse', color: 'text-pink-400', border: 'border-pink-500/30', bg: 'bg-pink-500/10' },
  'ROLE_PREMIUM': { label: 'Élite', color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
  'ROLE_USER': { label: 'Moussaillon', color: 'text-slate-400', border: 'border-slate-500/30', bg: 'bg-slate-500/10' }
};

const Topbar = () => {
  const { firstname, email, role, roleLabel, signOut, userId } = useAuthContext()
  const isPremium = roleLabel !== 'ROLE_USER';
  const { setIsChatOpen, totalUnreadCount } = useChat()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuthenticated = !!userId
  const navItems = useSidebar(role)

  const isStaff = ['ROLE_CAPITAINE', 'ROLE_CHEF', 'ROLE_HOTESSE'].includes(role);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const res = await api.get(`/api/notifications?user.id=${userId}&order[id]=desc&page=1`);
          const data = res.data['member'] || res.data['hydra:member'] || [];
          setNotifications(data);
          const unreadCount = data.filter(n => !n.isOpen).length;
          setUnreadNotifications(unreadCount);
        } catch (err) {
          console.error("Error fetching notifications", err);
        }
      };
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    dispatch(resetBooking());
  }, [userId, dispatch]);

  const getActiveRoleKey = () => {
    const currentRole = String(roleLabel || role || '').toUpperCase();
    if (currentRole.includes('ADMIN')) return 'ROLE_ADMIN';
    if (currentRole.includes('PREMIUM')) return 'ROLE_PREMIUM';
    if (currentRole.includes('CAPITAINE')) return 'ROLE_CAPITAINE';
    if (currentRole.includes('CHEF')) return 'ROLE_CHEF';
    if (currentRole.includes('HOTESSE')) return 'ROLE_HOTESSE';
    return 'ROLE_USER';
  };

  const activeKey = getActiveRoleKey();
  const config = ROLE_CONFIG[activeKey];

  const userInitial = firstname 
    ? firstname.charAt(0).toUpperCase() 
    : (email ? email.charAt(0).toUpperCase() : 'U');

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      signOut()
      navigate('/')
      setIsMobileMenuOpen(false)
    }
  }

  const handleDeleteNotifications = async (notifId) => {
    try {
      if (notifId === 'all') {
        for (const n of notifications) {
          await api.delete(`/api/notifications/${n.id}`);
        }
      } else {
        await api.delete(`/api/notifications/${notifId}`);
      }
      const res = await api.get(`/api/notifications?user.id=${userId}&order[id]=desc&page=1`);
      const data = res.data['member'] || res.data['hydra:member'] || [];
      setNotifications(data);
      const unreadCount = data.filter(n => !n.isOpen).length;
      setUnreadNotifications(unreadCount);
    } catch (err) {
      console.error("Error deleting notification", err);
    }
  }

  const handleReadNotification = async (notifId) => {
    try {
      await api.patch(`/api/notifications/${notifId}`, { isOpen: true }, {
        headers: { 'Content-Type': 'application/merge-patch+json' }
      });
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isOpen: true } : n));
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/30">
      <div className="max-w-[1700px] mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          <div className="flex items-center space-x-12">
            <Link className="flex-shrink-0" to="/">
              <img className="h-9 w-auto" src={`${IMAGE_URL}/logo.png`} alt="Crewly" />
            </Link>

            <div className="hidden lg:flex items-center space-x-9">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path}
                  className={({ isActive }) => `
                    text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5
                    ${isActive ? 'text-accent-role' : 'text-slate-500 hover:text-white'}
                  `}
                >
                  {item.label}
                  {item.label === 'Régates' && <Crown size={12} className="mb-0.5" />}
                </NavLink>
              ))}

              {/* 💬 Onglet Messages (Global) - Réservé Premium */}
              {isPremium && (
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 text-slate-500 hover:text-white relative"
                >
                  MESSAGES
                  <MessageSquare size={12} className="mb-0.5" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-slate-950 animate-bounce">
                      {totalUnreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-5 pl-5 border-l border-white/10">
                
                <div className="relative group mr-2">
                  <div 
                    onClick={() => setIsNotifModalOpen(true)}
                    className={`p-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-accent-role transition-all cursor-pointer ${unreadNotifications > 0 ? 'animate-pulse' : ''}`}
                  >
                    <IconRenderer icon="🔔" size={20} />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-slate-950">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                </div>

                {!isStaff && (
                  <Link 
                    to="/user" 
                    className={`px-4 py-2 rounded-xl bg-accent-role/10 border border-accent-role/20 text-accent-role text-[10px] font-black uppercase tracking-widest hover:bg-accent-role/20 transition-all`}
                  >
                    Tableau de bord
                  </Link>
                )}

                {isStaff && (
                  <Link 
                    to="/crew/dashboard" 
                    className={`px-4 py-2 rounded-xl bg-accent-role/10 border border-accent-role/20 text-accent-role text-[10px] font-black uppercase tracking-widest hover:bg-accent-role/20 transition-all`}
                  >
                    Tableau de bord Pro
                  </Link>
                )}

                <Link className="flex items-center space-x-3.5 group" to="/user">
                  <div className={`
                    flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner border-2
                    bg-accent-role/10 border-accent-role/20 text-accent-role shadow-glow-role
                    group-hover:scale-110
                  `}>
                    <span className="font-extrabold text-base tracking-tight italic">
                      {userInitial}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-accent-role transition-colors leading-none">
                      {firstname || (email ? email.split('@')[0] : 'Utilisateur')}
                    </span>
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-black mt-1.5 text-accent-role`}>
                      {config.label}
                    </span>
                  </div>
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
                  title="Déconnexion"
                >
                  <IconRenderer icon="🚪" size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                <Link className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors" to="/login">
                  Connexion
                </Link>
                <Link className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95" to="/register">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <IconRenderer icon={isMobileMenuOpen ? "❌" : "🍔"} size={28} />
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-white/5 p-6 shadow-2xl animate-fade-in">
           <div className="space-y-4 mb-8">
              {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    className="block text-2xl font-black text-white hover:text-teal-400 italic uppercase tracking-tighter" 
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
              ))}
              
              {/* 💬 Messages Mobile - Réservé Premium */}
              {isPremium && (
                <button 
                  onClick={() => { setIsChatOpen(true); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 text-2xl font-black text-white hover:text-cyan-400 italic uppercase tracking-tighter"
                >
                  MESSAGES
                  {totalUnreadCount > 0 && (
                    <span className="w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                      {totalUnreadCount}
                    </span>
                  )}
                </button>
              )}
           </div>
           <hr className="border-white/5 mb-8" />
           {isAuthenticated ? (
             <div className="space-y-6">
               <div className="flex items-center space-x-4 mb-6">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black italic text-lg border-2 ${config.bg} ${config.color} ${config.border}`}>
                    {userInitial}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold">{firstname}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
                  </div>
               </div>
               <div className="grid grid-cols-1 gap-3">
                {isStaff && (
                  <Link to="/crew/dashboard" className="w-full py-4 bg-blue-500/10 text-blue-400 font-black text-[10px] uppercase tracking-widest text-center rounded-2xl border border-blue-500/20" onClick={() => setIsMobileMenuOpen(false)}>Dashboard Pro</Link>
                )}
                <Link to="/user" className="w-full py-4 bg-teal-500/10 text-teal-400 font-black text-[10px] uppercase tracking-widest text-center rounded-2xl border border-teal-500/20" onClick={() => setIsMobileMenuOpen(false)}>Mon Profil</Link>
                <button onClick={handleLogout} className="w-full py-4 bg-red-500/10 text-red-400 font-black text-[10px] uppercase tracking-widest text-center rounded-2xl border border-red-500/20 flex items-center justify-center gap-2">
                  <IconRenderer icon="🚪" size={14} />
                  Déconnexion
                </button>
               </div>
             </div>
           ) : (
             <div className="grid grid-cols-2 gap-4">
               <Link to="/login" className="py-4 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest text-center rounded-2xl border border-white/10" onClick={() => setIsMobileMenuOpen(false)}>Connexion</Link>
               <Link to="/register" className="py-4 bg-teal-500 text-slate-950 font-black text-[10px] uppercase tracking-widest text-center rounded-2xl shadow-lg shadow-teal-500/20" onClick={() => setIsMobileMenuOpen(false)}>S'inscrire</Link>
             </div>
           )}
        </div>
      )}
    </nav>
    <NotificationModal 
      isOpen={isNotifModalOpen} 
      onClose={() => setIsNotifModalOpen(false)} 
      notifications={notifications}
      onDelete={handleDeleteNotifications}
      onRead={handleReadNotification}
      isStaff={isStaff}
    />
    </>
  )
}

export default Topbar