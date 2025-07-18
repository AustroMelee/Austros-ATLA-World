import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export default function CreateCollectionModal({ onSubmit, onCancel }: Props) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-[32rem] bg-black/95 border-2 border-[#70ab6c]/40 rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(112,171,108,0.3)] p-6 crt-screen"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[#70ab6c] text-2xl">{'>'}</span>
          <h2 id="modal-title" className="text-xl font-bold text-[#c8ffc8] crt-glow-text tracking-wide">Create New Collection</h2>
        </div>
        
        <form onSubmit={e => { e.preventDefault(); if (name.trim()) onSubmit(name.trim()); }}>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-black/60 text-[#c8ffc8] px-4 py-3 rounded border-2 border-[#70ab6c]/30 focus:border-[#70ab6c] focus:shadow-[0_0_15px_rgba(112,171,108,0.3)] outline-none placeholder-[#70ab6c]/50 font-mono text-lg crt-glow-text"
              placeholder="Enter collection name..."
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#70ab6c]/50 animate-pulse">_</span>
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 rounded border border-[#70ab6c]/30 text-[#70ab6c] hover:bg-[#70ab6c]/10 hover:border-[#70ab6c]/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2 rounded bg-[#70ab6c]/20 border border-[#70ab6c]/50 text-[#c8ffc8] hover:bg-[#70ab6c]/30 hover:border-[#70ab6c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 