# 📖 Source of Truth: Project Documentation (v3)

This is the canonical, always-up-to-date reference for how data, styling, and logic are managed in the Austros ATLA World Encyclopedia. This system is built to be type-safe, scalable, and fully automated. **This document reflects all system upgrades, including the advanced filtering and search capabilities, and should be considered the single source of truth for all data handling.**

---
---

## ⚙️ The Data Pipeline Workflow (2024+)

This is the standard operating procedure for any data changes. The pipeline is robust, but depends on the correct initial data format and a strict character-only policy for all downstream data.

### **1. ✍️ Data Authoring: The v3.0 Metadata Schema**

All character data is authored in a custom markdown format designed for maximum detail and automated parsing.

*   **File Location:** `raw-data/characters/[character-slug].md`
*   **Structure:**
    1.  **Card View Block:** A `UI - CARD VIEW` block for high-level summary info.
    2.  **Expanded View Block:** A `UI - EXPANDED VIEW` block for human-readable detailed descriptions.
    3.  **Backend Metadata Blocks:** Multiple `json` code blocks containing detailed fields from the `v3.0` character schema. These are parsed, merged, and flattened into a single, rich object.

## How to Author Character Markdown Files (v3.0 Schema)

> **MANDATORY: Use the following format for every character file. The parser will fail if you do not.**

1. **Card View Block (for UI summary):**
   ```
   ## UI - CARD VIEW

   ```md
   - Name: [Character Name]
   - Nation: [Nation]
   - Short Description: [1-2 sentence summary]
   ```
   ```

2. **Expanded View Block (for detailed UI view):**
   ```
   ## UI - EXPANDED VIEW

   ```md
   (Detailed markdown content, can use markdown formatting, lists, quotes, etc.)
   ```
   ```

3. **Backend Metadata Blocks:**
   - Add as many `json` code blocks as needed, each with a specific section of the v3.0 schema.

4. **Do NOT use `---` or bold/asterisk fields for Card/Expanded View.**
   - The parser will ignore these and set fields to "Unknown".

5. **After editing or adding a file, always run:**
   ```
   npm run build:data
   ```
   - Check for errors in the terminal.
   - Hard refresh your browser to see changes.

---

## 🛑 Common Pitfalls & How to Avoid Data Loss in the App/Search

> **If a new character is missing from the app or search index, or appears as "Unknown":**

### 1. Authoring Checklist (MANDATORY)
- **File location:** `raw-data/characters/[character-slug].md` (filename must match the canonical slug, e.g., `combustion-man.md`)
- **Card View Block:**
  - Must start with `## UI - CARD VIEW` (level 2 header)
  - Must use a fenced code block: <code>```md</code>
  - Each field must be dash-prefixed (e.g., `- Name: ...`)
- **Expanded View Block:**
  - Must start with `## UI - EXPANDED VIEW` (level 2 header)
  - Must use a fenced code block: <code>```md</code>
  - Content can be any markdown, but must be inside the code block
- **Backend Metadata Block(s):**
  - Must use fenced <code>```json</code> code blocks
  - Each block must be valid JSON (no trailing commas, all required fields present)
  - **REQUIRED:** Each backend block must include at least `id` and `slug` fields (these are used for enrichment and indexing)
- **Do NOT:**
  - Use `---`, bold, or asterisk-prefixed fields for Card/Expanded View (these will be ignored)
  - Omit required fields (`id`, `slug`) in backend JSON
  - Use a filename that does not match the canonical slug (e.g., typos like `combustian-man.md`)

### 2. Troubleshooting Checklist
- [ ] Is the filename correct and matches the intended slug?
- [ ] Are all required blocks present and formatted exactly as shown above?
- [ ] Are all backend JSON blocks valid and include `id` and `slug`?
- [ ] Did you run `npm run build:data` and check for errors?
- [ ] Did you hard refresh your browser after rebuilding?
- [ ] If a character is missing or appears as "Unknown":
    - Check the parsed JSON in `raw-data/characters/json/` for missing or empty fields
    - Check `public/enriched-data.json` and `dist/enriched-data.json` for the character's presence
    - If missing, fix the markdown file and rerun the pipeline

