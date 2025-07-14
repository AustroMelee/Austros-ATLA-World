import { useMemo } from 'react';
import type { EnrichedCharacter } from '../types/domainTypes';

export function useSuggestions(query: string, searchResults: EnrichedCharacter[]) {
  const suggestion = useMemo(() => {
    if (!query || !searchResults.length) return '';
    const q = query.trim().toLowerCase();
    const first = searchResults.find(item => {
      if (typeof item.name !== 'string') return false;
      const words = item.name.toLowerCase().split(/\s+/);
      return words.some(word => word.startsWith(q)) && item.name.length > q.length;
    });
    if (first && typeof first.name === 'string') {
      const name = first.name;
      const lowerName = name.toLowerCase();
      const matchIndex = lowerName.indexOf(q);
      if (matchIndex !== -1 && matchIndex + q.length < name.length) {
        return name.slice(matchIndex + q.length);
      }
    }
    return '';
  }, [query, searchResults]);

  return { suggestion };
} 