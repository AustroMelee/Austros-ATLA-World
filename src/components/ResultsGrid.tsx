import * as styles from './ResultsGrid.css';
import React from 'react';
import ItemCard from './ItemCard';
import type { EnrichedRecord } from '../types';

type ResultsGridProps = { 
  items: Array<EnrichedRecord & { to?: string }>;
  expandedId?: string | null;
  onExpand?: (id: string | null) => void;
};

export default function ResultsGrid({ items, expandedId, onExpand }: ResultsGridProps) {
  return (
    <div className={styles.grid}>
      {items.map(item => (
        <ItemCard key={item.slug} item={item} expanded={expandedId === item.id} onExpand={onExpand} />
      ))}
    </div>
  );
}
