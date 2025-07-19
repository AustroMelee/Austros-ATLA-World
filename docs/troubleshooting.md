# 🔧 Troubleshooting Guide

## Overview

This guide provides solutions for common issues encountered when working with the Austros ATLA World encyclopedia. Each section includes specific error messages, causes, and step-by-step solutions.

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

## 🏆 Enhanced Filtering System Troubleshooting (2025 Update)

### Category and Nation Filtering Issues

**Problem: "Food items filtered by nations is not working"**
- **Cause:** Nation values in data may be inconsistent or missing
- **Solution:** 
  1. Check `public/enriched-data.json` for food items with `nation` field
  2. Verify nation values are properly formatted (e.g., "Fire Nation", "Earth Kingdom")
  3. Run `npm run build:data` to regenerate data with proper nation mapping
  4. Check that `scripts/lib/enrichRecord.mjs` maps `region` to `nation` correctly

**Problem: "Only a few food items 1-3 at a time are actually showing up in the UI when filtered"**
- **Cause:** Food category tags may be missing or not properly included in enrichment
- **Solution:**
  1. Check that food markdown files have proper category tags
  2. Verify `scripts/categorize-foods.mjs` has been run
  3. Ensure enrichment script includes food category tags in `enriched-data.json`
  4. Run `npm run build:data` to regenerate with proper categorization

**Problem: "Nation symbols not displaying in food cards"**
- **Cause:** Nation values may be missing or incorrectly formatted
- **Solution:**
  1. Check that all food items have `nation` field in `enriched-data.json`
  2. Verify nation values match expected format (e.g., "Fire Nation", "Earth Kingdom")
  3. Ensure `NationIcon` component can map nation strings to React icons
  4. Check that nation values are normalized to lowercase with spaces

**Problem: "Food sub-filters not appearing or not working"**
- **Cause:** Sub-filter configuration may be missing or incorrect
- **Solution:**
  1. Check `src/config/filterConfig.ts` for food sub-filter definitions
  2. Verify food items have proper category tags that match sub-filter mappings
  3. Ensure `HomeContainer.tsx` includes food sub-filter logic
  4. Check that sub-filter buttons have proper React emojis and text labels

**Problem: "Nation filter buttons not matching data values"**
- **Cause:** Filter button terms may not match actual nation values in data
- **Solution:**
  1. Check that filter buttons use single words ("fire", "earth", "water", "air")
  2. Verify data contains full names ("Fire Nation", "Earth Kingdom", etc.)
  3. Ensure partial string matching logic works correctly in `HomeContainer.tsx`
  4. Test with specific nation values to verify matching

### Age Range and Gender Filtering Issues

**Problem: "Age range filters not working for characters"**
- **Cause:** Characters may be missing `ageRange` field or have incorrect values
- **Solution:**
  1. Check that all characters have `ageRange` field in `enriched-data.json`
  2. Verify age range values match expected format (e.g., "child", "teen", "adult")
  3. Ensure animals are properly excluded from age filters
  4. Run `npm run build:data` to regenerate with proper age classification

**Problem: "Gender filters showing wrong results"**
- **Cause:** Gender field values may be inconsistent or missing
- **Solution:**
  1. Check that characters have `gender` field with "male" or "female" values
  2. Verify gender values are properly normalized
  3. Ensure gender filter logic excludes animals and non-human entities
  4. Test with specific gender values to verify filtering

**Problem: "Bender classification not working"**
- **Cause:** Characters may be missing `isBender` or `bendingElement` fields
- **Solution:**
  1. Check that all characters have proper bender classification
  2. Verify `isBender` field is boolean (true/false)
  3. Ensure `bendingElement` field contains valid element names
  4. Run `npm run build:data` to regenerate with proper bender classification

### Sub-Filter Mapping Issues

**Problem: "Sub-filters not translating correctly to data values"**
- **Cause:** Sub-filter mapping may be incomplete or incorrect
- **Solution:**
  1. Check `HomeContainer.tsx` for sub-filter mapping logic
  2. Verify mappings cover all relevant data fields (tags, role, narrativeFunction)
  3. Test with specific examples to ensure proper translation
  4. Update mapping logic if new data fields are added

**Problem: "Food category sub-filters not showing expected items"**
- **Cause:** Food items may not have proper category tags or tags may not match sub-filter terms
- **Solution:**
  1. Check that food items have appropriate category tags
  2. Verify category tags match sub-filter button terms
  3. Ensure all food items appear in at least one sub-filter category
  4. Run categorization script to add missing category tags

### Multi-Select Filter Issues

