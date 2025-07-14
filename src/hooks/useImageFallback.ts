import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage image fallback logic for character images.
 * @param slug Character slug
 * @param iconText Fallback initials
 * @returns { imgSrc, handleImageError, resetImage }
 */
export function useImageFallback(slug?: string, imageFallbacks: Record<string, string> = {}) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(slug ? `/assets/images/${slug}.jpg` : undefined);

  useEffect(() => {
    setImgSrc(slug ? `/assets/images/${slug}.jpg` : undefined);
  }, [slug]);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!slug) return;
    if (imgSrc && imageFallbacks[slug] && !imgSrc.endsWith(imageFallbacks[slug])) {
      setImgSrc(`/assets/images/${imageFallbacks[slug]}`);
    } else {
      // fallback to initials if all fail
      const parent = (e.target as HTMLImageElement).parentElement;
      if (parent) {
        parent.innerHTML = `<span class='font-bold text-subtle text-4xl'>?</span>`;
      }
    }
  }, [imgSrc, slug, imageFallbacks]);

  return { imgSrc, handleImageError, setImgSrc };
}
