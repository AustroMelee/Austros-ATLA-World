import React, { useState, useRef, useEffect } from 'react';

interface CollectionsPanelProps {
  collections: { id: string; name: string; items: string[] }[];
  onSelect: (collectionId: string) => void;
  onCreate: (name: string) => void;
  onClose: () => void;
  open: boolean;
}

export default function CollectionsPanel({ collections, onSelect, onCreate, onClose, open }: CollectionsPanelProps) {
  const [newName, setNewName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (newName.trim()) {
      onCreate(newName.trim());
      setNewName('');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" tabIndex={-1}>
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close collections panel">×</button>
        <h2 className="text-xl font-bold mb-4">Add to Collection</h2>
        {collections.length === 0 ? (
          <div className="text-center text-gray-600">No collections found. Create one below.</div>
        ) : (
          <ul className="space-y-2">
            {collections.map(col => (
              <li key={col.id}>
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100" onClick={() => onSelect(col.id)}>
                  {col.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleCreate} className="mt-4">
          <input
            ref={inputRef}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="New collection name"
            aria-label="New collection name"
          />
          <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" type="submit">Create</button>
        </form>
      </div>
    </div>
  );
}
