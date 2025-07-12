import React from 'react';
import { EnrichedCharacter } from '../../types/domainTypes';
import { useCollectionsStore } from '../../collections/collectionsStore';

interface ItemCardProps {
  item: EnrichedCharacter;
  expanded: boolean;
  onExpand: () => void;
  onAddToCollection?: () => void;
}

const nationStyles: Record<string, { border: string, bg: string, ring: string }> = {
  'Air Nomads': { border: 'border-yellow-400', bg: 'hover:bg-yellow-400/10', ring: 'ring-yellow-400' },
  'Water Tribe': { border: 'border-blue-400', bg: 'hover:bg-blue-400/10', ring: 'ring-blue-400' },
  'Southern Water Tribe': { border: 'border-blue-400', bg: 'hover:bg-blue-400/10', ring: 'ring-blue-400' },
  'Earth Kingdom': { border: 'border-green-400', bg: 'hover:bg-green-400/10', ring: 'ring-green-400' },
  'Fire Nation': { border: 'border-red-500', bg: 'hover:bg-red-500/10', ring: 'ring-red-500' },
  'neutral': { border: 'border-slate-600', bg: 'hover:bg-slate-700/50', ring: 'ring-slate-500' },
};

export default function ItemCard({ item, expanded, onExpand, onAddToCollection }: ItemCardProps) {
  const style = nationStyles[item.nation || 'neutral'] || nationStyles.neutral;
  const { collections } = useCollectionsStore();
  const isItemInCollection = Object.values(collections).some(col => col.items.includes(item.id));
  const baseClasses = `relative bg-slate-800 text-slate-100 rounded-xl p-6 shadow-lg border-l-4 transition-all duration-300 ease-in-out ${style.border}`;
  const stateClasses = expanded ? 'shadow-2xl cursor-pointer' : `cursor-pointer ${style.bg} hover:scale-105`;

  // Always make the card clickable and keyboard-accessible for expand/minimize
  const interactiveProps = {
    role: 'button' as const,
    tabIndex: 0,
    onClick: onExpand,
    onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onExpand();
      }
    },
  };

  let expandedContent = null;
  if (expanded) {
    expandedContent = (
      <div className="mt-4 pt-4 border-t border-slate-700 space-y-6">
        {item.overview && (
          <div>
            <h3 className="font-semibold text-lg text-slate-200 mb-2">Overview</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{item.overview}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-6">
            {item.highlights && item.highlights.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg text-slate-200 mb-2">Key Journey Highlights</h3>
                <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
                  {item.highlights.map((highlight, i) => <li key={i}>{highlight}</li>)}
                </ul>
              </div>
            )}
            {item.traits && item.traits.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg text-slate-200 mb-2">Personality Traits</h3>
                <ul className="list-disc list-inside text-sm text-slate-400 space-y-2">
                  {item.traits.map((trait, i) => <li key={i}>{trait}</li>)}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-6">
            {item.quotes && item.quotes.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg text-slate-200 mb-2">Notable Quotes</h3>
                <div className="space-y-3">
                  {item.quotes.map((quote, i) => (
                    <blockquote key={i} className="text-sm text-slate-400 italic border-l-2 border-slate-600 pl-3">&quot;{quote}&quot;</blockquote>
                  ))}
                </div>
              </div>
            )}
            {item.relationships && (
              <div>
                <h3 className="font-semibold text-lg text-slate-200 mb-2">Relationships</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.relationships}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      aria-expanded={expanded}
      {...interactiveProps}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-4xl bg-slate-900 rounded-lg border border-slate-700">
          {'🦰'}
        </div>
        <div className="flex-grow">
          <h2 className="font-bold text-xl mb-1 truncate">{item.name}</h2>
          <p className="text-slate-400 text-sm capitalize">{item.nation || item.__type}</p>
        </div>
        <button
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-slate-600 bg-slate-700 text-lg font-bold transition-colors z-20 ${isItemInCollection ? 'bg-green-500 text-slate-900' : 'hover:bg-blue-500 hover:text-white'}`}
          title={isItemInCollection ? 'In Collection' : 'Add to Collection'}
          onClick={(e) => { e.stopPropagation(); onAddToCollection && onAddToCollection(); }}
          aria-pressed={isItemInCollection}
          aria-label={isItemInCollection ? `Item is in a collection` : `Add ${item.name} to collection`}
        >
          {isItemInCollection ? '✓' : '+'}
        </button>
      </div>
      <p className="text-slate-300 text-sm mt-4 leading-relaxed line-clamp-3">{item.description}</p>
      {expandedContent}
    </div>
  );
}
