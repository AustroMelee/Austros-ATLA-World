# 📘 Source of Truth: Data Pipeline Workflow

This is the canonical, always-up-to-date reference for how curated data flows from Markdown or JSON into the live UI. This system is built to be type-safe, scalable, and fully automatable across any entity type.

---

## ⚙️ The Data Pipeline: Step-by-Step

### **1. ✍️ Data Authoring**
*   **Format:**
    *   Use Markdown (`.md`) files for human-friendly editing.
    *   JSON (`.json`) files are also supported for structured input.
*   **Location:**
    *   Place files in `raw-data/[entity-type]/` (e.g., `raw-data/characters/mai.md`).
*   **Schema:**
    *   Every entity has a schema in `raw-data/schema/*.schema.json`.
    *   **All required fields must be present.**

### **2. ⚙️ Parsing: Markdown → Raw JSON**
*   **Script:** `npm run parse:characters` (or other domain equivalents)
*   **What it does:** Converts `.md` files into structured `.json` arrays and handles complex formats.

### **3. 🛡️ Validation: Schema Check**
*   **Script:** `npm run validate:data`
*   **What it does:** Validates all raw `.json` files against their schemas, blocking the pipeline on any errors.

### **4. ✨ Enrichment: Normalize & Finalize**
*   **Script:** `npm run enrich:data`
*   **What it does:** Adds a unique `id`, `slug`, and `__type` field, and applies defaults for optional fields.
*   **Output:** `dist/enriched-data.json`

### **5. 🔍 Indexing: Build Search Index**
*   **Script:** `npm run build:index`
*   **What it does:** Reads enriched data to build a fast, UI-ready FlexSearch index.
*   **Output:** `public/search-index.json`

### **6. 🖥️ UI Consumption: Live App**
*   **Client:** React app (see `src/search/ClientSearchEngine.ts`)
*   **How it works:** At runtime, the app loads `public/search-index.json` to power all search and filtering logic.

---

## ✅ How to Maintain the Data Pipeline

This is the standard operating procedure for any data changes. Follow these steps precisely.

1.  **✍️ Edit or Add Data**
    *   **Format:** Use `.md` for easy editing.
    *   **Location:** Add to `raw-data/[entity]/`.
    *   **Schema:** Adhere to the structure in `raw-data/schema/[type].schema.json`.

2.  **⚙️ Parse Markdown to JSON**
    *   **Script:** `npm run parse:[entity]`

3.  **🛡️ Validate Data**
    *   **Script:** `npm run validate:data`

4.  **✨ Enrich Data**
    *   **Script:** `npm run enrich:data`

5.  **🔍 Build the Search Index**
    *   **Script:** `npm run build:index`

6.  **🚀 Run the Full Pipeline (Recommended)**
    *   **Script:** `npm run build:data`

7.  **🔄 Refresh the UI**
    *   Hard refresh your browser (`Ctrl + F5` or `Cmd + Shift + R`) to see live changes.

---

## 👍 Best Practices

*   Always run the full pipeline (`npm run build:data`) after editing data.
*   Check the terminal for any validation or enrichment errors.
*   **Never** edit generated files like `dist/enriched-data.json` or `public/search-index.json` directly.
*   To add a new entity type, you must add a schema, a parser script, and enrichment logic.

## 🛠️ Troubleshooting

If a record is missing from the UI, check the following:

*   Confirm no schema or parse errors occurred in the terminal.
*   Check that the `__type` field exists in both `dist/enriched-data.json` and `public/search-index.json`.
*   Verify your client-side logic is filtering correctly using the `__type`.
*   **Always re-run the full pipeline after making any changes.**

> **Summary:** Edit markdown. Run the pipeline. Refresh the UI.

*As long as you follow this system, your data will remain clean, robust, searchable, and production-grade.*

***
***

# 📜 CSS Source of Truth: Project Documentation

### 🤔 What is the “CSS Source of Truth”?

> The **CSS Source of Truth** is the single, canonical location in your codebase where all global and theme-level styles originate.

All other style usage—from component styles to utility classes—should reference or import from this central hub. This approach ensures:

*   **Consistency:** Every part of the app uses the same design language.
*   **Maintainability:** Changes are made in one place and propagate everywhere.
*   **Scalability:** The system grows predictably without creating conflicts.

### 📁 Directory Structure

All foundational styles live within the `src/styles/` directory.

