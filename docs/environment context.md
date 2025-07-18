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
- **Filtering System (2025):** Multi-layered filtering with nation, category, and subcategory filters
- **Filtering Features (2025):** Partial string matching for nations, comprehensive sub-filter mapping, multi-field coverage

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
- **Note:** The deprecated `@tailwindcss/line-clamp` plugin has been removed. Text truncation now uses built-in Tailwind utilities (`overflow-hidden text-ellipsis`).
- **CRT Effects (2025):** Custom utility classes for authentic terminal aesthetics:
  - `crt-glow-text`: Text glow effects with CRT-style shadows
  - `crt-glow-border`: Border glow effects for terminal-style containers
  - `crt-dither` and `crt-text-dither`: Scan-line dithering patterns with animations
  - Custom scrollbar styling with CRT green theme and glow effects
  - **Search Bar Enhancements:** Terminal-style search input with 28px font size, custom block cursor with 4px spacing, disabled spell-check, and authentic CRT styling
  - **Text Selection:** Custom selection colors using CRT green background with black text for consistent terminal aesthetic
- **CSS Variables:** CRT theming controlled via `--crt-green` and `--crt-green-glow` variables
- **Matrix Rain & Glassmorphism (2025 Update):**
  - **Matrix Digital Rain:** Canvas-based background effect with authentic movie-style characteristics
  - **Glassmorphism Cards:** Semi-transparent backgrounds with `backdrop-blur-sm` effects
  - **Matrix Glow Effects:** CRT green hover glow with multi-layer box-shadows
  - **Performance Optimized:** Hardware-accelerated rendering with proper memory management
  - **Cross-Browser Support:** Includes `-webkit-backdrop-filter` for Safari compatibility
  - **Accessibility Compliant:** Respects `prefers-reduced-motion` for motion sensitivity

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
    - `2-enrich-data.mjs`: Cleans and structures the parsed data into the final `public/enriched-data.json`.
    - `validate-data.mjs`: Validates data files against defined schemas.
- **Available npm scripts:**
    - `build:data`: Runs the full data pipeline (parse → enrich)
    - `build:data:parse`: Runs only the parsing stage
    - `build:data:enrich`: Runs only the enrichment stage  
    - `validate:data`: Validates data integrity
    - `build:tailwind`: Builds Tailwind CSS styles
    - `lint`, `lint:fix`: ESLint code quality checks
    - `type-check`: TypeScript compilation check
    - `test`: Runs Jest test suite
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

- **Data Pipeline:** A two-stage process that produces a single `public/enriched-data.json` file. See `docs/data pipeline.md` for full details.
- **Data Source:** The frontend fetches `public/enriched-data.json` at runtime.
- **Search Logic:**
    - **`src/hooks/useSearch.ts`:** The core search hook. It takes the enriched data, preprocesses it in the browser to create a `searchBlob`, and builds an in-memory `FlexSearch` index for instant searching.
    - **No Pre-Built Index:** The app does not load a pre-built search index file. This strategy is more robust and avoids build-time errors.
- **Data Types:** Defined in `src/types/`.

---

## 7. Notable Extraneous/Linked Packages

- **dirty-json, lex, string.fromcodepoint, tsconfig-paths, unescape-js, utf8**  
  (Listed as extraneous; not in package.json, may be legacy or for dev utility.)

---

## 8. Project Structure

- **src/**: Main app code (components, hooks, search, types, etc.)
- **public/**: Static assets, the primary `enriched-data.json` file, and images.
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
2.  `npm run build:data` (to generate `public/enriched-data.json`)
3.  `npm run build:tailwind` (after any style change)
4.  `npm run dev` (to start Vite dev server)

---

**For more details, see:**
- `docs/data pipeline.md`
- `docs/frontend architecture.md`
- `docs/troubleshooting.md`
- `projectrules.mdc`

