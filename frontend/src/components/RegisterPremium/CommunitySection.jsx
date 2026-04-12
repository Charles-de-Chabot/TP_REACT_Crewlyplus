import React from 'react';

const CommunitySection = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32 items-center">
            <div>
                <h2 className="text-4xl font-black italic uppercase mb-8">Plus qu'un abonnement,<br/><span className="text-teal-500">Un équipage.</span></h2>
                <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                    <p>Crewly Premium brise l'isolement du skipper. En rejoignant l'élite, vous accédez à notre **moteur de recherche de profil**. Besoin d'un régleur de spi en urgence pour la Semaine de Porquerolles ? Trouvez-le parmi des milliers de passionnés notés par la communauté.</p>
                    <p>Définissez votre **rôle fétiche à bord**, partagez vos expériences et chattez en direct avec vos futurs coéquipiers. C'est ici que les meilleures victoires se préparent, bien avant de toucher l'eau.</p>
                </div>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-1 border border-white/10 rounded-[3rem]">
                 <div className="bg-slate-950/50 p-10 rounded-[2.9rem] text-center">
                    <div className="text-teal-400 font-bold mb-4">Fonctionnalités Sociales :</div>
                    <ul className="text-left space-y-4 text-sm text-slate-400">
                        <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-teal-500 rounded-full"></span> Messagerie instantanée de team</li>
                        <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-teal-500 rounded-full"></span> Création de rôles (Barreur, Piano, Tactique...)</li>
                        <li className="flex items-center gap-3"><span className="h-1.5 w-1.5 bg-teal-500 rounded-full"></span> Classement mondial des équipages</li>
                    </ul>
                 </div>
            </div>
        </div>
    );
};

export default CommunitySection;