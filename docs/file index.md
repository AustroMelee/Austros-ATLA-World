# 📁 File Index (2024 Refactor)

---

## 🚨 Non-Negotiable Tag Rule

**All tags in markdown files must be single, underscore-joined words.**
- No spaces, slashes, or multi-word phrases are allowed in any tag.
- Spaces and slashes are replaced with underscores (e.g., `water nation` → `water_nation`).
- All tags are lowercased (e.g., `Firebender` → `firebender`).
- This rule applies to all present and future markdown files.
- The enrichment/data pipeline will enforce this and strip or reject any non-compliant tags.
- **Example:**
  - Valid: `water_nation`, `firebender`, `main_villain`
  - Invalid: `water nation`, `main villain`, `main/villain`, `Main Villain`

---

## Root Configuration & Metadata
| File | Description |
|------|-------------|
| README.md | Project overview and setup instructions. |
| package.json | Node project manifest. Defines scripts like `build:data` for the data pipeline. |
| package-lock.json | Exact dependency versions for reproducible installs. |
| vite.config.ts | Vite build config (React plugin, PWA, module aliases). |
| tailwind.config.js | Tailwind CSS theme and typography customization. |
| postcss.config.cjs | PostCSS plugins (autoprefixer) for Tailwind. |
| tsconfig.json | Main TypeScript compiler settings for the project. |
| tsconfig.node.json | TypeScript config for Node.js scripts in `scripts/`. |
| .eslintrc.json | ESLint rules for code quality. |
| index.html | Main HTML entry point for the Vite application. |

---

## Documentation (`docs/`)
| File | Description |
|------|-------------|
| docs/data pipeline.md | **Source of Truth.** Details the two-stage pipeline for processing markdown into `enriched-data.json`. |
| docs/frontend architecture.md | **Source of Truth.** Describes the React component structure and data flow. |
| docs/search engine.md | **Source of Truth.** Explains the client-side indexing and search architecture. |
| docs/troubleshooting.md | **Source of Truth.** Practical guide for debugging data and UI issues. |
| docs/ui-components.md | Documents the `ItemCard` and modal system. |
| docs/decisions.md | Log of architectural decisions and their rationale. |
| docs/adding-new-domain-tutorial.md | Tutorial on how to add new data types to the project. |

---

## Data Pipeline Scripts (`scripts/`)
| File | Description |
|------|-------------|
| scripts/1-parse-markdown.mjs | **Stage 1:** Parses raw Markdown files, extracting YAML frontmatter and all JSON/MD blocks into a structured format. |
| scripts/2-enrich-data.mjs | **Stage 2:** Cleans the parsed data, promotes UI-critical fields to the top level, and outputs the final `public/enriched-data.json`. |
| scripts/slug-utils.mjs | Utility functions for generating unique slugs. |
| scripts/validate-data.mjs | Validates data files against a defined schema. |
| scripts/3-build-index.mjs | **(DEPRECATED)** No longer used. All search indexing is now done client-side. |

---

## Application Source (`src/`)
| File/Dir | Description |
|----------|-------------|
| src/main.tsx | Main React entry point. |
| src/App.tsx | React Router setup. |
| src/types/ | Core TypeScript types (`domainTypes.ts`, `rawTypes.ts`). |
| src/theme/ | Theming files, like `nationThemes.ts` for card colors. |
| src/utils/ | Shared helper functions (`stringUtils.ts`). |
| src/hooks/ | All custom React hooks. |
| src/components/ | All reusable UI components (cards, grid, nav, modal, etc.). |
| src/pages/ | Page-level components that compose the UI. |
| src/search/ | Client-side search utilities. |
| src/styles/ | CSS files. |

---

### Key Frontend Files & Their Roles

#### **Data Flow & State**
| File | Description |
|------|-------------|
| **`pages/HomeContainer.tsx`** | The stateful "brain" of the app. Fetches `enriched-data.json`, manages `query` and `expandedCardId` state, and calls the `useSearch` hook. |
| **`hooks/useSearch.ts`** | **The core of the search system.** Receives all data, preprocesses it, builds the FlexSearch index in-browser, and returns filtered results. |
| **`search/preprocessor.ts`** | Helper for `useSearch`. Creates the `searchBlob` from each record to enable comprehensive full-text search. |
| **`pages/Home.tsx`** | The presentational "body" of the app. Receives props from `HomeContainer` and renders the UI. |

#### **UI Components**
| File | Description |
|------|-------------|
| **`components/EntityGrid/EntityGrid.tsx`** | Renders the responsive grid of cards. Passes expand/collapse state to each card. |
| **`components/ItemCard/ItemCard.tsx`** | Renders both the small grid card and the full-screen expanded modal view. Contains all logic for a single entity's display. |
| **`components/CustomMarkdownRenderer.tsx`** | Renders markdown content for the expanded card view, with custom styling. |
| **`components/ThemedCard/ThemedCard.tsx`** | A styled wrapper that applies a nation-specific border color to cards. |

---

## Data & Public Assets
| File/Dir | Description |
|------|-------------|
| **`public/enriched-data.json`** | **The single source of truth for the frontend.** A JSON array of all character records, generated by the data pipeline. |
| `public/assets/images/` | All static images used for character cards. |
| `raw-data/` | The raw markdown source files for all encyclopedia entries. |
| `data/` | Intermediate data files used during the build process (`parsed-data.json`). |

---

This index provides a clear and accurate map of the project as it currently stands.