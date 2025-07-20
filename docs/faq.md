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

**How do I interact with expanded food cards?**
- **Click anywhere** outside the card content to close the modal
- **Press Escape** to close the modal using keyboard navigation
- Food titles in the expanded view use **category-specific colors** (e.g., green for vegetables, red for meat)
- All icons consistently use React Icons for a unified visual experience

**Why do food names have different colors in expanded view?**
- Food titles are now colored based on their category:
  - **Green** for vegetables and vegetarian foods (like Cabbage Noodles, Steamed Vegetables)
  - **Red** for meat and fish dishes (like Bison Steak, Fish Cakes)
  - **Blue** for beverages and soups (like Bubble Tea, Sea Prune Stew)
  - **Orange** for desserts and sweets (like Blueberry Cookies, Fruit Pie)
  - **Gray** for foods without clear category affiliation
- This provides immediate visual context about the food's type and dietary classification

**Are there any accessibility improvements?**
- The modal system now includes proper keyboard navigation and focus management
- Click-to-close functionality includes proper event handling to prevent accidental closures
- All CRT effects maintain sufficient contrast for users with visual impairments
- Scrollbars remain clearly visible and interactive across different input methods
- Search bar maintains full keyboard accessibility despite custom cursor implementation
- Text selection uses high-contrast colors for improved readability

---

### 🎬 Episode Processing & Display (2025 January Update)

**How do episodes work in the system?**
- **Episode Type Support:** Episodes use `type: episode` in YAML frontmatter
- **Canonical Structure:** Episodes follow the same markdown structure as all other entity types
- **UI Integration:** Episodes display with proper type labels and episode-specific metadata
- **Data Pipeline:** Episodes go through the same type-agnostic processing as other data types

**What episode metadata is available?**
- **Book/Season Field:** Water, Earth, Fire season classification
- **Episode Number Field:** Episode number in 1x01 format
- **Air Date Field:** Original air date information
- **Narrative Context:** Episode background and story information
- **Character References:** Links to characters appearing in the episode
- **Location References:** Links to locations featured in the episode

**How do I create a new episode file?**
- **Template Structure:** Use exact template from `raw-data/episodes/templates/episode_template.md`
- **Image Field:** Always include `"image": "episode-filename.jpg"` in JSON metadata (CRITICAL)
- **S1Ex Title Prefix:** Use `"title": "S1Ex - Episode Title"` in JSON metadata (CRITICAL)
- **Data Pipeline:** Run `npm run build:data` after creating episode file
- **Development Server:** Restart `npm run dev` to pick up new episode data
- **Verification:** Check UI to confirm episode appears correctly

**Why do episode cards show placeholder text instead of images?**
- **Missing Image Field:** Episode JSON metadata missing `image` field
- **Filename Mismatch:** Image filename doesn't match actual file in `public/assets/images/`
- **Solution:** Add `"image": "exact-filename.jpg"` to episode JSON metadata
- **Prevention:** Always include image field when creating new episode files

**How does episode title parsing work?**
- **Flexible Regex:** Parser uses flexible regex pattern that handles emoji presence in headers
- **Emoji Support:** Headers like `## 📖 UI - EXPANDED VIEW` parse correctly
- **Header Variations:** All header variations are supported by the flexible regex pattern
- **Content Extraction:** Expanded view content is extracted correctly regardless of emoji presence

**What if episode files don't appear in UI after creation?**
- **Timing Issue:** Episode file may not be included in initial processing run due to file system synchronization
- **Solution:** 
  1. Rebuild data pipeline: `npm run build:data`
  2. Restart development server: `npm run dev`
  3. Verify episode is in enriched data
- **Prevention:** Always rebuild data pipeline after creating new episode files

**How do I troubleshoot episode processing issues?**
- **Check Parser Support:** Ensure parser supports `type: episode` in supported types array
- **Verify File Structure:** Use exact template structure with proper YAML frontmatter
- **Check Image Field:** Ensure episode JSON metadata includes `image` field with valid filename
- **Rebuild Pipeline:** Run `npm run build:data` to regenerate with proper episode processing
- **Check Enriched Data:** Verify episode appears in `public/enriched-data.json`

