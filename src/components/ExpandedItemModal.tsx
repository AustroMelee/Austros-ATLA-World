import React from 'react';
import { useModalFocus } from '../hooks/useModalFocus';
import ItemCard from './ItemCard/ItemCard';
import type { EnrichedEntity } from '../search/types';

interface ExpandedItemModalProps {
  item: EnrichedEntity;
  onClose: () => void;
}

export function ExpandedItemModal({ item, onClose }: ExpandedItemModalProps) {
  useModalFocus(true);

  return (
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
        onClick={onClose}
        onKeyDown={e => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') onClose(); }}
        style={{ zIndex: 1 }}
      />
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto relative" style={{ zIndex: 2 }}>
        <ItemCard
          item={item}
          expanded={true}
          onExpand={onClose}
        />
      </div>
    </section>
  );
}
