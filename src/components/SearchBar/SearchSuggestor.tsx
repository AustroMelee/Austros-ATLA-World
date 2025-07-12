import React from 'react';

interface SearchSuggestorProps {
  value: string;
  suggestion: string;
}

export default function SearchSuggestor({ value, suggestion }: SearchSuggestorProps) {
  if (!suggestion) return null;
  return (
    <span
      className="absolute top-0 left-0 h-full flex items-center pointer-events-none text-slate-400 select-none pl-5 text-base font-medium transition-colors duration-200"
      aria-hidden="true"
      style={{ left: `${value.length}ch` }}
    >
      {suggestion}
    </span>
  );
}
