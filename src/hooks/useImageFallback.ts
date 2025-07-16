import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage image fallback logic for character images.
 * @param slug Character slug
 * @param iconText Fallback initials
 * @returns { imgSrc, handleImageError, resetImage }
 */
export function useImageFallback(
  slug?: string,
  imageFallbacks: Record<string, string> = {},
) {
  const [imgSrc, setImgSrc] = useState<string | undefined>(
    slug ? `/assets/images/${slug}.jpg` : undefined,
  );
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    slug ? 'loading' : 'error',
  );

  useEffect(() => {
    setImgSrc(slug ? `/assets/images/${slug}.jpg` : undefined);
    setStatus(slug ? 'loading' : 'error');
  }, [slug]);

  const handleImageLoad = useCallback(() => {
    setStatus('loaded');
  }, []);

  const handleImageError = useCallback(() => {
    if (!slug) {
      setStatus('error');
      setImgSrc(undefined);
      return;
    }
    if (imgSrc && imageFallbacks[slug] && !imgSrc.endsWith(imageFallbacks[slug])) {
      setImgSrc(`/assets/images/${imageFallbacks[slug]}`);
      setStatus('loading');
    } else {
      setImgSrc(undefined);
      setStatus('error');
    }
  }, [slug, imgSrc, imageFallbacks]);

  return { imgSrc, status, handleImageError, handleImageLoad, setImgSrc };
}
