
import React from 'react';
import { CharacterType } from '../types';

interface ClimberProps {
  type: CharacterType;
  // Added avatar prop to support customization from the store
  avatar?: {
    baseColor: string;
    hat: string;
    gear: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  isMoving?: boolean;
}

export const Climber: React.FC<ClimberProps> = ({ 
  type, 
  avatar, // Destructure avatar from props
  size = 'md', 
  className = '', 
  isMoving = false 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-32 h-32',
    lg: 'w-56 h-56'
  };

  const renderCharacter = () => {
    // Determine colors with fallbacks to original character designs if items are default or "none"
    const colors = {
      base: (avatar?.baseColor && avatar.baseColor !== 'none' && avatar.baseColor !== '#e2e8f0') ? avatar.baseColor : null,
      hat: (avatar?.hat && avatar.hat !== 'none') ? avatar.hat : null,
      gear: (avatar?.gear && avatar.gear !== 'none') ? avatar.gear : null,
    };

    switch (type) {
      case 'llama':
        return (
          <g>
            {/* Llama Head & Neck */}
            <path d="M40,50 L40,25 Q40,15 50,15 Q60,15 60,25 L60,50" fill={colors.base || "#FFF"} stroke="#333" strokeWidth="2" />
            <circle cx="45" cy="25" r="2" fill="#333" />
            <circle cx="55" cy="25" r="2" fill="#333" />
            {/* Ears */}
            <path d="M42,15 L38,5" fill={colors.base || "#FFF"} stroke="#333" />
            <path d="M58,15 L62,5" fill={colors.base || "#FFF"} stroke="#333" />
            {/* Poncho / Gear */}
            <path d="M30,50 L70,50 L80,80 L20,80 Z" fill={colors.gear || "#EF4444"} stroke="#333" strokeWidth="2" />
            <path d="M20,65 L80,65 M20,72 L80,72" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4 2" />
            {/* Poles */}
            <line x1="25" x2="25" y1="60" y2="95" stroke="#4B5563" strokeWidth="3" />
            <line x1="75" x2="75" y1="60" y2="95" stroke="#4B5563" strokeWidth="3" />
            {/* Legs */}
            <rect x="42" y="80" width="6" height="15" fill={colors.base || "#FFF"} stroke="#333" />
            <rect x="52" y="80" width="6" height="15" fill={colors.base || "#FFF"} stroke="#333" />
          </g>
        );
      case 'leopard':
        return (
          <g>
            {/* Leopard Body */}
            <circle cx="50" cy="30" r="15" fill={colors.base || "#FBBF24"} stroke="#333" strokeWidth="2" />
            {/* Spots */}
            <circle cx="45" cy="25" r="2" fill="#333" />
            <circle cx="55" cy="35" r="1.5" fill="#333" />
            {/* Helmet / Hat */}
            <path d="M35,25 Q50,10 65,25 Z" fill={colors.hat || "#F59E0B"} stroke="#333" strokeWidth="2" />
            {/* Jacket / Gear */}
            <rect x="35" y="45" width="30" height="35" rx="8" fill={colors.gear || "#10B981"} stroke="#333" strokeWidth="2" />
            <path d="M35,55 L65,55" stroke="#FBBF24" strokeWidth="3" />
            {/* Sunglasses */}
            <rect x="40" y="28" width="20" height="5" rx="2" fill="#111" />
            {/* Poles */}
            <line x1="30" x2="20" y1="50" y2="90" stroke="#333" strokeWidth="3" />
            <line x1="70" x2="80" y1="50" y2="90" stroke="#333" strokeWidth="3" />
            {/* Tail */}
            <path d="M65,70 Q80,85 75,95" fill="none" stroke={colors.base || "#FBBF24"} strokeWidth="5" strokeLinecap="round" />
          </g>
        );
      case 'guineapig':
        return (
          <g>
            {/* Guinea Pig Body */}
            <ellipse cx="50" cy="60" rx="25" ry="20" fill={colors.base || "#D97706"} stroke="#333" strokeWidth="2" />
            {/* Dress / Gear */}
            <path d="M30,60 L70,60 L80,85 L20,85 Z" fill={colors.gear || "#DC2626"} stroke="#333" strokeWidth="2" />
            {/* Polka Dots */}
            <circle cx="40" cy="70" r="3" fill="#FFF" />
            <circle cx="60" cy="75" r="3" fill="#FFF" />
            <circle cx="50" cy="80" r="3" fill="#FFF" />
            {/* Head */}
            <circle cx="50" cy="45" r="18" fill={colors.base || "#F59E0B"} stroke="#333" strokeWidth="2" />
            {/* Bandana / Hat */}
            <path d="M35,35 Q50,25 65,35 L65,45 Q50,35 35,45 Z" fill={colors.hat || "#DC2626"} />
            {/* Poles */}
            <line x1="25" x2="20" y1="60" y2="95" stroke="#333" strokeWidth="2" />
            <line x1="75" x2="80" y1="60" y2="95" stroke="#333" strokeWidth="2" />
          </g>
        );
      case 'elephant':
        return (
          <g>
            {/* Elephant Head */}
            <circle cx="50" cy="40" r="20" fill={colors.base || "#94A3B8"} stroke="#333" strokeWidth="2" />
            {/* Ears */}
            <path d="M30,40 Q10,20 20,60 Z" fill={colors.base || "#94A3B8"} stroke="#333" strokeWidth="2" />
            <path d="M70,40 Q90,20 80,60 Z" fill={colors.base || "#94A3B8"} stroke="#333" strokeWidth="2" />
            {/* Trunk */}
            <path d="M50,45 Q40,65 30,60" fill="none" stroke={colors.base || "#94A3B8"} strokeWidth="8" strokeLinecap="round" />
            {/* Traditional Garment / Gear */}
            <rect x="30" y="60" width="40" height="30" rx="4" fill={colors.gear || "#991B1B"} stroke="#333" strokeWidth="2" />
            <path d="M30,65 L70,85" stroke="#FBBF24" strokeWidth="5" opacity="0.8" />
            {/* Poles */}
            <line x1="25" x2="25" y1="70" y2="98" stroke="#333" strokeWidth="3" />
            <line x1="75" x2="75" y1="70" y2="98" stroke="#333" strokeWidth="3" />
          </g>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} flex items-center justify-center transition-transform duration-300 ${isMoving ? 'scale-110' : 'scale-100'}`}>
      <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-xl ${isMoving ? 'animate-bounce' : ''}`}>
        {renderCharacter()}
      </svg>
    </div>
  );
};