**What episode creation workflow should I follow?**
1. **Create File:** Use exact template structure from episode template
2. **Include Image Field:** Add `"image": "episode-filename.jpg"` to JSON metadata (CRITICAL)
3. **Use S1Ex Prefix:** Use `"title": "S1Ex - Episode Title"` in JSON metadata (CRITICAL)
4. **Rebuild Pipeline:** Run `npm run build:data` to process new episode
5. **Restart Server:** Run `npm run dev` to pick up new episode data
6. **Verify Appearance:** Check UI for new episode card with correct image and title

---

### 🏆 Enhanced Filtering System (2025 Update)

**What new filtering options are available?**
- **Age Range Filters:** Child, teen, young adult, adult, elder for character classification
- **Gender Filters:** Male/female filters with visual icons (♂/♀)
- **Bender Classification:** Bender/nonbender filters for character classification
- **Enhanced Nation Filtering:** Partial string matching for full nation names
- **Comprehensive Sub-Filters:** Dynamic filters based on selected categories
- **Food Category Filters:** 12 comprehensive food sub-categories with React emojis

**How does age range filtering work?**
- **Child:** Characters like Toph (12 years old during main series)
- **Teen:** Characters like Aang, Katara, Sokka, Zuko (12-17 years old)
- **Young Adult:** Characters like Azula, Ty Lee, Mai (18-25 years old)
- **Adult:** Characters like June, Iroh, Pakku (26-50 years old)
- **Elder:** Characters like Hama, King Bumi, Monk Gyatso (50+ years old)
- **Animal Exclusion:** Animals (bison, lemur, bear, animal, spirit) are excluded from age filters

**How does gender filtering work?**
- **Male:** Characters with gender: "male" field
- **Female:** Characters with gender: "female" field
- **Visual Indicators:** React icons (♂/♀) for clear visual distinction
- **Multi-Select:** Can select both male and female simultaneously

**How does bender classification work?**
- **Bender:** Characters with isBender: true and bendingElement field
- **Nonbender:** Characters with isBender: false or missing bendingElement
- **Comprehensive Coverage:** All characters now have proper bender classification
- **Element Display:** Bender filters show the specific bending element when applicable

**What is the filtering order?**
The system applies filters in this specific sequence:
1. **Collection Filter:** If active collection is selected
2. **Nation Filter:** Filter by selected nations (case-insensitive)
3. **Core Filter:** Filter by entity type (characters, locations, etc.)
4. **Sub Filter:** Filter by tags, age ranges, gender, and bender classification
5. **Search Filter:** Apply text search to the filtered dataset

**How do I use the filtering system?**
- **Nations:** Click nation buttons to filter by Fire, Water, Earth, Air (multi-select)
- **Categories:** Click category buttons to filter by main entity types (single-select)
- **Subcategories:** Dynamic buttons appear when a category is selected (multi-select)
- **Age/Gender/Bender:** Available when "characters" category is selected
- **Food Categories:** Available when "foods" category is selected
- **Visual Feedback:** Active filters are highlighted with different colors
- **Clear Filters:** Click active filters to deselect them

---

### 🍽️ Food Category Filtering (2025 Update)

**What food categories are available?**
- **12 Sub-Categories:** beverages, desserts, soups, meat, vegetables, noodles, dumplings, preserved, street food, traditional, vegetarian, luxury, ceremonial, health, fire-themed, seafood
- **React Emojis:** Each sub-filter includes React emoji with descriptive text labels
- **Multi-Select:** Multiple food categories can be selected simultaneously
- **Comprehensive Coverage:** All 98 food items categorized into appropriate sub-filters

**How do food nation filters work?**
- **Nation Symbols:** All food items display nation symbols in cards
- **Nation Integration:** Food items have proper nation affiliations (Fire Nation, Earth Kingdom, etc.)
- **Symbol Display:** NationIcon component maps nation strings to React icons
- **Consistent Theming:** Nation symbols use consistent styling across all entity types

