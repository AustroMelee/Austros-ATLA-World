import React from 'react';
import type { EnrichedCharacter } from '../../types';
import ThemedCard from '../ThemedCard/ThemedCard';
import NationIcon from '../NationIcon/NationIcon';
import { toTitleCase, getInitials } from '../../utils/stringUtils';
import { useImageFallback } from '../../hooks/useImageFallback';
import { CustomMarkdownRenderer } from '../CustomMarkdownRenderer';
import { Badge } from '../Badge/Badge';

interface ItemCardProps {
  item: EnrichedCharacter;
  expanded: boolean;
  onExpand: () => void;
}

export default function ItemCard({ item, expanded, onExpand }: ItemCardProps) {
  const iconText = getInitials(item.name);
  const imageFallbacks: Record<string, string> = {
    'combustion-man': 'combustion-man.jpg',
    'unknown': 'combustion-man.jpg',
    'gyatso': 'monk-gyatso.jpg',
    'toph-beifong': 'toph.jpg',
    'yue': 'yue-avatar.jpg',
  };
  const { imgSrc, handleImageError } = useImageFallback(item.slug, imageFallbacks);
  const hasRole = item.role && item.role.trim();

  return (
    <ThemedCard
      nation={item.nation}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (expanded) e.stopPropagation();
        else onExpand();
      }}
      className={
        expanded
          ? 'shadow-md shadow-black/20 cursor-pointer transition-all duration-200 relative group z-10'
          : 'shadow-md shadow-black/20 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-white/5 focus-within:scale-105 focus-within:shadow-lg focus-within:bg-white/5 relative group z-10 group-hover:z-20'
      }
      aria-label={`View details for ${item.name}`}
    >
      {!expanded && (
        <span className="absolute top-4 right-4 text-subtle opacity-0 group-hover:opacity-80 group-focus-within:opacity-80 transition-opacity duration-150 pointer-events-none text-2xl select-none" aria-hidden="true">›</span>
      )}
      <div className="pb-2 pt-3 flex flex-col min-h-[240px]">
        <div className="relative mb-2 flex justify-center w-full px-2">
          <div className="w-full aspect-square max-w-[80%] max-h-[60%] mx-auto bg-background rounded-2xl flex items-center justify-center border border-subtle/20 overflow-hidden shadow-lg">
            {item.slug && imgSrc ? (
              <img
                src={imgSrc}
                alt={item.name}
                className="w-full h-full rounded-2xl object-cover border-none"
                draggable={false}
                onError={handleImageError}
              />
            ) : (
              <span className="font-bold text-subtle text-2xl">{iconText}</span>
            )}
          </div>
          {/* Conditional role badge with improved styling */}
          {hasRole && (
            <div className="pointer-events-none absolute bottom-2 right-2 z-10">
              <Badge
                label={item.role?.toString() || ''}
                type="custom"
                color="bg-neutral-900/70 text-white text-xs font-bold backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 shadow-lg"
              />
            </div>
          )}
        </div>
        <div className="w-full mt-auto px-2">
          <div className="flex items-center justify-start gap-1">
            <h3 className="font-bold text-xl text-white whitespace-normal line-clamp-2">{toTitleCase(item.name)}</h3>
            {item.nation && <NationIcon nation={item.nation} size={12} className="align-middle flex-shrink-0" />}
          </div>
          {/* Added category text */}
          <p className="text-sm text-neutral-400 font-medium mt-1">Character</p>
        </div>
        {expanded && (
          <div className="prose prose-xs prose-invert max-w-none text-slate-300 mt-2 w-full text-left px-2">
            {item.expandedView ? (
              <CustomMarkdownRenderer markdown={item.expandedView} />
            ) : (
              <p className="italic text-subtle">No detailed view available.</p>
            )}
          </div>
        )}
      </div>
    </ThemedCard>
  );
}
