import React, { useState, useEffect } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuthContext } from '../../contexts/authContext'
import { useSidebar } from '../../hooks/useSidebar'
import { IMAGE_URL } from '../../constants/apiConstant'
import api from '../../api/axios'
import NotificationModal from './NotificationModal'
import { useDispatch } from 'react-redux'
import { resetBooking } from '../../store/booking/bookingSlice'

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
          // Fetch last 20 notifications (read or unread)
          const res = await api.get(`/api/notifications?user.id=${userId}&order[id]=desc&page=1`);
          const data = res.data['member'] || res.data['hydra:member'] || [];
          setNotifications(data);
          
          // Unread count is calculated locally based on is_open property
          const unreadCount = data.filter(n => !n.is_open).length;
          setUnreadNotifications(unreadCount);
        } catch (err) {
          console.error("Error fetching notifications", err);
        }
      };
      fetchNotifications();
      // Polling every 60s for new notifications
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, userId]);

  // Reset booking state when user ID changes (Login/Logout/Switch)
  useEffect(() => {
    dispatch(resetBooking());
  }, [userId, dispatch]);

  // Déterminer le rôle prioritaire
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
      // Refresh notifications
      const res = await api.get(`/api/notifications?user.id=${userId}&order[id]=desc&page=1`);
      const data = res.data['member'] || res.data['hydra:member'] || [];
      setNotifications(data);
      const unreadCount = data.filter(n => !n.is_open).length;
      setUnreadNotifications(unreadCount);
    } catch (err) {
      console.error("Error deleting notification", err);
    }
  }

  const handleReadNotification = async (notifId) => {
    try {
      await api.patch(`/api/notifications/${notifId}`, { is_open: true }, {
        headers: { 'Content-Type': 'application/merge-patch+json' }
      });
      
      // Update local state without full refresh for speed
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, is_open: true } : n));
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
          
          {/* GAUCHE : Logo + Navigation Desktop */}
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
                    text-sm font-bold tracking-tight transition-all duration-300
                    ${isActive ? 'text-teal-400' : 'text-slate-300 hover:text-white'}
                  `}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* DROITE : Profil & Actions */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-5 pl-5 border-l border-white/10">
                
                {/* Notifications Bell */}
                <div className="relative group mr-2">
                  <div 
                    onClick={() => setIsNotifModalOpen(true)}
                    className={`p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer ${unreadNotifications > 0 ? 'animate-pulse' : ''}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-slate-950">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                </div>

                {/* User Dashboard Link */}
                {!isStaff && (
                  <Link 
                    to="/user" 
                    className="px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-[10px] font-black uppercase tracking-widest hover:bg-teal-500/20 transition-all"
                  >
                    Tableau de bord
                  </Link>
                )}

                {/* Dashboard Pro Shortcut for Staff */}
                {isStaff && (
                  <Link 
                    to="/crew/dashboard" 
                    className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                  >
                    Tableau de bord Pro
                  </Link>
                )}

                <Link className="flex items-center space-x-3.5 group" to="/user">
                  <div className={`
                    flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-inner border-2
                    ${config.bg} ${config.border} ${config.color} ${config.glow || ''}
                    group-hover:scale-110
                  `}>
                    <span className="font-extrabold text-base tracking-tight italic">
                      {userInitial}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors leading-none">
                      {firstname || (email ? email.split('@')[0] : 'Utilisateur')}
                    </span>
                    <span className={`text-[9px] uppercase tracking-[0.2em] font-black mt-1.5 ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="p-2.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                  title="Déconnexion"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                <Link className="text-sm font-bold text-slate-300 hover:text-white transition-colors" to="/login">
                  Connexion
                </Link>
                <Link className="bg-teal-500 hover:bg-teal-400 text-slate-950 text-sm font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95" to="/register">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Bouton Menu Mobile */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Dropdown Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-white/5 p-6 shadow-2xl animate-fade-in">
           <div className="space-y-3 mb-6">
              {navItems.map((item) => (
                  <Link key={item.path} to={item.path} className="block text-xl font-bold text-white hover:text-teal-400" onClick={() => setIsMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
              ))}
           </div>
           <hr className="border-white/5 mb-6" />
           {isAuthenticated ? (
             <div className="space-y-4">
               <div className="flex items-center space-x-3 mb-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${config.bg} ${config.color}`}>
                    {userInitial}
                  </div>
                  <span className={`text-sm font-black uppercase tracking-widest ${config.color}`}>{config.label}</span>
               </div>
               {isStaff && (
                 <Link to="/crew/dashboard" className="block text-lg font-bold text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>Dashboard Pro</Link>
               )}
               <Link to="/user" className="block text-lg font-bold text-slate-300" onClick={() => setIsMobileMenuOpen(false)}>Mon Profil</Link>
               <button onClick={handleLogout} className="text-red-400 font-bold italic text-lg">Déconnexion</button>
             </div>
           ) : (
             <div className="space-y-4">
               <Link to="/login" className="block text-center w-full py-3 bg-white/5 text-white font-bold rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>Connexion</Link>
               <Link to="/register" className="block text-center w-full py-3 bg-teal-500 text-slate-950 font-black rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>S'inscrire</Link>
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