# System Behavior & Development FAQ

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

### 📱 Text Display & Truncation (2025 Update)

**How are character names displayed in cards?**
- Character names use responsive text sizing (`text-sm`) optimized for the 113px card width.
- Names are displayed with `overflow-hidden text-ellipsis` and proper flex layout (`flex-1 min-w-0`) to prevent truncation issues.
- Longer names are gracefully truncated with "..." rather than being cut off mid-word.
- The deprecated `@tailwindcss/line-clamp` plugin has been removed in favor of built-in Tailwind utilities.

**Why was the line-clamp plugin removed?**
- The `@tailwindcss/line-clamp` plugin was deprecated and caused compatibility issues with newer Tailwind versions.
- Built-in Tailwind utilities (`overflow-hidden text-ellipsis`) provide better performance and reliability.
- The new approach ensures consistent text display across all browsers and devices.

---

### 🎮 CRT Terminal UI & Interactions (2025 Update)

**What are the new CRT visual effects?**
- The search bar now features authentic CRT terminal styling with:
  - Phosphor persistence: Characters briefly flash brighter green when typed
  - Cursor wake-up: 100ms elastic scale animation on first focus
  - Scan lines: Subtle horizontal lines that drift upward
  - Larger text size (28px) for better readability
  - Reduced vertical padding (`py-2`) for a more compact, terminal-like appearance
  - CRT glow effects on both text and borders
  - 4px spacing between text and the block cursor for improved clarity
  - Removed clear (X) button for cleaner terminal aesthetics
  - Disabled spell-check (`spellCheck={false}`) to prevent browser underlining on character names
  - Custom text selection styling with CRT green background and black text instead of default blue

