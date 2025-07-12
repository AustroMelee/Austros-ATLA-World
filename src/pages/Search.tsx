import React from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ResultsGrid from '../components/ResultsGrid';
import NoResults from '../components/NoResults';
import type { EnrichedRecord } from '../types';

// TODO: Import and implement CollectionsPanel when ready

const Search: React.FC = () => {
  // TODO: Wire up state for search, filters, results, collections
  const items: EnrichedRecord[] = []; // TODO: Replace with real data
  const hasResults = items.length > 0;

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto min-h-[80vh] gap-8 py-8 px-4">
      {/* Sidebar: CollectionsPanel (stub) */}
      <aside className="w-full md:w-80 bg-slate-800 rounded-xl p-6 h-fit sticky top-8 mb-8 md:mb-0">
        <h2 className="text-xl font-bold text-slate-100 mb-4">My Collections</h2>
        {/* TODO: Implement collections list, notes, new collection form, suggestions */}
        <div className="text-slate-400">(CollectionsPanel coming soon)</div>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Search Encyclopedia</h1>
        <SearchBar value={""} onChange={() => {}} onSubmit={() => {}} />
        <FilterPanel>{/* TODO: Render nation filter buttons */}</FilterPanel>
        {hasResults ? <ResultsGrid items={items} /> : <NoResults />}
      </main>
    </div>
  );
};

export default Search;