**Why are some food items not showing in filters?**
- **Missing Nation Values:** Food items may be missing `nation` field in data
- **Missing Category Tags:** Food items may not have proper category tags
- **Enrichment Issues:** Data pipeline may not have processed category tags correctly
- **Solution:** Run `npm run build:data` to regenerate with proper categorization

**How do I troubleshoot food filtering issues?**
- **Check Data:** Verify `public/enriched-data.json` has proper nation and category fields
- **Verify Tags:** Ensure food items have appropriate category tags
- **Rebuild Data:** Run `npm run build:data` to regenerate with proper categorization
- **Check UI:** Verify sub-filter buttons appear when "foods" category is selected

**What are the food category examples?**
- **Beverages:** Air Nomad Style Tea, Butter Tea, Bubble Tea, Cactus Juice
- **Desserts:** Blueberry Cookies, Candied Jackfruit Pie, Cotton Candy, Egg Custard Tart
- **Soups:** Beetle-Worm Soup, Blood Soup, Dumpling Weed Soup, Five-Flavor Soup
- **Meat:** Bison Steak, Braised Turtle Duck, Fish Cakes, Foggy Swamp Chicken
- **Vegetables:** Cabbage Noodles, Steamed Vegetables, Tofu Curry, Kale Wraps
- **Noodles:** Cabbage Noodles, Noodles, Seaweed Noodles, Spiral-Shaped Noodles
- **Dumplings:** Air Nomad Dumplings, Dragon Dumplings, Dumplings, Steamed Dumplings
- **Preserved:** Dried Fish, Freeze-Dried Cucumberquats, Pickled Fish, Smoked Sea Slug
- **Street Food:** Fried Fish Balls, Fried Foods on Sticks, Meat Kebabs
- **Traditional:** Sea Prune Stew, Tsampa, Mochi, Sweet Red Bean Cake
- **Vegetarian:** Air Nomad Dumplings, Cabbage Noodles, Steamed Vegetables, Tofu Curry
- **Luxury:** Bison Steak, Braised Turtle Duck, Dragon Dumplings
- **Ceremonial:** Blood Soup, Five-Flavor Soup, Yue's Mooncakes
- **Health:** Chi-Enhancing Tea, Kale Smoothie, Kale Wraps, Steamed Vegetables
- **Fire-themed:** Azula's Lightning, Fire Cakes, Fire Gummies, Flaming Fire Flakes
- **Seafood:** Crab Urchin Stir-Fry, Fish Cakes, Sea Prune Stew, Sea Squid Soup

---

### 🏛️ Nation Integration Issues (2025 Update)

**Why are nation symbols not displaying on food cards?**
- **Missing Nation Values:** Food items may be missing `nation` field in data
- **Incorrect Format:** Nation values may not match expected format (e.g., "Fire Nation", "Earth Kingdom")
- **Enrichment Issues:** Data pipeline may not have mapped `region` to `nation` correctly
- **Solution:** Check `scripts/lib/enrichRecord.mjs` for proper nation mapping

**How do nation filter buttons work with food data?**
- **Partial Matching:** Filter buttons use single words ("fire", "earth", "water", "air")
- **Data Format:** Food data contains full names ("Fire Nation", "Earth Kingdom", etc.)
- **Matching Logic:** System matches "fire" within "Fire Nation", "earth" within "Earth Kingdom"
- **Multi-Select:** Multiple nations can be selected simultaneously (OR logic)

**What if food items have inconsistent nation values?**
- **Data Validation:** Check `public/enriched-data.json` for consistent nation values
- **Enrichment Process:** Verify `scripts/lib/enrichRecord.mjs` normalizes nation values
- **Rebuild Data:** Run `npm run build:data` to regenerate with proper nation mapping
- **Test Filtering:** Verify nation filters work with specific food items

