# 🏗️ Frontend Architecture & Logic (2025 Matrix Update)

---

## 1. HomeContainer.tsx: The Central Orchestrator

- **Data Fetching:** On initial load, fetches `public/enriched-data.json` (the only data file used by the app) using the `useEnrichedData` hook.
- **State Management:** Manages the user's search query, collection selection, and the `expandedCardId` for modal views.
- **Search Logic:** Calls the `useSearch` hook, passing the filtered dataset and the current query.
- **Collections:** Uses the `useCollections` hook to create, store, and filter collections via `localStorage`.
- **Prop Drilling:** Passes the final search results and state handlers down to the presentational `<Home />` component.

---

## 2. Layout & Background Effects (2025 Matrix Update)

- **`Layout.tsx`:** Main application layout wrapper that includes the new Matrix Rain background
- **`MatrixRain.tsx`:** Canvas-based Matrix digital rain effect with authentic movie-style characteristics:
  - **Authentic Characters:** Uses Japanese Katakana and binary characters for true Matrix aesthetic
  - **True Randomness:** Every character is randomly generated each frame (not predetermined sequences)
  - **Movie-Accurate Effects:** Bright leading characters (`#c8ffc8`) with trailing characters (`#70ab6c`)
  - **Performance Optimized:** 30fps animation with efficient Canvas rendering
  - **Responsive Design:** Auto-calculates column count based on screen width
  - **Progressive Fade:** Dual-layer rendering with optimized fade opacity to prevent background pollution
  - **Hardware Accelerated:** Uses `will-change: transform` for smooth GPU rendering
  - **Proper Cleanup:** Handles window resize events and component unmounting correctly

---

## 3. Custom Hooks: useSearch, useEnrichedData, useImageFallback, useCollections

- **`useSearch.ts`:**
  - Receives the complete array of data and the search query.
  - Uses a preprocessor to create a `searchBlob` for each record (combining all searchable fields).
  - Builds a FlexSearch index in-browser, memoized for performance.
  - Returns a filtered array of results for the UI.
- **`useEnrichedData.ts`:**
  - Fetches and manages the enriched data from the API endpoint, with robust error handling and loading state.
- **`useImageFallback.ts`:**
  - Manages image loading, error fallback, and status for entity images, providing a robust fallback for missing or broken images.
- **`useCollections.ts`:**
  - Stores user-defined collections in `localStorage`.
  - Provides create, add/remove card, and filtering utilities for the app.

---

## 4. Presentational Layer (Home.tsx)

- Purely presentational; receives all data and handlers as props from `HomeContainer`.
- Renders the main layout, including the `SearchBar` and the `EntityGrid`.
- **Matrix Integration:** Background remains transparent to allow Matrix rain to show through card gaps

---

## 5. Enhanced Search Bar (SearchBar.tsx) - 2025 Update

