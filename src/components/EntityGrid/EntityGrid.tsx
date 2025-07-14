import React, { useLayoutEffect, useRef, useEffect } from 'react';
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
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (selectedId) {
      document.body.style.overflow = 'hidden';
      lastFocusedElement.current = document.activeElement as HTMLElement;
    } else {
      document.body.style.overflow = '';
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedId]);

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
  
  const expandedItem = selectedId ? items.find(item => item.id === selectedId) : null;
  
  return (
    <div className="relative overflow-x-hidden">
      {/* Card Grid: Now Flexbox for overflow-safe hover */}
      <div
        className={`${expandedItem ? 'opacity-10 pointer-events-none' : 'opacity-100'} flex flex-wrap gap-8 overflow-visible px-6 py-8`}
      >
        {/* Uncomment for debug: <div className="ring-4 ring-yellow-500"> */}
        {items.map(item => (
          <div
            key={item.id}
            ref={node => { itemRefs.current.set(item.id, node); }}
            className="relative overflow-visible w-[300px] m-2"
          >
            {/* Uncomment for debug: <div className="ring-4 ring-orange-500"> */}
            <div className={
              `transition-transform duration-200 ease-out${selectedId !== item.id ? ' hover:scale-[1.015] hover:z-10 hover:shadow-lg' : ''}`
            }>
              <ItemCard
                item={item as EnrichedCharacter}
                expanded={false}
                onExpand={() => onSelect(item.id)}
              />
            </div>
            {/* Uncomment for debug: </div> */}
          </div>
        ))}
        {/* Uncomment for debug: </div> */}
      </div>
      
      {/* Modal Overlay for Expanded Card */}
      {expandedItem && (
        <section
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          {/* Overlay click to close */}
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default bg-transparent border-none p-0 m-0"
            aria-label="Close expanded card"
            tabIndex={0}
            onClick={() => onSelect(null)}
            onKeyDown={e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onSelect(null); }}
            style={{ zIndex: 1 }}
          />
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 2 }}>
            <ItemCard
              item={expandedItem as EnrichedCharacter}
              expanded={true}
              onExpand={() => onSelect(null)}
            />
          </div>
        </section>
      )}
    </div>
  );
}
