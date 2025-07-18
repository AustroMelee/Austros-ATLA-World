// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
import React from 'react';
import { FaMars, FaVenus } from 'react-icons/fa';
import SearchBar from '../components/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import Layout from '../components/Layout';
import CollectionsSidebar from '../components/Collections/CollectionsSidebar';
import FilterBar from '../components/Filters/FilterBar';
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
  activeNations: Set<string>;
  onToggleNation: (nation: string) => void;
  activeCoreFilter: string | null;
  onSetCoreFilter: (filter: string | null) => void;
  activeSubFilters: Set<string>;
  onToggleSubFilter: (subFilter: string) => void;
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
  activeNations,
  onToggleNation,
  activeCoreFilter,
  onSetCoreFilter,
  activeSubFilters,
  onToggleSubFilter,
}: HomeProps) {
  const gridItems: GridItem[] = searchResults.map(result => ({
    record: result.entity,
    matchedFields: result.matchedFields,
  }));

  const getSubFilterOptions = (coreFilter: string | null): Array<{key: string, symbol?: React.ReactNode}> => {
    if (!coreFilter) return [];
    const subFilterMap: Record<string, Array<{key: string, symbol?: React.ReactNode}>> = {
      characters: [
        { key: 'male', symbol: <FaMars className="text-blue-400" /> },
        { key: 'female', symbol: <FaVenus className="text-pink-400" /> },
        { key: 'child' },
        { key: 'teen' },
        { key: 'young adult' },
        { key: 'adult' },
        { key: 'elder' },
        { key: 'heroes' },
        { key: 'villains' },
        { key: 'mentors' },
        { key: 'bender' },
        { key: 'nonbender' }
      ],
      foods: [
        { key: 'meat' },
        { key: 'vegetables' },
        { key: 'desserts' }
      ],
      locations: [
        { key: 'cities' },
        { key: 'temples' },
        { key: 'wilderness' }
      ],
      bending: [
        { key: 'firebending' },
        { key: 'waterbending' },
        { key: 'earthbending' },
        { key: 'airbending' }
      ],
      fauna: [
        { key: 'domestic' },
        { key: 'wild' },
        { key: 'spirit' }
      ],
      spirits: [
        { key: 'benign' },
        { key: 'malevolent' },
        { key: 'neutral' }
      ],
    };
    return subFilterMap[coreFilter] || [];
  };

  return (
    <Layout>
      <div className="flex w-full pt-16 min-h-screen bg-transparent">
        <CollectionsSidebar
          collections={collectionsApi.collections}
          activeId={activeCollectionId}
          onActivate={setActiveCollectionId}
          createCollection={collectionsApi.createCollection}
        />
        <div className="flex-1 flex flex-col items-center">
          <FilterBar
            activeNations={activeNations}
            onToggleNation={onToggleNation}
            activeCoreFilter={activeCoreFilter}
            onSetCoreFilter={onSetCoreFilter}
            activeSubFilters={activeSubFilters}
            onToggleSubFilter={onToggleSubFilter}
            subFilterOptions={getSubFilterOptions(activeCoreFilter)}
          />
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

