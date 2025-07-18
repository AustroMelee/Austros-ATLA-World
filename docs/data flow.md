# Data Flow (Current as of 2025-01-18)

## 1. Data Source and Pipeline

- Data originates from markdown files in `raw-data/` (see `docs/data pipeline.md`).
- These are parsed and enriched by scripts into a single, comprehensive JSON file: `public/enriched-data.json`. This is the only data file the frontend consumes.
- **NEW (2025):** Template files in `templates/` subdirectories are automatically excluded from processing.

---

## 2. Frontend Data Flow

### a. Data Fetching and Client-Side Indexing

**File:** `src/pages/HomeContainer.tsx`

- On initial load, the application fetches the entire `public/enriched-data.json` file using the `useEnrichedData` hook and stores it in state.
- It manages the user's search query and the `expandedCardId` for the modal view.
- It passes the full dataset and the query to the `useSearch` hook.

**File:** `src/hooks/useSearch.ts`

- This is the core of the search logic. It receives all entity data.
- **Preprocessing:** Uses a preprocessor to create a `searchBlob` for each entity by combining all searchable text fields (name, role, titles, tags, ageRange, etc.).
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

### f. Enhanced Multi-Layered Filtering System (2025 Update)

**File:** `src/pages/HomeContainer.tsx`
- Implements the sequential filtering pipeline: Collections → Nations → Categories → Subcategories → Search
- **Nation Filtering:** Uses partial string matching to handle full nation names ("Fire Nation", "Earth Kingdom") with single-word filter buttons ("fire", "earth")
- **Core Filtering:** Maps filter names to entity types (characters → character, locations → location, groups → group)
- **Sub-Filtering:** Applies comprehensive filtering with mapping system and multi-field coverage
- **Sub-Filter Mapping:** Translates filter button terms to data values (e.g., "villains" → "antagonist", "heroes" → "protagonist", "deuteragonist", "mentor")
- **Multi-Field Coverage:** Checks tags array, role field, narrativeFunction, and eraAppearances roles
- **State Management:** Maintains active filter states using React hooks and Set objects
- **Age Range Filtering:** Filters by ageRange field (child, teen, young adult, adult, elder) with animal exclusion logic
- **Gender Filtering:** Filters by gender field with male/female symbols using React icons
- **Bender Filtering:** Filters by isBender and bendingElement fields for bender/nonbender classification

**File:** `src/components/Filters/FilterBar.tsx`
- Renders the multi-layered filtering interface with Matrix-themed styling
- **Nations:** Multi-select buttons for Fire, Water, Earth, Air nations using PNG images
- **Nation Images:** Uses custom PNG images from `public/assets/images/` (air_nation.png, water_nation.png, earth_nation.png, fire_nation.png)
- **Categories:** Single-select buttons for main entity types (Characters, Groups, Locations, Foods, Fauna, Spirits)
- **Subcategories:** Dynamic multi-select buttons that appear when a category is selected
- **Age Ranges:** Child, teen, young adult, adult, elder filters for characters
- **Gender Filters:** Male/female filters with React icon symbols
- **Bender Filters:** Bender/nonbender filters for character classification
- **Responsive Design:** Uses flex-wrap layout for adaptive button arrangement

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

## 3. Data Schema Updates & Character Classification

### Age Range Classification
- **Child:** Characters like Toph (12 years old during main series)
- **Teen:** Characters like Aang, Katara, Sokka, Zuko (12-17 years old)
- **Young Adult:** Characters like Azula, Ty Lee, Mai (18-25 years old)
- **Adult:** Characters like June, Iroh, Pakku (26-50 years old)
- **Elder:** Characters like Hama, King Bumi, Monk Gyatso (50+ years old)
- **Animal Exclusion:** Animals (bison, lemur, bear, animal, spirit) are excluded from age filters

### Gender Classification
- **Male:** Characters with gender: "male" field
- **Female:** Characters with gender: "female" field
- **Visual Indicators:** React icons (♂/♀) for clear visual distinction

### Bender Classification
- **Bender:** Characters with isBender: true and bendingElement field
- **Nonbender:** Characters with isBender: false or missing bendingElement
- **Comprehensive Coverage:** All characters now have proper bender classification

