### **Consolidated Repository Cleanup & Refactoring Plan**

This report synthesizes the findings from all provided analyses into a single, actionable plan. It uses the project's official documentation (`source_of_truth.md`, `data pipeline.md`, etc.) as the final arbiter for resolving conflicts and ambiguities.

### **Phase 1: Critical Consolidation & Data Pipeline Integrity**

This phase focuses on resolving the most critical conflicts in the data processing scripts and files, ensuring a single, reliable source of truth for the application's data.

#### **Step 1.1: Unify the Data Pipeline Scripts**

*   **Problem:** Multiple, competing scripts exist to enrich data and build the search index (`scripts/3-build-index.mjs`, `scripts/build-index.mjs`, `build-index.cjs`, `scripts/2-enrich-data.mjs`, `scripts/enrich-data.mjs`).
*   **Analysis:** Your `data pipeline.md` and `environment context.md` documentation clearly define a canonical, three-stage pipeline using numbered scripts: `1-parse-markdown.mjs`, `2-enrich-data.mjs`, and `3-build-index.mjs`. The other scripts are redundant, legacy, or experimental and create confusion about the correct workflow.
*   **Solution:**
    1.  **Keep** the canonical scripts:
        *   `scripts/1-parse-markdown.mjs`
        *   `scripts/2-enrich-data.mjs`
        *   `scripts/3-build-index.mjs`
    2.  **Delete** the following redundant scripts:
        *   `scripts/build-index.mjs`
        *   `scripts/enrich-data.mjs`
        *   `build-index.cjs`
    3.  **Verify** that the `build:data` script in `package.json` executes the canonical `1-2-3` pipeline correctly.

#### **Step 1.2: Establish Authoritative Data Files**

*   **Problem:** Multiple `enriched-data` JSON files exist (`data/enriched-data.json`, `public/enriched-data.json`, `public/enriched-characters.json`), making it unclear which is the source for the UI and search index.
*   **Analysis:** The `data pipeline.md` describes a flow where raw data is processed into an intermediate `enriched-data.json`. The `search engine.md` states the app loads `public/search-index.json`. The most robust pattern is to have the pipeline generate final, public-facing assets in the `public/` directory.
*   **Solution:**
    1.  Modify `scripts/2-enrich-data.mjs` to write its final output to `public/enriched-data.json`. This file will serve as the single source for both the search indexer and any direct data lookups in the app.
    2.  Modify `scripts/3-build-index.mjs` to read **only** from `public/enriched-data.json` to build `public/search-index.json`.
    3.  **Delete** the other, now-redundant data files: `data/enriched-data.json` (if it's just an intermediate step) and `public/enriched-characters.json`.

---

### **Phase 2: Frontend Codebase Refactoring & Alignment**

This phase focuses on removing dead code, placeholder features, and aligning the React components with the application's current, active feature set.

#### **Step 2.1: Resolve Disabled UI and Dead Logic**

*   **Problem:** Multiple components (`FilterSidebar`, `CollectionsSidebar`, `CollectionsPanel`, etc.) are intentionally disabled by returning `null`, but the parent component (`HomeContainer.tsx`) and related hooks (`useCollectionsData`, `useCollectionsUI`) still contain all the logic to support them. This results in dead code and a prop mismatch between `HomeContainer` and `Home`.
*   **Analysis:** Your `styling.md` confirms that returning `null` is the project's convention for hiding features. However, the logic that drives these features was not removed, leading to code rot.
*   **Solution:**
    1.  In `src/pages/HomeContainer.tsx`, remove all state, handlers, and hook invocations related to the disabled Collections and Filtering features. Specifically, remove the usage of `useCollectionsData`, `useCollectionsUI`, and `useFilters`.
    2.  Update the props passed to the `<Home />` component to only include props that are actually used.
    3.  Update the `HomeProps` type in `src/pages/Home.tsx` to match the props it now receives.
    4.  Since the UI is disabled, the hooks themselves are dead code. **Delete** the following files:
        *   `src/hooks/useCollectionsData.ts`
        *   `src/hooks/useCollectionsUI.ts`
        *   `src/hooks/useFilters.ts`
        *   `src/collections/CollectionManager.ts`
        *   The disabled components themselves (`CollectionsSidebar.tsx`, `FilterSidebar.tsx`, etc.) can also be deleted.

#### **Step 2.2: Prune Placeholder and Unused Hooks/Utilities**

*   **Problem:** The codebase contains several unfinished or un-integrated hooks and utilities, such as `useFlexSearch`, `useVirtualScroll`, `QueryParser.ts`, `SuggestionEngine`, and `slug-utils.mjs`.
*   **Analysis:** The `search engine.md` and `frontend architecture.md` documents point to `useAustrosSearch` and `useSearchHandler` as the functioning search hooks, making `useFlexSearch` a confusing, abandoned alternative. The other utilities are stubs with no callers.
*   **Solution:**
    *   **Delete** the following placeholder and unused files to eliminate confusion and code noise:
        *   `src/hooks/useFlexSearch.ts`
        *   `src/hooks/useVirtualScroll.ts`
        *   `src/search/QueryParser.ts`
        *   `src/collections/SuggestionEngine.ts`
        *   `scripts/slug-utils.mjs`

---

### **Phase 3: Final Cleanup & Documentation Polish**

This final phase removes all remaining project clutter and ensures the repository is clean, maintainable, and easy for new developers to approach.

#### **Step 3.1: Remove Redundant and Temporary Files**

*   **Problem:** The repository is cluttered with backup files, invalid reports, temporary test scripts, and duplicate assets.
*   **Analysis:** These files serve no production purpose and increase the maintenance burden.
*   **Solution:**
    *   **Delete** the following files and directories:
        *   `src/theme/nationThemes.bak` (duplicate theme file)
        *   `public/enriched-data.backup.json` (stale data backup)
        *   `INDEX.HTML` (legacy file in project root)
        *   `depcheck-report.json` (invalid/empty report)
        *   `src/styles/test.css` (temporary styles)
        *   All temporary/experimental scripts:
            *   `hello.cjs`
            *   `test-flexsearch.cjs`
            *   `test-flexsearch.mjs`
            *   `test2.cjs`
            *   `scripts/srp-llm-scan.ts` (stub script)

#### **Step 3.2: Update the Project README**

*   **Problem:** The `README.md` file is a minimal placeholder and lacks essential project information.
*   **Analysis:** A good README is crucial for project onboarding and maintainability. Your project documentation already contains all the necessary information.
*   **Solution:**
    1.  Replace the contents of `README.md` with a concise and helpful overview.
    2.  **Recommended Content:**
        *   **Project Name:** Austros ATLA World Encyclopedia
        *   **Overview:** A brief, one-paragraph description from `environment context.md`.
        *   **Tech Stack:** A short list (React, Vite, TypeScript, Tailwind CSS, FlexSearch).
        *   **Getting Started / Setup:** Copy the exact steps from `environment context.md`:
            ```markdown
            ## Getting Started

            1.  Install dependencies:
                `npm install`

            2.  Build the data and search index:
                `npm run build:data`

            3.  Start the development server:
                `npm run dev`
            ```
        *   **Important Note on Styling:** Add a note about the manual Tailwind build step: "After changing any styles in code or in `tailwind.config.js`, you must manually rebuild the CSS with `npm run build:tailwind`."