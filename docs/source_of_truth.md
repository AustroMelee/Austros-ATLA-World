This document will serve as the definitive guide for any future development, ensuring no one repeats the same mistakes.

Here is the new, updated `docs/source_of_truth.md`.

---

### FILE: `docs/source_of_truth.md` (Updated & Corrected)

```markdown
# 📖 Source of Truth: Project Documentation (v2)

This is the canonical, always-up-to-date reference for how data and styles are managed in the Austros ATLA World Encyclopedia. This system is built to be type-safe, scalable, and fully automated. **This document reflects the lessons learned from the "Missing Filters" bug and should be considered the single source of truth for all data handling.**

---
---

## ⚙️ The Data Pipeline Workflow

This is the standard operating procedure for any data changes. Follow these steps precisely to ensure data integrity. The pipeline is designed to be robust, but it depends on the correct initial data format.

### **1. ✍️ Data Authoring: The Non-Standard Markdown Format**

This is the most critical step and the source of previous major bugs. **Our character markdown files are a custom format, not standard Markdown.** They must be structured as follows:

*   **File Location:** `raw-data/characters/[character-slug].md`
*   **Structure:**
    1.  **Card View Block:** The file MUST begin with a "UI - CARD VIEW" block. This is parsed with regular expressions, not a standard frontmatter library.
    2.  **Expanded View Block (Optional):** This block is for human readability and is not parsed by the scripts.
    3.  **Backend Metadata Blocks:** The file MUST contain one or more `json` code blocks containing the detailed v3.0 character schema fields. These are parsed, merged, and flattened.

**Example `raw-data/characters/zuko.md` Structure:**
```markdown
# 🚩 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - ZUKO

---

## 🖼️ UI - CARD VIEW
<!-- THIS BLOCK IS REQUIRED AND PARSED BY REGEX -->
`md
- Name: Zuko
- Nation: Fire Nation
- Short Description: The exiled crown prince...
`

---

## 📖 UI - EXPANDED VIEW
<!-- This block is for documentation/human-reading purposes only. -->

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION)
<!-- ALL RICH DATA MUST BE IN JSON BLOCKS LIKE THESE -->

## 🪪 Identity & Demographics

`json
{
  "id": "zuko",
  "fullName": "Zuko",
  "titles": ["Prince", "Fire Lord"],
  ...
}
`

## 🔥 Abilities, Skills & Combat Profile

