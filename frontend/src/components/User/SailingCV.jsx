import React, { useState } from 'react';
import { Anchor, Ship, Award, Compass, Trophy, ChevronDown, ChevronUp } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const SailingCV = ({ profile, memberships = [] }) => {
  const [expandedRegId, setExpandedRegId] = useState(null);

  const formatRank = (rank) => {
    if (!rank) return '';
    const r = Math.round(rank);
    return `${r}${r === 1 ? 'er' : 'ème'}`;
  };

  const palmares = memberships.reduce((acc, m) => {
    if (m.team?.registrations) {
      m.team.registrations.forEach(reg => {
        if (reg.regatta) {
          const stats = reg.dailyStats || [];
          const avgRank = stats.length > 0 
            ? stats.reduce((sum, s) => sum + (parseInt(s.ranking) || 0), 0) / stats.length
            : null;

          acc.push({
            id: reg.id,
            name: reg.regatta.name,
            date: reg.regatta.startDate,
            location: reg.regatta.location,
            position: reg.finalPosition,
            status: reg.status,
            dailyStats: stats,
            avgRanking: avgRank,
            teamName: m.team.name,
            myRole: m.position?.label || 'Équipier'
          });
        }
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(b.date) - new Date(a.date));

  const usualPosition = (() => {
    if (palmares.length === 0) return profile?.position || profile?.currentPosition || 'Équipier';
    const counts = {};
    palmares.forEach(reg => { counts[reg.myRole] = (counts[reg.myRole] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  })();

  const getStatusLabel = (reg) => {
    if (reg.position) return `${reg.position}${reg.position === 1 ? 'er' : 'ème'}`;
    return reg.status === 'CONFIRMED' ? 'En cours' : reg.status === 'PENDING' ? 'En attente' : 'Finie';
  };

  const toggleExpand = (id) => setExpandedRegId(expandedRegId === id ? null : id);

  return (
    <div className="mt-4 space-y-8">
      {/* Statistiques en haut, directement sur la page */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
        <div className="flex flex-col items-center text-center">
          <Ship className="text-slate-400 mb-1" size={24} />
          <span className="text-3xl font-heading text-white">{profile?.milesSailed || 0}</span>
          <span className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">Milles parcourus</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Anchor className="text-gold-sanded mb-1" size={24} />
          <span className="text-xl font-heading text-white">{usualPosition}</span>
          <span className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">Poste habituel</span>
        </div>
        <div className="flex flex-col items-center text-center">
          <Award className="text-white mb-1" size={24} />
          <span className="text-3xl font-heading text-white">{palmares.length}</span>
          <span className="text-white/40 text-[10px] uppercase font-black tracking-[0.2em]">Régates officielles</span>
        </div>
      </div>

      {/* Palmarès sans container */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2 mb-4">
          <h3 className="text-[11px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2">
            <Trophy size={14} /> Palmarès Officiel
          </h3>
          <div className="h-px flex-1 bg-white/5 mx-6"></div>
          <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors border border-white/10 px-4 py-1.5 rounded-full">
            Générer PDF
          </button>
        </div>

        <div className="space-y-1">
          {palmares.length > 0 ? palmares.map((reg) => (
            <div key={reg.id} className="relative transition-all duration-300">
              <div 
                onClick={() => toggleExpand(reg.id)}
                className={`flex items-center justify-between py-4 px-4 transition-all duration-300 cursor-pointer group rounded-2xl ${
                  expandedRegId === reg.id 
                  ? 'bg-white/[0.04] shadow-lg' 
                  : 'hover:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center gap-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    expandedRegId === reg.id 
                    ? 'bg-amber-500/10 border-gold-sanded/30 text-gold-sanded' 
                    : 'bg-white/[0.02] border-white/5 text-white/10 group-hover:border-white/10'
                  }`}>
                    <Trophy size={16} className={reg.position <= 3 && expandedRegId !== reg.id ? "text-gold-sanded/40" : ""} />
                  </div>
                  <div>
                    <h4 className={`text-base font-bold transition-all duration-500 flex items-center gap-3 ${
                      expandedRegId === reg.id ? 'text-gold-sanded' : 'text-white/80 group-hover:text-white'
                    }`}>
                      {reg.name}
                      {reg.avgRanking && (
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                          expandedRegId === reg.id 
                          ? 'bg-amber-500/10 border-gold-sanded/20 text-gold-sanded/80' 
                          : 'bg-white/5 border-white/5 text-white/40'
                        }`}>
                          {formatRank(reg.avgRanking)}
                        </span>
                      )}
                    </h4>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] flex items-center gap-2">
                      {new Date(reg.date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })} • {reg.location}
                      {expandedRegId === reg.id ? <ChevronUp size={12} className="text-white/40" /> : <ChevronDown size={12} className="text-white/10 group-hover:text-white/20" />}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-white/40 font-bold group-hover:text-white/60 transition-colors uppercase tracking-widest">{reg.teamName}</p>
                  <span className={`text-[10px] font-black uppercase tracking-tighter transition-all ${
                    reg.position ? 'text-gold-sanded/60' : 'text-slate-500'
                  }`}>
                    {getStatusLabel(reg)}
                  </span>
                </div>
              </div>

              {expandedRegId === reg.id && (
                <div className="mx-6 pb-6 pt-2 animate-in fade-in slide-in-from-top-1 duration-300 border-t border-white/[0.05]">
                  {reg.dailyStats.length === 0 ? (
                    <p className="text-center py-4 text-[10px] uppercase text-white/20 tracking-widest italic font-medium">Données de course non disponibles</p>
                  ) : (
                    <div className="overflow-x-auto mt-2">
                      <table className="w-full text-[11px]">
                        <thead>
                          <tr className="text-white/20 uppercase tracking-widest border-b border-white/[0.05]">
                            <th className="text-left py-3 font-black">Jour</th>
                            <th className="text-center py-3 font-black">Classement</th>
                            <th className="text-center py-3 font-black">Distance (nm)</th>
                            <th className="text-center py-3 font-black">Angle (°)</th>
                            <th className="text-center py-3 font-black">Vitesse Moy.</th>
                            <th className="text-center py-3 font-black">Vitesse Max</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...reg.dailyStats].sort((a,b) => a.dayNumber - b.dayNumber).map((day) => (
                            <tr key={day.id} className="border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 font-black text-slate-400">J{day.dayNumber}</td>
                              <td className="text-center py-3 font-bold text-white/70">{day.ranking || '-'}</td>
                              <td className="text-center py-3 font-bold text-white/70">{day.milesSailed || '0'}</td>
                              <td className="text-center py-3 font-bold text-white/70">{day.upwindAngle || '-'}°</td>
                              <td className="text-center py-3 font-bold text-white/70">{day.avgSpeed || '-'} <span className="text-[9px] opacity-20">kts</span></td>
                              <td className="text-center py-3 font-bold text-white/70">{day.maxSpeed || '-'} <span className="text-[9px] opacity-20">kts</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-12 opacity-10">
              <Award size={48} className="mx-auto mb-4" />
              <p className="text-[12px] uppercase font-black tracking-[0.3em]">Aucun palmarès enregistré</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SailingCV;
