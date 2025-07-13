# 🚀 **Austros ATLA World Encyclopedia – Project Plan v4.0**

This document outlines the official project plan for implementing the **v4.0 Blueprint**. It is designed to be a comprehensive, step-by-step guide that prioritizes stability, accessibility, and proactive quality assurance.

---

## 🎨 **Section 1: Theming Foundation & Data Readiness**
*Objective: Establish the core visual identity and validate the entire data pipeline to prevent downstream errors. This corresponds to **Batch 1** of the blueprint.*
[START-COMPLETE]
### ### Step 1.1: Fortify the Data Pipeline 📊
*Goal: Ensure data is 100% clean, validated, and backed up before any new development begins.*

2.  **Lint Markdown:** Run a linter (like `markdownlint`) across all `.md` files to catch syntax inconsistencies or potential parsing errors early.
3.  **Execute Full Pipeline:** Run the master script `npm run build:data` to perform parsing, validation, enrichment, and indexing in one go.
4.  **Scrutinize Pipeline Output:** Manually inspect the terminal output for any warnings or errors, even if the script succeeds.
5.  **Verify Enriched Data:** Open `dist/enriched-data.json`. Spot-check at least 5-10 records to confirm that `id`, `slug`, and `__type` were added correctly and that no data was malformed or dropped.
6.  **Confirm Search Index:** Briefly inspect `public/search-index.json` to ensure it is not empty and appears to be a valid JSON structure.

### ### Step 1.2: Architect the Theming System 🛡️
*Goal: Create a scalable, type-safe theming architecture that supports the four nations.*

1.  **Install Tooling:** Verify that `vite-plugin-vanilla-extract` is installed and correctly configured in `vite.config.ts`.
2.  **Define Theme Contract:** Create `src/styles/themes/theme.contract.ts`. In this file, define the shape of the theme using `createThemeContract` to enforce type-safety (e.g., `primaryColor`, `borderColor`, `nationWater`, `nationEarth`, etc.).
3.  **Implement Dark Theme:** Create `src/styles/themes/darkTheme.css.ts`. Implement the contract by defining the CSS variables for the dark theme and all four nation colors, plus a neutral/default color.
4.  **Create Storybook Story:** Develop a new Storybook story (`Theme.stories.tsx`) that visually displays all theme colors as colored swatches. This provides a "living style guide" for instant visual confirmation.
5.  **Apply Global Theme:** In `App.tsx`, import and apply the dark theme class to the root element to set it as the application-wide default.
6.  **Compatibility Check:** Briefly run the app to ensure the new global styles do not conflict with or override any critical existing component styles.

---

## 🧠 **Section 2: Build the Hyper-Intelligent Search Bar**
*Objective: Implement the "Enterprise-Grade Search Experience" with dynamic theming and predictive text. This corresponds to **Batch 2** of the blueprint.*

### ### Step 2.1: Engineer the Search Hook ⚙️
*Goal: Refactor the core search logic to be more powerful and provide necessary metadata.*
1.  **Define New Return Type:** In `src/hooks/useAustrosSearch.ts`, define a clear TypeScript type for the new return structure, e.g., `{ results: SearchResult[]; topHit: { nation: string } | null; }`.
2.  **Implement Debouncing:** Wrap the search execution logic in a `debounce` function (e.g., from `lodash-es`) with a `300ms` delay to prevent excessive re-renders and processing while the user is typing.
3.  **Refactor Logic:** Modify the hook to identify the top result and extract its `nation`.
4.  **Handle Edge Cases:** Add explicit logic to return a neutral state (`topHit: null`) when there are zero search results or when the top result has no `nation` property.
5.  **Write Unit Tests:** Create `useAustrosSearch.test.ts` and write tests for three scenarios: a) successful search with a top hit, b) search with results but no valid top hit, and c) search with no results.[END-COMPLETE]

### ### Step 2.2: Construct the UI Components ⌨️ (Revised for Current System)

*Goal: Build a robust, accessible search bar with inline autosuggestion and dynamic theming.*

