import React, { useLayoutEffect, useRef } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import type { EnrichedRecord, EnrichedCharacter } from '../../types/domainTypes';
import NoResults from '../NoResults';

interface EntityGridProps {
  items: EnrichedRecord[];
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export default function EntityGrid({ items, onSelect, selectedId, scrollContainerRef }: EntityGridProps) {
  const itemRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());

  useLayoutEffect(() => {
    if (selectedId) {
      const node = itemRefs.current.get(selectedId);
      const container = scrollContainerRef.current;
      if (node && container) {
        const containerRect = container.getBoundingClientRect();
        const nodeCenter = node.offsetTop + (node.clientHeight / 2);
        const scrollTop = nodeCenter - (containerRect.height / 2);
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    }
  }, [selectedId, scrollContainerRef]);
  
  if (items.length === 0) {
    return <NoResults />;
  }

  return (
    <div className="relative overflow-x-hidden">
      {/* Card Grid: Now Flexbox for overflow-safe hover */}
      <div
        className={`flex flex-wrap gap-8 overflow-visible px-6 py-8`}
      >
        {items.map(item => (
          <div
            key={item.id}
            ref={node => { itemRefs.current.set(item.id, node); }}
            className="relative overflow-visible w-[188px] m-2"
          >
            <div className={
              `transition-transform duration-200 ease-out${selectedId !== item.id ? ' hover:scale-[1.015] hover:z-10 hover:shadow-lg' : ''}`
            }>
              <ItemCard
                item={item as EnrichedCharacter}
                expanded={false}
                onExpand={() => onSelect(item.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
