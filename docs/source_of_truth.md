# 📖 Source of Truth: Project Documentation (v3)

This is the canonical, always-up-to-date reference for how data, styling, and logic are managed in the Austros ATLA World Encyclopedia. This system is built to be type-safe, scalable, and fully automated. **This document reflects all system upgrades, including the advanced filtering and search capabilities, and should be considered the single source of truth for all data handling.**

---
---

## ⚙️ The Data Pipeline Workflow

This is the standard operating procedure for any data changes. The pipeline is designed to be robust, but it depends on the correct initial data format.

### **1. ✍️ Data Authoring: The v3.0 Metadata Schema**

All character data is authored in a custom markdown format designed for maximum detail and automated parsing.

*   **File Location:** `raw-data/characters/[character-slug].md`
*   **Structure:**
    1.  **Card View Block:** A `UI - CARD VIEW` block for high-level summary info.
    2.  **Expanded View Block:** A `UI - EXPANDED VIEW` block for human-readable detailed descriptions.
    3.  **Backend Metadata Blocks:** Multiple `json` code blocks containing detailed fields from the `v3.0` character schema. These are parsed, merged, and flattened into a single, rich object.

### **2. 🤖 Parsing, Validation & Indexing: The Automated Scripts**

This is the automated process that transforms raw markdown into a structured, searchable application.

1.  **Parse Custom Markdown (`npm run parse:characters`)**
    *   **What it does:** Runs `scripts/parse-character-md.mjs`. This custom script reads our unique `.md` format, extracts Card and Expanded View data, finds all `json` blocks, and flattens them into a single, valid JSON object per character.
    *   **Output:** Creates individual `.json` files in `raw-data/characters/json/`.

2.  **Validate Data (`npm run validate:data`)**
    *   **What it does:** Validates all raw `.json` files against their schemas in `raw-data/schema/` using Zod. **The pipeline fails on any error, preventing bad data from proceeding.**

3.  **Enrich Data (`npm run enrich:data`)**
    *   **What it does:** Adds machine-generated fields: a unique `id`, a URL-friendly `slug`, and a `__type` identifier to every record.
    *   **Output:** A single, consolidated `dist/enriched-data.json` file.

4.  **Build Search Index (`npm run build:index`)**
    *   **What it does:** Reads the enriched data to build a fast, client-ready FlexSearch index.
    *   **Indexed Fields:** Includes core fields (`name`, `description`) and **all filterable v3.0 metadata fields** (`nation`, `gender`, `archetype`, `moralAlignment`, and a flattened `all_tags` field from `tagCategories`).
    *   **Output:** `public/search-index.json`. This is the file the live application loads.

### **3. 🚀 The Full Pipeline (Recommended)**

To prevent errors, always use the master script which executes all steps in the correct order:
```bash
npm run build:data
```

### **4. ✅ How to Maintain the Data**

- **Edit or Add Data:** Modify or create files in the `raw-data/` directory, strictly following the v3.0 schema and custom markdown format.
- **Run the Pipeline:** Open your terminal and run `npm run build:data`.
- **Check for Errors:** Watch the terminal output for any validation or enrichment errors.
- **Refresh UI:** Hard refresh your browser (`Ctrl+F5` or `Cmd+Shift+R`) to see the changes live.

---

## 🔍 Dynamic Filtering & Search System

The encyclopedia's core user experience is driven by a dynamic filtering and search system that leverages the rich v3.0 metadata.

### 1. System Architecture

- **Logic Hub (`HomeContainer.tsx`):** This component is the "brain". It fetches all character data, dynamically generates a configuration for the filter UI based on the available data, and applies all active filters.
- **Filter UI (`FilterSidebar.tsx`):** This presentational component receives the configuration from HomeContainer and renders the filter categories and their options. It is entirely data-driven.
- **Search Engine (`ClientSearchEngine.ts`):** This module manages the client-side FlexSearch index, which includes all filterable fields for fast, text-based queries.

### 2. How Filtering Works

