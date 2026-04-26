import React from 'react';
import { Link } from 'react-router-dom';
import IconRenderer from './IconRenderer';

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
                        <IconRenderer icon="❌" size={24} />
                    </button>
                </div>

                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {notifications.length === 0 ? (
                        <div className="text-center py-12">
                            <IconRenderer icon="🔔" size={48} className="text-slate-800 mb-4 opacity-20" />
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
                                        className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                                            notif.is_open ? 'text-slate-500 hover:text-teal-500' : 'text-teal-500 hover:text-teal-400'
                                        }`}
                                    >
                                        Voir mon dashboard
                                        <IconRenderer icon="➡️" size={12} />
                                    </Link>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(notif.id);
                                        }}
                                        className="text-[9px] font-bold text-slate-500 hover:text-red-400 uppercase flex items-center gap-1.5 transition-colors"
                                    >
                                        <IconRenderer icon="🗑️" size={14} />
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
                            className="w-full py-3 text-[10px] font-black text-red-400/70 hover:text-red-400 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group/clear"
                        >
                            <IconRenderer icon="🗑️" size={16} className="group-hover/clear:scale-110" />
                            Tout supprimer
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationModal;
