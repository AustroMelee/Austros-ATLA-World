import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Collection } from '../../types/domainTypes';

interface Props {
  collections: Collection[];
  cardId: string;
  addCard: (collectionId: string, cardId: string) => void;
  removeCard: (collectionId: string, cardId: string) => void;
  onCreateNew: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}

export default function AddToCollectionPopover({ 
  collections, 
  cardId, 
  addCard, 
  removeCard, 
  onCreateNew,
  buttonRef,
  onClose 
}: Props) {
  const [successStates, setSuccessStates] = useState<Record<string, boolean>>({});
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number, left: number } | null>(null);

  // Calculate position based on the button's location
  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const popoverWidth = 192; // w-48 in Tailwind
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - popoverWidth)
      });
    }
  }, [buttonRef]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, buttonRef]);

  const handleCollectionToggle = (e: React.MouseEvent, collectionId: string, isInCollection: boolean) => {
    e.stopPropagation();
    if (isInCollection) {
      removeCard(collectionId, cardId);
      setSuccessStates(prev => ({ ...prev, [collectionId]: false }));
    } else {
      addCard(collectionId, cardId);
      setSuccessStates(prev => ({ ...prev, [collectionId]: true }));
      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, [collectionId]: false }));
      }, 1500);
    }
  };

  if (!position) return null;

  const popoverContent = (
    <div 
      ref={popoverRef}
      style={{ 
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 50
      }}
      role="dialog"
      aria-label="Add to collections"
      className="w-48 bg-black/80 backdrop-blur-sm border border-[#70ab6c]/20 rounded shadow-lg p-2 text-sm text-[#c8ffc8] crt-screen"
    >
      <button 
        type="button" 
        className="w-full text-left p-1 rounded hover:bg-[#70ab6c]/20 focus:outline-none focus:ring-1 focus:ring-[#70ab6c]" 
        onClick={(e) => {
          e.stopPropagation();
          onCreateNew();
        }}
      >
        + Create new collection
      </button>
      <hr className="border-t border-[#70ab6c]/20 my-1"/>
      <ul role="listbox" className="max-h-48 overflow-y-auto">
        {collections.map(col => {
          const isInCollection = col.cardIds.includes(cardId);
          const showSuccess = successStates[col.id];
          return (
            <li key={col.id}>
              <button
                type="button"
                className="w-full flex items-center gap-2 p-1 rounded hover:bg-[#70ab6c]/20 focus:outline-none focus:ring-1 focus:ring-[#70ab6c]"
                onClick={(e) => handleCollectionToggle(e, col.id, isInCollection)}
                aria-pressed={isInCollection}
              >
                <span className="flex items-center justify-center w-4 h-4 border border-[#70ab6c] rounded">
                  {showSuccess && "✓"}
                </span>
                <span>{col.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return createPortal(popoverContent, document.body);
} 