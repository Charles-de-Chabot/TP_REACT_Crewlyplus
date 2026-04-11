import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/authContext'
import { IMAGE_URL } from '../../constants/apiConstant'

const Topbar = () => {
  const { firstname, email, signOut } = useAuthContext()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  // On considère l'utilisateur connecté s'il a un email ou un prénom dans le contexte
  const isAuthenticated = !!(email || firstname)

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      signOut()
      navigate('/')
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20">
      <div className="container mx-auto px-4">
        <div className="relative flex justify-end items-center h-16">
          {/* Logo - Centered */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Link className="flex items-center space-x-3" to="/">
              <img className="h-10 w-auto object-contain" src={`${IMAGE_URL}/logo.png`} alt="Crewly" />
            </Link>
          </div>


          {/* Actions utilisateur */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link className="flex items-center space-x-3 group" to="/user">
                  <div className="h-9 w-9 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-900 transition-all duration-300">
                    <span className="font-bold text-sm">
                      {firstname ? firstname.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {firstname || email}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors"
                >
                    Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" to="/login">
                  Connexion
                </Link>
                <Link className="flex items-center space-x-2 bg-teal-500 hover:bg-teal-400 text-slate-900 text-sm font-bold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5" to="/register">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                  </svg>
                  <span>S'inscrire</span>
                </Link>
              </>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button 
            id="mobile-menu-button" 
            className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none" 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 py-2 bg-slate-900/95 backdrop-blur-xl absolute left-0 right-0 shadow-xl animate-fade-in-down">
            <div className="px-2 space-y-1">

              {isAuthenticated ? (
                <>
                  <Link 
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10" 
                    to="/user"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Mon compte
                  </Link>
                  <button 
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:text-red-300 hover:bg-white/10" 
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10" 
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link 
                    className="block px-3 py-2 rounded-md text-base font-medium text-teal-400 hover:text-teal-300 hover:bg-white/10" 
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Topbar
