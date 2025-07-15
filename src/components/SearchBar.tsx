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
  placeholder = "Search characters...",
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
              w-full rounded-2xl border border-primary
              !bg-neutral-900
              px-6 py-3 text-lg md:text-xl
              !text-white
              !placeholder-white/80
              placeholder:text-lg md:placeholder:text-xl
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              shadow-lg transition-all duration-150
            "
            placeholder={placeholder}
            aria-label={placeholder}
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