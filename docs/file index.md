# 📁 File Index (2024 Refactor)

---

## 🚨 Non-Negotiable Tag Rule

**All tags in markdown files must be single, underscore-joined words.**
- No spaces, slashes, or multi-word phrases are allowed in any tag.
- Spaces and slashes are replaced with underscores (e.g., `water nation` → `water_nation`).
- All tags are lowercased (e.g., `Firebender` → `firebender`).
- This rule applies to all present and future markdown files.
- The enrichment/data pipeline will enforce this and strip or reject any non-compliant tags.
- **Example:**
  - Valid: `water_nation`, `firebender`, `main_villain`
  - Invalid: `water nation`, `main villain`, `main/villain`, `Main Villain`

The dictionary of allowed tags lives in `src/data/tag_dictionary.json`. Aliases
defined there are treated the same as the canonical tag during search.

---

## Root Configuration & Metadata
| File | Description |
|------|-------------|
| README.md | Project overview and setup instructions. |
| package.json | Node project manifest. Defines scripts like `build:data` for the data pipeline. |
| package-lock.json | Exact dependency versions for reproducible installs. |
| vite.config.ts | Vite build config (React plugin, PWA, module aliases). |
| tailwind.config.js | Tailwind CSS theme and typography customization. |
| postcss.config.cjs | PostCSS plugins (autoprefixer) for Tailwind. |
| tsconfig.json | Main TypeScript compiler settings for the project. |
| tsconfig.node.json | TypeScript config for Node.js scripts in `scripts/`. |
| .eslintrc.json | ESLint rules for code quality. |
| index.html | Main HTML entry point for the Vite application. |

---

## Documentation (`docs/`)
| File | Description |
|------|-------------|
| docs/data pipeline.md | **Source of Truth.** Details the two-stage pipeline for processing markdown into `enriched-data.json`. |
| docs/frontend architecture.md | **Source of Truth.** Describes the React component structure and data flow. |
| docs/search engine.md | **Source of Truth.** Explains the client-side indexing and search architecture. |
| docs/troubleshooting.md | **Source of Truth.** Practical guide for debugging data and UI issues. |
| docs/ui-components.md | Documents the `ItemCard` and modal system. |
| docs/decisions.md | Log of architectural decisions and their rationale. |
| docs/adding-new-domain-tutorial.md | Tutorial on how to add new data types to the project. |
| docs/character-cards-index.md | Complete index of all character cards with statistics and categorization. |
| docs/group-cards-index.md | Complete index of all group cards with statistics and categorization. |
| docs/food-cards-index.md | Complete index of all food items with statistics and categorization. |

---

## Data Pipeline Scripts (`scripts/`)
| File | Description |
|------|-------------|
| scripts/1-parse-markdown.mjs | **Stage 1:** Parses raw Markdown files, extracting YAML frontmatter and all JSON/MD blocks into a structured format. |
| scripts/2-enrich-data.mjs | **Stage 2:** Cleans the parsed data, promotes UI-critical fields to the top level, and outputs the final `public/enriched-data.json`. |
| scripts/validate-data.mjs | Validates data files against a defined schema. |
| scripts/lib/enrichRecord.mjs | Utility library for record enrichment logic used by the enrichment script. |

---

## Application Source (`src/`)
| File/Dir | Description |
|----------|-------------|
| src/main.tsx | Main React entry point. |
| src/App.tsx | React Router setup. |
| src/types/ | Core TypeScript types (`domainTypes.ts`, `rawTypes.ts`, `grid.ts`). |
| src/theme/ | Theming files, like `nationThemes.ts` for card colors. |
| src/utils/ | Shared helper functions (`stringUtils.ts`, `tokenize.ts`, `navigationUtils.ts`). |
| src/hooks/ | All custom React hooks (see below). |
| src/components/ | All reusable UI components (cards, grid, nav, modal, etc.). |
| src/pages/ | Page-level components that compose the UI. |
| src/search/ | Client-side search utilities. |
| src/styles/ | CSS files. |
| src/styles/custom.css | Custom CSS with CRT utilities (crt-glow-text, crt-glow-border, crt-dither), scrollbar theming, font definitions, and smooth scrolling behavior for anchor links. |
| src/styles/generated-tailwind.css | Generated Tailwind CSS output (must be rebuilt after config changes). |
| src/config/constants.ts | Centralized API endpoints and config constants. |
| src/components/ItemCard/ItemCardModal.tsx | Modal for expanded card view. Implements scroll lock, single scroll container, click-outside-to-close, and accessibility improvements. |
| src/components/Collections/CollectionCardButton.tsx | Button for adding/removing cards to collections. Now larger, centered, more visible, and accessible. |
| src/hooks/useScrollLock.ts | Custom hook for scroll locking when modal is open. |

