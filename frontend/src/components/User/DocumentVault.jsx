import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard';
import { Upload, Shield, File, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const DocumentVault = () => {
    const [files, setFiles] = useState([
        { id: 1, name: 'CNI_Chabot.pdf', type: 'Identité', status: 'verified', date: '22/04/2026' },
        { id: 2, name: 'Licence_FFV_2026.jpg', type: 'Licence', status: 'pending', date: '26/04/2026' }
    ]);

    const docTypes = [
        { label: 'Carte d\'identité', icon: Shield },
        { label: 'Licence FFV', icon: CheckCircle },
        { label: 'Certificat Médical', icon: File }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Shield className="text-cyan-400" size={24} />
                    Coffre-fort Numérique
                </h2>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded border border-cyan-500/30 font-mono">
                    AES-256 ENCRYPTED
                </span>
            </div>

            {/* Dropzone */}
            <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/50 transition-all group cursor-pointer text-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="text-cyan-400" size={32} />
                    </div>
                    <h3 className="text-white font-bold mb-2">Glissez vos documents ici</h3>
                    <p className="text-white/40 text-sm max-w-xs mx-auto">
                        PDF, JPG ou PNG. Vos fichiers sont stockés hors-ligne de manière sécurisée.
                    </p>
                </div>
            </div>

            {/* Types Selection */}
            <div className="grid grid-cols-3 gap-4">
                {docTypes.map((type, i) => (
                    <button key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-center group">
                        <type.icon className="mx-auto mb-2 text-white/40 group-hover:text-cyan-400 transition-colors" size={20} />
                        <span className="text-[10px] text-white/60 uppercase font-bold">{type.label}</span>
                    </button>
                ))}
            </div>

            {/* File List */}
            <div className="space-y-3">
                {files.map(file => (
                    <GlassCard key={file.id} className="p-4 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                <File className="text-white/40" size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">{file.name}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] text-cyan-400 uppercase font-mono">{file.type}</span>
                                    <span className="text-[10px] text-white/20">•</span>
                                    <span className="text-[10px] text-white/40">{file.date}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            {file.status === 'verified' ? (
                                <div className="flex items-center gap-1 text-green-400 text-[10px] font-bold uppercase">
                                    <CheckCircle size={12} /> Vérifié
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-gold-sanded text-[10px] font-bold uppercase">
                                    <AlertCircle size={12} /> En attente
                                </div>
                            )}
                            <button className="p-2 text-white/20 hover:text-red-400 transition-colors">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};

export default DocumentVault;
