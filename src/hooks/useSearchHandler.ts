import { useState, useMemo } from 'react';
import { useAustrosSearch } from './useAustrosSearch';
import { useSuggestions } from './useSuggestions';
import type { EnrichedCharacter, EnrichedRecord } from '../types/domainTypes';

// Nation color mapping (reused from ThemedCard)
const nationThemeMap: Record<string, { main: string; glow: string }> = {
  'air nomads': { main: '#FF9933', glow: 'rgba(255, 153, 51, 0.15)' },
  'water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'southern water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'northern water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'earth kingdom': { main: '#559c41', glow: 'rgba(85, 156, 65, 0.15)' },
  'fire nation': { main: '#d93e3e', glow: 'rgba(217, 62, 62, 0.15)' },
  'default': { main: '#8b949e', glow: 'rgba(139, 148, 158, 0.05)' },
};

export function useSearchHandler() {
  const [query, setQuery] = useState('');
  const { results: searchResults, loading, error, topHit } = useAustrosSearch(query);

  // Filter searchResults to EnrichedCharacter[]
  const characterResults = useMemo(() =>
    (searchResults as EnrichedRecord[]).filter(
      (item): item is EnrichedCharacter => item.__type === 'character'
    ),
    [searchResults]
  );

  // Use the new useSuggestions hook
  const { suggestion } = useSuggestions(query, characterResults);

  // Text color logic
  const textColor = useMemo(() => {
    if (topHit && topHit.nation) {
      const nationKey = topHit.nation.toLowerCase();
      return nationThemeMap[nationKey]?.main || nationThemeMap.default.main;
    }
    return nationThemeMap.default.main;
  }, [topHit]);

  return {
    query,
    setQuery,
    searchResults,
    loading,
    error,
    topHit,
    suggestion,
    textColor,
  };
} 