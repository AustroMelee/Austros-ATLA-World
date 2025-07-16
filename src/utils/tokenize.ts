// src/utils/tokenize.ts

export function tokenizeInput(input: string): string[] {
  if (!input) return [];
  return input
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(Boolean);
} 