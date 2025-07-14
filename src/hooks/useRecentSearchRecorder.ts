import { useEffect } from 'react';
import * as PersonalizationEngine from '../search/PersonalizationEngine';

/**
 * Records the given query as a recent search for personalization.
 * @param query The search query string
 */
export function useRecentSearchRecorder(query: string) {
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      PersonalizationEngine.addRecentSearch(trimmedQuery);
    }
  }, [query]);
}
