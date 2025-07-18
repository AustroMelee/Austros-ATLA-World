import React, { useEffect } from 'react';
import type { EnrichedEntity } from '../../search/types';
import ThemedCard from '../ThemedCard/ThemedCard';
import NationIcon from '../NationIcon/NationIcon';
import { toTitleCase } from '../../utils/stringUtils';
import { CustomMarkdownRenderer } from '../CustomMarkdownRenderer';
import { useImageFallback } from '../../hooks/useImageFallback';
import { fallbackImages, universalFallback } from './imageFallbacks';
import { getField } from '../../utils/data';
import { nationThemeMap } from '../../theme/nationThemes';

interface ItemCardModalProps {
  item: EnrichedEntity;
  onClose: () => void;
}


export default function ItemCardModal({ item, onClose }: ItemCardModalProps) {
  const role = getField(item, 'role');
  const nation = getField(item, 'nation');
  const slug = getField(item, 'slug');
  const image = getField(item, 'image');
  const slugKey = (slug || item.id) as string;
  const { imgSrc, status, handleImageError, handleImageLoad, setImgSrc } = useImageFallback(slugKey, {
    [slugKey]: fallbackImages[slugKey] || fallbackImages[item.id] || universalFallback,
  });

  // Get nation color for title
  const nationKey = nation ? nation.toLowerCase() : 'default';
  const titleColor = nationThemeMap[nationKey]?.main || nationThemeMap.default.main;

  useEffect(() => {
    if (image) {
      setImgSrc(`/assets/images/${image}`);
    }
    
    // Handle escape key to close modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [image, setImgSrc, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      role="dialog"
      aria-modal="true"
    >
      {/* Invisible overlay button for click-to-close */}
      <button
        className="absolute inset-0 w-full h-full bg-transparent"
        onClick={onClose}
        aria-label="Close modal"
        tabIndex={-1}
      />
      <div
        className="relative w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg z-10"
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
              {status === 'error' || !imgSrc ? (
                <div className="w-full h-auto max-h-80 flex items-center justify-center rounded-lg bg-neutral-700">
                  <span className="font-bold text-subtle text-4xl">?</span>
                </div>
              ) : (
                <img
                  src={imgSrc}
                  alt={item.name}
                  className="w-full h-auto max-h-80 object-contain rounded-lg mx-auto"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}
            </div>
            <div className="w-full">
              <h2 
                className="text-3xl font-bold text-center md:text-left"
                style={{ color: titleColor }}
              >
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