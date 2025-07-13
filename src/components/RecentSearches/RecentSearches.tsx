import React from 'react';

interface RecentSearchesProps {
  searches: string[];
  onSelect: (query: string) => void;
}

export default function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-subtle mr-2">Recent:</span>
        {searches.map(search => (
          <button
            key={search}
            onClick={() => onSelect(search)}
            className="rounded-full px-3 py-1 text-xs font-medium bg-surface text-subtle hover:bg-highlight hover:text-white border border-transparent hover:border-primary/50 transition-colors duration-200"
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
} 