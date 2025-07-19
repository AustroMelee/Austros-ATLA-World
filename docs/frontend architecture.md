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
    G --> I[SearchBar.tsx]
    G --> J[EntityGrid.tsx]
    
    F --> K[CreateCollectionModal.tsx]
    F --> L[Collection Management]
    
    H --> M[Nation Filters]
    H --> N[Core Filters]
    H --> O[Sub-Filters]
    
    J --> P[ItemCard.tsx]
    P --> Q[ItemCardCollapsed.tsx]
    P --> R[ItemCardModal.tsx]
    
    Q --> S[CollectionCardButton.tsx]
    Q --> T[AddToCollectionPopover.tsx]
    
    R --> U[CustomMarkdownRenderer.tsx]
    R --> V[QuoteBlock.tsx]
    R --> W[SectionBlock.tsx]
    
    X[useEnrichedData Hook] --> D
    Y[useSearch Hook] --> D
    Z[useFilters Hook] --> D
    AA[useCollections Hook] --> D
    BB[useCardExpansion Hook] --> D
    
    style A fill:#e1f5fe
    style D fill:#fff3e0
    style J fill:#f3e5f5
    style P fill:#ffebee
    style C fill:#fce4ec
```

## 🔧 Hook Dependencies

```mermaid
graph LR
    A[enriched-data.json] --> B[useEnrichedData]
    B --> C[useSearch]
    B --> D[useFilters]
    B --> E[useCollections]
    
    F[Search Input] --> G[useDebounce]
    G --> C
    
    H[Filter Controls] --> D
    I[Collection Actions] --> E
    
    J[Card Expansion] --> K[useCardExpansion]
    L[Image Loading] --> M[useImageFallback]
    
    style A fill:#c8e6c9
    style B fill:#fff3e0
    style C fill:#e3f2fd
    style D fill:#e3f2fd
    style E fill:#e8f5e8
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

---

## 2. Home.tsx: Presentational Layer

- **Pure Component:** Receives all data and handlers from `HomeContainer`.
- **Layout Management:** Renders the main layout with `CollectionsSidebar` and content area.
- **Filter Integration:** Renders the `FilterBar` component with all filtering props.
- **Search Integration:** Renders the `SearchBar` component below filters.
- **Grid Rendering:** Passes filtered results to `EntityGrid` for card display.

---

## 3. Enhanced Multi-Layered Filtering System (2025 Update)

### FilterBar Component (`src/components/Filters/FilterBar.tsx`)

**Nation Filtering:**
- **PNG Images:** Uses custom nation PNG images from `public/assets/images/` instead of React icons
- **Images:** `air_nation.png`, `water_nation.png`, `earth_nation.png`, `fire_nation.png`
- **Multi-Select:** Supports selecting multiple nations simultaneously (OR logic)
- **Partial Matching:** Handles full nation names ("Fire Nation", "Earth Kingdom") with single-word filter buttons ("fire", "earth")
- **Visual Effects:** Glowing terminal indicators with Matrix-themed styling

**Core Filtering:**
- **Categories:** Characters, Groups, Locations, Foods, Fauna, Spirits
- **Single-Select:** Only one category can be active at a time
- **Sharp Terminal Keys:** Matrix-themed button styling with glassmorphism effects
- **NEW (2025):** Groups filter replaces the old 'bending' filter

**Sub-Filtering:**
- **Dynamic Options:** Sub-filters appear only when a core filter is selected
- **Age Ranges:** Child, teen, young adult, adult, elder (with animal exclusion)
- **Gender Filters:** Male/female with React icon symbols (♂/♀)
- **Bender Filters:** Bender/nonbender classification
- **Multi-Select:** Multiple sub-filters can be active simultaneously
- **Comprehensive Mapping:** Translates filter terms to data values (e.g., "villains" → "antagonist")

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

**Performance Optimized Pipeline:**
1. **Collections Filter:** Filter by selected collection IDs
2. **Nation Filter:** Filter by nation using partial string matching
3. **Category Filter:** Filter by entity type (character, location, group, etc.)
4. **Sub-Filter:** Apply comprehensive sub-filtering with mapping
5. **Search:** Apply text search to filtered results
6. **Memoization:** All filtering results cached with `useMemo` to prevent wasteful re-computation

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
- **Performance Optimizations:** Major performance improvements with memoized filtering and React.memo components

The application now provides a complete encyclopedia experience with robust filtering, comprehensive categorization, authentic Matrix/CRT aesthetics, and superior performance through intelligent caching and optimization.
