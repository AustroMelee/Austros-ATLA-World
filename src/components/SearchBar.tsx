import React from 'react';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <form
      className="flex items-center gap-2 w-full max-w-xl mx-auto mb-6"
      onSubmit={e => { e.preventDefault(); onSubmit(); }}
    >
      <input
        className="flex-1 px-4 py-3 rounded-lg bg-zinc-900 text-neutral-200 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-nation-water placeholder:text-neutral-400 text-base transition-colors duration-200"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search the Avatar world…"
        type="text"
      />
      <button
        className="px-5 py-3 rounded-lg bg-nation-water text-slate-900 font-semibold hover:bg-nation-earth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nation-water"
        type="submit"
      >
        Search
      </button>
    </form>
  );
}
