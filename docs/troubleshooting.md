# 🩺 Troubleshooting Guide (2024 Refactor)

---

## 🚨 Non-Negotiable Tag Rule

**All tags in markdown files must be single, underscore-joined words.**
- No spaces, slashes, or multi-word phrases are allowed in any tag.
- Spaces and slashes are replaced with underscores (e.g., `water nation` → `water_nation`).
- All tags are lowercased (e.g., `Firebender` → `firebender`).
- This rule applies to all present and future markdown files.
- The enrichment/data pipeline will enforce this and strip or reject any non-compliant tags.
- **Example:**
  - Valid: `water_nation`, `firebender`, `main_villain`
  - Invalid: `water nation`, `main villain`, `main/villain`, `Main Villain`

---

## [2025-07-17] Character Badge/Role Not Displaying

**Symptom:**
Some character cards (e.g., Yagoda, Yu, Lo and Li) do not display their badge/role in the UI, even though the badge/role is present in the markdown or enriched data.

**Root Cause:**
The badge/role field may be stored in different locations in the enriched data depending on the data pipeline version or markdown structure:
- As a top-level `role` field
- As `metadata.badge`
- As `metadata.role`

The frontend previously only checked one location, so badges could be missing if the field was elsewhere.

**Solution:**
The badge extraction logic in the card component (`ItemCardCollapsed.tsx`) was updated to:
- Prefer `item.role` if present and non-empty
- Otherwise, use `item.metadata.badge` if present and non-empty
- Otherwise, use `item.metadata.role` if present and non-empty
- Handles both string and string[] values for robustness

**Implementation Example:**
```ts
function getBadge(item: EnrichedEntity): string | undefined {
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
```

**Impact:**
- All character cards now reliably display their badge/role, regardless of where the field is stored in the data.
- The UI is robust to future data pipeline changes regarding badge/role placement.

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

## 2a. Quick Script: Find Empty or Corrupted Markdown Files

If you suspect some character markdown files are corrupted, empty, or missing required content, you can use this PowerShell script to quickly identify them:

```powershell
Get-ChildItem raw-data/characters/*.md | % {
  $lines = (Get-Content $_.FullName).Count
  if ($lines -lt 20) { Write-Host "$($_.Name): $lines lines" }
}
```

**How to use:**
1. Open PowerShell in your project root.
2. Paste and run the script above.
3. Any file with a suspiciously low line count (e.g., 1 line) will be printed. These are likely empty or corrupted.

**What to do if files are flagged:**
- Open each flagged file in your editor.
- Re-create or restore it using the canonical template in `docs/templates/character_template.md` and reference other well-formed character files.
- After fixing, re-run your data pipeline (`npm run build:data`).

**Why this works:**
- Most valid character files are 100+ lines. Any file with <20 lines is almost certainly missing required sections or is empty due to a previous error.

**Tip:**
- Use this script any time you suspect silent data issues or after a batch edit to catch accidental file corruption.

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