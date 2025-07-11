import * as styles from './ResultsGrid.css';
import React from 'react';
import ItemCard from './ItemCard';
import type { EnrichedCharacter, EnrichedBending, EnrichedFauna, EnrichedFood, EnrichedLocation, EnrichedSpiritWorld } from '../types';

type ResultsGridProps = {
  items: Array<EnrichedCharacter | EnrichedBending | EnrichedFauna | EnrichedFood | EnrichedLocation | EnrichedSpiritWorld>;
};

export default function ResultsGrid({ items }: ResultsGridProps) {
  return (
    <div className={styles.grid}>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
