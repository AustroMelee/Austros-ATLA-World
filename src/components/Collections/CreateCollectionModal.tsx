import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function CreateCollectionModal({ isOpen, onClose, onCreate }: Props) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed) {
      onCreate(trimmed);
      setName('');
      onClose();
    }
  };

  const handleCancel = () => {
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/98 backdrop-blur-sm border border-[#70ab6c]/20 rounded-lg p-6 w-96 max-w-[90vw] text-[#c8ffc8] crt-screen">
        <h2 className="text-xl font-bold mb-4">Create New Collection</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="collection-name" className="block text-sm mb-2">
              Collection Name
            </label>
            <input
              id="collection-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/50 border border-[#70ab6c]/20 rounded px-3 py-2 text-[#c8ffc8] focus:outline-none focus:border-[#c8ffc8]"
              placeholder="Enter collection name..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-[#70ab6c]/20 rounded hover:bg-[#70ab6c]/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 bg-[#70ab6c] text-black rounded hover:bg-[#c8ffc8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 