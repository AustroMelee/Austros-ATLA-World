// Centralized nation theme color map for use across UI and hooks
export const nationThemeMap: Record<string, { main: string; glow: string }> = {
  // Lowercase mappings (for backward compatibility)
  'air nomads': { main: '#FF9933', glow: 'rgba(255, 153, 51, 0.15)' },
  'water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'southern water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'northern water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'earth kingdom': { main: '#559c41', glow: 'rgba(85, 156, 65, 0.15)' },
  'fire nation': { main: '#d93e3e', glow: 'rgba(217, 62, 62, 0.15)' },
  
  // Proper case mappings (for current data)
  'Air Nomads': { main: '#FF9933', glow: 'rgba(255, 153, 51, 0.15)' },
  'Water Tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'Southern Water Tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'Northern Water Tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'Earth Kingdom': { main: '#559c41', glow: 'rgba(85, 156, 65, 0.15)' },
  'Fire Nation': { main: '#d93e3e', glow: 'rgba(217, 62, 62, 0.15)' },
  
  'default': { main: '#8b949e', glow: 'rgba(139, 148, 158, 0.05)' },
};
