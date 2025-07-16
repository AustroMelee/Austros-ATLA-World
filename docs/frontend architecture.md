# 🏗️ Frontend Architecture & Logic (2024 Refactor)

The frontend is organized around a clear separation of concerns, with a central container managing state and data flow to presentational components. The search system is now fully client-side for maximum robustness and transparency.

---

## 1. HomeContainer.tsx: The Central Orchestrator

- **Data Fetching:** On initial load, fetches `public/enriched-data.json` (the only data file used by the app).
- **State Management:** Manages the user's search query and the `expandedCardId` for modal views.
- **Search Logic:** Calls the `useSearch` hook, passing the full dataset and the current query.
- **Prop Drilling:** Passes the final search results and state handlers down to the presentational `<Home />` component.

---

## 2. Custom Hooks: useSearch

- **`useSearch.ts`:**
  - Receives the complete array of data and the search query.
  - Uses a preprocessor to create a `searchBlob` for each record (combining all searchable fields).
  - Builds a FlexSearch index in-browser, memoized for performance.
  - Returns a filtered array of results for the UI.

---

## 3. Presentational Layer (Home.tsx)

- Purely presentational; receives all data and handlers as props from `HomeContainer`.
- Renders the main layout, including the `SearchBar` and the `EntityGrid`.

---

## 4. Card Grid & Modal System

- **`EntityGrid.tsx`:**
  - Receives the array of search results and the `expandedCardId`.
  - Renders a responsive grid of `ItemCard` components.
  - Dynamically sets the `expanded` and `onExpand` props for each card.
- **`ItemCard.tsx`:**
  - Renders both the collapsed grid card and the full-screen expanded modal view.
  - Expanded view is a modal overlay, fully responsive and accessible.

---

## 5. Disabled/Legacy Features

- **FilterSidebar, CollectionsSidebar, etc.:** These components are currently disabled. The old logic was removed during the search refactor. To re-enable, restore the original export in the component file.

---

## 6. Data Structure & Pipeline Adherence

- The frontend relies on `public/enriched-data.json` having all top-level fields required by the UI (e.g., `id`, `name`, `image`, `role`, `expandedView`).
- The data pipeline is responsible for promoting these fields from the raw markdown data.
- See `docs/data pipeline.md` and `docs/troubleshooting.md` for canonical data structures and debugging steps.