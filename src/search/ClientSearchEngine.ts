// src/search/ClientSearchEngine.ts

import FlexSearch from 'flexsearch';
import type { EnrichedRecord } from '../types/domainTypes';

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
  if (typeof record.name === 'string') base.name = lower(record.name);
  if (typeof record.description === 'string') base.description = lower(record.description);
  if ('nation' in record && typeof (record as { nation?: string }).nation === 'string') base.nation = lower((record as { nation?: string }).nation);
  if ('bending' in record && typeof (record as { bending?: string }).bending === 'string') base.bending = lower((record as { bending?: string }).bending);
  if ('role' in record && typeof (record as { role?: string }).role === 'string') base.role = lower((record as { role?: string }).role);
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
            { field: 'name', tokenize: 'forward' },
            { field: 'description', tokenize: 'forward' },
            { field: 'tags', tokenize: 'forward' },
            { field: 'synonyms', tokenize: 'forward' },
            { field: 'nation', tokenize: 'forward' },
            { field: 'bending', tokenize: 'forward' },
            { field: 'role', tokenize: 'forward' }
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
    // If the query is empty, return all available records.
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

  // Fallback logic
  if (finalResults.length === 0) {
    for (const record of recordMap.values()) {
      const name = typeof record.name === 'string' ? lower(record.name) : '';
      const slug = typeof record.slug === 'string' ? lower(record.slug) : '';
      if (name === normalizedQuery || slug === normalizedQuery) {
        if (!uniqueSlugs.has(slug)) {
          finalResults.push(record);
          uniqueSlugs.add(slug);
        }
      }
    }
  }

  return finalResults;
}

export async function getAllByType(type: string): Promise<EnrichedRecord[]> {
  await init();
  const allRecords = Array.from(recordMap.values());
  return allRecords.filter(record => typeof (record as { __type?: string }).__type === 'string' && (record as { __type: string }).__type === type);
}

export async function getEntityBySlug(slug: string): Promise<EnrichedRecord | undefined> {
  await init();
  return recordMap.get(slug);
} 