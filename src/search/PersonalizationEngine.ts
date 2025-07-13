import type { PersonalizationState } from '../types';

const RECENT_KEY = 'austros:recentSearches';
const BOOSTED_KEY = 'austros:boostedSlugs';
const MAX_RECENT = 10;

function loadState(): PersonalizationState {
  try {
    const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as string[];
    const boosted = JSON.parse(localStorage.getItem(BOOSTED_KEY) || '[]') as string[];
    return { recentSearches: recent, boostedSlugs: boosted };
  } catch (e) {
    console.error('Failed to load personalization state:', e);
    return { recentSearches: [], boostedSlugs: [] };
  }
}

function saveRecentSearches(recent: string[]) {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
  } catch (e) {
    console.error('Failed to save recent searches:', e);
  }
}

function saveBoostedSlugs(boosted: string[]) {
  try {
    localStorage.setItem(BOOSTED_KEY, JSON.stringify(boosted));
  } catch (e) {
    console.error('Failed to save boosted slugs:', e);
  }
}

export function getRecentSearches(): string[] {
  return loadState().recentSearches;
}

export function addRecentSearch(query: string) {
  if (!query || query.trim().length < 2) return;
  const lowercasedQuery = query.trim().toLowerCase();
  let recent = loadState().recentSearches.filter(q => q !== lowercasedQuery);
  recent.unshift(lowercasedQuery);
  if (recent.length > MAX_RECENT) {
    recent = recent.slice(0, MAX_RECENT);
  }
  saveRecentSearches(recent);
}

export function getBoostedSlugs(): string[] {
  return loadState().boostedSlugs;
}

export function boostSlug(slug: string) {
  if (!slug) return;
  const boosted = loadState().boostedSlugs.filter(s => s !== slug);
  boosted.unshift(slug);
  saveBoostedSlugs(boosted);
}

export function unboostSlug(slug: string) {
  const boosted = loadState().boostedSlugs.filter(s => s !== slug);
  saveBoostedSlugs(boosted);
}

export function clearAll() {
  try {
    localStorage.removeItem(RECENT_KEY);
    localStorage.removeItem(BOOSTED_KEY);
  } catch (e) {
    console.error('Failed to clear personalization state:', e);
  }
}

// For future: export sync/rehydrate methods for remote support 