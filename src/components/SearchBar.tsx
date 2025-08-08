// src/components/SearchBar.tsx

import React, { useRef, useState } from "react";

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
  const [, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

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
            ref={inputRef}
            type="text"
            spellCheck={false}
            className="
              w-full
              rounded-lg
              border-4
              text-green-200
              text-[28px]
              px-6 py-2
              focus:outline-none focus:ring-0
              placeholder:text-green-300/60
              transition-all duration-200
              font-tty-glass
              bg-transparent
              caret-green-400
              crt-glow-border
              relative
              z-0
            "
            style={{
              background: `
                radial-gradient(ellipse at center, rgba(6,25,17,0.99) 60%, rgba(6,25,17,0.95) 80%, rgba(6,25,17,0.9) 100%)
              `,
              backgroundColor: '#061911',
              backgroundBlendMode: 'overlay',
              fontSize: '28px',
            }}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
          />
        </div>
      </form>
    </section>
  );
} 