---

### Key Frontend Files & Their Roles

#### **Data Flow & State**
| File | Description |
|------|-------------|
| **`pages/HomeContainer.tsx`** | The stateful "brain" of the app. Fetches `enriched-data.json`, manages search and collection state, and calls the `useSearch` hook. |
| **`hooks/useSearch.ts`** | **The core of the search system.** Receives all data, preprocesses it, builds the FlexSearch index in-browser, and returns filtered results. |
| **`hooks/useEnrichedData.ts`** | Fetches and manages the enriched data from the API endpoint, with robust error handling. |
| **`hooks/useImageFallback.ts`** | Manages image loading, error fallback, and status for entity images. |
| **`hooks/useAustrosSearch.ts`** | Enhanced search hook with additional functionality for the Austros system. |
| **`hooks/useCardExpansion.ts`** | Manages card expansion state and modal behavior. |
| **`hooks/useFilters.ts`** | Handles filtering logic and state management. |
| **`hooks/useFilterOptions.ts`** | Provides available filter options based on data. |
| **`hooks/useModalFocus.ts`** | Manages focus trapping and accessibility for modals. |
| **`hooks/useNationColor.ts`** | Provides nation-based color theming. |
| **`hooks/useDebounce.ts`** | Debounces rapid input changes for performance. |
| **`hooks/useSuggestions.ts`** | Provides search suggestions and autocomplete. |
| **`hooks/useRecentSearchRecorder.ts`** | Records and manages recent search history. |
| **`hooks/useCollections.ts`** | CRUD and persistence layer for user-defined collections stored in `localStorage`. |
| **`search/preprocessor.ts`** | Helper for `useSearch`. Creates the `searchBlob` from each record to enable comprehensive full-text search. |
| **`pages/Home.tsx`** | The presentational "body" of the app. Receives props from `HomeContainer` and renders the UI. |

#### **UI Components**
| File | Description |
|------|-------------|
| **`components/SearchBar.tsx`** | Terminal-style search input with phosphor persistence effect (characters flash brighter when typed), cursor wake-up animation, scan lines, custom fonts, block cursor animation, 28px font size, disabled spell-check, custom text selection, and comprehensive CRT effects. |
| **`components/EntityGrid/EntityGrid.tsx`** | Renders the responsive grid of cards. Passes expand/collapse state to each card. **Matrix Integration:** Uses `bg-transparent` to allow Matrix rain to flow through gaps between cards. Shows empty grid without "No results" message when no matches found. |
| **`components/ItemCard/ItemCard.tsx`** | Renders both the small grid card and the full-screen expanded modal view. Contains all logic for a single entity's display. Features responsive text sizing and proper flex layout to prevent name truncation. **Matrix Transparency:** Removed `bg-background` to prevent grey boxes blocking Matrix rain. |
| **`components/MatrixRain/MatrixRain.tsx`** | **NEW (2025):** Canvas-based Matrix digital rain background effect with authentic movie-style characteristics, true randomness, and optimized performance. Uses `requestAnimationFrame` for smooth 60fps animation with adaptive frame skipping when modals are open. Replaces 287 lines of CSS with 122-line React component. |
| **`components/CustomMarkdownRenderer.tsx`** | Renders markdown content for the expanded card view, with custom styling. |
| **`components/ThemedCard/ThemedCard.tsx`** | A styled wrapper that applies nation-specific border colors to cards. **Matrix Update:** Added glassmorphism effects with semi-transparent backgrounds, backdrop blur, and Matrix green hover glow. |
| **`components/Layout.tsx`** | Main application layout wrapper component. **Matrix Integration:** Includes MatrixRain component and transparent backgrounds to allow rain effect visibility. |
| **`components/NationIcon/NationIcon.tsx`** | Displays nation-specific icons using React Icons. |
| **`components/Badge/Badge.tsx`** | Reusable badge component for displaying roles and categories. |
| **`components/QuoteBlock/QuoteBlock.tsx`** | Renders quoted text with special styling for markdown content. |
| **`components/SectionBlock/SectionBlock.tsx`** | Renders structured sections in expanded views. |
| **`components/FilterSidebar.tsx`** | Sidebar for filtering options (can be hidden via returning null). |
| **`components/CollectionsSidebar.tsx`** | Sidebar for collection management (can be hidden via returning null). |
| **`components/Collections/CollectionCardButton.tsx`** | Button component that appears on each card for adding/removing from collections. Uses forwardRef for proper positioning of popover. |
| **`components/Collections/AddToCollectionPopover.tsx`** | Popover menu for managing collection membership. Uses React Portal to prevent clipping issues. |
| **`components/Collections/CollectionsSidebar.tsx`** | Sidebar component for viewing and managing collections. |
| **`components/Filters/FilterBar.tsx`** | **NEW (2025):** Multi-layered filtering interface with nation filters, core category filters, and dynamic sub-filters. Features Matrix-themed styling with glassmorphism effects and responsive design. |

