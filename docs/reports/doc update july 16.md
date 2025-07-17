Of course. The search engine update and subsequent debugging process introduced significant architectural changes. The documentation must be updated to reflect the new reality of how data is loaded and processed.

I have reviewed all the provided documentation files and made the necessary changes to align them with the final, working state of the application. The key changes include:

1.  **Data Loading:** The app no longer `fetches` data. It now uses a direct, synchronous `import` of `enriched-data.json` from within the `src/` directory for maximum reliability.
2.  **File Location:** `enriched-data.json` has been moved from `public/` to `src/data/`.
3.  **Search Logic:** The `useSearch` hook now uses a `where` clause for filtering and does not use a `preprocessor.ts` file or `searchBlob`.
4.  **Orchestration:** The `HomeContainer` now explicitly handles the initial empty-query state to ensure all cards are displayed on load.

Here are all the updated files.

---
### **Updated Documentation Files**

--- START OF FILE faq.md ---

# System Behavior & Development FAQ

This document outlines answers to common technical questions regarding the application's architecture, error handling, and development practices.

---

### 🐛 Data Pipeline & Error Handling

#### 1. Handling of Missing/Malformed `enriched-data.json`
The primary data file, `src/data/enriched-data.json`, is now imported directly at build time. If the file is missing or contains malformed JSON, this will cause a **build-time error** when running `npm run dev` or `npm run build`, preventing the application from starting. This is a robust approach that catches data errors before they reach the user. The `useEnrichedData` hook sanitizes the data by filtering out any `null` or `undefined` top-level entries to prevent rendering errors.

#### 2. Error Handling in the Search Index Pipeline
Since search indexing is performed client-side, errors during index creation are caught within the `useSearch` hook. These errors are logged to the browser console. A failed index build will likely manifest as the "No Results Found" component, as the search will return no matches.

#### 3. Handling of Missing Fields in Records
The data pipeline is designed to enforce data integrity. The enrichment script (`scripts/2-enrich-data.mjs`) should ideally catch records with missing required fields and fail the build. If an incomplete record makes it to the frontend, UI components are built to handle missing data gracefully, typically by rendering a fallback value (e.g., "Unknown" for a missing `nation`) or omitting the element.

#### 4. Handling of Deprecated/Legacy Data Fields
Deprecated fields from the raw data are ignored by the data pipeline. The enrichment and parsing scripts are the single source of truth for the data schema. Only fields defined in the canonical data structures (`src/types/`) are processed and included in the final `src/data/enriched-data.json`.

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
The application's core data is imported directly for robustness. The `src/config/constants.ts` file remains for any potential future, non-critical API endpoints or static resource paths.

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
--- END OF FILE faq.md ---

--- START OF FILE data pipeline.md ---

# ⚙️ Data Pipeline Workflow (2024 Refactor)

The project uses a robust, two-stage pipeline to transform raw markdown data into a single, client-ready JSON file. All search indexing is now performed client-side for maximum reliability and transparency.

---

## 1. Data Authoring: Unified Markdown Format

