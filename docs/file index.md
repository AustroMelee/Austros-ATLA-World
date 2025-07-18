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

The dictionary of allowed tags lives in `src/data/tag_dictionary.json`. Aliases
defined there are treated the same as the canonical tag during search.

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
| scripts/validate-data.mjs | Validates data files against a defined schema. |
| scripts/lib/enrichRecord.mjs | Utility library for record enrichment logic used by the enrichment script. |

---

## Application Source (`src/`)
| File/Dir | Description |
|----------|-------------|
| src/main.tsx | Main React entry point. |
| src/App.tsx | React Router setup. |
| src/types/ | Core TypeScript types (`domainTypes.ts`, `rawTypes.ts`, `grid.ts`). |
| src/theme/ | Theming files, like `nationThemes.ts` for card colors. |
| src/utils/ | Shared helper functions (`stringUtils.ts`, `tokenize.ts`). |
| src/hooks/ | All custom React hooks (see below). |
| src/components/ | All reusable UI components (cards, grid, nav, modal, etc.). |
| src/pages/ | Page-level components that compose the UI. |
| src/search/ | Client-side search utilities. |
| src/styles/ | CSS files. |
| src/styles/custom.css | Custom CSS with CRT utilities (crt-glow-text, crt-glow-border, crt-dither), scrollbar theming, and font definitions. |
| src/styles/generated-tailwind.css | Generated Tailwind CSS output (must be rebuilt after config changes). |
| src/config/constants.ts | Centralized API endpoints and config constants. |

---

### Key Frontend Files & Their Roles

#### **Data Flow & State**
| File | Description |
|------|-------------|
| **`pages/HomeContainer.tsx`** | The stateful "brain" of the app. Fetches `enriched-data.json`, manages `query` and `expandedCardId` state, and calls the `useSearch` hook. |
| **`hooks/useSearch.ts`** | **The core of the search system.** Receives all data, preprocesses it, builds the FlexSearch index in-browser, and returns filtered results. |
| **`hooks/useEnrichedData.ts`** | Fetches and manages the enriched data from the API endpoint, with robust error handling. |
| **`hooks/useImageFallback.ts`** | Manages image loading, error fallback, and status for entity images. |
| **`hooks/useAustrosSearch.ts`** | Enhanced search hook with additional functionality for the Austros system. |
| **`hooks/useCardExpansion.ts`** | Manages card expansion state and modal behavior. |
| **`hooks/useFilters.ts`** | Handles filtering logic and state management. |
| **`hooks/useFilterOptions.ts`** | Provides available filter options based on data. |
| **`hooks/useModalFocus.ts`** | Manages focus trapping and accessibility for modals. |
| **`hooks/useNationColor.ts`** | Provides nation-based color theming. |
| **`hooks/useDebounce.ts`** | Debounces rapid input changes for performance. |
| **`hooks/useSuggestions.ts`** | Provides search suggestions and autocomplete. |
| **`hooks/useRecentSearchRecorder.ts`** | Records and manages recent search history. |
| **`search/preprocessor.ts`** | Helper for `useSearch`. Creates the `searchBlob` from each record to enable comprehensive full-text search. |
| **`pages/Home.tsx`** | The presentational "body" of the app. Receives props from `HomeContainer` and renders the UI. |

#### **UI Components**
| File | Description |
|------|-------------|
| **`components/SearchBar.tsx`** | Terminal-style search input with phosphor persistence effect (characters flash brighter when typed), cursor wake-up animation, scan lines, custom fonts, block cursor animation, 28px font size, disabled spell-check, custom text selection, and comprehensive CRT effects. |
| **`components/EntityGrid/EntityGrid.tsx`** | Renders the responsive grid of cards. Passes expand/collapse state to each card. **Matrix Integration:** Uses `bg-transparent` to allow Matrix rain to flow through gaps between cards. Shows empty grid without "No results" message when no matches found. |
| **`components/ItemCard/ItemCard.tsx`** | Renders both the small grid card and the full-screen expanded modal view. Contains all logic for a single entity's display. Features responsive text sizing and proper flex layout to prevent name truncation. **Matrix Transparency:** Removed `bg-background` to prevent grey boxes blocking Matrix rain. |
| **`components/MatrixRain/MatrixRain.tsx`** | **NEW (2025):** Canvas-based Matrix digital rain background effect with authentic movie-style characteristics, true randomness, and optimized performance. Replaces 287 lines of CSS with 80-line React component. |
| **`components/CustomMarkdownRenderer.tsx`** | Renders markdown content for the expanded card view, with custom styling. |
| **`components/ThemedCard/ThemedCard.tsx`** | A styled wrapper that applies nation-specific border colors to cards. **Matrix Update:** Added glassmorphism effects with semi-transparent backgrounds, backdrop blur, and Matrix green hover glow. |
| **`components/Layout.tsx`** | Main application layout wrapper component. **Matrix Integration:** Includes MatrixRain component and transparent backgrounds to allow rain effect visibility. |
| **`components/NationIcon/NationIcon.tsx`** | Displays nation-specific icons using React Icons. |
| **`components/Badge/Badge.tsx`** | Reusable badge component for displaying roles and categories. |
| **`components/QuoteBlock/QuoteBlock.tsx`** | Renders quoted text with special styling for markdown content. |
| **`components/SectionBlock/SectionBlock.tsx`** | Renders structured sections in expanded views. |
| **`components/FilterSidebar.tsx`** | Sidebar for filtering options (can be hidden via returning null). |
| **`components/CollectionsSidebar.tsx`** | Sidebar for collection management (can be hidden via returning null). |

#### **TypeScript Types & Configuration**
| File | Description |
|------|-------------|
| **`types/domainTypes.ts`** | Core domain types for entities, collections, and business logic. |
| **`types/rawTypes.ts`** | Types for raw markdown data before processing. |
| **`types/grid.ts`** | Types for grid layouts and responsive components. |
| **`types/index.ts`** | Central type exports and re-exports. |
| **`search/types.ts`** | Search-specific types for indexing and results. |
| **`theme/nationThemes.ts`** | Nation color theme definitions and mappings. |

---

## Data & Public Assets
| File/Dir | Description |
|------|-------------|
| **`public/enriched-data.json`** | **The single source of truth for the frontend.** A JSON array of all entity records, generated by the data pipeline. |
| `public/assets/images/` | All static images used for entity cards. |
| `raw-data/` | The raw markdown source files for all encyclopedia entries. |
| `data/` | Intermediate data files used during the build process (`parsed-data.json`). |

---

This index provides a clear and accurate map of the project as it currently stands.