// src/search/types.ts

export interface EnrichedEntity {
  id: string;
  name: string;
  summary: string;
  metadata: Record<string, string | string[]>;
  tags?: string[];
  type: string;
}

export interface IndexedEntity {
  id: string;
  original: EnrichedEntity;
  searchBlob: string;
  fieldMap: Map<string, string[]>;
}

export interface SearchToken {
  type: 'global' | 'structured';
  key?: string;
  value: string;
}

export interface MatchResult {
  entityId: string;
  score: number;
  matchedFields: {
    field: string;
    token: string;
  }[];
} 