#### **TypeScript Types & Configuration**
| File | Description |
|------|-------------|
| **`types/domainTypes.ts`** | Core domain types for entities, collections, and business logic. |
| **`types/rawTypes.ts`** | Types for raw markdown data before processing. |
| **`types/grid.ts`** | Types for grid layouts and responsive components. |
| **`types/index.ts`** | Central type exports and re-exports. |
| **`search/types.ts`** | Search-specific types for indexing and results. |
| **`theme/nationThemes.ts`** | Nation color theme definitions and mappings. |

---

## Data & Public Assets
| File/Dir | Description |
|------|-------------|
| **`public/enriched-data.json`** | **The single source of truth for the frontend.** A JSON array of all entity records, generated by the data pipeline. |
| `public/assets/images/` | All static images used for entity cards. |
| `raw-data/` | The raw markdown source files for all encyclopedia entries. |
| `data/` | Intermediate data files used during the build process (`parsed-data.json`). |

---

This index provides a clear and accurate map of the project as it currently stands.

**Food Sub-Filters (2025 Update):**
- **12 Categories:** beverages, desserts, soups, meat, vegetables, noodles, dumplings, preserved, street food, traditional, vegetarian, luxury, ceremonial, health, fire-themed, seafood
- **React Emojis:** Each sub-filter includes React emoji with descriptive text labels
- **Comprehensive Coverage:** All 98 food items categorized into appropriate sub-filters
- **Nation Integration:** Food items display nation symbols in cards
- **Multi-Select Support:** Multiple food categories can be selected simultaneously

**Responsive Design:**
- **Flex-Wrap Layout:** Buttons wrap to new lines on smaller screens
- **Adaptive Sizing:** Button sizes adjust for mobile devices
- **Touch-Friendly:** Larger tap targets for mobile interaction

### Filtering Logic (`src/pages/HomeContainer.tsx`)

**Sequential Pipeline:**
1. **Collections Filter:** Filter by selected collection IDs
2. **Nation Filter:** Filter by nation using partial string matching
3. **Category Filter:** Filter by entity type (character, location, group, etc.)
4. **Sub-Filter:** Apply comprehensive sub-filtering with mapping
5. **Search:** Apply text search to filtered results

**Nation Filtering:**
```typescript
if (activeNations.size > 0) {
  itemsToFilter = itemsToFilter.filter(item => 
    item.nation && activeNations.has(item.nation.toLowerCase())
  );
}
```

**Sub-Filter Mapping:**
- **Age Ranges:** Maps to `ageRange` field with animal exclusion
- **Gender:** Maps to `gender` field with male/female values
- **Bender:** Maps to `isBender` and `bendingElement` fields
- **Role-Based:** Maps filter terms to role, narrativeFunction, and eraAppearances
- **Food Categories:** Maps to food category tags with comprehensive coverage

**Animal Exclusion Logic:**
```typescript
// Excludes animals from age range filters
const animalSpecies = ['bison', 'lemur', 'bear', 'animal', 'spirit'];
const isAnimal = item.species && animalSpecies.some(species => 
  item.species.toLowerCase().includes(species)
);
```

**Food Category Filtering:**
- **12 Sub-Categories:** Comprehensive food categorization system
- **Tag-Based:** Uses food category tags for filtering
- **Nation Integration:** Food items display nation symbols
- **Multi-Select:** Supports selecting multiple food categories

---

## 4. Matrix Rain Integration (2025 Update)

### MatrixRain Component (`src/components/MatrixRain/MatrixRain.tsx`)

**Canvas-Based Rendering:**
- **Single Component:** 122-line React component replacing 287+ lines of CSS
- **True Randomness:** Every character randomly generated each frame
- **Authentic Aesthetic:** Movie-accurate bright leading characters with proper trails
- **Performance:** Uses `requestAnimationFrame` for smooth 60fps animation with adaptive frame skipping
- **Modal Integration:** Reduces intensity when modal is open (frame skipping, reduced opacity, dimmed colors)
- **Responsive:** Auto-calculates columns based on screen width
- **Clean Integration:** Transparent backgrounds allow rain to show through UI gaps

