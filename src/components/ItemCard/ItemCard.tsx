import React from 'react';
import { EnrichedCharacter } from '../../types/domainTypes';
import { useCollectionsStore } from '../../collections/collectionsStore';

interface ItemCardProps {
  item: EnrichedCharacter;
  expanded: boolean;
  onExpand: () => void;
  onAddToCollection?: () => void;
}

const nationTheme: Record<string, { gradient: string; ring: string; accent: string; text: string; shadow: string; glowFromColor: string; glowToColor: string }> = {
  'Air Nomads': {
    gradient: 'from-yellow-200/40 via-yellow-400/20 to-yellow-700/10',
    ring: 'ring-yellow-300/60',
    accent: 'bg-yellow-300/80',
    text: 'text-yellow-100',
    shadow: 'shadow-yellow-200/30',
    glowFromColor: '#ffe06699',
    glowToColor: '#ffd60a99',
  },
  'Water Tribe': {
    gradient: 'from-blue-200/40 via-blue-400/20 to-blue-900/10',
    ring: 'ring-blue-400/60',
    accent: 'bg-blue-400/80',
    text: 'text-blue-100',
    shadow: 'shadow-blue-200/30',
    glowFromColor: '#38bdf899',
    glowToColor: '#1e40af99',
  },
  'Southern Water Tribe': {
    gradient: 'from-blue-200/40 via-blue-400/20 to-blue-900/10',
    ring: 'ring-blue-400/60',
    accent: 'bg-blue-400/80',
    text: 'text-blue-100',
    shadow: 'shadow-blue-200/30',
    glowFromColor: '#38bdf899',
    glowToColor: '#1e40af99',
  },
  'Earth Kingdom': {
    gradient: 'from-green-200/40 via-green-400/20 to-green-900/10',
    ring: 'ring-green-400/60',
    accent: 'bg-green-400/80',
    text: 'text-green-100',
    shadow: 'shadow-green-200/30',
    glowFromColor: '#4ade8099',
    glowToColor: '#16653499',
  },
  'Fire Nation': {
    gradient: 'from-red-200/40 via-red-400/20 to-red-900/10',
    ring: 'ring-red-400/60',
    accent: 'bg-red-400/80',
    text: 'text-red-100',
    shadow: 'shadow-red-200/30',
    glowFromColor: '#f8717199',
    glowToColor: '#7f1d1d99',
  },
  neutral: {
    gradient: 'from-slate-200/40 via-slate-400/20 to-slate-900/10',
    ring: 'ring-slate-400/60',
    accent: 'bg-slate-400/80',
    text: 'text-slate-100',
    shadow: 'shadow-slate-200/30',
    glowFromColor: '#a9a9a999',
    glowToColor: '#6b728099',
  },
};

export default function ItemCard({ item, expanded, onExpand, onAddToCollection }: ItemCardProps) {
  const theme = nationTheme[item.nation || 'neutral'] || nationTheme.neutral;
  const { collections } = useCollectionsStore();
  const isItemInCollection = Object.values(collections).some(col => col.items.includes(item.id));

  const hoverClasses = expanded ? '' : 'hover:scale-[1.035] motion-safe:transition-transform duration-300';
  const expandedClasses = expanded ? 'scale-105 z-20' : '';

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

  const iconText = item.slug.substring(0, 3).toUpperCase();

  return (
    <div
      className={`itemcard-animated-border ${hoverClasses} ${expandedClasses}`}
      style={{
        '--border-from': theme.glowFromColor,
        '--border-to': theme.glowToColor,
      } as React.CSSProperties}
      {...interactiveProps}
    >
      <div className={`relative rounded-[22px] p-6 bg-slate-800/80 backdrop-blur-xl h-full w-full`}>
        {/* === Header Section (Visible on both collapsed and expanded) === */}
        <div className="relative z-20 flex items-start gap-4">
          <div className={`w-16 h-16 flex-shrink-0 flex items-center justify-center ${theme.accent} rounded-2xl shadow-lg ring-2 ring-white/20 overflow-hidden`}>
            {item.image && !item.image.startsWith('[SVG') ? (
              <img
                src={item.name === 'Aang' ? '/assets/images/aang.jpg' : item.image}
                alt={item.name}
                className="object-cover w-full h-full"
                loading="lazy"
                draggable={false}
              />
            ) : item.name === 'Aang' ? (
              <img
                src={'/assets/images/aang.jpg'}
                alt="Aang"
                className="object-cover w-full h-full"
                loading="lazy"
                draggable={false}
              />
            ) : (
              <span className="font-mono font-bold text-2xl text-slate-900/70 tracking-tighter">{iconText}</span>
            )}
          </div>
          <div className="flex-grow min-w-0 pt-1">
            <h2 className={`font-bold text-xl drop-shadow text-slate-50`}>{item.name}</h2>
            <p className={`text-sm capitalize opacity-80 text-slate-300`}>{item.nation || item.__type}</p>
          </div>
          <button
            className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full border-2 border-white/30 bg-white/20 text-lg font-bold transition-colors z-20 shadow ${isItemInCollection ? 'bg-green-400 text-green-900' : `${theme.accent} text-white hover:bg-white/60 hover:text-black`} focus-visible:outline-2 focus-visible:outline-white/80`}
            title={isItemInCollection ? 'In Collection' : 'Add to Collection'}
            onClick={(e) => { e.stopPropagation(); if (onAddToCollection) { onAddToCollection(); } }}
            aria-pressed={isItemInCollection}
            aria-label={isItemInCollection ? `Item is in a collection` : `Add ${item.name} to collection`}
          >
            {isItemInCollection ? '\u2713' : '+'}
          </button>
        </div>
        
        {/* === Description Section (Only changes visibility) === */}
        <p className={`text-slate-200 text-sm mt-4 leading-relaxed drop-shadow-lg ${expanded ? '' : 'line-clamp-3'}`}>{item.description}</p>
        
        {/* === Expanded Content Section (Dynamically rendered) === */}
        {expanded && (
          <>
            <hr className="my-6 border-t-2" style={{ borderColor: theme.glowFromColor, opacity: 0.2 }} />
            <div className="space-y-8">
              {/* Overview Section */}
              {item.overview && (
                <div>
                  <h3 className="font-bold text-lg text-slate-50 mb-2">Overview</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{item.overview}</p>
                </div>
              )}

              {/* Two-Column Grid for Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                {/* Left Column */}
                <div className="space-y-8">
                  {item.highlights && item.highlights.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-slate-50 mb-3">Key Journey Highlights</h3>
                      <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                        {item.highlights.map((highlight, i) => <li key={i}>{highlight}</li>)}
                      </ul>
                    </div>
                  )}
                  {item.traits && item.traits.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-slate-50 mb-3">Personality Traits</h3>
                      <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm">
                        {item.traits.map((trait, i) => <li key={i}>{trait}</li>)}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  {item.quotes && item.quotes.length > 0 && (
                    <div>
                      <h3 className="font-bold text-lg text-slate-50 mb-3">Notable Quotes</h3>
                      <div className="space-y-4">
                        {item.quotes.map((quote, i) => (
                          <blockquote key={i} className="italic border-l-2 pl-4 text-slate-400 text-sm" style={{ borderColor: theme.glowFromColor }}>&quot;{quote}&quot;</blockquote>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.relationships && (
                    <div>
                      <h3 className="font-bold text-lg text-slate-50 mb-3">Relationships</h3>
                      <p className="text-slate-300 text-sm leading-relaxed">{item.relationships}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
