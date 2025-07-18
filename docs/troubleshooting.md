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

## [2025-01-27] Character Names Being Cut Off in Card Display

**Symptom:**
Character names (e.g., "Headhunter") are being truncated in the card display, showing as "Headhun..." instead of the full name.

**Root Cause:**
The issue was caused by a combination of factors in the `ItemCardCollapsed.tsx` component:
1. **Deprecated line-clamp plugin**: The project was using `@tailwindcss/line-clamp` version 0.4.4, which is deprecated and may not work properly with newer Tailwind versions
2. **Inappropriate text sizing**: The name was using `text-lg` (18px) which was too large for the 113px wide card
3. **Flex layout issues**: The text container couldn't shrink properly due to missing `min-w-0` class
4. **Icon space allocation**: The NationIcon was taking up space in the flex container, leaving insufficient room for longer names

**Solution:**
The following changes were made to fix the issue:

1. **Removed deprecated plugin**: Removed `@tailwindcss/line-clamp` from both `tailwind.config.js` and `package.json`
2. **Updated text display**: Changed from `text-lg line-clamp-2` to `text-sm` with `overflow-hidden text-ellipsis`
3. **Improved flex layout**: Added `flex-1 min-w-0` to the text container to allow proper shrinking
4. **Better overflow handling**: Used `overflow-hidden text-ellipsis` for graceful text truncation

**Implementation:**
```tsx
<h3 className="font-bold text-sm text-white leading-tight overflow-hidden text-ellipsis flex-1 min-w-0">
  {toTitleCase(item.name)}
</h3>
```

**Impact:**
- All character names now display properly without being cut off
- Longer names are gracefully truncated with ellipsis rather than being cut mid-word
- The smaller font size (`text-sm` instead of `text-lg`) provides more space for longer names
- The flex layout ensures proper space allocation between text and icons

---

## [2025-01-27] CRT Effects and Modal Interaction Issues

**Symptom:**
CRT effects (glow, dithering) not appearing, or modal click-to-close not working properly.

**Root Cause:**
The CRT effects rely on custom CSS utilities that may not be generated if Tailwind hasn't been rebuilt, or modal event handlers may have accessibility conflicts.

**Common Issues & Solutions:**

1. **CRT Effects Not Visible:**
   - **Check:** Run `npm run build:tailwind` to regenerate CSS with new utility classes
   - **Verify:** Ensure `custom.css` contains the CRT utility definitions
   - **Browser:** Clear browser cache and hard refresh (Ctrl+F5)
   - **Classes:** Verify components are using the correct class names:
     - `crt-glow-text` for text glow effects
     - `crt-glow-border` for border glow
     - `crt-dither` for container dithering
     - `crt-text-dither` for text dithering

2. **Search Bar Styling Issues:**
   - **Font:** Ensure Glass_TTY_VT220.ttf font is properly loaded in `custom.css`
   - **Text Size:** Search bar uses 28px font size with `py-2` padding for compact appearance
   - **Block Cursor:** Custom cursor should have 4px spacing from text end
   - **Spell Check:** `spellCheck={false}` should prevent browser underlining
   - **Text Selection:** Should use CRT green background with black text, not default blue
   - **Check:** Verify all CRT classes are applied: `crt-glow-border crt-dither crt-glow-text crt-text-dither`

3. **Scrollbars Not Themed:**
   - **Browser Support:** CRT scrollbar styling only works in Webkit browsers (Chrome, Safari, Edge)
   - **Firefox:** Will use default scrollbars (expected behavior)
   - **Check:** Ensure CSS variables `--crt-green` and `--crt-green-glow` are defined

4. **Modal Click-to-Close Issues:**
   - **Symptom:** Clicking outside modal doesn't close it
   - **Check:** Ensure the invisible overlay button is properly positioned with `absolute inset-0`
   - **Events:** Verify event propagation is stopped on content clicks
   - **Accessibility:** Confirm keyboard navigation (Escape key) still works

