import type { EnrichedEntity } from '../search/types';
import type { Collection } from '../types/domainTypes';
import { computeNationFromEntity, getField } from './data';

interface ApplyFiltersArgs {
  entities: EnrichedEntity[];
  collections: Collection[];
  activeCollectionId: string | null;
  activeNations: Set<string>;
  activeCoreFilter: string | null;
  activeSubFilters: Set<string>;
}

export function applyFilters({
  entities,
  collections,
  activeCollectionId,
  activeNations,
  activeCoreFilter,
  activeSubFilters,
}: ApplyFiltersArgs): EnrichedEntity[] {
  let items = entities;

  if (activeCollectionId) {
    const activeCol = collections.find(c => c.id === activeCollectionId);
    const idSet = new Set(activeCol?.cardIds || []);
    items = items.filter(item => idSet.has(item.id));
  }

  if (activeNations.size > 0) {
    items = items.filter(item => {
      const normalized = computeNationFromEntity(item);
      const rawNation = item.nation;
      const region = getField<string>(item, 'region');
      const haystacks = [normalized, rawNation, region]
        .filter(Boolean)
        .map(v => String(v).toLowerCase());

      const synonyms: Record<string, string[]> = {
        air: ['air', 'air nomads'],
        earth: ['earth', 'earth kingdom'],
        fire: ['fire', 'fire nation'],
        water: ['water', 'water tribe', 'north pole', 'south pole', 'northern water tribe', 'southern water tribe'],
      };

      return Array.from(activeNations).some(sel => {
        const terms = synonyms[sel] || [sel];
        return terms.some(term => haystacks.some(h => h.includes(term)));
      });
    });
  }

  if (activeCoreFilter) {
    const typeMap: Record<string, string[]> = {
      characters: ['character'],
      locations: ['location'],
      fauna: ['fauna'],
      foods: ['food'],
      groups: ['group', 'religious_organization', 'service_organization'],
      episodes: ['episode'],
    };
    const targetTypes = typeMap[activeCoreFilter];
    if (targetTypes) items = items.filter(item => targetTypes.includes(item.type));
  }

  if (activeCoreFilter && activeSubFilters.size > 0) {
    items = items.filter(item => {
      return Array.from(activeSubFilters).every(subFilter => {
        const subFilterLower = subFilter.toLowerCase();
        const filterMapping: Record<string, string[]> = {
          villains: ['antagonist', 'villain'],
          heroes: ['protagonist', 'hero', 'deuteragonist', 'mentor'],
          mentors: ['mentor'],
          male: ['male'],
          female: ['female'],
          child: ['child'],
          teen: ['teen'],
          'young adult': ['young adult'],
          adult: ['adult'],
          elder: ['elder', 'old', 'senior'],
          bender: ['bender'],
          nonbender: ['nonbender'],
        };
        const mapped = filterMapping[subFilterLower] || [subFilterLower];
        if (item.tags?.some(tag => mapped.includes(tag.toLowerCase()))) return true;
        if (item.role) {
          if (typeof item.role === 'string' && mapped.includes(item.role.toLowerCase())) return true;
          if (Array.isArray(item.role) && item.role.some(r => mapped.includes(r.toLowerCase()))) return true;
        }
        if (item.metadata?.narrativeFunction && typeof item.metadata.narrativeFunction === 'string') {
          const narrative = item.metadata.narrativeFunction.toLowerCase();
          if (mapped.some(term => narrative.includes(term))) return true;
        }
        if (item.metadata?.eraAppearances && Array.isArray(item.metadata.eraAppearances)) {
          for (const era of item.metadata.eraAppearances as Array<{ role?: string }>) {
            if (era.role && typeof era.role === 'string' && mapped.includes(era.role.toLowerCase())) return true;
          }
        }
        if (item.gender && typeof item.gender === 'string' && mapped.includes(item.gender.toLowerCase())) return true;
        if (item.metadata?.ageRange && typeof item.metadata.ageRange === 'string' && mapped.includes(item.metadata.ageRange.toLowerCase())) {
          if (item.metadata?.species && typeof item.metadata.species === 'string') {
            const species = item.metadata.species.toLowerCase();
            if (species.includes('bison') || species.includes('lemur') || species.includes('bear') || species.includes('animal') || species.includes('spirit')) {
              return false;
            }
          }
          return true;
        }
        if (mapped.includes('bender') || mapped.includes('nonbender')) {
          const isBender = Boolean(item.metadata?.isBender);
          const hasElement = item.metadata?.bendingElement !== null && item.metadata?.bendingElement !== undefined;
          if (mapped.includes('bender') && (isBender || hasElement)) return true;
          if (mapped.includes('nonbender') && !isBender && !hasElement) return true;
        }
        if (activeCoreFilter === 'foods') {
          if (item.tags?.some(tag => tag.toLowerCase() === subFilterLower)) return true;
          const origin = getField<string>(item, 'origin');
          if (origin && origin.toLowerCase().includes(subFilterLower)) return true;
        }
        if (activeCoreFilter === 'locations') {
          // Heuristic matching to real data fields
          const locationType = getField<string>(item, 'locationType');
          const region = getField<string>(item, 'region');
          const terrain = getField<string>(item, 'terrain');
          const name = (item.name || '').toLowerCase();
          const slug = (getField<string>(item, 'slug') || '').toLowerCase();

          // Normalize a few common keys
          const key = subFilterLower;
          const synonyms: Record<string, string[]> = {
            capital: ['capital'],
            city: ['city'],
            village: ['village'],
            temple: ['temple'],
            island: ['island', 'archipelago', 'coast'],
            desert: ['desert'],
            swamp: ['swamp']
          };
          const terms = synonyms[key] || [key];

          const haystacks = [locationType, region, terrain, name, slug]
            .filter(Boolean)
            .map(v => String(v).toLowerCase());

          return terms.some(t => haystacks.some(h => h.includes(t)));
        }
        if (activeCoreFilter === 'fauna') {
          // Map subfilters to actual tags and metadata available in fauna entries
          const faunaFilterMapping: Record<string, string[]> = {
            predators_hunters: ['military', 'cavalry', 'hunting', 'predator', 'dangerous', 'venomous', 'aggressive'],
            domesticated_mounts: ['military', 'cavalry', 'merchant', 'transportation', 'mount', 'domesticated'],
            aquatic_marine: ['aquatic', 'marine', 'fish', 'mollusk', 'cephalopod'],
            flying_aerial: ['flying', 'bird', 'aerial'],
            sacred_spiritual: ['sacred', 'spirit', 'spiritual'],
            hybrid_mixed: ['hybrid', 'mixed'],
            small_insects: ['insect', 'arachnid', 'small'],
            reptiles_amphibians: ['reptile', 'amphibian', 'lizard', 'snake']
          };
          
          const faunaMapped = faunaFilterMapping[subFilterLower] || [subFilterLower];
          
          // Check tags
          if (item.tags?.some(tag => faunaMapped.includes(tag.toLowerCase()))) return true;
          
          // Check metadata for additional categorization
          if (item.metadata?.animalType && typeof item.metadata.animalType === 'string' && faunaMapped.includes(item.metadata.animalType.toLowerCase())) return true;
          if (item.metadata?.habitat && typeof item.metadata.habitat === 'string' && faunaMapped.includes(item.metadata.habitat.toLowerCase())) return true;
          
          // Check for specific characteristics in metadata
          if (item.metadata?.behavior && typeof item.metadata.behavior === 'string') {
            const behavior = item.metadata.behavior.toLowerCase();
            if (faunaMapped.some(term => behavior.includes(term))) return true;
          }
          
          // Check for military/cavalry usage
          if (subFilterLower === 'domesticated_mounts' && item.tags?.some(tag => ['military', 'cavalry'].includes(tag.toLowerCase()))) return true;
          
          // Check for predator characteristics
          if (subFilterLower === 'predators_hunters' && item.metadata?.diet === 'carnivore') return true;
          
          // Check for aquatic creatures
          if (subFilterLower === 'aquatic_marine' && item.metadata?.habitat === 'aquatic') return true;
          
          // Check for flying creatures
          if (subFilterLower === 'flying_aerial' && item.metadata?.habitat === 'aerial') return true;
        }
        if (activeCoreFilter === 'episodes') {
          // Check for book-based subfilters
          if (subFilterLower === 'book_1') {
            return item.book === 'Water' || item.metadata?.book === 'Water' || item.metadata?.book === '1';
          }
          if (subFilterLower === 'book_2') {
            return item.book === 'Earth' || item.metadata?.book === 'Earth' || item.metadata?.book === '2';
          }
          if (subFilterLower === 'book_3') {
            return item.book === 'Fire' || item.metadata?.book === 'Fire' || item.metadata?.book === '3';
          }
          
          // Check if the episode has the specific tag
          if (item.tags?.some(tag => tag.toLowerCase() === subFilterLower)) return true;
          
          // Check episode-specific metadata
          if (item.book && typeof item.book === 'string' && subFilterLower.includes(item.book.toLowerCase())) return true;
          if (item.metadata?.book && typeof item.metadata.book === 'string' && subFilterLower.includes(item.metadata.book.toLowerCase())) return true;
          if (item.metadata?.series && typeof item.metadata.series === 'string' && subFilterLower.includes(item.metadata.series.toLowerCase())) return true;
          
          // Check for specific episode themes and elements
          if (item.metadata?.characters && Array.isArray(item.metadata.characters)) {
            for (const character of item.metadata.characters) {
              if (typeof character === 'string' && character.toLowerCase().includes(subFilterLower)) return true;
            }
          }
          
          // Check for specific locations in the episode
          if (item.metadata?.locations && Array.isArray(item.metadata.locations)) {
            for (const location of item.metadata.locations) {
              if (typeof location === 'string' && location.toLowerCase().includes(subFilterLower)) return true;
            }
          }
        }
        return false;
      });
    });
  }

  return items;
} 