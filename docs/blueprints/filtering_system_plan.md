System Prompt: LLM Feature Implementation Protocol
Your Role: You are an expert React and Tailwind CSS developer. Your primary task is to implement the "Multi-Layered Filtering System."
Your Goal: To integrate the new feature by following the phases and steps below with extreme precision, ensuring no regressions and perfect adherence to the project's existing architecture and aesthetic.
Golden Rules (Non-Negotiable):
EXECUTE ONE STEP AT A TIME. Complete each step in sequence. Do not proceed until the current one is complete and verified.
CONFIRM COMPLETION. After each step, you must explicitly state that the step is complete and the verification was successful.
PRECISION IS PARAMOUNT. Implement the code exactly as provided. Do not add, remove, or modify logic unless explicitly instructed.
MAINTAIN THEME. All new components must adhere to the existing Matrix/CRT theme using the specified design patterns.
Phase 1: State Management & Core Logic Integration
Objective: Integrate all new state variables and the sequential filtering logic into the central HomeContainer component.
Step 1.1: Implement State and Filtering Logic in HomeContainer
ACTION: MODIFY_FILE
FILE_PATH: src/pages/HomeContainer.tsx
INSTRUCTIONS: Replace the entire content of the file with the following code. This introduces the new state variables, handler functions, and the core filtering pipeline.
Generated typescript
import React, { useState } from 'react';
import { Home } from './Home';
import { useSearch } from '../hooks/useSearch';
import { useEnrichedData } from '../hooks/useEnrichedData';
import { useCardExpansion } from '../hooks/useCardExpansion';
import { useCollections } from '../hooks/useCollections';

export function HomeContainer() {
  const { data: allEntities, loading } = useEnrichedData();
  const [query, setQuery] = useState('');
  const { expandedId, toggle } = useCardExpansion();
  const collectionsApi = useCollections();
  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);

  // NEW STATE VARIABLES
  const [activeNations, setActiveNations] = useState<Set<string>>(new Set());
  const [activeCoreFilter, setActiveCoreFilter] = useState<string | null>(null);
  const [activeSubFilters, setActiveSubFilters] = useState<Set<string>>(new Set());

  // NEW HANDLER FUNCTIONS
  const handleToggleNation = (nation: string) => {
    setActiveNations(prev => {
      const newSet = new Set(prev);
      newSet.has(nation) ? newSet.delete(nation) : newSet.add(nation);
      return newSet;
    });
  };

  const handleSetCoreFilter = (filter: string | null) => {
    setActiveCoreFilter(prev => (prev === filter ? null : filter));
    setActiveSubFilters(new Set()); // Clear sub-filters when core changes
  };
  
  const handleToggleSubFilter = (subFilter: string) => {
    setActiveSubFilters(prev => {
      const newSet = new Set(prev);
      newSet.has(subFilter) ? newSet.delete(subFilter) : newSet.add(subFilter);
      return newSet;
    });
  };
  
  // SEQUENTIAL FILTERING PIPELINE
  let itemsToFilter = allEntities;

  if (activeCollectionId) {
    const activeCollection = collectionsApi.collections.find(c => c.id === activeCollectionId);
    const idSet = new Set(activeCollection?.cardIds || []);
    itemsToFilter = itemsToFilter.filter(item => idSet.has(item.id));
  }

  if (activeNations.size > 0) {
    itemsToFilter = itemsToFilter.filter(item => item.nation && activeNations.has(item.nation.toLowerCase()));
  }

  if (activeCoreFilter) {
    const typeMap: Record<string, string> = { characters: 'character', locations: 'location', fauna: 'fauna', foods: 'food', bending: 'bending', spirits: 'spirit-world' };
    const targetType = typeMap[activeCoreFilter];
    if (targetType) itemsToFilter = itemsToFilter.filter(item => item.__type === targetType);
  }

  if (activeCoreFilter && activeSubFilters.size > 0) {
    itemsToFilter = itemsToFilter.filter(item => item.tags?.some(tag => activeSubFilters.has(tag.toLowerCase())));
  }
  
  const searchResults = useSearch(itemsToFilter, query);

  return (
    <Home
      searchResults={searchResults}
      loading={loading}
      query={query}
      handleSearchChange={setQuery}
      expandedCardId={expandedId}
      onCardExpand={toggle}
      collectionsApi={collectionsApi}
      activeCollectionId={activeCollectionId}
      setActiveCollectionId={setActiveCollectionId}
      // Pass new state and handlers down
      activeNations={activeNations}
      onToggleNation={handleToggleNation}
      activeCoreFilter={activeCoreFilter}
      onSetCoreFilter={handleSetCoreFilter}
      activeSubFilters={activeSubFilters}
      onToggleSubFilter={handleToggleSubFilter}
    />
  );
}
Use code with caution.
TypeScript
VERIFICATION: Confirm that the application compiles without errors. The UI should still be functional, but no filter controls will be visible yet.
Phase 2: Component Scaffolding & Integration
Objective: Create the new filter components and integrate them into the Home.tsx presentational component.
Step 2.1: Create FilterBar.tsx
ACTION: CREATE_FILE
FILE_PATH: src/components/Filters/FilterBar.tsx
INSTRUCTIONS: Create the file and paste the following code. This will be the main container for all filter controls.
Generated typescript
import React from 'react';