**How are nation symbols displayed in the UI?**
- **NationIcon Component:** Maps nation strings to React icons
- **Consistent Display:** All entity types (characters, groups, foods) show nation symbols
- **Visual Theming:** Nation symbols use consistent styling across all cards
- **Fallback Handling:** Graceful handling of missing or invalid nation values

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

#### 6. Character Classification Data Issues
**What if a character is missing age range, gender, or bender classification?**
- The enrichment script validates and ensures all characters have proper classification fields
- Missing fields are logged during the build process
- Characters without proper classification may not appear in relevant filters
- Always run `npm run build:data` to validate data integrity

**How are animals handled in age filters?**
- Animals (bison, lemur, bear, animal, spirit) are automatically excluded from age range filters
- This prevents inappropriate classification of non-human entities
- Examples: Appa (Sky Bison), Momo (Lemur), Bosco (Bear) are excluded

---

### 🎨 Frontend UI & User Experience

#### 7. Image Fallbacks
If a card image fails to load, the `useImageFallback` hook (located in `src/hooks/useImageFallback.ts`) intercepts the error. The hook now provides a `status` state (`'loading' | 'loaded' | 'error'`), `handleImageError`, and `handleImageLoad` callbacks, and robust fallback logic. This ensures the UI remains visually consistent and does not show broken image links, always providing a placeholder or fallback icon as needed.

#### 8. Keyboard Accessibility & Focus Management
The application prioritizes accessibility. Interactive elements like modals and expanded cards use a focus-trapping mechanism managed by the `useModalFocus.ts` hook. This ensures that keyboard focus remains within the active component. All interactive elements must be fully keyboard-navigable (Tab, Shift+Tab, Enter) and use semantic HTML with appropriate ARIA roles. See `docs/styling.md` for detailed requirements.

#### 9. Mobile & Touch Interactions
The application is fully responsive. Layouts, components, and interactive controls are designed with touch-friendly hit targets. Modals and other overlays are optimized for mobile viewports, featuring larger tap areas and native scroll behavior to ensure a smooth user experience.

#### 10. Custom Font Loading
Custom web fonts are self-hosted in the `public/assets/fonts/` directory and are loaded via `@font-face` rules in `src/styles/custom.css`. The CSS font stack is configured with standard system fallbacks, so if a custom font fails to load, the browser will seamlessly render the next available font.

#### 11. Markdown Rendering
Markdown content, primarily used in the expanded card views, is rendered using the `react-markdown` library with the `remark-gfm` plugin for GitHub Flavored Markdown support. Custom components are used for styling specific markdown elements like headings and links to match the application's theme.

#### 12. Modal and Overlay Management
Modals utilize the `useModalFocus.ts` hook for focus trapping and ARIA roles for accessibility. Only one modal can be open at a time. Upon closing, focus is programmatically returned to the element that triggered the modal.

#### 13. Adding/Updating Images and Static Assets
Place all new images in `public/assets/images/` and reference them using relative paths (e.g., `/assets/images/my-image.png`). Do not import image assets directly into TypeScript/TSX files, as this can interfere with Vite's optimized asset handling.

#### 14. API Endpoints and Config
All API endpoints and static resource paths are now centralized in `src/config/constants.ts` for maintainability and consistency.

---

### 🏗️ Application Architecture & State

#### 15. State Persistence on Reload
The application state, including the current search query and any expanded card IDs, is managed in-memory using React state hooks. There is no persistence layer (like `localStorage` or `sessionStorage`). A page reload will reset the application to its default initial state.

#### 16. Browser History & Modal State
The state of UI overlays like modals is not currently synchronized with the browser's history stack. This means using the browser's "back" or "forward" buttons will not close or open a modal. Navigation is managed independently of the UI overlay state.

#### 17. React ErrorBoundary Behavior
The root application is wrapped in a custom `ErrorBoundary` component (see `src/components/ErrorBoundary.tsx`). If a critical rendering error occurs in a child component, this boundary will catch it and display a user-friendly fallback UI instead of a blank page or a crashed application.

#### 18. Analytics & Telemetry
The application is privacy-first. There are no analytics, user tracking, or telemetry scripts included in the codebase.

