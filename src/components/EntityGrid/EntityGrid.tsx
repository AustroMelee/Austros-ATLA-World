import React from 'react';
import ItemCard from '../ItemCard/ItemCard';
import { useCollectionsStore } from '../../collections/collectionsStore';
import type { EnrichedRecord, EnrichedCharacter } from '../../types/domainTypes';

interface EntityGridProps {
  items: EnrichedRecord[];
  expandedId: string | null;
  onExpand: (id: string) => void;
}

export default function EntityGrid({ items, expandedId, onExpand }: EntityGridProps) {
  const { openPanel } = useCollectionsStore();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map(item => (
        <div key={item.slug} className={expandedId === item.id ? 'invisible' : ''}>
          <ItemCard
            item={item as EnrichedCharacter}
            expanded={false}
            onExpand={() => onExpand(item.id)}
            onAddToCollection={() => openPanel(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
