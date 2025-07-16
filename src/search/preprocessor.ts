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

function createFieldMap(record: EnrichedEntity): Map<string, string[]> {
  const map = new Map<string, string[]>();
  // Add metadata fields
  if (record.metadata && typeof record.metadata === 'object') {
    for (const [key, value] of Object.entries(record.metadata)) {
      if (Array.isArray(value)) {
        map.set(key, value.map(String));
      } else if (typeof value === 'string') {
        map.set(key, [value]);
      }
    }
  }
  // Add top-level fields for structured search
  if (record.nation) map.set('nation', [String(record.nation)]);
  if (record.role) map.set('role', [String(record.role)]);
  if (record.gender) map.set('gender', [String(record.gender)]);
  if (record.titles) map.set('titles', record.titles.map(String));
  if (record.tags) map.set('tags', record.tags.map(String));
  if (record.affiliation) map.set('affiliation', record.affiliation.map(String));
  if (record.tagCategories && typeof record.tagCategories === 'object') {
    for (const [cat, arr] of Object.entries(record.tagCategories)) {
      if (Array.isArray(arr)) map.set(cat, arr.map(String));
    }
  }
  return map;
}

/**
 * Pre-processes an array of enriched entities into a format optimized for
 * fast, client-side searching. This should be run only once on app load.
 */
export function preprocessEntities(entities: EnrichedEntity[]): IndexedEntity[] {
  return entities.map((entity) => ({
    id: entity.id,
    original: entity,
    searchBlob: createSearchBlob(entity),
    fieldMap: createFieldMap(entity),
  }));
} 