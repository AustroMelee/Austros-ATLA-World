import * as styles from './ItemCard.css';
import React from 'react';
import type { EnrichedCharacter, EnrichedBending, EnrichedFauna, EnrichedFood, EnrichedLocation, EnrichedSpiritWorld } from '../types';

type ItemCardProps = {
  item: EnrichedCharacter | EnrichedBending | EnrichedFauna | EnrichedFood | EnrichedLocation | EnrichedSpiritWorld;
};

export default function ItemCard({ item }: ItemCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{item.name}</div>
      <div>{item.description}</div>
      <div className={styles.tags}>
        {item.tags?.map(tag => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
