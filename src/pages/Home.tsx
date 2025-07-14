// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
import React from 'react';
import SearchBar from '../components/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import CollectionsPanel from '../components/CollectionsPanel/CollectionsPanel';
import CollectionsSidebar from '../components/CollectionsSidebar/CollectionsSidebar';
import type { EnrichedCharacter } from '../types';
import type { FilterGroup } from '../components/FilterSidebar';
import { ExpandedItemModal } from '../components/ExpandedItemModal';

interface HomeProps {
  query: string;
  setQuery: (q: string) => void;
  filters: Record<string, string[]>;
  activeFilters: Record<string, string[]>;
  onToggleFilter: (filterKey: string, value: string) => void;
  filterConfig: FilterGroup[];
  loading: boolean;
  error: string | null;
  filteredResults: EnrichedCharacter[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  collections: { id: string; name: string; items: string[] }[];
  panelOpen: boolean;
  onClosePanel: () => void;
  onAddItemToCollection: (collectionId: string) => void;
  onCreateCollection: (name: string) => void;
  suggestion: string;
  textColor: string;
  topNation?: string | null;
  // Added props for collections
  activeCollectionId: string | null;
  activeCollectionItems: EnrichedCharacter[];
  onSelectCollection: (collectionId: string | null) => void;
  onDeleteCollection: (collectionId: string) => void;
}

export function Home({
  query,
  setQuery,
  filters,
  activeFilters,
  onToggleFilter,
  filterConfig,
  loading,
  error,
  filteredResults,
  selectedId,
  setSelectedId,
  scrollContainerRef,
  collections,
  panelOpen,
  onClosePanel,
  onAddItemToCollection,
  onCreateCollection,
  suggestion,
  textColor,
  topNation,
  // Destructure new props
  activeCollectionId,
  activeCollectionItems,
  onSelectCollection,
  onDeleteCollection,
}: HomeProps) {
  const expandedItem = selectedId ? filteredResults.find(item => item.id === selectedId) : null;
  return (
    <div className="flex flex-row gap-6 min-h-screen overflow-x-hidden">
      <aside className="w-64 max-w-xs min-w-[200px] flex flex-col gap-6 min-h-screen">
        <section>
          <FilterSidebar
            filters={filters}
            activeFilters={activeFilters}
            onToggle={onToggleFilter}
            filterConfig={filterConfig}
          />
        </section>
        <section>
          <CollectionsSidebar
            collections={collections}
            activeCollectionId={activeCollectionId}
            activeCollectionItems={activeCollectionItems}
            onSelectCollection={onSelectCollection}
            onDeleteCollection={onDeleteCollection}
          />
        </section>
      </aside>
      <main className="flex-1 flex flex-col overflow-visible">
        <div className="flex-shrink-0 pt-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            suggestion={suggestion}
            textColor={textColor}
            nationIcon={topNation}
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
      <CollectionsPanel
        open={panelOpen}
        collections={collections}
        onSelect={onAddItemToCollection}
        onCreate={onCreateCollection}
        onClose={onClosePanel}
      />
    </div>
  );
}

