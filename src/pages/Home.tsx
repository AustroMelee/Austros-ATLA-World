// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
import React from 'react';
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
  onClearAllFilters: () => void;
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
  onClearAllFilters,
}: HomeProps) {
  const gridItems: GridItem[] = searchResults.map(result => ({
    record: result.entity,
    matchedFields: result.matchedFields,
  }));

  const getSubFilterOptions = (coreFilter: string | null): Array<{key: string, symbol?: React.ReactNode}> => {
    if (!coreFilter) return [];
    const subFilterMap: Record<string, Array<{key: string, symbol?: React.ReactNode}>> = {
      characters: [
        { key: 'male', symbol: <span className="text-blue-400">♂</span> },
        { key: 'female', symbol: <span className="text-pink-400">♀</span> },
        { key: 'child' },
        { key: 'teen' },
        { key: 'adult' },
        { key: 'elder' },
        { key: 'heroes' },
        { key: 'villains' },
        { key: 'mentors' },
        { key: 'bender' },
        { key: 'nonbender' }
      ],
      foods: [
        { key: 'soups_stews', symbol: <span className="text-orange-400">🍲 Soups & Stews</span> },
        { key: 'noodles_dumplings', symbol: <span className="text-yellow-400">🥟 Noodles & Dumplings</span> },
        { key: 'baked_goods_pastries', symbol: <span className="text-amber-400">🥧 Baked Goods & Pastries</span> },
        { key: 'cookies_biscuits', symbol: <span className="text-brown-400">🍪 Cookies & Biscuits</span> },
        { key: 'cakes_decadent_desserts', symbol: <span className="text-pink-400">🍰 Cakes & Decadent Desserts</span> },
        { key: 'roasted_grilled_meats', symbol: <span className="text-red-400">🍖 Roasted & Grilled Meats</span> },
        { key: 'seafood_fish', symbol: <span className="text-blue-400">🐟 Seafood & Fish</span> },
        { key: 'vegetarian_dishes', symbol: <span className="text-green-400">🥬 Vegetarian Dishes</span> },
        { key: 'street_food_snacks', symbol: <span className="text-yellow-400">🍡 Street Food & Snacks</span> },
        { key: 'spicy_foods', symbol: <span className="text-red-400">🌶️ Spicy Foods</span> },
        { key: 'teas_juices', symbol: <span className="text-cyan-400">🍵 Teas & Juices</span> },
        { key: 'preserved_travel_foods', symbol: <span className="text-gray-400">🥩 Preserved & Travel Foods</span> }
      ],
      locations: [
        { key: 'capital' },
        { key: 'city' },
        { key: 'village' },
        { key: 'temple' },
        { key: 'island' },
        { key: 'desert' },
        { key: 'swamp' }
      ],
      bending: [
        { key: 'firebending' },
        { key: 'waterbending' },
        { key: 'earthbending' },
        { key: 'airbending' }
      ],
      fauna: [
        { key: 'predators_hunters', symbol: <span className="text-red-400">🦁 Predators & Hunters</span> },
        { key: 'domesticated_mounts', symbol: <span className="text-green-400">🐎 Domesticated & Mounts</span> },
        { key: 'aquatic_marine', symbol: <span className="text-blue-400">🌊 Aquatic & Marine</span> },
        { key: 'flying_aerial', symbol: <span className="text-cyan-400">🦅 Flying & Aerial</span> },
        { key: 'sacred_spiritual', symbol: <span className="text-purple-400">🕊️ Sacred & Spiritual</span> },
        { key: 'hybrid_mixed', symbol: <span className="text-yellow-400">🔄 Hybrid & Mixed</span> },
        { key: 'small_insects', symbol: <span className="text-orange-400">🦗 Small & Insects</span> },
        { key: 'reptiles_amphibians', symbol: <span className="text-gray-400">🐊 Reptiles & Amphibians</span> }
      ],
      spirits: [
        { key: 'benign' },
        { key: 'malevolent' },
        { key: 'neutral' }
      ],
      episodes: [
        { key: 'book_1', symbol: <span className="text-blue-400">📚 Book 1: Water</span> },
        { key: 'book_2', symbol: <span className="text-green-400">📚 Book 2: Earth</span> },
        { key: 'book_3', symbol: <span className="text-red-400">📚 Book 3: Fire</span> },
      ],
    };
    return subFilterMap[coreFilter] || [];
  };

  return (
    <Layout>
      <div className="flex w-full pt-16 bg-transparent">
        <CollectionsSidebar
          collections={collectionsApi.collections}
          activeId={activeCollectionId}
          onActivate={setActiveCollectionId}
          createCollection={collectionsApi.createCollection}
        />
        <div className="flex-1 flex flex-col items-center min-h-screen">
          <FilterBar
            activeNations={activeNations}
            onToggleNation={onToggleNation}
            activeCoreFilter={activeCoreFilter}
            onSetCoreFilter={onSetCoreFilter}
            activeSubFilters={activeSubFilters}
            onToggleSubFilter={onToggleSubFilter}
            subFilterOptions={getSubFilterOptions(activeCoreFilter)}
          />
          {/* Clear All Filters Button */}
          {(activeNations.size > 0 || activeCoreFilter || activeSubFilters.size > 0) && (
            <div className="flex justify-center mb-4">
              <button
                onClick={onClearAllFilters}
                className="px-6 py-2 rounded-md bg-black backdrop-blur-sm border-2 border-[#70ab6c]/40 font-perfect-dos text-sm font-bold transition-all duration-200 crt-screen active:scale-95 shadow-lg text-[#c8ffc8] hover:bg-[#70ab6c]/60 hover:border-[#70ab6c] hover:text-black hover:shadow-[0_0_8px_rgba(112,171,108,0.6)]"
              >
                Clear All Filters
              </button>
            </div>
          )}
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

