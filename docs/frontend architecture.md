# 🏗️ Frontend Architecture & Logic (2024 Refactor)

The frontend is organized around a clear separation of concerns, with a central container managing state and data flow to presentational components. The search system is now fully client-side for maximum robustness and transparency.

---

## 1. HomeContainer.tsx: The Central Orchestrator

- **Data Fetching:** On initial load, fetches `public/enriched-data.json` (the only data file used by the app) using the `useEnrichedData` hook.
- **State Management:** Manages the user's search query and the `expandedCardId` for modal views.
- **Search Logic:** Calls the `useSearch` hook, passing the full dataset and the current query.
- **Prop Drilling:** Passes the final search results and state handlers down to the presentational `<Home />` component.

---

## 2. Custom Hooks: useSearch, useEnrichedData, useImageFallback

- **`useSearch.ts`:**
  - Receives the complete array of data and the search query.
  - Uses a preprocessor to create a `searchBlob` for each record (combining all searchable fields).
  - Builds a FlexSearch index in-browser, memoized for performance.
  - Returns a filtered array of results for the UI.
- **`useEnrichedData.ts`:**
  - Fetches and manages the enriched data from the API endpoint, with robust error handling and loading state.
- **`useImageFallback.ts`:**
  - Manages image loading, error fallback, and status for entity images, providing a robust fallback for missing or broken images.

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
  - Uses the `useImageFallback` hook for robust image handling.

---

## 5. Data Structure & Pipeline Adherence

- The frontend relies on `public/enriched-data.json` having all top-level fields required by the UI (e.g., `id`, `name`, `image`, `role`, `expandedView`).
- The data pipeline is responsible for promoting these fields from the raw markdown data.
- See `docs/data pipeline.md` and `docs/troubleshooting.md` for canonical data structures and debugging steps.

---

## 6. DOM & HTML Structure

The application renders a modern, accessible, and responsive DOM structure, optimized for clarity and maintainability. The main elements and their roles are as follows:

- **Root Container:**
  - `<div id="root">` wraps the entire React app.
  - The main app content is inside a flex column with `min-h-screen` and dark background classes for full-viewport coverage.

- **Navigation Bar:**
  - `<nav>` at the top, styled with Tailwind for background, border, and spacing.
  - Contains the project title and navigation links (Search, Characters, Bending, Locations, Fauna, Food, Spirit World), each styled for accessibility and keyboard navigation.

- **Main Content:**
  - The main area uses a flex column layout.
  - The search section includes a form with a large, styled input for queries, and a clear button with ARIA label for accessibility.

- **Entity/Card Grid:**
  - Results are displayed in a responsive flex grid (`flex-wrap`, `gap-4`, `justify-center`).
  - Each card is a `<div>` with role="button" and ARIA labels for screen readers, supporting keyboard navigation and expansion.
  - Cards use Tailwind for rounded corners, borders, background gradients, and drop shadows.
  - Images are wrapped in containers with fallback backgrounds and border styling. If an image fails to load, a fallback is provided by the `useImageFallback` hook.
  - Card overlays (e.g., role badges) use semi-transparent backgrounds and strong contrast for readability.

- **Accessibility:**
  - All interactive elements have ARIA roles and labels.
  - Modals and overlays use focus trapping and keyboard navigation, managed by custom hooks.
  - Color contrast and font sizes are tuned for readability.

- **Styling:**
  - All layout and visual styles are handled via Tailwind CSS utility classes, with custom properties for nation colors and backgrounds.
  - Custom fonts are loaded via `@font-face` and applied to key UI elements.

- **Responsiveness:**
  - The layout adapts to all screen sizes, with larger tap targets and scrollable overlays for mobile devices.

This structure ensures a robust, accessible, and visually consistent UI, with clear mapping between React components and the rendered DOM. For further details, inspect the live DOM or refer to the raw extract in `docs/reports/dom data.txt`.