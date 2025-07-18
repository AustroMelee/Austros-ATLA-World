import React from 'react';
import type { Collection } from '../../types/domainTypes';

interface Props {
  collections: Collection[];
  cardId: string;
  addCard: (collectionId: string, cardId: string) => void;
  removeCard: (collectionId: string, cardId: string) => void;
  onCreateNew: () => void;
  onClose: () => void;
}

export default function AddToCollectionPopover({ collections, cardId, addCard, removeCard, onCreateNew, onClose: _onClose }: Props) {
  return (
    <div 
      className="absolute top-10 right-2 w-48 bg-black/80 backdrop-blur-sm border border-[#70ab6c]/20 rounded shadow-lg p-2 z-20 text-sm text-[#c8ffc8] crt-screen"
    >
      <button type="button" className="w-full text-left p-1 rounded hover:bg-[#70ab6c]/20" onClick={onCreateNew}>
        + Create new collection
      </button>
      <hr className="border-t border-[#70ab6c]/20 my-1"/>
      <ul>
        {collections.map(col => {
          const checked = col.cardIds.includes(cardId);
          return (
            <li key={col.id}>
              <button
                type="button"
                className="w-full flex items-center gap-2 p-1 rounded hover:bg-[#70ab6c]/20"
                onClick={() => checked ? removeCard(col.id, cardId) : addCard(col.id, cardId)}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={checked}
                  className="pointer-events-none"
                />
                <span>{col.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 