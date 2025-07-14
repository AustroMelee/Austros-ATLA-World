import React from 'react';
import { FaWind, FaTint, FaLeaf, FaFire, FaGlobe } from 'react-icons/fa';

interface NationIconProps {
  nation: string | undefined | null;
  size?: number;
  className?: string;
}

const iconMap: Record<string, { icon: React.ComponentType<{ size?: number; className?: string }>; color: string }> = {
  'air nomads': { icon: FaWind, color: 'text-yellow-300' },
  'water tribe': { icon: FaTint, color: 'text-blue-400' },
  'southern water tribe': { icon: FaTint, color: 'text-blue-400' },
  'northern water tribe': { icon: FaTint, color: 'text-blue-400' },
  'earth kingdom': { icon: FaLeaf, color: 'text-green-400' },
  'fire nation': { icon: FaFire, color: 'text-red-400' },
  'default': { icon: FaGlobe, color: 'text-subtle' },
};

const NationIcon: React.FC<NationIconProps> = ({ nation, size = 18, className }) => {
  const key = (nation || '').toLowerCase();
  const { icon: Icon, color } = iconMap[key] || iconMap.default;
  return <Icon size={size} className={color + ' inline align-middle ' + (className || '')} aria-label={nation || 'Unknown nation'} />;
};

export default NationIcon; 