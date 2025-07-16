# 🔍 Encyclopedia Search Engine: Architecture & Workflow (v2 - Client-Side)

## Overview

The search engine is architected for maximum robustness and performance by leveraging a **client-side indexing strategy**. All data processing and index creation happens directly in the user's browser, eliminating build-step failures and ensuring the UI always has access to the most complete, up-to-date data.

---

## 1. **Data Pipeline & Source**

- **Source Data:** All character data originates from markdown files in `raw-data/` which are parsed and enriched by the data pipeline scripts (`scripts/1-parse-markdown.mjs`, `scripts/2-enrich-data.mjs`).
- **Final Data File:** The pipeline's sole output for the frontend is **`public/enriched-data.json`**. This single file contains an array of all enriched character records, including all fields needed for both UI display (`name`, `image`, `role`) and for searching.
- **No Pre-Built Index:** The project intentionally **does not** ship a pre-built search index file (`search-index.json`). This avoids build-time dependency issues and ensures the client always works with the raw, complete data.

---

## 2. **Frontend Data Flow & Indexing**

The entire search process is managed within the React application upon loading.

#### **a. Data Fetching (`src/pages/HomeContainer.tsx`)**
- On initial load, the `HomeContainer` component fetches the entire `public/enriched-data.json` file.
- This array of `EnrichedEntity` objects is stored in the component's state and serves as the single source of truth for the entire application session.

#### **b. Preprocessing (`src/search/preprocessor.ts`)**
- The raw `EnrichedEntity` array is passed to the `preprocessEntities` function.
- This function iterates through each record and creates a new, massive searchable string called the **`searchBlob`**.
- The `searchBlob` concatenates all relevant text fields (`name`, `summary`, `role`, `titles`, `tags`, etc.) into a single, lowercase string. This ensures that a search for a term like "princess" will find a match regardless of which field it originally appeared in.

#### **c. Index Creation & Search (`src/hooks/useSearch.ts`)**
- The `useSearch` hook receives the array of all entities and the user's current search query.
- **Index Building (Client-Side):**
    - Inside a `useMemo`, the hook takes the preprocessed data (with the `searchBlob`) and uses `FlexSearch` to build a document index *in the browser*.
    - This index is configured to be searchable on the `name` and `searchBlob` fields.
    - This indexing process happens only once per application session, making subsequent searches instantaneous.
- **Search Execution:**
    - When a user types a query, the hook uses the in-memory FlexSearch index to find all matching record IDs.
    - It then maps these IDs back to the full entity objects from the original data array.
    - If the query is empty, it returns all entities to populate the initial grid view.

---

## 3. **Component Interaction**

- **`HomeContainer.tsx`:** Orchestrates the data fetching and calls `useSearch`.
- **`Home.tsx`:** A presentational component that receives the final search results (an array of character objects) and passes them to the grid.
- **`EntityGrid.tsx` & `ItemCard.tsx`:** Render the grid and the individual cards based on the data received.

---

## 4. **Key Principles & Rationale**

- **Robustness over Build-Time Optimization:** By performing all indexing on the client, we completely eliminate a class of silent build-step errors (e.g., an empty index file) that are difficult to debug.
- **Single Source of Truth:** The frontend relies *only* on `public/enriched-data.json`. If a character is in that file, they will be searchable.
- **Performance:** `useMemo` ensures the expensive preprocessing and indexing steps run only once. All subsequent searches against the in-memory index are extremely fast.
- **Maintainability:** The entire search logic is self-contained within the frontend (`preprocessor.ts`, `useSearch.ts`), making it easy to modify or debug. To add a new searchable field, you only need to add it to the `createSearchBlob` function in `preprocessor.ts`.