5. **Nation-Colored Titles Not Appearing:**
   - **Check:** Verify `nationThemeMap` import in `ItemCardModal.tsx`
   - **Data:** Ensure character data includes proper `nation` field
   - **Fallback:** Should default to gray color if nation is undefined

6. **Text Display and Selection Issues:**
   - **Selection Color:** Text selection should show CRT green background with black text
   - **Terminal Aesthetic:** No spell-check underlining should appear on character names
   - **Text Truncation:** Names should use `text-sm` with proper ellipsis handling
   - **Check:** Verify custom selection CSS is applied globally

**Implementation Check:**
```tsx
// Verify these elements exist in SearchBar.tsx
className="crt-glow-border crt-dither crt-glow-text crt-text-dither"
spellCheck={false}
style={{ fontSize: '28px', caretColor: 'transparent' }}

// Verify these elements exist in ItemCardModal.tsx
style={{ color: titleColor }}
onClick={onClose} // On overlay
onClick={(e) => e.stopPropagation()} // On content
```

**CSS Verification:**
```css
/* Check custom.css for these rules */
::selection {
  background-color: var(--crt-green);
  color: var(--search-bg);
}

.crt-glow-text { /* text glow effects */ }
.crt-glow-border { /* border glow effects */ }
.crt-dither { /* scan-line patterns */ }
```

**Impact:**
- All CRT effects should be visible and performant
- Modal interactions should be smooth and accessible
- Nation colors should provide immediate visual context
- Scrollbars should match the overall CRT aesthetic
- Search bar should provide authentic terminal experience without browser interference

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

---

## [2025-01-27] Duplicate Character Issue Resolution

**Symptom:**
Character appears twice in search results with different information or IDs (e.g., "Gyatso" appearing as both "gyatso" and "monk-gyatso").

**Root Cause:**
Multiple markdown files exist for the same character in `raw-data/characters/`, creating duplicate entries in the enriched data.

**Solution Process:**
1. **Identify duplicates**: Search for character files with similar names or content
2. **Compare file quality**: 
   - Check file size and comprehensiveness
   - Review metadata completeness 
   - Verify which file has better structured data
3. **Choose canonical file**: Keep the more comprehensive version
4. **Update references**: Search for any references to the removed file's ID in other markdown files and update them
5. **Delete duplicate**: Remove the inferior duplicate file
6. **Rebuild data**: Run `npm run build:data` to regenerate the enriched data

**Example Resolution (Gyatso):**
- Found two files: `gyatso.md` (157 lines) and `monk-gyatso.md` (279 lines)
- Kept `monk-gyatso.md` (more comprehensive with complete metadata)
- Updated reference in `roku.md` from `"gyatso"` to `"monk-gyatso"`
- Deleted `raw-data/characters/gyatso.md`
- Image fallback mapping already handled the change correctly

**Prevention:**
- Check for similar character names before creating new files
- Use canonical character names consistently across all references
- Review enriched data for duplicate IDs after major data additions

---

**Summary:**
- All data and search issues can be traced by following the data from `enriched-data.json` through the preprocessor, search hook, and UI.
- The new architecture is robust and transparent—debugging is straightforward if you follow the data.

---

## Matrix Rain & Glassmorphism Effects Issues (2025)

### **Matrix Rain Not Appearing**

**Symptoms:** No digital rain effect visible in background
**Cause:** Canvas rendering or component integration issues
**Fix:**
1. Check browser console for Canvas-related errors
2. Verify `MatrixRain` component is imported in `Layout.tsx`
3. Ensure Canvas element has correct z-index (-1) and positioning
4. Check if `prefers-reduced-motion` is enabled (effect respects accessibility setting)

### **Grey Boxes Blocking Matrix Rain**