1. **Implement Inline Suggestion in `SearchBar`:**
    *   The suggestion logic is handled directly within `SearchBar.tsx` using a “fake input” pattern.
    *   The user’s query and the suggestion are rendered together in a single flex row, ensuring perfect alignment and no visual cramping.
    *   The suggestion text is styled with reduced opacity and ellipsis, and is not focusable or announced by screen readers (since it’s not part of the input value).

2. **Dynamic Theming and Accessibility:**
    *   The `SearchBar` consumes the `useAustrosSearch` hook to get the top result and its nation.
    *   The input text color dynamically reflects the nation color, using a prop passed from the parent page.
    *   The search bar is fully accessible: the real input is layered on top, is focusable, and supports keyboard navigation and screen readers.

3. **Tab Completion and User Experience:**
    *   The `onKeyDown` handler in `SearchBar` listens for the Tab key.
    *   If a suggestion is present, pressing Tab autocompletes the suggestion into the input, preventing the default tab navigation.
    *   The “TAB” keycap indicator is rendered immediately after the suggestion for clear user guidance.

4. **Cross-Browser and Responsive Testing:**
    *   The inline suggestion approach is robust across Chrome, Firefox, and Safari, and adapts to all input widths and device sizes.
    *   Manual QA confirms that the suggestion, Tab completion, and theming work consistently in all supported browsers.

---

**Summary:**  
This approach eliminates the need for a separate overlay component, reduces layout bugs, and ensures a seamless, accessible, and visually consistent search experience. All requirements for predictive text, dynamic theming, and accessibility are met within a single, maintainable component.

---

## ✨ **Section 3: Implement Dynamic, Nation-Themed Item Cards**
*Objective: Create visually rich, interactive item cards that reflect their nation's identity. This corresponds to **Batch 3**.*

### ### Step 3.1: Re-Engineer the Item Card Component 🃏
*Goal: Upgrade the `ItemCard` to be dynamic, interactive, and accessible.*

1.  **Update Props:** Modify the `ItemCard`'s props to accept a `nation` string and an `onAddToCollection` callback function.
2.  **Add Collection Icon:** Add a `+` icon button inside the card. Ensure it has a clear `aria-label="Add item to a collection"` for screen readers.
3.  **Implement Dynamic Styling:**
    *   In `src/components/ItemCard/ItemCard.css.ts`, use the nation-color CSS variables from the theme contract.
    *   Apply the dynamic `border-color` based on the `nation` prop. Include a fallback to the neutral color if the `nation` prop is ever missing.
4.  **Refine Animations:**
    *   Implement the `transform: scale(1.05)` on hover/focus using smooth CSS transitions.
    *   Add the `@media (prefers-reduced-motion: reduce)` media query to disable animations for users who require it.
5.  **Create Storybook Variations:** In `ItemCard.stories.tsx`, create stories for each nation's theme, a card with a missing nation (to test the fallback), and a story demonstrating the hover/focus animation.

### ### Step 3.2: Integrate Cards Across the App 💨
*Goal: Consistently and safely roll out the new `ItemCard` across all pages.*

1.  **Data Validation:** Run a one-off script to scan `dist/enriched-data.json` and confirm that *every single item* has a valid `nation` field. Fix any missing data in the `raw-data` source.
2.  **Create a Renderer Component:** To avoid code duplication, create a new component like `EntityGrid.tsx` that takes a list of items and is responsible for mapping over them and rendering an `ItemCard` for each, passing the correct `nation` and other props.
3.  **Refactor Pages:** Update `CharactersPage.tsx`, `LocationsPage.tsx`, etc., to use the new `EntityGrid` component instead of their own mapping logic. This ensures consistency.

---

## 📌 **Section 4: Develop the Pinterest-Style Collections System**
*Objective: Build the complete user-driven research tool for creating and managing collections. This corresponds to **Batch 4**.*

### ### Step 4.1: Build the Storage & State Backbone 📦
*Goal: Create a bulletproof service for managing `localStorage` and a global state solution.*

1.  **Define Storage Schema:** Formally define the TypeScript interface for the data stored in `localStorage` (e.g., `interface UserCollections { [collectionId: string]: { name: string; items: string[] } }`).
2.  **Build `CollectionManager.ts`:**
    *   Create the class with methods: `createCollection`, `deleteCollection`, `addItemToCollection`, `removeItemFromCollection`, and `getAllCollections`.
    *   **Crucially, wrap every single `localStorage.getItem/setItem/removeItem` call in a `try...catch` block** to handle private browsing mode, full storage, or other browser restrictions gracefully.