> **If you follow this checklist, your new character will always appear correctly in the app and search index.**

---

### **2. 🤖 Parsing, Validation, Cleaning & Indexing: The Automated Scripts**

This is the automated process that transforms raw markdown into a structured, character-only, searchable application.

1.  **Parse Custom Markdown (`npm run parse:characters`)**
    *   **What it does:** Runs `scripts/parse-character-md.mjs`. This custom script reads our unique `.md` format, extracts Card and Expanded View data, finds all `json` blocks, and flattens them into a single, valid JSON object per character.
    *   **Output:** Creates individual `.json` files in `raw-data/characters/json/`.

2.  **Validate Data (`npm run validate:data`)**
    *   **What it does:** Validates all raw `.json` files against their schemas in `raw-data/schema/` using Zod. **The pipeline fails on any error, preventing bad data from proceeding.**

3.  **Enrich Data (`npm run enrich:data`)**
    *   **What it does:** Adds machine-generated fields: a unique `id`, a URL-friendly `slug`, and a `__type` identifier to every record.
    *   **Output:** A single, consolidated `dist/enriched-data.json` file (may contain non-character records at this stage).

4.  **Clean Character Data (`node scripts/clean-characters.mjs`)**
    *   **What it does:** Reads the enriched data and filters out any record that is not a valid character (must have `__type: "character"` and non-empty `name`, `nation`, and `description`).
    *   **Output:** Overwrites both `public/enriched-data.json` and `dist/enriched-data.json` with only valid character records. **No non-character data is present downstream.**
    *   **Safety:** The script creates backups of the original files before overwriting.

5.  **Build Search Index (`npm run build:index`)**
    *   **What it does:** Reads the cleaned, character-only enriched data to build a fast, client-ready FlexSearch index.
    *   **Indexed Fields:** Includes core fields (`name`, `description`) and **all filterable v3.0 metadata fields** (`nation`, `gender`, `archetype`, `moralAlignment`, and a flattened `all_tags` field from `tagCategories`).
    *   **Output:** `public/search-index.json`. This is the file the live application loads.

### **3. 🚀 The Full Pipeline (Recommended)**

To prevent errors, always use the master script which executes all steps in the correct order:
```bash
npm run build:data
node scripts/clean-characters.mjs
npm run build:index
```

### **4. ✅ How to Maintain the Data**

- **Edit or Add Data:** Modify or create files in the `raw-data/` directory, strictly following the v3.0 schema and custom markdown format.
- **Run the Pipeline:** Open your terminal and run the full sequence above.
- **Check for Errors:** Watch the terminal output for any validation or enrichment errors.
- **Refresh UI:** Hard refresh your browser (`Ctrl+F5` or `Cmd+Shift+R`) to see the changes live.
- **If you see extra or "Unknown" cards:** Re-run the cleaning script to ensure only valid character records are present.

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

## 🔎 Search Bar Features & Non-Regression Policy (2024)

**This section documents all advanced search bar features. These are core to the encyclopedia UX and must NEVER be removed or regressed. If any are lost, restore them per this spec.**

### 1. Features
- **Live Text Search:** As the user types, the search bar performs a debounced, case-insensitive query against the FlexSearch index, matching all indexed fields (name, description, nation, gender, archetype, tags, etc.).
- **Auto Suggestion:**
  - As the user types, a suggestion is shown inline after the query if any result's name contains a word that starts with the query (case-insensitive).
  - The suggestion is the remainder of the name from the match point (e.g., typing "bumi" suggests "King Bumi").
  - Suggestion logic is type-agnostic: it works for all cards/data, not just characters.
- **Autofill (Tab Completion):**
  - Pressing Tab autocompletes the query with the current suggestion.
  - The suggestion is only autofilled if visible.
