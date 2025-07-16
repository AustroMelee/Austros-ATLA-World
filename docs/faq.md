# System Behavior & Development FAQ

This document outlines answers to common technical questions regarding the application's architecture, error handling, and development practices.

---

### 🐛 Data Pipeline & Error Handling

#### 1. Handling of Missing/Malformed `enriched-data.json`
If the primary data file at `public/enriched-data.json` is missing, fails to load, or contains malformed JSON, the `fetch` call within the `useEnrichedData` hook will fail. The application logs the error to the console but does not display a user-facing error message, showing a fallback UI (e.g., a "Loading..." or blank state) instead.

#### 2. Error Handling in the Search Index Pipeline
Since search indexing is performed client-side, errors during index creation (e.g., from a malformed record that slipped past the enrichment script) are caught within the `useSearch` hook. These errors are logged to the browser console. To the user, a failed index build will manifest as the "No Results Found" component, as the search will return no matches.

#### 3. Handling of Missing Fields in Records
The data pipeline is designed to enforce data integrity. The enrichment script (`scripts/2-enrich-data.mjs`) should ideally catch records with missing required fields and fail the build. If an incomplete record makes it to the frontend, UI components are built to handle missing data gracefully, typically by rendering a fallback value (e.g., "Unknown" for a missing `nation`) or omitting the element.

#### 4. Handling of Deprecated/Legacy Data Fields
Deprecated fields from the raw data are ignored by the data pipeline. The enrichment and parsing scripts are the single source of truth for the data schema. Only fields defined in the canonical data structures (`src/types/`) are processed and included in the final `public/enriched-data.json`.

#### 5. Handling Errors and Logging in New Code
Never use empty `catch` blocks. All errors must be logged to the console with sufficient context for debugging. If an error is user-actionable, it should be surfaced in the UI. Use assertions and type-guards to catch potential errors early during development.

---

### 🎨 Frontend UI & User Experience

#### 6. Image Fallbacks
If a character card image fails to load, the `useImageFallback` hook (located in `src/hooks/useImageFallback.ts`) intercepts the error. It provides a default placeholder image or icon, ensuring that the UI remains visually consistent and does not show broken image links.

#### 7. Keyboard Accessibility & Focus Management
The application prioritizes accessibility. Interactive elements like modals and expanded cards use a focus-trapping mechanism managed by the `useModalFocus.ts` hook. This ensures that keyboard focus remains within the active component. All interactive elements must be fully keyboard-navigable (Tab, Shift+Tab, Enter) and use semantic HTML with appropriate ARIA roles. See `docs/styling.md` for detailed requirements.

#### 8. Mobile & Touch Interactions
The application is fully responsive. Layouts, components, and interactive controls are designed with touch-friendly hit targets. Modals and other overlays are optimized for mobile viewports, featuring larger tap areas and native scroll behavior to ensure a smooth user experience.

#### 9. Custom Font Loading
Custom web fonts are self-hosted in the `public/assets/fonts/` directory and are loaded via `@font-face` rules in `src/styles/custom.css`. The CSS font stack is configured with standard system fallbacks, so if a custom font fails to load, the browser will seamlessly render the next available font.

#### 10. Markdown Rendering
Markdown content, primarily used in the expanded card views, is rendered using the `react-markdown` library with the `remark-gfm` plugin for GitHub Flavored Markdown support. Custom components are used for styling specific markdown elements like headings and links to match the application's theme.

#### 11. Modal and Overlay Management
Modals utilize the `useModalFocus.ts` hook for focus trapping and ARIA roles for accessibility. Only one modal can be open at a time. Upon closing, focus is programmatically returned to the element that triggered the modal.

#### 12. Adding/Updating Images and Static Assets
Place all new images in `public/assets/images/` and reference them using relative paths (e.g., `/assets/images/my-image.png`). Do not import image assets directly into TypeScript/TSX files, as this can interfere with Vite's optimized asset handling.

---

### 🏗️ Application Architecture & State

