// src/components/SearchBar.tsx

import React from 'react';
// NationIcon expects a nation string or null, not a custom type.
import NationIcon from './NationIcon/NationIcon';

// --- Props Interface (Unified) ---
interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  suggestion?: string;
  textColor?: string;
  nationIcon?: string | null;
}

// --- Unified Component with Tailwind CSS ---
export default function SearchBar({
  value,
  onChange,
  onSubmit,
  suggestion,
  textColor,
  nationIcon,
}: SearchBarProps) {

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Autocomplete with Tab if a suggestion exists and the input is empty
    if (e.key === 'Tab' && suggestion && !value) {
      e.preventDefault();
      onChange(suggestion); // Directly update the state with the suggestion string
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      {/* Main container for positioning */}
      <div className="relative w-full">
        {/* Icon (conditionally rendered) */}
        {nationIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <NationIcon nation={nationIcon} />
          </div>
        )}

        {/* The actual input field */}
        <input
          type="text"
          placeholder="Search characters..."
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          // Dynamic text color and padding based on icon presence
          style={{ color: textColor }}
          className={`
            w-full rounded-full border border-gray-300 dark:border-gray-600 
            bg-gray-100 dark:bg-gray-800 
            py-3 text-base text-gray-900 dark:text-gray-100
            focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none 
            transition-colors
            ${nationIcon ? 'pl-11' : 'pl-5'} pr-5
          `}
        />

        {/* Suggestion overlay (only shows if there's a suggestion and no input value) */}
        {suggestion && !value && (
          <div className={`
            absolute top-1/2 -translate-y-1/2 
            text-gray-400 dark:text-gray-500 
            pointer-events-none
            ${nationIcon ? 'left-11' : 'left-5'}
          `}>
            {suggestion}
          </div>
        )}
      </div>

      {/* Conditionally render a submit button (example, can be styled) */}
      {/* {onSubmit && (
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
          Search
        </button>
      )} */}
    </form>
  );
} 