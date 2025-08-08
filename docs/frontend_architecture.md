# 🏗️ Frontend Architecture & Logic (2025 January Update)

## 📊 Component Hierarchy

```mermaid
graph TD
    A[App.tsx] --> B[Layout.tsx]
    B --> C[MatrixRain.tsx]
    B --> D[HomeContainer.tsx]
    
    D --> E[Home.tsx]
    E --> F[CollectionsSidebar.tsx]
    E --> G[Main Content Area]
    
    G --> H[FilterBar.tsx]
    G --> I[Clear All Filters Button]
    G --> J[SearchBar.tsx]
    G --> K[EntityGrid.tsx]
    
    F --> L[CreateCollectionModal.tsx]
    F --> M[Collection Management]
    
    H --> N[Nation Filters]
    H --> O[Core Filters]
    H --> P[Sub-Filters]
    
    K --> Q[ItemCard.tsx]
    Q --> R[ItemCardCollapsed.tsx]
    Q --> S[ItemCardModal.tsx]
    
    R --> T[CollectionCardButton.tsx]
    R --> U[AddToCollectionPopover.tsx]
    
    S --> V[CustomMarkdownRenderer.tsx]
    S --> W[QuoteBlock.tsx]
    S --> X[SectionBlock.tsx]
    
    Y[useEnrichedData Hook] --> D
    Z[useSearch Hook] --> D
    AA[useFilterState Hook] --> D
    BB[useCollections Hook] --> D
    CC[useCardExpansion Hook] --> D
    
    style A fill:#e1f5fe
    style D fill:#fff3e0
    style K fill:#f3e5f5
    style Q fill:#ffebee
    style C fill:#fce4ec
```

## 🔧 Hook Dependencies

```mermaid
graph LR
    A[useEnrichedData] --> B[enriched-data.json]
    C[useSearch] --> A
    D[useFilterState] --> A
    E[useCollections] --> F[localStorage]
    
    G[useCardExpansion] --> H[Modal State]
    I[useImageFallback] --> J[Image Loading]
    K[useDebounce] --> L[Search Input]
    M[useScrollToTop] --> N[Scroll Position]
    
    style A fill:#c8e6c9
    style B fill:#fff3e0
    style C fill:#e3f2fd
    style D fill:#e3f2fd
    style E fill:#e8f5e8
    style M fill:#fce4ec
```

## 🎯 Data Flow Architecture

```mermaid
graph TD
    A[HomeContainer] --> B[State Management]
    B --> C[Filter Pipeline]
    B --> D[Search Pipeline]
    B --> E[Collections Pipeline]
    
    C --> F[Filtered Results]
    D --> G[Searched Results]
    E --> H[Collection Results]
    
    F --> I[EntityGrid]
    G --> I
    H --> I
    
    I --> J[ItemCard Components]
    
    K[User Interactions] --> L[State Updates]
    L --> M[UI Re-renders]
    
    style A fill:#fff3e0
    style I fill:#f3e5f5
    style J fill:#ffebee
```

---

## 1. HomeContainer.tsx: The Central Orchestrator (2025 Performance Update)

- **Data Fetching:** On initial load, fetches `public/enriched-data.json` (the only data file used by the app) using the `useEnrichedData` hook.
- **State Management:** Manages the user's search query, collection selection, and the `expandedCardId` for modal views.
- **Search Logic:** Calls the `useSearch` hook, passing the filtered dataset and the current query.
- **Collections:** Uses the `useCollections` hook to create, store, and filter collections via `localStorage`.
- **Performance Optimized Filtering:** Uses `useFilterState` hook and `applyFilters` utility for memoized filtering with `useMemo`.
- **Memoized Pipeline:** Implements the filtering pipeline with performance optimization: Collections → Nations → Categories → Subcategories → Age/Gender/Bender → Search.
- **NEW (2025):** Template exclusion system prevents template files from being processed as data.
- **Performance Enhancement:** Reduced from ~200 lines to 64 lines (68% reduction) through code organization and separation of concerns.
- **Clear All Filters:** Added `handleClearAllFilters` function to reset all filter states.