`json
{
  "isBender": true,
  "bendingElement": "fire",
  ...
}
`
```

### **2. 🤖 Parsing & Validation: The Automated Scripts**

This is the automated process for turning the raw data into a structured, searchable format.

1.  **Parse Custom Markdown (`npm run parse:characters`)**
    *   **What it does:** Runs the custom `scripts/parse-character-md.mjs` script. This script specifically reads our unique `.md` format, extracts the Card View data, finds all `json` blocks, and flattens them into a single, valid JSON object for each character.
    *   **Output:** Creates individual `.json` files in `raw-data/characters/json/`.

2.  **Validate Data (`npm run validate:data`)**
    *   **What it does:** Validates all raw `.json` files (including the ones just created) against their schemas in `raw-data/schema/` using Zod. **The pipeline will fail if there are any errors, preventing bad data from proceeding.**

3.  **Enrich Data (`npm run enrich:data`)**
    *   **What it does:** Adds machine-generated fields: a unique `id` (if not present), a URL-friendly `slug`, and a `__type` identifier to every record.
    *   **Output:** A single, consolidated `dist/enriched-data.json` file.

4.  **Build Search Index (`npm run build:index`)**
    *   **What it does:** Reads the enriched data to build a fast, client-ready FlexSearch index.
    *   **Output:** `public/search-index.json`. This is the file the live application actually loads.

### **3. 🚀 The Full Pipeline (Recommended)**

To prevent errors, always use the master script which executes all steps in the correct order:
```bash
npm run build:data
```

### **4. ✅ How to Maintain the Data**

1.  **Edit or Add Data:** Modify or create files in the `raw-data/` directory, **strictly following the custom markdown format.**
2.  **Run the Pipeline:** Open your terminal and run `npm run build:data`.
3.  **Check for Errors:** Watch the terminal output for any validation or enrichment errors.
4.  **Refresh UI:** Hard refresh your browser (`Ctrl+F5` or `Cmd+Shift+R`) to see the changes live.

---
---

## 🃏 Card Expand/Collapse Mechanism: Compact & Expanded Info

This section documents the core mechanism for displaying compact and expanded information on encyclopedia cards. This is fundamental to the user experience and data model.

### 1. System Overview

The expand/collapse functionality uses a "lifted state" pattern. A single piece of state, `selectedId`, is held in the parent `Home.tsx` component. This state determines which card (if any) is expanded. All child components receive props derived from this state and use callback functions to modify it.

### 2. Component Roles & Data Flow

| Component        | Role                                                      | Receives (Props)                | Sends Up (Callbacks)                |
|------------------|-----------------------------------------------------------|----------------------------------|-------------------------------------|
| Home.tsx         | State Owner<br/>Holds the `selectedId` state.             | -                                | -                                   |
| EntityGrid.tsx   | State Distributor<br/>Renders grid, passes state/callbacks | `selectedId`, `onSelect`         | Calls `onSelect` to change state    |
| ItemCard.tsx     | State Consumer & Presenter<br/>Renders compact/expanded    | `expanded` (boolean), `onExpand` | Calls `onExpand` to trigger expand  |

### 3. Expand/Collapse Logic (Step-by-Step)

1. **User Clicks a Card (ItemCard):**
    - The `ItemCard` has an `onClick={onExpand}` handler on its main div. This handler is always present.
    - `onExpand` is called.
2. **Callback Travels to EntityGrid:**
    - The `onExpand` prop on `ItemCard` is wired to the `onSelect` function inside `EntityGrid.tsx`:
      ```tsx
      // In EntityGrid.tsx
      onExpand={() => onSelect(selectedId === item.id ? null : item.id)}
      ```
    - If the clicked card is already selected (`selectedId === item.id`), it calls `onSelect(null)`.
    - If not, it calls `onSelect(item.id)`.
3. **State is Updated in Home.tsx:**
    - The `onSelect` prop on `EntityGrid` is actually the `setSelectedId` function from `Home.tsx`'s `useState`.
    - The call from `EntityGrid` directly updates the `selectedId` state in `Home.tsx`.
4. **React Re-renders:**
    - The state change in `Home.tsx` triggers a re-render of itself and its children (`EntityGrid`).
    - `EntityGrid` re-maps over the items. For each `ItemCard`, the `expanded` prop is re-evaluated:
      ```tsx
      // In EntityGrid.tsx
      expanded={selectedId === item.id}
      ```
    - The card whose id matches `selectedId` receives `expanded={true}`; all others get `expanded={false}`.
5. **ItemCard Displays Correct View:**
    - Inside `ItemCard.tsx`, conditional rendering logic shows/hides the detailed view based on the `expanded` prop:
      ```tsx
      // In ItemCard.tsx
      {!expanded && <p>...Compact View...</p>}
      {expanded && <div>...Expanded Detail View...</div>}
      ```

### 4. Why It Works (Key Principles)

- **Single Source of Truth:** Only one piece of state (`selectedId` in `Home.tsx`) controls which card is expanded. This prevents conflicts and makes the system predictable.
- **Unidirectional Data Flow:** Data flows down from `Home` to `EntityGrid` to `ItemCard` via props.
- **Inverse Data Flow (Callbacks):** Actions flow up from `ItemCard` to `EntityGrid` to `Home` via callback functions (`onExpand` → `onSelect` → `setSelectedId`).
- **Conditional Rendering:** `ItemCard` simply renders what its `expanded` prop tells it to. It has no internal state managing its own visibility.

### 5. Troubleshooting Checklist (If It Breaks)

- **Is `selectedId` being updated?**
  - Place a `console.log(selectedId)` in `Home.tsx` to see if it changes on click. If not, the callback chain is broken.
- **Is the `onExpand` callback being fired?**
  - Place a `console.log('onExpand called')` in the `onExpand` prop within `EntityGrid.tsx`.
- **Is the `expanded` prop correct?**
  - Place a `console.log(item.name, expanded)` inside `ItemCard.tsx` to see if the correct card is receiving `true`.
- **Is the correct id being passed?**
  - Ensure every item in the items array has a unique and valid `id` property. Mismatched or duplicate IDs are a common source of bugs.

---
---

## 🎨 CSS Source of Truth: Tailwind CSS

The project uses **Tailwind CSS** for all styling. This utility-first framework is our single source of truth for the design system.

1.  **Core Configuration:**
    *   `tailwind.config.js`: Defines the entire design system (colors, spacing, fonts). All design tokens **must** live here.
    *   `postcss.config.cjs`: The build configuration that enables Tailwind.
    *   `src/styles/tailwind.css`: The main CSS entry point.

2.  **How to Style:**
    *   **Primary Method:** Use utility classes directly in the `className` prop of React components.
    *   **Component Encapsulation:** For reusable elements, create a React component that encapsulates the necessary utility classes. **Avoid using `@apply`**.
    *   **Dynamic Classes:** Use template literals to apply classes conditionally based on props or state.

3.  **Golden Rule:** If you need to make a change to the design system (e.g., update the "Water Tribe blue"), **you must update it in `tailwind.config.js` and then restart the Vite development server.**

---
---

## 🩺 Troubleshooting & Rationale (Lessons Learned)

This section documents common issues and their root causes, based on our debugging of the filter sidebar.

#### **Problem:** The filter sidebar is empty or only shows "Nation". Character data appears as "Unknown".
*   **Cause:** This is a catastrophic failure in the data pipeline. The `scripts/parse-character-md.mjs` script has failed to correctly read the custom `.md` file format. The original `gray-matter` library could not parse the "Card View" block, and previous `flattenObject` functions did not correctly unwrap the nested JSON categories.
*   **Solution:** Ensure the `parse-character-md.mjs` script is the latest version, which contains custom regex parsers and a correct data-flattening function. After updating the script, delete the `raw-data/characters/json/` directory and run `npm run build:data` to completely regenerate all data from a clean state.

#### **Problem:** My changes to `tailwind.config.js` are not showing up.
*   **Cause:** The Vite development server caches the Tailwind configuration on startup.
*   **Solution:** You **must** stop and restart the Vite development server (`npm run dev`) after any changes to `tailwind.config.js` or `postcss.config.cjs`.

#### **Problem:** A new character I added doesn't appear in the app at all.
*   **Cause:** The data for that character likely failed the validation step. The pipeline is designed to be strict: invalid data is dropped and never makes it to the enrichment or indexing stages.
*   **Solution:** Run `npm run validate:data` and carefully check the terminal output for Zod schema errors related to your new character file. Fix the errors in the source `.md` file and re-run the full pipeline.
```