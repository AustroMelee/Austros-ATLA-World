import { useState, useCallback } from 'react';

export interface UseCardExpansionResult {
  expandedId: string | null;
  toggle: (id: string) => void;
}

export function useCardExpansion(): UseCardExpansionResult {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  return { expandedId, toggle };
}

export default useCardExpansion; 