---

## 2. Home.tsx: Presentational Layer

- **Pure Component:** Receives all data and handlers from `HomeContainer`.
- **Layout Management:** Renders the main layout with `CollectionsSidebar` and content area.
- **Filter Integration:** Renders the `FilterBar` component with all filtering props.
- **Clear All Filters Button:** Conditionally renders clear button between filters and search bar.
- **Search Integration:** Renders the `SearchBar` component below filters.
- **Grid Rendering:** Passes filtered results to `EntityGrid` for card display.

---

## 3. Enhanced Multi-Layered Filtering System (2025 January Update)

### FilterBar Component (`src/components/Filters/FilterBar.tsx`)

**Nation Filtering:**
- **PNG Images:** Uses custom nation PNG images from `public/assets/images/` instead of React icons
- **Images:** `air_nation.png`, `water_nation.png`, `earth_nation.png`, `fire_nation.png`
- **Multi-Select:** Supports selecting multiple nations simultaneously (OR logic)
- **Partial Matching:** Handles full nation names ("Fire Nation", "Earth Kingdom") with single-word filter buttons ("fire", "earth")
- **Visual Effects:** Glowing terminal indicators with Matrix-themed styling
- **100% Opaque:** Nation buttons now use solid black background for maximum readability

**Core Filtering (January 2025 Update):**
- **Categories:** Characters, Groups, Locations, Foods, Fauna, Spirits
- **Single-Select:** Only one category can be active at a time
- **Perfect DOS Font:** Core filter buttons now use `font-perfect-dos font-bold` for better readability
- **React Icons:** Each core filter has a color-coded React icon:
  - 👥 **Characters**: `FaUsers` - Blue (`text-blue-400`)
  - 🍽️ **Foods**: `FaUtensils` - Orange (`text-orange-400`) 
  - 📍 **Locations**: `FaMapMarkerAlt` - Green (`text-green-400`)
  - 👥 **Groups**: `FaLayerGroup` - Purple (`text-purple-400`)
  - 🐾 **Fauna**: `FaPaw` - Yellow (`text-yellow-400`)
  - 👻 **Spirits**: `FaGhost` - Cyan (`text-cyan-400`)
- **Sharp Terminal Keys:** Matrix-themed button styling with glassmorphism effects

**Location Sub-Filtering (2025 Aug Update):**
- Data-backed keys: `capital`, `city`, `village`, `temple`, `island`, `desert`, `swamp`.
- Heuristic match over `locationType`, `region`, `terrain`, `name`, `slug` with term synonyms (e.g., `island` ↔ `archipelago`, `coast`).
- Add new subfilter by extending the `locations` array in `Home.tsx` and the `synonyms` map in `applyFilters.ts`.

**Sub-Filtering (January 2025 Update):**
- **Dynamic Options:** Sub-filters appear only when a core filter is selected
- **Age Ranges:** Child, teen, adult, elder (with animal exclusion)
- **Gender Filters:** Male/female with React icon symbols (♂/♀)
- **Bender Filters:** Bender/nonbender classification
- **Multi-Select:** Multiple sub-filters can be active simultaneously
- **Comprehensive Mapping:** Translates filter terms to data values (e.g., "villains" → "antagonist")
- **Larger Icons:** Subfilter icons increased from `w-4 h-4` to `w-5 h-5` for better visibility
- **Color-Coded Text:** Character subfilters now have color-coded text:
  - **Age Groups:** Yellow (child), Blue (teen), Purple (adult), Gray (elder)
  - **Character Types:** Green (heroes), Red (villains), Blue (mentors)
  - **Bending Status:** Orange (bender), Gray (nonbender)
- **Perfect DOS Font:** Subfilter text uses `font-perfect-dos` for better readability

