import React, { useState } from 'react';
import type { EnrichedCharacter } from '../../types';
import ThemedCard from '../ThemedCard/ThemedCard';
import NationIcon from '../NationIcon/NationIcon';
import { toTitleCase, getInitials } from '../../utils/stringUtils';
import { CustomMarkdownRenderer } from '../CustomMarkdownRenderer';
// We are no longer using the generic Badge for the role, so it can be removed if not used elsewhere
// import { Badge } from '../Badge/Badge';

interface ItemCardProps {
  item: EnrichedCharacter;
  expanded: boolean;
  onExpand: () => void;
}

const fallbackImages: Record<string, string> = {
  poppy: 'poppy.jpg',
  'toph-beifong': 'toph.jpg',
  toph: 'toph.jpg',
  yue: 'yue-avatar.jpg',
  gyatso: 'monk-gyatso.jpg',
};

const universalFallback = '404.jpg';

export default function ItemCard({ item, expanded, onExpand }: ItemCardProps) {
  const iconText = getInitials(item.name);
  const hasRole = item.role && item.role.trim();

  // Determine the correct image file name
  const imageFileName = item.image ? item.image : `${item.slug}.jpg`;
  const [imgSrc, setImgSrc] = useState(`/assets/images/${imageFileName}`);

  const handleImageError = () => {
    // Try a specific fallback for known characters, else use universal 404
    const fallback = fallbackImages[item.slug] || fallbackImages[item.id] || universalFallback;
    setImgSrc(`/assets/images/${fallback}`);
  };

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
      <div className="pb-2 pt-3 flex flex-col min-h-[240px]">
        {/* The 'relative' class is removed, as the badge is no longer positioned against the image */}
        <div className="mb-2 flex justify-center w-full px-2">
          <div className="w-full aspect-square max-w-[80%] max-h-[60%] mx-auto bg-background rounded-2xl flex items-center justify-center border border-subtle/20 overflow-hidden shadow-lg">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={item.name}
                className="w-full h-full rounded-2xl object-cover border-none"
                draggable={false}
                onError={handleImageError}
              />
            ) : (
              <span className="font-bold text-subtle text-2xl">
                {iconText}
              </span>
            )}
          </div>
          {/* The badge was moved from here */}
        </div>

        {!expanded ? (
          <>
            {/* --- BADGE IN NEW POSITION --- */}
            {hasRole && (
              <div className="flex justify-center -mt-6 z-10">
                <div className="bg-neutral-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-center p-2 border border-white/20 shadow-lg">
                  <span className="text-white text-xs font-bold leading-none">
                    {item.role}
                  </span>
                </div>
              </div>
            )}

            {/* Text container now has padding-top to give the badge space */}
            <div className="w-full mt-auto px-2 pt-4">
              <div className="flex items-center justify-start gap-1">
                <h3 className="font-bold text-xl text-white whitespace-normal line-clamp-2">
                  {toTitleCase(item.name)}
                </h3>
                {item.nation && (
                  <NationIcon
                    nation={item.nation}
                    size={12}
                    className="align-middle flex-shrink-0"
                  />
                )}
              </div>
              {/* Always show the category label in the bottom left */}
              <p className="text-xs text-neutral-400 font-bold mt-1">Character</p>
              {/* Remove archetype/secondary line */}
            </div>
          </>
        ) : (
          <div className="w-full mt-auto px-4">
            <div className="mb-4">
              <h3
                className="font-bold text-white"
                style={{ fontSize: '1.875rem', lineHeight: '2.25rem' }}
              >
                {toTitleCase(item.name)}
              </h3>
              {/* Always show the category label in the bottom left */}
              <p className="text-xs text-neutral-400 font-bold mt-1">Character</p>
              {/* Remove archetype/secondary line */}
            </div>
            
            <div className="prose prose-sm prose-invert max-w-none text-slate-300 w-full text-left">
              {item.expandedView ? (
                <CustomMarkdownRenderer markdown={item.expandedView} />
              ) : (
                <p className="italic text-subtle">
                  No detailed view available.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </ThemedCard>
  );
}