- **Nation Icon Suffix:**
  - If the top search result has a nation, a small React icon (from `react-icons/fa`) is shown as a suffix, moving with the text and suggestion.
  - Icon is color-coded: Air Nomads (yellow wind), Water Tribe (blue water drop), Earth Kingdom (green leaf), Fire Nation (red fire), default (globe).
  - Icon never overlaps text; spacing is handled in the flex container.
- **Dynamic Text Color:**
  - The search bar text color updates to match the detected nation of the top result, using the same color mapping as ThemedCard and FilterSidebar.
- **Accessibility:**
  - All features are keyboard accessible (Tab, focus, etc.).
  - Icons have `aria-label` for screen readers.
- **Performance:**
  - All logic is implemented with React hooks and memoization for instant feedback and zero lag.

### 2. Implementation Details
- **Location:** All logic is in `src/pages/HomeContainer.tsx`, `src/pages/Home.tsx`, `src/components/SearchBar/SearchBar.tsx`, and `src/components/NationIcon/NationIcon.tsx`.
- **Suggestion Algorithm:**
  - For each search result, split the name into words.
  - If any word starts with the query, show the rest of the name as the suggestion.
  - If multiple results match, use the first.
  - If no match, show no suggestion.
- **Nation Icon:**
  - Uses `react-icons` (FaWind, FaTint, FaLeaf, FaFire, FaGlobe).
  - Icon is rendered as a suffix, not a prefix, and moves with the text.
- **Autofill:**
  - Only triggers if a suggestion is visible and the user presses Tab.
  - Does not interfere with normal typing or navigation.
- **Type Agnostic:**
  - All features work for any entity in the search index, not just characters.

### 3. Non-Regression Policy (MANDATORY)
- **These features are non-negotiable.**
- If any are lost, broken, or removed, they must be restored immediately to match this spec.
- All maintainers and contributors must verify these features are present and working after any refactor or UI change.
- If restoring, use the implementation in the files listed above as the canonical reference.
- Any future enhancements must be strictly additive and never remove or degrade these features.

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

## 🧑‍🎨 UI/UX & Responsive Design Rules (2024 Filter & Collections Overhaul)

### Card Grid Hover Clipping: Hard Rule (2024)
- **Never use CSS Grid for card layouts that require hover scaling or shadow bleed.**
- **Always use Flexbox (`flex flex-wrap`) for card grids where cards scale or shadow on hover.**
- **The card grid container must have at least `px-6 py-8` padding** to create a safe edge zone for scaling/shadowed cards.
- **Each card wrapper must use `overflow-visible` and margin (`m-2` or greater) for buffer.**
- **Cap card hover scale to `scale-[1.015]`** to prevent edge collision while preserving the lift effect.
- **Do not use `overflow-hidden`, `overflow-auto`, or tight padding on any parent of the card grid.**
- **If you see card hover effects clipped at the edge, check for missing container padding or a regression to grid layout.**
- This rule is non-negotiable and must be enforced after any layout or UI refactor.

### 1. Responsive Flex Layouts for Pills, Tags, and Lists
- Always use `flex` containers for pill/tag groups and collection lists.
- For pill/tag layouts: use `flex-wrap gap-x-2 gap-y-2` to ensure wrapping and breathing room on all screen sizes.
- For collection items: avatar must use `flex-shrink-0`, name must use `flex-1 min-w-0 truncate`, and action labels (like "View") must use `flex-shrink-0 ml-auto` and be hidden on xs screens (`hidden sm:inline`).
- Never hard-limit name width with `max-w-[Nch]` unless absolutely necessary; prefer `truncate` with `flex-1 min-w-0` for natural expansion.
- Sidebar minimum width should be at least `min-w-[250px]` for usability; increase as needed for longer names.

### 2. Truncation & Tooltips
- Only truncate names when truly necessary (i.e., sidebar is very narrow).
- Always provide a `title` attribute or tooltip for truncated names so the full value is accessible on hover.

