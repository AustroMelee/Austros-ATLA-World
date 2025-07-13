import React from 'react';
import type { EnrichedCharacter } from '../../types';
import ThemedCard from '../ThemedCard/ThemedCard';
import StyledButton from '../StyledButton/StyledButton';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ItemCardProps {
  item: EnrichedCharacter;
  expanded: boolean;
  onExpand: () => void;
  onAddToCollection?: () => void;
}

function toTitleCase(str?: string): string {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

export default function ItemCard({ item, expanded, onExpand, onAddToCollection }: ItemCardProps) {
  const iconText = (item.name || 'UNK').substring(0, 3).toUpperCase();

  return (
    <ThemedCard
      nation={item.nation}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (expanded) e.stopPropagation();
        else onExpand();
      }}
      className={`${expanded ? '' : 'hover:-translate-y-px'}`}
      role="button" tabIndex={0} onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => (e.key === 'Enter' || e.key === ' ') && !expanded && onExpand()}
      aria-expanded={expanded} aria-label={`View details for ${item.name}`}
    >
      <div className="p-4">
        {/* Header - Stays the same */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 flex-shrink-0 bg-background rounded-lg flex items-center justify-center border border-subtle/20">
            <span className="font-bold text-subtle text-lg">{iconText}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-white truncate">{toTitleCase(item.name)}</h3>
            <div className="text-sm text-subtle mt-1">Character</div>
          </div>
          {expanded && (
            <StyledButton
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => { e.stopPropagation(); onAddToCollection?.(); }}
              variant="secondary"
              className="!px-3 !py-2 !rounded-lg"
              aria-label={`Add ${item.name} to a collection`}
            >
              <span className="text-xl leading-none">+</span>
            </StyledButton>
          )}
        </div>
        {/* Compact Description - Stays the same */}
        {!expanded && (
          <p className="text-sm text-subtle mt-3 leading-relaxed line-clamp-3">{item.description}</p>
        )}
      </div>

      {/* --- CORRECTED EXPANDED VIEW --- */}
      {expanded && (
        <div className="px-4 pb-4 mt-2 border-t border-subtle/20">
          {/* The `prose` classes from Tailwind's typography plugin will automatically style headings, lists, paragraphs, and blockquotes from the markdown. */}
          <div className="prose prose-sm prose-invert max-w-none text-slate-300">
            {item.expandedView ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.expandedView}
              </ReactMarkdown>
            ) : (
              <p className="italic text-subtle">No detailed view available.</p>
            )}
          </div>
        </div>
      )}
    </ThemedCard>
  );
}
