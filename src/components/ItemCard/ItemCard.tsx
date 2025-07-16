import React, { useState } from 'react';
import type { EnrichedEntity } from '../../search/types';
import ThemedCard from '../ThemedCard/ThemedCard';
import NationIcon from '../NationIcon/NationIcon';
import { toTitleCase, getInitials } from '../../utils/stringUtils';
import { CustomMarkdownRenderer } from '../CustomMarkdownRenderer';
// We are no longer using the generic Badge for the role, so it can be removed if not used elsewhere
// import { Badge } from '../Badge/Badge';
// Define MatchedField type locally since it's not exported from search/types
interface MatchedField {
  field: string;
  token: string;
}

interface ItemCardProps {
  item: EnrichedEntity;
  expanded: boolean;
  onExpand: () => void;
  matchedFields?: MatchedField[];
}

const fallbackImages: Record<string, string> = {
  poppy: 'poppy.jpg',
  'toph-beifong': 'toph.jpg',
  toph: 'toph.jpg',
  yue: 'yue-avatar.jpg',
  gyatso: 'monk-gyatso.jpg',
};

const universalFallback = '404.jpg';

// Helper to get a field from top-level or metadata
function getField<T = string>(item: EnrichedEntity, key: string): T | undefined {
  // @ts-expect-error: dynamic access
  if (item[key] !== undefined) return item[key];
  if (item.metadata && item.metadata[key] !== undefined) return item.metadata[key] as T;
  return undefined;
}

// Helper for matched field display
function formatFieldName(field: string) {
  if (field === 'global') return 'Content';
  return toTitleCase(field.replace('metadata.', ''));
}

export default function ItemCard({ item, expanded, onExpand, matchedFields }: ItemCardProps) {
  const iconText = (item.name && typeof item.name === 'string') ? getInitials(item.name) : '';
  const role = getField(item, 'role');
  const nation = getField(item, 'nation');
  const slug = getField(item, 'slug');
  const image = getField(item, 'image');
  const hasRole = role && String(role).trim();
  const imageFileName = image ? image : `${slug}.jpg`;
  const [imgSrc, setImgSrc] = useState(`/assets/images/${imageFileName}`);
  const handleImageError = () => {
    // Fallback: if slug is undefined, fallbackImages['undefined'] is always undefined, so fallback to universalFallback
    const fallback = (slug && fallbackImages[slug]) || fallbackImages[item.id] || universalFallback;
    setImgSrc(`/assets/images/${fallback}`);
  };

  // Collapsed card view
  const collapsedCard = (
    <div
      onClick={onExpand}
      role="button"
      tabIndex={0}
      aria-label={`Expand details for ${item.name}`}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onExpand(); }}
      className="cursor-pointer"
    >
      <ThemedCard nation={nation}>
        <div className="pb-2 pt-3 flex flex-col min-h-[240px]">
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
          </div>
          {hasRole && (
            <div className="flex justify-center -mt-6 z-10">
              <div className="bg-neutral-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center text-center p-2 border border-white/20 shadow-lg">
                <span className="text-white text-xs font-bold leading-none">
                  {role}
                </span>
              </div>
            </div>
          )}
          {matchedFields && matchedFields.length > 0 && (
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {matchedFields.map((match, index) => (
                <span
                  key={`${match.field}-${index}`}
                  className="bg-neutral-700 text-neutral-300 text-xs font-medium px-2 py-0.5 rounded-full"
                >
                  Matched: {formatFieldName(match.field)}
                </span>
              ))}
            </div>
          )}
          <div className="w-full mt-auto px-2 pt-4">
            <div className="flex items-center justify-start gap-1">
              <h3 className="font-bold text-xl text-white whitespace-normal line-clamp-2">
                {toTitleCase(item.name)}
              </h3>
              {nation && (
                <NationIcon
                  nation={nation}
                  size={12}
                  className="align-middle flex-shrink-0"
                />
              )}
            </div>
            <p className="text-xs text-neutral-400 font-bold mt-1">Character</p>
          </div>
        </div>
      </ThemedCard>
    </div>
  );

  // Expanded modal view
  const expandedCardModal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg"
        role="document"
      >
        {/* Close button in top-right */}
        <button
          onClick={onExpand}
          className="absolute top-4 right-4 z-10 bg-neutral-800 text-white rounded-full p-2 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close expanded card"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <ThemedCard nation={nation}>
          {/* --- START: NEW SINGLE-COLUMN LAYOUT --- */}
          <div className="flex flex-col p-4 md:p-6">
            {/* Image Section */}
            <div className="w-full mb-4">
              <img
                src={imgSrc}
                alt={item.name}
                className="w-full h-auto max-h-80 object-contain rounded-lg mx-auto"
                onError={handleImageError}
              />
            </div>
            {/* Details Section */}
            <div className="w-full">
              <h2 className="text-3xl font-bold text-center md:text-left">
                {toTitleCase(item.name)}
                {nation && <NationIcon nation={nation} size={20} className="align-middle flex-shrink-0 ml-2" />}
              </h2>
              {role && <p className="text-lg text-neutral-400 mb-4 text-center md:text-left font-bold">{role}</p>}
              <hr className="border-gray-700 my-4" />
              <div className="prose prose-invert max-w-none">
                <CustomMarkdownRenderer markdown={getField(item, 'expandedView') || ''} />
              </div>
            </div>
          </div>
          {/* --- END: NEW SINGLE-COLUMN LAYOUT --- */}
        </ThemedCard>
      </div>
    </div>
  );

  return expanded ? expandedCardModal : collapsedCard;
}