#### 19. Internationalization (i18n) Readiness
All user-facing strings must be externalized from components and prepared for future internationalization. Do not hardcode user-visible text directly in the JSX. A central string management solution should be used.

#### 20. Environment Variables
This project does not use environment variables (`.env` files) for runtime configuration. All configuration is managed via static files (e.g., `tailwind.config.js`, `vite.config.ts`) or hardcoded constants within the source code.

---

### ⚙️ Development & Maintenance

#### 21. Adding a New Nation Color/Theme
To add a theme for a new nation, two files must be updated:
1.  **`src/theme/nationThemes.ts`**: Add a new entry to the `nationThemeMap` object, defining the color identifiers for the new nation.
2.  **`tailwind.config.js`**: Add the corresponding color classes (e.g., `bg-nation-new`, `border-nation-new`) to the `theme` configuration and safelist. After changes, run `npm run build:tailwind`.

#### 22. Upgrading Core Dependencies
All dependencies are pinned in `package.json` for stability. To upgrade a package, manually update its version, delete `node_modules` and `package-lock.json`, and run `npm install`. Thoroughly test the application locally for breaking changes. `FlexSearch` is specifically pinned and should not be upgraded without careful verification.

#### 23. Hot Module Reload (HMR) Caveats
The project uses Vite, which provides excellent HMR for React components and most styles. However, changes to global configuration files require a manual step:
-   **`tailwind.config.js`**: Changes require running `npm run build:tailwind` and a full page reload.
-   **Global CSS (`custom.css`)**: Changes may require a full page reload to apply correctly.

#### 24. Adding and Running Tests
To add a new test, create a file with a `.test.ts` or `.test.tsx` suffix in the same directory as the module being tested. Use Jest and React Testing Library. To run all tests, execute `npm test`.

#### 25. Performance Profiling
To identify performance bottlenecks, use the React DevTools Profiler. Apply memoization techniques (`React.memo`, `useMemo`, `useCallback`) only after a clear need has been identified through profiling.

#### 26. Updating or Removing Dependencies
Run `npm outdated` to check for new versions. Use `npm uninstall <package-name>` to remove unused packages and then run `npm install` to update the `package-lock.json` file. Keeping dependencies clean is a project requirement.

#### 27. Creating Custom Scripts
New automation or utility scripts should be placed in the `scripts/` directory. Document their purpose with comments and add a corresponding command to the `"scripts"` section of `package.json` for easy execution.

#### 28. Contributing Changes
This project follows a trunk-based development model. Work directly on the `main` branch. Before committing, ensure all code passes local checks (`npm run lint`, `npm run type-check`). There are no pull requests or feature branches.

#### 29. Experimenting with AI-driven Changes
To safely test changes, especially those generated by AI, follow the sandbox workflow detailed in `docs/sandbox_env.md`. All significant changes must be validated in a sandbox environment before being committed to the main branch.

#### 30. Getting Help or Reporting a Bug
First, consult this FAQ and other project documentation. If the issue is not covered, add a new, concise entry to this FAQ or document the bug in the designated project management tool.

---

### 🌧️ Matrix Rain & Glassmorphism Effects (2025 Update)

**What is the Matrix Rain effect?**
- The application now features an authentic Matrix-style digital rain background using HTML5 Canvas
- Characters are randomly generated Japanese Katakana and binary symbols, just like in the movies
- The effect uses `requestAnimationFrame` for smooth 60fps animation with adaptive frame skipping
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
- The new Canvas solution is 122 lines, truly random, and much more performant

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
- The Matrix Rain uses `requestAnimationFrame` for smooth 60fps animation
- Canvas rendering is hardware-accelerated with `will-change: transform`
- Window resize events are properly debounced to prevent excessive recalculations
- Memory cleanup occurs on component unmount to prevent leaks
- **Modal Integration:** When a modal is open, the rain effect reduces intensity:
  - Frame skipping (3x slower animation)
  - Reduced fade opacity (0.15 vs 0.2)
  - Dimmed leading characters (`#70ab6c` vs `#c8ffc8`)
  - Reduced trail opacity (0.4 vs 0.7)
  - Overall canvas opacity reduced to 0.5