**Rendering Strategy:**
1. **Dual-Layer Rendering:** Fade layer followed by character layer for clean trails
2. **Progressive Fade:** Optimized fade opacity (`rgba(13, 17, 23, 0.2)`) prevents muddy background
3. **Character Hierarchy:** Bright leaders (`#c8ffc8`) over standard trails (`#70ab6c`)
4. **Adaptive Performance:** Frame skipping and reduced opacity when modal is open
5. **Memory Management:** Proper cleanup of animation frames and event listeners

---

## 5. Card System & Modal Management

### ItemCard Component (`src/components/ItemCard/ItemCard.tsx`)

**Dual-Mode Rendering:**
- **Collapsed Mode:** Small grid card with basic information
- **Expanded Mode:** Full-screen modal with detailed view and large image

**Matrix Integration:**
- **Transparent Backgrounds:** Removed `bg-background` to prevent grey boxes blocking Matrix rain
- **Glassmorphism Effects:** Semi-transparent backgrounds with backdrop blur for depth
- **Matrix Glow on Hover:** CRT green glow effects using multiple box-shadow layers

**Image Handling:**
- **Fallback System:** Uses `useImageFallback` hook for robust image handling
- **Responsive Images:** Adapts to different screen sizes
- **Loading States:** Graceful handling of image loading and errors

### ItemCardCollapsed Component (Updated 2025)

**Dynamic Type Labels:**
- **Enhancement:** Dynamic type detection instead of hardcoded "Character"
- **Logic:** Displays "Group", "Location", "Food", "Fauna", "Spirit", or "Character" based on item type
- **Accessibility:** Updated aria-label from "Character details" to "Item details"

**Collections Integration:**
- **Collection Button:** Matrix-themed button in top-right corner
- **Visual States:** Different icons for in/out of collection states
- **Hover Effects:** CRT green glow effects matching the theme

**Nation Symbol Integration (2025 Update):**
- **Food Cards:** Display nation symbols for all food items
- **Character Cards:** Display nation symbols for all characters
- **Group Cards:** Display nation symbols for all groups
- **NationIcon Component:** Maps nation strings to React icons
- **Consistent Display:** All entity types show nation affiliation

---

## 6. Collections System (2025 Update)

### CollectionsSidebar Component (`src/components/Collections/CollectionsSidebar.tsx`)

**Local Storage Integration:**
- **Persistent Storage:** Collections saved to `localStorage`
- **Real-Time Updates:** Immediate UI updates when collections change
- **Error Handling:** Graceful fallback if storage is unavailable

**Collection Management:**
- **Create Collections:** Modal interface for creating new collections
- **Add/Remove Cards:** Button-based card management with popover interface
- **Collection Filtering:** Filter entire dataset by collection membership
- **Visual Feedback:** Clear indication of active collection

### Collection Components

**CollectionCardButton:**
- **Matrix Styling:** CRT green glow effects with backdrop blur
- **Visual States:** Plus icon for add, checkmark for in collection
- **Positioning:** Top-right corner of each card

**AddToCollectionPopover:**
- **Dropdown Interface:** Shows all collections with checkboxes
- **Create New:** Option to create new collection
- **Matrix Theme:** Semi-transparent background with CRT styling

**CreateCollectionModal:**
- **Modal Interface:** Clean form for collection creation
- **Validation:** Ensures unique collection names
- **Matrix Styling:** Consistent with overall theme

---

## 7. Search Engine Integration

### useSearch Hook (`src/hooks/useSearch.ts`)

**Client-Side Indexing:**
- **FlexSearch Integration:** Fast, fuzzy search with typo tolerance
- **Preprocessing:** Combines all searchable fields into searchable text
- **Memoization:** Index built once per session for performance
- **Real-Time Results:** Instant search results as user types

**Searchable Fields:**
- **Primary:** Name, role, titles
- **Secondary:** Tags, ageRange, gender, bendingElement
- **Metadata:** Nation, eraAppearances, narrativeFunction
- **Food Categories:** Food category tags and nation affiliations

---

## 8. Data Pipeline Integration (2025 Update)

### Template Exclusion System
- **Parser Enhancement:** Automatic exclusion of files in `templates/` subdirectories
- **Implementation:** Added filter in `scripts/1-parse-markdown.mjs`
- **Pattern:** `!/[/\\\\]templates[/\\\\]/.test(p)`
- **Benefit:** Prevents template files from being processed as real data

### Expanded View Processing
- **Format Requirement:** Content must be wrapped in ```md code blocks
- **Parser Logic:** Extracts content between ```md and ``` markers
- **Debug Logging:** Shows `[DEBUG] Found Expanded View block: true/false`
- **Issue Resolution:** Fixed double ```md blocks in group files

