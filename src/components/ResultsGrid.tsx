import * as styles from './ResultsGrid.css';
import React from 'react';
import ItemCard from './ItemCard';
import type { EnrichedRecord } from '../types';

type ResultsGridProps = { 
  items: Array<EnrichedRecord & { to?: string }> 
};

export default function ResultsGrid({ items }: ResultsGridProps) {
  return (
    <div className={styles.grid}>
      {items.map(item => (
        <ItemCard key={item.slug} item={item} />
      ))}
    </div>
  );
}
