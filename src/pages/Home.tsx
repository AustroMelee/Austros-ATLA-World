// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
import React from 'react';
import SearchBar from '../components/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import type { EnrichedCharacter } from '../types';
import { ExpandedItemModal } from '../components/ExpandedItemModal';

interface HomeProps {
  query: string;
  setQuery: (q: string) => void;
  filters: Record<string, string[]>;
  activeFilters: Record<string, string[]>;
  onToggleFilter: (filterKey: string, value: string, setSelectedId?: (id: string | null) => void) => void;
  filterConfig: unknown;
  loading: boolean;
  error: string | null;
  filteredResults: EnrichedCharacter[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  collections: unknown[];
  activeCollectionId: string | null;
  activeCollectionItems: EnrichedCharacter[];
  onSelectCollection: (id: string) => void;
  onDeleteCollection: (id: string) => void;
  panelOpen: boolean;
  onClosePanel: () => void;
  onAddItemToCollection: (collectionId: string) => void;
  onCreateCollection: (name: string) => void;
  suggestion: string | null;
  textColor: string;
  topNation: string | null;
}

export function Home({
  query,
  setQuery,
  filters: _filters,
  activeFilters: _activeFilters,
  onToggleFilter: _onToggleFilter,
  filterConfig: _filterConfig,
  loading,
  error,
  filteredResults,
  selectedId,
  setSelectedId,
  scrollContainerRef,
  collections: _collections,
  activeCollectionId: _activeCollectionId,
  activeCollectionItems: _activeCollectionItems,
  onSelectCollection: _onSelectCollection,
  onDeleteCollection: _onDeleteCollection,
  panelOpen: _panelOpen,
  onClosePanel: _onClosePanel,
  onAddItemToCollection: _onAddItemToCollection,
  onCreateCollection: _onCreateCollection,
  suggestion: _suggestion,
  textColor: _textColor,
  topNation: _topNation,
}: HomeProps) {
  const expandedItem = selectedId ? filteredResults.find(item => item.id === selectedId) : null;
  return (
    <div className="flex flex-row gap-6 min-h-screen overflow-x-hidden">
      <main className="flex-1 flex flex-col overflow-visible justify-center">
        <div className="flex-shrink-0 mt-32">
          <SearchBar
            value={query}
            onChange={setQuery}
          />
        </div>
        <div ref={scrollContainerRef} className="pt-6 pr-2 overflow-visible">
          {loading ? <LoadingSpinner /> : error ? <div className="text-red-400">{error}</div> : (
            <EntityGrid
              items={filteredResults}
              onSelect={setSelectedId}
              selectedId={selectedId}
              scrollContainerRef={scrollContainerRef}
            />
          )}
          {expandedItem && (
            <ExpandedItemModal item={expandedItem} onClose={() => setSelectedId(null)} />
          )}
        </div>
      </main>
    </div>
  );
}

