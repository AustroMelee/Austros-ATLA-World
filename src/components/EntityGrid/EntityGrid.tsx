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
    <div className="flex flex-wrap justify-center gap-4 bg-transparent">
      {items.map((gridItem) => (
        <ItemCard
          key={gridItem.record.id}
          item={gridItem.record}
          matchedFields={gridItem.matchedFields}
          expanded={gridItem.record.id === expandedCardId}
          onExpand={() => onCardExpand(gridItem.record.id)}
          collectionsApi={collectionsApi}
        />
      ))}
    </div>
  );
}
