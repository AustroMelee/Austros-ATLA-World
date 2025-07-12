import type { PersonalizationState } from '../types';

const RECENT_KEY = 'austros:recentSearches';
const BOOSTED_KEY = 'austros:boostedSlugs';
const MAX_RECENT = 10;

function loadState(): PersonalizationState {
  const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as string[];
  const boosted = JSON.parse(localStorage.getItem(BOOSTED_KEY) || '[]') as string[];
  return { recentSearches: recent, boostedSlugs: boosted };
}

function saveRecentSearches(recent: string[]) {
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}

function saveBoostedSlugs(boosted: string[]) {
  localStorage.setItem(BOOSTED_KEY, JSON.stringify(boosted));
}

export function getRecentSearches(): string[] {
  return loadState().recentSearches;
}

export function addRecentSearch(query: string) {
  let recent = loadState().recentSearches.filter(q => q !== query);
  recent.unshift(query);
  if (recent.length > MAX_RECENT) recent = recent.slice(0, MAX_RECENT);
  saveRecentSearches(recent);
}

export function getBoostedSlugs(): string[] {
  return loadState().boostedSlugs;
}

export function boostSlug(slug: string) {
  const boosted = loadState().boostedSlugs.filter(s => s !== slug);
  boosted.unshift(slug);
  saveBoostedSlugs(boosted);
}

export function unboostSlug(slug: string) {
  const boosted = loadState().boostedSlugs.filter(s => s !== slug);
  saveBoostedSlugs(boosted);
}

export function clearAll() {
  localStorage.removeItem(RECENT_KEY);
  localStorage.removeItem(BOOSTED_KEY);
}

// For future: export sync/rehydrate methods for remote support 