**Food Sub-Filters (2025 Update):**
- **12 Categories:** beverages, desserts, soups, meat, vegetables, noodles, dumplings, preserved, street food, traditional, vegetarian, luxury, ceremonial, health, fire-themed, seafood
- **React Emojis:** Each sub-filter includes React emoji with descriptive text labels
- **Comprehensive Coverage:** All 98 food items categorized into appropriate sub-filters
- **Nation Integration:** Food items display nation symbols in cards
- **Multi-Select Support:** Multiple food categories can be selected simultaneously

**Clear All Filters Button (January 2025 Update):**
- **Smart Visibility:** Only appears when any filters are active (nations, core filters, or subfilters)
- **Perfect Positioning:** Centered between subfilters and search bar with proper spacing
- **Consistent Styling:** Matches filter button styling with Perfect DOS font
- **One-Click Reset:** Clears all filter states instantly
- **Enhanced UX:** Provides immediate visual feedback and keeps UI clean

**Responsive Design:**
- **Flex-Wrap Layout:** Buttons wrap to new lines on smaller screens
- **Adaptive Sizing:** Button sizes adjust for mobile devices
- **Touch-Friendly:** Larger tap targets for mobile interaction

### Filtering Logic (`src/pages/HomeContainer.tsx`)

**Performance Optimized Pipeline:**
1. **Collections Filter:** Filter by selected collection IDs
2. **Nation Filter:** Filter by nation using partial string matching
3. **Category Filter:** Filter by entity type (character, location, group, etc.)
4. **Sub-Filter:** Apply comprehensive sub-filtering with mapping
5. **Search:** Apply text search to filtered results
6. **Memoization:** All filtering results cached with `useMemo` to prevent wasteful re-computation

**Nation Filtering (2025 Aug Update):**
- Uses `computeNationFromEntity` to normalize phrases (e.g., “north pole”, “Fire Nation archipelago”) to canonical nations.
- Synonym matching expands each selected nation to common variants (e.g., water → “water tribe”, “north pole”, “south pole”, “northern/southern water tribe”).
```typescript
if (activeNations.size > 0) {
  items = items.filter(item => {
    const normalized = computeNationFromEntity(item);
    const rawNation = item.nation;
    const region = getField<string>(item, 'region');
    const haystacks = [normalized, rawNation, region]
      .filter(Boolean)
      .map(v => String(v).toLowerCase());
    const synonyms: Record<string, string[]> = {
      air: ['air', 'air nomads'],
      earth: ['earth', 'earth kingdom'],
      fire: ['fire', 'fire nation'],
      water: ['water', 'water tribe', 'north pole', 'south pole', 'northern water tribe', 'southern water tribe'],
    };
    return Array.from(activeNations).some(sel => {
      const terms = synonyms[sel] || [sel];
      return terms.some(term => haystacks.some(h => h.includes(term)));
    });
  });
}
```

**Sub-Filter Mapping:**
- **Age Ranges:** Maps to `ageRange` or numeric age with animal exclusion (no non-human species)
- **Gender:** Uses top-level `gender` field (male/female)
- **Bender:** Uses `isBender`, `bendingElement`, and bender-style tags
- **Role-Based (Characters):** Matches via tags, `role`, `narrativeFunction`, and expanded text
- **Fauna:** Uses tags/metadata (animalType/habitat/behavior) with name/slug/expanded text fallbacks for:
  - `predators_hunters`, `domesticated_mounts`, `aquatic_marine`, `flying_aerial`, `sacred_spiritual`, `hybrid_mixed`, `small_insects`, `reptiles_amphibians`
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
- **Static Grid:** Characters stay in fixed cells while waves of brightness move downward.
- **Flipped & Rotated Glyphs:** Each cell stores a random orientation for authentic visual variety.
- **Multiple Streams:** Columns can host several drops with random speed and start delays.
- **Random Glyph Cycling:** Symbols change over time inside the illuminated trails.
- **Performance:** Uses `requestAnimationFrame` for smooth 60fps animation with adaptive frame skipping.
- **Modal Integration:** Reduces intensity when modal is open.
- **Responsive:** Auto-calculates columns based on screen width and cleans up listeners on resize.

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
- **Group Type Support:** Includes all group types: "group", "religious_organization", "service_organization"
- **Accessibility:** Updated aria-label from "Character details" to "Item details"