**What are the performance optimizations?**
- **requestAnimationFrame:** Replaces `setInterval` for smoother animation and better performance
- **Frame Skipping:** Reduces animation intensity when modal is open (3x frame skip)
- **Adaptive Opacity:** Reduces fade opacity from 0.2 to 0.15 when modal is open
- **Color Dimming:** Leading characters use dimmed color when modal is open
- **Trail Opacity:** Reduces trail opacity from 0.7 to 0.4 when modal is open
- **Canvas Opacity:** Reduces overall canvas opacity from 1 to 0.5 when modal is open

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

---

### 🔍 Multi-Layered Filtering System (2025 Update)

**How does the filtering system work?**
- The filtering system provides three layers of filtering: Nations, Categories, and Subcategories
- Filters are applied sequentially: Collections → Nations → Categories → Subcategories → Search
- All filters work together to narrow down results progressively

**What are the different filter types?**
- **Nations:** Multi-select buttons for Fire, Water, Earth, and Air nations
- **Categories:** Single-select buttons for main entity types (characters, foods, locations, bending, fauna, spirits)
- **Subcategories:** Dynamic multi-select buttons that appear when a category is selected

**How do I use the filters?**
- **Nation Filters:** Click any nation button to toggle it on/off (multiple nations can be selected)
- **Category Filters:** Click a category button to select it (only one category can be active at a time)
- **Subcategory Filters:** When a category is selected, relevant subcategory buttons appear below
- **Combining Filters:** You can use nations + categories + subcategories together for precise filtering

**What subcategories are available?**
- **Characters:** heroes, villains, mentors
- **Foods:** beverages, desserts, soups, meat, vegetables, noodles, dumplings, preserved, street food, traditional, vegetarian, luxury, ceremonial, health, fire-themed, seafood
- **Locations:** cities, temples, wilderness
- **Bending:** firebending, waterbending, earthbending, airbending
- **Fauna:** domestic, wild, spirit
- **Spirits:** benign, malevolent, neutral

**How do I clear filters?**
- **Nations:** Click an active nation button again to deselect it
- **Categories:** Click the active category button again to deselect it
- **Subcategories:** Click active subcategory buttons to deselect them
- **All Filters:** Deselect all filters manually, or refresh the page to reset

**Do filters work with search?**
- Yes! Search is applied after all other filters
- This means you can filter by nation/category first, then search within those results
- The search bar works on the filtered dataset, not the entire database

**How do filters work with collections?**
- Collections are applied first in the filtering pipeline
- If you have an active collection, all other filters work within that collection
- You can combine collection filtering with nation/category/subcategory filters

**How do nation filters work?**
- Nation filters use partial string matching to handle the data format
- Data contains full names: "Fire Nation", "Earth Kingdom", "Air Nomads", "Northern Water Tribe"
- Filter buttons use single words: "fire", "earth", "air", "water"
- The system matches "fire" within "Fire Nation", "earth" within "Earth Kingdom", etc.
- Multiple nations can be selected simultaneously (OR logic)
- Water filter matches both "Northern Water Tribe" and "Southern Water Tribe"

**How do sub-filters work?**
- Sub-filters use a mapping system to translate filter button terms to actual data values
- **Character Sub-filters:**
  - "villains" → matches "antagonist" and "villain" in data
  - "heroes" → matches "protagonist", "hero", "deuteragonist", and "mentor" in data
  - "mentors" → matches "mentor" in data
- **Food Sub-filters:**
  - "beverages" → matches food items with beverage category tags
  - "desserts" → matches food items with dessert category tags
  - "soups" → matches food items with soup category tags
  - And so on for all 12 food categories
- **Data Field Coverage:** Sub-filters check multiple data locations:
  - `tags` array (e.g., "villain", "hero", "beverage", "dessert")
  - `role` field (e.g., "EK General", "SWT Warrior")
  - `metadata.narrativeFunction` (e.g., "antagonist", "protagonist", "mentor")
  - `metadata.eraAppearances[].role` (e.g., "hero", "villain", "supporting")
