# 🩺 Troubleshooting Guide & Lessons Learned

This guide provides a systematic way to debug data-related issues, particularly those where search results are incorrect or character cards are not displaying properly.

---

### **Lesson 1: The Golden Rule of Debugging**

The single most important principle is to **follow the data**. The UI can only display the data it receives. If the UI is wrong, the data it's receiving is almost certainly wrong.

---

### **Problem: The UI shows blank cards or is missing data.**

This means the `ItemCard` component is not receiving the expected data (e.g., `item.name`, `item.image`).

**Diagnostic Steps:**

1.  **Start at the End:** Open the final data file the app uses: **`public/enriched-data.json`**.
2.  **Verify the Data:** Search for a character that is failing (e.g., "azula"). Look at their record.
    *   **Is the field present?** Does the `azula` object have a top-level `"role"` field? Does it have an `"image"` field?
    *   **If YES:** The pipeline is correct. The problem is in the frontend mapping/prop-drilling.
    *   **If NO:** The pipeline is broken. The problem is in `scripts/1-parse-markdown.mjs` or `scripts/2-enrich-data.mjs`. The enrichment script is likely not "promoting" the UI fields to the top level.

3.  **Debug the Frontend:** If the data in `enriched-data.json` looks correct, add a `console.log` right before the data is passed to the component that's failing.
    *   **Example:** In `Home.tsx`, log the `gridItems` prop being passed to `EntityGrid`.
    ```javascript
    console.log('Data being passed to EntityGrid:', gridItems);
    return <EntityGrid items={gridItems} />;
    ```
    *   Inspect the object in the browser console. This will reveal if the data structure is being unintentionally changed by an adapter or mapping function.

---

### **Problem: Search results are missing (e.g., "princess" doesn't find Azula).**

This means the term is not included in the searchable fields (`name`, `searchBlob`) when the client-side index is built.

**Diagnostic Steps:**

1.  **Check the Preprocessor:** The most likely culprit is the `createSearchBlob` function in **`src/search/preprocessor.ts`**.
    *   Open the file and look at the `textParts` array.
    *   Ensure the field that contains your search term (e.g., `record.role`, `record.titles`) is being included in this array.
    *   If it's missing, add it.

2.  **Add a `console.log` in the Preprocessor:** To be 100% certain, temporarily modify `src/search/preprocessor.ts` to log the blob for a specific character.
    ```javascript
    function createSearchBlob(record) {
      // ...
      const blob = uniqueParts.join(' ').toLowerCase();
      if (record.id === 'azula') {
        console.log("Azula's Search Blob:", blob);
      }
      return blob;
    }
    ```
3.  Refresh the app and check the browser console. Does the logged blob contain the missing search term?
    *   **If YES:** The blob is correct, and the issue might be with the FlexSearch configuration in `useSearch.ts`.
    *   **If NO:** The field is not being correctly passed into the preprocessor. Check the `enriched-data.json` file to ensure the field exists on the record in the first place.

---

### **Lesson 2: The "Rules of Hooks" Error**

- **Error Message:** `Rendered more hooks than during the previous render.`
- **Cause:** This happens when you call a React Hook (like `useMemo` or `useState`) inside a conditional `if` statement. The number of hooks called must be identical on every single render.
- **Solution:** Always call all hooks at the top level of your component or custom hook. Use normal `if/else` statements *after* all hooks have been called to decide what to do with their results.

---

### **Lesson 3: The Empty Index File (`search-index.json`) Trap**

- **The Old Architecture:** We previously tried to build a FlexSearch index during the build process (`npm run build:data`) and save it to `public/search-index.json`.
- **The Problem:** This process failed silently, producing an empty `index` object. This is extremely difficult to debug, as the file exists but is useless.
- **The Solution (Current Architecture):** We abandoned the pre-built index entirely. The app now loads the complete `enriched-data.json` and builds the index on the client side. This is more robust and transparent. **Do not revert to using a pre-built index.**

---

### Lesson 4: Card Expansion and Modal Layout Issues

**Problem:** Cards don't expand when clicked, or they remain stuck in an expanded/collapsed state.

- **Cause:** The state for tracking the expanded card (`expandedCardId`) is not being managed or passed down correctly.
- **Solution:** State must be managed in a parent component (like `HomeContainer.tsx`). The ID of the expanded card and a handler function (`onCardExpand`) must be passed down through the component tree (`Home` → `EntityGrid` → `ItemCard`). The `ItemCard` then uses these props to determine if it should render its expanded view.

**Problem:** The expanded card is enormous and breaks the page layout, forcing the user to zoom out.

- **Cause:** The expanded card's container has no size constraints, so it grows to the full size of its content (especially the image).
- **Solution:** The expanded view must be rendered inside a modal overlay. In `ItemCard.tsx`, this is a `div` with `position: fixed`. The content wrapper inside the modal must have `max-width` and `max-height` (e.g., `max-w-2xl`, `max-h-[90vh]`) and `overflow-y-auto` to ensure it fits on any screen and becomes scrollable when necessary.

**Problem:** Clicking anywhere in the modal closes it.

- **Cause:** The click event on the card content is "bubbling up" to the modal overlay's close handler.
- **Solution:** The main content wrapper `div` inside the modal needs the `onClick={(e) => e.stopPropagation()}` event handler. This stops the event from propagating and allows users to interact with the card's content without closing it.