// NOTE: Other filter components will be added here later.
// For now, this is just a placeholder to verify integration.
export default function FilterBar() {
  return (
    <div className="w-full max-w-4xl p-4 mb-4 border border-dashed border-[#70ab6c]/30">
      <p className="text-[#70ab6c]">FilterBar Component Area</p>
    </div>
  );
}
Use code with caution.
TypeScript
VERIFICATION: Confirm the file src/components/Filters/FilterBar.tsx exists and contains the exact code.
Step 2.2: Update Home.tsx to Render FilterBar
ACTION: MODIFY_FILE
FILE_PATH: src/pages/Home.tsx
INSTRUCTIONS: Update the HomeProps interface and render the <FilterBar /> component above the <SearchBar />.
COMPLETE REPLACEMENT CODE:
Generated typescript
import React from 'react';
import SearchBar from '../components/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import Layout from '../components/Layout';
import CollectionsSidebar from '../components/Collections/CollectionsSidebar';
import FilterBar from '../components/Filters/FilterBar'; // NEW IMPORT
// ... (keep other imports)

interface HomeProps {
  // ... (keep existing props)
  activeNations: Set<string>;
  onToggleNation: (nation: string) => void;
  activeCoreFilter: string | null;
  onSetCoreFilter: (filter: string | null) => void;
  activeSubFilters: Set<string>;
  onToggleSubFilter: (subFilter: string) => void;
}

export function Home({ /* ... all props */ }) {
  const gridItems = searchResults.map(result => ({ record: result.entity, matchedFields: result.matchedFields }));
  
  const getSubFilterOptions = (coreFilter: string | null): string[] => {
      if (!coreFilter) return [];
      const subFilterMap: Record<string, string[]> = {
        characters: ['heroes', 'villains', 'mentors'],
        foods: ['meat', 'vegetables', 'desserts'],
        locations: ['cities', 'temples', 'wilderness'],
        bending: ['firebending', 'waterbending', 'earthbending', 'airbending'],
        fauna: ['domestic', 'wild', 'spirit'],
        spirits: ['benign', 'malevolent', 'neutral']
      };
      return subFilterMap[coreFilter] || [];
  };

  return (
    <Layout>
      <div className="flex w-full pt-32 min-h-screen bg-transparent">
        <CollectionsSidebar /* ... */ />
        <div className="flex-1 flex flex-col items-center">
          {/* RENDER THE FILTER BAR */}
          <FilterBar
            activeNations={activeNations}
            onToggleNation={onToggleNation}
            activeCoreFilter={activeCoreFilter}
            onSetCoreFilter={onSetCoreFilter}
            activeSubFilters={activeSubFilters}
            onToggleSubFilter={onToggleSubFilter}
            subFilterOptions={getSub