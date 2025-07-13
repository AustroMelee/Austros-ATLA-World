import React, { useState, useRef, useEffect } from 'react';
import StyledButton from '../StyledButton/StyledButton';

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
    <section
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-surface p-6 rounded-xl shadow-2xl w-full max-w-md border border-subtle/20 relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close collections panel"
          className="absolute top-3 right-3 text-subtle hover:text-white focus:outline-none"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-white mb-4">Add to Collection</h2>
        {collections.length > 0 && (
          <ul className="space-y-2 mb-4">
            {collections.map(col => (
              <li key={col.id}>
                <StyledButton variant="secondary" className="w-full !justify-start" onClick={() => onSelect(col.id)}>
                  {col.name}
                </StyledButton>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={handleCreate}>
          <label htmlFor="new-collection-name" className="text-sm font-semibold text-subtle mb-2 block">
            Or create a new one:
          </label>
          <input
            id="new-collection-name"
            ref={inputRef}
            className="w-full px-3 py-2 bg-background border border-subtle/40 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="e.g., 'Team Avatar' or 'Villains'"
          />
          <StyledButton className="w-full mt-4" type="submit" variant="primary">
            Create & Add
          </StyledButton>
        </form>
      </div>
    </section>
  );
}
