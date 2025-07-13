// HomeContainer: Handles all state, data fetching, and logic for the Home page. SRP-compliant container.
import React, { useState, useMemo, useRef } from 'react';
import { Home } from './Home';
import { useAustrosSearch } from '../hooks/useAustrosSearch';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import * as PersonalizationEngine from '../search/PersonalizationEngine';
import type { EnrichedCharacter } from '../types/domainTypes';
import { useCollectionsStore } from '../collections/collectionsStore';

// Helper to safely access nested properties from a string path (e.g., 'tagCategories.combatTags')
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((o, key) => (o && typeof o === 'object' && o !== null && key in o) ? (o as Record<string, unknown>)[key] : undefined, obj);
}

export default function HomeContainer() {
  const [query, setQuery] = useState('');
  const { results: searchResults, loading, error } = useAustrosSearch(query);
  const [initialItems, setInitialItems] = useState<EnrichedCharacter[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const {
    collections,
    selectedItem,
    panelOpen,
    activeCollectionId,
    setActiveCollectionId,
    createCollection,
    deleteCollection,
    addItemToCollection,
    removeItemFromCollection,
    openPanel,
    closePanel,
  } = useCollectionsStore();

  React.useEffect(() => {
    ClientSearchEngine.init().then(async () => {
      const items = await ClientSearchEngine.getAllByType('character');
      setInitialItems(items as EnrichedCharacter[]);
    });
  }, []);

  React.useEffect(() => {
    if (!query) {
      setRecentSearches(PersonalizationEngine.getRecentSearches());
    }
  }, [query]);

  // THE NEW, CURATED FILTER CONFIG
  const filterConfig = useMemo(() => [
    {
      label: "Core Filters",
      filters: [
        { key: 'nation', label: 'Nation' },
        { key: 'bendingElement', label: 'Bending Element' },
        { key: 'isBender', label: 'Bending Status' },
        { key: 'gender', label: 'Gender' },
        { key: 'ageRange', label: 'Age Group' },
      ]
    },
  ], []);

  const filters = useMemo(() => {
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
  }, [initialItems, filterConfig]);

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

  const handleToggleFilter = (filterKey: string, value: string) => {
    setSelectedId(null);
    setActiveFilters(prev => {
      const current = prev[filterKey] || [];
      const lowercasedValue = value.toLowerCase();
      const newFilters = { ...prev };
      // Manage active filters in lowercase.
      const index = current.findIndex(v => v.toLowerCase() === lowercasedValue);
      if (index > -1) {
        newFilters[filterKey] = current.filter((_, i) => i !== index);
      } else {
        newFilters[filterKey] = [...current, lowercasedValue];
      }
      return newFilters;
    });
  };

  const handleRecentSearchSelect = (selectedQuery: string) => {
    setQuery(selectedQuery);
  };

  const activeCollectionFullItems = useMemo(() => {
    if (!activeCollectionId || initialItems.length === 0) return [];
    const itemIds = collections[activeCollectionId]?.items || [];
    return itemIds.map(id => initialItems.find(item => item.id === id)).filter(Boolean) as EnrichedCharacter[];
  }, [activeCollectionId, collections, initialItems]);

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
      collections={Object.entries(collections).map(([id, c]) => ({ id, ...c }))}
      panelOpen={panelOpen}
      onOpenPanel={openPanel}
      onClosePanel={closePanel}
      onAddItemToCollection={(collectionId: string) => {
        if (selectedItem) {
          addItemToCollection(collectionId, selectedItem);
          closePanel();
        }
      }}
      onCreateCollection={createCollection}
      recentSearches={recentSearches}
      onRecentSearchSelect={handleRecentSearchSelect}
      activeCollectionId={activeCollectionId}
      setActiveCollectionId={setActiveCollectionId}
      activeCollectionItems={activeCollectionFullItems}
      onDeleteCollection={deleteCollection}
      onRemoveItemFromCollection={removeItemFromCollection}
    />
  );
} 