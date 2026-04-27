import React from 'react';
import PremiumBadge from '../ui/PremiumBadge';
import { MapPin, Calendar } from 'lucide-react';

const RegattaHero = ({ regatta }) => {
    return (
        <div className="relative h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544413647-ad342f02693b?q=80&w=2070')] bg-cover bg-center" />
            
            <div className="container mx-auto px-4 relative z-20 h-full flex flex-col justify-end pb-12">
                <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4 text-glow-cyan">
                    {regatta.name}
                </h1>
                <div className="flex flex-wrap gap-6 text-white/80">
                    <div className="flex items-center gap-2">
                        <MapPin className="text-cyan-400" size={20} />
                        <span>{regatta.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="text-cyan-400" size={20} />
                        <span>
                            {new Date(regatta.startDate).toLocaleDateString('fr-FR')} - {new Date(regatta.endDate).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegattaHero;
