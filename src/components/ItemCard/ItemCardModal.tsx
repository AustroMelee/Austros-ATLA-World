import React, { useEffect, useRef } from 'react';
import type { EnrichedEntity } from '../../search/types';
import ThemedCard from '../ThemedCard/ThemedCard';
import NationIcon from '../NationIcon/NationIcon';
import { toTitleCase } from '../../utils/stringUtils';
import { CustomMarkdownRenderer } from '../CustomMarkdownRenderer';
import { useImageFallback } from '../../hooks/useImageFallback';
import { fallbackImages, universalFallback } from './imageFallbacks';
import { getField, computeNationFromEntity } from '../../utils/data';
import { nationThemeMap } from '../../theme/nationThemes';
import { useScrollLock } from '../../hooks/useScrollLock';

interface ItemCardModalProps {
  item: EnrichedEntity;
  onClose: () => void;
}

export default function ItemCardModal({ item, onClose }: ItemCardModalProps) {
  const role = getField(item, 'role');
  const nation = computeNationFromEntity(item) || getField(item, 'nation');
  const slug = getField(item, 'slug');
  const image = getField(item, 'image');
  const slugKey = (slug || item.id) as string;
  const { imgSrc, status, handleImageError, handleImageLoad, setImgSrc } = useImageFallback(slugKey, {
    [slugKey]: fallbackImages[slugKey] || fallbackImages[item.id] || universalFallback,
  });

  // Get nation color for title
  const nationKey = nation || 'default';
  const titleColor = nationThemeMap[nationKey]?.main || nationThemeMap.default.main;

  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.setProperty('color', titleColor, 'important');
    }
  }, [titleColor]);

  // Lock scroll when modal is open
  useScrollLock(true);

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

  const displayTitle: string = (() => {
    const name = typeof item.name === 'string' ? item.name : '';
    const title = getField<string>(item, 'title') || '';
    const hasSxEx = (s: string) => /s\s*\d+\s*e\s*\d+/i.test(s);
    if ((item as { type?: string }).type === 'episode') {
      if (hasSxEx(name)) return name;
      if (hasSxEx(title)) return title;

      const bookRaw = getField<string>(item, 'book') || '';
      const book = bookRaw.toLowerCase();
      const season = book.includes('water') || book.includes('book 1') || book === '1' ? 1
        : book.includes('earth') || book.includes('book 2') || book === '2' ? 2
        : book.includes('fire') || book.includes('book 3') || book === '3' ? 3
        : null;

      const episodeRaw = getField<string | number>(item, 'episode');
      let episodeNum: number | null = null;
      if (typeof episodeRaw === 'number') {
        episodeNum = episodeRaw;
      } else if (typeof episodeRaw === 'string') {
        const mx = episodeRaw.match(/^(\d+)\s*x\s*(\d+)$/i);
        if (mx) {
          episodeNum = parseInt(mx[2], 10);
        } else {
          const onlyNum = episodeRaw.trim();
          if (/^\d+$/.test(onlyNum)) episodeNum = parseInt(onlyNum, 10);
        }
      }

      if (season !== null && episodeNum !== null) {
        const base = name || title;
        return `S${season}E${episodeNum} - ${base}`;
      }
    }
    return toTitleCase(name || title);
  })();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay button for clicking outside */}
      <button
        className="absolute inset-0 w-full h-full bg-black bg-opacity-75"
        onClick={onClose}
        aria-label="Close modal"
      />
      
      {/* Modal content */}
      <div
        className="relative w-11/12 max-w-2xl h-[90vh] overflow-hidden rounded-lg z-10"
        role="document"
        aria-label="Item details"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-8 z-20 bg-neutral-800 text-white rounded-full p-2 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Close expanded card"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <ThemedCard nation={nation}>
          <div 
            className="h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
            style={{ '--modal-title-color': titleColor } as React.CSSProperties}
          >
            <div className="flex flex-col p-4 md:p-6 crt-screen">
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
                    loading="lazy"
                  />
                )}
              </div>
              <div className="w-full">
                <h2 
                  ref={titleRef}
                  className="text-3xl font-bold text-center md:text-left"
                >
                  {displayTitle}
                  {nation && <NationIcon nation={nation} size={24} className="align-middle flex-shrink-0 ml-2" />}
                </h2>
                {role && <p className="text-lg text-neutral-400 mb-4 text-center md:text-left font-bold">{role}</p>}
                <hr className="border-gray-700 my-4" />
                {/* Only markdown is inside prose */}
                <div className="prose prose-invert max-w-none">
                  <CustomMarkdownRenderer markdown={getField(item, 'expandedView') || ''} />
                </div>
              </div>
            </div>
          </div>
        </ThemedCard>
      </div>
    </div>
  );
}