import React, { useEffect, useState, useCallback } from 'react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import FilterTag from '../components/FilterTag';
import ResultsGrid from '../components/ResultsGrid';
import NoResults from '../components/NoResults';
import LoadingSpinner from '../components/LoadingSpinner';
import * as styles from './Food.css';
import { useSearchParams } from 'react-router-dom';
import * as ClientSearchEngine from '../search/ClientSearchEngine';
import type { EnrichedRecord } from '../types/domainTypes';

const FOOD_TYPE = 'food';
const FOOD_FILTERS = [
  { key: 'region', label: 'Region' },
];

export default function FoodPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') || '');
  const [filters, setFilters] = useState<{ [key: string]: string }>(() => {
    const obj: { [key: string]: string } = {};
    FOOD_FILTERS.forEach(f => {
      const v = searchParams.get(f.key);
      if (v) obj[f.key] = v;
    });
    return obj;
  });
  const [results, setResults] = useState<EnrichedRecord[]>([]);
  const [loading, setLoading] = useState(true);
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
      let fetchedResults: EnrichedRecord[];
      if (searchQuery) {
        fetchedResults = await ClientSearchEngine.search(searchQuery);
      } else {
        fetchedResults = await ClientSearchEngine.getAllByType(FOOD_TYPE);
      }

      let filtered = fetchedResults.filter(r => r && typeof r === 'object' && r.__type === FOOD_TYPE) as EnrichedRecord[];
      FOOD_FILTERS.forEach(f => {
        if (filters[f.key]) {
          filtered = filtered.filter(r => {
            if (f.key === 'region' && 'region' in r) return (r as Record<string, unknown>).region === filters[f.key];
            return true;
          });
        }
      });
      setResults(filtered);
    } catch (e) {
      console.error(e);
      setError('Failed to load results.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    ClientSearchEngine.init().then(() => {
      doSearch();
    }).catch(_e => {
        setError('Failed to initialize search engine.');
        setLoading(false);
    })
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
      <h1 className={styles.title}>Food</h1>
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
        <ResultsGrid items={results.map(item => ({...item, to: `/food/${item.slug}`}))} />
      )}
    </main>
  );
}
