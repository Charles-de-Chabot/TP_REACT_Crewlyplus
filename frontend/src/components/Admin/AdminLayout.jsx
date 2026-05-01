import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import IconRenderer from '../UI/IconRenderer';
import { IMAGE_URL } from '../../constants/apiConstant';


const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleRefresh = () => {
        // Recharge la page courante pour rafraîchir les données
        window.location.reload();
    };

    const menuItems = [
        { path: '/admin', label: 'Dashboard', icon: 'dashboard' },
        { path: '/admin/users', label: 'Utilisateurs', icon: 'users' },
        { path: '/admin/teams', label: 'Équipes', icon: 'teams' },
        { path: '/admin/boats', label: 'Bateaux', icon: 'boats' },
        { path: '/admin/catalog', label: 'Catalogue', icon: 'catalog' },
        { path: '/admin/regattas', label: 'Régates', icon: 'regattas' },
        { path: '/admin/positions', label: 'Positions', icon: 'positions' },
        { path: '/admin/notifications', label: 'Notifications', icon: 'notifications' },

    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200 selection:bg-teal-500/30">
            {/* Sidebar */}
            <aside 
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 transition-all duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:w-20'}`}
            >
                <div className="h-full flex flex-col">
                    {/* Header Sidebar */}
                    <div className="p-6 flex items-center justify-between">
                        <Link to="/" className={`flex items-center gap-3 transition-all duration-500 ${!isSidebarOpen && 'lg:opacity-0 pointer-events-none'}`}>
                            <img className="h-9 w-auto" src={`${IMAGE_URL}/logo.png`} alt="Crewly" />
                        </Link>

                        <button 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white"
                        >
                            <IconRenderer icon={isSidebarOpen ? "⬅️" : "➡️"} size={20} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                                    isActive(item.path) 
                                    ? 'bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 text-white' 
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                                }`}
                            >
                                {isActive(item.path) && (
                                    <div className="absolute left-0 w-1 h-6 bg-teal-500 rounded-r-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                                )}
                                <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive(item.path) ? 'text-teal-400' : 'opacity-50'}`}>
                                    <IconRenderer icon={item.icon} size={20} />
                                </div>
                                <span className={`font-bold text-sm tracking-tight transition-all duration-300 ${!isSidebarOpen && 'lg:hidden opacity-0'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    {/* Footer Sidebar */}
                    <div className="p-6 border-t border-white/5">
                        <Link 
                            to="/user"
                            className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                                <IconRenderer icon="👤" size={24} />
                            </div>
                            <div className={`transition-all duration-500 ${!isSidebarOpen && 'lg:hidden opacity-0'}`}>
                                <p className="text-xs font-black uppercase text-white tracking-tighter">Administrateur</p>
                                <p className="text-[10px] text-slate-500 font-bold italic">Dashboard Control</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-20 bg-slate-950/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">
                                {menuItems.find(i => isActive(i.path))?.label || 'Administration'}
                            </h1>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                <span>CrewlyPlus</span>
                                <span className="text-slate-800">/</span>
                                <span className="text-teal-500">Admin Area</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                            <IconRenderer icon="🔔" size={20} />
                        </button>
                        <div className="h-8 w-[1px] bg-white/5" />
                        <button 
                            onClick={handleRefresh}
                            className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white"
                        >
                            <IconRenderer icon="🔄" size={14} className="text-teal-400" />
                            <span>Refresh Data</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
                    <div className="max-w-7xl mx-auto animate-fadein">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
