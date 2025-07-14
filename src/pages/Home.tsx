// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
import React from 'react';
import HomeContainer from './HomeContainer';
import SearchBar from '../components/SearchBar/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import CollectionsPanel from '../components/CollectionsPanel/CollectionsPanel';
import CollectionsSidebar from '../components/CollectionsSidebar/CollectionsSidebar';
import type { EnrichedCharacter } from '../types';
import type { FilterGroup } from '../components/FilterSidebar';
import NationIcon from '../components/NationIcon/NationIcon';

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
  activeCollectionId: string | null;
  activeCollectionItems: EnrichedCharacter[];
  onSelectCollection: (id: string) => void;
  onDeleteItem: (collectionId: string, itemId: string) => void;
  onDeleteCollection: (id: string) => void;
  panelOpen: boolean;
  onClosePanel: () => void;
  onAddItemToCollection: (collectionId: string) => void;
  onCreateCollection: (name: string) => void;
  suggestion: string;
  textColor: string;
  topNation?: string | null;
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
  activeCollectionId,
  activeCollectionItems,
  onSelectCollection,
  onDeleteItem,
  onDeleteCollection,
  panelOpen,
  onClosePanel,
  onAddItemToCollection,
  onCreateCollection,
  suggestion,
  textColor,
  topNation,
}: HomeProps) {
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
            onDeleteItem={onDeleteItem}
            onDeleteCollection={onDeleteCollection}
          />
        </section>
      </aside>
      <main className="flex-1 flex flex-col overflow-visible">
        <div className="flex-shrink-0 pt-4">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            suggestion={suggestion}
            textColor={textColor}
            nationIcon={topNation ? <NationIcon nation={topNation} size={18} /> : undefined}
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

export default HomeContainer;

