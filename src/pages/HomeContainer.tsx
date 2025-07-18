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

  // NEW STATE VARIABLES
  const [activeNations, setActiveNations] = useState<Set<string>>(new Set());
  const [activeCoreFilter, setActiveCoreFilter] = useState<string | null>(null);
  const [activeSubFilters, setActiveSubFilters] = useState<Set<string>>(new Set());

  // NEW HANDLER FUNCTIONS
  const handleToggleNation = (nation: string) => {
    setActiveNations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nation)) {
        newSet.delete(nation);
      } else {
        newSet.add(nation);
      }
      return newSet;
    });
  };

  const handleSetCoreFilter = (filter: string | null) => {
    setActiveCoreFilter(prev => (prev === filter ? null : filter));
    setActiveSubFilters(new Set()); // Clear sub-filters when core changes
  };
  
  const handleToggleSubFilter = (subFilter: string) => {
    setActiveSubFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subFilter)) {
        newSet.delete(subFilter);
      } else {
        newSet.add(subFilter);
      }
      return newSet;
    });
  };
  
  // SEQUENTIAL FILTERING PIPELINE
  let itemsToFilter = allEntities;

  if (activeCollectionId) {
    const activeCollection = collectionsApi.collections.find(c => c.id === activeCollectionId);
    const idSet = new Set(activeCollection?.cardIds || []);
    itemsToFilter = itemsToFilter.filter(item => idSet.has(item.id));
  }

  if (activeNations.size > 0) {
    itemsToFilter = itemsToFilter.filter(item => 
      item.nation && 
      Array.from(activeNations).some(nationFilter => 
        item.nation!.toLowerCase().includes(nationFilter.toLowerCase())
      )
    );
  }

  if (activeCoreFilter) {
    const typeMap: Record<string, string> = { characters: 'character', locations: 'location', fauna: 'fauna', foods: 'food', groups: 'group', spirits: 'spirit-world' };
    const targetType = typeMap[activeCoreFilter];
    if (targetType) itemsToFilter = itemsToFilter.filter(item => item.type === targetType);
  }

  if (activeCoreFilter && activeSubFilters.size > 0) {
    itemsToFilter = itemsToFilter.filter(item => {
      // Check if ALL of the active sub-filters match the item's properties
      return Array.from(activeSubFilters).every(subFilter => {
        const subFilterLower = subFilter.toLowerCase();
        
        // Map filter terms to data terms
        const filterMapping: Record<string, string[]> = {
          'villains': ['antagonist', 'villain'],
          'heroes': ['protagonist', 'hero', 'deuteragonist', 'mentor'],
          'mentors': ['mentor'],
          'male': ['male'],
          'female': ['female'],
          'child': ['child'],
          'teen': ['teen'],
          'young adult': ['young adult'],
          'adult': ['adult'],
          'elder': ['elder', 'old', 'senior'],
          'bender': ['bender'],
          'nonbender': ['nonbender']
        };
        
        const mappedTerms = filterMapping[subFilterLower] || [subFilterLower];
        
        // Check tags array
        if (item.tags?.some(tag => mappedTerms.includes(tag.toLowerCase()))) {
          return true;
        }
        
        // Check role field (can be string or string[])
        if (item.role) {
          if (typeof item.role === 'string' && mappedTerms.includes(item.role.toLowerCase())) {
            return true;
          }
          if (Array.isArray(item.role) && item.role.some(role => mappedTerms.includes(role.toLowerCase()))) {
            return true;
          }
        }
        
        // Check metadata.narrativeFunction
        if (item.metadata?.narrativeFunction && typeof item.metadata.narrativeFunction === 'string') {
          const narrativeFunction = item.metadata.narrativeFunction.toLowerCase();
          if (mappedTerms.some(term => narrativeFunction.includes(term))) {
            return true;
          }
        }
        
        // Check eraAppearances roles
        if (item.metadata?.eraAppearances && Array.isArray(item.metadata.eraAppearances)) {
          for (const era of item.metadata.eraAppearances as Array<{role?: string}>) {
            if (era.role && typeof era.role === 'string' && mappedTerms.includes(era.role.toLowerCase())) {
              return true;
            }
          }
        }
        
        // Check gender field
        if (item.gender && typeof item.gender === 'string' && mappedTerms.includes(item.gender.toLowerCase())) {
          return true;
        }
        
        // Check ageRange field in metadata (only for non-animals)
        if (item.metadata?.ageRange && typeof item.metadata.ageRange === 'string' && mappedTerms.includes(item.metadata.ageRange.toLowerCase())) {
          // Skip age range filtering for animals
          if (item.metadata?.species && typeof item.metadata.species === 'string') {
            const species = item.metadata.species.toLowerCase();
            if (species.includes('bison') || species.includes('lemur') || species.includes('bear') || species.includes('animal') || species.includes('spirit')) {
              return false;
            }
          }
          return true;
        }
        
        // Check bender/nonbender status
        if (mappedTerms.includes('bender') || mappedTerms.includes('nonbender')) {
          const isBender = Boolean(item.metadata?.isBender);
          const hasBendingElement = item.metadata?.bendingElement !== null && item.metadata?.bendingElement !== undefined;
          
          if (mappedTerms.includes('bender') && (isBender || hasBendingElement)) {
            return true;
          }
          
          if (mappedTerms.includes('nonbender') && !isBender && !hasBendingElement) {
            return true;
          }
        }
        
        return false;
      });
    });
  }
  
  const searchResults = useSearch(itemsToFilter, query);

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
      // Pass new state and handlers down
      activeNations={activeNations}
      onToggleNation={handleToggleNation}
      activeCoreFilter={activeCoreFilter}
      onSetCoreFilter={handleSetCoreFilter}
      activeSubFilters={activeSubFilters}
      onToggleSubFilter={handleToggleSubFilter}
    />
  );
}

export default HomeContainer; 