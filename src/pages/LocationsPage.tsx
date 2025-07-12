import React, { useEffect, useState, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import FilterTag from '../components/FilterTag';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import CollectionsPanel from '../components/CollectionsPanel/CollectionsPanel';
import NoResults from '../components/NoResults';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSearchParams } from 'react-router-dom';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import type { EnrichedRecord } from '../types/domainTypes';
import { useCollectionsStore } from '../collections/collectionsStore';

const LOCATION_TYPE = 'location';
const LOCATION_FILTERS = [
  { key: 'region', label: 'Region' },
];

export default function LocationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [filters, setFilters] = useState<{ [key: string]: string }>(() => {
    const obj: { [key: string]: string } = {};
    LOCATION_FILTERS.forEach(f => {
      const v = searchParams.get(f.key);
      if (v) obj[f.key] = v;
    });
    return obj;
  });
  const [results, setResults] = useState<EnrichedRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    collections,
    selectedItem,
    panelOpen,
    createCollection,
    addItemToCollection,
    closePanel,
  } = useCollectionsStore();

  useEffect(() => {
    const params: Record<string, string> = {};
    if (searchQuery) params.q = searchQuery;
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params[k] = v;
    });
    setSearchParams(params, { replace: true });
  }, [searchQuery, filters, setSearchParams]);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await ClientSearchEngine.init();
      const all = await ClientSearchEngine.search(searchQuery);
      let filtered = all.filter(r => r && typeof r === 'object' && r.__type === LOCATION_TYPE) as EnrichedRecord[];
      console.log('[LocationsPage] Filtered location records:', filtered.length, filtered.map(r => r.slug));
      LOCATION_FILTERS.forEach(f => {
        if (filters[f.key]) {
          filtered = filtered.filter(r => {
            if (f.key === 'region' && 'region' in r) return r.region === filters[f.key];
            return true;
          });
        }
      });
      setResults(filtered);
    } catch (e) {
      setError('Failed to load results.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const removeFilter = (key: string) => {
    setFilters(f => {
      const next = { ...f };
      delete next[key];
      return next;
    });
  };

  const filterTags = Object.entries(filters).map(([key, value]) => (
    <FilterTag key={key} label={`${key}: ${value}`} onRemove={() => removeFilter(key)} />
  ));

  return (
    <main className="w-full max-w-5xl mx-auto py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-slate-100 mb-4">Locations</h1>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        onSubmit={doSearch}
      />
      <FilterPanel>{filterTags}</FilterPanel>
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>
      ) : results.length === 0 ? (
        <NoResults />
      ) : (
        <EntityGrid items={results} />
      )}
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
    </main>
  );
}
