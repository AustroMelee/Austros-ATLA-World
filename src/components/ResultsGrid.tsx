import React from 'react';
import ItemCard from './ItemCard';
import type { EnrichedRecord } from '../types';

type ResultsGridProps = { 
  items: Array<EnrichedRecord & { to?: string }>;
  expandedId?: string | null;
  onExpand?: (id: string | null) => void;
};

function getIcon(item: EnrichedRecord): React.ReactNode {
  if ('expansion' in item && item.expansion && typeof item.expansion === 'object' && 'icon' in item.expansion) {
    const icon = (item.expansion as { icon?: React.ReactNode }).icon;
    if (icon) return icon;
  }
  return '🌐';
}

export default function ResultsGrid({ items, expandedId, onExpand }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map(item => (
        <ItemCard
          key={item.slug}
          name={item.name}
          type={item.__type}
          tags={item.tags || []}
          nation={('nation' in item && item.nation) ? item.nation! : 'Unknown'}
          icon={getIcon(item)}
          expanded={expandedId === item.id}
          onExpand={onExpand ? () => onExpand(item.id) : undefined}
        />
      ))}
    </div>
  );
}
