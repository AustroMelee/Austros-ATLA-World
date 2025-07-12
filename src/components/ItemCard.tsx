import * as styles from './ItemCard.css';
import React from 'react';
import type { EnrichedRecord } from '../types';
import { Link } from 'react-router-dom';

type ItemCardProps = {
  item: EnrichedRecord & { to?: string };
};

export default function ItemCard({ item }: ItemCardProps) {
  const cardContent = (
    <>
      <div className={styles.title}>{item.name}</div>
      <div>{item.description}</div>
      {'tags' in item && Array.isArray(item.tags) && (
        <div className={styles.tags}>
          {item.tags.map(tag => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </>
  );

  if (item.to) {
    return (
      <Link to={item.to} className={styles.card}>
        {cardContent}
      </Link>
    );
  }

  return <div className={styles.card}>{cardContent}</div>;
}
