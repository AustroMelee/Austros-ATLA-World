// src/pages/HomeContainer.tsx

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

  let displayItems = allEntities;
  if (activeCollectionId) {
    const activeCollection = collectionsApi.collections.find(c => c.id === activeCollectionId);
    const idSet = new Set(activeCollection?.cardIds || []);
    displayItems = allEntities.filter(item => idSet.has(item.id));
  }

  const searchResults = useSearch(displayItems, query);

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
    />
  );
}

export default HomeContainer; 