- All data is authored in markdown files in `raw-data/`.
- Each file must begin with a YAML frontmatter block (`---`) containing a `type` field (e.g., `type: character`).
- The body must include at least one fenced JSON code block (```json) with structured data. All JSON blocks are merged.
- For characters, the file must also include:
  - `## UI - CARD VIEW` block (summary fields)
  - `## UI - EXPANDED VIEW` block (detailed markdown)

---

## 2. The Automated Scripts & Data Flow

### Stage 1: Parse Markdown (`scripts/1-parse-markdown.mjs`)
- Reads YAML frontmatter, UI blocks, and all JSON blocks.
- Merges all data into a single object per file.

### Stage 2: Enrich Data (`scripts/2-enrich-data.mjs`)
- Promotes UI-critical fields (e.g., image, role, nation) to the top level of each record.
- All other fields are placed in a `metadata` object.
- **Output:** `src/data/enriched-data.json` (the only data file used by the frontend).

### Client-Side Indexing (In the Browser)
- The React app **imports** `src/data/enriched-data.json` directly at build time.
- The `useSearch` hook builds a FlexSearch index in-browser on initial render.
- **No pre-built index is used or generated.**

---

## 3. How to Add or Update Data

1. **Create/Edit Markdown:** Follow the canonical format.
2. **Run the Build Script:**
   ```bash
   npm run build:data
   ```
3. **Check for Errors:** Watch the terminal for parsing/enrichment errors.
4. **Refresh the UI:** The Vite dev server will hot-reload the changes automatically.

---

## 4. Canonical Templates & Schema

See `docs/templates/character_template.md` for the full, up-to-date schema and required fields for all data types.

---

**Summary:**
- The only data file used by the frontend is `src/data/enriched-data.json`.
- All search and filtering is performed client-side, in-browser, using FlexSearch.
- The pipeline is strictly two-stage and robust, transparent, and easy to debug.
--- END OF FILE data pipeline.md ---

--- START OF FILE frontend architecture.md ---

# 🏗️ Frontend Architecture & Logic (2024 Refactor)

The frontend is organized around a clear separation of concerns, with a central container managing state and data flow to presentational components. The search system is now fully client-side for maximum robustness and transparency.

---

## 1. HomeContainer.tsx: The Central Orchestrator

- **Data Loading:** On initial load, the `useEnrichedData` hook synchronously provides the data by importing `src/data/enriched-data.json` directly.
- **State Management:** Manages the user's search query and the `expandedCardId` for modal views.
- **Search Logic:**
  - **Conditionally calls the `useSearch` hook.** If the query is empty, it passes the full, unfiltered dataset to the UI.
  - If the query has text, it calls `useSearch` to get a filtered array of results.
- **Prop Drilling:** Passes the final array of entities to render and state handlers down to the presentational `<Home />` component.

---

## 2. Custom Hooks: useSearch, useEnrichedData, useImageFallback

- **`useSearch.ts`:**
  - Receives the complete array of data and the search query.
  - Builds a FlexSearch index in-browser on all relevant text fields.
  - Supports keyword search and `key:value` filtering (e.g., `nation:fire`) via a `where` clause.
  - Returns a filtered array of results for the UI.
- **`useEnrichedData.ts`:**
  - Synchronously provides the entire dataset by directly importing the `enriched-data.json` file.
  - Sanitizes the data by removing any `null` or invalid entries from the root array.
- **`useImageFallback.ts`:**
  - Manages image loading, error fallback, and status for entity images, providing a robust fallback for missing or broken images.

---

## 3. Presentational Layer (Home.tsx)

- Purely presentational; receives all data and handlers as props from `HomeContainer`.
- Renders the main layout, including the `SearchBar` and the `EntityGrid`.

---

## 4. Card Grid & Modal System

- **`EntityGrid.tsx`:**
  - Receives the array of entities to display.
  - Defensively filters the array one last time to prevent rendering errors from any `null` or `undefined` items.
  - Renders a responsive grid of `ItemCard` components.
- **`ItemCard.tsx`:**
  - Renders both the collapsed grid card and the full-screen expanded modal view.
  - Expanded view is a modal overlay, fully responsive and accessible.
  - Uses the `useImageFallback` hook for robust image handling.

---

## 5. Data Structure & Pipeline Adherence

- The frontend relies on `src/data/enriched-data.json` having all top-level fields required by the UI (e.g., `id`, `name`, `image`, `role`, `expandedView`).
- The data pipeline is responsible for promoting these fields from the raw markdown data.
- See `docs/data pipeline.md` and `docs/troubleshooting.md` for canonical data structures and debugging steps.

---

## 6. DOM & HTML Structure

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
--- END OF FILE frontend architecture.md ---

--- START OF FILE search engine.md ---

# 🔍 Encyclopedia Search Engine: Client-Side Architecture (2024 Refactor)

## Overview

The search engine is now fully client-side, leveraging FlexSearch to build and query a full-text index in the user's browser. This eliminates build-time index errors and ensures the UI always works with the latest data.

---

## 1. Data Flow & Indexing

- **Source Data:** All data is authored in markdown, parsed and enriched into `src/data/enriched-data.json` by the data pipeline.
- **Frontend:**
  - On load, the app **imports** `src/data/enriched-data.json` directly.
  - The `HomeContainer` component manages the search query.
  - If the query is empty, the full list of entities is rendered.
  - If the query has text, the `useSearch` hook is called.
  - `useSearch` builds an in-memory FlexSearch index on fields like `name`, `role`, and `tags`.
  - All searching and filtering (including `key:value` pairs) is performed in-browser, with results returned for display.

---

## 2. Key Files & Responsibilities

- **`src/hooks/useSearch.ts`:**
  - Orchestrates client-side indexing and searching.
  - Builds the FlexSearch index and performs searches.
  - Uses a `where` clause to handle `key:value` filters (e.g., `nation:fire`).
  - Returns a filtered array of entity objects.
- **`src/data/enriched-data.json`:**
  - The only data file used by the frontend. If a record is present here, it will be indexed and searchable.

---

## 3. Debugging & Extending Search

- **To add a new searchable field:**
  - In `useSearch.ts`, add the new field's name to the `index` array in the `FlexSearch.Document` configuration.
- **To add a new filterable field (e.g., `status:alive`):**
  - In `useSearch.ts`, ensure the `where` clause logic can handle the new key. No other changes are needed.
- **To debug missing results:**
  - Check that the data field is present in `src/data/enriched-data.json`.
  - Add a `console.log` inside the `where` clause in `useSearch.ts` to inspect why an entity is being filtered out.

---

## 4. Rationale & Benefits

- **No Pre-Built Index:** All indexing is done in-browser, eliminating a class of build-time errors.
- **Single Source of Truth:** The frontend relies only on `src/data/enriched-data.json`.
- **Performance:** Indexing is memoized; subsequent searches on the same data are instant.
- **Maintainability:** Search behavior is centralized in `useSearch.ts`.
--- END OF FILE search engine.md ---

--- START OF FILE troubleshooting.md ---

# 🩺 Troubleshooting Guide (2024 Refactor)

This guide provides a systematic way to debug data and UI issues in the new client-side architecture.

---

## 1. The Golden Rule: Follow the Data

- The UI can only display the data it receives. If the UI is wrong, the data flow is almost certainly wrong.

---

## 2. UI Shows "No Results Found" or is Empty

This is the most common issue. It means the array of items passed to the `EntityGrid` component is empty.

**Steps:**
1. **Check `HomeContainer.tsx`:** This is the most likely source of the problem. Add a `console.log` right before the `return` statement to check the length of the array being passed to the `<Home />` component.
   ```tsx
   console.log(`[HomeContainer] Items being rendered: ${itemsToRender.length}`);
   return <Home searchResults={itemsToRender} ... />;
   ```
2. **Check `useEnrichedData.ts`:** If the log in `HomeContainer` shows 0 items, check the data source. Add a `console.log` in `useEnrichedData` to see the raw imported data and the length after filtering.
   ```ts
   console.log('Raw imported data:', jsonData);
   const data = (jsonData as any[]).filter(Boolean);
   console.log('Filtered data length:', data.length);
   ```
3. **Check `enriched-data.json`:** If the raw data log shows an empty array, your `src/data/enriched-data.json` file is empty or missing. Run `npm run build:data` to regenerate it.
4. **Check the Search Query:** If cards appear on load but disappear when you type, the problem is in the `useSearch` hook's filtering logic.

---

## 3. Search Results Are Missing Specific Items

- The search term is being filtered out incorrectly.

**Steps:**
1. Open `src/hooks/useSearch.ts`.
2. Add a `console.log` inside the `where` clause (or the manual `.filter()` call) to inspect why a specific entity is returning `false`.
3. Check for typos in the `key:value` pair in your search query.

---

## 4. A Specific Card Crashes the App on Render

- A specific entity has malformed data that passes validation but causes a rendering error (e.g., an image path is an object instead of a string).

**Steps:**
1. Note the last card that rendered successfully. The error is likely in the next item in the array.
2. Open `src/data/enriched-data.json` and inspect the data for the entity that is causing the crash.
3. Correct the data in the source markdown file in `raw-data/` and run `npm run build:data`.

---

## 5. General Debugging Tips

- Always start by checking the `console.log` in `HomeContainer.tsx` to confirm what is being sent to the presentational layer.
- If a data field is missing from an entity, fix the source markdown and run the `npm run build:data` script.

---

## 6. Card Not Appearing or Expanded Info Missing: Full Debug Process (Fire Nation Man Case Study)

If a character card is missing entirely from the data file, follow this end-to-end process:

**1. Discover the Problem**
- Notice a card is missing from the UI, or its expanded info does not show up.

**2. Check the Data Pipeline**
- Open `src/data/enriched-data.json` and search for the character (e.g., "fire-nation-man").
- If the character is missing, the data pipeline did not parse the markdown file.
- If present but fields like `expandedView` are empty, the markdown structure is likely wrong.

**3. Inspect the Markdown File**
- Open the relevant file in `raw-data/characters/` (e.g., `fire nation man.md`).
- Ensure the file follows the canonical structure:
  - YAML frontmatter between `---`
  - UI - CARD VIEW in a ```md ... ``` block
  - UI - EXPANDED VIEW in a ```md ... ``` block (all expanded markdown inside)
  - One or more valid JSON blocks in ```json ... ``` blocks (no extra text inside)
- Common mistakes:
  - JSON block not detected (wrong placement, extra blank lines, or extra text)
  - Expanded view not wrapped in a ```md block
  - Multiple or malformed JSON blocks

**4. Fix the Markdown File**
- Remove any extra blank lines or text between the last `---` and the first code block.
- Ensure all JSON blocks are valid and inside triple backticks with `json`.
- Wrap the entire expanded view markdown in a single ```md ... ``` block after the `## UI - EXPANDED VIEW` header.

**5. Rebuild the Data**
- Run `npm run build:data` to regenerate `src/data/enriched-data.json`.
- Check the terminal output for `[SUCCESS] Parsed character: ...` for your character.

**6. Verify the Fix**
- Open `src/data/enriched-data.json` and confirm the character is present and all fields are populated.
- Refresh the app. The card and expanded info should now display correctly.
--- END OF FILE troubleshooting.md ---

--- START OF FILE file index.md ---

# 📁 File Index (2024 Refactor)

This file provides an up-to-date overview of all substantive source, configuration, documentation, and data files in the repository. It reflects the current client-side search architecture, two-stage data pipeline, and React frontend structure.

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
| docs/data pipeline.md | **Source of Truth.** Details the two-stage pipeline for processing markdown into `src/data/enriched-data.json`. |
| docs/frontend architecture.md | **Source of Truth.** Describes the React component structure and data flow. |
| docs/search engine.md | **Source of Truth.** Explains the client-side indexing and search architecture. |
| docs/troubleshooting.md | **Source of Truth.** Practical guide for debugging data and UI issues. |
| docs/ui-components.md | Documents the `ItemCard` and modal system. |
| docs/decisions.md | Log of architectural decisions and their rationale. |
| docs/adding-new-domain-tutorial.md | Tutorial on how to add new data types to the project. |

---

## Data Pipeline Scripts (`scripts/`)
| File | Description |
|------|-------------|
| scripts/1-parse-markdown.mjs | **Stage 1:** Parses raw Markdown files, extracting YAML frontmatter and all JSON/MD blocks into a structured format. |
| scripts/2-enrich-data.mjs | **Stage 2:** Cleans the parsed data, promotes UI-critical fields to the top level, and outputs the final `src/data/enriched-data.json`. |
| scripts/slug-utils.mjs | Utility functions for generating unique slugs. |
| scripts/validate-data.mjs | Validates data files against a defined schema. |

---

## Application Source (`src/`)
| File/Dir | Description |
|----------|-------------|
| src/main.tsx | Main React entry point. |
| src/App.tsx | React Router setup. |
| src/data/ | **Source of Truth.** Contains the `enriched-data.json` file, imported directly by the app. |
| src/types/ | Core TypeScript types (`domainTypes.ts`, `rawTypes.ts`, `grid.ts`). |
| src/theme/ | Theming files, like `nationThemes.ts` for card colors. |
| src/utils/ | Shared helper functions (`stringUtils.ts`, `tokenize.ts`). |
| src/hooks/ | All custom React hooks (see below). |
| src/components/ | All reusable UI components (cards, grid, nav, modal, etc.). |
| src/pages/ | Page-level components that compose the UI. |
| src/search/ | Client-side search utilities. |
| src/styles/ | CSS files. |
| src/config/constants.ts | Centralized config constants (e.g., for non-critical, future API endpoints). |

---

### Key Frontend Files & Their Roles

#### **Data Flow & State**
| File | Description |
|------|-------------|
| **`pages/HomeContainer.tsx`** | The stateful "brain" of the app. Manages `query` and `expandedCardId` state. Conditionally calls `useSearch` or uses the full dataset to ensure UI populates correctly. |
| **`hooks/useEnrichedData.ts`** | Synchronously provides the entire dataset by importing `src/data/enriched-data.json` at build time. |
| **`hooks/useSearch.ts`** | **The core of the search system.** Receives all data, builds a FlexSearch index, and returns filtered results based on keywords and `key:value` filters. |
| **`hooks/useImageFallback.ts`** | Manages image loading, error fallback, and status for entity images. |
| **`pages/Home.tsx`** | The presentational "body" of the app. Receives props from `HomeContainer` and renders the UI. |

#### **UI Components**
| File | Description |
|------|-------------|
| **`components/EntityGrid/EntityGrid.tsx`** | Renders the responsive grid of cards. Defensively filters its `items` prop to prevent crashes from invalid data. |
| **`components/ItemCard/ItemCard.tsx`** | Renders both the small grid card and the full-screen expanded modal view. Contains all logic for a single entity's display. |
| **`components/CustomMarkdownRenderer.tsx`** | Renders markdown content for the expanded card view, with custom styling. |
| **`components/ThemedCard/ThemedCard.tsx`** | A styled wrapper that applies a nation-specific border color to cards. |

---

## Data & Public Assets
| File/Dir | Description |
|------|-------------|
| `public/assets/images/` | All static images used for entity cards. |
| `raw-data/` | The raw markdown source files for all encyclopedia entries. |
| `data/` | Intermediate data files used during the build process (`parsed-data.json`). |

---

This index provides a clear and accurate map of the project as it currently stands.
--- END OF FILE file index.md ---

--- START OF FILE data flow.md ---

# Data Flow (Current as of 2024-07)

## 1. Data Source and Pipeline

- Data originates from markdown files in `raw-data/` (see `docs/data pipeline.md`).
- These are parsed and enriched by scripts into a single, comprehensive JSON file: `src/data/enriched-data.json`. This is the only data file the frontend consumes.

---

## 2. Frontend Data Flow

### a. Data Loading and State Management

**File:** `src/pages/HomeContainer.tsx`

- On initial load, the application gets the entire dataset by calling the `useEnrichedData` hook.
- It manages the user's search query and the `expandedCardId` for the modal view.
- **It conditionally calls `useSearch`:** If the query is empty, it uses the full list of entities. Otherwise, it calls the hook to get filtered results. This ensures the UI is always populated on initial load.

### b. Client-Side Searching

**File:** `src/hooks/useSearch.ts`

- This is the core of the search logic. It receives the full entity dataset and the user's query.
- **Client-Side Indexing:** Builds a FlexSearch index in the browser. This is memoized to only happen once per data set.
- Performs searches against this in-memory index using keywords and a `where` clause for `key:value` filters.

### c. Presentational Layer

**File:** `src/pages/Home.tsx`

- Receives the final, ready-to-render list of entities from `HomeContainer`.
- Is a purely presentational component that renders the main layout and passes data down to the `EntityGrid`.

### d. Card Grid & Component

**File:** `src/components/EntityGrid/EntityGrid.tsx`

- Receives an array of entities and the `expandedCardId`.
- Maps over the items and renders an `ItemCard` for each.

**File:** `src/components/ItemCard/ItemCard.tsx`

- Receives a single entity object (`item`) and renders either a collapsed card or an expanded modal.
- Uses the `useImageFallback` hook for robust image handling.

---

## 3. Summary of File Involvement

- **Data pipeline:** `docs/data pipeline.md`, scripts in `/scripts/` (`1-parse-markdown.mjs`, `2-enrich-data.mjs`).
- **Data source:** `src/data/enriched-data.json`.
- **Data loading:** `src/hooks/useEnrichedData.ts`.
- **State & Orchestration:** `src/pages/HomeContainer.tsx`.
- **Search Logic:** `src/hooks/useSearch.ts`.
- **Presentational:** `src/pages/Home.tsx`.
- **Grid & Card:** `src/components/EntityGrid/EntityGrid.tsx`, `src/components/ItemCard/ItemCard.tsx`.

**In short:**
Data is imported from `src/data/enriched-data.json` by `useEnrichedData` → `HomeContainer` gets the data and either passes it directly to `<Home>` (if query is empty) or filters it first with `useSearch` → `<Home>` renders the grid → `EntityGrid` renders each `ItemCard`.
--- END OF FILE data flow.md ---

--- START OF FILE source_of_truth.md ---

# 📖 Source of Truth: Project Documentation (2024 Refactor)

This document is the canonical, always-up-to-date reference for how all data is authored, processed, and rendered in this project. The system is now fully unified, robust, and client-side.

---

## Key Principles
- **Single Source of Truth:** All data is authored in markdown, processed by the two-stage pipeline, and output as `src/data/enriched-data.json`.
- **Client-Side Search:** All indexing and search logic is performed in-browser using FlexSearch and the `useSearch` hook.
- **No Pre-Built Index:** The app does not use or generate a pre-built search index file.
- **Strict Schema Adherence:** All data must follow the canonical schema in `docs/templates/character_template.md`.

---

## Canonical References
- **Data Pipeline:** See `docs/data pipeline.md` for the full authoring and build process.
- **Search Engine:** See `docs/search engine.md` for the client-side search architecture.
- **Frontend Architecture:** See `docs/frontend architecture.md` for the React component structure and data flow.
- **Troubleshooting:** See `docs/troubleshooting.md` for debugging steps and lessons learned.

---

**This documentation is always kept current with the codebase. All contributors must reference these docs before making changes.**
--- END OF FILE source_of_truth.md ---

--- START OF FILE environment context.md ---

# 🌐 Environment Context: Austros ATLA World Encyclopedia

## 1. Project Overview

- **Project Name:** austros-atla-world
- **Version:** 0.0.1
- **Type:** TypeScript, React, Vite, Tailwind CSS, FlexSearch
- **Private:** true

---

## 2. Node & Package Management

- **Node.js:** (version not specified, but compatible with modern Node)
- **Package Manager:** npm
- **Lockfile:** package-lock.json (ensures reproducible installs)

---

## 3. Core Dependencies

### **Frontend**
- **React:** ^19.1.0
- **React DOM:** ^19.1.0
- **React Router DOM:** ^6.30.1
- **React Markdown:** ^10.1.0
- **React Icons:** ^5.5.0
- **remark-gfm:** ^4.0.1

### **Search & Data**
- **FlexSearch:** ^0.7.43 (client-side full-text search)
- **gray-matter:** ^4.0.3 (YAML frontmatter parsing)
- **js-yaml:** ^4.1.0 (YAML parsing)
- **ajv:** ^8.17.1 (JSON schema validation)
- **zod:** ^4.0.5 (runtime type validation)

### **Styling**
- **Tailwind CSS:** ^3.4.3 (pinned, see below)
- **@tailwindcss/typography:** ^0.5.16
- **autoprefixer:** ^10.4.21

### **Build & Tooling**
- **Vite:** ^5.4.19 (build tool)
- **@vitejs/plugin-react:** ^4.6.0
- **vite-plugin-pwa:** ^1.0.1 (PWA support)

### **Testing & Linting**
- **Jest:** ^30.0.4
- **@testing-library/react:** ^16.3.0
- **@testing-library/jest-dom:** ^6.6.3
- **eslint:** ^8.57.1
- **eslint-config-airbnb-typescript:** ^17.1.0
- **eslint-config-prettier:** ^9.1.0
- **eslint-plugin-import:** ^2.32.0
- **eslint-plugin-jsx-a11y:** ^6.10.2
- **eslint-plugin-react:** ^7.37.5
- **eslint-plugin-react-hooks:** ^4.6.2
- **prettier:** ^3.6.2
- **markdownlint-cli:** ^0.39.0
- **typescript:** ^5.8.3
- **ts-jest:** ^29.4.0

---

## 4. Custom & Local Packages

### **Custom ESLint Plugin**
- **Location:** `eslint-plugin-local/`
- **Rules:**
  - `no-stray-dialogue-import`: Forbids importing `DialogueLogEntry` outside `UnifiedBattleLog` files.
  - `no-actor-on-non-dialogue-logs`: Forbids the `actor` property in non-dialogue log creators (`logStory`, `logMechanics`, `logSystem`).

### **Scripts**
- **Location:** `scripts/`
- **Purpose:** Data pipeline (parsing, enriching), validation, and utility scripts.
- **Key scripts:**
    - `1-parse-markdown.mjs`: Parses raw markdown files into structured JSON.
    - `2-enrich-data.mjs`: Cleans and structures the parsed data into the final `src/data/enriched-data.json`.
- **Note:** The old `3-build-index.mjs` script is no longer used. All search indexing is now performed client-side.

---

## 5. Build & Tooling Configuration

### **Vite**
- **Config:** `vite.config.ts`
- **Plugins:** React, PWA
- **Alias:** `@` → `/src`
- **Public Directory:** `public/`
- **Build Output:** `dist/`
- **Dev Server:** Opens browser on start

### **Tailwind CSS**
- **Config:** `tailwind.config.js`
- **Pinned Version:** 3.4.3 (do not upgrade without manual verification)
- **Custom Theme:** Extended colors, keyframes, and typography
- **Plugins:** `@tailwindcss/typography`
- **Manual Build Required:** Run `npm run build:tailwind` after changes

### **PostCSS**
- **Config:** `postcss.config.cjs`
- **Plugins:** `autoprefixer`

### **TypeScript**
- **Configs:** `tsconfig.json` (main), `tsconfig.node.json` (scripts), `tsconfig.script.json` (additional scripts)

### **ESLint**
- **Config:** `.eslintrc.json`
- **Airbnb + Prettier + Custom Local Plugin**

### **Markdown Lint**
- **Config:** `.markdownlint.json`

---

## 6. Data & Search

- **Data Pipeline:** A two-stage process that produces a single `src/data/enriched-data.json` file. See `docs/data pipeline.md` for full details.
- **Data Source:** The frontend imports `src/data/enriched-data.json` directly at build time.
- **Search Logic:**
    - **`src/hooks/useSearch.ts`:** The core search hook. It takes the enriched data, and builds an in-memory `FlexSearch` index for instant searching.
    - **No Pre-Built Index:** The app does not load a pre-built search index file. This strategy is more robust and avoids build-time errors.
- **Data Types:** Defined in `src/types/`.

---

## 7. Notable Extraneous/Linked Packages

- **dirty-json, lex, string.fromcodepoint, tsconfig-paths, unescape-js, utf8**  
  (Listed as extraneous; not in package.json, may be legacy or for dev utility.)

---

## 8. Project Structure

- **src/**: Main app code (components, hooks, search, types, etc.)
- **src/data/**: Contains the primary `enriched-data.json` file.
- **public/**: Static assets like images and fonts.
- **raw-data/**: Source markdown data.
- **scripts/**: Data pipeline and utility scripts.
- **eslint-plugin-local/**: Custom ESLint rules.
- **docs/**: Project documentation.

---

## 9. Environment Notes

- **Manual Tailwind Build:** Required after any style/config change.
- **No containerization:** Local dev only.
- **Strict lint/type checks:** Pre-commit and CI enforced.
- **No test coverage threshold or CI gating.**
- **All user-facing strings should be i18n-ready.**
- **No upgrades to Tailwind v4+ without explicit manual verification.**

---

## 10. How to Reproduce/Setup

1.  `npm install`
2.  `npm run build:data` (to generate `src/data/enriched-data.json`)
3.  `npm run build:tailwind` (after any style change)
4.  `npm run dev` (to start Vite dev server)

---

**For more details, see:**
- `docs/data pipeline.md`
- `docs/frontend architecture.md`
- `docs/troubleshooting.md`
- `projectrules.mdc`
--- END OF FILE environment context.md ---

--- START OF FILE styling.md ---

## 🎨 Styling & UI Policy

### 1. CSS Source of Truth: Tailwind CSS (v3.4.3)

The project is pinned to `tailwindcss@3.4.3` due to a critical, unrecoverable environmental bug with the v4+ CLI installer on the primary development machine.

-   **Policy:** **Never upgrade `tailwindcss` above `3.4.3`** without first verifying, in a disposable clone, that the CLI binary (`tailwindcss.cmd`) appears in `node_modules/.bin` after a clean install.
-   **Usage:** All styling must be done with Tailwind CSS utility classes. Always use the local CLI for builds:
    ```powershell
    .\node_modules\.bin\tailwindcss.cmd -i ./src/styles/pure-tailwind.css -o ./src/styles/generated-tailwind.css
    ```
-   **Manual Build Required:** The build process is not automated. **You must manually run the command above** after any change to Tailwind config, theme, or class usage for your changes to appear in the UI.
-   **Import Policy:** The main entry point (`main.tsx`) must import the correct generated CSS file (e.g., `generated-tailwind.css`).

### 2. Tailwind JIT: Literal Class Requirement & Troubleshooting

-   **JIT Literal Class Policy:** Tailwind JIT only generates classes it finds as literal strings in scanned files. If a class (e.g., `bg-neutral-900`) is missing from the output CSS, ensure it is present as a literal string in your codebase and restart the dev server or rebuild Tailwind.
-   **Dynamic Class Pitfall:** If you use dynamic class names or template strings, JIT may not detect them. Always add a dummy reference if needed, e.g.:
    ```jsx
    <div className="bg-neutral-900 hidden" />
    ```
-   **Manual Rebuild:** After adding new classes, always run the Tailwind build command and restart the dev server to ensure the new classes are generated and available.
-   **Validation:** If a class is still missing, check the generated CSS file for the class. If absent, add a literal reference and rebuild.

### 3. UI/UX Rules

-   **Card Grid Hover:** **Always use Flexbox (`flex flex-wrap`) for card grids**, never CSS Grid. Grid layouts will clip hover effects like scaling and shadows. The grid container must have sufficient padding (e.g., `p-8`) to prevent edge clipping.
-   **Modal/Overlay Borders:** **Never apply `border`, `rounded-*`, or `shadow-*` styles to both a modal container and its child card.** Only the innermost component should have these "card-like" styles to prevent double borders or visual artifacts.
-   **Responsive Layouts:** Use `flex-wrap` for tag/pill groups. Use `flex-shrink-0`, `flex-1`, and `truncate` for list items to ensure they adapt gracefully.

### 4. Card Styling & Scaling

-   **Card Width:** Card width is set in `EntityGrid` (currently `w-[188px]`).
    -   **Source of Truth:** To change the card size globally, update the `w-[188px]` value in `src/components/EntityGrid/EntityGrid.tsx`. All card content is sized relative to this width.
-   **Card Content Scaling:** All internal card content (image, text, etc.) is scaled in `ItemCard` to match the card size for visual consistency.
-   **Card Name Wrapping:** Card names use `line-clamp-2` (multi-line clamping) for accessibility and to avoid hidden content. This requires the `@tailwindcss/line-clamp` plugin, which is enabled in `tailwind.config.js`.
-   **Grid Layout:** The card grid uses flexbox for layout, ensuring cards stretch to fill the row and maintain a consistent appearance.
-   **SRP:** All card styling and scaling should be handled in the relevant component (`EntityGrid` for layout/width, `ItemCard` for content), not globally.
-   **Nation Colors:** Card border and background glow are themed by nation. The nation color is determined by the `nationThemeMap` in `src/theme/nationThemes.ts`, and applied via the `ThemedCard` component. To change or add a nation color, update `nationThemeMap`—all cards for that nation will update automatically. If a nation is missing, a neutral default color is used.
-   **Card Text Formatting:** Card text is beautifully formatted due to the use of the Tailwind Typography plugin (`prose` classes), which is enabled and customized in `tailwind.config.js` for the project's dark theme. The expanded card content uses a `prose`-styled div, and the `CustomMarkdownRenderer` component (with `react-markdown` and custom React components) further enhances markdown rendering for headings, lists, and emphasis. This combination ensures all card text is visually appealing, readable, and consistent.

### 5. Hiding/Unhiding UI Features (Filters & Collections)

-   **Convention:** To hide a UI feature (e.g., FilterSidebar, FilterPanel, CollectionsSidebar, CollectionsPanel), set the component to return `null` and add a comment at the top: "[Component] is hidden from the UI on user request. To re-enable, restore the original export."
-   **To Unhide:** Restore the original export and implementation in the component file.
-   **Canonical Toggle:** This is the canonical method for feature toggling in this project—no conditional rendering in parent components, no feature flags. All toggling is done at the component export level for clarity and maintainability.

### 6. Card Image Sizing: Root Cause & Solution (2024-07)

- **Discovery:** Using fixed rem/pixel sizes (e.g., `w-22`, `h-22`, `w-[5.5rem]`) for card images can cause images to overflow or dominate the card, especially for portrait images or if the card width changes. This is because the image container is not sized relative to the card, and the card's width is set in `EntityGrid` (e.g., `w-[188px]`).
- **Root Cause:** Tailwind will silently ignore non-existent classes (like `w-22`), and fixed sizes do not scale with the card. This leads to brittle, non-responsive layouts and "giant" images.
- **Solution:** Always size the image container **relative to the card** using `w-full aspect-square max-w-[80%] max-h-[60%] mx-auto` (or similar). This ensures the image is always proportional, never overflows, and is visually balanced regardless of card or image aspect ratio.
- **Arbitrary Values:** Only use arbitrary values for image sizing if the card width is also fixed and you want a precise ratio. For responsive or dynamic cards, always use relative sizing.
- **SRP:** All image scaling and proportionality logic should be handled in `ItemCard`, not globally or in the card grid.
- **Reference:** See July 2024 root cause analysis and fix for details. If image size needs to be changed again, adjust the `max-w`/`max-h` or percentage values in `ItemCard` for safe, predictable results.

### 7. Card Badge Styling & Information Hierarchy (2024-07)

- **Floating Role Badge:**
  - Use a single, floating badge (modern pill style) at the bottom-right of the image area, not the card as a whole.
  - Badge uses `bg-neutral-900 text-neutral-100 text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-lg` for maximum readability and a premium look. This solid, opaque background ensures perfect contrast and legibility on both light and dark images. Do not use semi-transparent backgrounds or backdrop blur for badges.
  - Only render the badge if the character has a specific role/title (e.g., "NWT Chief"). Do **not** show a generic fallback (like "Character") in the badge—use the category text for that.
  - The badge must always be visually legible against any image background (high contrast, shadow, subtle border).

- **Category Text:**
  - Always display the category (e.g., "Character") as plain text below the name, not as a badge, for clarity and hierarchy.

- **Vertical Spacing:**
  - Increase card min-height (`min-h-[240px]` or greater) to ensure all elements have breathing room and avoid overlap.
  - Never allow the badge to overlap the name or category text—badge floats over the image only.

- **Information Hierarchy:**
  - Order: Image (with badge) → Name (+ NationIcon) → Category text → (optional) expanded details.
  - Never duplicate the same information in both badge and text.

- **Accessibility:**
  - Ensure badge text is always readable by screen readers (use semantic HTML and sufficient contrast).

### 8. Card Information Requirements: Titles, Categories, and Badges (2024-07)

**Every card must display all three of the following, without exception:**

- **Title (Name):**
  - The character’s (or entity’s) name is always shown at the top of the card, styled for prominence and accessibility.
  - If a NationIcon is present, it appears next to the name.

- **Category:**
  - The category (e.g., "Character", "Location", "Fauna") is always shown as plain text directly below the name.
  - This is never omitted, never shown as a badge, and never duplicated in the badge.
  - The category is derived from the entity type (for characters, always "Character").

- **Badge (Role):**
  - If the entity has a specific role/title (e.g., "NWT Chief", "Avatar"), a badge is shown floating at the bottom-right of the image area.
  - If there is no specific role/title, the badge is omitted (do not show a generic fallback like "Character" in the badge).
  - The badge must use the high-contrast, pill style described above for readability and visual hierarchy.

**Non-Negotiable:**
- All three elements (title, category, badge-if-present) are required for every card. Cards missing any of these are considered incomplete and must be fixed before release.
- Never duplicate information between the badge and the category text.
- The information hierarchy is: Name (with icon) → Category → Badge (if present) → Details.

**Rationale:**
- This ensures every card is instantly scannable, visually consistent, and accessible, regardless of content or background image.

**Reference:**
- See section 7 for badge styling and placement details.

These conventions ensure cards are visually clean, accessible, and maintain a clear information hierarchy, regardless of content or background image.

### 9. Expanded Card Header: Specificity War & Inline Style Solution (2024-07)

- **Problem:** The Tailwind Typography plugin (`prose`) applies high-specificity styles to all content within its scope, which can override even strong Tailwind utility classes (e.g., `text-3xl`). This caused the expanded card header (name and category) to render at the wrong size, regardless of utility class usage.
- **Failed Fixes:** Attempts to use `not-prose` wrappers, extra utility classes, or increased selector specificity failed due to the plugin's CSS strength.
- **Definitive Solution:** The name (`<h3>`) and category (`<p>`) in the expanded card view are rendered above the markdown and use inline `style` attributes for font size and line height. This guarantees correct appearance regardless of global or prose styles.
- **When to Use:** Only use inline styles for font size/line height as a last resort, when all other approaches (utility classes, not-prose, etc.) fail due to plugin or global CSS specificity. Document the rationale in the component and reference this section.
- **Reference:** See `ItemCard.tsx` (July 2024) for implementation and rationale.

This ensures the expanded card header is always visually prominent, accessible, and immune to future CSS/plugin changes.

## 10. Terminal-Style Search Bar: Font & Block Cursor (2024-07)

- **Search System Reference:** The search bar is the entry point to the new client-side search/indexing system. For a full explanation of the search architecture, see `docs/search engine.md`. For debugging and troubleshooting, see `docs/troubleshooting.md`.
- **Font:** The search bar uses the custom Glass_TTY_VT220.ttf font, loaded via @font-face in custom.css and applied with the .font-tty-glass utility class. This gives the input a retro terminal/CRT look.
- **Font Sizing:** The input, overlay, and block cursor use a font size of 23px for bold, readable terminal aesthetics. The input's padding, border, and overall scale remain unchanged for layout consistency.
- **Block Cursor:** A custom blinking block cursor is rendered as an absolutely positioned overlay, using Tailwind's animate-blink utility (defined in tailwind.config.js as a 1s steps(2, start) infinite animation). The block is a green rectangle (w-2 h-6 bg-green-400) that blinks in sync with the input focus.
- **Pixel-Perfect Alignment:** The overlay uses a hidden span (visibility: hidden, whitespace-pre) to measure the exact rendered width of the input value. The block cursor is placed immediately after this span, inside a flex container absolutely positioned with left: 1.5rem (matching px-6 input padding). This ensures the block cursor is always flush with the end of the text, regardless of font quirks or browser.
- **Caret Hiding:** The native input caret is hidden (caret-color: transparent) so only the custom block cursor is visible, for full terminal authenticity.
- **Accessibility:** The input remains fully accessible and keyboard navigable. The overlay is pointer-events-none and select-none, so it does not interfere with user interaction or screen readers.
- **Customization:** Font size, block size, and color can be tweaked in SearchBar.tsx and custom.css. The block cursor can be further styled for CRT/scanline effects if desired.

This approach delivers a visually authentic, highly readable, and fully accessible terminal search bar, with a block cursor that is always perfectly flush with the text.
--- END OF FILE styling.md ---## Patch: Robust Badge Extraction for Character Cards (July 17, 2025)

### Problem
Some characters (e.g., Yagoda, Yu, Lo and Li) had badges/roles defined in their markdown and enriched data, but the badge was not always displayed in the UI. This was due to inconsistent placement of the badge/role field (sometimes as `role`, sometimes as `metadata.badge`, or `metadata.role`). The frontend only checked one location, causing badges to be missing for some characters.

### Solution
The badge extraction logic in `ItemCardCollapsed.tsx` was updated to:
- Prefer `item.role` if present and non-empty.
- Otherwise, use `item.metadata.badge` if present and non-empty.
- Otherwise, use `item.metadata.role` if present and non-empty.
- Handles both string and string[] values for robustness.

This ensures all badges display correctly for all characters, regardless of where the badge is stored in the enriched data.

### Implementation
A new `getBadge` function was added to `ItemCardCollapsed.tsx`:
```ts
function getBadge(item: EnrichedEntity): string | undefined {
  const tryGet = (val: unknown): string | undefined => {
    if (typeof val === 'string' && val.trim()) return val;
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') return val[0];
    return undefined;
  };
  if (tryGet(item.role)) return tryGet(item.role);
  if (item.metadata) {
    if (tryGet(item.metadata.badge)) return tryGet(item.metadata.badge);
    if (tryGet(item.metadata.role)) return tryGet(item.metadata.role);
  }
  return undefined;
}
```

The card now displays the badge for all characters, including those previously missing it.

### Impact
- All character cards now reliably display their badge/role.
- No regressions or type/lint errors introduced.
- The UI is now robust to future data pipeline changes regarding badge/role placement.

---

**This patch is now reflected in the codebase and documentation.**
