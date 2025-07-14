# 📖 Source of Truth: Project Documentation (v6 - Unified)

This is the canonical, always-up-to-date reference for how all data is authored, parsed, and processed in this project. This system is designed to be flexible, scalable, and fully automated. **This document reflects all recent refactoring and should be considered the single source of truth for all development.**

---

## ⚙️ The Data Pipeline Workflow

The project uses a modular, three-stage pipeline to transform raw data into a searchable, client-ready application. This process is identical for all data types (characters, locations, etc.).

### 1. Data Authoring: The Unified Markdown Format

All data for the encyclopedia—characters, locations, fauna, food, etc.—is authored in a single, unified markdown format. This structure is essential for the parser to work correctly.

#### **The Unifying Principle (MANDATORY)**

The single, unifying requirement for **all** data files is that they **must begin with a YAML frontmatter block** (`---`) at the absolute top of the file (no preceding characters or blank lines).

-   That frontmatter block **must** contain a `type` field, which determines how the rest of the file is parsed (e.g., `type: character`, `type: location`).
-   The body of the file **must** contain at least one fenced JSON code block (` ```json `) containing structured data. The parser will merge all JSON blocks found in a file into a single, rich data object.

#### **File Location & Encoding**

-   **Location:** Data is organized by type in `raw-data/`.
    -   `raw-data/characters/[character-slug].md`
    -   `raw-data/locations/[location-slug].md`
-   **Encoding:** All files **must** be saved as **UTF-8 (without BOM)**. Some editors add an invisible Byte Order Mark (BOM) at the start of the file, which will cause the parser to fail. In VS Code, use "Save with Encoding" and choose "UTF-8".

#### **Structure for Character Files (`type: character`)**

To support the rich detail required for characters, the parser uses a specific structure. This format is mandatory for all character files.

1.  **YAML Frontmatter (MANDATORY):**
    *   Must be at the absolute top of the file.
    *   Must contain `type: character`.

2.  **UI - CARD VIEW Block (MANDATORY):**
    *   Must start with the exact heading: `## UI - CARD VIEW`.
    *   Must be followed by a fenced ` ```md ` code block containing a dash-prefixed list of summary fields (e.g., `- Name: Azula`).

3.  **UI - EXPANDED VIEW Block (MANDATORY):**
    *   Must start with the exact heading: `## UI - EXPANDED VIEW`.
    *   Must be followed by a fenced ` ```md ` code block containing detailed, human-readable markdown.

4.  **Backend Metadata Block(s) (MANDATORY):**
    *   Include one or more sections, each starting with a heading (e.g., `## 🪪 Identity & Demographics`) followed by a fenced ` ```json ` code block.
    *   **Required Fields:** At least one JSON block must contain the `id` and `slug` fields, which must match the file's slug.

#### **Structure for All Other Data Types (e.g., `type: location`)**

For any non-character data type, the structure is simpler but follows the same core principles.

1.  **YAML Frontmatter (MANDATORY):**
    *   Must be at the absolute top of the file.
    *   Must contain the appropriate `type` (e.g., `type: location`, `type: fauna`).

2.  **Human-Readable Content (Optional):**
    *   Use standard markdown (headings, lists, paragraphs) to write descriptive content.

3.  **Backend Metadata Block(s) (MANDATORY):**
    *   Include one or more fenced ` ```json ` code blocks containing the structured data.
    *   **Required Fields:** Every record must have an `id` and a `slug` field within one of its JSON blocks.

### 2. The Automated Scripts

The data pipeline is composed of three single-responsibility scripts.

1.  **Parse Markdown (`scripts/1-parse-markdown.mjs`)**: This is a universal parser. It first reads the `type` from the YAML frontmatter. If `type` is 'character', it expects the rich UI block structure. For all other types, it parses the body for JSON blocks.
2.  **Enrich Data (`scripts/2-enrich-data.mjs`)**: Reads parsed data and adds machine-generated fields like a `slug`.
3.  **Build Search Index (`scripts/3-build-index.mjs`)**: Reads enriched data to build the final client-ready FlexSearch index.

### 3. How to Add or Update Data (The Full Pipeline)

To prevent errors, always use the master script in `package.json` which executes all steps in the correct order.

1.  **Create or Edit Markdown File:** Follow the required format described above precisely.
2.  **Run the Full Pipeline:** Open your terminal and run:
    ```bash
    npm run build:data
    ```
3.  **Check for Errors:** Watch the terminal for any parsing errors or warnings.
4.  **Refresh UI:** Hard refresh your browser (`Ctrl+F5` or `Cmd+Shift+R`) to see the changes live.

---

## 🏗️ Frontend Architecture & Logic

The frontend is architected around the Single Responsibility Principle, with clear separation between state management, data fetching, and presentation.

### 1. `HomeContainer.tsx`: The Orchestrator

This component is the "brain" of the main page but contains minimal logic itself. Its primary responsibility is to orchestrate a series of custom hooks.

-   Fetches initial character data via `ClientSearchEngine`.
-   Calls custom hooks (`useSearchHandler`, `useFilters`, `useSuggestions`).
-   Passes the state and handlers from these hooks down to the presentational `<Home />` component.

### 2. Custom Hooks: The Logic Hubs

All complex state management is isolated into reusable, single-purpose hooks.

-   **`useSearchHandler.ts`**: Manages the search query state and calls the `useAustrosSearch` hook to get results.
-   **`useFilters.ts`**: Manages all filter-related logic: deriving filter options from data, handling active filter state, and returning the filtered list of items.
-   **`useSuggestions.ts`**: Encapsulates the logic for generating search query suggestions based on search results.

### 3. `SearchBar.tsx`: The Unified Component

-   **Location:** `src/components/SearchBar.tsx`
-   **Responsibility:** A single, flexible component that handles both simple form-based search and advanced, suggestion-aware search.
-   **Implementation:** It uses Tailwind CSS for styling and accepts optional props (`onSubmit`, `suggestion`, `nationIcon`, etc.) to conditionally render its features. This consolidation eliminates code duplication.

### 4. `stringUtils.ts`: Shared Utilities

-   **Location:** `src/utils/stringUtils.ts`
-   **Responsibility:** Contains general-purpose, non-React helper functions (e.g., `toTitleCase`, `getInitials`). Components like `ItemCard` import these helpers instead of defining them locally.

---

## 🎨 Styling & UI Policy

### 1. CSS Source of Truth: Tailwind CSS (v3.4.3)

The project is pinned to `tailwindcss@3.4.3` due to a critical, unrecoverable environmental bug with the v4+ CLI installer on the primary development machine.

-   **Policy:** **Never upgrade `tailwindcss` above `3.4.3`** without first verifying, in a disposable clone, that the CLI binary (`tailwindcss.cmd`) appears in `node_modules/.bin` after a clean install.
-   **Usage:** All styling must be done with Tailwind CSS utility classes. Always use the local CLI for builds:
    ```powershell
    .\node_modules\.bin\tailwindcss.cmd -i ./src/styles/pure-tailwind.css -o ./src/styles/generated-tailwind.css
    ```
-   **Manual Build Required:** The build process is not automated. **You must manually run the command above** after any change to Tailwind config, theme, or class usage for your changes to appear in the UI.

### 2. UI/UX Rules

-   **Card Grid Hover:** **Always use Flexbox (`flex flex-wrap`) for card grids**, never CSS Grid. Grid layouts will clip hover effects like scaling and shadows. The grid container must have sufficient padding (e.g., `p-8`) to prevent edge clipping.
-   **Modal/Overlay Borders:** **Never apply `border`, `rounded-*`, or `shadow-*` styles to both a modal container and its child card.** Only the innermost component should have these "card-like" styles to prevent double borders or visual artifacts.
-   **Responsive Layouts:** Use `flex-wrap` for tag/pill groups. Use `flex-shrink-0`, `flex-1`, and `truncate` for list items to ensure they adapt gracefully.

---

## 🩺 Troubleshooting & Lessons Learned

-   **Problem: My data file is being skipped.**
    *   **Cause 1 (Most Common):** The file is saved with a **UTF-8 BOM**. Re-save it as plain "UTF-8".
    *   **Cause 2:** The file is **missing the `---` YAML frontmatter block with a `type` field** at the very top.
    *   **Cause 3:** The file is **missing a ` ```json ` block** with the required `id` and `slug` fields.
    *   **Cause 4 (Characters Only):** The file is missing the exact `## UI - CARD VIEW` or `## UI - EXPANDED VIEW` headers.

-   **Problem: The data pipeline fails unexpectedly.**
    *   **Cause:** The version of Node.js being used may have unstable or experimental features. The original `fs.readdir({ recursive: true })` call was unreliable for this reason.
    *   **Solution:** The pipeline now uses a robust, custom recursive file walker that is compatible with all modern Node.js versions.

-   **Problem: A linter error appears in a `.mjs` script.**
    *   **Cause:** The root `tsconfig.json` is configured for the `src` directory.
    *   **Solution:** The project now has a dedicated `tsconfig.node.json` for all scripts, which resolves tooling conflicts correctly. **Do not ignore these linter errors.**

-   **Problem: Vite fails to resolve a local import (e.g., "Failed to resolve import '../theme/nationThemes'") even though the file exists and all paths are correct.**
    *   **Cause:** This is a known Vite/Windows bug, especially in projects with long paths or spaces. The Vite dev server's resolver can fail to recognize valid TypeScript files due to path ambiguity or cache issues.
    *   **Solution (CRITICAL):**
        1. Open `vite.config.ts` and ensure the following alias is present in the `defineConfig` block:
            ```ts
            import path from 'path';
            // ...
            resolve: {
              alias: {
                '@': path.resolve(__dirname, './src'),
              },
            },
            ```
        2. Update all imports of local files to use the `@` alias and include the `.ts` extension. For example:
            ```ts
            // Instead of:
            import { nationThemeMap } from '../theme/nationThemes';
            // Use:
            import { nationThemeMap } from '@/theme/nationThemes.ts';
            ```
        3. Restart the Vite dev server. The import error will be resolved, as the alias gives Vite a direct, unambiguous path from the project root.
        4. After resolving, always run:
            ```bash
            npm run lint
            npx tsc --noEmit
            ```
            to verify the project is clean and error-free.