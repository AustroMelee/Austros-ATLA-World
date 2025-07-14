import { useMemo } from 'react';
import { nationThemeMap } from '../theme/nationThemes';

/**
 * Returns the main theme color for the top search result's nation.
 * @param topHit The top search result (character) or null
 */
export function useNationColor(topHit: { nation?: string } | null): string {
  return useMemo(() => {
    if (topHit && topHit.nation) {
      const nationKey = topHit.nation.toLowerCase();
      return nationThemeMap[nationKey]?.main || nationThemeMap.default.main;
    }
    return nationThemeMap.default.main;
  }, [topHit]);
}
