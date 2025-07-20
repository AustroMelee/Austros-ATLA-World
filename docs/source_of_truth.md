# 📖 Source of Truth: Project Documentation (2025 January Update)

This document is the canonical, always-up-to-date reference for how all data is authored, processed, and rendered in this project. The system is now fully unified, robust, and client-side with comprehensive support for multiple data types.

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

---

## 🔍 Search Result Ordering & Tag Matching (2025 Update)

- The search engine now uses a robust result hierarchy for all tag-based queries:
  1. **Direct name match** (always ranked first; e.g., searching 'toph' puts Toph Beifong first if her name matches the query exactly)
  2. Exact tag match
  3. Gender/age/role match for gendered queries
  4. Main cast/primary role
  5. Partial tag match
  6. Other matches
- Partial tag matching means queries like 'knife' will match 'knife_thrower', but exact matches are always prioritized.
- Exception: For mutually exclusive queries like 'male' and 'female', partial tag matching is skipped and only exact matches are allowed. This prevents cross-matching between these categories.
- **Note:** As of January 2025, the search logic guarantees that any direct name match will always be ranked above all tag or partial tag matches, regardless of tag boosting or other factors. This ensures that searching for a character by name always returns the correct entity as the top result.
- See `docs/search engine.md` for full details on the logic and rationale.

---

## 📊 Supported Data Types (2025 Update)

The system now supports multiple data types beyond characters:

**Note:** As of January 2025, the data pipeline supports all data types including the newly added Locations system with full UI integration.

### Characters (`type: character`)
- **Location:** `raw-data/characters/`
- **Template:** `raw-data/characters/templates/character_template.md`
- **Total:** 67 characters
- **Features:** Full character profiles with expanded views, images, and comprehensive metadata

### Groups (`type: group`)
- **Location:** `raw-data/groups/`
- **Template:** `raw-data/groups/templates/group_template.md`
- **Total:** 12 groups
- **Features:** Organizational profiles with leadership, membership, and historical data
- **Groups:** Dai Li, Order of the White Lotus, Team Avatar, Water Tribe Military, Fire Nation Military, Earth Kingdom Military, Si Wong Tribes, Kyoshi Warriors, Freedom Fighters, Yuyan Archers, Rough Rhinos, Southern Raiders

### Foods (`type: food`)
- **Location:** `raw-data/foods/`
- **Template:** `raw-data/foods/templates/food_template.md`
- **Total:** 98 foods
- **Features:** Culinary data with ingredients, cultural significance, and regional information
- **Categories:** Beverages, Desserts, Soups & Stews, Meat & Fish, Noodles & Dumplings, Vegetables & Tofu, Bread & Pastries, Preserved Foods, Special/Unique, Alcohol

### Locations (`type: location`)
- **Location:** `raw-data/locations/`
- **Template:** `raw-data/locations/templates/location_template.md`
- **Total:** 4 locations (Air Temples)
- **Features:** Geographical and historical data with notable events and cultural significance
- **Locations:** Eastern Air Temple, Northern Air Temple, Southern Air Temple, Western Air Temple

### Episodes (`type: episode`)
- **Location:** `raw-data/episodes/`
- **Template:** `raw-data/episodes/templates/episode_template.md`
- **Features:** Narrative data with plot points, character focus, and thematic analysis

---

## 🔧 Data Pipeline Enhancements (2025 Update)

### Template Exclusion System
- **Parser Enhancement:** The markdown parser now automatically excludes files in `templates/` subdirectories
- **Implementation:** Added filter in `scripts/1-parse-markdown.mjs` to skip template files
- **Benefit:** Prevents template files from being parsed as real data entries
- **Pattern:** `!/[/\\\\]templates[/\\\\]/.test(p)`

### Expanded View Processing
- **Format Requirement:** Expanded view content must be wrapped in ```md code blocks
- **Parser Logic:** Extracts content between ```md and ``` markers
- **Validation:** Debug logging shows `[DEBUG] Found Expanded View block: true/false`
- **Issue Resolution:** Fixed double ```md blocks in group files that prevented content display
- **Regex Fix (2025 January):** Updated parser regex from `/## [^\n]*UI - EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/` to `/## [^\n]*EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/` to handle emoji headers
- **Result:** All expanded view content now parses correctly regardless of emoji presence in section headers

### Image Path Validation
- **Requirement:** Image paths in JSON metadata must match actual filenames in `public/assets/images/`
- **Validation:** All image paths verified against actual files
- **Fixes Applied:** Corrected image paths for Order of the White Lotus, Si Wong Tribes, and Water Tribe Military
- **Pattern:** `"image": "exact-filename.jpg"` must match actual file

