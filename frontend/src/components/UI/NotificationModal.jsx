import React from 'react';
import { Link } from 'react-router-dom';

const NotificationModal = ({ isOpen, onClose, notifications, onDelete, onRead, isStaff }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in cursor-pointer"
            onClick={onClose}
        >
            <div 
                className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slideup cursor-default"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
                        <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Notifications</h3>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                        title="Fermer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 font-bold italic text-sm">Aucune nouvelle notification.</p>
                        </div>
                    ) : (
                        notifications.map((notif) => (
                            <div 
                                key={notif.id} 
                                onClick={() => !notif.is_open && onRead(notif.id)}
                                className={`p-4 border rounded-2xl transition-all group relative cursor-pointer ${
                                    notif.is_open 
                                    ? 'bg-white/2 border-white/5 opacity-40 grayscale-[0.5]' 
                                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                                }`}
                            >
                                {!notif.is_open && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                                )}
                                <p className={`text-sm font-medium mb-3 leading-relaxed ${notif.is_open ? 'text-slate-400' : 'text-white'}`}>
                                    {notif.label}
                                </p>
                                <div className="flex justify-between items-center">
                                    <Link 
                                        to={isStaff ? "/crew/dashboard" : "/user"} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (!notif.is_open) onRead(notif.id);
                                            onClose();
                                        }}
                                        className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                                            notif.is_open ? 'text-slate-500 hover:text-teal-500' : 'text-teal-500 hover:text-teal-400'
                                        }`}
                                    >
                                        Voir mon dashboard →
                                    </Link>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(notif.id);
                                        }}
                                        className="text-[9px] font-bold text-slate-500 hover:text-red-400 uppercase flex items-center gap-1.5 transition-colors"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {notifications.length > 0 && (
                    <div className="p-4 bg-slate-950/50 border-t border-white/5">
                        <button 
                            onClick={() => onDelete('all')}
                            className="w-full py-3 text-[10px] font-black text-red-400/70 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Tout supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationModal;
