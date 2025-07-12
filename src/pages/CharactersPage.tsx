import React, { useEffect, useState, useCallback, useRef } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import FilterPanel from '../components/FilterPanel';
import FilterTag from '../components/FilterTag';
import NoResults from '../components/NoResults';
import LoadingSpinner from '../components/LoadingSpinner';
import { useSearchParams } from 'react-router-dom';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import type { EnrichedRecord, EnrichedCharacter } from '../types/domainTypes';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import CollectionsPanel from '../components/CollectionsPanel/CollectionsPanel';
import ItemCard from '../components/ItemCard/ItemCard';
import { useCollectionsStore } from '../collections/collectionsStore';

const CHARACTER_TYPE = 'character';
const CHARACTER_FILTERS = [
  { key: 'nation', label: 'Nation' },
  { key: 'bending', label: 'Bending' },
];

export default function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [filters, setFilters] = useState<{ [key: string]: string }>(() => {
    const obj: { [key: string]: string } = {};
    CHARACTER_FILTERS.forEach(f => {
      const v = searchParams.get(f.key);
      if (v) obj[f.key] = v;
    });
    return obj;
  });
  const [results, setResults] = useState<EnrichedRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const expandedCardRef = useRef<HTMLDivElement>(null);

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

  const handleExpand = (id: string) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await ClientSearchEngine.init();
      const initialRecords = searchQuery ? await ClientSearchEngine.search(searchQuery) : await ClientSearchEngine.getAllByType(CHARACTER_TYPE);
      let filtered = initialRecords.filter(r => r && r.__type === CHARACTER_TYPE) as EnrichedRecord[];
      CHARACTER_FILTERS.forEach(f => {
        if (filters[f.key]) {
          filtered = filtered.filter(r => {
            const record = r as EnrichedCharacter;
            if (f.key === 'nation' && record.nation) return record.nation === filters[f.key];
            if (f.key === 'bending' && record.bending) return record.bending.includes(filters[f.key]);
            return false;
          });
        }
      });
      setResults(filtered);
      setExpandedId(null);
    } catch (e) {
      setError('Failed to load results.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const expandedItem = results.find(item => item.id === expandedId) as EnrichedCharacter | undefined;
  
  useEffect(() => {
    if (expandedItem && expandedCardRef.current) {
      // We don't need to auto-scroll anymore, the flex alignment handles it.
    }
  }, [expandedItem]);

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
    <>
      <main className="w-full max-w-5xl mx-auto py-10 px-4 flex flex-col items-center">
        <h1 className="text-3xl font-extrabold text-slate-100 mb-4">Characters</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onSubmit={doSearch} />
        <FilterPanel>{filterTags}</FilterPanel>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div style={{ color: 'red', margin: '1rem 0' }}>{error}</div>
        ) : results.length === 0 ? (
          <NoResults />
        ) : (
          <EntityGrid items={results} expandedId={expandedId} onExpand={handleExpand} />
        )}
      </main>

      {/* MODAL OVERLAY LOGIC */}
      {expandedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-30 flex items-start md:items-center justify-center p-4 overflow-y-auto"
        >
          {/* Backdrop - click to close, accessible */}
          <button
            type="button"
            className="absolute inset-0 w-full h-full bg-slate-900/80 backdrop-blur-sm cursor-pointer"
            onClick={() => handleExpand(expandedItem.id)}
            aria-label="Close expanded card"
            tabIndex={0}
          />
          {/* Expanded Card Container */}
          <div
            ref={expandedCardRef}
            className="relative z-40 w-full max-w-5xl my-8"
            onClick={e => e.stopPropagation()}
          >
            <ItemCard
              item={expandedItem}
              expanded={true}
              onExpand={() => handleExpand(expandedItem.id)}
            />
          </div>
        </div>
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
    </>
  );
}
