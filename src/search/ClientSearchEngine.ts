// src/search/ClientSearchEngine.ts

import type { EnrichedRecord } from '../types/domainTypes';
import { loadIndex, getState } from './indexLoader';

function lower(str: unknown): string {
  return typeof str === 'string' ? str.toLowerCase() : '';
}

export { getState };

export async function search(query: string): Promise<EnrichedRecord[]> {
  const { index, recordMap } = await loadIndex();
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return Array.from(recordMap.values());
  }

  const searchResults: Array<{ field: string; result: Array<{ doc: EnrichedRecord }> }> = await index.searchAsync(normalizedQuery, { enrich: true });
  const uniqueSlugs = new Set<string>();
  const finalResults: EnrichedRecord[] = [];

  searchResults.forEach((fieldResult: { field: string; result: Array<{ doc: EnrichedRecord }> }) => {
    fieldResult.result.forEach((item: { doc: EnrichedRecord }) => {
      if (item.doc && !uniqueSlugs.has(item.doc.slug)) {
        finalResults.push(item.doc);
        uniqueSlugs.add(item.doc.slug);
      }
    });
  });

  if (finalResults.length === 0) {
    for (const record of recordMap.values()) {
      const rec = record as EnrichedRecord;
      const name = typeof rec.name === 'string' ? lower(rec.name) : '';
      const slug = typeof rec.slug === 'string' ? lower(rec.slug) : '';
      if (name.includes(normalizedQuery) || slug.includes(normalizedQuery)) {
        if (!uniqueSlugs.has(slug)) {
          finalResults.push(rec);
          uniqueSlugs.add(slug);
        }
      }
    }
  }

  return finalResults;
}

export async function getAllByType<T extends EnrichedRecord>(type: T['__type']): Promise<T[]> {
  const { recordMap } = await loadIndex();
  const allRecords = Array.from(recordMap.values());
  const filteredRecords = allRecords.filter(
    (record) => record.__type === type
  );
  return filteredRecords as T[];
}

export async function getEntityBySlug(slug: string): Promise<EnrichedRecord | undefined> {
  const { recordMap } = await loadIndex();
  return recordMap.get(slug);
} 