**Symptoms:** Solid grey rectangles appear over the Matrix rain effect
**Cause:** Components using opaque backgrounds instead of transparent ones
**Fix:**
1. Check `EntityGrid` has `bg-transparent` class, not `bg-background`
2. Verify `ItemCardCollapsed` doesn't have `bg-background` on containers
3. Look for any component using solid backgrounds that should be transparent
4. Ensure glassmorphism cards use `rgba()` backgrounds, not solid colors

### **Matrix Rain Performance Issues**

**Symptoms:** Stuttering, low frame rate, or browser lag
**Cause:** Canvas rendering performance or memory issues
**Fix:**
1. Check if multiple Matrix Rain instances are running
2. Verify proper cleanup in `useEffect` return function
3. Monitor browser memory usage - ensure no memory leaks
4. Check if `requestAnimationFrame` is being properly canceled
5. Consider reducing animation frame rate on slower devices

### **Glassmorphism Effects Not Working**

**Symptoms:** Cards appear solid instead of semi-transparent with blur
**Cause:** Browser doesn't support `backdrop-filter` or CSS is incorrect
**Fix:**
1. Check browser support: Chrome 76+, Firefox 103+, Safari 9+
2. Verify both `backdrop-filter` and `-webkit-backdrop-filter` are present
3. Check if fallback styles are applying correctly
4. Ensure parent containers don't have overflow properties that break backdrop filters

### **Matrix Glow Effects Not Appearing**

**Symptoms:** Cards don't glow green on hover
**Cause:** CSS classes not applying or conflicting styles
**Fix:**
1. Verify `matrix-card-glow` class is applied to cards
2. Check if box-shadow styles are being overridden
3. Ensure hover states are properly defined in CSS
4. Look for conflicting z-index or transform properties

### **Canvas Not Resizing Properly**

**Symptoms:** Matrix rain doesn't adapt to window size changes
**Cause:** Resize event handler not updating Canvas dimensions
**Fix:**
1. Check `initializeCanvas()` function is called on window resize
2. Verify Canvas width/height are updated with actual pixel dimensions
3. Ensure drops array is recalculated for new column count
4. Check if resize event listeners are properly attached and cleaned up

### **Matrix Characters Not Displaying Correctly**

**Symptoms:** Strange symbols or empty spaces instead of Matrix characters
**Cause:** Character encoding or font rendering issues
**Fix:**
1. Verify Japanese Katakana characters are properly encoded in the character array
2. Check browser font support for Unicode characters
3. Ensure Canvas context font settings are correct
4. Test with fallback ASCII characters if Unicode fails

### **Accessibility Issues with Effects**

**Symptoms:** Users report motion sickness or difficulty reading content
**Cause:** Effects not respecting accessibility preferences
**Fix:**
1. Implement `prefers-reduced-motion` media query to disable animations
2. Ensure sufficient color contrast in glassmorphism effects
3. Provide option to disable Matrix rain in settings
4. Test with screen readers to ensure effects don't interfere

### **Development Hot Reload Issues**

**Symptoms:** Matrix rain doesn't restart properly during development
**Cause:** Canvas context or animation loops not cleaning up properly
**Fix:**
1. Ensure `useEffect` cleanup function cancels `requestAnimationFrame`
2. Remove all event listeners in cleanup
3. Clear any intervals or timeouts
4. Reset Canvas context state if needed

---

### Collections System Issues

**Collection Popover is Cut Off or Not Visible**
- Issue: The collection popover menu is being clipped by parent containers
- Solution: The popover uses React Portal to render at document.body level
- Check that the buttonRef is properly passed and the Portal is working
- Verify z-index values if other elements are overlapping

**Collection Changes Not Persisting**
- Issue: Collections disappear after page refresh
- Check: Open DevTools → Application → Local Storage
- Verify the 'austros-atla-collections' key exists
- Check for localStorage errors in console
- Ensure you're not in incognito/private mode

