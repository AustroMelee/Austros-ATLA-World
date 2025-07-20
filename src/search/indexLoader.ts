import FlexSearch from 'flexsearch';
import type { EnrichedRecord, EnrichedCharacter } from '../types/domainTypes';

let index: FlexSearch.Document<EnrichedRecord, true> | null = null;
let recordMap: Map<string, EnrichedRecord> = new Map();
let loadPromise: Promise<void> | null = null;

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

  if (record.__type === 'character') {
    const char = record as EnrichedCharacter;
    if (char.nation) base.nation = lower(char.nation);
    if (char.bendingElement) base.bendingElement = lower(char.bendingElement);
    if (char.archetype) base.archetype = lower(char.archetype);
    if (char.moralAlignment) base.moralAlignment = lower(char.moralAlignment);
    if (char.gender) base.gender = lower(char.gender);
    if (char.tagCategories) {
      const allTags = Object.values(char.tagCategories || {}).flat();
      base.all_tags = lowerArray(allTags);
    }
  }

  if ('tags' in record && Array.isArray((record as { tags?: unknown }).tags)) base.tags = lowerArray((record as { tags?: unknown }).tags);
  if ('synonyms' in record && Array.isArray((record as { synonyms?: unknown }).synonyms)) base.synonyms = lowerArray((record as { synonyms?: unknown }).synonyms);

  return base;
}

export function getState() {
  return { isInitialized: !!index && recordMap.size > 0 };
}

export async function loadIndex(): Promise<{ index: FlexSearch.Document<EnrichedRecord, true>; recordMap: Map<string, EnrichedRecord> }> {
  if (!loadPromise) {
    loadPromise = (async () => {
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
            { field: 'bendingElement', tokenize: 'forward' },
            { field: 'archetype', tokenize: 'forward' },
            { field: 'moralAlignment', tokenize: 'forward' },
            { field: 'gender', tokenize: 'forward' },
            { field: 'all_tags', tokenize: 'forward' }
          ],
          store: true,
        }
      });
      const recordsArray: EnrichedRecord[] = Array.isArray(data.records)
        ? data.records
        : Object.values(data.records);

      // FIX: Use slug as the key to ensure proper deduplication
      // This prevents duplicate records with identical slugs from coexisting in the map
      recordMap = new Map(recordsArray.map(record => [record.slug, record]));
      for (const record of recordMap.values()) {
        index.add(buildIndexableRecord(record) as EnrichedRecord);
      }
    })().catch((e) => {
      loadPromise = null;
      console.error('Failed to load search index:', e);
      throw e;
    });
  }
  await loadPromise;
  return { index: index as FlexSearch.Document<EnrichedRecord, true>, recordMap };
} 