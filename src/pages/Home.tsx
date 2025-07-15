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
  loading: boolean;
  error: string | null;
  filteredResults: EnrichedCharacter[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export function Home({
  query,
  setQuery,
  loading,
  error,
  filteredResults,
  selectedId,
  setSelectedId,
  scrollContainerRef,
}: HomeProps) {
  const expandedItem = selectedId ? filteredResults.find(item => item.id === selectedId) : null;
  return (
    <div className="flex flex-row gap-6 min-h-screen overflow-x-hidden">
      <main className="flex-1 flex flex-col overflow-visible">
        <div className="flex-shrink-0 pt-4">
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

