import React, { useState } from 'react';
import type { Collection } from '../../types/domainTypes';
import CreateCollectionModal from './CreateCollectionModal';

interface Props {
  collections: Collection[];
  activeId: string | null;
  onActivate: (id: string | null) => void;
  createCollection: (name: string) => void;
}

export default function CollectionsSidebar({ collections, activeId, onActivate, createCollection }: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <aside className="p-4 w-auto min-w-[200px] max-w-[280px] self-start space-y-3 text-sm bg-black/80 backdrop-blur-sm border-r border-[#70ab6c]/20 crt-screen z-10">
      <h3 className="font-bold text-base mb-3 text-[#c8ffc8] crt-glow-text">Collections</h3>
      <button
        type="button"
        className={`block text-left w-full px-3 py-2 rounded text-[#c8ffc8] transition-colors ${activeId === null ? 'bg-[#70ab6c]/20 font-bold' : 'hover:bg-[#70ab6c]/10'}`}
        onClick={() => onActivate(null)}
      >
        All Items
      </button>
      <ul className="space-y-1">
        {collections.map(col => (
          <li key={col.id}>
            <button
              type="button"
              className={`w-full text-left px-3 py-2 rounded flex items-center justify-between text-[#c8ffc8] transition-colors ${activeId === col.id ? 'bg-[#70ab6c]/20 font-bold' : 'hover:bg-[#70ab6c]/10'}`}
              onClick={() => onActivate(activeId === col.id ? null : col.id)}
            >
              <span className="truncate flex-1">{col.name}</span>
              <span className="text-xs text-[#70ab6c] ml-2 flex-shrink-0">{col.cardIds.length}</span>
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setShowCreateModal(true)}
        className="w-full bg-[#70ab6c]/20 hover:bg-[#70ab6c]/30 rounded py-2 text-[#c8ffc8] font-bold transition-colors border border-[#70ab6c]/40"
      >
        + Add Collection
      </button>
      {showCreateModal && (
        <CreateCollectionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreate={(name: string) => {
            createCollection(name);
            setShowCreateModal(false);
          }}
        />
      )}
    </aside>
  );
} 