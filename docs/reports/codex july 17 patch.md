 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/docs/faq.md b/docs/faq.md
index d9fd14c93add20d3fbebe235445fcda83cfad4a0..44f8f1afaa5a2906025bcb00a8949cadd45d77eb 100644
--- a/docs/faq.md
+++ b/docs/faq.md
@@ -240,26 +240,32 @@ First, consult this FAQ and other project documentation. If the issue is not cov
 - Performance was poor due to excessive DOM manipulation
 - The new Canvas solution is 80 lines, truly random, and much more performant
 
 **Can I disable the Matrix Rain effect?**
 - The effect respects the `prefers-reduced-motion` accessibility setting
 - Users with motion sensitivity will see a static or minimal version
 - The application maintains full functionality without the animated background
 
 **How do glassmorphism effects work?**
 - Cards use `backdrop-filter: blur()` for the frosted glass effect
 - Semi-transparent backgrounds allow the Matrix rain to show through
 - Hover states add Matrix green glow with multiple box-shadow layers
 - Cross-browser support includes Safari `-webkit-backdrop-filter` fallbacks
 
 **What happens if my browser doesn't support backdrop filters?**
 - The application gracefully falls back to higher opacity backgrounds
 - All functionality remains intact with slightly less transparency
 - Modern browsers (Chrome 76+, Firefox 103+, Safari 9+) fully support the effects
 
 **Are there any performance considerations?**
 - The Matrix Rain uses `requestAnimationFrame` for smooth 30fps animation
 - Canvas rendering is hardware-accelerated with `will-change: transform`
 - Window resize events are properly debounced to prevent excessive recalculations
 - Memory cleanup occurs on component unmount to prevent leaks
 
----
\ No newline at end of file
+---
+
+### 📁 Collections System
+
+**Where are my collections stored?**
+
+Your custom collections are kept in your browser's `localStorage`. They never leave your device or sync to any server.
\ No newline at end of file
diff --git a/docs/file index.md b/docs/file index.md
index 979068c56a32430c2e20766a2b88976be7b1f7b9..9a78e26598493744c012c437f5940c1f415131bd 100644
--- a/docs/file index.md	
+++ b/docs/file index.md	
@@ -60,81 +60,85 @@ defined there are treated the same as the canonical tag during search.
 
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
-| **`pages/HomeContainer.tsx`** | The stateful "brain" of the app. Fetches `enriched-data.json`, manages `query` and `expandedCardId` state, and calls the `useSearch` hook. |
+| **`pages/HomeContainer.tsx`** | The stateful "brain" of the app. Fetches `enriched-data.json`, manages search and collection state, and calls the `useSearch` hook. |
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
+| **`hooks/useCollections.ts`** | CRUD and persistence layer for user-defined collections stored in `localStorage`. |
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
+| **`components/Collections/CollectionCardButton.tsx`** | Button on each card for toggling collection membership. |
+| **`components/Collections/AddToCollectionPopover.tsx`** | Popover list for assigning cards to collections. |
+| **`components/Collections/CollectionsSidebar.tsx`** | New sidebar component showing and managing collections. |
 
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
\ No newline at end of file
diff --git a/docs/frontend architecture.md b/docs/frontend architecture.md
index 5d15f2f5da35b574bad84dbc35bc91995e27463b..f651561577db88ec586ea07b525b5e198aa37e24 100644
--- a/docs/frontend architecture.md	
+++ b/docs/frontend architecture.md	
@@ -1,66 +1,70 @@
 # 🏗️ Frontend Architecture & Logic (2025 Matrix Update)
 
 The frontend is organized around a clear separation of concerns, with a central container managing state and data flow to presentational components. The search system is now fully client-side for maximum robustness and transparency. **NEW:** Added authentic Matrix-style digital rain background with glassmorphism card effects for a cyberpunk terminal aesthetic.
 
 ---
 
 ## 1. HomeContainer.tsx: The Central Orchestrator
 
 - **Data Fetching:** On initial load, fetches `public/enriched-data.json` (the only data file used by the app) using the `useEnrichedData` hook.