**Checkmark State Issues**
- Issue: Checkmark stays visible permanently
- Solution: The success state uses a 1.5s timeout
- Check that the timeout is not being interrupted
- Verify the successStates object is being updated correctly

**Collection Filtering Not Working**
- Issue: Grid doesn't update when selecting a collection
- Check HomeContainer's activeCollectionId state
- Verify the collection's cardIds array
- Check that filtered results are being passed to EntityGrid

**Collection Button Reference Issues**
- Issue: Popover positioning is incorrect
- Ensure CollectionCardButton is using forwardRef correctly
- Check that the ref is being passed through all components
- Verify the button's getBoundingClientRect() values

**Multiple Popovers Appearing**
- Issue: Multiple collection popovers visible at once
- Solution: Ensure showPopover state is being toggled correctly
- Check that click-outside handling is working
- Verify onClose is being called properly

---

# [2025-07] UI/UX & Collections System Improvements

**Summary of July 2025 Updates:**

- **Modal Scroll Lock:** When a card is expanded, background scrolling is disabled, locking the user into the modal until it is closed.
- **Single Scroll Container:** The expanded card modal now scrolls all content (image, name, role, and details) together, improving usability for cards with limited information.
- **Click-Outside-to-Close:** Clicking anywhere outside the expanded card content closes the modal, providing a more intuitive and accessible experience.
- **Accessibility Fixes:**
  - Overlay and modal use proper ARIA roles and keyboard navigation (Escape key closes modal).
  - Overlay uses a button for click-outside, ensuring screen reader compatibility.
  - Focus management and tab order are preserved.
- **Collection Button Improvements:**
  - The + (add to collection) icon is now perfectly centered and more visually prominent.
  - Button uses a larger size, bolder font, and stronger glow/hover effects for better discoverability.
  - Accessibility: Button uses proper ARIA labels and keyboard focus.
- **Popover/Popover Menu:**
  - Collection popover is positioned correctly and does not get cut off.
  - Only one popover can be open at a time.
- **General UI Polish:**
  - All changes maintain the Matrix/CRT aesthetic and are fully responsive.
  - All interactive elements are accessible and keyboard-navigable.

---

## Modal Scroll Lock Not Working
- **Symptom:** When a card is expanded, you can still scroll the background content.
- **Solution:** Ensure the `useScrollLock` hook is imported and called with `true` in `ItemCardModal.tsx`. The hook should set `document.body.style.overflow = 'hidden'` and restore it on cleanup.
- **Check:** The modal should trap scroll and background should not move until the modal is closed.

## Click-Outside-to-Close Not Working
- **Symptom:** Clicking outside the expanded card does not close the modal.
- **Solution:** The modal overlay should be a button or div with an `onClick` handler that calls the modal's `onClose` prop. The modal content should stop event propagation with `onClick={e => e.stopPropagation()}`.
- **Check:** Clicking anywhere outside the modal content closes the modal.

## Collection Button Not Visible or Not Centered
- **Symptom:** The + (add to collection) icon is not visible, is off-center, or is hard to see.
- **Solution:**
  - Ensure the button uses the correct Tailwind classes for size, color, and positioning (`absolute top-2 right-2 flex items-center justify-center w-7 h-7 ...`).
  - The icon should be wrapped in a flex container and use `translate-y-[-1px]` for vertical centering.
  - For visibility, use a bolder font, larger size, and stronger glow/hover effects.
- **Check:** The button is clearly visible, centered, and responds to hover/focus.

## Modal or Button Accessibility Issues
- **Symptom:** Modal or collection button is not accessible via keyboard, or screen readers do not announce them properly.
- **Solution:**
  - Modal overlay should use `role="dialog"` and `aria-modal="true"`.
  - Overlay should be a button or focusable element for accessibility.
  - Close button and collection button should have `aria-label` attributes and be focusable via Tab.
  - Escape key should close the modal (handled in `ItemCardModal.tsx`).
- **Check:** All interactive elements are keyboard-navigable and screen reader accessible.