- **Terminal Aesthetic:** Provides an authentic CRT terminal experience with custom Glass_TTY_VT220 font
- **Typography:** Uses 28px font size for enhanced readability with reduced padding (`py-2`) for compact appearance
- **Custom Cursor:** Features a blinking green block cursor positioned 4px after text for authentic terminal feel
- **CRT Effects:** Includes comprehensive CRT styling with:
  - **Phosphor Persistence:** Characters briefly flash brighter green (#a8e6a8) when typed, fading smoothly to standard color
  - **Cursor Wake-Up:** 100ms elastic scale animation when input is first focused
  - **Scan Lines:** Subtle horizontal scan lines that drift upward
  - **Glow Effects:** Text and border glow effects for authentic CRT appearance
- **User Experience Enhancements:**
  - **Disabled Spell Check:** `spellCheck={false}` prevents browser underlining on character names
  - **Custom Text Selection:** CRT green background with black text instead of default blue highlighting
  - **Removed Clear Button:** Cleaner interface without X/clear button for authentic terminal appearance
  - **Hidden Native Caret:** Uses `caretColor: 'transparent'` to show only the custom block cursor
  - **No "No Results" Message:** Clean interface that simply shows an empty grid when no results are found
- **Accessibility:** Maintains full keyboard navigation and screen reader compatibility despite custom styling
- **Implementation:** Uses absolute positioning with invisible measurement span for pixel-perfect cursor placement

---

## 6. Collections System Architecture

The collections feature follows the project's client-first architecture, using browser localStorage for persistence and React Portals for UI components.

### Storage & State Management (`useCollections.ts`)
- Uses localStorage with key `austros-atla-collections`
- Provides CRUD operations for collections
- Handles persistence automatically
- Returns memoized helper functions for collection operations
- Maintains collection state with functional updates for reliability

### UI Components
1. **CollectionCardButton (`CollectionCardButton.tsx`)**
   - Uses forwardRef for proper ref handling
   - Appears on each card in the grid
   - Shows + for non-collected items, ✓ for collected
   - Matrix-themed styling with glow effects

2. **Collection Popover (`AddToCollectionPopover.tsx`)**
   - Uses React Portal to prevent clipping issues
   - Renders at document.body level
   - Positions itself relative to the button
   - Shows temporary success state (1.5s checkmark)
   - Handles click-outside for dismissal

3. **Collections Sidebar (`CollectionsSidebar.tsx`)**
   - Shows all user collections
   - Provides collection filtering
   - Allows collection creation
   - Shows item counts per collection

### Integration Points
- **HomeContainer:** Manages active collection filtering
- **EntityGrid:** Receives filtered results based on active collection
- **ItemCard:** Hosts collection button and manages popover state

### Data Flow
1. User clicks + button on card
2. Popover appears via Portal
3. User selects/creates collection
4. State updates through useCollections
5. Changes persist to localStorage
6. UI updates with temporary success state
7. Grid filters if collection is active

---

## 7. Matrix Rain Technical Implementation

The Matrix rain effect represents a significant upgrade from the previous CSS-based implementation:

### **Previous Implementation Issues:**
- 287 lines of CSS with 24 hardcoded `<div>` elements
- No randomness - predetermined character sequences
- Performance issues with excessive DOM manipulation
- Limited customization and responsiveness

### **New Canvas-Based Solution:**
- **Single Component:** 80-line React component replacing 287+ lines of CSS
- **True Randomness:** Every character randomly generated each frame
- **Authentic Aesthetic:** Movie-accurate bright leading characters with proper trails
- **Performance:** 30fps with efficient Canvas rendering and hardware acceleration
- **Responsive:** Auto-calculates columns based on screen width
- **Clean Integration:** Transparent backgrounds allow rain to show through UI gaps

### **Rendering Strategy:**
1. **Dual-Layer Rendering:** Fade layer followed by character layer for clean trails
2. **Progressive Fade:** Optimized fade opacity (`rgba(13, 17, 23, 0.2)`) prevents muddy background
3. **Character Hierarchy:** Bright leaders (`#c8ffc8`) over standard trails (`#70ab6c`)
4. **Memory Management:** Proper cleanup of animation frames and event listeners

---

## 8. Data Structure & Pipeline Adherence

- The frontend relies on `public/enriched-data.json` having all top-level fields required by the UI (e.g., `id`, `name`, `image`, `role`, `expandedView`).
- The data pipeline is responsible for promoting these fields from the raw markdown data.
- See `docs/data pipeline.md` and `docs/troubleshooting.md` for canonical data structures and debugging steps.

---

## 9. DOM & HTML Structure

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

---

## 10. Smooth Scrolling Navigation (2025 Update)

The application implements buttery smooth scrolling through a dual approach:

### Global CSS Implementation
- **Automatic Behavior:** All native anchor links (`<a href="#section">`) automatically scroll smoothly due to the global CSS rule in `src/styles/custom.css`
- **Browser Native:** Uses the browser's built-in `scroll-behavior: smooth` for optimal performance
- **Zero Configuration:** No component-level implementation needed for standard anchor links

### JavaScript Utility for Programmatic Scrolling
- **Utility Function:** Located in `src/utils/navigationUtils.ts` with the `scrollToElementById` function
- **Usage Pattern:** Import and use in onClick handlers or other events for programmatic navigation
- **Error Handling:** Includes proper error logging when target elements are not found
- **Consistent Experience:** Provides the same smooth behavior as CSS anchor links

### Integration Points
- **Components:** Any component can use the utility function for custom scroll behavior
- **Accessibility:** Maintains focus and provides visual continuity for screen readers
- **Performance:** Uses native browser smooth scrolling for optimal performance
- **Fallback:** Older browsers gracefully fall back to instant scrolling without breaking functionality

---

## 11. Getting Started for New Developers

### **Understanding the Data Flow**
1. **Start with the data**: Examine `public/enriched-data.json` to understand the data structure
2. **Follow the pipeline**: Review `docs/data pipeline.md`

---

## Modal & Overlay System
- The expanded card modal (`ItemCardModal.tsx`) now uses a single scroll container for all content (image, name, role, details).
- Modal locks background scroll when open using the `useScrollLock.ts` hook.
- Clicking outside the modal content closes the modal (overlay is a button for accessibility).
- Close button remains fixed and accessible.
- All modal interactions are keyboard-navigable (Escape key closes modal, Tab order preserved).
- Overlay and modal use proper ARIA roles and labels for accessibility.

---

## Collections System
- The collection button (+) in `CollectionCardButton.tsx` is now perfectly centered, larger, and more visually prominent.
- Button uses bolder font, stronger glow, and improved hover/focus states.
- Button is accessible: uses ARIA labels and is keyboard focusable.
- Popover menu is positioned correctly and only one can be open at a time.
