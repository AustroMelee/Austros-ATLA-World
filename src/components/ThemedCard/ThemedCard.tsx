import React from 'react';
// @ts-expect-error: no type declarations needed for constant-only module
// eslint-disable-next-line import/extensions
import { nationThemeMap } from '@/theme/nationThemes.ts';

interface ThemedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  nation?: string | null;
}

export default function ThemedCard({ children, nation, className, ...props }: ThemedCardProps) {
  const theme = nationThemeMap[nation || 'default'] || nationThemeMap.default;

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(22, 27, 34, 0.95)', // More opaque dark background
    backgroundImage: `radial-gradient(circle at 50% 0%, ${theme.glow} 0%, transparent 50%)`,
    borderColor: `${theme.main}20`, // 20% opacity border using theme color
    // @ts-expect-error --nation-color is a custom CSS property for theming
    '--nation-color': theme.main,
    '--nation-glow': `${theme.main}50`, // 50% opacity glow
    transform: 'translateZ(0)', // Force GPU acceleration
    backfaceVisibility: 'hidden', // Reduce painting
    perspective: '1000px', // Improve 3D performance
  };

  const baseClasses = `
    relative 
    overflow-hidden 
    rounded-xl 
    border 
    backdrop-blur-sm 
    transition-all 
    duration-300 
    ease-in-out
    hover:border-opacity-50
    hover:bg-opacity-100
    hover:backdrop-blur-md
    matrix-card-glow
    will-change-transform
    will-change-opacity
  `;

  return (
    <div
      className={`relative ${baseClasses} ${className || ''}`}
      style={cardStyle}
      {...props}
    >
      {children}
    </div>
  );
} 