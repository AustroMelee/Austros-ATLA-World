import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import type { EnrichedRecord } from '../types/domainTypes';
import * as ClientSearchEngine from '../search/ClientSearchEngine';

export interface AustrosSearchResult {
  results: EnrichedRecord[];
  topHit: { nation: string } | null;
}

/**
 * useAustrosSearch
 * @param query - The search string
 * @returns { results, topHit }
 */
export function useAustrosSearch(query: string): AustrosSearchResult {
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState<EnrichedRecord[]>([]);
  const [topHit, setTopHit] = useState<{ nation: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function doSearch() {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setTopHit(null);
        return;
      }
      const found = await ClientSearchEngine.search(debouncedQuery);
      if (cancelled) return;
      setResults(found);
      if (found.length > 0 && 'nation' in found[0] && found[0].nation) {
        setTopHit({ nation: found[0].nation! });
      } else {
        setTopHit(null);
      }
    }
    doSearch();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  return { results, topHit };
}
