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

## 7. Card Image Missing or Card Appears Smaller

- If a character card does not display an image or appears much smaller than others, it is usually because the `image` field is missing from that character's data in `public/enriched-data.json`.

**Steps:**
1. Open `public/enriched-data.json` and search for the character (e.g., "The Boulder").
2. Check if the `image` field is present and points to a valid image file (e.g., `"image": "the-boulder.jpg"`).
3. If missing, open the corresponding markdown file in `raw-data/characters/` (e.g., `boulder.md`).
4. Add or update the `image` field in the main JSON block:
   ```json
   "image": "the-boulder.jpg"
   ```
5. Ensure the image file exists in `public/assets/images/`.
6. Run `npm run build:data` to regenerate `enriched-data.json`.
7. Refresh the app. The card will now display the image and render at the correct size.

---

## 8. Card Not Appearing or Expanded Info Missing: Full Debug Process (Fire Nation Man Case Study)

If a character card is missing entirely, or its expanded info does not show up, follow this end-to-end process:

**1. Discover the Problem**
- Notice a card is missing from the UI, or clicking it shows no expanded info.

**2. Check the Data Pipeline**
- Open `public/enriched-data.json` and search for the character (e.g., "fire-nation-man").
- If the character is missing, the data pipeline did not parse the markdown file.
- If present but fields like `expandedView` are empty, the markdown structure is likely wrong.

**3. Inspect the Markdown File**
- Open the relevant file in `raw-data/characters/` (e.g., `fire nation man.md`).
- Ensure the file follows the canonical structure:
  - YAML frontmatter between `---`
  - UI - CARD VIEW in a ```md ... ``` block
  - UI - EXPANDED VIEW in a ```md ... ``` block (all expanded markdown inside)
  - One or more valid JSON blocks in ```json ... ``` blocks (no extra text inside)
- Common mistakes:
  - JSON block not detected (wrong placement, extra blank lines, or extra text)
  - Expanded view not wrapped in a ```md block
  - Multiple or malformed JSON blocks

**4. Fix the Markdown File**
- Remove any extra blank lines or text between the last `---` and the first code block.
- Ensure all JSON blocks are valid and inside triple backticks with `json`.
- Wrap the entire expanded view markdown in a single ```md ... ``` block after the `## UI - EXPANDED VIEW` header.
- Example:
  ```md
  ## 📖 UI - EXPANDED VIEW
  
  ```md
  ...all expanded markdown...
  ```
  ```

**5. Rebuild the Data**
- Run `npm run build:data` to regenerate `public/enriched-data.json`.
- Check the terminal output for `[SUCCESS] Parsed character: ...` for your character.

**6. Verify the Fix**
- Open `public/enriched-data.json` and confirm the character is present and all fields (including `expandedView`) are populated.
- Refresh the app. The card and expanded info should now display correctly.

**Lessons from Fire Nation Man:**
- The parser is strict: JSON blocks must be valid and markdown blocks must be properly wrapped.
- The expanded view will be empty if not inside a ```md block.
- Always check for invisible characters, blank lines, or misplaced code blocks if the pipeline skips a file.

---

**Summary:**
- All data and search issues can be traced by following the data from `enriched-data.json` through the preprocessor, search hook, and UI.
- The new architecture is robust and transparent—debugging is straightforward if you follow the data.