import { useState, useCallback } from 'react';

export interface FilterState {
  activeNations: Set<string>;
  activeCoreFilter: string | null;
  activeSubFilters: Set<string>;
  handleToggleNation: (nation: string) => void;
  handleSetCoreFilter: (filter: string | null) => void;
  handleToggleSubFilter: (subFilter: string) => void;
  handleClearAllFilters: () => void;
}

export function useFilterState(): FilterState {
  const [activeNations, setActiveNations] = useState<Set<string>>(new Set());
  const [activeCoreFilter, setActiveCoreFilter] = useState<string | null>(null);
  const [activeSubFilters, setActiveSubFilters] = useState<Set<string>>(new Set());

  const handleToggleNation = useCallback((nation: string) => {
    setActiveNations(prev => {
      const next = new Set(prev);
      if (next.has(nation)) next.delete(nation); else next.add(nation);
      return next;
    });
  }, []);

  const handleSetCoreFilter = useCallback((filter: string | null) => {
    setActiveCoreFilter(prev => (prev === filter ? null : filter));
    setActiveSubFilters(new Set());
  }, []);

  const handleToggleSubFilter = useCallback((subFilter: string) => {
    setActiveSubFilters(prev => {
      const next = new Set(prev);
      if (next.has(subFilter)) next.delete(subFilter); else next.add(subFilter);
      return next;
    });
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setActiveNations(new Set());
    setActiveCoreFilter(null);
    setActiveSubFilters(new Set());
  }, []);

  return {
    activeNations,
    activeCoreFilter,
    activeSubFilters,
    handleToggleNation,
    handleSetCoreFilter,
    handleToggleSubFilter,
    handleClearAllFilters,
  };
}

export default useFilterState; 