
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '../../contexts/authContext'
import { IMAGE_URL } from '../../constants/apiConstant'

const Footer = () => {
    const { email, firstname, signOut } = useAuthContext()
    const isAuthenticated = !!(email || firstname)

    return (
        <footer className="bg-slate-900/50 border-t border-white/10 mt-auto backdrop-blur-sm">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Logo et description */}
                    <div className="col-span-1 lg:col-span-2">
                        <Link className="inline-block mb-4" to="/">
                            <img src={`${IMAGE_URL}/logo.png`} alt="Crewly" className="h-10 w-auto object-contain" />
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
                            La plateforme de location de bateaux pour les passionnés de navigation. Réservez votre navire, partez à l'aventure et explorez de nouveaux horizons.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors" aria-label="Facebook">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                        <path strokeDasharray="24" d="M17 4l-2 0c-2.5 0 -4 1.5 -4 4v12"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="24;0"/></path>
                                        <path strokeDasharray="10" strokeDashoffset="10" d="M8 12h7"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" to="0"/></path>
                                    </g>
                                </svg>
                            </a>
                            <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors" aria-label="Twitter">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <g fill="currentColor">
                                        <path d="M1 2h2.5l15 20h-2.5ZM5.5 2h2.5l15 20h-2.5Z"><animate fill="freeze" attributeName="d" dur="0.4s" values="M1 2h2.5l0 0h-2.5ZM5.5 2h2.5l-0.8 0h-2.5Z;M1 2h2.5l15 20h-2.5ZM5.5 2h2.5l15 20h-2.5Z"/></path>
                                        <path d="M3 2h5v0h-5ZM16 22h5v0h-5Z"><animate fill="freeze" attributeName="d" begin="0.4s" dur="0.4s" to="M3 2h5v2h-5ZM16 22h5v-2h-5Z"/></path>
                                        <path d="M18.5 2h3.5l0 0h-3.5Z"><animate fill="freeze" attributeName="d" begin="0.5s" dur="0.4s" to="M18.5 2h3.5l-17 20h-3.5Z"/></path>
                                    </g>
                                </svg>
                            </a>
                            <a href="#" className="text-slate-500 hover:text-teal-400 transition-colors" aria-label="Instagram">
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                                        <path strokeDasharray="66" d="M16 3c2.76 0 5 2.24 5 5v8c0 2.76 -2.24 5 -5 5h-8c-2.76 0 -5 -2.24 -5 -5v-8c0 -2.76 2.24 -5 5 -5h4Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="66;0"/></path>
                                        <path strokeDasharray="28" strokeDashoffset="28" d="M12 8c2.21 0 4 1.79 4 4c0 2.21 -1.79 4 -4 4c-2.21 0 -4 -1.79 -4 -4c0 -2.21 1.79 -4 4 -4"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.7s" dur="0.6s" to="0"/></path>
                                    </g>
                                    <circle cx="17" cy="7" r="1.5" fill="currentColor" opacity="0"><animate fill="freeze" attributeName="opacity" begin="1.3s" dur="0.2s" to="1"/></circle>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Navigation</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/" className="text-slate-400 hover:text-teal-400 flex items-center space-x-2 transition-colors">
                                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81zM12 3L2 12h3v8h6v-6h2v6h6v-8h3z"/></svg>
                                    <span>Accueil</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/boats" className="text-slate-400 hover:text-teal-400 flex items-center space-x-2 transition-colors">
                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m3 13.5l8-11.47V13.5zm9.5 0c1.35-3.75 1.17-8.79 0-12.5c4.76 1.54 8.4 7.4 8.46 12.5zm8.6 3.58c-.41.64-.89 1.19-1.45 1.66c-.65-.29-1.23-.74-1.69-1.24c-1.49 1.93-4.5 1.93-5.99 0c-1.47 1.93-4.5 1.93-5.97 0c-.5.5-1.05.95-1.7 1.24c-1.14-.94-2-2.28-2.3-3.74h19.94a6.4 6.4 0 0 1-.84 2.08M20.96 23q-1.59 0-3-.75c-1.84 1-4.15 1-5.99 0c-1.84 1-4.15 1-5.97 0c-1.23.69-2.64.8-4 .75v-2c1.41.05 2.77-.1 4-1c1.74 1.25 4.21 1.25 5.97 0c1.77 1.25 4.23 1.25 5.99 0c1.21.9 2.58 1.05 3.98 1v2z"/></svg>
                                    <span>La flotte</span>
                                </Link>
                            </li>
                            {isAuthenticated && (
                                <li>
                                    <Link to="#" className="text-slate-400 hover:text-teal-400 flex items-center space-x-2 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                        </svg>
                                        <span>Mes réservations</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Compte */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Compte</h4>
                        <ul className="space-y-3">
                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <Link to="/user" className="text-slate-400 hover:text-teal-400 flex items-center space-x-2 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            <span>Mon profil</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={signOut} className="text-slate-400 hover:text-red-400 flex items-center space-x-2 transition-colors w-full text-left">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                            </svg>
                                            <span>Déconnexion</span>
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login" className="text-slate-400 hover:text-teal-400 flex items-center space-x-2 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                            </svg>
                                            <span>Connexion</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/register" className="text-slate-400 hover:text-teal-400 flex items-center space-x-2 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                            </svg>
                                            <span>S'inscrire</span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                {/* RGPD et copyright */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} Crewly. Tous droits réservés.
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <a className="hover:text-white transition-colors" href="#">Mentions légales</a>
                            <a className="hover:text-white transition-colors" href="#">CGU</a>
                            <a className="hover:text-white transition-colors" href="#">Politique de confidentialité</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
