// String utility functions for general use across the app

export function toTitleCase(str?: string): string {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export function getInitials(name?: string): string {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    if (words[0].length <= 4) return words[0][0].toUpperCase();
    return words[0].substring(0, 2).toUpperCase();
  }
  // Multi-word: first letter of first and last word
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
} 