- **Config Generation:** `HomeContainer.tsx` defines a `filterConfig` array that lists all fields to be used as filters (e.g., nation, gender, archetype, `tagCategories.combatTags`).
- **Option Extraction:** The container iterates through all character data and the `filterConfig` to dynamically find every unique value for each filter category (e.g., all unique "nations", all unique "combat tags").
- **UI Rendering:** The `FilterSidebar` receives this configuration and the list of unique options, and renders them as clickable tags for the user.
- **State Management:** When a user clicks a filter tag (e.g., "Male"), the `onToggleFilter` callback is fired. HomeContainer updates its `activeFilters` state.
- **Data Filtering:** A `useMemo` hook in HomeContainer re-calculates the `filteredResults` whenever the `activeFilters` state changes. This logic is case-insensitive and supports filtering on both simple fields (gender) and nested arrays (tagCategories).
- **Grid Update:** The `EntityGrid` component receives the new `filteredResults` and re-renders to show only the matching characters.

### 3. How Search Works

- **Parallel System:** Search operates on the pre-built `search-index.json`, not the full dataset used for filtering. This ensures speed.
- **Indexed Fields:** All filterable metadata, including gender, archetype, and all flattened tags, are included in the search index.
- **User Query:** When a user types in the `SearchBar`, the `useAustrosSearch` hook performs a debounced, case-insensitive query against the FlexSearch index.
- **Combined Power:** When a user has active filters and then types a search query, the search is performed first, and then the filters are applied to the search results, creating a powerful "search within" experience.

---

## 🎨 CSS Source of Truth: Tailwind CSS

The project uses Tailwind CSS for all styling. Due to a critical, unrecoverable CLI install bug with Tailwind v4+, this project is pinned to tailwindcss@3.4.3 and will remain on this version until a complete OS/user environment migration is feasible.

### 1. **Why We Use Tailwind 3.4.3 (and Not v4+)**

* **Attempted upgrades to Tailwind v4+ consistently failed** to generate the CLI binary (`tailwindcss`, `tailwindcss.cmd`) on both global and local installs.
* All other CLI tools (Vite, ESLint, Prettier, etc.) worked and appeared in `.bin`, but Tailwind v4+ never produced the executable—despite successful npm logs.
* This was **replicated after a full Node.js uninstall/reinstall, npm cache purge, and new LTS install.**
  The issue persisted across all paths (global/local), and was unaffected by PATH or environment variable tweaks.
* Only **downgrading to `tailwindcss@3.4.3`** produces the CLI binary in `.bin`—enabling local builds and unlocking the full workflow.
* **Root Cause:**

  * The true root cause appears to be an npm postinstall script incompatibility or file system/permissions bug triggered by the new Tailwind v4+ CLI installer.
  * There is no evidence this is a project configuration or code issue.
  * This is strictly an environmental and npm ecosystem compatibility problem.

### 2. **Policy for Future Devs**

* **Never upgrade `tailwindcss` above `3.4.3` in this codebase** without first verifying, in a disposable clone, that the CLI binary appears in `node_modules/.bin` after install.
* If a future OS/user migration fully resolves the environment and `tailwindcss@4.x` CLI works, document the procedure and test all build scripts before switching.
* Any changes to Tailwind version **must be justified with specific, tested benefits** and the CLI must remain locally runnable.

### 3. **How to Use Tailwind Locally**

* Always use the local CLI, not global.
* To build styles, run:

  ```powershell
  .\node_modules\.bin\tailwindcss.cmd -i ./src/styles/pure-tailwind.css -o ./src/styles/generated-tailwind.css
  ```
* Import `generated-tailwind.css` in your entry file (`main.tsx`) after any edits.
* Never expect Tailwind’s global CLI to work on this system/profile.

### 4. **Key Lessons for the Team**

* **Never assume a major npm CLI upgrade will “just work”**—always verify presence of new binaries in `.bin` before adopting any new version.
* If you hit “CLI not found” or “no output CSS” errors after install/upgrade, check your `.bin` folder before debugging code or config.
* **Global npm CLI tools are unreliable on this system:**
  Pin all dev tooling to local project install (`devDependencies`) and always use the project-local path for CLI invocations.
* If migrating to a new system or user, **test the Tailwind v4+ CLI install in a new project first** before attempting to migrate this codebase.

