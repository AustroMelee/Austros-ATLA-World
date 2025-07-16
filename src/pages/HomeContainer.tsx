// HomeContainer: Handles all state, data fetching, and logic for the Home page. SRP-compliant container.
import React, { useState, useMemo, useRef } from 'react';
import { Home } from './Home';
import { useSearchHandler } from '../hooks/useSearchHandler';
import { useRecentSearchRecorder } from '../hooks/useRecentSearchRecorder';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import type { EnrichedCharacter, EnrichedRecord } from '../types/domainTypes';
import { useFilters } from '../hooks/useFilters';

export default function HomeContainer() {
  const {
    query,
    setQuery,
    searchResults,
    loading,
    error,
    topHit,
    suggestion,
    textColor,
  } = useSearchHandler();
  const [initialItems, setInitialItems] = useState<EnrichedCharacter[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

  React.useEffect(() => {
    ClientSearchEngine.getAllByType<EnrichedCharacter>('character').then(setInitialItems);
  }, []);

  useRecentSearchRecorder(query);

  // Memoized filter for EnrichedCharacter[]
  const characterSearchResults = useMemo(
    () => (searchResults as EnrichedRecord[]).filter(
      (item): item is EnrichedCharacter => item.__type === 'character'
    ),
    [searchResults]
  );

  // Use the new useFilters hook
  const {
    activeFilters,
    filters,
    handleToggleFilter,
    filteredResults,
    filterConfig,
  } = useFilters({ initialItems, query, searchResults: characterSearchResults });

  return (
    <Home
      query={query}
      setQuery={q => setQuery(q)}
      filters={filters}
      activeFilters={activeFilters}
      onToggleFilter={handleToggleFilter}
      filterConfig={filterConfig}
      loading={loading}
      error={error}
      filteredResults={filteredResults}
      selectedId={selectedId}
      setSelectedId={setSelectedId}
      scrollContainerRef={scrollContainerRef}
      suggestion={suggestion}
      textColor={textColor}
      topNation={topHit?.nation || null}
    />
  );
} 