### Image Path Validation
- **Requirement:** Image paths must match actual files in `public/assets/images/`
- **Validation:** All image paths verified during processing
- **Fixes Applied:** Corrected paths for Order of the White Lotus, Si Wong Tribes, Water Tribe Military

### JSON Syntax Validation
- **Requirement:** All JSON blocks must have valid syntax
- **Common Issues:** Trailing commas in arrays and objects
- **Validation:** Parser checks for JSON syntax errors and reports them
- **Fixes Applied:** Removed trailing commas from all group files

### Food Data Processing (2025 Update)
- **98 Food Items:** Complete food database with comprehensive categorization
- **12 Sub-Categories:** Beverages, desserts, soups, meat, vegetables, noodles, dumplings, preserved, street food, traditional, vegetarian, luxury, ceremonial, health, fire-themed, seafood
- **Nation Integration:** All food items have nation affiliations with symbols
- **Category Tags:** All food items categorized into appropriate sub-filters
- **Enrichment Process:** Maps region to nation, adds category tags, validates data integrity

---

## 9. Styling Architecture

### Tailwind CSS Integration
- **Utility-First:** All styling done through Tailwind classes
- **Custom Properties:** CSS variables for theme colors and effects
- **Matrix Theme:** CRT green (`#70ab6c`) with glow effects
- **Glassmorphism:** Semi-transparent backgrounds with backdrop blur

### Custom CSS Classes
- **`.crt-glow-text`:** Multi-layered text shadow for luminous effect
- **`.matrix-card-glow`:** Sophisticated hover effects with pseudo-elements
- **`.crt-flicker`:** Subtle animation mimicking CRT refresh
- **`.crt-screen`:** Scanline and dithering effects

---

## 10. Performance Optimizations

### React Optimizations
- **Memoization:** `useMemo` and `useCallback` for expensive operations
- **Lazy Loading:** Images loaded on demand with fallbacks
- **Virtual Scrolling:** Efficient rendering of large lists
- **State Management:** Minimal re-renders through proper state structure

### Animation Performance
- **requestAnimationFrame:** Smooth 60fps Matrix rain animation
- **Adaptive Frame Skipping:** Reduces animation intensity when modal is open
- **Canvas Optimization:** Efficient rendering with proper cleanup
- **Memory Management:** Proper cleanup of animation frames and event listeners

---

## 11. Accessibility & Responsive Design

### Accessibility Features
- **ARIA Labels:** All interactive elements properly labeled
- **Keyboard Navigation:** Full keyboard support throughout
- **Screen Reader Support:** Semantic HTML structure
- **High Contrast:** Maintains accessibility standards

### Responsive Design
- **Mobile-First:** Designed for all screen sizes
- **Touch-Friendly:** Larger tap targets for mobile
- **Adaptive Layout:** Flex-wrap and responsive grids
- **Performance:** Optimized for mobile devices

---

## Summary

The frontend architecture provides a robust, performant, and accessible foundation for the Austros ATLA World encyclopedia. The 2025 January update introduces:

- **Enhanced Multi-Layered Filtering:** Comprehensive filtering with PNG nation images, age ranges, gender, and bender classification
- **Food Category System:** 12 comprehensive food sub-categories with React emojis and text labels
- **Nation Integration:** All entity types display nation symbols with consistent theming
- **Matrix Rain Integration:** Authentic background effects with adaptive performance
- **Glassmorphism UI:** Modern visual effects with depth and transparency
- **Collections System:** Matrix-themed collection management with localStorage persistence
- **New Data Types:** Support for groups, foods, locations, and episodes with dynamic type detection
- **Template Exclusion:** Automatic exclusion of template files from data processing
- **Enhanced Data Validation:** Image path validation, JSON syntax checking, and expanded view processing
- **Responsive Design:** Works seamlessly across all devices
- **Accessibility Compliance:** Inclusive user experience for all users

The combination of these features creates a cohesive, high-performance application that delivers both visual impact and functional utility while maintaining the distinctive Matrix/CRT aesthetic.

**Key Statistics (2025 Update):**
- **98 Food Items:** Complete food database with nation affiliations
- **67 Character Items:** Full character roster with age/gender/bender classification
- **12+ Group Items:** Comprehensive group coverage with nation symbols
- **12 Food Sub-Categories:** Comprehensive food filtering system
- **4 Nation Types:** Fire, Water, Earth, Air with PNG images and React icons
- **Enhanced Filtering:** Multi-layered filtering with comprehensive coverage

The application now provides a complete encyclopedia experience with robust filtering, comprehensive categorization, and authentic Matrix/CRT aesthetics.