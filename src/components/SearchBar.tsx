// src/components/SearchBar.tsx

import React, { useRef, useState, useEffect } from "react";

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
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [lastChar, setLastChar] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const lastCharRef = useRef<HTMLSpanElement>(null);

  // Handle phosphor persistence effect
  useEffect(() => {
    if (lastChar && lastCharRef.current) {
      lastCharRef.current.classList.remove('phosphor-persist');
      void lastCharRef.current.offsetWidth; // Force reflow
      lastCharRef.current.classList.add('phosphor-persist');
    }
  }, [lastChar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const lastTypedChar = newValue.length > value.length 
      ? newValue[newValue.length - 1] 
      : '';
    setLastChar(lastTypedChar);
    onChange(newValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!hasBeenFocused) {
      setHasBeenFocused(true);
    }
  };

  return (
    <section className="flex justify-center items-center w-full py-12">
      <form
        className="w-full max-w-xl"
        role="search"
        autoComplete="off"
        onSubmit={e => e.preventDefault()}
      >
        <div className="relative w-full search-scanlines">
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
              relative
              z-0
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
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={() => setIsFocused(false)}
          />
          {/* Last character with phosphor effect */}
          {lastChar && (
            <span
              ref={lastCharRef}
              className="absolute pointer-events-none font-tty-glass select-none"
              style={{
                left: `calc(1.5rem + ${measureRef.current?.offsetWidth || 0}px)`,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '28px',
                opacity: 0.8,
              }}
            >
              {lastChar}
            </span>
          )}
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
                className={`
                  inline-block w-2 h-6 
                  bg-green-400 
                  animate-blink 
                  align-middle 
                  crt-glow-text
                  ${!hasBeenFocused ? 'cursor-wake-up' : ''}
                `}
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