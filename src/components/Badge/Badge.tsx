import React from 'react';

/**
 * Badge component for displaying status, nation, bending, etc.
 * @param label - The text to display inside the badge.
 * @param type - The badge type (e.g., 'nation', 'bending', 'age', 'custom').
 * @param variant - Visual variant (e.g., 'primary', 'secondary'). Optional.
 * @param color - Optional custom Tailwind color classes (overrides type mapping).
 */
export interface BadgeProps {
  label: string;
  type: 'nation' | 'bending' | 'age' | 'custom';
  variant?: 'primary' | 'secondary' | 'subtle';
  color?: string; // e.g. 'bg-green-800 text-green-100'
}

// Color mapping for badge types
const typeColorMap: Record<string, string> = {
  nation: 'bg-blue-800 text-blue-100',
  bending: 'bg-orange-800 text-orange-100',
  age: 'bg-slate-800 text-slate-300',
  custom: 'bg-slate-700 text-slate-200',
};

// Variant mapping for additional styling
const variantMap: Record<string, string> = {
  primary: 'shadow font-semibold',
  secondary: 'opacity-80',
  subtle: 'opacity-60',
};

export const Badge: React.FC<BadgeProps> = ({ label, type, variant = 'primary', color }) => {
  const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 hover:scale-105 hover:ring-2 hover:ring-blue-300 motion-reduce:transition-none';
  const colorClass = color || typeColorMap[type] || typeColorMap.custom;
  const variantClass = variantMap[variant] || '';
  return (
    <span className={`${base} ${colorClass} ${variantClass}`}>{label}</span>
  );
}; 