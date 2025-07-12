import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterPanel from '../components/FilterPanel';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import NoResults from '../components/NoResults';
import LoadingSpinner from '../components/LoadingSpinner';
import CollectionsPanel from '../components/CollectionsPanel/CollectionsPanel';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import { useCollectionsStore } from '../collections/collectionsStore';
import { useDebounce } from '../hooks/useDebounce';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Awaited<ReturnType<typeof ClientSearchEngine.search>>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const debouncedQuery = useDebounce(query, 250);

  const {
    collections,
    selectedItem,
    panelOpen,
    createCollection,
    addItemToCollection,
    closePanel,
  } = useCollectionsStore();

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const searchResults = await ClientSearchEngine.search(debouncedQuery);
      setResults(searchResults);
    } catch (e) {
      setError('Search failed to execute.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    ClientSearchEngine.init().then(runSearch).catch(e => {
      setError('Failed to initialize search engine.');
      console.error(e);
      setLoading(false);
    });
  }, [runSearch]);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto min-h-[80vh] gap-8 py-8 px-4">
      <aside className="w-full md:w-80 bg-slate-800 rounded-xl p-6 h-fit sticky top-8 mb-8 md:mb-0">
        <h2 className="text-xl font-bold text-slate-100 mb-4">My Collections</h2>
        <div className="text-slate-400">(Collections functionality coming soon)</div>
      </aside>

      <main className="flex-1 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-slate-100 mb-2">Search Encyclopedia</h1>
        <SearchBar value={query} onChange={setQuery} onSubmit={runSearch} />
        <FilterPanel>{/* TODO: Render dynamic filters */}</FilterPanel>

        {loading ? <LoadingSpinner /> : null}
        {error ? <div className="text-red-500 text-center">{error}</div> : null}
        {!loading && !error && results.length > 0 && <EntityGrid items={results} />}
        {!loading && !error && results.length === 0 && <NoResults />}
      </main>

      <CollectionsPanel
        collections={Object.entries(collections).map(([id, col]) => ({ id, ...col }))}
        open={panelOpen}
        onSelect={collectionId => {
          if (selectedItem) addItemToCollection(collectionId, selectedItem);
          closePanel();
        }}
        onCreate={name => createCollection(name)}
        onClose={closePanel}
      />
    </div>
  );
};

export default Search;
