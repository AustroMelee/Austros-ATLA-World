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

  const displayQuery = query.charAt(0).toUpperCase() + query.slice(1);
  const showSuggestion = suggestion && query.length > 0;

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className="w-full h-[52px] px-5 py-3 flex items-center justify-between rounded-lg bg-surface font-medium text-base border-2 border-subtle/20 group focus-within:border-primary/50 transition-colors"
        aria-hidden="true"
      >
        <div className="whitespace-nowrap overflow-hidden text-left">
          <span style={{ color: textColor }}>{displayQuery}</span>
          {showSuggestion && <span className="opacity-35" style={{ color: textColor }}>{suggestion}</span>}
        </div>
        {showSuggestion && <span className="flex-shrink-0 text-xs font-semibold uppercase text-subtle bg-background border border-subtle/30 rounded-md px-2 py-0.5 ml-2">Tab</span>}
      </div>
      <input
        className="absolute inset-0 w-full h-full px-5 py-3 rounded-lg bg-transparent font-medium text-base border-2 border-transparent focus:outline-none text-transparent"
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
