// src/search/types.ts

export interface EnrichedEntity {
  id: string;
  name: string;
  summary: string;
  metadata: Record<string, string | string[]>;
  tags?: string[];
  type: string;
  // Added fields for search compatibility
  role?: string;
  nation?: string;
  gender?: string;
  titles?: string[];
  searchableKeywords?: string[];
  fuzzySynonyms?: string[];
  affiliation?: string[];
  tagCategories?: Record<string, string[]>;
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