### 3. Affordance & Feedback
- All interactive elements (pills, collection items, etc.) must be `<button>`s with clear hover, focus, and active states.
- Use micro-animations (`transition-all`, `duration-100`, `scale-95` on active) for tactile feedback.
- Show selection with both color and a secondary indicator (e.g., checkmark, bold, or filled background) for accessibility.

### 4. Accessibility
- All interactive elements must have `aria-label` or descriptive text.
- Use `aria-pressed` for toggleable pills/tags.
- Ensure keyboard navigation and visible focus rings (`focus-visible:outline-2` or similar).
- Hide non-essential labels (like "View") on small screens, and use icons (e.g., 👁) for clarity.

### 5. Visual Hierarchy & Spacing
- Use clear section headers with hierarchy (`text-lg font-bold` for main, `text-xs uppercase` for subheaders).
- Add vertical margin between filter/collection sections for clarity.
- Use generous padding and rounded corners for all cards, panels, and pills.
- Always provide an empty state with friendly text and an emoji for empty collections or lists.

### 6. Avatar & Icon Rules
- Avatars must never shrink or crowd the name; always use `flex-shrink-0` and a fixed width/height.
- If no image is available, use initials in a colored circle.
- Use consistent icon sizes and spacing in all pills and lists.

### 7. Color & Contrast
- Use color to indicate selection, but never as the only indicator.
- Ensure all text and backgrounds meet WCAG AA contrast standards.
- Use Tailwind color tokens for consistency.

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

## 📝 Canonical Expanded View Structure Required for Rich Cards

> **MANDATORY:** For a fully rich card, your expanded view block must include all of the following sections, using the canonical template below. Omitting sections will result in a less detailed card.

### How to Author the Expanded View Block

- Always include these sections, in this order:
  - `### 📖 Overview` (narrative summary)
  - `### 🧩 Role in the Story` (context and arc)
  - `### 🤝 Relationships` (key connections)
  - `### 🌟 Notable Traits` (personality, skills, quirks)
  - `### 💬 Quotes` (memorable lines)
  - `### ✨ Narrative Highlights` (bulleted list of feats, moments, or traits)
- Use markdown headings, icons, and lists for best results.
- Copy and fill in the structure below:

```
## UI - EXPANDED VIEW

```md
### 📖 Overview

[1-2 paragraph summary]

### 🧩 Role in the Story

[Describe their narrative arc, turning points, or importance.]

### 🤝 Relationships

- [Relationship 1: description]
- [Relationship 2: description]

### 🌟 Notable Traits

- [Trait 1]
- [Trait 2]

### 💬 Quotes

> "Memorable quote here."
> — Character Name

### ✨ Narrative Highlights

- [Bullet point 1]
- [Bullet point 2]
```
```

### Updating Legacy Cards
- If a card is missing sections, edit the expanded view block to match the above template.
- Run `npm run build:data` and hard refresh the app to see the update.

### Future Policy
- A markdown linter or template validator may be added to enforce this automatically. Until then, always use the canonical structure for new and updated cards.

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

## 🚦 Step-by-Step: How to Add a New Character Card (v3.0+ Robust Pipeline)

> **Follow these steps exactly for every new character. The system now auto-repairs most issues, but canonical format is still required for best results.**

1. **Create a new file:**
   - Location: `raw-data/characters/[character-slug].md` (use kebab-case, e.g., `combustion-man.md`)

2. **Add the Card View Block:**
   ```
   ## UI - CARD VIEW

   ```md
   - Name: [Character Name]
   - Nation: [Nation]
   - Short Description: [1-2 sentence summary]
   ```
   ```

3. **Add the Expanded View Block:**
   ```
   ## UI - EXPANDED VIEW

   ```md
   (Detailed markdown content, can use markdown formatting, lists, quotes, etc.)
   ```
   ```

