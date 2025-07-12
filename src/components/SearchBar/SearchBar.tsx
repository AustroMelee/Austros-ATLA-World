import React, { useRef } from 'react';
import { useAustrosSearch } from '../../hooks/useAustrosSearch';
import SearchSuggestor from './SearchSuggestor';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const nationAccent: Record<string, string> = {
  'Earth Kingdom': 'border-nation-earth',
  'Fire Nation': 'border-nation-fire',
  'Water Tribe': 'border-nation-water',
  'Air Nomads': 'border-nation-air',
};

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, topHit } = useAustrosSearch(value);
  const suggestion = results.length > 0 && results[0].name.toLowerCase().startsWith(value.toLowerCase())
    ? results[0].name.slice(value.length)
    : '';
  const nation = topHit?.nation || 'neutral';

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      onChange(value + suggestion);
      setTimeout(() => inputRef.current?.setSelectionRange((value + suggestion).length, (value + suggestion).length), 0);
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-3 w-full max-w-2xl mx-auto p-4 bg-slate-900 rounded-xl shadow-md">
      <div className="relative flex-1 w-full">
        <input
          ref={inputRef}
          className={`w-full px-5 py-3 rounded-lg bg-slate-800 text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-nation-water placeholder:text-slate-400 text-base transition-colors duration-200 border-2 ${nationAccent[nation] || 'border-slate-600'}`}
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search the Avatar world…"
          type="text"
          aria-label="Search encyclopedia"
          autoComplete="off"
        />
        <SearchSuggestor value={value} suggestion={suggestion} />
      </div>
      <button
        className="px-5 py-3 rounded-lg bg-nation-water text-slate-900 font-semibold hover:bg-nation-earth transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-nation-water"
        type="button"
        onClick={onSubmit}
        aria-label="Search"
      >
        Search
      </button>
    </div>
  );
}