**Badge System Integration:**
- **Dynamic Badge Display:** Badges extracted from card view section and displayed in UI
- **Badge Logic:** Uses `getBadge` function to determine badge from `item.role`, `item.metadata.badge`, or `item.metadata.role`
- **Visual Integration:** Badges appear prominently on character cards
- **Fallback Handling:** Graceful handling when badges are missing

**Collections Integration:**
- **Collection Button:** Matrix-themed button in top-right corner
- **Visual States:** Different icons for in/out of collection states
- **Hover Effects:** CRT green glow effects matching the theme

**Nation Symbol & Color Integration (2025 Update):**
- **Food Cards:** Display nation symbols for all food items
- **Character Cards:** Display nation symbols for all characters
- **Group Cards:** Display nation symbols for all groups
- **NationIcon Component:** Maps nation strings to React icons
- **Consistent Display:** All entity types show nation affiliation
- **Enhanced Icon Sizing (2025 January Update):** Nation icons have been increased in size for better visibility and prominence:
  - **Grid Cards:** Increased from `size={8}` to `size={12}` (50% larger)
  - **Modal Cards:** Increased from `size={20}` to `size={24}` (20% larger)
  - **Visual Impact:** Nation icons are now significantly more prominent and easier to identify across all card types

---

## 6. Collections System (2025 Update)

### CollectionsSidebar Component (`src/components/Collections/CollectionsSidebar.tsx`)

**Local Storage Integration:**
- **Persistent Storage:** Collections saved to `localStorage`
- **Real-Time Updates:** Immediate UI updates when collections change
- **Error Handling:** Graceful fallback if storage is unavailable

**Dynamic Sizing (2025 Update):**
- **Content-Based Height:** Uses `h-fit` instead of fixed height to grow only as needed
- **Responsive Width:** `w-auto min-w-[200px] max-w-[280px]` for flexible sizing
- **No Stretching:** Removed `sticky top-20` and replaced with `self-start` to prevent forced height
- **Parent Container Fixes:** Removed `min-h-screen` from Layout and Home containers to prevent stretching
- **Visual Result:** Sidebar now appears as a compact, content-sized panel instead of a long column

**Collection Management:**
- **Create Collections:** Modal interface for creating new collections
- **Add/Remove Cards:** Button-based card management with popover interface
- **Collection Filtering:** Filter entire dataset by collection membership
- **Visual Feedback:** Clear indication of active collection

### Collection Components

**CollectionCardButton (Enhanced 2025):**
- **Enhanced Matrix Styling:** Larger size (`w-7 h-7`) with thicker border (`border-2`)
- **Improved Glow Effects:** Stronger shadows (`shadow-[0_0_20px_rgba(112,171,108,0.8)]`) for dramatic glow
- **Interactive Animations:** Scale animation (`hover:scale-110`) and smooth transitions (`duration-300`)
- **Better Typography:** Bold fonts with drop shadows for glowing text effect
- **Enhanced States:** Different colors and glows for add/remove states
- **Visual Hierarchy:** Plus icon (`text-lg`) and checkmark (`text-sm`) with proper proportions
- **Z-Index Management:** `z-10` ensures button stays above other elements

**AddToCollectionPopover (Enhanced 2025):**
- **Fixed Positioning:** Uses `position: fixed` with dynamic positioning based on card location
- **Dynamic Sizing:** `min-width: 200px` with `overflow-y-auto` and `max-h-[80vh]` for scrolling
- **Card Integration:** Receives `cardRef` from parent card for accurate positioning
- **Click-Outside Detection:** Closes popover when clicking outside card or popover area
- **Enhanced Styling:** Semi-transparent background with CRT green borders and glow effects
- **Custom Checkboxes:** Matrix-themed checkboxes with green glow and rounded corners
- **Responsive Design:** Adapts to different collection counts with proper scrolling

