// src/search/preprocessor.ts
import type { EnrichedEntity, IndexedEntity } from './types';

/**
 * Creates a single, massive, searchable string from all relevant text fields
 * in an entity. This is used for global, unstructured searches.
 */
function createSearchBlob(record: EnrichedEntity): string {
  const textParts: (string | undefined)[] = [
    record.name,
    record.summary,
    record.role,
    record.nation,
    record.gender,
    ...(record.titles || []),
    ...(record.searchableKeywords || []),
    ...(record.fuzzySynonyms || []),
    ...(record.tags || []),
    ...(record.affiliation || []),
  ];
  if (record.tagCategories && typeof record.tagCategories === 'object') {
    for (const category of Object.values(record.tagCategories)) {
      if (Array.isArray(category)) textParts.push(...category);
    }
  }
  const uniqueParts = [...new Set(textParts.filter(Boolean).map(String))];
  return uniqueParts.join(' ').toLowerCase();
}

/**
 * Creates a normalized key-value map of all entity fields for structured
 * searching (e.g., "nation:fire nation").
 */
function createFieldMap(entity: EnrichedEntity): Map<string, string[]> {
  const map = new Map<string, string[]>();

  // Add all metadata fields directly
  if (entity.metadata) {
    for (const [key, value] of Object.entries(entity.metadata)) {
      if (value) {
        const values = (Array.isArray(value) ? value : [value])
          .map(String)
          .filter(Boolean)
          .map((v) => v.toLowerCase());
        if (values.length > 0) {
          map.set(key.toLowerCase(), values);
        }
      }
    }
  }
  
  // Add top-level tags
  if (entity.tags && entity.tags.length > 0) {
    map.set('tags', entity.tags.map((t) => t.toLowerCase()));
  }

  // Add a flattened 'tag' field containing ALL tags for easy searching
  const allTags: string[] = [...(entity.tags || [])];
  if (entity.metadata?.tagCategories && typeof entity.metadata.tagCategories === 'object') {
    for (const category of Object.values(entity.metadata.tagCategories)) {
      if (Array.isArray(category)) {
        allTags.push(...category);
      }
    }
  }
  if (allTags.length > 0) {
      map.set('tag', [...new Set(allTags)].map(t => t.toLowerCase()));
  }

  // Ensure 'name' is also in the map for targeted name searches
  map.set('name', [entity.name.toLowerCase()]);

  return map;
}

/**
 * Pre-processes an array of enriched entities into a format optimized for
 * fast, client-side searching. This should be run only once on app load.
 */
export function preprocessEntities(entities: EnrichedEntity[]): IndexedEntity[] {
  return entities.map((entity) => ({
    ...entity,
    searchBlob: createSearchBlob(entity),
  }));
} 