# 🔍 Encyclopedia Search Engine: Client-Side Architecture (2024 Refactor)

## Overview

The search engine is now fully client-side, leveraging FlexSearch to build and query a full-text index in the user's browser. This eliminates build-time index errors and ensures the UI always works with the latest data.

---

## 1. Data Flow & Indexing

- **Source Data:** All data is authored in markdown, parsed and enriched into `public/enriched-data.json` by the data pipeline.
- **Frontend:**
  - On load, the app fetches `public/enriched-data.json`.
  - The `useSearch` hook (see `src/hooks/useSearch.ts`) receives the full data array and the user's query.
  - The hook builds a comprehensive `searchBlob` per entity, including: name, description/summary, role, nation, gender, tags, searchAliases, affiliations, titles, tagCategories, all metadata strings/arrays, and expandedView text.
  - FlexSearch builds an in-memory index on `name`, `searchBlob`, and key fields (`nation`, `role`, `tags`, `searchAliases`, `bendingElement`, `gender`).
  - Intent-aware augmentation merges additional matches for queries like "white lotus", "villain/antagonist", group names, bender types, and role archetypes.
  - All searching and filtering is performed in-browser, with results mapped back to the full entity objects for display.

---

## 2. Key Files & Responsibilities

- **`src/hooks/useSearch.ts`:**
  - Orchestrates client-side indexing and searching.
  - Memoizes the index for performance.
  - Returns results in the format expected by the UI.
- **`src/search/preprocessor.ts`:**
  - Defines which fields are included in the `searchBlob`.
  - To add a new searchable field, add it to the `textParts` array in `createSearchBlob`.
- **`public/enriched-data.json`:**
  - The only data file used by the frontend. If a record is present here, it will be indexed and searchable.

---

## 3. Result Ordering & Tag Matching Logic (2024 Update)

- **Result Hierarchy:**
  - Results are ordered by a robust scoring system:
    1. **Direct name match**
    2. **Exact tag or alias match**
    3. **Gender/age/role match** for gendered queries (boy/girl/male/female)
    4. **Main cast/primary role**
    5. **Partial tag match** (e.g., 'knife' matches 'knife_thrower'; skipped for 'male'/'female')
    6. **Other matches** (fallback).
  - **Note:** As of July 2024, the search logic guarantees that any direct name match will always be ranked above all tag or partial tag matches, regardless of tag boosting or other factors. This ensures that searching for a character by name always returns the correct entity as the top result.
  - The logic is modular and can be extended for future improvements.

- **Partial Tag Matching:**
  - Partial tag matching is enabled (e.g., 'knife' matches 'knife_thrower').
  - Exact matches are prioritized above partials.
  - **Exception:** For 'male' and 'female', partial tag matching is skipped entirely to avoid cross-matches.
  - Balances discovery with precision; still ranks name and exact tags first.

### 3.1 Intent-Aware Augmentations (2025)

- White Lotus queries add the group and all members via tags (`order_of_the_white_lotus`, `member_of_white_lotus`, `white_lotus`), role/affiliation, aliases, and expandedView mentions.
- Villain/Antagonist queries add characters via tags, `narrativeFunction`, `role`, and expandedView mentions.
- Group-name queries add likely members based on tags, role/affiliation, aliases, and expandedView mentions.
- Bender intents: `firebender`, `waterbender`, `earthbender`, `airbender`, `bender`, `nonbender`.
- Role archetypes: `hero`, `protagonist`, `mentor`.

---

## 4. Debugging & Extending Search

- **To add a new searchable field:**
  - Update `createSearchBlob` in `preprocessor.ts` to include the new field.
  - Rebuild the data pipeline and refresh the app.
- **To debug missing results:**
  - Check that the field is present in `enriched-data.json`.
  - Add a `console.log` in `preprocessor.ts` to inspect the `searchBlob` for a specific record.
  - Ensure the FlexSearch index in `useSearch.ts` includes the field.

---

## 4. Rationale & Benefits

- **No Pre-Built Index:** All indexing is done in-browser, eliminating a class of build-time errors.
- **Single Source of Truth:** The frontend relies only on `public/enriched-data.json`.
- **Performance:** Indexing is memoized and only happens once per session; searches are instant.
- **Maintainability:** To change search behavior, update the preprocessor or the index fields in `useSearch.ts`.

## Performance Considerations

### Search Performance
- FlexSearch index is built once on component mount and memoized
- Search results are cached and only recomputed when query or data changes
- Large datasets (>1000 items) may experience initial indexing delay
- Consider implementing virtual scrolling for very large result sets

### Matrix Rain Integration
- Matrix Rain uses `requestAnimationFrame` for smooth 60fps animation
- When modals are open, rain effect reduces intensity (3x frame skip, dimmed colors)
- Search interactions don't affect rain performance due to separate rendering contexts
- Canvas rendering is hardware-accelerated and doesn't interfere with search operations

