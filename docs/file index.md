Root configuration & metadata
File	Description
README.md	Minimal placeholder readme. Should be updated for project overview.
package.json	Node project manifest defining scripts for data processing, linting, building with Vite, etc. Central for running/building the app. 
package-lock.json	Exact dependency versions for reproducible installs.
vite.config.ts	Vite build config; sets up React plugin, service worker (PWA), and module aliases. 
tailwind.config.js	Tailwind CSS theme and typography customization. Key for consistent styling. 
postcss.config.cjs	PostCSS plugins (autoprefixer) used by Tailwind. 
tsconfig.json	TypeScript compiler settings for the project. 
tsconfig.node.json	TS config override for Node scripts. 
jest.config.cjs	Jest test environment configuration. 
.eslintrc.json	ESLint rules and settings for code quality. 
.markdownlint.json	Markdown lint configuration.
madge.config.js	Config for dependency graph tool Madge. 
depcheck-report.json	Output from dependency checker.
favicon.ico	Site icon for the web app.
INDEX.HTML	Possibly legacy or example HTML file.
.gitignore	Specifies files/folders not committed to git.
hello.cjs	Simple test script printing “Hello, world!”. 
Documentation
File	Description
docs/setup.md	Comprehensive setup and workflow guide for the project. 
docs/decisions.md	Architectural decisions and rationale. 
docs/source_of_truth.md	Canonical reference for data authoring and pipeline. 
docs/filtering_system_plan.md	Detailed implementation plan for client‑side search engine and filter system. 
docs/adding-new-domain-tutorial.md	Tutorial on adding new data domains or updating existing ones. 
docs/blueprints/project_blueprint.md	Overall project blueprint and goals. 
docs/blueprints/project plans.md	Additional planning notes.
docs/vertical_slice/verticle_slice.txt	Large HTML prototype demo for UI/UX. 
Scripts (data pipeline & utilities)
File	Description
scripts/1-parse-markdown.mjs	Parses raw Markdown files, extracting YAML frontmatter and JSON blocks into structured data. Includes extensive logging. 
scripts/2-enrich-data.mjs	Takes parsed data and adds slugs plus other enrichment. Outputs enriched data JSON. 
scripts/3-build-index.mjs	Builds search index from enriched data using FlexSearch.
scripts/build-index.mjs	Another index builder used by npm script build:index. Processes public/enriched-characters.json into public/search-index.json. 
scripts/enrich-data.mjs	More robust enrichment script: normalizes records, generates slugs, writes to dist and public. 
scripts/validate-data.mjs	Validates raw JSON data against schemas using Ajv. 
scripts/slug-utils.mjs	Utility functions for slug generation and collision handling. 
scripts/copy-cleaned-characters.mjs, clean-characters.mjs, test-document-export.cjs, enrich-config.mjs	Miscellaneous helper scripts for moving/processing data or testing exports.
ESLint custom plugin
File	Description
eslint-plugin-local/index.cjs	Defines custom lint rules used by the project. 
eslint-plugin-local/rules/no-actor-on-non-dialogue-logs.cjs	Lint rule ensuring certain logging calls don’t include an actor property. 
eslint-plugin-local/rules/no-stray-dialogue-import.cjs	Lint rule preventing imports of DialogueLogEntry outside allowed modules. 
Application source (src)
File	Description
src/main.tsx	Entry point mounting React app and importing generated Tailwind CSS. 
src/App.tsx	React router setup linking HomeContainer and NotFound pages. 
src/setupTests.ts	Jest DOM setup for React component testing. 
src/types/ (index.ts, domainTypes.ts, rawTypes.ts)	Central TypeScript types for raw and enriched data. Describes fields for characters, bending, etc. 
src/config/filterConfig.ts	Configuration for filtering sidebar options. 
src/theme/nationThemes.ts	Maps each nation to UI colors used across components. 
src/utils/stringUtils.ts	Helpers for title‑casing and deriving initials. 
src/flexsearch.d.ts	Type declaration stub for FlexSearch. 
Hooks
File	Description
useAustrosSearch.ts	Core hook performing debounced search via client search engine. Handles loading/error state. 
useAustrosSearch.test.ts	Jest tests verifying search hook behavior. 
useCollectionsData.ts	Manages persistent user collections (CRUD operations). 
useCollectionsUI.ts	Manages UI state for collections panel. 
useFilters.ts	Builds available filters from initial data and applies active filters to results. 
useDebounce.ts, useModalFocus.ts, useNationColor.ts, useFlexSearch.ts, useImageFallback.ts, useSearchHandler.ts, useRecentSearchRecorder.ts, useVirtualScroll.ts, useSuggestions.ts	Misc hooks for debouncing, modal focus management, computing theme color, wrapping FlexSearch, managing image fallback, search orchestration, recording recent searches, and (placeholder) virtualization/suggestion logic.
useCollectionsData.ts, useCollectionsUI.ts	Provide persistent data handling and UI control for the custom collections feature.
Collections utilities
File	Description
collections/CollectionManager.ts	Reads/writes user collections from localStorage. 
collections/SuggestionEngine.ts	Returns recommended items for a collection (stub). 
Components
File	Description
Layout.tsx	Basic layout wrapper used by the router. 
Navbar.tsx	Navigation bar linking to major pages. 
SearchBar.tsx	Search input component with optional autocomplete hint and nation icon. 
EntityGrid/EntityGrid.tsx	Grid rendering of item cards, with auto-scrolling to selected item. 
ItemCard/ItemCard.tsx	Card UI for characters with image fallback, interactive expand behavior. 
ExpandedItemModal.tsx	Modal view for expanded item information.
Badge/Badge.tsx	Reusable badge component (e.g., for nations). 
FilterSidebar.tsx, FilterPanel.tsx, FilterTag.tsx	Sidebar and tag widgets for filter interaction. 
CollectionsSidebar/CollectionsSidebar.tsx, CollectionsPanel/CollectionsPanel.tsx	UI for managing user collections. 
StyledButton/StyledButton.tsx, StyledCard/StyledCard.tsx, ThemedCard/ThemedCard.tsx	Styled reusable UI primitives. 
NationIcon/NationIcon.tsx	Displays an icon representing a nation using react-icons. 
LoadingSpinner.tsx	Simple spinner for loading states. 
RecentSearches/RecentSearches.tsx	Shows clickable list of recent searches. 
QuoteBlock/QuoteBlock.tsx	Blockquote component for displaying quotes. 
SectionBlock/SectionBlock.tsx, NoResults.tsx, ErrorBoundary.tsx	Miscellaneous UI components for layout, empty states, and error handling.
Sandbox/TestImport.ts	Simple test script demonstrating theme import. 
Pages
File	Description
pages/HomeContainer.tsx	Stateful container for the home/search page. Handles search, filters, collections, and passes data to Home component. 
pages/Home.tsx	Presentational component rendering search bar, filter sidebar, collections sidebar, and results grid. 
pages/NotFound.tsx	404 fallback page. 
Search engine utilities
File	Description
search/ClientSearchEngine.ts	Loads FlexSearch index from search-index.json, normalizes records, and performs searches. Key for client‑side search. 
search/PersonalizationEngine.ts	Manages recent searches and boosted slugs in localStorage. 
search/QueryParser.ts	Parses natural language queries into structured filters. 
Styles
File	Description
styles/pure-tailwind.css, tailwind.css, custom.css, generated-tailwind.css, test.css	Tailwind CSS source and generated files for styling the application. 
Data & Public assets
File	Description
data/parsed-data.json, data/enriched-data.json	Processed dataset used to build search index.
public/enriched-data.json	Final enriched records shipped with the app.
public/search-index.json	FlexSearch index for instant client searches.
raw-data/characters/*.md	Markdown source files for each character (e.g., zuko.md, aang.md). Parsed by scripts to build the dataset.
raw-data/bending/*.json, raw-data/fauna/*.json, raw-data/foods.json	Raw JSON data for other domains (bending arts, fauna, food).
raw-data/schema/*.schema.json	JSON Schema definitions used in validation step. 
Miscellaneous
File	Description
projectrules.mdc	Project‑specific guidelines for tooling usage. 
planned features/...	Notes on proposed but unapproved features.
bugs/*	Text files describing known or fixed issues for debugging/history.
test-flexsearch.cjs, test-flexsearch.mjs, test2.cjs	Small scripts experimenting with FlexSearch reading/parsing.
build-index.cjs	Node script variant for building a search index from enriched data. 
This covers all substantive source, configuration, documentation, and data files in the repository while omitting transient artifacts (images, node_modules). The project uses a structured pipeline (raw data → parsing → enrichment → search index) and a React frontend with hooks and components built around that data. All scripts and config files work together to validate, enrich, and serve the Avatar encyclopedia.