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
  // Build a map for quick lookup by id
  const entityMapById = useMemo(() => {
    const map = new Map<string, EnrichedEntity>();
    allEntities.forEach((entity) => map.set(entity.id, entity));
    return map;
  }, [allEntities]);

  // 1. Create a memoized FlexSearch index.
  const index = useMemo(() => {
    const newIndex = new FlexSearch.Document<EnrichedEntity>({
      document: {
        id: 'id',
        index: [
          'name',
          'nation',
          'role',
          'tags',
          'searchAliases',
          'bendingElement',
        ],
      },
      tokenize: 'forward',
    });
    allEntities.forEach((entity) => {
      newIndex.add({ ...entity });
    });
    return newIndex;
  }, [allEntities]);

  // 2. Perform the search and process the results.
  return useMemo(() => {
    if (!query) {
      return allEntities.map((entity) => ({ entity, matchedFields: [] }));
    }
    const searchResults = index.search(query, { enrich: true }) as Array<{ field: string; result: string[] }>;
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