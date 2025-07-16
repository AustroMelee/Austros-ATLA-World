# 🩺 Troubleshooting Guide (2024 Refactor)

This guide provides a systematic way to debug data and search issues in the new client-side architecture.

---

## 1. The Golden Rule: Follow the Data

- The UI can only display the data it receives. If the UI is wrong, the data it's receiving is almost certainly wrong.

---

## 2. UI Shows Blank Cards or Missing Data

- The `ItemCard` component is not receiving the expected data (e.g., `item.name`, `item.image`).

**Steps:**
1. Open `public/enriched-data.json`.
2. Search for the failing character (e.g., "azula").
3. Is the field present at the top level (e.g., `role`, `image`)?
   - **YES:** The pipeline is correct. The problem is in the frontend mapping/prop-drilling.
   - **NO:** The pipeline is broken. Check `scripts/1-parse-markdown.mjs` and `scripts/2-enrich-data.mjs`.

---

## 3. Search Results Are Missing

- The term is not included in the searchable fields when the client-side index is built.

**Steps:**
1. Open `src/search/preprocessor.ts` and check the `textParts` array in `createSearchBlob`.
2. Ensure the field containing your search term is included.
3. Add a `console.log` in `preprocessor.ts` to inspect the `searchBlob` for a specific record.
4. If the blob is correct, check that the FlexSearch index in `useSearch.ts` includes the field.

---

## 4. FlexSearch Indexing Issues

- If no results are returned for any query, check that the index is being built correctly in `useSearch.ts`.
- Ensure the correct fields are indexed and that the data passed to FlexSearch matches the expected structure.
- Use `console.log` to debug the index creation and search steps.

---

## 5. Card Expansion or Modal Layout Issues

- If cards don't expand or the modal layout is broken, check that `expandedCardId` state is managed in `HomeContainer.tsx` and passed down through all components.
- Ensure the modal overlay in `ItemCard.tsx` has proper size constraints and event handling.

---

## 6. General Debugging Tips

- Always start by checking the data in `public/enriched-data.json`.
- Use `console.log` liberally in the preprocessor, search hook, and UI components to trace data flow.
- If a field is missing, fix the data pipeline first, then debug the frontend.

---

**Summary:**
- All data and search issues can be traced by following the data from `enriched-data.json` through the preprocessor, search hook, and UI.
- The new architecture is robust and transparent—debugging is straightforward if you follow the data.