### Data Pipeline Improvements (2025 Update)
- **Identity Flattening:** Updated parsing script to flatten identity object fields
- **Tag Dictionary:** Added missing tags like "the_waterbending_master" to tag dictionary
- **Field Validation:** Ensured all characters have required fields for proper filtering
- **Template Exclusion:** Automatic exclusion of template files from data processing
- **Expanded View Processing:** Enhanced parsing of ```md blocks for expanded content
- **Image Path Validation:** Verification that image paths match actual files
- **JSON Syntax Validation:** Removal of trailing commas and syntax errors

### New Data Types (2025 Update)

#### Groups (`type: group`)
- **Location:** `raw-data/groups/`
- **Total:** 12 groups
- **Features:** Organizational profiles with leadership, membership, and historical data
- **Groups:** Dai Li, Order of the White Lotus, Team Avatar, Water Tribe Military, Fire Nation Military, Earth Kingdom Military, Si Wong Tribes, Kyoshi Warriors, Freedom Fighters, Yuyan Archers, Rough Rhinos, Southern Raiders
- **UI Integration:** Dynamic type labels show "Group" instead of "Character"
- **Filter Integration:** Groups appear when "Groups" filter is selected

#### Foods (`type: food`)
- **Location:** `raw-data/foods/`
- **Features:** Culinary data with ingredients, cultural significance, and regional information

#### Locations (`type: location`)
- **Location:** `raw-data/locations/`
- **Features:** Geographical and historical data with notable events and cultural significance

#### Episodes (`type: episode`)
- **Location:** `raw-data/episodes/`
- **Features:** Narrative data with plot points, character focus, and thematic analysis

---

## 4. Summary of File Involvement

- **Data pipeline:** `docs/data pipeline.md`, scripts in `/scripts/` (`1-parse-markdown.mjs`, `2-enrich-data.mjs`).
- **Type definitions:** `src/types/domainTypes.ts`, `src/search/types.ts`.
- **Data fetching/state:** `src/pages/HomeContainer.tsx`, `src/hooks/useEnrichedData.ts`.
- **Search Logic:** `src/hooks/useSearch.ts`, `src/search/preprocessor.ts`.
- **Presentational:** `src/pages/Home.tsx`.
- **Grid & Card:** `src/components/EntityGrid/EntityGrid.tsx`, `src/components/ItemCard/ItemCard.tsx`.
- **Matrix Rain & Effects (2025):** `src/components/MatrixRain/MatrixRain.tsx`, `src/components/Layout.tsx`.
- **Glassmorphism Styling:** `src/components/ThemedCard/ThemedCard.tsx`, `src/styles/custom.css`.
- **Enhanced Filtering System (2025):** `src/components/Filters/FilterBar.tsx`, filtering logic in `src/pages/HomeContainer.tsx`.
- **Collections System (2025):** `src/components/Collections/CollectionCardButton.tsx`, `src/components/Collections/AddToCollectionPopover.tsx`, `src/components/Collections/CreateCollectionModal.tsx`, `src/components/Collections/CollectionsSidebar.tsx`, `src/hooks/useCollections.ts`.
- **Styling/utility:** `src/components/CustomMarkdownRenderer.tsx`, `src/components/NationIcon/NationIcon.tsx`, `src/utils/stringUtils.ts`.
- **Navigation:** `src/utils/navigationUtils.ts` (smooth scrolling utility).

**In short:**
Data flows from `enriched-data.json` → fetched by `HomeContainer` (via `useEnrichedData`) → **filtered by the enhanced sequential filtering pipeline** (Collections → Nations → Categories → Subcategories → Age/Gender/Bender) → indexed and filtered by the `useSearch` hook in the browser → passed to `Home` → rendered as a grid in `EntityGrid` → each card is an `ItemCard` which can expand into a full-screen modal. **NEW (2025):** The entire interface is overlaid with an authentic Matrix digital rain effect that flows through transparent glassmorphism cards, creating a cohesive cyberpunk terminal aesthetic. **Enhanced Filtering:** Multi-layered filtering system with PNG nation images, partial string matching for nation filters, comprehensive sub-filter mapping, multi-field coverage for accurate character classification, age range filtering with animal exclusion, gender filtering with visual icons, and bender/nonbender classification. **Collections System:** Matrix-themed collection management with localStorage persistence and seamless UI integration. **New Data Types:** Support for groups, foods, locations, and episodes with dynamic type detection and proper filtering. **Navigation:** Smooth scrolling is enabled globally via CSS and programmatically via the `navigationUtils.ts` utility.

---

## 5. Data Schema Adherence & Template Guidance

- All data displayed in the frontend must originate from records in `public/enriched-data.json` that strictly follow the canonical schema described in `docs/data pipeline.md`.
- The enrichment script (`2-enrich-data.mjs`) is responsible for "promoting" all necessary UI fields (e.g., image, role, nation) to the top level of each record.
- **Character Classification:** All characters now have proper ageRange, gender, isBender, and bendingElement fields for comprehensive filtering.
- **Data Validation:** Always validate new or edited markdown data by running `npm run build:data` and checking for errors before expecting changes in the UI.
- **Tag Standards:** All tags must be single, underscore-joined words (e.g., "water_nation", "firebender", "main_villain").
- **Template Exclusion:** Template files in `templates/` subdirectories are automatically excluded from processing.
- **Expanded View Format:** Expanded view content must be wrapped in ```md code blocks for proper parsing.
- **Image Path Validation:** All image paths must match actual files in `public/assets/images/`.
- **JSON Syntax Compliance:** All JSON blocks must have valid syntax without trailing commas.

