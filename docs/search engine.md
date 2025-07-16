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
  - FlexSearch builds an in-memory index on fields like `name`, `role`, `tags`, and the `searchBlob`.
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

## 3. Debugging & Extending Search

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

