import React from 'react';
import { FaWind, FaTint, FaLeaf, FaFire, FaGlobe } from 'react-icons/fa';

interface NationIconProps {
  nation: string | undefined | null;
  size?: number;
  className?: string;
}

const iconMap: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
  // Lowercase mappings (for backward compatibility)
  'air nomads': { icon: FaWind, color: 'text-yellow-300' },
  'water tribe': { icon: FaTint, color: 'text-blue-400' },
  'southern water tribe': { icon: FaTint, color: 'text-blue-400' },
  'northern water tribe': { icon: FaTint, color: 'text-blue-400' },
  'earth kingdom': { icon: FaLeaf, color: 'text-green-400' },
  'fire nation': { icon: FaFire, color: 'text-red-400' },
  
  // Proper case mappings (for current data)
  'Air Nomads': { icon: FaWind, color: 'text-yellow-300' },
  'Water Tribe': { icon: FaTint, color: 'text-blue-400' },
  'Southern Water Tribe': { icon: FaTint, color: 'text-blue-400' },
  'Northern Water Tribe': { icon: FaTint, color: 'text-blue-400' },
  'Earth Kingdom': { icon: FaLeaf, color: 'text-green-400' },
  'Fire Nation': { icon: FaFire, color: 'text-red-400' },
  
  'default': { icon: FaGlobe, color: 'text-subtle' },
};

const NationIcon: React.FC<NationIconProps> = ({ nation, size = 18, className }) => {
  const key = nation || 'default';
  const { icon: Icon, color } = iconMap[key] || iconMap.default;
  return <Icon size={size} className={color + ' inline align-middle ' + (className || '')} aria-label={nation || 'Unknown nation'} />;
};

export default NationIcon; 