import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import type { EnrichedRecord } from '../types/domainTypes';
import * as ClientSearchEngine from '../search/ClientSearchEngine';

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
export function useAustrosSearch(query: string, initialLoadType?: string): AustrosSearchResult {
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
        await ClientSearchEngine.init();
        if (cancelled) return;

        let found: EnrichedRecord[] = [];
        
        if (!debouncedQuery.trim()) {
          if (initialLoadType) {
            found = await ClientSearchEngine.getAllByType(initialLoadType);
          } else {
            // If no type is specified, return all records.
            found = await ClientSearchEngine.search("");
          }
        } else {
          // If query is present, perform a global search.
          found = await ClientSearchEngine.search(debouncedQuery);
          // **THE FIX:** If an initialLoadType is provided, filter the search results.
          if (initialLoadType) {
            found = found.filter(item => item.__type === initialLoadType);
          }
        }

        if (cancelled) return;

        setResults(found);

        if (found.length > 0 && 'nation' in found[0] && found[0].nation && 'name' in found[0] && found[0].name) {
          setTopHit({ nation: found[0].nation, name: found[0].name });
        } else {
          setTopHit(null);
        }
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
  }, [debouncedQuery, initialLoadType]);

  return { results, topHit, loading, error };
}
