import React, { useEffect, useState, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import FilterTag from '../components/FilterTag';
import ResultsGrid from '../components/ResultsGrid';
import NoResults from '../components/NoResults';
import LoadingSpinner from '../components/LoadingSpinner';
import * as styles from './SpiritWorld.css';
import { useSearchParams } from 'react-router-dom';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import type { EnrichedRecord } from '../types/domainTypes';

const SPIRIT_TYPE = 'spirit-world';
const SPIRIT_FILTERS = [
  { key: 'type', label: 'Type' },
];

export default function SpiritWorldPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [filters, setFilters] = useState<{ [key: string]: string }>(() => {
    const obj: { [key: string]: string } = {};
    SPIRIT_FILTERS.forEach(f => {
      const v = searchParams.get(f.key);
      if (v) obj[f.key] = v;
    });
    return obj;
  });
  const [results, setResults] = useState<EnrichedRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      let filtered = all.filter(r => r && typeof r === 'object' && r.__type === SPIRIT_TYPE) as EnrichedRecord[];
      console.log('[SpiritWorldPage] Filtered spirit world records:', filtered.length, filtered.map(r => r.slug));
      SPIRIT_FILTERS.forEach(f => {
        if (filters[f.key]) {
          filtered = filtered.filter(r => {
            if (f.key === 'type' && 'type' in r) return r.type === filters[f.key];
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
    <main className={styles.container}>
      <h1 className={styles.title}>Spirit World</h1>
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
        <ResultsGrid items={results.map(item => ({...item, to: `/spirit-world/${item.slug}`}))} />
      )}
    </main>
  );
}