**CreateCollectionModal:**
- **Modal Interface:** Clean form for collection creation
- **Validation:** Ensures unique collection names
- **Matrix Styling:** Consistent with overall theme

### Popover Positioning System (2025 Update)

**Technical Implementation:**
- **Card Reference:** `cardRef` passed from `ItemCardCollapsed` to popover
- **Fixed Positioning:** Popover positioned outside card container to avoid clipping
- **Dynamic Calculation:** Uses `getBoundingClientRect()` for accurate positioning
- **Responsive Design:** Adapts to different screen sizes and card positions
- **Overflow Handling:** Scrollable content with maximum height constraints

**User Experience Improvements:**
- **Click-Outside Detection:** Event listeners detect clicks outside popover and card
- **Smooth Transitions:** 300ms duration for all animations
- **Visual Feedback:** Clear hover and active states
- **Accessibility:** Proper ARIA labels and keyboard navigation

### Layout Integration (2025 Update)

**Container Height Management:**
- **Layout.tsx:** Removed `min-h-screen` from root container
- **Home.tsx:** Removed `min-h-screen` from main flex container, added to content area only
- **Result:** Sidebar no longer stretches to full viewport height

**Flexbox Optimization:**
- **Self-Start:** Sidebar uses `self-start` instead of `sticky` positioning
- **Content Flow:** Main content area maintains proper height constraints
- **Visual Balance:** Sidebar and content area have proper proportions

### Enhanced Visual Design (2025 Update)

**Matrix Theme Integration:**
- **CRT Green Glow:** Consistent use of `#70ab6c` and `#c8ffc8` colors
- **Backdrop Blur:** `backdrop-blur-md` for glassmorphism effects
- **Drop Shadows:** Text drop shadows for glowing effects
- **Border Effects:** Thick borders with glow for definition

**Interactive States:**
- **Hover Effects:** Scale animation and enhanced glow on hover
- **Active States:** Different colors and glows for different states
- **Transition Smoothness:** 300ms duration for all animations
- **Visual Hierarchy:** Clear distinction between add and remove states

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

### Backend Metadata Separation
- **Requirement:** Backend metadata must be separated from expanded view content
- **Implementation:** Backend metadata section must not be included within expanded view
- **Pattern:** Remove `---` separators that incorrectly place backend metadata within expanded view
- **Benefit:** Prevents backend metadata from appearing in UI cards

### Badge System Integration
- **Extraction:** Badges extracted from card view section in markdown files
- **Display:** Badges displayed dynamically in UI based on metadata
- **Logic:** Uses `getBadge` function to determine badge from multiple sources
- **Fallback:** Graceful handling when badges are missing

### Nation Field Integration
- **Requirement:** All entities must have nation fields for filtering
- **Implementation:** Nation fields added to all groups and characters
- **Filtering (2025 Aug):** Episodes inherit nation from Book when missing; mapping 1→Water Tribe, 2→Earth Kingdom, 3→Fire Nation. Nation filter uses normalized nation from `computeNationFromEntity`.
- **Display:** Nation symbols displayed on all entity cards

### Expanded View Processing
- **Format Requirement:** Content must be wrapped in ```md code blocks
- **Parser Logic:** Extracts content between ```md and ``` markers
- **Debug Logging:** Shows `[DEBUG] Found Expanded View block: true/false`
- **Issue Resolution:** Fixed double ```md blocks in group files

### Episode Book & Chronology (2025 Aug)
- **Book Inference:** If `book` is missing, we infer it from `metadata.book` or `SxEx` in the `title`/`name`.
- **Chronological Sort:** When core filter is Episodes, results are sorted by Season → Episode with fallbacks to `air_date` and `production_number`.
- **UI Title Normalization:** Cards/modal titles auto‑prefix with `SxEx` if absent.

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

### Perfect DOS Font Integration (January 2025 Update)
- **Font Loading:** Perfect DOS font loaded via `@font-face` in `custom.css`
- **Application:** Applied to core filters and subfilters via `font-perfect-dos` class
- **Benefits:** Better readability against complex Matrix Rain background
- **Consistency:** Matches the retro terminal aesthetic