**Problem: "Multiple nation selection not working"**
- **Cause:** Nation filter logic may not support OR logic for multiple selections
- **Solution:**
  1. Check that nation filtering uses OR logic in `HomeContainer.tsx`
  2. Verify that multiple nations can be selected simultaneously
  3. Test with specific nation combinations
  4. Ensure filter state properly tracks multiple selections

**Problem: "Sub-filter multi-select not working"**
- **Cause:** Sub-filter logic may not support multiple selections
- **Solution:**
  1. Check that sub-filters use multi-select logic
  2. Verify that multiple sub-filters can be active simultaneously
  3. Test with specific sub-filter combinations
  4. Ensure filter state properly tracks multiple sub-filter selections

---

## 🔍 Search Engine Issues

### Missing Search Results

**Problem: "Search returns no results for known terms"**
- **Cause:** The search index may not include the expected field or the field may be missing from the data.
- **Solution:**
  1. Check that the field is present in `public/enriched-data.json`.
  2. Add the field to the `textParts` array in `src/search/preprocessor.ts`.
  3. Rebuild the data pipeline and refresh the app.
  4. Verify the FlexSearch index in `useSearch.ts` includes the field.

**Problem: "Partial tag matching not working"**
- **Cause:** The search logic may not be properly configured for partial matching.
- **Solution:**
  1. Check that the search logic in `useSearch.ts` includes partial tag matching.
  2. Verify that the search query is being processed correctly.
  3. Test with specific tag examples to ensure partial matching works.
  4. Check that the tag dictionary includes the expected tags.

### Search Result Ordering Issues

**Problem: "Search results are not in expected order"**
- **Cause:** The search scoring system may not be working correctly.
- **Solution:**
  1. Check the search scoring logic in `useSearch.ts`.
  2. Verify that exact matches are prioritized over partial matches.
  3. Test with specific search terms to ensure proper ordering.
  4. Check that the search blob includes all relevant fields.

---

## 🎨 UI & Display Issues

### Collections System Issues (2025 Update)

**Problem: "Collections popover not appearing above the clicked card"**
- **Cause:** Popover positioning may be using absolute positioning within card container
- **Solution:**
  1. Use `position: fixed` instead of `position: absolute` for popover
  2. Pass `cardRef` from `ItemCardCollapsed` to popover component
  3. Use `getBoundingClientRect()` to calculate accurate positioning
  4. Position popover outside card container to avoid clipping issues
  5. Ensure popover has proper z-index to appear above other elements

**Problem: "Collections popover clipping when there are more than 3 collections"**
- **Cause:** Fixed height equal to card height prevents proper content display
- **Solution:**
  1. Use `min-height` instead of fixed height for popover
  2. Add `overflow-y-auto` and `max-h-[80vh]` for scrollable content
  3. Use `min-width: 200px` for consistent sizing
  4. Ensure popover can grow dynamically with content

**Problem: "Collections sidebar appearing as a long column with excessive empty space"**
- **Cause:** Fixed height constraints and sticky positioning forcing full viewport height
- **Solution:**
  1. Remove `min-h-screen` from Layout.tsx root container
  2. Remove `min-h-screen` from Home.tsx main flex container
  3. Change sidebar from `sticky top-20` to `self-start`
  4. Use `h-fit` instead of fixed height for content-based sizing
  5. Use `w-auto min-w-[200px] max-w-[280px]` for responsive width

**Problem: "Collections popover not closing when clicking outside"**
- **Cause:** Missing click-outside detection logic
- **Solution:**
  1. Add event listeners for clicks outside popover and card
  2. Use `useEffect` to handle click detection
  3. Check if click target is outside both popover and card elements
  4. Call close function when click-outside is detected
  5. Clean up event listeners on component unmount

**Problem: "Collection button styling not matching Matrix/CRT theme"**
- **Cause:** Default browser checkbox styling or insufficient Matrix theming
- **Solution:**
  1. Increase button size to `w-7 h-7` for better visibility
  2. Add thicker border (`border-2`) for definition
  3. Enhance glow effects with stronger shadows
  4. Add scale animation (`hover:scale-110`) for interactivity
  5. Use bold fonts with drop shadows for glowing text
  6. Implement custom checkbox styling with green glow and rounded corners

**Problem: "TypeScript errors with cardRef prop"**
- **Cause:** Missing `cardRef` prop in component interfaces
- **Solution:**
  1. Add `cardRef: React.RefObject<HTMLDivElement>` to popover props interface
  2. Pass `cardRef` from `ItemCardCollapsed` to popover component
  3. Use `cardRef.current?.getBoundingClientRect()` for positioning
  4. Ensure proper TypeScript typing for all ref-related props

