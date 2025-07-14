import { useState, useMemo } from 'react';
import { useAustrosSearch } from './useAustrosSearch';
import { useSuggestions } from './useSuggestions';
import { useNationColor } from './useNationColor';
import type { EnrichedCharacter, EnrichedRecord } from '../types/domainTypes';

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

  // Use the new useNationColor hook
  const textColor = useNationColor(topHit);

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