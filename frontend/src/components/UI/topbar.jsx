// src/components/UI/topbar.jsx
import React, { useState } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { useAuthContext } from '../../contexts/authContext'
import { useSidebar } from '../../hooks/useSidebar' // Notre hook de navigation dynamique
import { IMAGE_URL } from '../../constants/apiConstant'

const Topbar = () => {
  // On récupère les infos nécessaires du contexte
  const { firstname, email, role, signOut } = useAuthContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Authentifié si ID présent (plus robuste que firstname/email)
  const { userId } = useAuthContext()
  const isAuthenticated = !!userId

  // On récupère les liens de navigation selon le rôle via le hook useSidebar
  const navItems = useSidebar(role)

  // Calcul de l'initiale
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

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/30">
      <div className="max-w-[1700px] mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* GAUCHE : Logo + Navigation Principale */}
          <div className="flex items-center space-x-12">
            <Link className="flex-shrink-0" to="/">
              {/* Utilisation du logo.png comme demandé */}
              <img className="h-9 w-auto" src={`${IMAGE_URL}/logo.png`} alt="Crewly" />
            </Link>

            {/* Navigation Desktop filtrée dynamiquement par rôle */}
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

          {/* DROITE : Actions utilisateur (Connecté vs Déconnecté) */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              // --- ÉTAT CONNECTÉ ---
              <div className="flex items-center space-x-5 pl-5 border-l border-white/10">
                
                {/* Lien vers le Profil avec l'initiale */}
                <Link className="flex items-center space-x-3.5 group" to="/user">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-500/10 border-2 border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-black group-hover:border-teal-500 transition-all duration-300 shadow-inner">
                    <span className="font-extrabold text-base tracking-tight">
                      {userInitial}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors leading-none">
                      {firstname || (email ? email.split('@')[0] : 'Utilisateur')}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-extrabold mt-1">
                      {role || 'Membre'}
                    </span>
                  </div>
                </Link>

                {/* Bouton déconnexion discret mais accessible */}
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
              // --- ÉTAT DÉCONNECTÉ ---
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

      {/* Menu Mobile (Dropdown) */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-white/5 p-6 shadow-2xl animate-fade-in">
           {/* Liens dynamiques mobiles */}
           <div className="space-y-3 mb-6">
              {navItems.map((item) => (
                  <Link key={item.path} to={item.path} className="block text-xl font-bold text-white hover:text-teal-400" onClick={() => setIsMobileMenuOpen(false)}>
                    {item.label}
                  </Link>
              ))}
           </div>
           
           <hr className="border-white/5 mb-6" />
           
           {/* Actions utilisateur mobiles */}
           {isAuthenticated ? (
             <div className="space-y-3">
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
  )
}

export default Topbar