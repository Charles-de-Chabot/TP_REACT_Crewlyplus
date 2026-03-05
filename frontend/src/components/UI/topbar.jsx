import React from 'react'
import { useAuthContext } from '../../contexts/authContext'
import { IMAGE_URL } from '../../constants/apiConstant';

const Topbar = () => {
    // On récupère firstname et signOut
    const { firstname, email, signOut } = useAuthContext();

    return (
        <div className='h-16 flex items-center shadow-md'>
            <div className="flex-1 text-white text-lg font-semibold ml-2">
                {/* On affiche le firstname ou l'email si pas de pseudo */}
                Bienvenue {firstname || email}
            </div>
            <div className="">
                <img src={`${IMAGE_URL}/logo.png`} alt="Crewly" />
            </div>
            <div className="">
                <button onClick = {() => {
                    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) signOut();
                }}
                className="link-sidebar"
                >
                    Déconnexion
                </button>
            </div>
        </div>
    )
}

export default Topbar
