# 🔍 Encyclopedia Search Engine: Architecture & Workflow

## Overview

The search engine powers all search and discovery features in the encyclopedia. It is designed for instant, full-text, and faceted search across all data types (characters, locations, etc.), with support for personalization and advanced filtering.

---

## 1. **Indexing & Data Pipeline**

- **Source Data:** Authored in markdown (`raw-data/`), parsed and enriched via scripts, then exported as a JSON search index (`public/search-index.json`).
- **Index Format:** Uses [FlexSearch](https://github.com/nextapps-de/flexsearch) (client-side, in-browser) for high-performance, full-text search.
- **Indexed Fields:** Name, description, tags, synonyms, nation, bending element, archetype, moral alignment, gender, and a flattened tag field for comprehensive tag search.

---

## 2. **Core Search Engine Implementation**

### **File:** `src/search/ClientSearchEngine.ts`

#### **Initialization**
- Loads and parses `public/search-index.json` on first use.
- Builds a FlexSearch Document index with all enriched records.
- Stores a `recordMap` for fast lookup by slug.

#### **Indexing Logic**
- All string fields are lowercased for normalization.
- Character-specific fields (e.g., nation, bendingElement, archetype, gender) are indexed.
- All tags from `tagCategories` are flattened into a single searchable array.

#### **API**
- `init()`: Loads and builds the index (idempotent).
- `search(query: string)`: Returns ranked results for a query (see below).
- `getAllByType(type)`: Returns all records of a given type (e.g., all characters).
- `getEntityBySlug(slug)`: Returns a single record by slug.

#### **Search Logic**
- Normalizes and tokenizes the query.
- Runs FlexSearch across all indexed fields.
- Deduplicates results by slug.
- If no results, falls back to substring matching on name/slug.
- Returns an array of enriched records.

---

## 3. **Query Parsing & Filtering**

### **File:** `src/search/QueryParser.ts`

- Parses natural language queries into structured filters (e.g., type, tag, name).
- Recognizes keywords for types (character, location, food, etc.) and tags (elements, colors, etc.).
- Extensible for more complex logic (AND/OR, ranges, etc.).

---

## 4. **Personalization & Recent Searches**

### **File:** `src/search/PersonalizationEngine.ts`

- Tracks recent search queries and "boosted" (favorited) slugs in `localStorage`.
- API:
  - `getRecentSearches()`, `addRecentSearch(query)`
  - `getBoostedSlugs()`, `boostSlug(slug)`, `unboostSlug(slug)`
  - `clearAll()`
- Used to personalize suggestions and ranking (future extensibility).

---

## 5. **Frontend Integration**

### **a. Search Hook**

#### **File:** `src/hooks/useAustrosSearch.ts`
- Debounces user input.
- Calls `ClientSearchEngine.search()` with the debounced query.
- Returns: `results`, `topHit`, `loading`, `error`.

#### **File:** `src/hooks/useSearchHandler.ts`
- Manages the search query state.
- Uses `useAustrosSearch` for results.
- Uses `useSuggestions` for query suggestions.
- Uses `useNationColor` for UI theming.

### **b. UI Flow**

- User types in the `SearchBar` (`src/components/SearchBar.tsx`).
- Query state is managed in `HomeContainer` via `useSearchHandler`.
- Results are passed to `EntityGrid` and rendered as cards.

---

## 6. **Index File Structure**

### **File:** `public/search-index.json`
- Contains:
  - `index`: FlexSearch-serialized index data.
  - `records`: Map of slug → enriched record (all fields for display).

---

## 7. **Extensibility & Customization**

- **Add new fields:** Update `buildIndexableRecord` in `ClientSearchEngine.ts` and the FlexSearch index config.
- **Advanced filtering:** Extend `QueryParser.ts` and UI filter logic.
- **Personalization:** Expand `PersonalizationEngine.ts` for more ranking/suggestion features.

---

## 8. **Error Handling & Edge Cases**

- If the index fails to load, errors are logged and surfaced in the UI.
- If no results are found, falls back to substring matching.
- All search is case-insensitive and tolerant to partial matches.

---

## 9. **Performance**

- All search is performed client-side for instant results.
- Index is loaded once per session and cached in memory.
- Debouncing prevents excessive queries on rapid input.

---

## 10. **Key Files Involved**

- `src/search/ClientSearchEngine.ts` (core logic)
- `src/search/QueryParser.ts` (query parsing)
- `src/search/PersonalizationEngine.ts` (personalization)
- `src/hooks/useAustrosSearch.ts`, `src/hooks/useSearchHandler.ts` (frontend integration)
- `public/search-index.json` (data)
- `docs/data pipeline.md` (pipeline overview)

