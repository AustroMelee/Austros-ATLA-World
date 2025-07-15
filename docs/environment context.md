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
- **Purpose:** Data pipeline (parsing, enriching, indexing), validation, and utility scripts.
- **Key scripts:** `1-parse-markdown.mjs`, `2-enrich-data.mjs`, `3-build-index.mjs`, `validate-data.mjs`, etc.

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

- **Data Pipeline:** See `docs/data pipeline.md`
- **Search Index:** `public/search-index.json` (FlexSearch, auto-generated)
- **Data Types:** Defined in `src/types/`
- **Search Engine:** `src/search/ClientSearchEngine.ts` (see "Search Engine" doc for details)

---

## 7. Notable Extraneous/Linked Packages

- **dirty-json, lex, string.fromcodepoint, tsconfig-paths, unescape-js, utf8**  
  (Listed as extraneous; not in package.json, may be legacy or for dev utility.)

---

## 8. Project Structure

- **src/**: Main app code (components, hooks, search, types, etc.)
- **public/**: Static assets, search index, images
- **raw-data/**: Source markdown data
- **scripts/**: Data pipeline and utility scripts
- **eslint-plugin-local/**: Custom ESLint rules
- **docs/**: Project documentation

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

1. `npm install`
2. `npm run build:data` (to generate search index)
3. `npm run build:tailwind` (after any style change)
4. `npm run dev` (to start Vite dev server)

---

**For more details, see:**  
- `docs/source_of_truth.md`  
- `docs/data pipeline.md`  
- `projectrules.mdc`  
- `README.md` (if present)