**Problem: "Collections popover styling breaks with many collections"**
- **Cause:** Fixed width and height constraints preventing proper content display
- **Solution:**
  1. Use dynamic width with minimum and maximum constraints
  2. Implement scrollable content with maximum height
  3. Add proper overflow handling for long collection lists
  4. Ensure consistent styling across different collection counts

### Image Loading Problems

**Problem: "Character images not loading"**
- **Cause:** Image paths may be incorrect or files may be missing.
- **Solution:**
  1. Check that image files exist in `public/assets/images/`.
  2. Verify image paths in `enriched-data.json` match actual filenames.
  3. Check browser console for 404 errors.
  4. Use the `useImageFallback` hook to handle missing images gracefully.

**Problem: "Fallback images not displaying"**
- **Cause:** The fallback logic may not be working correctly.
- **Solution:**
  1. Check the `useImageFallback` hook implementation.
  2. Verify that fallback images exist and are accessible.
  3. Test with intentionally broken image paths.
  4. Ensure the fallback logic handles all error cases.

### Modal and Expansion Issues

**Problem: "Expanded cards not closing properly"**
- **Cause:** The modal focus management or click-outside logic may be broken.
- **Solution:**
  1. Check the `useModalFocus` hook implementation.
  2. Verify that click-outside detection is working.
  3. Test with keyboard navigation (Escape key).
  4. Ensure proper event handling for modal closure.

**Problem: "Modal content not scrolling"**
- **Cause:** The modal may not have proper scroll configuration.
- **Solution:**
  1. Check that the modal has a single scroll container.
  2. Verify that scroll lock is properly managed.
  3. Test with long content to ensure scrolling works.
  4. Ensure proper CSS for modal scrolling.

---

## ⚙️ Data Pipeline Issues

### Build Failures

**Problem: "npm run build:data fails"**
- **Cause:** The data pipeline may have validation errors or missing files.
- **Solution:**
  1. Check the console output for specific error messages.
  2. Verify that all required markdown files exist.
  3. Check that JSON syntax is valid in markdown files.
  4. Run `npm run validate:data` to check for data integrity issues.

**Problem: "Unknown tags causing build failures"**
- **Cause:** Tags in markdown files may not be in the tag dictionary.
- **Solution:**
  1. Check `src/data/tag_dictionary.json` for missing tags.
  2. Add missing tags to the dictionary or update existing entries.
  3. Ensure all tags follow the single-word, underscore-joined format.
  4. Run the enrichment script to validate tags.

### Data Validation Issues

**Problem: "Data validation failing"**
- **Cause:** The data may not match the expected schema.
- **Solution:**
  1. Check the validation script for specific error messages.
  2. Verify that all required fields are present in markdown files.
  3. Check that field values match expected formats.
  4. Update the schema if new fields are needed.

**Problem: "Image references not found"**
- **Cause:** Image files may be missing or paths may be incorrect.
- **Solution:**
  1. Check that all referenced images exist in `public/assets/images/`.
  2. Verify image paths in markdown files match actual filenames.
  3. Update image paths or add missing image files.
  4. Run validation to check for missing image references.

---

## 🎯 Performance Issues

### Slow Search Performance

**Problem: "Search is slow or unresponsive"**
- **Cause:** The search index may be too large or inefficient.
- **Solution:**
  1. Check the size of the search index in browser dev tools.
  2. Optimize the search blob creation in `preprocessor.ts`.
  3. Consider reducing the number of indexed fields.
  4. Profile the search performance with React DevTools.

### Slow Page Load

**Problem: "Page takes too long to load"**
- **Cause:** The enriched data file may be too large or have too many images.
- **Solution:**
  1. Check the size of `enriched-data.json`.
  2. Optimize image sizes and formats.
  3. Consider lazy loading for images.
  4. Profile the page load with browser dev tools.

---

## 🔧 Development Environment Issues

### Hot Module Reload Problems

**Problem: "Changes not reflecting in development"**
- **Cause:** Vite HMR may not be working correctly or files may not be watched.
- **Solution:**
  1. Check that the development server is running.
  2. Verify that files are being watched by Vite.
  3. Try a hard refresh (Ctrl+F5).
  4. Restart the development server.

**Problem: "Tailwind changes not applying"**
- **Cause:** Tailwind CSS may not be rebuilding properly.
- **Solution:**
  1. Run `npm run build:tailwind` to rebuild CSS.
  2. Check that Tailwind is watching for changes.
  3. Verify that the generated CSS file is being loaded.
  4. Restart the development server.

### TypeScript and Linting Issues

**Problem: "TypeScript errors preventing build"**
- **Cause:** Type definitions may be missing or incorrect.
- **Solution:**
  1. Run `npm run type-check` to see all TypeScript errors.
  2. Check that all imports are correct.
  3. Verify that type definitions match the actual data structure.
  4. Update type definitions if needed.

