import React, { useLayoutEffect, useRef, useEffect } from 'react';
import ItemCard from '../ItemCard/ItemCard';
import type { EnrichedRecord, EnrichedCharacter } from '../../types/domainTypes';
import NoResults from '../NoResults';

interface EntityGridProps {
  items: EnrichedRecord[];
  onSelect: (id: string | null) => void;
  selectedId: string | null;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  onAddToCollection: (itemId: string) => void;
}

export default function EntityGrid({ items, onSelect, selectedId, scrollContainerRef, onAddToCollection }: EntityGridProps) {
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
    <div className="relative">
      {/* Grid of Compact Cards */}
      <div className={`${expandedItem ? 'opacity-10 pointer-events-none' : 'opacity-100'} grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 transition-opacity duration-300`}>
        {items.map(item => (
          <div
            key={item.id}
            ref={node => { itemRefs.current.set(item.id, node); }}
          >
            <ItemCard
              item={item as EnrichedCharacter}
              expanded={false}
              onExpand={() => onSelect(item.id)}
            />
          </div>
        ))}
      </div>
      
      {/* Modal Overlay for Expanded Card */}
      {expandedItem && (
        <section
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
          onKeyDown={(e) => { if (e.key === 'Escape') onSelect(null); }}
          role="dialog"
          aria-modal="true"
          tabIndex={0}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <ItemCard
              item={expandedItem as EnrichedCharacter}
              expanded={true}
              onExpand={() => onSelect(null)}
              onAddToCollection={() => onAddToCollection(expandedItem.id)}
            />
          </div>
        </section>
      )}
    </div>
  );
}