### 5. **MANDATORY: Manual Tailwind Build Requirement**

**All contributors must manually rebuild Tailwind CSS after any change to Tailwind config, theme, or class usage. This is a non-negotiable step for correct UI rendering.**

- **Command:**
  ```powershell
  .\node_modules\.bin\tailwindcss.cmd -i ./src/styles/pure-tailwind.css -o ./src/styles/generated-tailwind.css
  ```
- **When to run:**
  - After any edit to `tailwind.config.js` (theme, colors, plugins, etc.)
  - After adding or changing any Tailwind class in the codebase
  - After adding new custom CSS or variables used by Tailwind
- **Why:**
  - The project imports only `generated-tailwind.css` in `main.tsx`.
  - If you do not rebuild, new classes and theme changes will not appear in the UI, causing broken or unstyled components.
  - The build is not automated due to local environment constraints and must be run manually.
- **Policy:**
  - Never commit or push UI changes without first running the build and verifying the output.
  - If you see missing styles, always rebuild before debugging code or config.
  - This policy is enforced for all maintainers and contributors.

---

## 🖌️ Custom CSS & CSS Classes: Tailwind Integration Policy

**All custom CSS that uses Tailwind features (e.g., `@layer`, `theme()`, or Tailwind variables) must be processed by Tailwind itself.**

### 1. Why This Matters
- Browsers do not understand Tailwind's `@layer` or `theme()` directives. If you import a CSS file with these directly into your app, those rules will be ignored.
- Only Tailwind's build process can interpret and compile these advanced features into usable CSS.

### 2. Correct Workflow for Custom CSS
- **Always import your custom CSS into your main Tailwind input file** (e.g., `pure-tailwind.css`) using `@import './custom.css';` at the top.
- This ensures all custom classes, variables, and `@layer` rules are processed and included in the final output (`generated-tailwind.css`).
- **Never import custom CSS directly in your app entry point** (e.g., `main.tsx`) if it contains Tailwind features.
- The app should only import the single, generated CSS file:
  ```ts
  // main.tsx
  import './styles/generated-tailwind.css';
  ```

### 3. Policy for Custom Classes & Specificity
- Use `@layer components` or `@layer utilities` in your custom CSS to ensure your classes are merged at the correct specificity level with Tailwind's output.
- If you need to override Tailwind classes, use the same selectors and layers, or add `!important` only as a last resort.
- Custom classes should be named clearly and not conflict with Tailwind's utility class names.

### 4. Example: Correct vs. Incorrect Usage

