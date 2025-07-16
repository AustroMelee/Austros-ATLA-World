import React, { useEffect } from 'react';
import type { EnrichedEntity } from '../../search/types';
import ThemedCard from '../ThemedCard/ThemedCard';
import NationIcon from '../NationIcon/NationIcon';
import { toTitleCase, getInitials } from '../../utils/stringUtils';
import { useImageFallback } from '../../hooks/useImageFallback';
import { fallbackImages, universalFallback } from './imageFallbacks';

interface MatchedField {
  field: string;
  token: string;
}

interface ItemCardCollapsedProps {
  item: EnrichedEntity;
  onExpand: () => void;
  matchedFields?: MatchedField[];
}

function getField<T = string>(item: EnrichedEntity, key: string): T | undefined {
  // @ts-expect-error: dynamic access
  if (item[key] !== undefined) return item[key];
  if (item.metadata && item.metadata[key] !== undefined) return item.metadata[key] as T;
  return undefined;
}

function formatFieldName(field: string) {
  if (field === 'global') return 'Content';
  return toTitleCase(field.replace('metadata.', ''));
}

export default function ItemCardCollapsed({ item, onExpand, matchedFields }: ItemCardCollapsedProps) {
  const iconText = (item.name && typeof item.name === 'string') ? getInitials(item.name) : '';
  const role = getField(item, 'role');
  const nation = getField(item, 'nation');
  const slug = getField(item, 'slug');
  const image = getField(item, 'image');
  const slugKey = (slug || item.id) as string;
  const { imgSrc, handleImageError, setImgSrc } = useImageFallback(slugKey, {
    [slugKey]: fallbackImages[slugKey] || fallbackImages[item.id] || universalFallback,
  });

  useEffect(() => {
    if (image) {
      setImgSrc(`/assets/images/${image}`);
    }
  }, [image, setImgSrc]);

  const hasRole = role && String(role).trim();

  return (
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
} 