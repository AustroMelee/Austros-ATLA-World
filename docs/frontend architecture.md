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
-   **Implementation:** It uses Tailwind CSS for styling and accepts optional props (`onSubmit`, `suggestion`, `nationIcon`, etc.) to conditionally render its features. This consolidation eliminates code duplication.

### 4. `stringUtils.ts`: Shared Utilities

-   **Location:** `src/utils/stringUtils.ts`
-   **Responsibility:** Contains general-purpose, non-React helper functions (e.g., `toTitleCase`, `getInitials`). Components like `ItemCard` import these helpers instead of defining them locally.