### Image Field Validation (2025 January Update)
- **Requirement:** All food items must have an `image` field in their JSON metadata
- **Common Issues:** Missing `image` field in food markdown files, even when image files exist
- **Validation:** Parser checks for required `image` field in food items
- **Syntax Errors:** Extra backticks in markdown files can prevent JSON parsing
- **Fixes Applied:** Added missing `image` fields to freeze-dried-cucumberquats, fried-fish-balls, and fried-foods-on-sticks
- **Pattern:** `"image": "exact-filename.jpg"` must be included in food JSON metadata
- **Syntax Fix:** Removed extra backticks that were preventing JSON blocks from being parsed correctly

### Image Fallback System (January 2025 Update)
- **Component:** `src/components/ItemCard/imageFallbacks.ts`
- **Purpose:** Handles cases where image filenames don't match data slugs
- **Implementation:** Maps data slugs to actual image filenames
- **Example:** `'mung-bean-tofu-curry': 'mung-bean-&-tofu-curry.jpg'` handles ampersand in filename
- **Fallback Chain:** Primary image → Fallback mapping → Universal fallback → Text icon
- **Universal Fallback:** `404.jpg` for missing images
- **Special Cases:** Handles character name variations (e.g., `'toph-beifong': 'toph.jpg'`)

### JSON Syntax Validation
- **Requirement:** All JSON blocks must have valid syntax
- **Common Issues:** Trailing commas in arrays and objects
- **Validation:** Parser checks for JSON syntax errors and reports them
- **Fixes Applied:** Removed trailing commas from all group files

### Location Type Support (January 2025 Update)
- **Parser Enhancement:** Updated `scripts/1-parse-markdown.mjs` to accept `type: location`
- **Issue Resolution:** Parser was only accepting `['character', 'group', 'food']` but locations use `type: location`
- **Fix Applied:** Added `'location'` to the supported types array: `['character', 'group', 'food', 'location']`
- **Result:** All 4 Air Temple locations now parse correctly and appear in the UI
- **Data Pipeline:** Locations go through the same enrichment process as other data types
- **UI Integration:** Locations display with proper type labels and nation filtering

---

## 🎯 UI Component Updates (2025 January Update)

### Header Component (2025 January Update)
- **Component:** `src/components/Header.tsx`
- **Matrix Rain Toggle:** Floating button in top-right corner with conditional rendering
- **Back to Top Button:** Smart visibility button that appears on scroll with smooth scrolling
- **Layout Integration:** Clean floating design without black header background
- **State Management:** Controlled by `matrixRainEnabled` prop from Layout component
- **Scroll Detection:** Uses `useScrollToTop` hook for scroll position monitoring
- **Styling:** Matrix-themed with CRT green glow effects and backdrop blur

### useScrollToTop Hook (2025 January Update)
- **Component:** `src/hooks/useScrollToTop.ts`
- **Scroll Detection:** Shows back-to-top button when scroll position > 300px
- **Event Listener:** Monitors `window.pageYOffset` and `document.documentElement.scrollTop`
- **Smooth Scrolling:** Uses `window.scrollTo()` with `behavior: 'smooth'`
- **Cleanup:** Properly removes event listeners on component unmount
- **Accessibility:** Proper ARIA labels for screen readers

### Layout Component (2025 January Update)
- **Component:** `src/components/Layout.tsx`
- **Matrix Rain Integration:** Conditional rendering based on `matrixRainEnabled` state
- **Header Integration:** Includes Header component with all necessary props
- **Performance:** Prevents unnecessary canvas rendering when Matrix Rain is disabled
- **State Management:** Uses `useState` to track Matrix Rain toggle state

### Dynamic Type Labels
- **Component:** `src/components/ItemCard/ItemCardCollapsed.tsx`
- **Enhancement:** Dynamic type detection instead of hardcoded "Character"
- **Logic:** Displays "Group", "Location", "Food", "Fauna", "Spirit", or "Character" based on item type
- **Accessibility:** Updated aria-label from "Character details" to "Item details"

### Collections System Integration
- **Components:** `CollectionCardButton`, `AddToCollectionPopover`, `CreateCollectionModal`, `CollectionsSidebar`
- **Features:** Matrix-themed styling with CRT green glow effects
- **Storage:** Client-side localStorage persistence
- **Integration:** Seamlessly integrated with existing card system

### Enhanced Collections System (2025 Update)
- **CollectionCardButton:** Enhanced Matrix styling with larger size (`w-7 h-7`), thicker borders, improved glow effects, scale animations, and better typography
- **AddToCollectionPopover:** Fixed positioning system with dynamic sizing, scrollable content, click-outside detection, and custom Matrix-themed checkboxes
- **CollectionsSidebar:** Content-based height with responsive width, no stretching, and proper visual balance
- **Layout Integration:** Removed height constraints from Layout and Home containers to prevent sidebar stretching
- **Popover Positioning:** Uses `cardRef` and `getBoundingClientRect()` for accurate positioning outside card container
- **Click-Outside Detection:** Event listeners for closing popover when clicking outside card or popover area
- **Visual Design:** Consistent Matrix/CRT theme with green glow effects, backdrop blur, and smooth transitions

