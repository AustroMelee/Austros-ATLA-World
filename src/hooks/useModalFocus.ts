import { useEffect, useRef } from 'react';

/**
 * Hook to manage body scroll locking and focus restoration when a modal is open.
 * @param isOpen Whether the modal is open
 */
export function useModalFocus(isOpen: boolean) {
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      lastFocusedElement.current = document.activeElement as HTMLElement;
    } else {
      document.body.style.overflow = '';
      if (lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
}
