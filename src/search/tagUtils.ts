// This file centralizes tag logic to be shared between the build script and the frontend.

export const CANONICAL_TAGS = [
  'Earth Kingdom', 'Fire Nation', 'Air Nomads', 'Southern Water Tribe', 'Northern Water Tribe',
  'Male', 'Female', 'Bender', 'Nonbender', 'Avatar',
  'Protagonist', 'Antagonist', 'Ally', 'Villain', 'Mentor', 'Teacher', 'Leader', 'Warrior', 'Fighter',
  'Royalty / Noble', 'Comic Relief', 'Love Interest', 'Animal Companion', 'The Deserter',
  'Wise', 'Loyal', 'Compassionate', 'Strategic / Strategist', 'Brave / Courageous', 'Determined',
  'Ambitious', 'Confident', 'Cunning', 'Protective', 'Legendary', 'Master', 'Resilient', 'Kind',
  'Spiritual', 'Patient', 'Playful', 'Optimistic', 'Stoic', 'Sacrifice',
  'Airbender', 'Waterbender', 'Earthbender', 'Firebender',
  'Teen', 'Adult', 'Elder',
  'Team Avatar', 'Order of the White Lotus', 'Dai Li', 'Kyoshi Warriors', 'Earth Rumble',
  'Book One', 'Book Two', 'Book Three',
  'Redemption', 'Hope', 'Family', 'Gaoling', 'Ba Sing Se', 'Lake Laogai'
];

/**
 * Checks if a given query string matches a canonical tag (case-insensitively) and returns the canonical version.
 * This version is resilient to trailing colons.
 * @param {string} query - The user's search term.
 * @returns {string | null} The matching canonical tag or null if no match is found.
 */
export function getCanonicalTag(query: string): string | null {
  // Remove trailing colons, then trim and lowercase.
  const cleanedQuery = query.trim().replace(/:$/, '').trim().toLowerCase();
  
  if (!cleanedQuery) return null;
  
  const matchedTag = CANONICAL_TAGS.find(tag => tag.toLowerCase() === cleanedQuery);
  
  return matchedTag || null;
} 