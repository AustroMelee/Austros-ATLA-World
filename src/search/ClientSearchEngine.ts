// src/search/ClientSearchEngine.ts

import FlexSearch from 'flexsearch';
import type { EnrichedRecord } from '../types/domainTypes';

let index: FlexSearch.Document<EnrichedRecord, true> | null = null;
let recordMap: Map<string, EnrichedRecord> = new Map();
let initPromise: Promise<void> | null = null;

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
          index: ['name', 'description', 'tags', 'synonyms'],
          store: true,
        },
        tokenize: 'forward',
      });

      for (const key in data.index) {
        await index.import(key, data.index[key]);
      }
      
      recordMap = new Map(Object.entries(data.records));
      
    } catch (e) {
      console.error('Failed to initialize search engine:', e);
      initPromise = null; // Allow retrying on failure
      throw e;
    }
  })();
  return initPromise;
}

export async function search(query: string): Promise<EnrichedRecord[]> {
  await init();
  if (!index) return [];
  if (!query.trim()) return Array.from(recordMap.values());
  
  const searchResults = await index.searchAsync(query, { enrich: true });
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

  return finalResults;
}

export async function getAllByType(type: string): Promise<EnrichedRecord[]> {
  await init();
  const allRecords = Array.from(recordMap.values());
  return allRecords.filter(record => record.__type === type);
}

export async function getEntityBySlug(slug: string): Promise<EnrichedRecord | undefined> {
  await init();
  return recordMap.get(slug);
} 