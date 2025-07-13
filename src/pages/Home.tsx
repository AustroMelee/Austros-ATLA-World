// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
import React from 'react';
import HomeContainer from './HomeContainer';
import SearchBar from '../components/SearchBar/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import CollectionsPanel from '../components/CollectionsPanel/CollectionsPanel';
import type { EnrichedCharacter } from '../types';
import type { FilterGroup } from '../components/FilterSidebar';

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
  onOpenPanel: (itemId: string) => void;
  onClosePanel: () => void;
  onAddItemToCollection: (collectionId: string) => void;
  onCreateCollection: (name: string) => void;
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
  onOpenPanel,
  onClosePanel,
  onAddItemToCollection,
  onCreateCollection,
}: HomeProps) {
  return (
    // FIX: Add w-full to ensure the flex container takes full width
    <div className="flex flex-row gap-6 p-4 md:p-6 h-screen w-full bg-background">
      <FilterSidebar
        filters={filters}
        activeFilters={activeFilters}
        onToggle={onToggleFilter}
        filterConfig={filterConfig}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-shrink-0">
          <SearchBar query={query} onQueryChange={setQuery} suggestion={""} textColor={"#e2e8f0"} />
        </div>
        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto pt-6 pr-2 -mr-2">
          {loading ? <LoadingSpinner /> : error ? <div className="text-red-400">{error}</div> : (
            <EntityGrid
              items={filteredResults}
              onSelect={setSelectedId}
              selectedId={selectedId}
              scrollContainerRef={scrollContainerRef}
              onAddToCollection={onOpenPanel}
            />
          )}
        </div>
      </main>
      
      {/* Assuming CollectionsSidebar component is created as planned */}
      {/* <CollectionsSidebar ... /> */}

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

export default HomeContainer;

