// src/pages/HomeContainer.tsx

import React, { useState } from 'react';
import { Home } from './Home';
import { useSearch } from '../hooks/useSearch';
import { useEnrichedData } from '../hooks/useEnrichedData';
import { useCardExpansion } from '../hooks/useCardExpansion';

export function HomeContainer() {
  const { data: allEntities, loading } = useEnrichedData();
  const [query, setQuery] = useState('');
  const { expandedId, toggle } = useCardExpansion();

  const results = useSearch(allEntities, query);

  return (
    <Home
      searchResults={results}
      loading={loading}
      query={query}
      handleSearchChange={setQuery}
      expandedCardId={expandedId}
      onCardExpand={toggle}
    />
  );
}

export default HomeContainer; 