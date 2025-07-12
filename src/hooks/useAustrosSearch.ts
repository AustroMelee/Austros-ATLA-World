// Interface for search/filter result (example, can be extended later)
export interface AustrosSearchResult {
  id: string;
  name: string;
  type: 'character' | 'bending' | 'location' | 'fauna' | 'food' | 'spirit';
}

// Placeholder for hook signature
export function useAustrosSearch(): AustrosSearchResult[] {
  // Implementation will be added later
  return [];
}
