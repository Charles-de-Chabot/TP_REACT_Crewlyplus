import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'sonner';
import { AlertTriangle, Info, Gift, Settings } from 'lucide-react';
import AdminPageHeader from '../../components/Admin/AdminPageHeader';
import IconRenderer from '../../components/UI/IconRenderer';

const AdminNotifications = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('info');
    const [audience, setAudience] = useState('all');

    const handleBroadcast = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        try {
            const response = await api.post('/api/notifications/broadcast', { message, type, audience });
            toast.success(`Message envoyé avec succès à ${response.data.count} utilisateurs !`);
            setMessage('');
        } catch (error) {
            console.error("Error broadcasting:", error);
            toast.error("Erreur lors de l'envoi du message");
        } finally {
            setLoading(false);
        }
    };

    const notificationTypes = [
        { id: 'info', label: 'Information', icon: <Info size={16} />, color: 'blue' },
        { id: 'warning', label: 'Alerte', icon: <AlertTriangle size={16} />, color: 'orange' },
        { id: 'success', label: 'Promotion', icon: <Gift size={16} />, color: 'emerald' },
        { id: 'system', label: 'Maintenance', icon: <Settings size={16} />, color: 'slate' }
    ];

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <AdminPageHeader 
                title="Notifications"
                highlight="Globales"
                subtitle="Communiquez instantanément avec l'ensemble de la communauté."
            />

            <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <form onSubmit={handleBroadcast} className="space-y-8 relative">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Type de Message</label>
                            <div className="grid grid-cols-2 gap-3">
                                {notificationTypes.map((t) => (
                                    <button 
                                        key={t.id}
                                        type="button"
                                        onClick={() => setType(t.id)}
                                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                                            type === t.id 
                                            ? `bg-amber-500/10 border-amber-500/30 text-amber-400` 
                                            : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                                        }`}
                                    >
                                        {t.icon}
                                        <span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Audience Cible</label>
                            <div className="space-y-3">
                                {[
                                    { id: 'all', label: 'Tous les Utilisateurs', desc: 'Inclus moussaillons, pros et admins.' },
                                    { id: 'premium', label: 'Membres Premium Uniquement', desc: 'Segment stratégique CrewlyPlus.' }
                                ].map((a) => (
                                    <button 
                                        key={a.id}
                                        type="button"
                                        onClick={() => setAudience(a.id)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                            audience === a.id 
                                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                            : 'bg-white/5 border-transparent text-slate-500 hover:bg-white/10'
                                        }`}
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest">{a.label}</p>
                                        <p className="text-[9px] font-medium opacity-50 mt-0.5">{a.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Contenu du Message</label>
                        <div className="relative">
                            <textarea 
                                required
                                rows="4"
                                className="w-full bg-slate-950 border border-white/5 rounded-3xl p-6 text-white focus:border-amber-500/50 outline-none transition-all font-medium placeholder:text-slate-700 resize-none"
                                placeholder="Tapez votre message ici..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <div className="absolute bottom-6 right-6">
                                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                                    <IconRenderer icon="notifications" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button 
                            disabled={loading}
                            className="flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                            ) : (
                                <IconRenderer icon="🚀" size={18} />
                            )}
                            Diffuser le Message
                        </button>
                    </div>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Historique", text: "Les messages diffusés apparaissent dans le centre de notifications de chaque utilisateur." },
                    { title: "Impact", text: "Le broadcast est immédiat et irréversible une fois envoyé." },
                    { title: "Recommandation", text: "Utilisez le type 'Alerte' pour les urgences techniques uniquement." }
                ].map((item, idx) => (
                    <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">{item.title}</p>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminNotifications;