-- **State Management:** Manages the user's search query and the `expandedCardId` for modal views.
-- **Search Logic:** Calls the `useSearch` hook, passing the full dataset and the current query.
+- **State Management:** Manages the user's search query, collection selection, and the `expandedCardId` for modal views.
+- **Search Logic:** Calls the `useSearch` hook, passing the filtered dataset and the current query.
+- **Collections:** Uses the `useCollections` hook to create, store, and filter collections via `localStorage`.
 - **Prop Drilling:** Passes the final search results and state handlers down to the presentational `<Home />` component.
 
 ---
 
 ## 2. Layout & Background Effects (2025 Matrix Update)
 
 - **`Layout.tsx`:** Main application layout wrapper that includes the new Matrix Rain background
 - **`MatrixRain.tsx`:** Canvas-based Matrix digital rain effect with authentic movie-style characteristics:
   - **Authentic Characters:** Uses Japanese Katakana and binary characters for true Matrix aesthetic
   - **True Randomness:** Every character is randomly generated each frame (not predetermined sequences)
   - **Movie-Accurate Effects:** Bright leading characters (`#c8ffc8`) with trailing characters (`#70ab6c`)
   - **Performance Optimized:** 30fps animation with efficient Canvas rendering
   - **Responsive Design:** Auto-calculates column count based on screen width
   - **Progressive Fade:** Dual-layer rendering with optimized fade opacity to prevent background pollution
   - **Hardware Accelerated:** Uses `will-change: transform` for smooth GPU rendering
   - **Proper Cleanup:** Handles window resize events and component unmounting correctly
 
 ---
 
-## 3. Custom Hooks: useSearch, useEnrichedData, useImageFallback
+## 3. Custom Hooks: useSearch, useEnrichedData, useImageFallback, useCollections
 
 - **`useSearch.ts`:**
   - Receives the complete array of data and the search query.
   - Uses a preprocessor to create a `searchBlob` for each record (combining all searchable fields).
   - Builds a FlexSearch index in-browser, memoized for performance.
   - Returns a filtered array of results for the UI.
 - **`useEnrichedData.ts`:**
   - Fetches and manages the enriched data from the API endpoint, with robust error handling and loading state.
 - **`useImageFallback.ts`:**
   - Manages image loading, error fallback, and status for entity images, providing a robust fallback for missing or broken images.