- **Examples:**
  - Long Feng shows up as Earth villain (narrativeFunction: "antagonist")
  - Sokka shows up as Water hero (eraAppearances role: "hero")
  - Bumi shows up as Earth hero (narrativeFunction: "mentor")
  - Air Nomad Style Tea shows up as beverage (category tag: "beverage")

**Are the filters accessible?**
- All filter buttons are keyboard-navigable
- Proper ARIA labels and roles are implemented
- Screen readers can access all filter options
- High contrast colors maintain accessibility standards

**What happens when no results match the filters?**
- The grid shows empty (no "No results" message)
- This maintains the clean, minimalist interface
- Simply adjust your filters to see results again

**How is the filtering system themed?**
- Uses Matrix green colors (`#70ab6c`) for consistency
- Glassmorphism effects with semi-transparent backgrounds
- Hover effects with increased glow intensity
- Responsive design that works on all screen sizes

---

### 🚀 Smooth Scrolling Navigation (2025 Update)

**How does smooth scrolling work in the application?**
- **Global CSS Implementation:** All native anchor links (`<a href="#section">`) automatically scroll smoothly due to `html { scroll-behavior: smooth; }` in the global CSS
- **JavaScript Utility:** Programmatic scrolling is available via the `scrollToElementById` function in `src/utils/navigationUtils.ts`
- **Consistent Experience:** Both methods provide the same smooth, non-jarring navigation experience

**How do I use smooth scrolling in my components?**
- **For anchor links:** Simply use standard HTML anchor links with hash fragments - they will automatically scroll smoothly
- **For programmatic scrolling:** Import and use the utility function:
  ```typescript
  import { scrollToElementById } from '../utils/navigationUtils';
  
  // In an onClick handler or other event
  scrollToElementById('my-section-id');
  ```

**What are the benefits of the smooth scrolling implementation?**
- **User Experience:** Eliminates jarring instant jumps when navigating to page sections
- **Accessibility:** Maintains focus and provides visual continuity for screen readers
- **Performance:** Uses native browser smooth scrolling for optimal performance
- **Consistency:** All navigation uses the same smooth behavior throughout the application

**Are there any browser compatibility considerations?**
- The `scroll-behavior: smooth` CSS property is supported in all modern browsers
- The `scrollIntoView` JavaScript method with `behavior: 'smooth'` is also widely supported
- Older browsers will gracefully fall back to instant scrolling without breaking functionality

**How do I add smooth scrolling to new components?**
- **For new anchor links:** No additional code needed - they automatically inherit smooth behavior
- **For new programmatic scrolling:** Import the utility function and call it with the target element ID
- **For custom scroll behavior:** The utility function can be extended or modified as needed

---

### 📏 Canonical Markdown Structure for All Types (2025 Update)

**Q: Can I use a different markdown structure for episodes, foods, or other types?**
- **A:** No. All entity types (character, episode, group, food, location, fauna, etc.) must use the exact same markdown structure for UI blocks (CARD VIEW and EXPANDED VIEW), with summary and expanded content in ```md code blocks. The parser is type-agnostic and does not allow special-case logic for any type. All new types must follow the canonical format. Any deviation is a build-breaking error.

**Q: Can I add special-case logic to the scripts for a specific entity type?**
- **A:** No. All scripts (`scripts/1-parse-markdown.mjs`, `scripts/2-enrich-data.mjs`, `scripts/lib/enrichRecord.mjs`) must use type-agnostic logic that works identically for all entity types. The 2025 January cleanup removed all special-case logic, and introducing type-specific handling is forbidden. All entity types must go through the same processing pipeline with no exceptions.

**Q: What happens if I introduce special-case logic for a specific type?**
- **A:** It will be caught by the Type-Agnostic Script Architecture quality gate during pre-commit validation. The build will fail, and the commit will be prevented. This ensures consistency and prevents future inconsistencies in data processing.

---