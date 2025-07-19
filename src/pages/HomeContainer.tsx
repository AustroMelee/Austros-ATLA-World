// src/pages/HomeContainer.tsx

import React, { useState, useMemo } from 'react';
import { Home } from './Home';
import { useSearch } from '../hooks/useSearch';
import { useEnrichedData } from '../hooks/useEnrichedData';
import { useCardExpansion } from '../hooks/useCardExpansion';
import { useCollections } from '../hooks/useCollections';
import useFilterState from '../hooks/useFilterState';
import { applyFilters } from '../utils/applyFilters';

export function HomeContainer() {
  const { data: allEntities, loading } = useEnrichedData();
  const [query, setQuery] = useState('');
  const { expandedId, toggle } = useCardExpansion();
  const collectionsApi = useCollections();
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
  const {
    activeNations,
    activeCoreFilter,
    activeSubFilters,
    handleToggleNation,
    handleSetCoreFilter,
    handleToggleSubFilter,
  } = useFilterState();

  const filteredItems = useMemo(
    () =>
      applyFilters({
        entities: allEntities,
        collections: collectionsApi.collections,
        activeCollectionId,
        activeNations,
        activeCoreFilter,
        activeSubFilters,
      }),
    [allEntities, collectionsApi.collections, activeCollectionId, activeNations, activeCoreFilter, activeSubFilters],
  );

  const searchResults = useSearch(filteredItems, query);

  return (
    <Home
      searchResults={searchResults}
      loading={loading}
      query={query}
      handleSearchChange={setQuery}
      expandedCardId={expandedId}
      onCardExpand={toggle}
      collectionsApi={collectionsApi}
      activeCollectionId={activeCollectionId}
      setActiveCollectionId={setActiveCollectionId}
      // Pass new state and handlers down
      activeNations={activeNations}
      onToggleNation={handleToggleNation}
      activeCoreFilter={activeCoreFilter}
      onSetCoreFilter={handleSetCoreFilter}
      activeSubFilters={activeSubFilters}
      onToggleSubFilter={handleToggleSubFilter}
    />
  );
}

export default HomeContainer; 