**Problem: "ESLint errors preventing commit"**
- **Cause:** Code may not follow the project's linting rules.
- **Solution:**
  1. Run `npm run lint` to see all linting errors.
  2. Fix formatting and style issues.
  3. Check for unused imports and variables.
  4. Run `npm run lint:fix` to auto-fix some issues.

---

## 🚨 Emergency Procedures

### Data Corruption Recovery

**Problem: "enriched-data.json is corrupted or missing"**
- **Solution:**
  1. Delete `public/enriched-data.json`.
  2. Run `npm run build:data` to regenerate.
  3. Check that all source markdown files are intact.
  4. Verify the data pipeline scripts are working.

**Problem: "Search index is broken"**
- **Solution:**
  1. Clear browser cache and localStorage.
  2. Hard refresh the page (Ctrl+F5).
  3. Check that `enriched-data.json` is loading correctly.
  4. Verify the search hook is working properly.

### UI Recovery

**Problem: "UI is completely broken"**
- **Solution:**
  1. Check browser console for JavaScript errors.
  2. Clear browser cache and localStorage.
  3. Restart the development server.
  4. Check that all required files are present.

---

## 📞 Getting Help

If you encounter an issue not covered in this guide:

1. **Check the console:** Look for error messages in the browser console.
2. **Review recent changes:** Check what was modified recently.
3. **Test in isolation:** Try to reproduce the issue with minimal setup.
4. **Document the issue:** Add a new entry to this troubleshooting guide.
5. **Check related documentation:** Review the data pipeline and frontend architecture docs.

---

*Last Updated: January 2025*

---

## 📖 Expanded View Content Issues

### Missing Expanded View Content

**Problem: "Expanded view content not showing in modal despite correct markdown formatting"**
- **Cause:** The parser's regex pattern was too strict and failed to match section headers that included emojis
- **Original Issue:** Headers like `## 📖 UI - EXPANDED VIEW` with emojis weren't being matched by the parser
- **Root Cause:** The original regex `/## [^\n]*UI - EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/` was too specific
- **Solution:** Updated regex to be more flexible: `/## [^\n]*EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/`
- **Debug Steps:**
  1. Run `node scripts/1-parse-markdown.mjs` to see debug output
  2. Look for `[DEBUG] Found Expanded View block: true/false` messages
  3. Check `[DEBUG] Expanded view content length:` to verify content is being extracted
  4. Verify the expanded view content is wrapped in ```md code blocks
- **Validation:** Check `data/parsed-data.json` for the specific entry's `expandedView` field
- **Prevention:** Always test expanded view parsing when adding new content with emoji headers

**Problem: "Expanded view shows '#' instead of actual content"**
- **Cause:** The parser failed to extract content and fell back to a placeholder value
- **Solution:**
  1. Check that expanded view content is properly wrapped in ```md blocks
  2. Verify section header format matches parser expectations
  3. Run debug logging to see what the parser is detecting
  4. Ensure no double ```md markers that could confuse the parser
  5. Check for any special characters or encoding issues in the markdown

**Problem: "Expanded view content is truncated or incomplete"**
- **Cause:** The regex may be stopping at the wrong ``` marker
- **Solution:**
  1. Ensure expanded view content ends with a single ``` marker
  2. Check for any nested code blocks that might confuse the parser
  3. Verify the content doesn't contain unescaped ``` sequences
  4. Test with simpler content to isolate the issue

---

## Image Issues

### Missing Images
**Problem:** Images not appearing in cards
**Solution:** Check the image fallback system in `src/components/ItemCard/imageFallbacks.ts`

**Common Issues:**
1. **Filename Mismatch:** Image filename doesn't match data slug
   - **Example:** Data slug is `mung-bean-tofu-curry` but image is `mung-bean-&-tofu-curry.jpg`
   - **Fix:** Add fallback mapping: `'mung-bean-tofu-curry': 'mung-bean-&-tofu-curry.jpg'`

2. **Missing Image File:** Image file doesn't exist in `public/assets/images/`
   - **Fix:** Add the image file or update the fallback mapping

3. **Character Name Variations:** Character names in data don't match image filenames
   - **Example:** `'toph-beifong': 'toph.jpg'` for character name variations
   - **Fix:** Add appropriate fallback mapping

**Debugging Steps:**
1. Check browser console for 404 errors
2. Verify image file exists in `public/assets/images/`
3. Check data slug matches expected image filename
4. Add fallback mapping if needed
5. Test with universal fallback `404.jpg`

### Image Loading Performance
**Problem:** Slow image loading
**Solution:** Images use lazy loading with `loading="lazy"` attribute
**Optimization:** Images only load when they're about to be visible