import type { SearchFilters } from '../types';

/**
 * Parses a natural language query into structured search filters.
 * Currently extracts 'type', 'tag', and 'name' from simple queries.
 * Easily extensible for more complex logic (ranges, AND/OR, etc).
 */
export function parseQuery(query: string): SearchFilters {
  const filters: SearchFilters = {};
  if (!query) return filters;
  const words = query.toLowerCase().split(/\s+/);
  // Example: very basic extraction logic
  for (const word of words) {
    if ([
      'animal', 'animals', 'fauna', 'creature', 'creatures',
      'food', 'foods', 'dish', 'dishes',
      'location', 'place', 'region', 'city', 'village',
      'bending', 'art', 'element',
      'character', 'person', 'people',
      'spirit', 'spiritworld', 'spirit-world'
    ].includes(word)) {
      if (word.startsWith('anim') || word === 'fauna' || word === 'creature' || word === 'creatures') filters.type = 'animal';
      else if (word.startsWith('food') || word === 'dish' || word === 'dishes') filters.type = 'food';
      else if (word.startsWith('locat') || word === 'place' || word === 'region' || word === 'city' || word === 'village') filters.type = 'location';
      else if (word.startsWith('bend') || word === 'art' || word === 'element') filters.type = 'bending';
      else if (word.startsWith('char') || word === 'person' || word === 'people') filters.type = 'character';
      else if (word.startsWith('spirit')) filters.type = 'spiritworld';
      continue;
    }
    // Example: treat color/element as tag
    if ([
      'fire', 'water', 'earth', 'air', 'ice', 'metal', 'sand', 'lava',
      'blue', 'red', 'green', 'yellow', 'white', 'black', 'spicy', 'sweet', 'savory'
    ].includes(word)) {
      filters.tag = word;
      continue;
    }
    // Otherwise, treat as name (if not already set)
    if (!filters.name) filters.name = word;
  }
  return filters;
} 