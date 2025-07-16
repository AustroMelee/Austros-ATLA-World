import type { EnrichedEntity } from '../search/types';

export function getField<T = string>(item: EnrichedEntity, key: string): T | undefined {
  const base = item as unknown as Record<string, unknown>;
  if (base[key] !== undefined) return base[key] as T;
  if (item.metadata && item.metadata[key] !== undefined) {
    return item.metadata[key] as unknown as T;
  }
  return undefined;
}
