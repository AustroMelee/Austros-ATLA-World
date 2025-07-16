// src/pages/HomeContainer.tsx (Corrected Refactor)

import React, { useState, useEffect } from 'react';
import { Home } from './Home';
import { useSearch } from '../hooks/useSearch';
import type { EnrichedEntity } from '../search/types';

export function HomeContainer() {
  const [allEntities, setAllEntities] = useState<EnrichedEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  // --- START: NEW EXPANSION LOGIC ---
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const handleCardExpand = (cardId: string) => {
    setExpandedCardId(prevId => (prevId === cardId ? null : cardId));
  };
  // --- END: NEW EXPANSION LOGIC ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/enriched-data.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data: EnrichedEntity[] = await response.json();
        setAllEntities(data);
      } catch (error) {
        console.error('Error fetching enriched data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const results = useSearch(allEntities, query);
  return (
    <Home
      searchResults={results}
      loading={loading}
      query={query}
      handleSearchChange={setQuery}
      // --- PASS NEW PROPS ---
      expandedCardId={expandedCardId}
      onCardExpand={handleCardExpand}
      // --- END NEW PROPS ---
      filterOptions={{}}
      activeFilters={{}}
      handleFilterChange={() => {}}
      filterCounts={{}}
    />
  );
}

export default HomeContainer; 