import FlexSearch from 'flexsearch';
import { preprocessEntities } from './preprocessor';
import type { EnrichedEntity, IndexedEntity } from './types';

export interface BuiltIndex {
  index: FlexSearch.Document<IndexedEntity>;
  entityMap: Map<string, EnrichedEntity>;
}

export function buildIndex(docs: EnrichedEntity[]): BuiltIndex {
  const indexed = preprocessEntities(docs);
  const index = new FlexSearch.Document<IndexedEntity>({
    doc: {
      id: 'id',
      field: ['name', 'searchBlob']
    },
    store: true,
    tokenize: 'forward',
  });
  indexed.forEach(doc => index.add(doc));

  const entityMap = new Map(docs.map(e => [e.id, e]));

  return { index, entityMap };
} 