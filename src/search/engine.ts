// src/search/engine.ts
import type { SearchToken, IndexedEntity, MatchResult } from './types';

export function resolveTokens(tokens: string[]): SearchToken[] {
  return tokens.map(token => {
    if (token.includes(':')) {
      const [key, ...valueParts] = token.split(':');
      const value = valueParts.join(':');
      if (key && value) {
        return { type: 'structured', key, value };
      }
    }
    return { type: 'global', value: token };
  });
}

export function matchEntity(entity: IndexedEntity, tokens: SearchToken[]): MatchResult | null {
  const matchedFields: MatchResult['matchedFields'] = [];

  for (const token of tokens) {
    let foundMatch = false;

    if (token.type === 'structured' && token.key) {
      const values = entity.fieldMap.get(token.key);
      if (values?.some(v => v.includes(token.value))) {
        foundMatch = true;
        matchedFields.push({ field: `metadata.${token.key}`, token: token.value });
      }
    } else {
      if (entity.searchBlob.includes(token.value)) {
        foundMatch = true;
        matchedFields.push({ field: 'global', token: token.value });
      }
    }

    if (!foundMatch) {
      return null;
    }
  }

  return {
    entityId: entity.id,
    score: 1,
    matchedFields,
  };
} 