## 🏗️ Frontend Architecture & Logic

The frontend is architected around the Single Responsibility Principle, with clear separation between state management, data fetching, and presentation.

### 1. `HomeContainer.tsx`: The Orchestrator

This component is the "brain" of the main page but contains minimal logic itself. Its primary responsibility is to orchestrate a series of custom hooks.

-   Fetches initial character data via `ClientSearchEngine`.
-   Calls custom hooks (`useSearchHandler`, `useFilters`, `useSuggestions`).
-   Passes the state and handlers from these hooks down to the presentational `<Home />` component.

### 2. Custom Hooks: The Logic Hubs

All complex state management is isolated into reusable, single-purpose hooks.

-   **`useSearchHandler.ts`**: Manages the search query state and calls the `useAustrosSearch` hook to get results.
-   **`useFilters.ts`**: Manages all filter-related logic: deriving filter options from data, handling active filter state, and returning the filtered list of items.
-   **`useSuggestions.ts`**: Encapsulates the logic for generating search query suggestions based on search results.

### 3. `SearchBar.tsx`: The Unified Component

-   **Location:** `src/components/SearchBar.tsx`
-   **Responsibility:** A single, flexible component that handles both simple form-based search and advanced, suggestion-aware search.
-   **Logic:**
    - Receives value and onChange props from `HomeContainer` (via `Home`).
    - Handles input, clear button, and suggestion logic.
    - All UI styling and toggling details are documented in `styling.md`.

### 4. `EntityGrid` and `ItemCard`: Card Grid & Card Logic

-   **Location:** `src/components/EntityGrid/EntityGrid.tsx`, `src/components/ItemCard/ItemCard.tsx`
-   **Responsibility:**
    - `EntityGrid` renders a flexbox grid of cards, each card is an `ItemCard`.
    - Card width is controlled in `EntityGrid` (w-[188px] as of latest update).
    - `ItemCard` is responsible for rendering the card content, including image, name, nation icon, and category.
    - Card name uses multi-line wrapping with line clamping (`line-clamp-2`) for accessibility and SRP, ensuring most names are visible by default.
    - Card content (image, text, etc.) is scaled to match the card size for visual consistency.
    - All logic is designed for accessibility, maintainability, and a visually consistent grid.
    - For styling and further details, see `styling.md`.

### 5. `FilterSidebar` and `FilterPanel`: Filter UI Logic

-   **Location:** `src/components/FilterSidebar.tsx`, `src/components/FilterPanel.tsx`
-   **Responsibility:**
    - `FilterSidebar` renders the sidebar with filter groups and filter controls (e.g., nation, element, status, gender, age group).
    - `FilterPanel` (when used) renders filter tags or controls above the main grid.
    - Both components receive filter state and handlers as props from `HomeContainer` and update the UI accordingly.
-   **Toggling:**
    - To hide or unhide these components, see `styling.md` for the canonical method.

### 6. `CollectionsSidebar` and `CollectionsPanel`: Collections UI Logic

-   **Location:** `src/components/CollectionsSidebar/CollectionsSidebar.tsx`, `src/components/CollectionsPanel/CollectionsPanel.tsx`
-   **Responsibility:**
    - `CollectionsSidebar` renders the sidebar with a list of user collections and collection controls.
    - `CollectionsPanel` renders the modal/panel for adding to or creating collections.
    - Both receive collection state and handlers as props from `HomeContainer` and update the UI accordingly.
-   **Toggling:**
    - To hide or unhide these components, see `styling.md` for the canonical method.

### 7. `stringUtils.ts`: Shared Utilities

-   **Location:** `src/utils/stringUtils.ts`
-   **Responsibility:** Contains general-purpose, non-React helper functions (e.g., `toTitleCase`, `getInitials`). Components like `ItemCard` import these helpers instead of defining them locally.