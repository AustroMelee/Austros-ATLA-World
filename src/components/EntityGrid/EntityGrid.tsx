import React from 'react';
import ItemCard from '../ItemCard/ItemCard';
import { useCollectionsStore } from '../../collections/collectionsStore';
import type { EnrichedRecord } from '../../types/domainTypes';

interface EntityGridProps {
  items: EnrichedRecord[];
}

export default function EntityGrid({ items }: EntityGridProps) {
  const {
    collections,
    openPanel,
  } = useCollectionsStore();

  // Flatten all item IDs in all collections for quick lookup
  const allCollectionItems = new Set(
    Object.values(collections).flatMap(col => col.items)
  );

  function getIcon(item: EnrichedRecord): React.ReactNode {
    if ('__type' in item) {
      switch (item.__type) {
        case 'character': return '👤';
        case 'food': return '🍲';
        case 'bending': return '💨';
        case 'fauna': return '🐾';
        case 'location': return '📍';
        case 'spirit-world': return '✨';
        default: return '🌐';
      }
    }
    return '🌐';
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map(item => (
        <ItemCard
          key={item.slug}
          name={item.name}
          type={item.__type}
          tags={item.tags || []}
          nation={('nation' in item && item.nation) ? item.nation! : 'neutral'}
          icon={getIcon(item)}
          inCollection={allCollectionItems.has(item.id)}
          onAddToCollection={() => openPanel(item.id)}
          description={('description' in item && item.description) ? item.description : ''}
        />
      ))}
    </div>
  );
}
