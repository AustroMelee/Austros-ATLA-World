import React from 'react';

/**
 * QuoteBlock for rendering notable quotes with consistent style.
 * @param children - The quote text.
 * @param author - Optional author attribution.
 */
export interface QuoteBlockProps {
  children: React.ReactNode;
  author?: string;
}

export const QuoteBlock: React.FC<QuoteBlockProps> = ({ children, author }) => (
  <blockquote className="border-l-4 border-blue-500 pl-4 italic text-slate-400 my-2">
    <span>{children}</span>
    {author && <footer className="mt-2 text-xs text-blue-300">— {author}</footer>}
  </blockquote>
); 