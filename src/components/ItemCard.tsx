import * as styles from './ItemCard.css';
import React from 'react';
import type { EnrichedRecord } from '../types';

// Remove 'to' prop from ItemCardProps
type ItemCardProps = {
  item: EnrichedRecord;
  expanded?: boolean;
  onExpand?: (id: string | null) => void;
};

// Type guard for character records
function isCharacter(item: EnrichedRecord): item is import('../types/domainTypes').EnrichedCharacter {
  return item.__type === 'character';
}

export default function ItemCard({ item, expanded, onExpand }: ItemCardProps) {
  const handleClick = () => {
    if (onExpand) {
      onExpand(expanded ? null : item.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const cardContent = (
    <>
      <div className={styles.title}>{item.name}</div>
      <div>
        {expanded
          ? (
              <>
                <div>{item.description || <em>No description available.</em>}</div>
                {'expansion' in item && item.expansion && (
                  <div className={styles.expansion}>
                    {item.expansion.fullBio && <p>{item.expansion.fullBio}</p>}
                    {item.expansion.notableEpisodes && (
                      <>
                        <strong>Notable Episodes:</strong>
                        <ul>
                          {item.expansion.notableEpisodes.map((ep: string) => <li key={ep}>{ep}</li>)}
                        </ul>
                      </>
                    )}
                    {item.expansion.quotes && (
                      <>
                        <strong>Quotes:</strong>
                        <ul>
                          {item.expansion.quotes.map((q: string) => <li key={q}>&ldquo;{q}&rdquo;</li>)}
                        </ul>
                      </>
                    )}
                  </div>
                )}
              </>
            )
          : (
              <div>
                {isCharacter(item)
                  ? (typeof item.shortDescription === 'string' && item.shortDescription.trim().length > 0
                      ? item.shortDescription.trim()
                      : <em>No summary available.</em>)
                  : (item.description || <em>No summary available.</em>)}
              </div>
            )}
      </div>
      {'tags' in item && Array.isArray(item.tags) && (
        <div className={styles.tags}>
          {item.tags.map(tag => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
      {'expansion' in item && item.expansion && onExpand && (
        <button type="button" onClick={e => { e.stopPropagation(); handleClick(); }} className={styles.expandBtn}>
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      )}
    </>
  );

  // Only render as expandable card, no navigation
  return (
    <div
      className={expanded ? styles.cardExpanded : styles.card}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={expanded}
    >
      {cardContent}
    </div>
  );
}
