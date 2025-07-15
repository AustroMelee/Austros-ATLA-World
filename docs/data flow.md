### 1. **Data Source and Pipeline**
- Data originates from markdown files in `raw-data/` (see `docs/data pipeline.md`).
- These are parsed, enriched, and indexed into JSON (e.g., `public/enriched-characters.json`).

---

### 2. **Frontend Data Flow**

#### **a. Data Fetching and State Management**
- **File:** `src/pages/HomeContainer.tsx`
  - Uses `useSearchHandler` and `useFilters` hooks to fetch, filter, and manage character data.
  - Calls `ClientSearchEngine.getAllByType<EnrichedCharacter>('character')` to get all character records.
  - Passes filtered results and handlers as props to the presentational `Home` component.

#### **b. Presentational Layer**
- **File:** `src/pages/Home.tsx`
  - Receives all data and handlers as props.
  - Renders the `EntityGrid` component, passing the filtered character results.

#### **c. Card Grid**
- **File:** `src/components/EntityGrid/EntityGrid.tsx`
  - Receives an array of `EnrichedRecord` (usually `EnrichedCharacter`) as `items`.
  - Maps over `items` and renders an `ItemCard` for each, passing the data as the `item` prop.

#### **d. Card Component**
- **File:** `src/components/ItemCard/ItemCard.tsx`
  - Receives a single `EnrichedCharacter` as `item`.
  - Displays:
    - Character image (with fallback logic)
    - Name (using `toTitleCase`)
    - Nation icon (if present)
    - Role (if present)
    - Card/expanded view content (uses `CustomMarkdownRenderer` for markdown)
    - Handles click/expand logic

- **Type:** `EnrichedCharacter` (defined in `src/types/domainTypes.ts`)
  - Contains all fields needed for display: `name`, `nation`, `role`, `slug`, `expandedView`, `image`, etc.

#### **e. Supporting Components**
- `ThemedCard` (for card styling)
- `NationIcon` (for nation badge)
- `CustomMarkdownRenderer` (for rendering markdown in expanded view)

---

### 3. **Summary of File Involvement**
- **Data pipeline:** `docs/data pipeline.md`, scripts in `/scripts/`
- **Type definitions:** `src/types/domainTypes.ts`
- **Data fetching/state:** `src/pages/HomeContainer.tsx`, hooks in `src/hooks/`
- **Presentational:** `src/pages/Home.tsx`
- **Grid:** `src/components/EntityGrid/EntityGrid.tsx`
- **Card:** `src/components/ItemCard/ItemCard.tsx`
- **Styling/utility:** `src/components/ThemedCard/ThemedCard.tsx`, `src/components/NationIcon/NationIcon.tsx`, `src/components/CustomMarkdownRenderer.tsx`, `src/utils/stringUtils.ts`

---

**In short:**  
Data flows from enriched JSON (built from markdown) → fetched and filtered in `HomeContainer` → passed to `Home` → rendered as a grid in `EntityGrid` → each card is an `ItemCard` displaying the character’s info.

