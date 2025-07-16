import { useMemo } from 'react';
import FlexSearch from 'flexsearch';
import type { EnrichedEntity } from '../search/types';

interface MatchedField {
  field: string;
  token: string;
}

export function useSearch(
  allEntities: EnrichedEntity[],
  query: string,
): Array<{ entity: EnrichedEntity; matchedFields: MatchedField[] }> {
  // Build a map for quick lookup by id
  const entityMapById = useMemo(() => {
    const map = new Map<string, EnrichedEntity>();
    allEntities.forEach((entity) => map.set(entity.id, entity));
    return map;
  }, [allEntities]);

  // 1. Create a memoized FlexSearch index.
  const index = useMemo(() => {
    const newIndex = new FlexSearch.Document<EnrichedEntity>({
      document: {
        id: 'id',
        index: [
          'name',
          'nation',
          'role',
          'tags',
          'bendingElement',
        ],
      },
      tokenize: 'forward',
    });
    allEntities.forEach((entity) => {
      newIndex.add({ ...entity });
    });
    return newIndex;
  }, [allEntities]);

  // 2. Perform the search and process the results.
  return useMemo(() => {
    if (!query) {
      return allEntities.map((entity) => ({ entity, matchedFields: [] }));
    }
    const searchResults = index.search(query, { enrich: true }) as Array<{ field: string; result: string[] }>;
    const resultMap = new Map<string, { entity: EnrichedEntity; matchedFields: MatchedField[] }>();
    searchResults.forEach((fieldResult) => {
      const fieldName = fieldResult.field;
      fieldResult.result.forEach((id: string) => {
        const record = entityMapById.get(id);
        if (!record) return;
        if (!resultMap.has(id)) {
          resultMap.set(id, {
            entity: record,
            matchedFields: [{ field: fieldName, token: query }],
          });
        } else {
          const existing = resultMap.get(id)!;
          existing.matchedFields.push({ field: fieldName, token: query });
        }
      });
    });
    return Array.from(resultMap.values());
  }, [query, index, allEntities, entityMapById]);
} 