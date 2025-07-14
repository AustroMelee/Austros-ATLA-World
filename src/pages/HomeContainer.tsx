// HomeContainer: Handles all state, data fetching, and logic for the Home page. SRP-compliant container.
import React, { useState, useMemo, useRef } from 'react';
import { Home } from './Home';
import { useAustrosSearch } from '../hooks/useAustrosSearch';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import type { EnrichedCharacter } from '../types/domainTypes';
import { useCollectionsStore } from '../collections/collectionsStore';

// Helper to safely access nested properties from a string path (e.g., 'tagCategories.combatTags')
function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce((o, key) => (o && typeof o === 'object' && o !== null && key in o) ? (o as Record<string, unknown>)[key] : undefined, obj);
}

// Nation color mapping (reused from ThemedCard)
const nationThemeMap: Record<string, { main: string; glow: string }> = {
  'air nomads': { main: '#FF9933', glow: 'rgba(255, 153, 51, 0.15)' },
  'water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'southern water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'northern water tribe': { main: '#61aee4', glow: 'rgba(97, 174, 228, 0.15)' },
  'earth kingdom': { main: '#559c41', glow: 'rgba(85, 156, 65, 0.15)' },
  'fire nation': { main: '#d93e3e', glow: 'rgba(217, 62, 62, 0.15)' },
  'default': { main: '#8b949e', glow: 'rgba(139, 148, 158, 0.05)' },
};

export default function HomeContainer() {
  const [query, setQuery] = useState('');
  const { results: searchResults, loading, error, topHit } = useAustrosSearch(query);
  const [initialItems, setInitialItems] = useState<EnrichedCharacter[]>([]);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
      // setRecentSearches(PersonalizationEngine.getRecentSearches()); // This line was removed
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

  const activeCollectionFullItems = useMemo(() => {
    if (!activeCollectionId || initialItems.length === 0) return [];
    const itemIds = collections[activeCollectionId]?.items || [];
    return itemIds.map(id => initialItems.find(item => item.id === id)).filter(Boolean) as EnrichedCharacter[];
  }, [activeCollectionId, collections, initialItems]);

  // Use all search results for suggestion logic
  const suggestion = React.useMemo(() => {
    if (!query || !searchResults.length) return '';
    const q = query.trim().toLowerCase();
    // Find the first result where any word in the name starts with the query
    const first = searchResults.find(item => {
      if (typeof item.name !== 'string') return false;
      const words = item.name.toLowerCase().split(/\s+/);
      return words.some(word => word.startsWith(q)) && item.name.length > q.length;
    });
    if (first && typeof first.name === 'string') {
      // Find the word that matches and return the rest of the name from that point
      const name = first.name;
      const lowerName = name.toLowerCase();
      const matchIndex = lowerName.indexOf(q);
      if (matchIndex !== -1 && matchIndex + q.length < name.length) {
        return name.slice(matchIndex + q.length);
      }
    }
    return '';
  }, [query, searchResults]);

  const textColor = React.useMemo(() => {
    if (topHit && topHit.nation) {
      const nationKey = topHit.nation.toLowerCase();
      return nationThemeMap[nationKey]?.main || nationThemeMap.default.main;
    }
    return nationThemeMap.default.main;
  }, [topHit]);

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
      activeCollectionId={activeCollectionId}
      activeCollectionItems={activeCollectionFullItems}
      onSelectCollection={setActiveCollectionId}
      onDeleteItem={removeItemFromCollection}
      onDeleteCollection={deleteCollection}
      panelOpen={panelOpen}
      onClosePanel={closePanel}
      onAddItemToCollection={(collectionId: string) => {
        if (selectedItem) {
          addItemToCollection(collectionId, selectedItem);
          closePanel();
        }
      }}
      onCreateCollection={createCollection}
      suggestion={suggestion}
      textColor={textColor}
      topNation={topHit?.nation || null}
    />
  );
} 