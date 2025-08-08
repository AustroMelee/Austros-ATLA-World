import { useMemo } from 'react';
import FlexSearch from 'flexsearch';
import type { EnrichedEntity } from '../search/types';

interface MatchedField {
  field: string;
  token: string;
}

export function useSearch(
  allEntities: EnrichedEntity[],
  query: string,
): Array<{ entity: EnrichedEntity; matchedFields: MatchedField[] }> {
  // Build a robust searchable blob for each entity (name, tags, affiliations, metadata, etc.)
  const indexDocs = useMemo(() => {
    const toArray = (val: unknown): string[] => (Array.isArray(val) ? (val as unknown[]).map(String) : val ? [String(val)] : []);
    return allEntities.map((e: EnrichedEntity) => {
      const parts: string[] = [];
      // Core fields
      if (e.name) parts.push(String(e.name));
      if ((e as unknown as { summary?: unknown }).summary) parts.push(String((e as unknown as { summary?: unknown }).summary));
      if (e.role) parts.push(String(e.role));
      if (e.nation) parts.push(String(e.nation));
      if ((e as unknown as { description?: unknown }).description) parts.push(String((e as unknown as { description?: unknown }).description));
      if ((e as unknown as { expandedView?: unknown }).expandedView) parts.push(String((e as unknown as { expandedView?: unknown }).expandedView));
      if (e.gender) parts.push(String(e.gender));
      // Arrays
      parts.push(...toArray((e as unknown as { titles?: unknown }).titles));
      parts.push(...toArray((e as unknown as { searchableKeywords?: unknown }).searchableKeywords));
      parts.push(...toArray((e as unknown as { fuzzySynonyms?: unknown }).fuzzySynonyms));
      parts.push(...(e.tags || []));
      parts.push(...(e.searchAliases || []));
      parts.push(...(e.affiliation || []));
      // tagCategories
      if (e.tagCategories) {
        for (const arr of Object.values(e.tagCategories)) {
          parts.push(...toArray(arr));
        }
      }
      // metadata (strings and string[])
      if (e.metadata && typeof e.metadata === 'object') {
        for (const val of Object.values(e.metadata)) {
          if (typeof val === 'string') parts.push(val);
          else if (Array.isArray(val)) parts.push(...val.map(String));
        }
      }
      const unique = Array.from(new Set(parts.filter(Boolean).map(String)));
      const searchBlob = unique.join(' ').toLowerCase();
      return {
        id: e.id,
        name: String(e.name ?? '').toLowerCase(),
        searchBlob,
        // keep specific fields indexed for fine-grained matches/sorting
        tags: (e.tags || []).map((t) => t.toLowerCase()),
        searchAliases: (e.searchAliases || []).map((t) => t.toLowerCase()),
        role: e.role ? String(e.role).toLowerCase() : undefined,
        gender: e.gender ? String(e.gender).toLowerCase() : undefined,
        nation: e.nation ? String(e.nation).toLowerCase() : undefined,
        bendingElement: (e as unknown as { bendingElement?: unknown }).bendingElement
          ? String((e as unknown as { bendingElement?: unknown }).bendingElement).toLowerCase()
          : undefined,
      };
    });
  }, [allEntities]);
  // Build a map for quick lookup by id
  const entityMapById = useMemo(() => {
    const map = new Map<string, EnrichedEntity>();
    allEntities.forEach((entity) => map.set(entity.id, entity));
    return map;
  }, [allEntities]);

  // 1. Create a memoized FlexSearch index (robust: includes searchBlob + key fields)
  const index = useMemo(() => {
    type IndexDoc = {
      id: string;
      name: string;
      searchBlob: string;
      nation?: string;
      role?: string;
      tags?: string[];
      searchAliases?: string[];
      bendingElement?: string;
      gender?: string;
    };
    const newIndex = new FlexSearch.Document<IndexDoc>({
      document: {
        id: 'id',
        index: [
          'name',
          'searchBlob',
          'nation',
          'role',
          'tags',
          'searchAliases',
          'bendingElement',
          'gender',
        ],
      },
      tokenize: 'forward',
    });
    indexDocs.forEach((doc) => newIndex.add(doc as IndexDoc));
    return newIndex;
  }, [indexDocs]);

  // 2. Perform the search and process the results.
  return useMemo(() => {
    if (!query) {
      return allEntities.map((entity) => ({ entity, matchedFields: [] }));
    }
    const qLower = query.toLowerCase();
    const searchResults = index.search(qLower, { enrich: true }) as Array<{ field: string; result: string[] }>;
    const resultMap = new Map<string, { entity: EnrichedEntity; matchedFields: MatchedField[] }>();
    searchResults.forEach((fieldResult) => {
      const fieldName = fieldResult.field;
      fieldResult.result.forEach((id: string) => {
        const record = entityMapById.get(id);
        if (!record) return;
        if (!resultMap.has(id)) {
          resultMap.set(id, {
            entity: record,
            matchedFields: [{ field: fieldName, token: query }],
          });
        } else {
          const existing = resultMap.get(id)!;
          existing.matchedFields.push({ field: fieldName, token: query });
        }
      });
    });

    // --- Partial tag matching ---
    // For 'male' and 'female' queries, skip partial tag matching entirely (only allow exact matches)
    const lowerQuery = query.toLowerCase();
    const skipPartialTagMatch = lowerQuery === 'male' || lowerQuery === 'female';
    if (!skipPartialTagMatch) {
      allEntities.forEach((entity) => {
        if (entity.tags && entity.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
          const existing = resultMap.get(entity.id);
          // Only add a partial match if an exact match for that same token doesn't already exist
          const hasExactTagOrAliasMatch = existing && existing.matchedFields.some(field =>
            (field.field === 'tags' || field.field === 'searchAliases') && field.token === query
          );
          if (!existing) {
            resultMap.set(entity.id, {
              entity,
              matchedFields: [{ field: 'partialTag', token: query }],
            });
          } else if (!hasExactTagOrAliasMatch) {
            // If already present, add partialTag to matchedFields if not already present
            if (!existing.matchedFields.some(mf => mf.field === 'partialTag' && mf.token === query)) {
              existing.matchedFields.push({ field: 'partialTag', token: query });
            }
          }
        }
      });
    }
    // --- End partial tag matching ---

    // --- Intent detection & synonym expansion for special queries ---
    const toLower = (v: unknown): string => (typeof v === 'string' ? v.toLowerCase() : '');
    const expandedOf = (e: EnrichedEntity): string => toLower((e as unknown as { expandedView?: unknown }).expandedView);
    const roleOf = (e: EnrichedEntity): string => toLower((e as unknown as { role?: unknown }).role);
    const narrativeOf = (e: EnrichedEntity): string => toLower((e as unknown as { narrativeFunction?: unknown }).narrativeFunction);
    const affiliationOf = (e: EnrichedEntity): string => {
      const aff = (e as unknown as { affiliation?: unknown }).affiliation;
      if (Array.isArray(aff)) return aff.map(String).join(' ').toLowerCase();
      if (typeof aff === 'string') return aff.toLowerCase();
      return '';
    };
    const lowerTagsSet = (e: EnrichedEntity): Set<string> => {
      const tags = new Set<string>((e.tags || []).map((t) => t.toLowerCase()));
      const tc = e.tagCategories || {};
      for (const arr of Object.values(tc)) {
        if (Array.isArray(arr)) arr.forEach((x) => tags.add(String(x).toLowerCase()));
      }
      return tags;
    };
    const hasAnyTag = (e: EnrichedEntity, tags: string[]): boolean => {
      const set = lowerTagsSet(e);
      return tags.some((t) => set.has(t));
    };
    const entityHasAnyTags = hasAnyTag;

    const isVillainIntent = qLower.includes('villain') || qLower.includes('antagonist');
    const isWhiteLotusIntent = qLower.includes('white lotus');

    if (isWhiteLotusIntent) {
      const lotusTags = [
        'order_of_the_white_lotus',
        'member_of_white_lotus',
        'white_lotus',
      ];
      const filtered = allEntities.filter((e) => {
        const role = (e as unknown as { role?: unknown }).role ? String((e as unknown as { role?: unknown }).role).toLowerCase() : '';
        const affiliation = (e as unknown as { affiliation?: unknown[] | undefined }).affiliation;
        const affiliationStr = Array.isArray(affiliation) ? affiliation.map(String).join(' ').toLowerCase() : '';
        const aliases = (e.searchAliases || []).map((a) => a.toLowerCase());
        const expanded = expandedOf(e);
        return (
          entityHasAnyTags(e, lotusTags) ||
          role.includes('lotus') ||
          affiliationStr.includes('white lotus') ||
          aliases.some((a) => a.includes('white lotus')) ||
          expanded.includes('order of the white lotus')
        );
      });
      // Merge into existing resultMap instead of replacing base results
      filtered.forEach((e) => {
        if (!resultMap.has(e.id)) {
          resultMap.set(e.id, { entity: e, matchedFields: [{ field: 'intent.whiteLotus', token: query }] });
        } else {
          const ex = resultMap.get(e.id)!;
          ex.matchedFields.push({ field: 'intent.whiteLotus', token: query });
        }
      });
    }

    if (isVillainIntent) {
      const villainTags = [
        'villain',
        'antagonist',
        'main_antagonist',
        'secondary_antagonist',
        'minor_antagonist',
        'tragic_villain',
        'book_1_villain',
        'book_2_villain',
        'book_3_villain',
        'original_antagonist',
        'stage_villain',
        'starter_villain',
      ];
      const filtered = allEntities.filter((e) => {
        const role = (e as unknown as { role?: unknown }).role ? String((e as unknown as { role?: unknown }).role).toLowerCase() : '';
        const narrative = (e as unknown as { narrativeFunction?: unknown }).narrativeFunction
          ? String((e as unknown as { narrativeFunction?: unknown }).narrativeFunction).toLowerCase()
          : '';
        const expanded = expandedOf(e);
        return (
          entityHasAnyTags(e, villainTags) ||
          role.includes('antagonist') ||
          narrative.includes('antagonist') ||
          narrative.includes('villain') ||
          expanded.includes('antagonist') ||
          expanded.includes('villain')
        );
      });
    // --- Dynamic Group Membership intent: any query that names a known group ---
    const groupLikeTypes = new Set(['group', 'religious_organization', 'service_organization']);
    const namedGroups = allEntities.filter((e) => groupLikeTypes.has((e as unknown as { type?: unknown }).type as string));
    const matchedGroups = namedGroups.filter((g) => qLower.includes(String(g.name || '').toLowerCase()));
    matchedGroups.forEach((group) => {
      const groupNameLower = String(group.name || '').toLowerCase();
      const groupSlugLower = String((group as unknown as { slug?: unknown }).slug || '').toLowerCase().replace(/-/g, ' ');
      const candidates = allEntities.filter((e) => {
        if (e.id === group.id) return true;
        const expanded = expandedOf(e);
        const role = roleOf(e);
        const affiliation = affiliationOf(e);
        const aliases = (e.searchAliases || []).map((a) => a.toLowerCase());
        const tagHit = hasAnyTag(e, [groupSlugLower.replace(/\s+/g, '_'), groupNameLower.replace(/\s+/g, '_')]);
        return (
          tagHit ||
          expanded.includes(groupNameLower) ||
          expanded.includes(groupSlugLower) ||
          role.includes(groupNameLower) ||
          affiliation.includes(groupNameLower) ||
          aliases.some((a) => a.includes(groupNameLower))
        );
      });
      candidates.forEach((e) => {
        if (!resultMap.has(e.id)) {
          resultMap.set(e.id, { entity: e, matchedFields: [{ field: 'intent.groupMembership', token: query }] });
        } else {
          resultMap.get(e.id)!.matchedFields.push({ field: 'intent.groupMembership', token: query });
        }
      });
    });

    // --- Bender intent: firebender/waterbender/earthbender/airbender/bender/nonbender ---
    const benderMap: Record<string, (e: EnrichedEntity) => boolean> = {
      firebender: (e) => toLower((e as unknown as { bendingElement?: unknown }).bendingElement) === 'fire' || hasAnyTag(e, ['firebender']),
      waterbender: (e) => toLower((e as unknown as { bendingElement?: unknown }).bendingElement) === 'water' || hasAnyTag(e, ['waterbender']),
      earthbender: (e) => toLower((e as unknown as { bendingElement?: unknown }).bendingElement) === 'earth' || hasAnyTag(e, ['earthbender']),
      airbender: (e) => toLower((e as unknown as { bendingElement?: unknown }).bendingElement) === 'air' || hasAnyTag(e, ['airbender']),
      bender: (e) => (e as unknown as { isBender?: unknown }).isBender === true || hasAnyTag(e, ['bender']),
      nonbender: (e) => (e as unknown as { isBender?: unknown }).isBender === false || hasAnyTag(e, ['nonbender']),
    };
    for (const [key, predicate] of Object.entries(benderMap)) {
      if (qLower.includes(key)) {
        allEntities.filter(predicate).forEach((e) => {
          if (!resultMap.has(e.id)) {
            resultMap.set(e.id, { entity: e, matchedFields: [{ field: `intent.${key}`, token: query }] });
          } else {
            resultMap.get(e.id)!.matchedFields.push({ field: `intent.${key}`, token: query });
          }
        });
      }
    }

    // --- Role archetype intents: hero/protagonist/mentor ---
    const roleIntentMap: Record<string, string[]> = {
      hero: ['hero', 'heroes', 'protagonist', 'main', 'main_cast', 'lead'],
      protagonist: ['protagonist', 'hero', 'lead', 'main', 'main_cast'],
      mentor: ['mentor', 'teacher', 'master'],
    };
    for (const [intentKey, tagList] of Object.entries(roleIntentMap)) {
      if (qLower.includes(intentKey)) {
        const filteredRole = allEntities.filter((e) => {
          const role = roleOf(e);
          const narrative = narrativeOf(e);
          const expanded = expandedOf(e);
          return (
            hasAnyTag(e, tagList) ||
            tagList.some((t) => role.includes(t) || narrative.includes(t) || expanded.includes(t))
          );
        });
        filteredRole.forEach((e) => {
          if (!resultMap.has(e.id)) resultMap.set(e.id, { entity: e, matchedFields: [] });
          resultMap.get(e.id)!.matchedFields.push({ field: `intent.${intentKey}`, token: query });
        });
      }
    }
      filtered.forEach((e) => {
        if (!resultMap.has(e.id)) {
          resultMap.set(e.id, { entity: e, matchedFields: [{ field: 'intent.villain', token: query }] });
        } else {
          const ex = resultMap.get(e.id)!;
          ex.matchedFields.push({ field: 'intent.villain', token: query });
        }
      });
    }

    // --- Broad tag match boosting and result sorting ---
    // Score: 5 = name match
    //        4 = exact tag match
    //        3 = gender+age/role match for gendered queries
    //        2 = main cast/primary role
    //        1 = partial tag match
    //        0 = other
    function getMatchPriority(matchedFields: MatchedField[]): number {
      if (matchedFields.some(f => f.field === 'name')) return 5;
      if (matchedFields.some(f => f.field === 'tags' || f.field === 'searchAliases')) return 4;
      if (matchedFields.some(f => f.field === 'gender' || f.field === 'role')) return 3;
      if (matchedFields.some(f => f.field === 'main')) return 2;
      if (matchedFields.some(f => f.field === 'partialTag')) return 1;
      return 0;
    }

    function getTagMatchScore(entity: EnrichedEntity): number {
      const lowerTags = (entity.tags || []).map(t => t.toLowerCase());
      const lowerAliases = (entity.searchAliases || []).map(a => a.toLowerCase());
      // 1. Exact tag or alias match
      if (lowerTags.includes(lowerQuery) || lowerAliases.includes(lowerQuery)) return 4;

      // 2. Gender+age/role match for gendered queries
      const genderedQueries = ['boy', 'girl', 'male', 'female'];
      if (genderedQueries.includes(lowerQuery)) {
        // Gender field match
        const gender = (entity.gender || '').toLowerCase();
        // Age/role: look for 'child', 'teen', 'kid', 'boy', 'girl' in tags or role
        const role = (entity.role || '').toLowerCase();
        const ageTags = ['child', 'teen', 'kid', 'boy', 'girl'];
        const hasAgeTag = lowerTags.some(tag => ageTags.includes(tag)) || ageTags.some(age => role.includes(age));
        if (
          (lowerQuery === 'boy' && gender === 'male' && hasAgeTag) ||
          (lowerQuery === 'girl' && gender === 'female' && hasAgeTag) ||
          (lowerQuery === 'male' && gender === 'male') ||
          (lowerQuery === 'female' && gender === 'female')
        ) {
          return 3;
        }
        // --- Exception: For 'male' and 'female', do NOT allow partial tag matches ---
        // Only exact matches for these queries
        return 0;
      }

      // 3. Main cast/primary role boost
      // Look for tags like 'protagonist', 'main', 'main_cast', 'lead', etc.
      const mainCastTags = ['protagonist', 'main', 'main_cast', 'lead'];
      if (lowerTags.some(tag => mainCastTags.includes(tag))) return 2;

      // 4. Partial tag match (except for 'male'/'female' queries, handled above)
      if (lowerTags.some(tag => tag.includes(lowerQuery))) return 1;

      // 5. Other
      return 0;
    }

    // Convert resultMap to array and sort by match priority, then tag match score, then fallback
    const resultsArr = Array.from(resultMap.values());
    resultsArr.sort((a, b) => {
      const aPriority = getMatchPriority(a.matchedFields);
      const bPriority = getMatchPriority(b.matchedFields);
      if (aPriority !== bPriority) return bPriority - aPriority; // Name > tag > gender/role > main > partial > other
      const aScore = getTagMatchScore(a.entity);
      const bScore = getTagMatchScore(b.entity);
      if (aScore !== bScore) return bScore - aScore;
      // Fallback: more matched fields = higher
      if (b.matchedFields.length !== a.matchedFields.length) return b.matchedFields.length - a.matchedFields.length;
      // Fallback: alphabetical by name
      if (a.entity.name && b.entity.name) return String(a.entity.name).localeCompare(String(b.entity.name));
      return 0;
    });
    // --- End broad tag match boosting and result sorting ---

    return resultsArr;
  }, [query, index, allEntities, entityMapById]);
} 