4. **Add at least one Backend Metadata Block:**
   - Use a fenced <code>```json</code> code block
   - Must include at least:
     - `id` (string, kebab-case, matches filename)
     - `slug` (string, kebab-case, matches filename)
     - All other required schema fields as needed
   - Example:
   ```
   ```json
   {
     "id": "combustion-man",
     "slug": "combustion-man",
     "identity": { "fullName": "Combustion Man", ... },
     ...
   }
   ```
   ```

5. **Run the pipeline:**
   ```
   npm run build:data
   node scripts/clean-characters.mjs
   npm run build:index
   ```
   - The system will now auto-normalize and repair most missing fields, but canonical format ensures best results.

6. **Check your card in the app:**
   - Hard refresh your browser.
   - If anything is missing or broken, check the troubleshooting checklist above.
   - If you see extra or "Unknown" cards, re-run the cleaning script.

> **Note:** The parser and enrichment scripts now auto-map alternate/nested field names and fill in missing fields with safe defaults. However, always use the canonical format for new cards to guarantee correct display and searchability.

---

## 🖼️ Character Image Rendering: Name, Slug, and Filename Alignment (2024)

> **New Guideline (2024, updated):** For a character card to display its image, the following must all match **exactly** (case, dashes/underscores, and spacing):
>
> - The **Card View Block Name** (e.g., `- Name: Kuei`)
> - The **backend JSON `slug` field** (e.g., `"slug": "kuei"`)
> - The **image filename** in `public/assets/images/` (e.g., `kuei.jpg`)
>
> **All image filenames must be normalized to kebab-case (lowercase, hyphens, no spaces or underscores) to match the slug.**
> If any of these differ, the app will fall back to initials or not render the image.
>
> **Example: Aunt Wu**
> - Card View Block: `- Name: Aunt Wu`
> - Backend JSON: `"slug": "aunt-wu"`
> - Image file: `public/assets/images/aunt-wu.jpg`
>
> **Result:** Image displays correctly.
>
> **If the image does not display:**
> - Check that the card name, slug, and image filename all match exactly (kebab-case, hyphens, lowercase, no spaces).
> - Rebuild the data pipeline (`npm run build:data`).
> - Hard refresh the browser.
>
> **If the card name is different (e.g., `Earth King Kuei`), but the slug and image are `kuei`, the image will not render.**
>
> **Validation Policy:**
> - All new or updated character images must be checked for filename normalization and presence.
> - A validation script is recommended to enforce asset/slug alignment and surface warnings for mismatches or missing images during the data pipeline.

---

---

## 🚨 Data Authoring Compliance Policy (v3.0 Schema Enforcement)

> **MANDATORY: All character markdown files must strictly follow the v3.0 schema.**

### Common Authoring Mistakes That Cause 'Unknown' Cards
- Using `---` dividers instead of `## UI - CARD VIEW` and `## UI - EXPANDED VIEW` headers.
- Using bold (`**Key:**`) or asterisk-prefixed fields instead of dash-prefixed fields (e.g., `- Name: ...`).
- Omitting fenced code blocks (```md for card/expanded view, ```json for backend).
- Placing metadata in the wrong section (e.g., putting backend fields in the card view block).
- Failing to include required fields (`id`, `slug`) in backend JSON.

### Parser Behavior
- **Any file not using the canonical v3.0 schema will be ignored by the parser.**
- The pipeline will generate a fallback 'Unknown' card for each invalid file, which will appear in the app and search index **until the cleaning script is run**.
- This includes legacy files with triple-dash dividers, bold/asterisk fields, or missing code blocks.

### Enforcement Policy
- **All contributors must validate every new or edited character file for schema compliance before running the data pipeline.**
- Use the checklist below before adding or editing any file:
  - [ ] Card View: `## UI - CARD VIEW` header, fenced code block, dash-prefixed fields.
  - [ ] Expanded View: `## UI - EXPANDED VIEW` header, fenced code block.
  - [ ] Backend JSON: fenced code block, includes `id` and `slug`.
  - [ ] No legacy formatting (---, bold, asterisk fields).
- If any file fails validation, fix it before running the full pipeline.

---