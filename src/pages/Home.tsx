// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
import React from 'react';
import SearchBar from '../components/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import Layout from '../components/Layout';
import CollectionsSidebar from '../components/Collections/CollectionsSidebar';
import type { MatchResult, EnrichedEntity } from '../search/types';
import type { GridItem } from '../types/grid';
import type { UseCollectionsReturn } from '../hooks/useCollections';

interface HomeProps {
  searchResults: Array<{ entity: EnrichedEntity; matchedFields: MatchResult['matchedFields'] }>;
  loading: boolean;
  query: string;
  handleSearchChange: (query: string) => void;
  expandedCardId: string | null;
  onCardExpand: (cardId: string) => void;
  collectionsApi: UseCollectionsReturn;
  activeCollectionId: string | null;
  setActiveCollectionId: (id: string | null) => void;
}

export function Home({
  searchResults,
  loading,
  query,
  handleSearchChange,
  expandedCardId,
  onCardExpand,
  collectionsApi,
  activeCollectionId,
  setActiveCollectionId,
}: HomeProps) {
  const gridItems: GridItem[] = searchResults.map(result => ({
    record: result.entity,
    matchedFields: result.matchedFields,
  }));

  return (
    <Layout>
      <div className="flex w-full pt-32 min-h-screen bg-transparent">
        <CollectionsSidebar
          collections={collectionsApi.collections}
          activeId={activeCollectionId}
          onActivate={setActiveCollectionId}
          createCollection={collectionsApi.createCollection}
        />
        <div className="flex-1 flex flex-col items-center">
          <SearchBar value={query} onChange={handleSearchChange} />
          {loading ? (
            <div className="mt-8 text-neutral-400">Loading...</div>
          ) : (
            <EntityGrid
              items={gridItems}
              expandedCardId={expandedCardId}
              onCardExpand={onCardExpand}
              collectionsApi={collectionsApi}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}

