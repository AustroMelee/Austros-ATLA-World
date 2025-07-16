# 🏗️ Frontend Architecture & Logic (Updated & Current)

The frontend is architected around a clear separation of concerns, with a central container managing state and data flow to presentational components. The search system is now fully client-side for maximum robustness.

---

## 1. HomeContainer.tsx: The Central Orchestrator

This component is the "brain" of the main page. It is responsible for:

- **Data Fetching:** On initial load, it fetches the single data source for the entire app: `public/enriched-data.json`.
- **State Management:** It manages all primary UI state, including:
    - The user's current search query.
    - The `expandedCardId` to track which card is expanded into a modal.
- **Search Logic:** It calls the `useSearch` custom hook, passing it the full dataset and the current query.
- **Prop Drilling:** It passes the final search results and state handlers down to the presentational `<Home />` component.

---

## 2. Custom Hooks: The useSearch Hook

All complex search logic is now consolidated into a single, powerful hook.

- **`useSearch.ts`:**
    - Receives the complete array of character data and the search query.
    - **Client-Side Preprocessing:** Uses a preprocessor to create a `searchBlob` for each character, combining all searchable text fields (name, role, titles, tags, etc.) into one.
    - **Client-Side Indexing:** Uses FlexSearch to build a full-text search index in the browser based on the `searchBlob`. This is memoized (`useMemo`) to happen only once.
    - Returns a final, filtered array of characters based on the query. If the query is empty, it returns all characters.

---

## 3. Presentational Layer (Home.tsx)

This component is purely presentational. It receives all data and handlers as props from `HomeContainer`.

- Renders the main layout, including the `SearchBar` and the `EntityGrid`, passing the relevant props down.

---

## 4. Card Grid & Modal System (EntityGrid, ItemCard)

- **`EntityGrid.tsx`:**
    - Receives the array of search results and the `expandedCardId`.
    - Renders a responsive grid of `ItemCard` components.
    - Dynamically sets the `expanded` and `onExpand` props for each card based on whether its ID matches the `expandedCardId`.

- **`ItemCard.tsx`:**
    - Has two render states: collapsed (the grid card) and expanded (a full-screen modal).
    - **Expanded View:** When the `expanded` prop is true, it renders a responsive, full-screen modal overlay. This modal is self-contained and manages its own layout to fit any screen size without breaking the page. (See `docs/ui-components.md` for full styling details).

---

## 5. Filter & Collections Sidebars (Currently Disabled)

- **`FilterSidebar.tsx` & `CollectionsSidebar.tsx`:** These components are currently disabled in the UI. The old logic (`useFilters`, etc.) was removed during the search engine refactor. They can be re-integrated in the future by wiring them up to modify the main search query string in `HomeContainer`.

---

## 6. stringUtils.ts: Shared Utilities

- **Location:** `src/utils/stringUtils.ts`
- **Responsibility:** Contains general-purpose helper functions like `toTitleCase`. This file is unchanged and remains a stable utility.

---

## 7. Data Structure & Pipeline Adherence

To function correctly, the frontend relies on the data pipeline producing a complete `public/enriched-data.json`.

- Each record in this file must have all top-level fields required by the UI (e.g., `id`, `name`, `image`, `role`, `expandedView`).
- The data pipeline is responsible for "promoting" these UI fields from the raw markdown data to the top level of the final JSON records.
- See `docs/data pipeline.md` and `docs/troubleshooting.md` for canonical data structures and debugging steps.

---

This updated document accurately reflects the current state of the application after our refactoring work.