+- **`useCollections.ts`:**
+  - Stores user-defined collections in `localStorage`.
+  - Provides create, add/remove card, and filtering utilities for the app.
 
 ---
 
 ## 4. Presentational Layer (Home.tsx)
 
 - Purely presentational; receives all data and handlers as props from `HomeContainer`.
 - Renders the main layout, including the `SearchBar` and the `EntityGrid`.
 - **Matrix Integration:** Background remains transparent to allow Matrix rain to show through card gaps
 
 ---
 
 ## 5. Enhanced Search Bar (SearchBar.tsx) - 2025 Update
 
 - **Terminal Aesthetic:** Provides an authentic CRT terminal experience with custom Glass_TTY_VT220 font
 - **Typography:** Uses 28px font size for enhanced readability with reduced padding (`py-2`) for compact appearance
 - **Custom Cursor:** Features a blinking green block cursor positioned 4px after text for authentic terminal feel
 - **CRT Effects:** Includes comprehensive CRT styling with:
   - **Phosphor Persistence:** Characters briefly flash brighter green (#a8e6a8) when typed, fading smoothly to standard color
   - **Cursor Wake-Up:** 100ms elastic scale animation when input is first focused
   - **Scan Lines:** Subtle horizontal scan lines that drift upward
   - **Glow Effects:** Text and border glow effects for authentic CRT appearance
 - **User Experience Enhancements:**
   - **Disabled Spell Check:** `spellCheck={false}` prevents browser underlining on character names
   - **Custom Text Selection:** CRT green background with black text instead of default blue highlighting
   - **Removed Clear Button:** Cleaner interface without X/clear button for authentic terminal appearance
diff --git a/src/components/Collections/AddToCollectionPopover.tsx b/src/components/Collections/AddToCollectionPopover.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..f909abc51d44280f92896e65096202a2be9b16b2
--- /dev/null
+++ b/src/components/Collections/AddToCollectionPopover.tsx
@@ -0,0 +1,40 @@
+import React from 'react';
+import type { Collection } from '../../types/domainTypes';
+
+interface Props {
+  collections: Collection[];
+  cardId: string;
+  addCard: (collectionId: string, cardId: string) => void;
+  removeCard: (collectionId: string, cardId: string) => void;
+  onCreateNew: () => void;
+}
+
+export default function AddToCollectionPopover({ collections, cardId, addCard, removeCard, onCreateNew }: Props) {
+  return (
+    <div 
+      className="absolute top-10 right-2 w-48 bg-black/80 backdrop-blur-sm border border-[#70ab6c]/20 rounded shadow-lg p-2 z-20 text-sm text-[#c8ffc8] crt-screen"
+      onClick={(e) => e.stopPropagation()}
+    >
+      <button type="button" className="w-full text-left p-1 rounded hover:bg-[#70ab6c]/20" onClick={onCreateNew}>
+        + Create new collection
+      </button>
+      <hr className="border-t border-[#70ab6c]/20 my-1"/>
+      <ul>
+        {collections.map(col => {
+          const checked = col.cardIds.includes(cardId);
+          return (
+            <li key={col.id} className="flex items-center gap-2 p-1 rounded hover:bg-[#70ab6c]/20 cursor-pointer" onClick={() => checked ? removeCard(col.id, cardId) : addCard(col.id, cardId)}>
+              <input
+                type="checkbox"
+                readOnly
+                checked={checked}
+                className="pointer-events-none"
+              />
+              <span>{col.name}</span>
+            </li>
+          );
+        })}
+      </ul>
+    </div>
+  );
+}
diff --git a/src/components/Collections/CollectionCardButton.tsx b/src/components/Collections/CollectionCardButton.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..0827002a1a90464397ad1140fa2fa4ed0b10b164
--- /dev/null
+++ b/src/components/Collections/CollectionCardButton.tsx
@@ -0,0 +1,24 @@
+import React from 'react';
+
+interface Props {
+  isInCollection: boolean;
+  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
+}
+
+export default function CollectionCardButton({ isInCollection, onClick }: Props) {
+  const baseClasses = 'absolute top-2 right-2 flex items-center justify-center w-6 h-6 bg-black/40 backdrop-blur-sm border border-[#70ab6c]/20 rounded-full transition-all';
+  const hoverClasses = 'hover:text-[#c8ffc8] hover:shadow-[0_0_15px_rgba(112,171,108,0.4)]';
+  const activeClasses = 'text-[#c8ffc8] shadow-[0_0_15px_rgba(112,171,108,0.4)]';
+  const inactiveClasses = 'text-[#70ab6c] shadow-[0_0_10px_rgba(112,171,108,0.2)]';
+
+  return (
+    <button
+      type="button"
+      aria-label={isInCollection ? 'Manage in collections' : 'Add to collection'}
+      onClick={onClick}
+      className={`${baseClasses} ${hoverClasses} ${isInCollection ? activeClasses : inactiveClasses}`}
+    >
+      {isInCollection ? '✓' : '+'}
+    </button>
+  );
+}
diff --git a/src/components/Collections/CollectionsSidebar.tsx b/src/components/Collections/CollectionsSidebar.tsx
new file mode 100644
index 0000000000000000000000000000000000000000..f5745b6f8b1bda42380fc99d218b7eb1ab9e1acd
--- /dev/null
+++ b/src/components/Collections/CollectionsSidebar.tsx
@@ -0,0 +1,55 @@
+import React, { useState } from 'react';
+import type { Collection } from '../../types/domainTypes';
+
+interface Props {
+  collections: Collection[];
+  activeId: string | null;
+  onActivate: (id: string | null) => void;
+  createCollection: (name: string) => void;
+}
+
+export default function CollectionsSidebar({ collections, activeId, onActivate, createCollection }: Props) {
+  const [newName, setNewName] = useState('');
+
+  return (
+    <aside className="p-6 w-72 sticky top-20 space-y-4 text-sm bg-black/80 backdrop-blur-sm border-r border-[#70ab6c]/20 min-h-[calc(100vh-5rem)] crt-screen z-10">
+      <h3 className="font-bold text-base mb-4 text-[#c8ffc8] crt-glow-text">Collections</h3>
+      <button
+        type="button"
+        className={`block text-left w-full px-3 py-2 rounded text-[#c8ffc8] transition-colors ${activeId === null ? 'bg-[#70ab6c]/20 font-bold' : 'hover:bg-[#70ab6c]/10'}`}
+        onClick={() => onActivate(null)}
+      >
+        All Items
+      </button>
+      <ul className="space-y-1">
+        {collections.map(col => (
+          <li key={col.id}>
+            <button
+              type="button"
+              className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 text-[#c8ffc8] transition-colors ${activeId === col.id ? 'bg-[#70ab6c]/20 font-bold' : 'hover:bg-[#70ab6c]/10'}`}
+              onClick={() => onActivate(activeId === col.id ? null : col.id)}
+            >
+              <span className="flex-1">{col.name}</span>
+              <span className="text-xs text-[#70ab6c]">{col.cardIds.length}</span>
+            </button>
+          </li>
+        ))}
+      </ul>
+      <form
+        onSubmit={(e) => { e.preventDefault(); if (newName.trim()) { createCollection(newName.trim()); setNewName(''); } }}
+        className="pt-4 space-y-2 border-t border-[#70ab6c]/20"
+      >
+        <input
+          type="text"
+          value={newName}
+          onChange={e => setNewName(e.target.value)}
+          placeholder="New collection name..."
+          className="w-full rounded bg-black/60 text-[#c8ffc8] px-3 py-2 border border-[#70ab6c]/30 focus:border-[#c8ffc8] focus:shadow-[0_0_10px_rgba(200,255,200,0.2)] outline-none placeholder-[#70ab6c]/50"
+        />
+        <button type="submit" className="w-full bg-[#70ab6c]/20 hover:bg-[#70ab6c]/30 rounded py-2 text-[#c8ffc8] font-bold transition-colors">
+          Add Collection
+        </button>
+      </form>
+    </aside>
+  );
+}
diff --git a/src/components/EntityGrid/EntityGrid.tsx b/src/components/EntityGrid/EntityGrid.tsx
index 41f0d6224e34a2323d17ad1b1b36ba36fc846b8d..67b7aaaa926e3a4da3e8d54fc902d246c00a3ecc 100644
--- a/src/components/EntityGrid/EntityGrid.tsx
+++ b/src/components/EntityGrid/EntityGrid.tsx
@@ -1,26 +1,28 @@
 // CARD SIZE POLICY: The width of each card in the grid is controlled by the Tailwind class `w-[188px]` applied to the card container div below. To change card size globally, update this value here. All internal content in ItemCard is sized relative to this width for visual consistency.
 import React from 'react';
 import ItemCard from '../ItemCard/ItemCard';
 import type { GridItem } from '../../types/grid';
 
 interface EntityGridProps {
   items: GridItem[];
   expandedCardId: string | null; // <-- Add prop
   onCardExpand: (cardId: string) => void; // <-- Add prop
+  collectionsApi: import('../../hooks/useCollections').UseCollectionsReturn;
 }
 
-export default function EntityGrid({ items, expandedCardId, onCardExpand }: EntityGridProps) {
+export default function EntityGrid({ items, expandedCardId, onCardExpand, collectionsApi }: EntityGridProps) {
   return (
     <div className="flex flex-wrap justify-center gap-4 bg-transparent">
       {items.map((gridItem) => (
         <ItemCard
           key={gridItem.record.id}
           item={gridItem.record}
           matchedFields={gridItem.matchedFields}
           expanded={gridItem.record.id === expandedCardId}
           onExpand={() => onCardExpand(gridItem.record.id)}
+          collectionsApi={collectionsApi}
         />
       ))}
     </div>
   );
 }
diff --git a/src/components/ItemCard/ItemCard.tsx b/src/components/ItemCard/ItemCard.tsx
index 15ea55b7e98f925b56a1f5e5137e532b951fab30..a064fe36c362977a848c90d472dde738a97680d5 100644
--- a/src/components/ItemCard/ItemCard.tsx
+++ b/src/components/ItemCard/ItemCard.tsx
@@ -1,24 +1,25 @@
 import React from 'react';
 import type { EnrichedEntity } from '../../search/types';
 import ItemCardCollapsed from './ItemCardCollapsed';
 import ItemCardModal from './ItemCardModal';
 
 interface MatchedField {
   field: string;
   token: string;
 }
 
 interface ItemCardProps {
   item: EnrichedEntity;
   expanded: boolean;
   onExpand: () => void;
   matchedFields?: MatchedField[];
+  collectionsApi: import('../../hooks/useCollections').UseCollectionsReturn;
 }
 
-export default function ItemCard({ item, expanded, onExpand, matchedFields }: ItemCardProps) {
+export default function ItemCard({ item, expanded, onExpand, matchedFields, collectionsApi }: ItemCardProps) {
   return expanded ? (
     <ItemCardModal item={item} onClose={onExpand} />
   ) : (
-    <ItemCardCollapsed item={item} matchedFields={matchedFields} onExpand={onExpand} />
+    <ItemCardCollapsed item={item} matchedFields={matchedFields} onExpand={onExpand} collectionsApi={collectionsApi} />
   );
 }
diff --git a/src/components/ItemCard/ItemCardCollapsed.tsx b/src/components/ItemCard/ItemCardCollapsed.tsx
index b725a94d76b07fd7bc7780dd11b7d6a9047ee56e..f634509e3da3a82a6b28f1e7ecf53c25ab9e1395 100644
--- a/src/components/ItemCard/ItemCardCollapsed.tsx
+++ b/src/components/ItemCard/ItemCardCollapsed.tsx
@@ -1,94 +1,118 @@
-import React, { useEffect } from 'react';
+import React, { useEffect, useState } from 'react';
 import type { EnrichedEntity } from '../../search/types';
 import ThemedCard from '../ThemedCard/ThemedCard';
 import NationIcon from '../NationIcon/NationIcon';
 import { toTitleCase, getInitials } from '../../utils/stringUtils';
 import { useImageFallback } from '../../hooks/useImageFallback';
 import { fallbackImages, universalFallback } from './imageFallbacks';
 import { getField } from '../../utils/data';
+import CollectionCardButton from '../Collections/CollectionCardButton';
+import AddToCollectionPopover from '../Collections/AddToCollectionPopover';
+import type { UseCollectionsReturn } from '../../hooks/useCollections';
 
 interface MatchedField {
   field: string;
   token: string;
 }
 
-interface ItemCardCollapsedProps {
-  item: EnrichedEntity;
-  onExpand: () => void;
-  matchedFields?: MatchedField[];
-}
-
-
+// existing helper functions remain unchanged
 function getBadge(item: EnrichedEntity): string | undefined {
-  // Prefer top-level role, then metadata.badge, then metadata.role
   const tryGet = (val: unknown): string | undefined => {
     if (typeof val === 'string' && val.trim()) return val;
     if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') return val[0];
     return undefined;
   };
   if (tryGet(item.role)) return tryGet(item.role);
   if (item.metadata) {
     if (tryGet(item.metadata.badge)) return tryGet(item.metadata.badge);
     if (tryGet(item.metadata.role)) return tryGet(item.metadata.role);
   }
   return undefined;
 }
 
 function formatFieldName(field: string) {
   if (field === 'global') return 'Content';
   return toTitleCase(field.replace('metadata.', ''));
 }
 
-export default function ItemCardCollapsed({ item, onExpand, matchedFields }: ItemCardCollapsedProps) {
-  const iconText = (item.name && typeof item.name === 'string') ? getInitials(item.name) : '';
+interface ItemCardCollapsedProps {
+  item: EnrichedEntity;
+  onExpand: () => void;
+  matchedFields?: MatchedField[];
+  collectionsApi: UseCollectionsReturn;
+}
+
+export default function ItemCardCollapsed({ item, onExpand, matchedFields, collectionsApi }: ItemCardCollapsedProps) {
+  const iconText = item.name && typeof item.name === 'string' ? getInitials(item.name) : '';
   const badge = getBadge(item);
   const nation = getField(item, 'nation');
   const slug = getField(item, 'slug');
   const image = getField(item, 'image');
   const slugKey = (slug || item.id) as string;
   const { imgSrc, status, handleImageError, handleImageLoad, setImgSrc } = useImageFallback(slugKey, {
     [slugKey]: fallbackImages[slugKey] || fallbackImages[item.id] || universalFallback,
   });
+  const [showPopover, setShowPopover] = useState(false);
 
   useEffect(() => {
     if (image) {
       setImgSrc(`/assets/images/${image}`);
     }
   }, [image, setImgSrc]);
 
   return (
     <div
       onClick={onExpand}
       role="button"
       tabIndex={0}
       aria-label={`Expand details for ${item.name}`}
       onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onExpand(); }}
       className="cursor-pointer w-[113px]"
     >
       <ThemedCard nation={nation}>
-        <div className="pb-1.5 pt-2 flex flex-col min-h-[144px] crt-screen">
+        <div className="pb-1.5 pt-2 flex flex-col min-h-[144px] crt-screen relative">
+          <CollectionCardButton
+            isInCollection={collectionsApi.isCardInAnyCollection(item.id)}
+            onClick={(e) => {
+              e.stopPropagation();
+              setShowPopover(prev => !prev);
+            }}
+          />
+          {showPopover && (
+            <AddToCollectionPopover
+              cardId={item.id}
+              collections={collectionsApi.collections}
+              addCard={collectionsApi.addCardToCollection}
+              removeCard={collectionsApi.removeCardFromCollection}
+              onCreateNew={() => {
+                const newName = prompt('Enter new collection name:');
+                if (newName) collectionsApi.createCollection(newName, item.id);
+                setShowPopover(false);
+              }}
+            />
+          )}
           <div className="mb-1.5 flex justify-center w-full px-1.5">
             <div className="w-full aspect-square max-w-[85%] max-h-[65%] mx-auto bg-transparent rounded-xl flex items-center justify-center border border-subtle/20 overflow-hidden shadow-lg">
               {status === 'error' || !imgSrc ? (
                 <span className="font-bold text-subtle text-[18px] bg-black/30 rounded-lg px-2 py-1 backdrop-blur-sm">
                   {iconText}
                 </span>
               ) : (
                 <img
                   src={imgSrc}
                   alt={item.name}
                   className="w-full h-full rounded-xl object-cover border-none"
                   draggable={false}
                   onError={handleImageError}
                   onLoad={handleImageLoad}
                 />
               )}
             </div>
           </div>
           {badge && (
             <div className="flex justify-center -mt-3.5 z-10">
               <div className="bg-neutral-900/80 backdrop-blur-sm rounded flex items-center justify-center text-center p-1.5 border border-white/20 shadow-lg">
                 <span className="text-white text-[12px] font-bold leading-none">
                   {badge}
                 </span>
               </div>
@@ -103,26 +127,26 @@ export default function ItemCardCollapsed({ item, onExpand, matchedFields }: Ite
                 >
                   Matched: {formatFieldName(match.field)}
                 </span>
               ))}
             </div>
           )}
           <div className="w-full mt-auto px-1.5 pt-2.5">
             <div className="flex items-center justify-start gap-1">
               <h3 className="font-bold text-sm text-white leading-tight overflow-hidden text-ellipsis flex-1 min-w-0">
                 {toTitleCase(item.name)}
               </h3>
               {nation && (
                 <NationIcon
                   nation={nation}
                   size={8}
                   className="align-middle flex-shrink-0"
                 />
               )}
             </div>
             <p className="text-[12px] text-neutral-400 font-bold mt-1">Character</p>
           </div>
         </div>
       </ThemedCard>
     </div>
   );
-} 
\ No newline at end of file
+}
diff --git a/src/hooks/useCollections.ts b/src/hooks/useCollections.ts
new file mode 100644
index 0000000000000000000000000000000000000000..8178c46f7edb59aebeffee49932846bd58cf9556
--- /dev/null
+++ b/src/hooks/useCollections.ts
@@ -0,0 +1,69 @@
+import { useState, useEffect, useCallback } from 'react';
+import type { Collection } from '../types/domainTypes';
+
+const STORAGE_KEY = 'austros-atla-collections';
+
+export interface UseCollectionsReturn {
+  collections: Collection[];
+  getCollectionsForCard: (cardId: string) => Collection[];
+  isCardInAnyCollection: (cardId: string) => boolean;
+  createCollection: (name: string, initialCardId?: string) => void;
+  addCardToCollection: (collectionId: string, cardId: string) => void;
+  removeCardFromCollection: (collectionId: string, cardId: string) => void;
+}
+
+export function useCollections(): UseCollectionsReturn {
+  const [collections, setCollections] = useState<Collection[]>([]);
+
+  useEffect(() => {
+    try {
+      const raw = localStorage.getItem(STORAGE_KEY);
+      if (raw) setCollections(JSON.parse(raw));
+    } catch (err) { console.error('Failed to load collections', err); }
+  }, []);
+
+  const persist = useCallback((cols: Collection[]) => {
+    setCollections(cols);
+    try {
+      localStorage.setItem(STORAGE_KEY, JSON.stringify(cols));
+    } catch (err) { console.error('Failed to save collections', err); }
+  }, []);
+
+  const createCollection = useCallback((name: string, initialCardId?: string) => {
+    const trimmed = name.trim();
+    if (!trimmed || collections.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) return;
+    const newCol: Collection = {
+      id: `c${Date.now().toString(36)}`,
+      name: trimmed,
+      createdAt: new Date().toISOString(),
+      cardIds: initialCardId ? [initialCardId] : [],
+    };
+    persist([...collections, newCol]);
+  }, [collections, persist]);
+
+  const addCardToCollection = useCallback((collectionId: string, cardId: string) => {
+    const updated = collections.map(c => 
+      c.id === collectionId && !c.cardIds.includes(cardId) 
+        ? { ...c, cardIds: [...c.cardIds, cardId] } 
+        : c
+    );
+    persist(updated);
+  }, [collections, persist]);
+
+  const removeCardFromCollection = useCallback((collectionId: string, cardId: string) => {
+    const updated = collections.map(c => 
+      c.id === collectionId 
+        ? { ...c, cardIds: c.cardIds.filter(cid => cid !== cardId) } 
+        : c
+    );
+    persist(updated);
+  }, [collections, persist]);
+  
+  const getCollectionsForCard = useCallback((cardId: string) => 
+    collections.filter(c => c.cardIds.includes(cardId)), [collections]);
+
+  const isCardInAnyCollection = useCallback((cardId: string) => 
+    collections.some(c => c.cardIds.includes(cardId)), [collections]);
+
+  return { collections, createCollection, addCardToCollection, removeCardFromCollection, getCollectionsForCard, isCardInAnyCollection };
+}
diff --git a/src/pages/Home.tsx b/src/pages/Home.tsx
index a5e111bd7af390b989c101402f336f4f4b12046f..030da496bee5ce16454502ea57a98099ab93bd98 100644
--- a/src/pages/Home.tsx
+++ b/src/pages/Home.tsx
@@ -1,55 +1,63 @@
-// Home: Presentational/stateless component for Home page. Receives all data/handlers as props from HomeContainer.
 import React from 'react';
