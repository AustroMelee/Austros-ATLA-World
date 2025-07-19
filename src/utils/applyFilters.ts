import type { EnrichedEntity } from '../search/types';
import type { Collection } from '../types/domainTypes';

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
    items = items.filter(item =>
      item.nation &&
      Array.from(activeNations).some(n =>
        item.nation!.toLowerCase().includes(n.toLowerCase())
      )
    );
  }

  if (activeCoreFilter) {
    const typeMap: Record<string, string> = {
      characters: 'character',
      locations: 'location',
      fauna: 'fauna',
      foods: 'food',
      groups: 'group',
      spirits: 'spirit-world',
    };
    const targetType = typeMap[activeCoreFilter];
    if (targetType) items = items.filter(item => item.type === targetType);
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
        }
        return false;
      });
    });
  }

  return items;
} 