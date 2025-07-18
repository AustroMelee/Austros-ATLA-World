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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

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
              crt-dither
              crt-glow-text
              crt-text-dither
            "
            style={{
              background: `
                radial-gradient(ellipse at center, rgba(6,25,17,0.98) 60%, rgba(6,25,17,0.85) 80%, rgba(6,25,17,0.7) 100%)
              `,
              backgroundColor: '#061911',
              backgroundBlendMode: 'overlay',
              caretColor: 'transparent', // Hide native caret
              fontSize: '28px',
            }}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {/* Blinking block cursor overlay, with spacing from text */}
          {isFocused && (
            <span
              className="pointer-events-none absolute top-0 bottom-0 flex items-center font-tty-glass text-green-400 select-none"
              style={{
                fontFamily: 'Glass_TTY_VT220, monospace',
                left: '1.5rem', // px-6 = 1.5rem
                height: '100%',
                fontSize: '28px',
              }}
            >
              {/* Hidden span to measure text width */}
              <span
                ref={measureRef}
                aria-hidden="true"
                className="invisible whitespace-pre font-tty-glass text-green-200"
                style={{
                  fontFamily: 'Glass_TTY_VT220, monospace',
                  fontSize: '28px',
                  fontWeight: 400,
                }}
              >
                {value}
              </span>
              {/* Blinking block cursor, positioned with spacing after text */}
              <span
                className="inline-block w-2 h-6 bg-green-400 animate-blink align-middle crt-glow-text"
                style={{
                  marginLeft: '4px', // 4px spacing from text
                }}
              />
            </span>
          )}
        </div>
      </form>
    </section>
  );
} 