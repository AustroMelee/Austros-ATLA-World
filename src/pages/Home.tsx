import React, { useState } from 'react';
import SearchBar from '../components/SearchBar/SearchBar';
import EntityGrid from '../components/EntityGrid/EntityGrid';
import { useAustrosSearch } from '../hooks/useAustrosSearch';

export default function Home() {
  const [query, setQuery] = useState('');
  const { results, loading, error } = useAustrosSearch(query);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Compute suggestion
  let suggestion = '';
  if (query && results.length > 0) {
    const top = results[0];
    if (top.name && top.name.toLowerCase().startsWith(query.toLowerCase())) {
      suggestion = top.name.slice(query.length);
    }
  }

  // Compute dynamic text color (example logic)
  const nationColors: Record<string, string> = {
    'Earth Kingdom': '#6ee7b7',
    'Fire Nation': '#f87171',
    'Water Tribe': '#60a5fa',
    'Air Nomads': '#fbbf24',
  };
  let textColor = '#fff';
  if (results[0]?.__type === 'character' && results[0].nation) {
    textColor = nationColors[results[0].nation] || '#fff';
  }

  return (
    <section className="w-full max-w-5xl mx-auto text-center py-16 px-4">
      <div className="mb-10">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          suggestion={suggestion}
          textColor={textColor}
        />
      </div>
      {loading ? (
        <div className="text-slate-400 mt-8">Loading...</div>
      ) : error ? (
        <div className="text-red-400 mt-8">{error}</div>
      ) : (
        <EntityGrid items={results} expandedId={expandedId} onExpand={setExpandedId} />
      )}
    </section>
  );
}
