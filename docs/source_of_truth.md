# 📘 Source of Truth: Data Pipeline Workflow

This is the canonical, always-up-to-date reference for how curated data flows from Markdown or JSON into the live UI. This system is built to be type-safe, scalable, and fully automatable across any entity type.

---

##  Workflow Steps

### 1. ✍️ Data Authoring: User Curates or Edits Data

*   **Format:**
    *   Use Markdown (`.md`) files for human-friendly editing.
    *   JSON (`.json`) files are also supported for structured input.

*   **Location:**
    *   Place files in `raw-data/[entity-type]/` (e.g., `raw-data/characters/mai.md`)

*   **Schema:**
    *   Every entity type has a schema in `raw-data/schema/*.schema.json`.
    *   All required fields must be present; optional fields are supported and passed through.

### 2. ⚙️ Parsing: Markdown → Raw JSON

*   **Script:** `npm run parse:characters` (or other domain equivalents)
*   **What it does:**
    *   Converts `.md` files into structured `.json` arrays (e.g., `raw-data/characters/characters.json`).
    *   Handles multi-line fields, lists, and complex formats.

### 3. 🛡️ Validation: Schema Check

*   **Script:** `npm run validate:data`
*   **What it does:**
    *   Validates all raw `.json` files against their respective schemas.
    *   Blocks the pipeline on missing required fields, type mismatches, or schema violations.

### 4. ✨ Enrichment: Normalize and Finalize

*   **Script:** `npm run enrich:data`
*   **What it does:**
    *   Adds a unique `id`, canonical `slug`, and `__type` field.
    *   Applies defaults for optional fields.
    *   Outputs final normalized data to `dist/enriched-data.json`.

### 5. 🔍 Indexing: Build UI-Ready Search Index

*   **Script:** `npm run build:index`
*   **What it does:**
    *   Reads from `dist/enriched-data.json` (never raw or public).
    *   Builds a FlexSearch index and a records map keyed by `slug`.
    *   Outputs the result to `public/search-index.json`.

### 6. 🖥️ UI Consumption: Live App Reads Indexed Data

*   **Client:** React app (see `src/search/ClientSearchEngine.ts`)
*   **How it works:**
    *   At runtime, the app loads `public/search-index.json`.
    *   Filtering, search, and display logic use the `__type` field to determine entity behavior.

---

## ✅ How to Maintain the Data Pipeline System

This section supersedes all others. Follow this precisely for updates or additions.

1.  **Edit or Add Data**
    *   **Format:** Use `.md` for easy editing, or `.json` if preferred.
    *   **Location:** Add to `raw-data/[entity]/` (e.g., `raw-data/characters/`).
    *   **Schema:** Follow `raw-data/schema/[type].schema.json` for the correct structure.

2.  **Parse Markdown to JSON**
    *   **Script:** `npm run parse:characters`

3.  **Validate Data**
    *   **Script:** `npm run validate:data`

4.  **Enrich Data**
    *   **Script:** `npm run enrich:data`

5.  **Build the Search Index**
    *   **Script:** `npm run build:index`

6.  **Run the Full Pipeline (Recommended)**
    *   **Script:** `npm run build:data`

7.  **Refresh the UI**
    *   Hard refresh your browser (`Ctrl + F5` or `Cmd + Shift + R`) to see live changes.

---

## 👍 Best Practices

*   Always run the full pipeline (`npm run build:data`) after editing or adding data.
*   Check the terminal for validation or enrichment errors.
*   **Never** edit `dist/enriched-data.json` or `public/search-index.json` directly.
*   To add a new entity type: Add a schema, a parser script, and enrichment logic.

---

## 🛠️ Troubleshooting

If a record is missing from the UI, check the following:

*   Confirm no schema or parse errors occurred in the terminal.
*   Check that the `__type` field exists in both `dist/enriched-data.json` and `public/search-index.json`.
*   Verify your client-side logic is filtering correctly using the `__type`.
*   **Always re-run the full pipeline after making any changes.**

---

> **Summary:** Edit markdown. Run the pipeline. Refresh the UI.

As long as you follow this system, your data will remain clean, robust, searchable, and production-grade.

*Last updated: 2024-06-09*


📜 CSS Source of Truth: Project Documentation
🤔 What is the “CSS Source of Truth”?
The CSS Source of Truth is the single, canonical location in your codebase where all global and theme-level styles originate.
All other style usage—from component styles to utility classes—should reference or import from this central hub. This approach ensures:
Consistency: Every part of the app uses the same design language.
Maintainability: Changes are made in one place and propagate everywhere.
Scalability: The system grows predictably without creating conflicts.
📁 Directory Structure
All foundational styles live within the src/styles/ directory.
Generated code
src/
└── styles/
    ├── global.css         # Global resets, typography, base styles
    ├── tailwind.css       # (Optional) Tailwind CSS entry point
    ├── tokens.css.ts      # Design tokens (colors, spacing, fonts)
    └── themes/
        ├── theme.contract.css.ts # Defines the shape/interface of a theme
        └── darkTheme.css.ts      # An implementation of the theme contract