-// import Navbar from '../components/Navbar';
 import SearchBar from '../components/SearchBar';
 import EntityGrid from '../components/EntityGrid/EntityGrid';
 import Layout from '../components/Layout';
+import CollectionsSidebar from '../components/Collections/CollectionsSidebar';
 import type { MatchResult, EnrichedEntity } from '../search/types';
-// import type { EnrichedCharacter } from '../types/domainTypes';
-
 import type { GridItem } from '../types/grid';
+import type { UseCollectionsReturn } from '../hooks/useCollections';
 
 interface HomeProps {
   searchResults: Array<{ entity: EnrichedEntity; matchedFields: MatchResult['matchedFields'] }>;
   loading: boolean;
   query: string;
   handleSearchChange: (query: string) => void;
-  expandedCardId: string | null; // <-- Add prop
-  onCardExpand: (cardId: string) => void; // <-- Add prop
+  expandedCardId: string | null;
+  onCardExpand: (cardId: string) => void;
+  collectionsApi: UseCollectionsReturn;
+  activeCollectionId: string | null;
+  setActiveCollectionId: (id: string | null) => void;
 }
 
 export function Home({
   searchResults,
   loading,
   query,
   handleSearchChange,
-  expandedCardId, // <-- Destructure prop
-  onCardExpand, // <-- Destructure prop
+  expandedCardId,
+  onCardExpand,
+  collectionsApi,
+  activeCollectionId,
+  setActiveCollectionId,
 }: HomeProps) {
-  // --- CORRECTED ADAPTER ---
-  const gridItems: GridItem[] = searchResults.map((result) => ({
+  const gridItems: GridItem[] = searchResults.map(result => ({
     record: result.entity,
     matchedFields: result.matchedFields,
   }));
-  // --- END ADAPTER ---
-
 
   return (
     <Layout>
-      {/* <Navbar /> */}
-      <div className="flex flex-col items-center w-full pt-32">
-        <SearchBar value={query} onChange={handleSearchChange} />
-        {loading ? (
-          <div className="mt-8 text-neutral-400">Loading...</div>
-        ) : (
-          <EntityGrid
-            items={gridItems}
-            expandedCardId={expandedCardId}
-            onCardExpand={onCardExpand}
-          />
-        )}
+      <div className="flex w-full pt-32 min-h-screen bg-transparent">
+        <CollectionsSidebar
+          collections={collectionsApi.collections}
+          activeId={activeCollectionId}
+          onActivate={setActiveCollectionId}
+          createCollection={collectionsApi.createCollection}
+        />
+        <div className="flex-1 flex flex-col items-center">
+          <SearchBar value={query} onChange={handleSearchChange} />
+          {loading ? (
+            <div className="mt-8 text-neutral-400">Loading...</div>
+          ) : (
+            <EntityGrid
+              items={gridItems}
+              expandedCardId={expandedCardId}
+              onCardExpand={onCardExpand}
+              collectionsApi={collectionsApi}
+            />
+          )}
+        </div>
       </div>
     </Layout>
   );
 }
-
diff --git a/src/pages/HomeContainer.tsx b/src/pages/HomeContainer.tsx
index aaa728155afd1abf0417996746791979c3fe0217..e5a98076455455b16327cc2e34e731db9fcb29b7 100644
--- a/src/pages/HomeContainer.tsx
+++ b/src/pages/HomeContainer.tsx
@@ -1,28 +1,39 @@
-// src/pages/HomeContainer.tsx
-
 import React, { useState } from 'react';
 import { Home } from './Home';
 import { useSearch } from '../hooks/useSearch';
 import { useEnrichedData } from '../hooks/useEnrichedData';
 import { useCardExpansion } from '../hooks/useCardExpansion';
+import { useCollections } from '../hooks/useCollections';
 
 export function HomeContainer() {
   const { data: allEntities, loading } = useEnrichedData();
   const [query, setQuery] = useState('');
   const { expandedId, toggle } = useCardExpansion();
+  const collectionsApi = useCollections();
+  const [activeCollectionId, setActiveCollectionId] = useState<string | null>(null);
+
+  let displayItems = allEntities;
+  if (activeCollectionId) {
+    const activeCollection = collectionsApi.collections.find(c => c.id === activeCollectionId);
+    const idSet = new Set(activeCollection?.cardIds || []);
+    displayItems = allEntities.filter(item => idSet.has(item.id));
+  }
 
-  const results = useSearch(allEntities, query);
+  const searchResults = useSearch(displayItems, query);
 
   return (
     <Home
-      searchResults={results}
+      searchResults={searchResults}
       loading={loading}
       query={query}
       handleSearchChange={setQuery}
       expandedCardId={expandedId}
       onCardExpand={toggle}
+      collectionsApi={collectionsApi}
+      activeCollectionId={activeCollectionId}
+      setActiveCollectionId={setActiveCollectionId}
     />
   );
 }
 
-export default HomeContainer; 
\ No newline at end of file
+export default HomeContainer;
diff --git a/src/types/domainTypes.ts b/src/types/domainTypes.ts
index fb07057917dc9d51a0ffc53e0f8313da24ecb31a..fee14234db896e1401a9d15a2b629db31309e8b3 100644
--- a/src/types/domainTypes.ts
+++ b/src/types/domainTypes.ts
@@ -128,32 +128,41 @@ export type EnrichedFood = {
   relations?: string[];
 };
 
 export type EnrichedLocation = {
   __type: 'location';
   id: string;
   name: string;
   description: string;
   slug: string;
   synonyms?: string[];
   tags?: string[];
   relations?: string[];
 };
 
 export type EnrichedSpiritWorld = {
   __type: 'spirit-world';
   id: string;
   name: string;
   description: string;
   slug: string;
   synonyms?: string[];
   tags?: string[];
   relations?: string[];
 };
 
+export interface Collection {
+  id: string;
+  name: string;
+  description?: string;
+  icon?: string; // Matrix-theme compatible icon/emoji
+  createdAt: string; // ISO 8601 string
+  cardIds: string[];
+}
+
 export type EnrichedRecord =
   | EnrichedBending
   | EnrichedCharacter
   | EnrichedFauna
   | EnrichedFood
   | EnrichedLocation
   | EnrichedSpiritWorld;
 
EOF
)