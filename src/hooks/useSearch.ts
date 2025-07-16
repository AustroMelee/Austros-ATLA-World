import { useMemo } from 'react';
import FlexSearch from 'flexsearch';
import { preprocessEntities } from '../search/preprocessor';
import { matchEntity, resolveTokens } from '../search/engine';
import { tokenizeInput } from '../utils/tokenize';
import type { EnrichedEntity, IndexedEntity } from '../search/types';

export interface SearchResult {
  entity: EnrichedEntity;
  matchedFields: { field: string; token: string }[];
}

export function useSearch(allEntities: EnrichedEntity[], query: string): SearchResult[] {
  // All hooks are called unconditionally at the top level
  const indexedEntities = useMemo(() => {
    if (!allEntities || allEntities.length === 0) return [];
    return preprocessEntities(allEntities);
  }, [allEntities]);

  const index = useMemo(() => {
    if (indexedEntities.length === 0) return null;
    const idx = new FlexSearch.Document<IndexedEntity>({
      document: {
        id: 'id',
        index: ['name', 'searchBlob'],
      },
      tokenize: 'forward',
    });
    indexedEntities.forEach(doc => idx.add(doc));
    return idx;
  }, [indexedEntities]);

  const entityMap = useMemo(() => new Map(allEntities.map(e => [e.id, e])), [allEntities]);

  // Logic after hooks
  if (!query.trim()) {
    return allEntities.map((entity) => ({ entity, matchedFields: [] }));
  }

  if (!index) {
    return [];
  }

  // Tokenize and resolve tokens for match context
  const rawTokens = tokenizeInput(query);
  const searchTokens = resolveTokens(rawTokens);

  // Get unique matching IDs from FlexSearch
  const searchResults = index.search(query);
  const allMatchingIds = searchResults.flatMap(fieldResult => fieldResult.result);
  const uniqueIds = [...new Set(allMatchingIds)];

  // For each result, get match context using matchEntity
  const finalResults = uniqueIds
    .map(id => {
      const entity = entityMap.get(id as string);
      if (!entity) return null;
      const indexed = indexedEntities.find(e => e.id === id);
      if (!indexed) return null;
      const match = matchEntity(indexed, searchTokens);
      return match ? { entity, matchedFields: match.matchedFields } : null;
    })
    .filter(Boolean) as SearchResult[];

  return finalResults;
} 