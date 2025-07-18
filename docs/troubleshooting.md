# 🔧 Troubleshooting Guide (2025 January Update)

This document provides solutions for common issues encountered during development and data processing.

---

## Data Pipeline Issues

### Template Files Being Processed as Data

**Problem:** Template files in `templates/` subdirectories are being parsed as real data entries.

**Symptoms:**
- Template files appear in search results
- "String" entries show up in the UI
- Template content is treated as real data

**Solution:**
- **Automatic Fix:** Template exclusion system implemented in `scripts/1-parse-markdown.mjs`
- **Pattern:** `!/[/\\\\]templates[/\\\\]/.test(p)` excludes files in templates directories
- **Verification:** Run `npm run build:data` and check that template files are not processed

**Prevention:**
- Always place template files in `templates/` subdirectories
- Use pattern: `raw-data/[category]/templates/[template_name].md`

### Expanded View Content Not Displaying

**Problem:** Expanded view content is not showing in modal views.

**Symptoms:**
- Modal opens but shows empty content
- Debug logs show `[DEBUG] Found Expanded View block: false`
- Content appears in markdown but not in UI

**Solution:**
- **Format Requirement:** Expanded view content must be wrapped in ```md code blocks
- **Correct Format:**
  ```markdown
  ## 📖 UI - EXPANDED VIEW
  
  ```md
  ### 📖 Overview
  
  Content here...
  ```
  ```
- **Common Issue:** Double ```md blocks prevent parsing
- **Fix:** Remove duplicate ```md markers

**Verification:**
- Check debug logs for `[DEBUG] Found Expanded View block: true`
- Ensure content is between ```md and ``` markers
- Verify no duplicate markers

### Image Path Validation Errors

**Problem:** Images are not displaying due to path mismatches.

**Symptoms:**
- Image placeholders show instead of actual images
- Console errors about missing image files
- Images work in some cards but not others

**Solution:**
- **Requirement:** Image paths must match exact filenames in `public/assets/images/`
- **Validation:** Check that `"image": "filename.jpg"` matches actual file
- **Common Issues:**
  - Case sensitivity: `Order-Of-The-White-Lotus.jpg` vs `order-of-the-white-lotus.jpg`
  - File extensions: `.jpg` vs `.png`
  - Hyphenation: `white-lotus` vs `white_lotus`

**Verification:**
- List files in `public/assets/images/` directory
- Compare with image paths in JSON metadata
- Ensure exact filename matches

### JSON Syntax Errors

**Problem:** JSON parsing fails due to syntax errors.

**Symptoms:**
- Build fails with JSON parse errors
- Console shows syntax error messages
- Data not appearing in UI

**Solution:**
- **Remove Trailing Commas:** No trailing commas in arrays or objects
- **Correct Format:**
  ```json
  {
    "tags": ["tag1", "tag2"],  // No trailing comma
    "members": ["member1", "member2"]  // No trailing comma
  }
  ```
- **Common Issues:**
  - Trailing commas in arrays: `["item1", "item2",]`
  - Trailing commas in objects: `{"key": "value",}`
  - Missing quotes around string values

**Verification:**
- Use JSON validator to check syntax
- Run `npm run build:data` and check for errors
- Fix any syntax errors before expecting UI changes

---

## UI Component Issues

### Dynamic Type Labels Not Working

**Problem:** Cards show "Character" instead of correct type labels.

**Symptoms:**
- All cards show "Character" regardless of actual type
- No differentiation between groups, locations, foods, etc.

**Solution:**
- **Component:** `src/components/ItemCard/ItemCardCollapsed.tsx`
- **Logic:** Dynamic type detection based on `item.type`
- **Types Supported:** Group, Location, Food, Fauna, Spirit, Character
- **Code:**
  ```typescript
  {item.type === 'group' ? 'Group' : 
   item.type === 'location' ? 'Location' : 
   item.type === 'food' ? 'Food' : 
   item.type === 'fauna' ? 'Fauna' : 
   item.type === 'spirit-world' ? 'Spirit' : 
   'Character'}
  ```

### Filter System Not Working

**Problem:** Filters don't apply correctly or show wrong results.

**Symptoms:**
- Groups don't appear when "Groups" filter is selected
- Filter buttons don't respond
- Wrong items appear in filtered results

**Solution:**
- **Type Mapping:** Ensure `typeMap` includes all entity types
- **Filter Logic:** Check sequential filtering pipeline in `HomeContainer.tsx`
- **State Management:** Verify filter state is properly managed
- **Code:**
  ```typescript
  const typeMap: Record<string, string> = { 
    characters: 'character', 
    locations: 'location', 
    groups: 'group', // Ensure this is present
    foods: 'food',
    fauna: 'fauna', 
    spirits: 'spirit-world' 
  };
  ```

### Collections System Issues

**Problem:** Collections not working or not persisting.

**Symptoms:**
- Collections disappear on page refresh
- Add/remove buttons don't work
- Collection sidebar not showing

**Solution:**
- **localStorage:** Check browser localStorage support
- **Hook:** Verify `useCollections` hook is properly integrated
- **Components:** Ensure all collection components are imported and used
- **Error Handling:** Check console for localStorage errors

---

## Search Engine Issues

### Search Results Not Appearing

**Problem:** Search returns no results or wrong results.

**Symptoms:**
- Search bar doesn't work
- No results for valid queries
- Wrong ranking of results

**Solution:**
- **Index Building:** Check that FlexSearch index is built correctly
- **Data Loading:** Verify `enriched-data.json` is loaded
- **Search Logic:** Check `useSearch` hook implementation
- **Debug:** Add console logs to track search process

### Partial Tag Matching Issues

**Problem:** Partial tag matching not working as expected.

**Symptoms:**
- Searching "knife" doesn't find "knife_thrower"
- Exact matches not prioritized over partial matches

**Solution:**
- **Search Logic:** Verify partial matching implementation in `useSearch.ts`
- **Tag Format:** Ensure all tags are single, underscore-joined words
- **Priority:** Check that exact matches rank above partial matches

---

## Performance Issues

### Matrix Rain Performance

**Problem:** Matrix rain causes performance issues or lag.

**Symptoms:**
- Low frame rates
- Browser becomes unresponsive
- Animation stutters

**Solution:**
- **Frame Skipping:** Reduce animation intensity when modal is open
- **Canvas Optimization:** Use hardware acceleration
- **Memory Management:** Proper cleanup of animation frames
- **Modal Integration:** Reduce opacity and frame rate when modal is open

### Large Dataset Performance

**Problem:** Application becomes slow with large datasets.

**Symptoms:**
- Slow search response
- UI lag when filtering
- Memory usage issues

**Solution:**
- **Memoization:** Use `useMemo` and `useCallback` for expensive operations
- **Lazy Loading:** Load images on demand
- **Virtual Scrolling:** Consider for very large lists
- **Index Optimization:** Ensure search index is built efficiently

---

## Build and Development Issues

### Build Failures

**Problem:** `npm run build:data` fails.

**Symptoms:**
- Build script exits with errors
- No `enriched-data.json` generated
- Console shows parsing errors

**Solution:**
- **Check Logs:** Read error messages carefully
- **Validate Data:** Check all markdown files for syntax errors
- **Template Exclusion:** Ensure template files are in correct directories
- **JSON Syntax:** Fix any JSON syntax errors
- **Image Paths:** Verify all image paths are correct

### Development Server Issues

**Problem:** `npm run dev` doesn't work or shows errors.

**Symptoms:**
- Development server won't start
- Console errors on startup
- Hot reload not working

**Solution:**
- **Dependencies:** Run `npm install` to ensure all dependencies are installed
- **Port Conflicts:** Check if ports 5173, 5174, 5175 are available
- **TypeScript Errors:** Run `npx tsc --noEmit` to check for type errors
- **Linting Errors:** Run `npm run lint:fix` to fix code style issues

---

## Common Debugging Steps

### 1. Check Console for Errors
- Open browser developer tools
- Look for JavaScript errors
- Check network tab for failed requests

### 2. Verify Data Pipeline
- Run `npm run build:data`
- Check for parsing errors
- Verify `public/enriched-data.json` is generated

### 3. Validate Data Structure
- Check that all required fields are present
- Verify image paths match actual files
- Ensure JSON syntax is correct

### 4. Test Individual Components
- Isolate the problematic component
- Check props and state
- Verify event handlers are working

### 5. Check Browser Compatibility
- Test in different browsers
- Check localStorage support
- Verify Canvas API support

---

## Prevention Best Practices

### Data Authoring
- Always use the canonical template format
- Validate JSON syntax before committing
- Check image paths against actual files
- Use single, underscore-joined words for tags

### Development
- Run `npm run lint:fix` before committing
- Check TypeScript errors with `npx tsc --noEmit`
- Test with `npm run build:data` after data changes
- Verify UI changes with hard refresh

### Testing
- Test all filter combinations
- Verify search functionality
- Check collections system
- Test responsive design on different screen sizes

---

**Remember:** Most issues can be resolved by checking the console for errors, validating the data pipeline, and ensuring all components are properly integrated.