#### 13. State Persistence on Reload
The application state, including the current search query and any expanded card IDs, is managed in-memory using React state hooks. There is no persistence layer (like `localStorage` or `sessionStorage`). A page reload will reset the application to its default initial state.

#### 14. Browser History & Modal State
The state of UI overlays like modals is not currently synchronized with the browser's history stack. This means using the browser's "back" or "forward" buttons will not close or open a modal. Navigation is managed independently of the UI overlay state.

#### 15. React ErrorBoundary Behavior
The root application is wrapped in a custom `ErrorBoundary` component (see `src/components/ErrorBoundary.tsx`). If a critical rendering error occurs in a child component, this boundary will catch it and display a user-friendly fallback UI instead of a blank page or a crashed application.

#### 16. Analytics & Telemetry
The application is privacy-first. There are no analytics, user tracking, or telemetry scripts included in the codebase.

#### 17. Internationalization (i18n) Readiness
All user-facing strings must be externalized from components and prepared for future internationalization. Do not hardcode user-visible text directly in the JSX. A central string management solution should be used.

#### 18. Environment Variables
This project does not use environment variables (`.env` files) for runtime configuration. All configuration is managed via static files (e.g., `tailwind.config.js`, `vite.config.ts`) or hardcoded constants within the source code.

---

### ⚙️ Development & Maintenance

#### 19. Adding a New Nation Color/Theme
To add a theme for a new nation, two files must be updated:
1.  **`src/theme/nationThemes.ts`**: Add a new entry to the `nationThemeMap` object, defining the color identifiers for the new nation.
2.  **`tailwind.config.js`**: Add the corresponding color classes (e.g., `bg-nation-new`, `border-nation-new`) to the `theme` configuration and safelist. After changes, run `npm run build:tailwind`.

#### 20. Upgrading Core Dependencies
All dependencies are pinned in `package.json` for stability. To upgrade a package, manually update its version, delete `node_modules` and `package-lock.json`, and run `npm install`. Thoroughly test the application locally for breaking changes. `FlexSearch` is specifically pinned and should not be upgraded without careful verification.

#### 21. Hot Module Reload (HMR) Caveats
The project uses Vite, which provides excellent HMR for React components and most styles. However, changes to global configuration files require a manual step:
-   **`tailwind.config.js`**: Changes require running `npm run build:tailwind` and a full page reload.
-   **Global CSS (`custom.css`)**: Changes may require a full page reload to apply correctly.

#### 22. Adding and Running Tests
To add a new test, create a file with a `.test.ts` or `.test.tsx` suffix in the same directory as the module being tested. Use Jest and React Testing Library. To run all tests, execute `npm test`.

#### 23. Performance Profiling
To identify performance bottlenecks, use the React DevTools Profiler. Apply memoization techniques (`React.memo`, `useMemo`, `useCallback`) only after a clear need has been identified through profiling.

#### 24. Updating or Removing Dependencies
Run `npm outdated` to check for new versions. Use `npm uninstall <package-name>` to remove unused packages and then run `npm install` to update the `package-lock.json` file. Keeping dependencies clean is a project requirement.

#### 25. Creating Custom Scripts
New automation or utility scripts should be placed in the `scripts/` directory. Document their purpose with comments and add a corresponding command to the `"scripts"` section of `package.json` for easy execution.

#### 26. Contributing Changes
This project follows a trunk-based development model. Work directly on the `main` branch. Before committing, ensure all code passes local checks (`npm run lint`, `npm run type-check`). There are no pull requests or feature branches.

#### 27. Experimenting with AI-driven Changes
To safely test changes, especially those generated by AI, follow the sandbox workflow detailed in `docs/sandbox_env.md`. All significant changes must be validated in a sandbox environment before being committed to the main branch.

#### 28. Getting Help or Reporting a Bug
First, consult this FAQ and other project documentation. If the issue is not covered, add a new, concise entry to this FAQ or document the bug in the designated project management tool.