### Filter System Enhancement (January 2025 Update)
- **Component:** `src/components/Filters/FilterBar.tsx`
- **Perfect DOS Font:** Core filters and subfilters now use `font-perfect-dos` for better readability
- **React Icons with Color Coding:** Each core filter has a distinct icon and color:
  - 👥 **Characters**: `FaUsers` - Blue (`text-blue-400`)
  - 🍽️ **Foods**: `FaUtensils` - Orange (`text-orange-400`) 
  - 📍 **Locations**: `FaMapMarkerAlt` - Green (`text-green-400`)
  - 👥 **Groups**: `FaLayerGroup` - Purple (`text-purple-400`)
  - 🐾 **Fauna**: `FaPaw` - Yellow (`text-yellow-400`)
  - 👻 **Spirits**: `FaGhost` - Cyan (`text-cyan-400`)
- **100% Opaque Nation Buttons:** Nation symbol buttons now use solid black background for maximum readability
- **Larger Subfilter Icons:** All subfilter icons increased from `w-4 h-4` to `w-5 h-5` for better visibility
- **Color-Coded Character Subfilters:** Character subfilters have color-coded text:
  - **Age Groups:** Yellow (child), Blue (teen), Green (young adult), Purple (adult), Gray (elder)
  - **Character Types:** Green (heroes), Red (villains), Blue (mentors)
  - **Bending Status:** Orange (bender), Gray (nonbender)
- **Clear All Filters Button:** Smart visibility button that resets all filter states with conditional rendering

### Clear All Filters Button (January 2025 Update)
- **Component:** `src/pages/Home.tsx`
- **Smart Visibility:** Only appears when any filters are active (nations, core filters, or subfilters)
- **Perfect Positioning:** Centered between subfilters and search bar with proper spacing
- **Consistent Styling:** Matches filter button styling with Perfect DOS font
- **One-Click Reset:** Clears all filter states instantly
- **Enhanced UX:** Provides immediate visual feedback and keeps UI clean

### Perfect DOS Font Integration (January 2025 Update)
- **Font Loading:** Perfect DOS font loaded via `@font-face` in `src/styles/custom.css`
- **Application:** Applied to core filters and subfilters via `font-perfect-dos` class
- **Benefits:** Better readability against complex Matrix Rain background
- **Consistency:** Matches the retro terminal aesthetic

### Nation Symbol & Color Integration (2025 Update)
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

## Key Principles
- **Single Source of Truth:** All data is authored in markdown, processed by the two-stage pipeline, and output as `public/enriched-data.json`.
- **Client-Side Search:** All indexing and search logic is performed in-browser using FlexSearch and the `useSearch` hook.
- **No Pre-Built Index:** The app does not use or generate a pre-built search index file.
- **Strict Schema Adherence:** All data must follow the canonical schema in `docs/templates/character_template.md`.
- **Template Exclusion:** Template files are automatically excluded from data processing.
- **Image Path Validation:** All image paths must match actual files in the assets directory.
- **Image Fallback System:** Handles cases where image filenames don't match data slugs with fallback mappings.
- **JSON Syntax Compliance:** All JSON blocks must have valid syntax without trailing commas.
- **Location Type Support:** Parser accepts `type: location` for geographical data with full UI integration.
- **Performance Optimization:** Memoized filtering with useMemo, React.memo components, and useCallback hooks for optimal performance.
- **Code Organization:** Separation of concerns with dedicated hooks and utility functions.
- **UI Enhancement:** Perfect DOS font integration, React icons with color coding, and 100% opaque elements for maximum readability.
- **Header Integration:** Matrix Rain toggle and back-to-top button with smart visibility and smooth scrolling.
- **Scroll Management:** Intelligent scroll detection and smooth scrolling functionality.

---

## Canonical References
- **Data Pipeline:** See `docs/data_pipeline.md` for the full authoring and build process.
- **Search Engine:** See `docs/search_engine.md` for the client-side search architecture.
- **Frontend Architecture:** See `docs/frontend_architecture.md` for the React component structure and data flow.
- **Data Flow:** See `docs/data_flow.md` for the complete data flow including filtering system.
- **Troubleshooting:** See `docs/troubleshooting.md` for debugging steps and lessons learned.

---

**This documentation is always kept current with the codebase. All contributors must reference these docs before making changes.**