---

## 10. Performance Optimizations (2025 Major Update)

### React Optimizations
- **Memoization:** `useMemo` and `useCallback` for expensive operations
- **React.memo:** ItemCard components wrapped with React.memo to prevent unnecessary re-renders
- **Lazy Loading:** Images loaded on demand with fallbacks and `loading="lazy"` attribute
- **Virtual Scrolling:** Efficient rendering of large lists
- **State Management:** Minimal re-renders through proper state structure

### Filtering Performance (Major Enhancement)
- **useMemo Optimization:** Complex filtering pipeline memoized to prevent wasteful re-computation on every keystroke
- **useFilterState Hook:** Extracted filter state management into reusable custom hook with useCallback optimizations
- **applyFilters Utility:** Pure function for filtering logic, isolated from component concerns
- **Performance Impact:** Filtering only re-runs when filters actually change, not on every search input
- **Code Organization:** HomeContainer reduced from ~200 lines to 64 lines (68% reduction)

### Image Loading Performance
- **Lazy Loading:** All card images use `loading="lazy"` attribute for faster initial page load
- **Fallback System:** Robust image fallback handling with graceful degradation
- **Performance Impact:** Browser only loads images when they're about to be visible

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
- **Perfect DOS Font Integration:** Core filters and subfilters now use Perfect DOS font for better readability
- **React Icons with Color Coding:** Each core filter has a distinct icon and color for instant recognition
- **100% Opaque Nation Buttons:** Nation symbol buttons are now fully opaque for maximum readability
- **Larger Subfilter Icons:** All subfilter icons increased in size for better visibility
- **Color-Coded Character Subfilters:** Character subfilters have color-coded text for visual distinction
- **Clear All Filters Button:** Smart visibility button that resets all filter states
- **Food Category System:** 12 comprehensive food sub-categories with React emojis and text labels
- **Nation Integration:** All entity types display nation symbols with consistent theming
- **Matrix Rain Integration:** Authentic background effects with adaptive performance
- **Glassmorphism UI:** Modern visual effects with depth and transparency
- **Collections System:** Matrix-themed collection management with localStorage persistence
- **New Data Types:** Support for groups, foods, locations, and episodes with dynamic type detection
- **Template Exclusion:** Automatic exclusion of template files from data processing
- **Enhanced Data Validation:** Image path validation, JSON syntax checking, and expanded view processing
- **Badge System:** Dynamic badge display for all character types
- **Backend Metadata Separation:** Proper separation of backend metadata from UI content
- **Nation Fields:** All entities filterable by nation
- **Responsive Design:** Works seamlessly across all devices
- **Accessibility Compliance:** Inclusive user experience for all users

The combination of these features creates a cohesive, high-performance application that delivers both visual impact and functional utility while maintaining the distinctive Matrix/CRT aesthetic.

**Key Statistics (2025 January Update):**
- **98 Food Items:** Complete food database with nation affiliations
- **67 Character Items:** Full character roster with age/gender/bender classification
- **12+ Group Items:** Comprehensive group coverage with nation symbols
- **12 Food Sub-Categories:** Comprehensive food filtering system
- **4 Nation Types:** Fire, Water, Earth, Air with PNG images and React icons
- **Enhanced Filtering:** Multi-layered filtering with comprehensive coverage and color coding
- **Performance Optimizations:** Major performance improvements with memoized filtering and React.memo components
- **UI Enhancements:** Perfect DOS font, React icons, color coding, and 100% opaque elements
- **Badge System:** Dynamic badges for all character types
- **Nation Fields:** All entities filterable by nation

The application now provides a complete encyclopedia experience with robust filtering, comprehensive categorization, authentic Matrix/CRT aesthetics, superior performance through intelligent caching and optimization, and enhanced visual distinction through color coding and improved typography.

---

*Last Updated: January 2025*  
*Architecture: Advanced Component Hierarchy*  
*Performance: Optimized with Memoization*  
*UI: Enhanced with Matrix Theme*