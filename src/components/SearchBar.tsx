// src/components/SearchBar.tsx

import React from "react";

interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChange,
  placeholder = "",
}: SearchBarProps) {
  return (
    <section className="flex justify-center items-center w-full py-12">
      <form
        className="w-full max-w-xl"
        role="search"
        autoComplete="off"
        onSubmit={e => e.preventDefault()}
      >
        <div className="relative w-full">
          <input
            type="text"
            className="
              w-full
              rounded-lg
              border-4
              text-green-200
              text-lg
              px-6 py-4
              shadow-[0_0_16px_2px_rgba(112,171,108,0.5)]
              focus:outline-none focus:ring-0
              placeholder:text-green-300/60
              transition-all duration-200
            "
            style={{
              borderColor: '#70ab6c',
              background: `
                radial-gradient(ellipse at center, rgba(6,25,17,0.98) 60%, rgba(6,25,17,0.85) 80%, rgba(6,25,17,0.7) 100%)
              `,
              backgroundColor: '#061911',
              backgroundBlendMode: 'overlay',
            }}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
          />
          {!!value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-primary transition-all"
              aria-label="Clear search"
              tabIndex={0}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      </form>
    </section>
  );
} 