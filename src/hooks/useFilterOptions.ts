import { useMemo } from 'react';
import type { EnrichedCharacter } from '../types/domainTypes';
import { filterConfig } from '../config/filterConfig';

// Helper to safely access nested properties from a string path
function getNestedValue(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce((o, key) => (o && typeof o === 'object' && o !== null && key in o)
      ? (o as Record<string, unknown>)[key]
      : undefined, obj);
}

interface UseFilterOptionsArgs {
  initialItems: EnrichedCharacter[];
}

export function useFilterOptions({ initialItems }: UseFilterOptionsArgs) {
  return useMemo(() => {
    const out: Record<string, string[]> = {};
    if (initialItems.length === 0) return out;

    filterConfig.forEach(group => {
      group.filters.forEach(({ key }) => {
        const values = new Set<string>();
        initialItems.forEach(item => {
          const char = item as EnrichedCharacter;
          if (key === 'isBender') {
            values.add(char.isBender ? 'Bender' : 'Non-bender');
            return;
          }
          const propValue = getNestedValue(char, key);
          if (Array.isArray(propValue)) {
            propValue.forEach(v => typeof v === 'string' && v && values.add(v.toLowerCase()));
          } else if (typeof propValue === 'string' && propValue) {
            values.add(propValue.toLowerCase());
          }
        });
        out[key] = Array.from(values).sort();
      });
    });
    return out;
  }, [initialItems]);
}

export default useFilterOptions; 