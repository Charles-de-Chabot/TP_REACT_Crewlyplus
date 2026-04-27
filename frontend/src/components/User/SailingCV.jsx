import React from 'react';
import { Anchor, Ship, Award, Compass } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const SailingCV = ({ profile }) => {
  if (!profile) return (
    <GlassCard className="mt-8 flex flex-col items-center justify-center py-12 text-center">
      <Anchor className="text-white/20 mb-4" size={48} />
      <h3 className="text-xl font-heading text-white">Aucun CV Nautique</h3>
      <p className="text-white/60 max-w-sm mt-2">
        Complétez votre profil pour rejoindre des équipages et participer à des régates exclusives.
      </p>
      <button className="mt-6 px-6 py-2 bg-cyan-electric/10 border border-cyan-electric/30 text-cyan-electric rounded-full hover:bg-cyan-electric/20 transition-all">
        Créer mon CV
      </button>
    </GlassCard>
  );

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-2xl font-heading text-white flex items-center gap-2">
        <Compass className="text-cyan-electric" /> Mon CV Nautique
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Milles parcourus */}
        <GlassCard className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-electric/10 flex items-center justify-center mb-4">
            <Ship className="text-cyan-electric" size={32} />
          </div>
          <span className="text-3xl font-heading text-white">{profile.milesSailed || 0}</span>
          <span className="text-white/40 text-xs uppercase tracking-widest mt-1">Milles parcourus</span>
        </GlassCard>

        {/* Position actuelle */}
        <GlassCard className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gold-sanded/10 flex items-center justify-center mb-4">
            <Anchor className="text-gold-sanded" size={32} />
          </div>
          <span className="text-xl font-heading text-white">{profile.currentPosition || 'Équipier'}</span>
          <span className="text-white/40 text-xs uppercase tracking-widest mt-1">Poste habituel</span>
        </GlassCard>

        {/* Palmarès / Achievements */}
        <GlassCard className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
            <Award className="text-white" size={32} />
          </div>
          <span className="text-3xl font-heading text-white">{profile.achievements?.length || 0}</span>
          <span className="text-white/40 text-xs uppercase tracking-widest mt-1">Récompenses</span>
        </GlassCard>
      </div>

      {/* Types de bateaux maîtrisés */}
      <GlassCard title="Bateaux maîtrisés">
        <h4 className="text-sm font-heading text-white/60 uppercase tracking-widest mb-4">Expérience sur supports</h4>
        <div className="flex flex-wrap gap-3">
          {profile.boatTypes?.map((type, index) => (
            <span key={index} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/80">
              {type}
            </span>
          )) || <p className="text-white/40 italic">Aucun support renseigné</p>}
        </div>
      </GlassCard>
    </div>
  );
};

export default SailingCV;