**Correct:**
```css
/* src/styles/pure-tailwind.css */
@import './custom.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```css
/* src/styles/custom.css */
@layer components {
  .themed-card {
    border-color: theme('colors.subtle / 20%');
  }
  .themed-card:hover, .themed-card.is-expanded {
    border-color: var(--nation-color);
    box-shadow: 0 0 20px 0 var(--nation-glow);
    transform: translateY(-2px);
  }
}
```

**Incorrect:**
```ts
// main.tsx
import './styles/custom.css'; // ❌ This will NOT work for @layer/theme() rules
```

### 5. Troubleshooting
- If your custom classes are not working, ensure they are imported into the Tailwind input file and that you have rebuilt your CSS.
- Always run the Tailwind build after changing custom CSS or Tailwind config.
- Only the generated CSS file should be imported in your app entry point.

---

**This policy is non-negotiable and must be observed by all maintainers.**
**Do not repeat these environment troubleshooting steps unless the underlying root cause (OS/user profile or npm installer bug) has been independently resolved and verified.**

---

## 🩺 Troubleshooting & Rationale (Lessons Learned)

This section documents common issues and their root causes, based on our debugging of the filter sidebar.

#### **Problem:** The filter sidebar is empty or only shows "Nation".
*   **Cause:** Catastrophic failure in the `scripts/parse-character-md.mjs` script.
*   **Solution:** Ensure the parser script is up to date and regenerate all data with `npm run build:data`.

#### **Problem:** A new character I added doesn't appear in the app.
*   **Cause:** The data for that character likely failed the Zod schema validation step.
*   **Solution:** Run `npm run validate:data`, check the terminal for errors, fix the source .md file, and re-run the full pipeline.

#### **Problem:** A filter option works, but searching for the same term yields no results.
*   **Cause:** The field is being filtered correctly from the raw data but was not added to the search index configuration in `scripts/build-index.mjs` and `src/search/ClientSearchEngine.ts`.
*   **Solution:** Add the missing field to the index configuration in both files, then run `npm run build:data` to regenerate the search index.

---

## ⚙️ Data Parsing: SRP-Compliant Parser

The character data parser (`scripts/parse-character-md.mjs`) now follows the Single Responsibility Principle (SRP):
- **Responsibility:** Only parses and merges all available data (Card View and all backend JSON blocks) into a single, rich JSON object per character.
- **No UI or filter/search logic:** The parser does not make assumptions about how data will be used. It does not map or filter fields for UI or search.
- **Downstream mapping:** UI components (like `ItemCard.tsx`) and data pipeline scripts (like `enrich-data.mjs`, `build-index.mjs`) are responsible for selecting and mapping the fields they need from the rich JSON.
- **Benefit:** Changes to UI or search logic do not require changes to the parser, and vice versa. This makes the system robust and maintainable.

---

## 🛡️ Modal & Overlay Styling: Single-Responsibility Border Policy

**Rule:**
> *Never apply border, radius, or shadow styles to both a modal/overlay container and its child card/component. Only the card/component itself should have these styles.*

### **Why?**
- Stacking two elements with borders/radii/shadows (e.g., a modal overlay and a card) will always result in a double border or “ghost” outline, especially with partial opacity or shadows.
- This is a structural bug, not just a CSS issue: it’s caused by rendering two “card” layers at once.

### **How to Prevent:**
- **Overlay/modal containers** should be visually neutral: use only background color/opacity for dimming, and never add border, radius, or shadow.
- **Cards/components** should own all their own border, radius, and shadow styles.
- When rendering a modal overlay, **remove or hide the card from the underlying grid/list** to avoid duplicate rendering.
- Always inspect the DOM in dev tools if you see a double border or outline—look for stacked elements with similar styles.

### **Checklist for Future Edits:**
- [ ] Is the card/component rendered only once at a time?
- [ ] Does only the card/component have border/radius/shadow?
- [ ] Is the modal/overlay container visually neutral (no border/radius/shadow)?
- [ ] Have you tested with the grid/list item hidden when the modal is open?

### **Example (Do/Don’t):**
```jsx
// DO: Only the card has border/radius/shadow
<div className="modal-overlay bg-black bg-opacity-70">
  <div className="card rounded-2xl border shadow-2xl">...</div>
</div>

// DON'T: Both overlay and card have border/radius/shadow
<div className="modal-overlay rounded-2xl border shadow-2xl bg-black bg-opacity-70">
  <div className="card rounded-2xl border shadow-2xl">...</div>
</div>
```

---

## 🗂️ Card Info Rendering Policy (Non-Negotiable)

**Summary:**
- The compact card view must always display the human-authored summary/description (from the markdown, not backend metadata fields).
- The expanded card view must always render the full, human-authored markdown from the `expandedView` field, using a markdown renderer (e.g., ReactMarkdown) and styled with Tailwind's `prose` classes for beautiful, readable output.
- **Never** reconstruct the expanded view from backend metadata fields (e.g., notableFeats, relationships, etc.). The curated, narrative markdown content is the source of truth for the expanded card.
- If the markdown is missing, display a minimal, clearly marked placeholder (e.g., "No detailed view available.").

**Rationale:**
- The authored markdown content is carefully crafted for clarity, narrative flow, and encyclopedic quality. Rebuilding the expanded view from raw fields loses nuance, context, and the intended user experience.
- This policy ensures the encyclopedia always presents the highest-quality, most readable, and most intentional content to users.

**Enforcement:**
- All maintainers and contributors must follow this policy. Any regression to metadata-driven expanded views is a critical bug and must be immediately reverted.
- Reviewers must check that all card and expanded views are rendering the correct, authored content.

---