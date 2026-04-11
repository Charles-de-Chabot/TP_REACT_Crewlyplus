import React from 'react';

const UserInfoCard = ({ userData }) => {
    return (
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl shadow-black/30 sticky top-28">
            <h3 className="text-xl font-bold text-white mb-4">Mes Informations</h3>
            <ul className="space-y-3 text-slate-400">
                <li><span className="font-semibold text-slate-300">Email :</span> {userData?.email}</li>
                {userData?.phone && (
                    <li><span className="font-semibold text-slate-300">Téléphone :</span> {userData?.phone}</li>
                )}
            </ul>
        </div>
    );
};

export default UserInfoCard;