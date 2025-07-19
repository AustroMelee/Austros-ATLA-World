import React, { useEffect, useRef } from 'react';
import type { Collection } from '../../types/domainTypes';

interface Props {
  collections: Collection[];
  cardId: string;
  addCard: (collectionId: string, cardId: string) => void;
  removeCard: (collectionId: string, cardId: string) => void;
  onCreateNew: () => void;
  onClose: () => void;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export default function AddToCollectionPopover({ collections, cardId, addCard, removeCard, onCreateNew, onClose, cardRef }: Props) {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        // Don't close if clicking on the card itself
        if (cardRef?.current && cardRef.current.contains(event.target as Node)) {
          return;
        }
        // Close the popover
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, cardRef]);

  const getPosition = () => {
    if (!cardRef?.current) return { top: '20px', left: '20px' };
    
    const cardRect = cardRef.current.getBoundingClientRect();
    const popoverWidth = Math.max(cardRect.width, 200); // Minimum width
    const popoverHeight = Math.max(cardRect.height, 150); // Minimum height
    
    return {
      top: `${cardRect.top}px`,
      left: `${cardRect.left}px`,
      width: `${popoverWidth}px`,
      minHeight: `${popoverHeight}px`
    };
  };

  return (
    <div 
      ref={popoverRef}
      style={getPosition()}
      className="fixed bg-black/90 backdrop-blur-md border-2 border-[#70ab6c] rounded-lg shadow-2xl p-3 z-20 text-sm text-[#c8ffc8] crt-screen overflow-y-auto max-h-[80vh]"
    >
      <button type="button" className="w-full text-left p-1 rounded hover:bg-[#70ab6c]/20" onClick={onCreateNew}>
        + Create new collection
      </button>
      <hr className="border-t border-[#70ab6c]/20 my-1"/>
      <ul className="space-y-1">
        {collections.map(col => {
          const checked = col.cardIds.includes(cardId);
          return (
            <li key={col.id}>
              <button
                type="button"
                className="w-full flex items-center gap-2 p-1 rounded hover:bg-[#70ab6c]/20"
                onClick={() => checked ? removeCard(col.id, cardId) : addCard(col.id, cardId)}
              >
                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                  checked 
                    ? 'border-[#70ab6c] bg-[#70ab6c]/20' 
                    : 'border-[#70ab6c]/50 bg-transparent'
                }`}>
                  {checked && (
                    <div className="w-2 h-2 bg-[#70ab6c] rounded-sm shadow-[0_0_8px_rgba(112,171,108,0.8)]" />
                  )}
                </div>
                <span className="truncate flex-1">{col.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 