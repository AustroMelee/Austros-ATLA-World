// CARD SIZE POLICY: The width of each card in the grid is controlled by the Tailwind class `w-[188px]` applied to the card container div below. To change card size globally, update this value here. All internal content in ItemCard is sized relative to this width for visual consistency.
import React from 'react';
import ItemCard from '../ItemCard/ItemCard';
import type { GridItem } from '../../types/grid';

interface EntityGridProps {
  items: GridItem[];
  expandedCardId: string | null;
  onCardExpand: (cardId: string) => void;
  collectionsApi: import('../../hooks/useCollections').UseCollectionsReturn;
}

export default function EntityGrid({ items, expandedCardId, onCardExpand, collectionsApi }: EntityGridProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center p-4">
      {items.map((item) => (
        <div key={item.record.id} className="w-[188px]">
          <ItemCard
            item={item.record}
            matchedFields={item.matchedFields}
            expanded={expandedCardId === item.record.id}
            onExpand={() => onCardExpand(item.record.id)}
            collectionsApi={collectionsApi}
          />
        </div>
      ))}
    </div>
  );
}
