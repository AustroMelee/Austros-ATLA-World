import React from 'react';
import type { EnrichedCharacter } from '../../types';

interface CollectionsSidebarProps {
  collections: { id: string; name: string }[];
  activeCollectionId: string | null;
  activeCollectionItems: EnrichedCharacter[];
  onSelectCollection: (id: string) => void;
  onDeleteItem: (collectionId: string, itemId: string) => void;
  onDeleteCollection: (id: string) => void;
}

export default function CollectionsSidebar({
  collections,
  activeCollectionId,
  activeCollectionItems,
  onSelectCollection,
  onDeleteItem,
  onDeleteCollection,
}: CollectionsSidebarProps) {
  return (
    <aside className="w-72 min-w-[18rem] bg-slate-800 rounded-lg p-4 flex flex-col gap-4 hidden lg:flex">
      <h2 className="text-slate-200 text-lg font-semibold mb-2">My Collections</h2>
      {/* List of all collections */}
      <div className="flex flex-wrap gap-2 mb-2">
        {collections.map(col => (
          <div key={col.id} className="relative group">
            <button
              onClick={() => onSelectCollection(col.id)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-150 ${activeCollectionId === col.id ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {col.name}
            </button>
            <button
              onClick={() => onDeleteCollection(col.id)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Delete collection ${col.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <hr className="border-slate-700" />
      {/* Items in the active collection */}
      <div className="flex-1 overflow-y-auto">
        {activeCollectionId && activeCollectionItems.length > 0 ? (
          <ul className="space-y-2">
            {activeCollectionItems.map(item => (
              <li key={item.id} className="group flex items-center justify-between bg-slate-900/50 p-2 rounded-md">
                <span className="text-slate-300">{item.name}</span>
                <button 
                  onClick={() => onDeleteItem(activeCollectionId, item.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${item.name} from collection`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-slate-500 italic mt-4">
            {collections.length > 0 ? 'Select a collection to view items.' : 'Create a collection by clicking the + on a card.'}
          </div>
        )}
      </div>
    </aside>
  );
} 