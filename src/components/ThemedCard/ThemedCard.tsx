import React from 'react';

interface ThemedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  nation?: string | null;
}

const nationThemeMap: Record<string, { main: string; glow: string }> = {
  'air nomads': { main: '#FF9933', glow: 'rgba(255, 153, 51, 0.15)' },
  'water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'southern water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'northern water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'earth kingdom': { main: '#559c41', glow: 'rgba(85, 156, 65, 0.15)' },
  'fire nation': { main: '#d93e3e', glow: 'rgba(217, 62, 62, 0.15)' },
  'default': { main: '#8b949e', glow: 'rgba(139, 148, 158, 0.05)' },
};

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