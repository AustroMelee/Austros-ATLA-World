# 🏗️ Frontend Architecture & Logic (2025 Matrix Update)

The frontend is organized around a clear separation of concerns, with a central container managing state and data flow to presentational components. The search system is now fully client-side for maximum robustness and transparency. **NEW:** Added authentic Matrix-style digital rain background with glassmorphism card effects for a cyberpunk terminal aesthetic.

---

## 1. HomeContainer.tsx: The Central Orchestrator

- **Data Fetching:** On initial load, fetches `public/enriched-data.json` (the only data file used by the app) using the `useEnrichedData` hook.
- **State Management:** Manages the user's search query and the `expandedCardId` for modal views.
- **Search Logic:** Calls the `useSearch` hook, passing the full dataset and the current query.
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

## 3. Custom Hooks: useSearch, useEnrichedData, useImageFallback

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

## 4. Presentational Layer (Home.tsx)

- Purely presentational; receives all data and handlers as props from `HomeContainer`.
- Renders the main layout, including the `SearchBar` and the `EntityGrid`.
- **Matrix Integration:** Background remains transparent to allow Matrix rain to show through card gaps

---

## 5. Enhanced Search Bar (SearchBar.tsx) - 2025 Update

- **Terminal Aesthetic:** Provides an authentic CRT terminal experience with custom Glass_TTY_VT220 font
- **Typography:** Uses 28px font size for enhanced readability with reduced padding (`py-2`) for compact appearance
- **Custom Cursor:** Features a blinking green block cursor positioned 4px after text for authentic terminal feel
- **CRT Effects:** Includes comprehensive CRT styling with glow effects, border effects, and scan-line dithering
- **User Experience Enhancements:**
  - **Disabled Spell Check:** `spellCheck={false}` prevents browser underlining on character names
  - **Custom Text Selection:** CRT green background with black text instead of default blue highlighting
  - **Removed Clear Button:** Cleaner interface without X/clear button for authentic terminal appearance
  - **Hidden Native Caret:** Uses `caretColor: 'transparent'` to show only the custom block cursor
- **Accessibility:** Maintains full keyboard navigation and screen reader compatibility despite custom styling
- **Implementation:** Uses absolute positioning with invisible measurement span for pixel-perfect cursor placement

---

## 6. Card Grid & Modal System with Glassmorphism Effects

- **`EntityGrid.tsx`:**
  - Receives the array of search results and the `expandedCardId`.
  - Renders a responsive grid of `ItemCard` components.
  - **Matrix Integration:** Uses `bg-transparent` to allow Matrix rain to flow through gaps between cards
  - Dynamically sets the `expanded` and `onExpand` props for each card.

- **`ThemedCard.tsx` (2025 Glassmorphism Update):**
  - **Glassmorphism Effects:** Semi-transparent background with `backdrop-blur-sm` for depth
  - **Matrix Glow on Hover:** CRT green glow effects using multiple box-shadow layers
  - **Animated Pulse Background:** Subtle matrix-pulse animation using `::before` pseudo-element
  - **Nation-Themed Borders:** Maintains nation-specific colors while adding Matrix green hover enhancement
  - **Minimal Scale Effect:** Very gentle 1.02x scale on hover to maintain card dimensions
  - **Cross-Browser Support:** Includes `-webkit-backdrop-filter` for Safari compatibility

- **`ItemCard.tsx`:**
  - Renders both the collapsed grid card and the full-screen expanded modal view.
  - **Collapsed Card Features:**
    - Fixed width of 113px with responsive text sizing (`text-sm` for optimal fit)
    - Uses `flex-1 min-w-0` layout to ensure proper text truncation with ellipsis
    - Displays character name with `overflow-hidden text-ellipsis` for graceful handling of long names
    - **Matrix Transparency:** Removed `bg-background` to prevent grey boxes blocking Matrix rain
    - Shows nation icon alongside the name in a flex container
    - Displays badge/role information with fallback logic for different data locations
  - **Expanded Modal Features (2025 Update):**
    - Full-screen, responsive modal overlay with detailed entity view
    - **Nation-Colored Titles:** Card titles now use nation-specific colors (e.g., green for Earth Kingdom characters like Bosco)
    - **Click-to-Close:** Users can click anywhere outside the content area to close the modal
    - **Keyboard Navigation:** Escape key closes the modal with proper accessibility support
    - **React Icons Consistency:** All icon displays use React Icons for consistent styling
    - Large image display with scrollable text content and custom CRT-themed scrollbars
    - Uses the `useImageFallback` hook for robust image handling
  - **Type:** `EnrichedEntity` (defined in `src/search/types.ts`)
  - Contains all top-level fields needed for display: `name`, `nation`, `role`, `slug`, `expandedView`, `image`, etc.

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

## 10. Getting Started for New Developers

### **Understanding the Data Flow**
1. **Start with the data**: Examine `public/enriched-data.json` to understand the data structure
2. **Follow the pipeline**: Review `docs/data pipeline.md` to understand how data is processed
3. **Trace the search**: Look at `src/hooks/useSearch.ts` to see how client-side indexing works
4. **Examine components**: Start with `HomeContainer.tsx` and follow the prop flow down

### **Making Your First Change**
1. **UI changes**: Most visual changes happen in `src/components/ItemCard/ItemCardCollapsed.tsx`
2. **Search changes**: Modify `src/search/preprocessor.ts` to change what fields are searchable
3. **Data changes**: Edit markdown files in `raw-data/characters/` then run `npm run build:data`
4. **Style changes**: Update Tailwind classes, then run `npm run build:tailwind`

### **Essential Commands**
```bash
# Development workflow
npm run dev                    # Start development server
npm run build:data            # Rebuild data from markdown
npm run build:tailwind        # Rebuild CSS after style changes
npm run type-check            # Check TypeScript errors
npm run lint:fix              # Fix linting issues

# Testing and validation
npm test                      # Run test suite
npm run validate:data         # Validate data integrity
```

### **Key Files to Know**
- `src/pages/HomeContainer.tsx` - Central state management
- `src/components/ItemCard/ItemCardCollapsed.tsx` - Card display logic
- `src/hooks/useSearch.ts` - Search functionality
- `docs/troubleshooting.md` - When things go wrong
- `projectrules.mdc` - Project conventions and rules

### **Common Tasks**
- **Add new character**: Create markdown file in `raw-data/characters/`, run `npm run build:data`
- **Fix search issues**: Check `src/search/preprocessor.ts` and `docs/troubleshooting.md`
- **Update styling**: Modify Tailwind classes, run `npm run build:tailwind`
- **Debug data issues**: Check `public/enriched-data.json` first, then trace backwards