import React, { useEffect } from 'react';
import type { EnrichedEntity } from '../../search/types';
import ThemedCard from '../ThemedCard/ThemedCard';
import NationIcon from '../NationIcon/NationIcon';
import { toTitleCase } from '../../utils/stringUtils';
import { CustomMarkdownRenderer } from '../CustomMarkdownRenderer';
import { useImageFallback } from '../../hooks/useImageFallback';
import { fallbackImages, universalFallback } from './imageFallbacks';

interface ItemCardModalProps {
  item: EnrichedEntity;
  onClose: () => void;
}

function getField<T = string>(item: EnrichedEntity, key: string): T | undefined {
  // @ts-expect-error: dynamic access
  if (item[key] !== undefined) return item[key];
  if (item.metadata && item.metadata[key] !== undefined) return item.metadata[key] as T;
  return undefined;
}

export default function ItemCardModal({ item, onClose }: ItemCardModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg"
        role="document"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-neutral-800 text-white rounded-full p-2 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close expanded card"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <ThemedCard nation={nation}>
          <div className="flex flex-col p-4 md:p-6">
            <div className="w-full mb-4">
              <img
                src={imgSrc}
                alt={item.name}
                className="w-full h-auto max-h-80 object-contain rounded-lg mx-auto"
                onError={handleImageError}
              />
            </div>
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
        </ThemedCard>
      </div>
    </div>
  );
} 