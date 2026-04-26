import React from 'react';
import * as LuIcons from 'react-icons/lu';
import * as Hi2Icons from 'react-icons/hi2';
import * as RiIcons from 'react-icons/ri';

/**
 * MAPPING DES EMOJIS VERS LES ICONES "RÉGATE TECH"
 * Correction des noms pour éviter les 'undefined'
 */
const ICON_MAP = {
    // Profil & Identité
    '👤': LuIcons.LuUser || LuIcons.LuUserCircle,
    '🆔': LuIcons.LuFingerprint,
    '📛': LuIcons.LuBadge,
    'Role': LuIcons.LuAnchor,
    
    // Actions & Statut
    '📷': LuIcons.LuCamera,
    '⌛': LuIcons.LuLoader,
    '✅': LuIcons.LuCheckCircle || LuIcons.LuCheck,
    '❌': LuIcons.LuXCircle || LuIcons.LuX,
    '🔔': LuIcons.LuBell || LuIcons.LuBellRing,
    '⚙️': LuIcons.LuSettings || LuIcons.LuSettings2,
    
    // Navigation & Localisation
    '📍': LuIcons.LuMapPin || LuIcons.LuNavigation,
    '🗺️': LuIcons.LuMap,
    '⚓': LuIcons.LuAnchor,
    '⛵': LuIcons.LuSailboat,
    '🚤': RiIcons.RiShip2Line || LuIcons.LuShip,
    
    // Contact & Comms
    '📧': LuIcons.LuMail,
    '📱': LuIcons.LuSmartphone,
    '📞': LuIcons.LuPhone || LuIcons.LuPhoneCall,
    '💬': LuIcons.LuMessageSquare,
    
    // Finance & Dates
    '💰': LuIcons.LuWallet,
    '📅': LuIcons.LuCalendar,
    '⏰': LuIcons.LuTimer || LuIcons.LuClock,
    '📊': LuIcons.LuBarChart || LuIcons.LuBarChart3,

    // Divers
    '✏️': LuIcons.LuPenLine || LuIcons.LuPencil,
    'ℹ️': LuIcons.LuInfo,
    '🗑️': LuIcons.LuTrash2 || LuIcons.LuTrash,
    '➡️': LuIcons.LuArrowRight,
    '📈': LuIcons.LuTrendingUp,
    '⭐': LuIcons.LuStar,
    '👥': LuIcons.LuUsers || LuIcons.LuUsers2,
    '🖼️': LuIcons.LuImage,
    '🚪': LuIcons.LuLogOut || LuIcons.LuLogout || LuIcons.LuExternalLink,
    '🍔': LuIcons.LuMenu,

    // Technique Bateau (Nouveaux)
    '📏': LuIcons.LuRuler,
    '↔️': LuIcons.LuArrowsHorizontal || Hi2Icons.HiArrowsRightLeft,
    '🛏️': LuIcons.LuBed || LuIcons.LuBedSingle,
    '⛽': LuIcons.LuFuel || LuIcons.LuContainer,
    '🏠': LuIcons.LuHome,
    '🌐': LuIcons.LuGlobe,
};

const IconRenderer = ({ 
    icon, 
    size = 20, 
    className = "", 
    animate = false 
}) => {
    // Récupération sécurisée du composant
    const IconComponent = ICON_MAP[icon] || LuIcons.LuHelpCircle || (() => <span>?</span>);

    // Sécurité supplémentaire : si IconComponent est undefined malgré tout
    if (!IconComponent) {
        return <span className={className}>?</span>;
    }

    return (
        <span className={`inline-flex items-center justify-center transition-all duration-300 ${className}`}>
            <IconComponent 
                size={size} 
                className={`${animate ? 'animate-spin' : ''} ${className.includes('hover') ? 'group-hover:scale-110' : ''}`}
            />
        </span>
    );
};

export default IconRenderer;
