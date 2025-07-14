// src/search/ClientSearchEngine.ts

import FlexSearch from 'flexsearch';
import type { EnrichedRecord, EnrichedCharacter } from '../types/domainTypes';

let index: FlexSearch.Document<EnrichedRecord, true> | null = null;
let recordMap: Map<string, EnrichedRecord> = new Map();
let initPromise: Promise<void> | null = null;

function lower(str: unknown): string {
  return typeof str === 'string' ? str.toLowerCase() : '';
}
function lowerArray(arr: unknown): string[] {
  return Array.isArray(arr) ? arr.map(lower).filter(Boolean) : [];
}

function buildIndexableRecord(record: EnrichedRecord): Record<string, unknown> {
  const base: Record<string, unknown> = { ...record };
  
  // Lowercase standard fields for consistent searching
  if (typeof record.name === 'string') base.name = lower(record.name);
  if (typeof record.description === 'string') base.description = lower(record.description);

  // Handle character-specific fields
  if (record.__type === 'character') {
    const char = record as EnrichedCharacter;
    if (char.nation) base.nation = lower(char.nation);
    if (char.bendingElement) base.bendingElement = lower(char.bendingElement);
    if (char.archetype) base.archetype = lower(char.archetype);
    if (char.moralAlignment) base.moralAlignment = lower(char.moralAlignment);
    // Add gender to the indexable record
    if (char.gender) base.gender = lower(char.gender);
    
    // Flatten all tags from tagCategories into a single searchable array
    if (char.tagCategories) {
      const allTags = Object.values(char.tagCategories || {}).flat();
      base.all_tags = lowerArray(allTags);
    }
  }

  // Handle other type-specific fields if necessary
  if ('tags' in record && Array.isArray((record as { tags?: unknown }).tags)) base.tags = lowerArray((record as { tags?: unknown }).tags);
  if ('synonyms' in record && Array.isArray((record as { synonyms?: unknown }).synonyms)) base.synonyms = lowerArray((record as { synonyms?: unknown }).synonyms);

  return base;
}

export function getState() {
  return { isInitialized: !!index && recordMap.size > 0 };
}

export function init(): Promise<void> {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      if (getState().isInitialized) return;

      const res = await fetch('/search-index.json');
      if (!res.ok) throw new Error(`Failed to fetch search-index.json: ${res.statusText}`);
      const data = await res.json();

      if (!data.index || !data.records) {
        throw new Error('Invalid search-index.json format');
      }

      index = new FlexSearch.Document<EnrichedRecord, true>({
        document: {
          id: 'slug',
          index: [
            // Core fields
            { field: 'name', tokenize: 'forward' },
            { field: 'description', tokenize: 'forward' },
            { field: 'tags', tokenize: 'forward' },
            { field: 'synonyms', tokenize: 'forward' },
            // Expanded character fields
            { field: 'nation', tokenize: 'forward' },
            { field: 'bendingElement', tokenize: 'forward' },
            { field: 'archetype', tokenize: 'forward' },
            { field: 'moralAlignment', tokenize: 'forward' },
            // Add gender to the index configuration
            { field: 'gender', tokenize: 'forward' },
            // The new flattened tag field for comprehensive tag searching
            { field: 'all_tags', tokenize: 'forward' }
          ],
          store: true,
        }
      });

      recordMap = new Map(Object.entries(data.records));
      for (const record of recordMap.values()) {
        index.add(buildIndexableRecord(record) as EnrichedRecord);
      }
    } catch (e) {
      console.error('Failed to initialize search engine:', e);
      initPromise = null;
      throw e;
    }
  })();
  return initPromise;
}

export async function search(query: string): Promise<EnrichedRecord[]> {
  await init();
  if (!index) return [];

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return Array.from(recordMap.values());
  }

  const searchResults = await index.searchAsync(normalizedQuery, { enrich: true });
  const uniqueSlugs = new Set<string>();
  const finalResults: EnrichedRecord[] = [];

  searchResults.forEach(fieldResult => {
    fieldResult.result.forEach(item => {
      if (item.doc && !uniqueSlugs.has(item.doc.slug)) {
        finalResults.push(item.doc);
        uniqueSlugs.add(item.doc.slug);
      }
    });
  });

  if (finalResults.length === 0) {
    for (const record of recordMap.values()) {
      const name = typeof record.name === 'string' ? lower(record.name) : '';
      const slug = typeof record.slug === 'string' ? lower(record.slug) : '';
      if (name.includes(normalizedQuery) || slug.includes(normalizedQuery)) {
        if (!uniqueSlugs.has(slug)) {
          finalResults.push(record);
          uniqueSlugs.add(slug);
        }
      }
    }
  }

  return finalResults;
}

export async function getAllByType<T extends EnrichedRecord>(type: T['__type']): Promise<T[]> {
  await init();
  const allRecords = Array.from(recordMap.values());
  const filteredRecords = allRecords.filter(
    (record) => record.__type === type
  );
  return filteredRecords as T[];
}

export async function getEntityBySlug(slug: string): Promise<EnrichedRecord | undefined> {
  await init();
  return recordMap.get(slug);
} 