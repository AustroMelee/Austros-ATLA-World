import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import type { EnrichedRecord } from '../types/domainTypes';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import * as PersonalizationEngine from '../search/PersonalizationEngine';

export interface AustrosSearchResult {
  results: EnrichedRecord[];
  topHit: { nation: string; name: string } | null;
  loading: boolean;
  error: string | null;
}

/**
 * A comprehensive search hook for the encyclopedia.
 * @param query - The search string.
 * @param initialLoadType - (Optional) The entity type to load by default and to filter search results by.
 */
export function useAustrosSearch(query: string): AustrosSearchResult {
  const debouncedQuery = useDebounce(query, 250);
  const [results, setResults] = useState<EnrichedRecord[]>([]);
  const [topHit, setTopHit] = useState<{ nation: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function doSearch() {
      setLoading(true);
      setError(null);
      try {
        const trimmedQuery = debouncedQuery.trim();
        if (!trimmedQuery) {
          setResults([]);
          setTopHit(null);
          setLoading(false);
          return;
        }
        await ClientSearchEngine.init();
        if (cancelled) return;
        const found = await ClientSearchEngine.search(trimmedQuery);
        if (cancelled) return;
        setResults(found);
        if (found.length > 0 && 'nation' in found[0] && found[0].nation && 'name' in found[0] && found[0].name) {
          setTopHit({ nation: found[0].nation, name: found[0].name });
        } else {
          setTopHit(null);
        }
        // **2. ADD TO RECENT SEARCHES**
        PersonalizationEngine.addRecentSearch(trimmedQuery);
      } catch(e) {
        console.error("Search hook error:", e);
        setError("Search failed to load.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    doSearch();
    return () => { cancelled = true; };
  }, [debouncedQuery]);

  return { results, topHit, loading, error };
}
