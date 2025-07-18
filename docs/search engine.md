# 🔍 Encyclopedia Search Engine: Client-Side Architecture (2024 Refactor)

## Overview

The search engine is now fully client-side, leveraging FlexSearch to build and query a full-text index in the user's browser. This eliminates build-time index errors and ensures the UI always works with the latest data.

---

## 1. Data Flow & Indexing

- **Source Data:** All data is authored in markdown, parsed and enriched into `public/enriched-data.json` by the data pipeline.
- **Frontend:**
  - On load, the app fetches `public/enriched-data.json`.
  - The `useSearch` hook (see `src/hooks/useSearch.ts`) receives the full data array and the user's query.
  - The hook uses a preprocessor (`src/search/preprocessor.ts`) to create a `searchBlob` for each record (concatenating all searchable fields).
  - FlexSearch builds an in-memory index on fields like `name`, `role`, `tags`, `searchAliases`, and the `searchBlob`.
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
    1. **Direct name match** (e.g., searching 'toph' puts Toph Beifong first if her name matches the query exactly).
    2. **Exact tag or alias match** (e.g., searching 'white lotus' matches any entry tagged `order_of_the_white_lotus`).
    3. **Gender/age/role match** for gendered queries (e.g., 'boy', 'girl', 'male', 'female' boost characters with matching gender and age/role).
    4. **Main cast/primary role** (e.g., tags like 'protagonist', 'main', 'main_cast', 'lead').
    5. **Partial tag match** (e.g., searching 'knife' matches 'knife_thrower').
    6. **Other matches** (fallback).
  - **Note:** As of July 2024, the search logic guarantees that any direct name match will always be ranked above all tag or partial tag matches, regardless of tag boosting or other factors. This ensures that searching for a character by name always returns the correct entity as the top result.
  - The logic is modular and can be extended for future improvements.

- **Partial Tag Matching:**
  - The search engine supports partial tag matching: if a query is a substring of a tag, the entity will be included in results (e.g., 'knife' matches 'knife_thrower').
  - However, exact matches are always prioritized above partials.
  - **Exception:** For mutually exclusive queries like 'male' and 'female', partial tag matching is completely skipped—only exact matches are allowed. This prevents 'female' from matching 'male' as a substring, and vice versa. All other queries retain partial tag matching as before.
  - This makes the search both flexible and precise, supporting discovery and typo-tolerance while keeping the most relevant results at the top.

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

