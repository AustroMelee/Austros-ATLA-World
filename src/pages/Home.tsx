// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
import React from 'react';
// import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import Layout from '../components/Layout';
import NoResults from '../components/NoResults';
import type { MatchResult, EnrichedEntity } from '../search/types';
// import type { EnrichedCharacter } from '../types/domainTypes';

import type { GridItem } from '../types/grid';

interface HomeProps {
  searchResults: Array<{ entity: EnrichedEntity; matchedFields: MatchResult['matchedFields'] }>;
  loading: boolean;
  query: string;
  handleSearchChange: (query: string) => void;
  expandedCardId: string | null; // <-- Add prop
  onCardExpand: (cardId: string) => void; // <-- Add prop
}

export function Home({
  searchResults,
  loading,
  query,
  handleSearchChange,
  expandedCardId, // <-- Destructure prop
  onCardExpand, // <-- Destructure prop
}: HomeProps) {
  // --- CORRECTED ADAPTER ---
  const gridItems: GridItem[] = searchResults.map((result) => ({
    record: result.entity,
    matchedFields: result.matchedFields,
  }));
  // --- END ADAPTER ---


  return (
    <Layout>
      {/* <Navbar /> */}
      <div className="flex flex-col items-center w-full pt-32">
        <SearchBar value={query} onChange={handleSearchChange} />
        {loading ? (
          <div className="mt-8 text-neutral-400">Loading...</div>
        ) : gridItems.length === 0 ? (
          <NoResults />
        ) : (
          <EntityGrid
            items={gridItems}
            expandedCardId={expandedCardId}
            onCardExpand={onCardExpand}
          />
        )}
      </div>
    </Layout>
  );
}

