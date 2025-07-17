# **Feature Plan: Client-Side Collection System**

## 1. Overview & Vision

This document outlines the design and implementation of a **Client-Side Collection System**. This feature will allow users to create, manage, and view personalized groups of cards (e.g., "Team Avatar," "Best Fight Scenes," "My Favorites").

The entire system will be self-contained within the user's browser, integrating directly with the existing `HomeContainer` state management and `ItemCard` component structure. It will require no backend infrastructure or login systems, prioritizing speed and in-context actions over traditional, blocking modals.

## 2. Core Principles & Integration Strategy

Development will adhere to the following principles, ensuring harmony with the current codebase:

*   **100% Client-Side:** All logic and state will be managed in the browser, with persistence via `localStorage`. This aligns with the client-side search architecture.
*   **Encapsulated Logic via Custom Hook:** All `localStorage` interaction and collection management logic will be centralized in a new hook, `src/hooks/useCollections.ts`, mirroring the pattern of `useSearch` and `useEnrichedData`.
*   **Centralized State Management:** The `HomeContainer.tsx` component will remain the central orchestrator. It will manage the active collection filter state and pass data and handlers down the component tree.
*   **Component-Driven UI:** New UI elements will be created as reusable components in a new `src/components/Collections/` directory. They will be integrated into the existing `ItemCard` and header layouts.
*   **Simple & Maintainable Assets:** Collection icons will be limited to standard emojis or text characters, respecting the project's preference for simplicity and avoiding complex asset management.
*   **Follow Existing UI/UX Patterns:** The feature will be implemented via a `CollectionsSidebar` and `CollectionsPanel`, following the "hide/unhide" convention documented in `styling.md` for feature toggling.

## 3. Data Model & State Management

### a. TypeScript Types (`src/types/domainTypes.ts`)

We will add the following types to your existing domain types file:

```typescript
// in src/types/domainTypes.ts

export interface Collection {
  id: string; // e.g., 'c1-a8b2c4'
  name: string;
  description?: string;
  icon?: string; // Emoji or text character
  createdAt: string; // ISO 8601 string
  cardIds: string[]; // Array of entity slugs/ids
}
```

*Instead of a separate `cardMemberships` map, we'll store an array of `cardIds` directly within each collection. This simplifies data management and lookups for filtering.*

### b. State Management (`src/hooks/useCollections.ts`)

A new hook will be created to manage all collection data and logic.

**File:** `src/hooks/useCollections.ts`

**Responsibilities:**
*   Read and write all collection data to a single `localStorage` key (`austros-atla-collections`).
*   Provide memoized functions for CRUD operations to prevent unnecessary re-renders.
*   Abstract away all `localStorage` implementation details from the UI components.

**Exported API:**
```typescript
interface UseCollectionsReturn {
  collections: Collection[];
  getCollectionsForCard: (cardId: string) => Collection[];
  isCardInAnyCollection: (cardId: string) => boolean;
  createCollection: (name: string, initialCardId?: string) => void;
  updateCollection: (collectionId: string, updates: Partial<Collection>) => void;
  deleteCollection: (collectionId: string) => void;
  addCardToCollection: (collectionId: string, cardId: string) => void;
  removeCardFromCollection: (collectionId: string, cardId: string) => void;
}

export function useCollections(): UseCollectionsReturn {
  // ... implementation with useState, useEffect, useCallback ...
}
```

## 4. Implementation Plan & Component Breakdown

### Step 1: Modifying `ItemCard.tsx`
The `ItemCard` is the primary point of interaction for adding entities to a collection.

**File:** `src/components/ItemCard/ItemCard.tsx`

1.  **Add `CollectionCardButton`:** A new button component will be created (`src/components/Collections/CollectionCardButton.tsx`) and placed on the `ItemCard`, likely near the image or in a corner.
2.  **Visual State:** The button's appearance will change based on the card's collection status:
    *   **Default:** A `+` icon.
    *   **In one or more collections:** A `✓` checkmark icon or similar highlighted state.
3.  **Interaction:** Clicking the button will open a new popover component.
4.  **`AddToCollectionPopover`:** This small popover (`src/components/Collections/AddToCollectionPopover.tsx`) will display:
    *   A list of existing collections, with checkmarks next to those the card already belongs to.
    *   A "Create new collection..." option at the top. Clicking this will trigger the creation UI in the main header/sidebar.
5.  **Props:** `ItemCard` will need to accept the necessary functions and state from the `useCollections` hook, which will be passed down from `HomeContainer`.

### Step 2: Creating the Header/Sidebar UI
Following the project's pattern for optional UI panels, we'll create a new sidebar for managing collections.

**File:** `src/components/Collections/CollectionsSidebar.tsx` & `CollectionsPanel.tsx`

1.  **Placement:** The `CollectionsSidebar` will be added to the main layout, similar to how other sidebars might be structured. It can be toggled on/off by following the convention in `styling.md` (returning `null`).
2.  **Display Collections:** The panel will render a list of all user-created collections, using data from the `useCollections` hook.
3.  **Filter Trigger:** Clicking a collection name will call a function (passed down from `HomeContainer`) to set it as the active filter. An "All Items" / "Clear Filter" button will be prominent.
4.  **Create/Manage:** The panel will contain the inline form for creating new collections and provide entry points (e.g., a settings icon on each collection) to edit or delete them.

### Step 3: Integrating with `HomeContainer.tsx`
This is the central point of integration where data, state, and UI are connected.

**File:** `src/pages/HomeContainer.tsx`

1.  **Instantiate Hook:** Call `useCollections()` at the top of the component to get all collection data and functions.
    ```tsx
    const collectionsApi = useCollections();
    ```
2.  **Manage Filter State:** Add a new state variable to manage the active collection filter.
    ```tsx
    const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
    ```
3.  **Update Filtering Logic:** The logic for determining `itemsToRender` will be updated to a multi-stage process:
    ```tsx
    // 1. Start with all enriched data
    let filteredItems = enrichedData;

    // 2. Apply collection filter if active
    if (activeCollectionId) {
      const activeCollection = collectionsApi.collections.find(c => c.id === activeCollectionId);
      const cardIdsInCollection = new Set(activeCollection?.cardIds || []);
      filteredItems = enrichedData.filter(item => cardIdsInCollection.has(item.id));
    }

    // 3. Apply search filter if there's a query
    // The useSearch hook will now receive the potentially pre-filtered list
    const searchResults = useSearch(filteredItems, query);
    const itemsToRender = query ? searchResults : filteredItems;
    ```
4.  **Prop Drilling:** Pass the `collectionsApi` functions and filter state down to `Home`, which will then pass them to the `CollectionsSidebar` and `EntityGrid` -> `ItemCard`.

## 5. Documentation and Edge Cases

*   **Update `faq.md`:** Add a new entry explaining that collection data is stored in `localStorage` and will be lost if browser data is cleared.
*   **Update `file index.md`:** Add the new files (`useCollections.ts`, `CollectionCardButton.tsx`, etc.) to the index.
*   **Update `frontend architecture.md`:** Add a section describing the role of `useCollections` and the new state flow from `HomeContainer`.
*   **Error Handling:** The `useCollections` hook should include `try...catch` blocks for all `localStorage` operations to gracefully handle potential browser security restrictions or storage limits.
*   **Duplicate Names:** The `createCollection` function in the hook will handle duplicate name validation, preventing the creation of a new collection if the name already exists.