import { useEffect } from 'react';

export function useScrollLock(lock: boolean) {
  useEffect(() => {
    if (lock) {
      // Store the current scroll position and any existing styles
      const scrollY = window.scrollY;
      const originalStyles = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width,
        top: document.body.style.top,
        paddingRight: document.body.style.paddingRight
      };

      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Apply scroll lock styles
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      // Add padding to prevent content shift when scrollbar disappears
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        // Restore original styles
        document.body.style.overflow = originalStyles.overflow;
        document.body.style.position = originalStyles.position;
        document.body.style.width = originalStyles.width;
        document.body.style.top = originalStyles.top;
        document.body.style.paddingRight = originalStyles.paddingRight;

        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [lock]);
} 