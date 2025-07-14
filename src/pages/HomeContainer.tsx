// HomeContainer: Handles all state, data fetching, and logic for the Home page. SRP-compliant container.
import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Home } from './Home';
import { useSearchHandler } from '../hooks/useSearchHandler';
import { useRecentSearchRecorder } from '../hooks/useRecentSearchRecorder';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import type { EnrichedCharacter, EnrichedRecord } from '../types/domainTypes';
import { useCollectionsData } from '../hooks/useCollectionsData';
import { useCollectionsUI } from '../hooks/useCollectionsUI';
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

  // Collections data (CRUD)
  const {
    collections,
    activeCollectionId,
    setActiveCollectionId,
    createCollection,
    deleteCollection,
    addItemToCollection,
  } = useCollectionsData();

  // Collections UI state
  const {
    panelOpen,
    // selectedItem, // Not used in this container
    // setSelectedItem, // Not used in this container
    closePanel,
  } = useCollectionsUI();

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

  // Map collections object to array for Home
  const collectionsArray = useMemo(() =>
    Object.entries(collections).map(([id, c]) => ({ id, ...c })),
    [collections]
  );

  // activeCollectionItems as EnrichedCharacter[]
  const activeCollectionItems = useMemo(() => {
    if (!activeCollectionId || initialItems.length === 0) return [];
    const itemIds = new Set(collections[activeCollectionId]?.items || []);
    return initialItems.filter(
      (item): item is EnrichedCharacter => itemIds.has(item.id) && item.__type === 'character'
    ) as EnrichedCharacter[];
  }, [activeCollectionId, collections, initialItems]);

  // Handler to adapt addItemToCollection to the expected prop signature
  const handleAddItemToCollection = useCallback(
    (collectionId: string) => {
      if (selectedId) {
        addItemToCollection(collectionId, selectedId);
      }
    },
    [selectedId, addItemToCollection]
  );

  return (
    <Home
      query={query}
      setQuery={setQuery}
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
      collections={collectionsArray}
      activeCollectionId={activeCollectionId}
      activeCollectionItems={activeCollectionItems}
      onSelectCollection={setActiveCollectionId}
      onDeleteCollection={deleteCollection}
      panelOpen={panelOpen}
      onClosePanel={closePanel}
      onAddItemToCollection={handleAddItemToCollection}
      onCreateCollection={createCollection}
      suggestion={suggestion}
      textColor={textColor}
      topNation={topHit?.nation || null}
    />
  );
} 