Use code with caution.
🛠️ How to Use
Follow this hierarchy to keep the styling system clean and predictable.
1. Global Styles
Place all global resets, base typography, and default element styles in src/styles/global.css.
Import this file once in your application's entry point (src/main.tsx):
Generated tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './styles/global.css'; // Import global styles here

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
Use code with caution.
Tsx
2. Design Tokens & Theme Variables
Use Vanilla Extract to define all reusable design values as tokens in src/styles/tokens.css.ts.
Generated typescript
// src/styles/tokens.css.ts
import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  colors: {
    primary: '#007BFF',
    text: '#333333',
    background: '#FFFFFF',
    danger: '#DC3545',
  },
  spacing: {
    small: '4px',
    medium: '8px',
    large: '16px',
  },
});
Use code with caution.
TypeScript
3. Themes
Define a theme "contract" for type-safety, then create theme implementations.
Generated typescript
// src/styles/themes/theme.contract.css.ts
import { createThemeContract } from '@vanilla-extract/css';

export const themeContract = createThemeContract({
  backgroundColor: null,
  textColor: null,
  accentColor: null,
});
Use code with caution.
TypeScript
Implement the theme in its own file (e.g., darkTheme.css.ts) and apply it at the root of your app.
Generated tsx
// App.tsx
import { darkTheme } from './styles/themes/darkTheme.css';

function App() {
  return (
    <div className={darkTheme}>
      {/* The rest of your app */}
    </div>
  );
}
Use code with caution.
Tsx
4. Component Styles
Co-locate component styles using .css.ts files. Always import variables from the source of truth (tokens.css.ts or a theme file).
Generated typescript
// src/components/Button/Button.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/tokens.css.ts'; // Import from the source!

export const button = style({
  padding: `${vars.spacing.medium} ${vars.spacing.large}`,
  backgroundColor: vars.colors.primary,
  color: 'white',
  border: 'none',
  borderRadius: vars.spacing.small,
});
Use code with caution.
TypeScript
5. Tailwind (Optional)
If using Tailwind, place your entry CSS file in src/styles/tailwind.css and import it in your main entry point.
✅ Best Practices
🚫 Never duplicate values. Always import from tokens.css.ts or theme files.
📂 Keep global styles contained. All foundational styles must live in src/styles/.
🔗 Reference, don't re-declare. Component styles should only reference tokens and themes, never contain hardcoded values like #FFFFFF.
🎯 Update the source first. When a design value changes (e.g., a color), update tokens.css.ts first.
✍️ Document your tokens. Use comments or JSDoc to explain the purpose of each token.
🗑️ Clean up. Remove temporary or test style files (like test.css) when they are no longer needed.
✨ Example: Adding a New Color
Add the token to the source of truth:
Generated typescript
// src/styles/tokens.css.ts
export const vars = createGlobalTheme(':root', {
  colors: {
    primary: '#007BFF',
    text: '#333333',
    background: '#FFFFFF',
    danger: '#DC3545',
    success: '#28A745', // ✨ New color added here
  },
  // ...
});
Use code with caution.
TypeScript
Use the new token in a component:
Generated typescript
// src/components/Alert/Alert.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/tokens.css.ts'; // Import from the source

export const successAlert = style({
  backgroundColor: vars.colors.success, // ✅ Use the new token
  color: 'white',
  padding: vars.spacing.large,
});
Use code with caution.
TypeScript
💡 Why This Matters
Consistency: All styles reference the same, single set of values.
Easy Theming: Change a theme variable in one place to update the entire application.
Scalability: Add new tokens or themes without needing to refactor every component.
Debuggability: You always know exactly where a style value is coming from.
🔧 Troubleshooting
Styles not applying? → Double-check your import paths and ensure the file is being imported in main.tsx or your component.
Theme not switching? → Ensure the correct theme class name is being applied to your app's root element.
Token not updating? → Make sure you are importing the token from the source file and not using a duplicated, hardcoded value somewhere.
This “CSS Source of Truth” system is the foundation for robust, scalable, and maintainable styling in your project. Keep all design values and global styles in src/styles/, and reference them everywhere else.


Tailwind CSS Setup Guide (Vite + React, Tailwind v4+)
1. Install Required Packages
Apply to source_of_tr...
tailwindcss: The core Tailwind library.
@tailwindcss/postcss: The new PostCSS plugin for Tailwind v4+.
autoprefixer: For vendor prefixing.
2. Configure PostCSS
Create or update postcss.config.cjs:
Apply to source_of_tr...
Do NOT use tailwindcss directly as a PostCSS plugin in v4+.
Use @tailwindcss/postcss instead.
3. Create Tailwind CSS Entry File
Create src/styles/tailwind.css:
Apply to source_of_tr...
4. Import Tailwind in Your App
At the top of your main entry file (e.g., src/main.tsx):
Apply to source_of_tr...
5. Configure Vite (Optional for Plugins)
If using the Vite plugin for Tailwind (not strictly required for Tailwind to work):
Apply to source_of_tr...
And in vite.config.ts:
Apply to source_of_tr...
6. Test Tailwind
Add a component or element with Tailwind classes (e.g., a button with gradients, hover, focus, etc.) to confirm everything works.
7. Troubleshooting
If you see an error about using tailwindcss directly as a PostCSS plugin, you’re likely on v4+ and need to use @tailwindcss/postcss in your PostCSS config.
Ensure your CSS entry file is imported in your main app file.
Restart your dev server after making config changes.
8. (Optional) Customization
Run npx tailwindcss init to generate a tailwind.config.js for custom configuration.
Add custom themes, plugins, or extend the default config as needed.
Summary:
The key for Tailwind v4+ is to use @tailwindcss/postcss in your PostCSS config and ensure your Tailwind CSS file is imported at the app entry point. This will enable all Tailwind features in your project.