3.  **Set Up Global State:** Install and configure a lightweight state manager (like Zustand or Jotai). Create a `collectionsStore` that uses the `CollectionManager` to initialize its state and provides actions to update collections. This decouples the UI from `localStorage` and ensures the entire app reacts to changes.

### ### Step 4.2: Construct the Collection UI & Logic 🤖
*Goal: Implement the user-facing panel and the intelligent suggestion engine.*

1.  **Build `CollectionsPanel.tsx`:**
    *   Create the vertical sidebar UI, ensuring it is fully responsive.
    *   It must be able to read collections from the global state store to display the list.
    *   It must provide a controlled input that calls the `createCollection` action from the store.
    *   **Accessibility:** Implement it as a modal or off-canvas panel that traps keyboard focus when open.
2.  **Wire up the `ItemCard`:** Connect the `+` icon's `onClick` handler on the `ItemCard` to a function that:
    *   Opens the `CollectionsPanel`.
    *   Sets the "currently selected item" in the global state, so the panel knows which item the user wants to add.
3.  **Design `SuggestionEngine.ts`:**
    *   Define the suggestion algorithm first (e.g., "Recommend 3 items of the same nation that are not already in the collection").
    *   Implement the `getSuggestions(collection)` function, ensuring it always filters out items that the user has already saved.
4.  **Unit Test the Engine:** Write `SuggestionEngine.test.ts` with tests for: a) an empty collection, b) a collection with one item, and c) a collection that already contains all possible suggestions of a certain type.

---

## ✅ **Section 5: Final Polish, Testing & Deployment**
*Objective: Conduct exhaustive testing and a meticulous audit before release. This corresponds to **Batch 5**.*

### ### Step 5.1: Execute Rigorous End-to-End Testing 🧪
*Goal: Simulate real user flows to catch integration bugs.*

1.  **Write E2E Test Scripts:** Using Playwright or Cypress, create test scripts for these critical user journeys:
    *   **Search & Theme:** User types "Kyoshi" -> Search bar text turns green -> Suggestor shows "Kyoshi" -> User tabs to complete -> `ItemCard` for Kyoshi has a green border.
    *   **Collection Creation:** User opens panel -> Creates "Team Avatar" collection -> Verifies it appears in the list.
    *   **Add to Collection:** User searches for "Aang" -> Clicks `+` on Aang's card -> Adds him to "Team Avatar" -> Verifies Aang is now in the collection's item list.
2.  **Run Tests:** Execute the full E2E test suite in a headless browser as part of the CI/CD pipeline.

### ### Step 5.2: Perform Final Audits & Pre-Deployment Checklist 📋
*Goal: Ensure the application meets the highest standards of quality, accessibility, and performance.*

1.  **Code Quality Gates:**
    *   Run `eslint --fix .` to enforce code style.
    *   Run `tsc --noEmit` to check for any lingering type errors.
2.  **Accessibility Audit:**
    *   Perform a full keyboard-only navigation test of the entire application, focusing on the new search and collections features.
    *   Use a screen reader (JAWS, NVDA, or VoiceOver) to test the main user flows.
    *   Run an automated accessibility checker (like Axe) and fix all reported violations to meet **WCAG 2.1 AA** standards.
3.  **Performance & Responsiveness Audit:**
    *   Review the app on a range of device viewports, from mobile to ultra-wide.
    *   Use browser developer tools to check for layout shifts and throttle the network to test the user experience on a slow 3G connection.
4.  **Final Build & Staging:**
    *   Create a clean production build with `npm run build`.
    *   Deploy this build to a private staging environment for one final manual smoke test by the project lead.

### ### Step 5.3: Deploy 🚀
*Goal: Release the new version to the world.*

1.  **Tag Release:** Create a new Git tag (e.g., `v4.0.0`).
2.  **Execute Deployment:** Run the production deployment script.
3.  **Post-Deployment Verification:** Immediately after deployment, clear caches and perform a quick manual check of the live site to confirm that all new features are operational.