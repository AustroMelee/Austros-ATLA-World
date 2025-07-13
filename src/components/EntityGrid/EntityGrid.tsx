import React, { useLayoutEffect, useRef } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import { useCollectionsStore } from '../../collections/collectionsStore';
import type { EnrichedRecord, EnrichedCharacter } from '../../types/domainTypes';
import NoResults from '../NoResults';

interface EntityGridProps {
  items: EnrichedRecord[];
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export default function EntityGrid({ items, onSelect, selectedId, scrollContainerRef }: EntityGridProps) {
  const { openPanel } = useCollectionsStore();
  // Create a map to hold refs for each item's wrapper div.
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  // Use useLayoutEffect to ensure scrolling happens after the DOM has been updated but before paint.
  useLayoutEffect(() => {
    if (selectedId) {
      const node = itemRefs.current.get(selectedId);
      const container = scrollContainerRef.current;
      if (node && container) {
        // Calculate the position to scroll to
        const containerRect = container.getBoundingClientRect();
        const nodeRect = node.getBoundingClientRect();
        // Calculate the target element's center relative to the container's top
        const nodeCenter = node.offsetTop + nodeRect.height / 2;
        // Calculate the desired scroll position to center the node
        const scrollTop = nodeCenter - containerRect.height / 2;
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        });
      }
    }
  }, [selectedId, scrollContainerRef]);

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click target is the grid itself (the background) and not a child element,
    // collapse the currently selected card.
    if (e.target === e.currentTarget) {
      onSelect(null);
    }
  };

  if (items.length === 0) {
    return <NoResults />;
  }

  return (
    <div
      onClick={handleGridClick}
      onKeyDown={(e) => { if (e.key === 'Escape') onSelect(null); }}
      role="presentation"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
    >
      {items.map(item => (
        <div
          key={item.id}
          // Use a callback ref to populate the map of refs.
          ref={node => {
            if (node) {
              itemRefs.current.set(item.id, node);
            } else {
              itemRefs.current.delete(item.id);
            }
          }}
          className={selectedId === item.id ? 'xl:col-span-3 md:col-span-2 col-span-1' : ''}
        >
          <ItemCard
            item={item as EnrichedCharacter}
            expanded={selectedId === item.id}
            onExpand={() => onSelect(selectedId === item.id ? null : item.id)}
            onAddToCollection={() => openPanel(item.id)}
          />
        </div>
      ))}
    </div>
  );
}