**How do I interact with the search bar?**
- **Terminal Aesthetics:** The search bar provides an authentic CRT terminal experience
- **Text Entry:** Type character names or search terms with immediate visual feedback
  - Each character briefly flashes brighter green (#a8e6a8) when typed
  - Characters smoothly fade to standard color over 0.6 seconds
- **Block Cursor:** A blinking green block cursor appears 4px after your text when focused
  - Features a special "wake-up" animation on first focus
  - Maintains consistent blinking after initial animation
- **No Spell Check:** Browser spell-check is disabled to maintain clean terminal appearance
- **Text Selection:** Selecting text shows CRT green background with black text for consistency
- **Keyboard Navigation:** Fully accessible with standard keyboard shortcuts (Tab, Shift+Tab, etc.)

**What happens when there are no search results?**
- The interface maintains a clean, minimalist approach
- No "No results found" message is displayed
- The grid area remains empty but maintains proper spacing
- This design choice keeps the focus on the search bar and maintains the terminal aesthetic

**How do I interact with expanded character cards?**
- **Click anywhere** outside the card content to close the modal
- **Press Escape** to close the modal using keyboard navigation
- Character titles in the expanded view now use **nation-specific colors** (e.g., green for Earth Kingdom characters)
- All icons consistently use React Icons for a unified visual experience

**Why do character names have different colors in expanded view?**
- Character titles are now colored based on their nation affiliation:
  - **Green** for Earth Kingdom characters (like Bosco, Toph)
  - **Red** for Fire Nation characters (like Azula, Zuko)
  - **Blue** for Water Tribe characters (like Katara, Sokka)
  - **Orange** for Air Nomads (like Aang)
  - **Gray** for characters without clear nation affiliation
- This provides immediate visual context about the character's background

**Are there any accessibility improvements?**
- The modal system now includes proper keyboard navigation and focus management
- Click-to-close functionality includes proper event handling to prevent accidental closures
- All CRT effects maintain sufficient contrast for users with visual impairments
- Scrollbars remain clearly visible and interactive across different input methods
- Search bar maintains full keyboard accessibility despite custom cursor implementation
- Text selection uses high-contrast colors for improved readability

---

### 🏆 Search Result Ordering & Tag Matching (2024 Update)

**How are search results ordered?**
- Results are ranked by a robust scoring system:
  1. Exact tag match (e.g., 'bear' returns Bosco first if he has the tag 'bear').
  2. Gender/age/role match for gendered queries (e.g., 'boy', 'girl', 'male', 'female' boost characters with matching gender and age/role).
  3. Main cast/primary role (e.g., tags like 'protagonist', 'main', 'main_cast', 'lead').
  4. Partial tag match (e.g., 'knife' matches 'knife_thrower').
  5. Other matches (fallback).
- This ensures the most relevant results appear first for all tag-based queries.

**What is partial tag matching?**
- If your query is a substring of a tag, the entity will be included in results (e.g., 'knife' matches 'knife_thrower').
- Exact matches are always prioritized above partials.
- This makes search flexible and typo-tolerant, but may sometimes include tangential results. The hierarchy ensures the best matches are always at the top.
- **Exception:** For mutually exclusive queries like 'male' and 'female', partial tag matching is skipped and only exact matches are allowed. For example, searching 'male' will not return 'female', and vice versa.

**Examples:**
- Searching 'bear' returns Bosco first.
- Searching 'boy' returns Aang, Sokka, and Zuko first, then others.
- Searching 'knife' returns all entities with tags containing 'knife', but 'knife_thrower' will be prioritized if it is an exact match.

---

### 🐛 Data Pipeline & Error Handling

#### 1. Handling of Missing/Malformed `enriched-data.json`
If the primary data file at `public/enriched-data.json` is missing, fails to load, or contains malformed JSON, the `fetch` call within the `useEnrichedData` hook will fail. The application logs the error to the console but does not display a user-facing error message, showing a fallback UI (e.g., a "Loading..." or blank state) instead.

#### 2. Error Handling in the Search Index Pipeline
Since search indexing is performed client-side, errors during index creation (e.g., from a malformed record that slipped past the enrichment script) are caught within the `useSearch` hook. These errors are logged to the browser console. To the user, a failed index build will manifest as the "No Results Found" component, as the search will return no matches.

#### 3. Handling of Missing Fields in Records
The data pipeline is designed to enforce data integrity. The enrichment script (`scripts/2-enrich-data.mjs`) should ideally catch records with missing required fields and fail the build. If an incomplete record makes it to the frontend, UI components are built to handle missing data gracefully, typically by rendering a fallback value (e.g., "Unknown" for a missing `nation`) or omitting the element.

#### 4. Handling of Deprecated/Legacy Data Fields
Deprecated fields from the raw data are ignored by the data pipeline. The enrichment and parsing scripts are the single source of truth for the data schema. Only fields defined in the canonical data structures (`src/types/`) are processed and included in the final `public/enriched-data.json`.

#### 5. Handling Errors and Logging in New Code
Never use empty `catch` blocks. All errors must be logged to the console with sufficient context for debugging. If an error is user-actionable, it should be surfaced in the UI. Use assertions and type-guards to catch potential errors early during development.

---

### 🎨 Frontend UI & User Experience

#### 6. Image Fallbacks
If a card image fails to load, the `useImageFallback` hook (located in `src/hooks/useImageFallback.ts`) intercepts the error. The hook now provides a `status` state (`'loading' | 'loaded' | 'error'`), `handleImageError`, and `handleImageLoad` callbacks, and robust fallback logic. This ensures the UI remains visually consistent and does not show broken image links, always providing a placeholder or fallback icon as needed.

#### 7. Keyboard Accessibility & Focus Management
The application prioritizes accessibility. Interactive elements like modals and expanded cards use a focus-trapping mechanism managed by the `useModalFocus.ts` hook. This ensures that keyboard focus remains within the active component. All interactive elements must be fully keyboard-navigable (Tab, Shift+Tab, Enter) and use semantic HTML with appropriate ARIA roles. See `docs/styling.md` for detailed requirements.

#### 8. Mobile & Touch Interactions
The application is fully responsive. Layouts, components, and interactive controls are designed with touch-friendly hit targets. Modals and other overlays are optimized for mobile viewports, featuring larger tap areas and native scroll behavior to ensure a smooth user experience.

#### 9. Custom Font Loading
Custom web fonts are self-hosted in the `public/assets/fonts/` directory and are loaded via `@font-face` rules in `src/styles/custom.css`. The CSS font stack is configured with standard system fallbacks, so if a custom font fails to load, the browser will seamlessly render the next available font.

#### 10. Markdown Rendering
Markdown content, primarily used in the expanded card views, is rendered using the `react-markdown` library with the `remark-gfm` plugin for GitHub Flavored Markdown support. Custom components are used for styling specific markdown elements like headings and links to match the application's theme.

#### 11. Modal and Overlay Management
Modals utilize the `useModalFocus.ts` hook for focus trapping and ARIA roles for accessibility. Only one modal can be open at a time. Upon closing, focus is programmatically returned to the element that triggered the modal.

#### 12. Adding/Updating Images and Static Assets
Place all new images in `public/assets/images/` and reference them using relative paths (e.g., `/assets/images/my-image.png`). Do not import image assets directly into TypeScript/TSX files, as this can interfere with Vite's optimized asset handling.

#### 13. API Endpoints and Config
All API endpoints and static resource paths are now centralized in `src/config/constants.ts` for maintainability and consistency.

---

### 🏗️ Application Architecture & State

#### 14. State Persistence on Reload
The application state, including the current search query and any expanded card IDs, is managed in-memory using React state hooks. There is no persistence layer (like `localStorage` or `sessionStorage`). A page reload will reset the application to its default initial state.

#### 15. Browser History & Modal State
The state of UI overlays like modals is not currently synchronized with the browser's history stack. This means using the browser's "back" or "forward" buttons will not close or open a modal. Navigation is managed independently of the UI overlay state.

#### 16. React ErrorBoundary Behavior
The root application is wrapped in a custom `ErrorBoundary` component (see `src/components/ErrorBoundary.tsx`). If a critical rendering error occurs in a child component, this boundary will catch it and display a user-friendly fallback UI instead of a blank page or a crashed application.

#### 17. Analytics & Telemetry
The application is privacy-first. There are no analytics, user tracking, or telemetry scripts included in the codebase.

#### 18. Internationalization (i18n) Readiness
All user-facing strings must be externalized from components and prepared for future internationalization. Do not hardcode user-visible text directly in the JSX. A central string management solution should be used.

#### 19. Environment Variables
This project does not use environment variables (`.env` files) for runtime configuration. All configuration is managed via static files (e.g., `tailwind.config.js`, `vite.config.ts`) or hardcoded constants within the source code.

---

### ⚙️ Development & Maintenance

#### 20. Adding a New Nation Color/Theme
To add a theme for a new nation, two files must be updated:
1.  **`src/theme/nationThemes.ts`**: Add a new entry to the `nationThemeMap` object, defining the color identifiers for the new nation.
2.  **`tailwind.config.js`**: Add the corresponding color classes (e.g., `bg-nation-new`, `border-nation-new`) to the `theme` configuration and safelist. After changes, run `npm run build:tailwind`.

#### 21. Upgrading Core Dependencies
All dependencies are pinned in `package.json` for stability. To upgrade a package, manually update its version, delete `node_modules` and `package-lock.json`, and run `npm install`. Thoroughly test the application locally for breaking changes. `FlexSearch` is specifically pinned and should not be upgraded without careful verification.

#### 22. Hot Module Reload (HMR) Caveats
The project uses Vite, which provides excellent HMR for React components and most styles. However, changes to global configuration files require a manual step:
-   **`tailwind.config.js`**: Changes require running `npm run build:tailwind` and a full page reload.
-   **Global CSS (`custom.css`)**: Changes may require a full page reload to apply correctly.

#### 23. Adding and Running Tests
To add a new test, create a file with a `.test.ts` or `.test.tsx` suffix in the same directory as the module being tested. Use Jest and React Testing Library. To run all tests, execute `npm test`.

#### 24. Performance Profiling
To identify performance bottlenecks, use the React DevTools Profiler. Apply memoization techniques (`React.memo`, `useMemo`, `useCallback`) only after a clear need has been identified through profiling.

#### 25. Updating or Removing Dependencies
Run `npm outdated` to check for new versions. Use `npm uninstall <package-name>` to remove unused packages and then run `npm install` to update the `package-lock.json` file. Keeping dependencies clean is a project requirement.

#### 26. Creating Custom Scripts
New automation or utility scripts should be placed in the `scripts/` directory. Document their purpose with comments and add a corresponding command to the `"scripts"` section of `package.json` for easy execution.

#### 27. Contributing Changes
This project follows a trunk-based development model. Work directly on the `main` branch. Before committing, ensure all code passes local checks (`npm run lint`, `npm run type-check`). There are no pull requests or feature branches.

#### 28. Experimenting with AI-driven Changes
To safely test changes, especially those generated by AI, follow the sandbox workflow detailed in `docs/sandbox_env.md`. All significant changes must be validated in a sandbox environment before being committed to the main branch.

#### 29. Getting Help or Reporting a Bug
First, consult this FAQ and other project documentation. If the issue is not covered, add a new, concise entry to this FAQ or document the bug in the designated project management tool.

---

### 🌧️ Matrix Rain & Glassmorphism Effects (2025 Update)

**What is the Matrix Rain effect?**
- The application now features an authentic Matrix-style digital rain background using HTML5 Canvas
- Characters are randomly generated Japanese Katakana and binary symbols, just like in the movies
- The effect runs at 30fps with hardware acceleration for smooth performance
- Bright green leading characters (`#c8ffc8`) trail behind with standard green (`#70ab6c`) for movie accuracy

**How does the Matrix Rain integrate with the UI?**
- **Glassmorphism Cards:** Character cards use semi-transparent backgrounds with backdrop blur
- **Transparent Gaps:** The grid background is transparent so rain flows between cards
- **Matrix Glow Hover:** Cards glow with CRT green effects when hovered, maintaining the cyberpunk aesthetic
- **Performance Optimized:** Uses efficient Canvas rendering with proper memory management

**Why was the old CSS rain effect replaced?**
- The previous implementation used 287 lines of CSS with 24 hardcoded `<div>` elements
- It had no real randomness - just predetermined character sequences
- Performance was poor due to excessive DOM manipulation
- The new Canvas solution is 80 lines, truly random, and much more performant

**Can I disable the Matrix Rain effect?**
- The effect respects the `prefers-reduced-motion` accessibility setting
- Users with motion sensitivity will see a static or minimal version
- The application maintains full functionality without the animated background

**How do glassmorphism effects work?**
- Cards use `backdrop-filter: blur()` for the frosted glass effect
- Semi-transparent backgrounds allow the Matrix rain to show through
- Hover states add Matrix green glow with multiple box-shadow layers
- Cross-browser support includes Safari `-webkit-backdrop-filter` fallbacks

**What happens if my browser doesn't support backdrop filters?**
- The application gracefully falls back to higher opacity backgrounds
- All functionality remains intact with slightly less transparency
- Modern browsers (Chrome 76+, Firefox 103+, Safari 9+) fully support the effects

**Are there any performance considerations?**
- The Matrix Rain uses `requestAnimationFrame` for smooth 30fps animation
- Canvas rendering is hardware-accelerated with `will-change: transform`
- Window resize events are properly debounced to prevent excessive recalculations
- Memory cleanup occurs on component unmount to prevent leaks

---

### 📁 Collections System

**Where are my collections stored?**
- Collections are stored in your browser's `localStorage`
- They never leave your device or sync to any server
- Data persists between sessions but is limited to your current browser

**How do I add items to a collection?**
- Click the + button on any character card
- Select an existing collection or create a new one
- A temporary checkmark will appear to confirm the addition
- The checkmark disappears after 1.5 seconds

**Can I view my collections?**
- Yes, use the collections sidebar on the left
- Shows all your collections with item counts
- Click a collection to filter the view to just those items
- Click "All Items" to return to the full view

**How do I create a new collection?**
- Use the "Create new collection" button in the collections sidebar
- Or click the + on any card and choose "Create new collection"
- Collection names must be unique
- Empty collections are allowed

**Are there limits to collections?**
- No limit on number of collections
- No limit on items per collection
- Limited only by your browser's localStorage capacity
- Items can be in multiple collections simultaneously

**What happens if I clear my browser data?**
- Collections stored in localStorage will be cleared
- Consider exporting important collections (feature coming soon)
- No way to recover cleared collections

**Can I share my collections?**
- Currently collections are private to your browser
- Sharing feature planned for future updates
- Export/import functionality coming soon