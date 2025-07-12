// Interface for virtual scroll result (example, can be extended later)
export interface VirtualScrollResult<T> {
  visibleItems: T[];
  startIndex: number;
  endIndex: number;
}

// Placeholder for hook signature
export function useVirtualScroll<T>(
  _items: T[],
  _itemHeight: number,
  _containerHeight: number
): VirtualScrollResult<T> {
  // Implementation will be added later
  return { visibleItems: [], startIndex: 0, endIndex: 0 };
}
