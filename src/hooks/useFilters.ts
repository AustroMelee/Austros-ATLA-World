import { useState, useMemo, useCallback } from 'react';
import type { EnrichedCharacter } from '../types/domainTypes';

// Helper to safely access nested properties from a string path
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((o, key) => (o && typeof o === 'object' && o !== null && key in o) ? (o as Record<string, unknown>)[key] : undefined, obj);
}

interface UseFiltersArgs {
  initialItems: EnrichedCharacter[];
  query: string;
  searchResults: EnrichedCharacter[];
}

export function useFilters({ initialItems, query, searchResults }: UseFiltersArgs) {
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});

  const itemsToShow = query
    ? searchResults.filter(item => (item as EnrichedCharacter).__type === 'character') as EnrichedCharacter[]
    : initialItems;

  const filteredResults = useMemo(() => {
    const activeFilterKeys = Object.keys(activeFilters).filter(key => activeFilters[key]?.length > 0);
    if (activeFilterKeys.length === 0) return itemsToShow;
    return itemsToShow.filter(item => {
      const char = item as EnrichedCharacter;
      if (char.__type !== 'character') return false;
      return activeFilterKeys.every(key => {
        const activeValues = activeFilters[key];
        if (key === 'isBender') {
          const itemIsBender = char.isBender ? 'Bender' : 'Non-bender';
          return activeValues.includes(itemIsBender);
        }
        const itemValue = getNestedValue(char, key);
        if (Array.isArray(itemValue)) {
          return activeValues.some(v => (itemValue as string[]).map(x => x.toLowerCase()).includes(v.toLowerCase()));
        }
        if (typeof itemValue === 'string') {
          return activeValues.includes(itemValue.toLowerCase());
        }
        return false;
      });
    });
  }, [itemsToShow, activeFilters]);

  const handleToggleFilter = useCallback((filterKey: string, value: string, setSelectedId?: (id: string | null) => void) => {
    if (setSelectedId) setSelectedId(null);
    setActiveFilters(prev => {
      const current = prev[filterKey] || [];
      const lowercasedValue = value.toLowerCase();
      const newFilters = { ...prev };
      const index = current.findIndex(v => v.toLowerCase() === lowercasedValue);
      if (index > -1) {
        newFilters[filterKey] = current.filter((_, i) => i !== index);
      } else {
        newFilters[filterKey] = [...current, lowercasedValue];
      }
      return newFilters;
    });
  }, []);

  return {
    activeFilters,
    setActiveFilters,
    handleToggleFilter,
    filteredResults,
  };
} 