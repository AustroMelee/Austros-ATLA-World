import React from 'react';

interface SearchBarProps {
  query: string;
  onQueryChange: (newQuery: string) => void;
  suggestion: string;
  textColor: string;
}

export default function SearchBar({ query, onQueryChange, suggestion, textColor }: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestion && query) {
      e.preventDefault();
      onQueryChange(query + suggestion);
    }
  };

  function capitalizeFirst(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const displayQuery = capitalizeFirst(query);
  const showSuggestion = suggestion && query.length > 0;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* LAYER 1: The Visuals ("Fake Input") */}
      <div
        className="w-full h-[52px] px-5 py-3 flex items-center justify-between rounded-lg bg-slate-800 font-medium text-base border-2 border-slate-700 pointer-events-none"
        aria-hidden="true"
      >
        <div className="whitespace-nowrap overflow-hidden text-left">
          {/* Corrected Display Logic: Two separate spans */}
          <span style={{ color: textColor }}>{displayQuery}</span>
          {showSuggestion && (
            <span className="opacity-35" style={{ color: textColor }}>{suggestion}</span>
          )}
        </div>
        {showSuggestion && (
          <span className="flex-shrink-0 text-xs font-semibold uppercase text-slate-400 bg-slate-900/75 border border-slate-700 rounded-md px-2 py-0.5 ml-2">
            Tab
          </span>
        )}
      </div>

      {/* LAYER 2: The Interaction (Real, Invisible Input) */}
      <input
        className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-transparent font-medium text-base border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400 text-transparent"
        style={{ caretColor: textColor }}
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for 'Toph' or 'Fire Flakes'..."
        aria-label="Search encyclopedia"
        autoComplete="off"
        type="text"
      />
    </div>
  );
}
