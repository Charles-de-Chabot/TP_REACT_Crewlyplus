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
    
    // Équipage (Crew)
    '👨‍✈️': LuIcons.LuUserCheck || LuIcons.LuUser,
    '👨‍🍳': LuIcons.LuUtensils || LuIcons.LuChefHat,
    '⚜️': LuIcons.LuSparkles || LuIcons.LuCrown,
    
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
    '🛥️': LuIcons.LuShip || RiIcons.RiShip2Line,
    '📐': LuIcons.LuRuler || LuIcons.LuDraftingCompass,
    '📏': LuIcons.LuRuler,
    '🚫': LuIcons.LuBan || LuIcons.LuUserMinus,
    
    // Contact & Comms
    '📧': LuIcons.LuMail,
    '📱': LuIcons.LuSmartphone,
    '📞': LuIcons.LuPhone || LuIcons.LuPhoneCall,
    '💬': LuIcons.LuMessageSquare,
    
    // Finance & Dates
    '💰': LuIcons.LuWallet,
    '💳': LuIcons.LuCreditCard,
    '📅': LuIcons.LuCalendar,
    '⏰': LuIcons.LuTimer || LuIcons.LuClock,
    '📊': LuIcons.LuBarChart || LuIcons.LuBarChart3,

    // Divers
    '✏️': LuIcons.LuPenLine || LuIcons.LuPencil,
    'ℹ️': LuIcons.LuInfo,
    '🗑️': LuIcons.LuTrash2 || LuIcons.LuTrash,
    '➡️': LuIcons.LuArrowRight,
    '⬅️': LuIcons.LuArrowLeft,
    '🚀': LuIcons.LuSend,
    '📈': LuIcons.LuTrendingUp,
    '⭐': LuIcons.LuStar,
    '👥': LuIcons.LuUsers || LuIcons.LuUsers2,
    '🖼️': LuIcons.LuImage,
    '🚪': LuIcons.LuLogOut || LuIcons.LuLogout || LuIcons.LuExternalLink,
    '🍔': LuIcons.LuMenu,
    '🔄': LuIcons.LuRefreshCw || LuIcons.LuRotateCcw,
    '🔍': LuIcons.LuSearch,
    '➕': LuIcons.LuPlus,
    '🛡️': LuIcons.LuShield || LuIcons.LuShieldCheck,
    '🏁': LuIcons.LuFlag || LuIcons.LuTrophy,
    '📂': LuIcons.LuFolder || LuIcons.LuFolderOpen,
    '⚠️': LuIcons.LuAlertTriangle || LuIcons.LuAlertCircle,
    '🏆': LuIcons.LuTrophy,

    'warning': LuIcons.LuAlertTriangle || LuIcons.LuTriangleAlert || Hi2Icons.HiExclamationTriangle,
    'gift': LuIcons.LuGift || Hi2Icons.HiGift,
    'info': LuIcons.LuInfo || Hi2Icons.HiInformationCircle,
    'settings': LuIcons.LuSettings || Hi2Icons.HiCog6Tooth,
    'dashboard': LuIcons.LuLayoutDashboard || LuIcons.LuBarChart || LuIcons.LuBarChart3,
    'users': LuIcons.LuUsers || LuIcons.LuUsers2,
    'teams': LuIcons.LuShield || LuIcons.LuShieldCheck,
    'boats': LuIcons.LuSailboat || RiIcons.RiShip2Line,
    'catalog': LuIcons.LuFolder || LuIcons.LuFolderOpen,
    'regattas': LuIcons.LuFlag || LuIcons.LuTrophy,
    'positions': LuIcons.LuAnchor,
    'notifications': LuIcons.LuBell || LuIcons.LuBellRing,

    '✏️': LuIcons.LuPenLine || LuIcons.LuPencil,
    '👁️': LuIcons.LuEye,
    '👁️‍🗨️': LuIcons.LuEyeOff || LuIcons.LuEye,

    // Technique Bateau (Nouveaux)
    '📏': LuIcons.LuRuler,
    'length': LuIcons.LuRuler,
    '↔️': LuIcons.LuArrowsHorizontal || Hi2Icons.HiArrowsRightLeft,
    'width': LuIcons.LuArrowsHorizontal || Hi2Icons.HiArrowsRightLeft,
    '🛏️': LuIcons.LuBed || LuIcons.LuBedSingle,
    'bed': LuIcons.LuBed || LuIcons.LuBedSingle,
    '⛽': LuIcons.LuFuel || LuIcons.LuContainer,
    'fuel': LuIcons.LuFuel || LuIcons.LuContainer,
    '🏠': LuIcons.LuHome,
    'home': Hi2Icons.HiHome || Hi2Icons.HiOutlineHome || LuIcons.LuMapPin,
    '🌐': LuIcons.LuGlobe,
    'globe': LuIcons.LuGlobe,
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
