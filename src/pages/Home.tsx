import React, { useState, useMemo, useRef } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import { useAustrosSearch } from '../hooks/useAustrosSearch';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import type { EnrichedCharacter } from '../types/domainTypes';

export default function Home() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useAustrosSearch(query, 'character');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Create a ref for the specific div that has the scrollbar
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // The mainContentRef and its associated useEffect are no longer needed here.

  const filterConfig = [
    { key: 'nation', label: 'Nation' },
    { key: 'bendingElement', label: 'Bending Element' },
    { key: 'narrativeFunction', label: 'Role' },
    { key: 'ageRange', label: 'Age Group' },
    { key: 'gender', label: 'Gender' },
  ];

  const filters = useMemo(() => {
    const opts: Record<string, Set<string>> = {};
    filterConfig.forEach(({ key }) => (opts[key] = new Set()));
    results.forEach(item => {
      const char = item as EnrichedCharacter;
      if (char.__type !== 'character') return;
      filterConfig.forEach(({ key }) => {
        const value = char[key as keyof EnrichedCharacter];
        if (value && typeof value === 'string') opts[key].add(value);
        else if (Array.isArray(value)) value.forEach(v => { if (typeof v === 'string' && v) opts[key].add(v); });
      });
    });
    const out: Record<string, string[]> = {};
    filterConfig.forEach(({ key }) => { out[key] = Array.from(opts[key]).sort(); });
    return out;
  }, [results]);

  const filteredResults = useMemo(() => {
    const activeFilterKeys = Object.keys(activeFilters).filter(key => activeFilters[key] && activeFilters[key].length > 0);
    if (activeFilterKeys.length === 0) return results;
    return results.filter(item => {
      const char = item as EnrichedCharacter;
      return activeFilterKeys.every(key => {
        const activeValues = activeFilters[key];
        const itemValue = char[key as keyof EnrichedCharacter];
        if (Array.isArray(itemValue)) return itemValue.some(val => activeValues.includes(val));
        return activeValues.includes(itemValue as string);
      });
    });
  }, [results, activeFilters]);

  const handleToggleFilter = (filterKey: string, value: string) => {
    setSelectedId(null);
    setActiveFilters(prev => {
      const current = prev[filterKey] || [];
      const newFilters = { ...prev };
      if (current.includes(value)) newFilters[filterKey] = current.filter(v => v !== value);
      else newFilters[filterKey] = [...current, value];
      return newFilters;
    });
  };

  return (
    <div className="flex flex-row gap-8 p-6 h-screen">
      <FilterSidebar
        filters={filters}
        activeFilters={activeFilters}
        onToggle={handleToggleFilter}
        filterConfig={filterConfig}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0 mb-4">
          <SearchBar query={query} onQueryChange={setQuery} suggestion={""} textColor={"#fff"} />
        </div>
        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto pr-2">
          {loading ? <LoadingSpinner /> : error ? <div className="text-red-400">{error}</div> : (
            <EntityGrid
              items={filteredResults}
              onSelect={setSelectedId}
              selectedId={selectedId}
              scrollContainerRef={scrollContainerRef}
            />
          )}
        </div>
      </main>
    </div>
  );
}

