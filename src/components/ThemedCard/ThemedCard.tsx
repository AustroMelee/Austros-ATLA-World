import React from 'react';
// @ts-expect-error: no type declarations needed for constant-only module
// eslint-disable-next-line import/extensions
import { nationThemeMap } from '@/theme/nationThemes.ts';

interface ThemedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  nation?: string | null;
}

export default function ThemedCard({ children, nation, className, ...props }: ThemedCardProps) {
  const theme = nationThemeMap[nation?.toLowerCase() || 'default'] || nationThemeMap.default;

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-surface, #161B22)',
    backgroundImage: `radial-gradient(circle at 50% 0%, ${theme.glow} 0%, transparent 50%)`,
    borderColor: 'var(--nation-color, #8b949e)',
    // @ts-expect-error --nation-color is a custom CSS property for theming
    '--nation-color': theme.main,
  };

  const baseClasses = `relative overflow-hidden rounded-xl border transition-all duration-300 ease-in-out`;

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