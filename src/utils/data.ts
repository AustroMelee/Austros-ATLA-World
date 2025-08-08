import type { EnrichedEntity } from '../search/types';

export function getField<T = string>(item: EnrichedEntity, key: string): T | undefined {
  const base = item as unknown as Record<string, unknown>;
  if (base[key] !== undefined) return base[key] as T;
  if (item.metadata && item.metadata[key] !== undefined) {
    return item.metadata[key] as unknown as T;
  }
  return undefined;
}

/**
 * Attempts to derive a canonical nation for an entity using multiple hints.
 * Ensures nation-dependent theming and filtering work even if top-level nation is missing.
 */
export function computeNationFromEntity(entity: EnrichedEntity): string | undefined {
  const TEXT_TO_NATION: Array<{ match: RegExp; nation: string }> = [
    { match: /air\s*nomad/i, nation: 'Air Nomads' },
    { match: /northern\s*water\s*tribe/i, nation: 'Northern Water Tribe' },
    { match: /southern\s*water\s*tribe/i, nation: 'Southern Water Tribe' },
    { match: /water\s*tribe/i, nation: 'Water Tribe' },
    { match: /north\s*pole/i, nation: 'Water Tribe' },
    { match: /south\s*pole/i, nation: 'Water Tribe' },
    { match: /earth\s*kingdom/i, nation: 'Earth Kingdom' },
    { match: /fire\s*nation/i, nation: 'Fire Nation' },
  ];

  const normalize = (val: unknown): string | undefined => {
    if (!val) return undefined;
    const s = Array.isArray(val) ? val.join(' ').toLowerCase() : String(val).toLowerCase();
    const hit = TEXT_TO_NATION.find(({ match }) => match.test(s));
    return hit?.nation;
  };

  // 1) Prefer canonical normalization from top-level or metadata values
  const primary = entity.nation || getField<string>(entity, 'nation');
  const primaryNorm = normalize(primary);
  if (primaryNorm) return primaryNorm;

  // 2) Affiliation array
  if (entity.affiliation && entity.affiliation.length > 0) {
    const affHit = normalize(entity.affiliation);
    if (affHit) return affHit;
  }

  // 3) Food origin
  const origin = getField<string>(entity, 'origin');
  const originNorm = normalize(origin);
  if (originNorm) return originNorm;

  // 4) Location hints
  if (entity.type === 'location') {
    const region = getField<string>(entity, 'region');
    const locationType = getField<string>(entity, 'locationType');
    const locHit = normalize([region, locationType].filter(Boolean).join(' '));
    if (locHit) return locHit;
  }

  // 5) Episode book mapping
  if (entity.type === 'episode') {
    // Resolve book from multiple sources, including title/name SxEx when missing
    const resolveEpisodeBook = (): 'water' | 'earth' | 'fire' | undefined => {
      const direct = getField<string>(entity, 'book');
      if (typeof direct === 'string' && direct.trim()) {
        const d = direct.trim().toLowerCase();
        if (d.includes('water') || d === '1' || d.includes('book 1')) return 'water';
        if (d.includes('earth') || d === '2' || d.includes('book 2')) return 'earth';
        if (d.includes('fire') || d === '3' || d.includes('book 3')) return 'fire';
      }
      const metaBook = (entity as unknown as { metadata?: Record<string, unknown> }).metadata?.book;
      if (typeof metaBook === 'string' && metaBook.trim()) {
        const mb = metaBook.trim().toLowerCase();
        if (mb.includes('water') || mb === '1' || mb.includes('book 1')) return 'water';
        if (mb.includes('earth') || mb === '2' || mb.includes('book 2')) return 'earth';
        if (mb.includes('fire') || mb === '3' || mb.includes('book 3')) return 'fire';
      }
      const title = getField<string>(entity, 'title') || '';
      const name = String((entity as unknown as { name?: unknown }).name || '');
      const sxe = /s\s*(\d+)\s*e\s*\d+/i;
      const mm = title.match(sxe) || name.match(sxe);
      if (mm) {
        const season = Number(mm[1]);
        if (season === 1) return 'water';
        if (season === 2) return 'earth';
        if (season === 3) return 'fire';
      }
      return undefined;
    };

    const normalized = resolveEpisodeBook();
    if (normalized === 'water') return 'Water Tribe';
    if (normalized === 'earth') return 'Earth Kingdom';
    if (normalized === 'fire') return 'Fire Nation';
  }

  // 6) Generic hints
  const region = getField<string>(entity, 'region');
  const tags = entity.tags?.join(' ');
  const genericHit = normalize([region, tags].filter(Boolean).join(' '));
  if (genericHit) return genericHit;

  return undefined;
}