```text
src/
└── styles/
    ├── global.css         # Global resets, typography, base styles
    ├── tailwind.css       # (Optional) Tailwind CSS entry point
    ├── tokens.css.ts      # Design tokens (colors, spacing, fonts)
    └── themes/
        ├── theme.contract.css.ts # Defines the shape/interface of a theme
        └── darkTheme.css.ts      # An implementation of the theme contract
```

### 🛠️ How to Use

#### 1. 🌍 Global Styles
Place all global resets and base element styles in `src/styles/global.css`. Import it **once** in your application's entry point (`src/main.tsx`):

```tsx
// src/main.tsx
import './styles/global.css'; // Import global styles here
// ... rest of the file
```

#### 2. 💎 Design Tokens & Theme Variables
Use Vanilla Extract to define all reusable design values as tokens in `src/styles/tokens.css.ts`.

```typescript
// src/styles/tokens.css.ts
import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  colors: {
    primary: '#007BFF',
    text: '#333333',
  },
  spacing: {
    small: '4px',
    medium: '8px',
  },
});
```

#### 3. 🧩 Component Styles
Co-locate component styles using `.css.ts` files. **Always** import variables from the source of truth (`tokens.css.ts`).

```typescript
// src/components/Button/Button.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/tokens.css.ts'; // Import from the source!

export const button = style({
  padding: `${vars.spacing.medium} ${vars.spacing.large}`,
  backgroundColor: vars.colors.primary,
  border: 'none',
});
```

### ✅ Best Practices

*   🚫 **Never duplicate values.** Always import from `tokens.css.ts` or theme files.
*   📂 **Keep global styles contained.** All foundational styles must live in `src/styles/`.
*   🔗 **Reference, don't re-declare.** Component styles should only reference tokens, never hardcoded values like `#FFFFFF`.
*   🎯 **Update the source first.** When a design value changes, update `tokens.css.ts`.
*   ✍️ **Document your tokens.** Use comments or JSDoc to explain the purpose of each token.

### ✨ Example: Adding a New Color

1.  **Add the token to the source of truth:**
    ```typescript
    // src/styles/tokens.css.ts
    export const vars = createGlobalTheme(':root', {
      colors: {
        // ... existing colors
        success: '#28A745', // ✨ New color added here
      },
    });
    ```
2.  **Use the new token in a component:**
    ```typescript
    // src/components/Alert/Alert.css.ts
    import { vars } from '../../styles/tokens.css.ts';

    export const successAlert = style({
      backgroundColor: vars.colors.success, // ✅ Use the new token
    });
    ```

### 🔧 Troubleshooting
*   **Styles not applying?** → Double-check your import paths.
*   **Theme not switching?** → Ensure the correct theme class name is on your app's root element.
*   **Token not updating?** → Make sure you are importing the token, not using a duplicated value.

***
***

## 🍃 Tailwind CSS v4+ Setup Guide (Vite + React)

### 1. 📦 Install Required Packages

```bash
npm install -D tailwindcss @tailwindcss/postcss autoprefixer
```
*   `tailwindcss`: The core Tailwind library.
*   `@tailwindcss/postcss`: The **new** PostCSS plugin for Tailwind v4+.
*   `autoprefixer`: For vendor prefixing.

### 2. ⚙️ Configure PostCSS

Create or update `postcss.config.cjs`:

```javascript
// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```
> ⚠️ **Important:** For Tailwind v4+, you must use `@tailwindcss/postcss`. Do **not** use `tailwindcss` directly as a PostCSS plugin.

### 3. 📝 Create Tailwind CSS Entry File
Create `src/styles/tailwind.css`:

```css
@import "tailwindcss";
```

### 4. 📥 Import Tailwind in Your App
Add this to the top of your main entry file (e.g., `src/main.tsx`):

```tsx
import './styles/tailwind.css';
```

### 5. ⚡ Configure Vite (Optional)
This is not strictly required but can improve HMR.

```bash
npm install -D @tailwindcss/vite
```
Then, update `vite.config.ts`:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tailwindcss(), react()],
})
```

### 6. ✅ Test Tailwind
Add an element with Tailwind classes (e.g., `bg-blue-500 text-white p-4`) to confirm it works.

### 🛠️ Troubleshooting
*   **Error about `tailwindcss` as a plugin?** → You are using the old v3 config. Switch to `@tailwindcss/postcss` in `postcss.config.cjs`.
*   **Styles not appearing?** → Ensure `tailwind.css` is imported in your main app file.
*   **Config changes not working?** → Restart your dev server.

### 🎨 (Optional) Customization
Run `npx tailwindcss init` to generate a `tailwind.config.js` for custom themes and plugins.