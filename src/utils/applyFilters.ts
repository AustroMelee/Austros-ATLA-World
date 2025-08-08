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
        // --- Helpers: normalize common fields across data variants ---
        const lowerTags: string[] = (item.tags || []).map((t) => String(t).toLowerCase());
        const roleLower: string = item.role ? String(item.role).toLowerCase() : '';
        const genderLower: string = item.gender ? String(item.gender).toLowerCase() : '';
        const expandedLower: string = String((item as unknown as { expandedView?: unknown }).expandedView || '').toLowerCase();
        const metadata = (item as unknown as { metadata?: Record<string, unknown> }).metadata || {};
        const narrativeLower: string = typeof (metadata as Record<string, unknown>).narrativeFunction === 'string'
          ? String((metadata as Record<string, unknown>).narrativeFunction).toLowerCase()
          : String((item as unknown as { narrativeFunction?: unknown }).narrativeFunction || '').toLowerCase();
        const speciesLower: string = String((item as unknown as { species?: unknown }).species || '').toLowerCase();
        const ageChronological: number | null = (() => {
          const val = (item as unknown as { ageChronological?: unknown }).ageChronological;
          return typeof val === 'number' ? val : null;
        })();
        const ageRangeLower: string = typeof (metadata as Record<string, unknown>).ageRange === 'string'
          ? String((metadata as Record<string, unknown>).ageRange).toLowerCase()
          : String((item as unknown as { ageRange?: unknown }).ageRange || '').toLowerCase();
        const isBenderTopLevel = (item as unknown as { isBender?: unknown }).isBender === true;
        const bendingElementLower: string | undefined = (() => {
          const metaEl = (metadata as Record<string, unknown>).bendingElement;
          if (typeof metaEl === 'string') return metaEl.toLowerCase();
          const topEl = (item as unknown as { bendingElement?: unknown }).bendingElement;
          return typeof topEl === 'string' ? topEl.toLowerCase() : undefined;
        })();

        // --- Mapping & basic tag/role checks ---
        const filterMapping: Record<string, string[]> = {
          villains: ['antagonist', 'villain'],
          heroes: ['protagonist', 'hero', 'deuteragonist', 'main', 'lead'],
          mentors: ['mentor', 'teacher', 'master'],
          male: ['male'],
          female: ['female'],
          child: ['child', 'kid', 'boy', 'girl'],
          teen: ['teen', 'teenager', 'youth'],
          'young adult': ['young adult'],
          adult: ['adult'],
          elder: ['elder', 'old', 'senior', 'elderly'],
          bender: ['bender'],
          nonbender: ['nonbender'],
        };
        const mapped = filterMapping[subFilterLower] || [subFilterLower];

        // 1) Tags
        if (lowerTags.some((tag) => mapped.includes(tag))) return true;

        // 2) Role text
        if (roleLower && mapped.some((m) => roleLower.includes(m))) return true;

        // 3) Narrative function (metadata or top-level) & expanded body text
        if (narrativeLower && mapped.some((m) => narrativeLower.includes(m))) return true;
        if (expandedLower && mapped.some((m) => expandedLower.includes(m))) return true;

        // 4) Gender
        if (subFilterLower === 'male' || subFilterLower === 'female') {
          if (genderLower === subFilterLower) return true;
        }

        // 5) Age categories — prefer explicit ageRange; fallback to heuristics and numeric ages
        const isNonHuman = speciesLower && speciesLower !== 'human';
        if (!isNonHuman) {
          if (ageRangeLower && mapped.includes(ageRangeLower)) return true;
          if (subFilterLower === 'child') {
            if (ageChronological !== null && ageChronological < 13) return true;
            if (lowerTags.some((t) => ['child', 'kid', 'boy', 'girl'].includes(t))) return true;
          }
          if (subFilterLower === 'teen') {
            if (ageChronological !== null && ageChronological >= 13 && ageChronological <= 17) return true;
            if (lowerTags.some((t) => ['teen', 'teenager'].includes(t))) return true;
          }
          if (subFilterLower === 'adult') {
            if (ageChronological !== null && ageChronological >= 18 && ageChronological < 60) return true;
            if (lowerTags.includes('adult')) return true;
          }
          if (subFilterLower === 'elder') {
            if (ageChronological !== null && ageChronological >= 60) return true;
            if (lowerTags.some((t) => ['elder', 'elderly', 'senior', 'old'].includes(t))) return true;
          }
        }

        // 6) Bender / Nonbender — use top-level fields or tags
        if (subFilterLower === 'bender') {
          if (isBenderTopLevel) return true;
          if (bendingElementLower) return true;
          if (lowerTags.some((t) => t === 'bender' || t.endsWith('bender'))) return true;
        }
        if (subFilterLower === 'nonbender') {
          const explicitNon = (item as unknown as { isBender?: unknown }).isBender === false || lowerTags.includes('nonbender');
          const noElement = !bendingElementLower && !lowerTags.some((t) => t.endsWith('bender'));
          if (explicitNon || noElement) return true;
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

          // --- Fallback heuristics: many fauna lack structured tags/metadata; infer from name/slug/expanded text ---
          const nameLower: string = (item.name || '').toLowerCase();
          const slugLower: string = (getField<string>(item, 'slug') || '').toLowerCase();
          const expandedFaunaLower: string = String((item as unknown as { expandedView?: unknown }).expandedView || '').toLowerCase();
          const nationLower: string = (item.nation || '').toLowerCase();

          const textHaystack = `${nameLower} ${slugLower} ${expandedFaunaLower}`;

          const keywordMap: Record<string, string[]> = {
            predators_hunters: ['predator', 'hunt', 'hunting', 'dangerous', 'venomous', 'aggressive'],
            domesticated_mounts: ['domesticated', 'mount', 'beast of burden', 'burden', 'saddle', 'rider', 'transportation', 'carry loads', 'beast-of-burden'],
            aquatic_marine: ['aquatic', 'marine', 'fish', 'ocean', 'sea', 'river', 'lake', 'underwater'],
            flying_aerial: ['flying', 'fly', 'wings', 'wing', 'flight', 'bird', 'raptor', 'aerial'],
            sacred_spiritual: ['sacred', 'spirit', 'spiritual', 'spirit world', 'guardian'],
            hybrid_mixed: ['hybrid', 'mixed', 'combines', 'combination'],
            small_insects: ['insect', 'arachnid', 'centipede', 'wasp', 'spider', 'bug', 'small'],
            reptiles_amphibians: ['reptile', 'amphibian', 'lizard', 'snake', 'crocodile', 'alligator', 'gator', 'frog', 'toad']
          };

          const keywords = keywordMap[subFilterLower];
          if (keywords && keywords.some(k => textHaystack.includes(k))) return true;

          // Spirit nation implies spiritual
          if (subFilterLower === 'sacred_spiritual' && nationLower.includes('spirit')) return true;
        }
        if (activeCoreFilter === 'episodes') {
          // --- Resolve normalized book for episodes, even if top-level/metadata is missing ---
          const resolveEpisodeBook = (): 'water' | 'earth' | 'fire' | undefined => {
            const direct = getField<string>(item, 'book');
            if (typeof direct === 'string' && direct.trim()) {
              const d = direct.trim().toLowerCase();
              if (d.includes('water') || d === '1' || d.includes('book 1')) return 'water';
              if (d.includes('earth') || d === '2' || d.includes('book 2')) return 'earth';
              if (d.includes('fire') || d === '3' || d.includes('book 3')) return 'fire';
            }
            const metaBook = (item as unknown as { metadata?: Record<string, unknown> }).metadata?.book;
            if (typeof metaBook === 'string' && metaBook.trim()) {
              const mb = metaBook.trim().toLowerCase();
              if (mb.includes('water') || mb === '1' || mb.includes('book 1')) return 'water';
              if (mb.includes('earth') || mb === '2' || mb.includes('book 2')) return 'earth';
              if (mb.includes('fire') || mb === '3' || mb.includes('book 3')) return 'fire';
            }
            const title = (getField<string>(item, 'title') || '').toLowerCase();
            const name = String(item.name || '').toLowerCase();
            const sxe = /s\s*(\d+)\s*e\s*\d+/i;
            const mm = (title.match(sxe) || name.match(sxe));
            if (mm) {
              const seasonNum = Number(mm[1]);
              if (seasonNum === 1) return 'water';
              if (seasonNum === 2) return 'earth';
              if (seasonNum === 3) return 'fire';
            }
            return undefined;
          };
          const normalizedBook = resolveEpisodeBook();

          // Check for book-based subfilters
          if (subFilterLower === 'book_1') {
            return normalizedBook === 'water';
          }
          if (subFilterLower === 'book_2') {
            return normalizedBook === 'earth';
          }
          if (subFilterLower === 'book_3') {
            return normalizedBook === 'fire';
          }
          
          // Check if the episode has the specific tag
          if (item.tags?.some(tag => tag.toLowerCase() === subFilterLower)) return true;
          
          // Check episode-specific metadata
          if (normalizedBook && subFilterLower.includes(normalizedBook)) return true;
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

  // Chronological ordering for episodes
  if (activeCoreFilter === 'episodes') {
    const bookToSeasonNumber = (bookRaw: unknown): number | null => {
      const book = typeof bookRaw === 'string' ? bookRaw.trim().toLowerCase() : '';
      if (!book) return null;
      if (book === 'water' || book === '1' || book.includes('book 1')) return 1;
      if (book === 'earth' || book === '2' || book.includes('book 2')) return 2;
      if (book === 'fire' || book === '3' || book.includes('book 3')) return 3;
      return null;
    };

    const extractSeasonEpisode = (e: EnrichedEntity): { season: number | null; episode: number | null } => {
      const title = getField<string>(e, 'title') || '';
      const name = String(e.name || '');
      const episodeField = getField<string | number>(e, 'episode');
      const book = getField<string>(e, 'book');

      // Prefer patterns like "S2E5" from title or name
      const sxeRegex = /s\s*(\d+)\s*e\s*(\d+)/i;
      const mTitle = title.match(sxeRegex);
      if (mTitle) return { season: Number(mTitle[1]), episode: Number(mTitle[2]) };
      const mName = name.match(sxeRegex);
      if (mName) return { season: Number(mName[1]), episode: Number(mName[2]) };

      // Patterns like "1x06"
      const xRegex = /^(\d+)\s*x\s*(\d+)$/i;
      if (typeof episodeField === 'string') {
        const mx = episodeField.match(xRegex);
        if (mx) return { season: Number(mx[1]), episode: Number(mx[2]) };
      }

      // Numeric-only episode with season inferred from book
      const season = bookToSeasonNumber(book);
      if (typeof episodeField === 'number') {
        return { season, episode: episodeField };
      }
      if (typeof episodeField === 'string' && /^\d+$/.test(episodeField.trim())) {
        return { season, episode: Number(episodeField.trim()) };
      }

      return { season, episode: null };
    };

    const parseAirDate = (e: EnrichedEntity): number | null => {
      const airDateRaw = getField<string>(e, 'air_date');
      if (!airDateRaw) return null;
      const d = new Date(airDateRaw);
      const t = d.getTime();
      return Number.isNaN(t) ? null : t;
    };

    const parseProductionNumber = (e: EnrichedEntity): number | null => {
      const pn = getField<string>(e, 'production_number');
      if (!pn) return null;
      const n = parseInt(pn.replace(/[^0-9]/g, ''), 10);
      return Number.isNaN(n) ? null : n;
    };

    items = items.slice().sort((a, b) => {
      const aSE = extractSeasonEpisode(a);
      const bSE = extractSeasonEpisode(b);

      // Season first
      if (aSE.season !== null && bSE.season !== null && aSE.season !== bSE.season) {
        return aSE.season - bSE.season;
      }

      // Episode within season
      if (aSE.episode !== null && bSE.episode !== null && aSE.episode !== bSE.episode) {
        return aSE.episode - bSE.episode;
      }

      // If one has episode and the other doesn't, prefer the one with episode number
      if (aSE.episode !== null && bSE.episode === null) return -1;
      if (aSE.episode === null && bSE.episode !== null) return 1;

      // Fallback to air date
      const aDate = parseAirDate(a);
      const bDate = parseAirDate(b);
      if (aDate !== null && bDate !== null && aDate !== bDate) return aDate - bDate;
      if (aDate !== null && bDate === null) return -1;
      if (aDate === null && bDate !== null) return 1;

      // Fallback to production number
      const aPN = parseProductionNumber(a);
      const bPN = parseProductionNumber(b);
      if (aPN !== null && bPN !== null && aPN !== bPN) return aPN - bPN;
      if (aPN !== null && bPN === null) return -1;
      if (aPN === null && bPN !== null) return 1;

      // Last resort: alphabetical by name for stability
      const aName = String(a.name || '');
      const bName = String(b.name || '');
      return aName.localeCompare(bName);
    });
  }

  return items;
} 