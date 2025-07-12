### FILE: `docs/source_of_truth.md` (Updated)

```markdown
# 📚 Source of Truth: Project Documentation

This is the canonical, always-up-to-date reference for how data and styles are managed in the Austros ATLA World Encyclopedia. This system is built to be type-safe, scalable, and fully automated.

***
***

## ⚙️ The Data Pipeline Workflow

This is the standard operating procedure for any data changes. Follow these steps precisely to ensure data integrity.

### **1. ✍️ Data Authoring (The Human Part)**
*   **Format:** All rich, descriptive content (like characters) is authored in Markdown (`.md`). Simpler, flat data (like foods) can be authored directly in JSON (`.json`).
*   **Location:**
    *   Markdown: `raw-data/[entity-type]/[entity-data].md` (e.g., `raw-data/characters/character_data.md`)
    *   JSON: `raw-data/[entity-type].json` (e.g., `raw-data/foods.json`)
*   **Schema:** Every entity type **must** have a corresponding schema in `raw-data/schema/`. This is the contract your data must follow.

### **2. 🔄 Parsing & Validation (The Scripts)**
This is the automated process for turning raw data into a structured, searchable format.

1.  **Parse Markdown to JSON (`npm run parse:characters`)**
    *   **What it does:** Reads complex `.md` files and converts them into structured `.json` files within the `raw-data` directory. This script is essential for handling multi-line fields like `highlights` and `traits`.

2.  **Validate Data (`npm run validate:data`)**
    *   **What it does:** Validates all raw `.json` files (both handwritten and parsed) against their schemas using Zod. The pipeline will **fail** if there are any errors, preventing bad data from proceeding.

3.  **Enrich Data (`npm run enrich:data`)**
    *   **What it does:** Adds machine-generated fields: a unique `id`, a URL-friendly `slug`, and a `__type` identifier to every record.
    *   **Output:** A single, consolidated `dist/enriched-data.json` file.

4.  **Build Search Index (`npm run build:index`)**
    *   **What it does:** Reads the enriched data to build a fast, client-ready FlexSearch index.
    *   **Output:** `public/search-index.json`. This is the file the live application actually loads.

### **3. 🚀 The Full Pipeline (Recommended)**
To simplify the process, run the master script that executes all steps in the correct order:
```bash
npm run build:data
```

### **4. ✅ How to Maintain the Data**
1.  **Edit or Add Data:** Modify or create files in the `raw-data/` directory.
2.  **Run the Pipeline:** Open your terminal and run `npm run build:data`.
3.  **Check for Errors:** Watch the terminal output for any validation or enrichment errors.
4.  **Refresh UI:** Hard refresh your browser (`Ctrl+F5` or `Cmd+Shift+R`) to see the changes live.

> **Summary:** Edit raw data. Run the pipeline. Refresh the UI. As long as you follow this system, your data will remain clean, robust, and production-grade.

---
---

## 🎨 CSS Source of Truth: Tailwind CSS

The project uses **Tailwind CSS** for all styling. This utility-first framework is our single source of truth for the design system.

### **1. 🏛️ Core Configuration Files**
All styling originates from these key files. **Do not use hardcoded style values in components.**

*   `tailwind.config.js`: **The Primary Source of Truth.** This file (if it exists, or one should be created with `npx tailwindcss init`) defines the entire design system:
    *   **Colors:** Including the `nation-` color palette (`nation-water`, `nation-fire`, etc.).
    *   **Spacing, Fonts, Borders:** All theme values are configured here.
*   `postcss.config.cjs`: The build configuration that enables Tailwind. It uses `@tailwindcss/postcss` for v4+ compatibility.
*   `src/styles/tailwind.css`: The main CSS entry point where Tailwind's directives are imported.

### **2. 🛠️ How to Style Components**

1.  **Use Utility Classes Directly in JSX:**
    *   The primary method of styling is to apply utility classes directly in the `className` prop of your React components.
    *   **Example:** `<div className="bg-slate-800 p-4 rounded-lg">...</div>`

2.  **Create Reusable Components:**
    *   Instead of creating custom CSS classes with `@apply`, encapsulate repeated styles within a React component. This is the standard "utility-first" approach.
    *   **Example:** The `MyButton.tsx` component has the classes `bg-blue-500 hover:bg-blue-700` baked into it. To use a button, you import and use `<MyButton>`.

3.  **Dynamic Classes:**
    *   Use template literals to apply classes conditionally based on props or state.
    *   **Example from `ItemCard.tsx`:**
        ```jsx
        const stateClasses = expanded ? 'scale-105' : 'hover:scale-105';
        <div className={`... ${stateClasses}`}>
        ```

### **3. ✅ Best Practices**
*   **Single Source of Truth:** All colors, spacing, and fonts **must** be defined in `tailwind.config.js`. Never hardcode values like `style={{ color: '#FF0000' }}`.
*   **Embrace Utilities:** Build complex layouts by composing simple utility classes. Avoid writing custom CSS files unless absolutely necessary for a unique, non-reusable feature.
*   **Keep It Clean:** Use a tool like the official [Prettier Plugin for Tailwind CSS](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) to automatically sort your classes for readability.
*   **Update the Config, Not the Code:** If the primary "water tribe blue" needs to change, update it once in `tailwind.config.js`. The change will propagate everywhere.

### **4. troubleshooting**
*   **Styles not applying?**
    1.  Check that your component file is included in the `content` array in `tailwind.config.js`.
    2.  Ensure `src/styles/tailwind.css` is imported at the top of `src/main.tsx`.
*   **Config changes not working?**
    *   You **must** restart the Vite development server (`npm run dev`) after making any changes to `tailwind.config.js` or `postcss.config.cjs`.
```