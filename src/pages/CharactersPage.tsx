import React, { useEffect, useState, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import FilterTag from '../components/FilterTag';
import ResultsGrid from '../components/ResultsGrid';
import NoResults from '../components/NoResults';
import LoadingSpinner from '../components/LoadingSpinner';
import * as styles from './Characters.css';
import { useSearchParams } from 'react-router-dom';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import type { EnrichedRecord } from '../types/domainTypes';

const CHARACTER_TYPE = 'character'; // FIX: Changed to plural to match the directory name
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
      // Efficient initial load: get all by type if no search query
      const initialRecords = searchQuery
        ? await ClientSearchEngine.search(searchQuery)
        : await ClientSearchEngine.getAllByType(CHARACTER_TYPE);

      let filtered = initialRecords.filter(r => r && r.__type === CHARACTER_TYPE) as EnrichedRecord[];
      
      console.log(`[CharactersPage] Found ${filtered.length} records of type '${CHARACTER_TYPE}'.`);

      CHARACTER_FILTERS.forEach(f => {
        if (filters[f.key]) {
          filtered = filtered.filter(r => {
            const record = r as import('../types/domainTypes').EnrichedCharacter;
            if (f.key === 'nation' && record.nation) return record.nation === filters[f.key];
            if (f.key === 'bending' && record.bending) return record.bending.includes(filters[f.key]);
            return false;
          });
        }
      });
      setResults(filtered);
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
    <main className={styles.container}>
      <h1 className={styles.title}>Characters</h1>
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
        <ResultsGrid
          items={results}
          expandedId={expandedId}
          onExpand={setExpandedId}
        />
      )}
    </main>
  );
}
