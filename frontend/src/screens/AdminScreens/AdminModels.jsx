import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import IconRenderer from '../../components/UI/IconRenderer';
import AdminPageHeader from '../../components/Admin/AdminPageHeader';
import { toast } from 'sonner';

const AdminModels = () => {
    const [models, setModels] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLabel, setNewLabel] = useState('');
    const [activeTab, setActiveTab] = useState('models'); // 'models' or 'types'

    const fetchData = async () => {
        setLoading(true);
        try {
            const [modelsRes, typesRes] = await Promise.all([
                api.get('/api/models'),
                api.get('/api/types')
            ]);
            setModels(modelsRes.data['member'] || modelsRes.data['hydra:member'] || []);
            setTypes(typesRes.data['member'] || typesRes.data['hydra:member'] || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Erreur lors de la récupération des données");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newLabel.trim()) return;

        try {
            const endpoint = activeTab === 'models' ? '/api/models' : '/api/types';
            const response = await api.post(endpoint, { label: newLabel });
            
            if (activeTab === 'models') {
                setModels([...models, response.data]);
            } else {
                setTypes([...types, response.data]);
            }
            
            setNewLabel('');
            toast.success(`${activeTab === 'models' ? 'Modèle' : 'Type'} ajouté avec succès`);
        } catch (error) {
            console.error("Error adding item:", error);
            toast.error("Erreur lors de l'ajout");
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ? Cela pourrait affecter les bateaux liés.")) return;

        try {
            const endpoint = type === 'models' ? `/api/models/${id}` : `/api/types/${id}`;
            await api.delete(endpoint);
            
            if (type === 'models') {
                setModels(models.filter(m => m.id !== id));
            } else {
                setTypes(types.filter(t => t.id !== id));
            }
            toast.success("Élément supprimé");
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Impossible de supprimer (probablement lié à un bateau)");
        }
    };

    const currentItems = activeTab === 'models' ? models : types;

    return (
        <div className="space-y-8">
            <AdminPageHeader 
                title="Catalogue"
                highlight="Technique"
                subtitle="Gérez les modèles de navires et les types de coques."
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-4 p-1 bg-white/5 rounded-2xl w-fit">
                    <button 
                        onClick={() => setActiveTab('models')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'models' ? 'bg-pink-500 text-slate-950 shadow-lg shadow-pink-500/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Modèles ({models.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('types')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'types' ? 'bg-pink-500 text-slate-950 shadow-lg shadow-pink-500/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Types ({types.length})
                    </button>
                </div>

                <form onSubmit={handleAdd} className="flex gap-3 w-full md:w-auto">
                    <input 
                        type="text" 
                        placeholder={`Nouveau ${activeTab === 'models' ? 'modèle' : 'type'}...`}
                        className="flex-1 md:w-64 bg-slate-900/50 border border-white/5 rounded-2xl py-3 px-4 text-white focus:border-pink-500/50 outline-none transition-all placeholder:text-slate-600 font-bold"
                        value={newLabel}
                        onChange={(e) => setNewLabel(e.target.value)}
                    />
                    <button className="bg-pink-500 hover:bg-pink-400 text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-pink-500/20 active:scale-95">
                        Ajouter
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {loading ? (
                    Array(10).fill(0).map((_, i) => (
                        <div key={i} className="h-24 bg-slate-900/40 border border-white/5 rounded-3xl animate-pulse" />
                    ))
                ) : currentItems.map((item, index) => (
                    <div key={item.id || index} className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-5 hover:border-pink-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500/0 via-pink-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-start justify-between">
                            <span className="text-xs font-black text-white uppercase tracking-tighter italic break-words pr-6">
                                {item.label}
                            </span>
                            <button 
                                onClick={() => handleDelete(item.id, activeTab)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <IconRenderer icon="🗑️" size={12} />
                            </button>
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-600">ID #{item.id}</span>
                            <div className="w-6 h-6 rounded-lg bg-pink-500/5 flex items-center justify-center">
                                <IconRenderer icon={activeTab === 'models' ? '🛥️' : '📐'} size={12} className="text-pink-500/30" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminModels;
