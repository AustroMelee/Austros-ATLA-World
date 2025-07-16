import React, { useEffect } from 'react';
import type { EnrichedEntity } from '../../search/types';
import ThemedCard from '../ThemedCard/ThemedCard';
import NationIcon from '../NationIcon/NationIcon';
import { toTitleCase, getInitials } from '../../utils/stringUtils';
import { useImageFallback } from '../../hooks/useImageFallback';
import { fallbackImages, universalFallback } from './imageFallbacks';
import { getField } from '../../utils/data';

interface MatchedField {
  field: string;
  token: string;
}

interface ItemCardCollapsedProps {
  item: EnrichedEntity;
  onExpand: () => void;
  matchedFields?: MatchedField[];
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
  const { imgSrc, status, handleImageError, handleImageLoad, setImgSrc } = useImageFallback(slugKey, {
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
      className="cursor-pointer w-[113px]"
    >
      <ThemedCard nation={nation}>
        <div className="pb-1.5 pt-2 flex flex-col min-h-[144px]">
          <div className="mb-1.5 flex justify-center w-full px-1.5">
            <div className="w-full aspect-square max-w-[85%] max-h-[65%] mx-auto bg-background rounded-xl flex items-center justify-center border border-subtle/20 overflow-hidden shadow-lg">
              {status === 'error' || !imgSrc ? (
                <span className="font-bold text-subtle text-[18px]">
                  {iconText}
                </span>
              ) : (
                <img
                  src={imgSrc}
                  alt={item.name}
                  className="w-full h-full rounded-xl object-cover border-none"
                  draggable={false}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}
            </div>
          </div>
          {hasRole && (
            <div className="flex justify-center -mt-3.5 z-10">
              <div className="bg-neutral-900/80 backdrop-blur-sm rounded flex items-center justify-center text-center p-1.5 border border-white/20 shadow-lg">
                <span className="text-white text-[12px] font-bold leading-none">
                  {role}
                </span>
              </div>
            </div>
          )}
          {matchedFields && matchedFields.length > 0 && (
            <div className="mt-1.5 flex flex-wrap justify-center gap-1">
              {matchedFields.map((match, index) => (
                <span
                  key={`${match.field}-${index}`}
                  className="bg-neutral-700 text-neutral-300 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                >
                  Matched: {formatFieldName(match.field)}
                </span>
              ))}
            </div>
          )}
          <div className="w-full mt-auto px-1.5 pt-2.5">
            <div className="flex items-center justify-start gap-1">
              <h3 className="font-bold text-lg text-white whitespace-normal line-clamp-2">
                {toTitleCase(item.name)}
              </h3>
              {nation && (
                <NationIcon
                  nation={nation}
                  size={8}
                  className="align-middle flex-shrink-0"
                />
              )}
            </div>
            <p className="text-[12px] text-neutral-400 font-bold mt-1">Character</p>
          </div>
        </div>
      </ThemedCard>
    </div>
  );
} 