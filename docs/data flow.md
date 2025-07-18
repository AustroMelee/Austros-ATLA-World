# Data Flow (Current as of 2024-07)

## 1. Data Source and Pipeline

- Data originates from markdown files in `raw-data/` (see `docs/data pipeline.md`).
- These are parsed and enriched by scripts into a single, comprehensive JSON file: `public/enriched-data.json`. This is the only data file the frontend consumes.

---

## 2. Frontend Data Flow

### a. Data Fetching and Client-Side Indexing

**File:** `src/pages/HomeContainer.tsx`

- On initial load, the application fetches the entire `public/enriched-data.json` file using the `useEnrichedData` hook and stores it in state.
- It manages the user's search query and the `expandedCardId` for the modal view.
- It passes the full dataset and the query to the `useSearch` hook.

**File:** `src/hooks/useSearch.ts`

- This is the core of the search logic. It receives all entity data.
- **Preprocessing:** Uses a preprocessor to create a `searchBlob` for each entity by combining all searchable text fields (name, role, titles, tags, etc.).
- **Client-Side Indexing:** Builds a FlexSearch index in the browser using the preprocessed data. This is memoized to only happen once per session.
- Performs searches against this in-memory index and returns the filtered results.

### b. Presentational Layer

**File:** `src/pages/Home.tsx`

- Receives the final search results from `HomeContainer`.
- Is a purely presentational component that renders the main layout and passes data down to the `EntityGrid`.

### c. Card Grid

**File:** `src/components/EntityGrid/EntityGrid.tsx`

- Receives an array of search results and the `expandedCardId`.
- Maps over the items and renders an `ItemCard` for each.
- Dynamically sets the `expanded` and `onExpand` props for each card to manage the modal view.
- **Matrix Integration (2025):** Uses `bg-transparent` to allow Matrix rain to flow through gaps between cards.

### d. Card Component & Modal

**File:** `src/components/ItemCard/ItemCard.tsx`

- Receives a single entity object (`item`) and the `expanded` boolean.
- If `expanded` is false: Renders the small, collapsed grid card.
- If `expanded` is true: Renders a full-screen, responsive modal overlay containing the detailed entity view with a large image and scrollable text.
- **Matrix Transparency (2025):** Removed `bg-background` to prevent grey boxes blocking Matrix rain.
- **Type:** `EnrichedEntity` (defined in `src/search/types.ts`)
- Contains all top-level fields needed for display: `name`, `nation`, `role`, `slug`, `expandedView`, `image`, etc.
- Uses the `useImageFallback` hook for robust image handling.

### e. Background Effects & Layout

**File:** `src/components/Layout.tsx`
- Main application layout wrapper that includes the new Matrix Rain background.
- Manages overall application structure and responsive behavior.

**File:** `src/components/MatrixRain/MatrixRain.tsx` (NEW 2025)
- Canvas-based Matrix digital rain effect with authentic movie-style characteristics.
- **Authentic Characters:** Uses Japanese Katakana and binary characters for true Matrix aesthetic.
- **True Randomness:** Every character is randomly generated each frame (not predetermined sequences).
- **Performance Optimized:** 30fps animation with efficient Canvas rendering and hardware acceleration.
- **Responsive Design:** Auto-calculates column count based on screen width.
- **Progressive Fade:** Dual-layer rendering with optimized fade opacity to prevent background pollution.

**File:** `src/components/ThemedCard/ThemedCard.tsx`
- Styled wrapper that applies nation-specific border colors to cards.
- **Glassmorphism Effects (2025):** Semi-transparent backgrounds with backdrop blur for depth.
- **Matrix Glow on Hover:** CRT green glow effects using multiple box-shadow layers.
- **Nation Border Enhancement:** Maintains nation-specific colors while adding Matrix green overlay.

---

## 3. Summary of File Involvement

- **Data pipeline:** `docs/data pipeline.md`, scripts in `/scripts/` (`1-parse-markdown.mjs`, `2-enrich-data.mjs`).
- **Type definitions:** `src/types/domainTypes.ts`, `src/search/types.ts`.
- **Data fetching/state:** `src/pages/HomeContainer.tsx`, `src/hooks/useEnrichedData.ts`.
- **Search Logic:** `src/hooks/useSearch.ts`, `src/search/preprocessor.ts`.
- **Presentational:** `src/pages/Home.tsx`.
- **Grid & Card:** `src/components/EntityGrid/EntityGrid.tsx`, `src/components/ItemCard/ItemCard.tsx`.
- **Matrix Rain & Effects (2025):** `src/components/MatrixRain/MatrixRain.tsx`, `src/components/Layout.tsx`.
- **Glassmorphism Styling:** `src/components/ThemedCard/ThemedCard.tsx`, `src/styles/custom.css`.
- **Styling/utility:** `src/components/CustomMarkdownRenderer.tsx`, `src/components/NationIcon/NationIcon.tsx`, `src/utils/stringUtils.ts`.

**In short:**
Data flows from `enriched-data.json` → fetched by `HomeContainer` (via `useEnrichedData`) → indexed and filtered by the `useSearch` hook in the browser → passed to `Home` → rendered as a grid in `EntityGrid` → each card is an `ItemCard` which can expand into a full-screen modal. **NEW (2025):** The entire interface is overlaid with an authentic Matrix digital rain effect that flows through transparent glassmorphism cards, creating a cohesive cyberpunk terminal aesthetic.

---

## 4. Data Schema Adherence & Template Guidance

- All data displayed in the frontend must originate from records in `public/enriched-data.json` that strictly follow the canonical schema described in `docs/data pipeline.md`.
- The enrichment script (`2-enrich-data.mjs`) is responsible for "promoting" all necessary UI fields (e.g., image, role, nation) to the top level of each record.
- Always validate new or edited markdown data by running `npm run build:data` and checking for errors before expecting changes in the UI.

