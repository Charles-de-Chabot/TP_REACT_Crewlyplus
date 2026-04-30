import React, { useState } from 'react';
import IconRenderer from '../UI/IconRenderer';
import { Upload, Shield, File, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

const DocumentVault = () => {
    const [files, setFiles] = useState([
        { id: 1, name: 'CNI_Chabot.pdf', type: 'Identité', status: 'verified', date: '22/04/2026' },
        { id: 2, name: 'Licence_FFV_2026.jpg', type: 'Licence', status: 'pending', date: '26/04/2026' }
    ]);

    const docTypes = [
        { label: 'Identité', icon: Shield },
        { label: 'Licence', icon: CheckCircle },
        { label: 'Médical', icon: File }
    ];

    return (
        <div className="bg-slate-950/40 backdrop-blur-md border border-white/5 border-t-white/15 rounded-2xl p-10 shadow-2xl shadow-black/50 overflow-hidden group transition-all duration-500 hover:border-gold-sanded/20 relative">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold-sanded/10 rounded-full blur-3xl group-hover:bg-gold-sanded/20 transition-all duration-700" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter flex items-center gap-3">
                    <IconRenderer icon="🛡️" size={24} className="text-gold-sanded bg-gold-sanded/10 p-1.5 rounded-lg" />
                    Mes Documents
                </h3>
                <span className="text-[9px] bg-gold-sanded/10 text-gold-sanded px-2 py-1 rounded border border-gold-sanded/20 font-black uppercase tracking-widest">
                    Secured
                </span>
            </div>

            <div className="space-y-8 relative z-10">
                {/* Dropzone */}
                <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 bg-white/[0.02] hover:bg-white/[0.05] hover:border-gold-sanded/30 transition-all group/drop cursor-pointer text-center">
                    <div className="flex flex-col items-center">
                        <Upload className="text-white/20 group-hover/drop:text-gold-sanded transition-colors mb-3" size={24} />
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Glisser vos documents</p>
                    </div>
                </div>

                {/* Types Selection */}
                <div className="grid grid-cols-3 gap-3">
                    {docTypes.map((type, i) => (
                        <button key={i} className="py-3 px-1 bg-white/[0.02] border border-white/5 rounded-xl hover:border-gold-sanded/30 hover:bg-gold-sanded/5 transition-all text-center group/type">
                            <type.icon className="mx-auto mb-1.5 text-white/20 group-hover/type:text-gold-sanded transition-colors" size={14} />
                            <span className="text-[8px] text-white/40 uppercase font-black tracking-tighter">{type.label}</span>
                        </button>
                    ))}
                </div>

                {/* File List */}
                <div className="space-y-2">
                    {files.map(file => (
                        <div key={file.id} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between group/file hover:bg-white/[0.04] transition-all">
                            <div className="flex items-center gap-4">
                                <File className="text-white/20" size={18} />
                                <div>
                                    <h4 className="text-xs font-bold text-white/80">{file.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[9px] text-gold-sanded/60 font-black uppercase tracking-widest">{file.type}</span>
                                        <span className="text-[9px] text-white/10">•</span>
                                        <span className="text-[9px] text-white/20 font-mono">{file.date}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {file.status === 'verified' ? (
                                    <CheckCircle size={14} className="text-green-500/60" />
                                ) : (
                                    <AlertCircle size={14} className="text-gold-sanded/60" />
                                )}
                                <button className="p-1 text-white/10 hover:text-red-500/60 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DocumentVault;
