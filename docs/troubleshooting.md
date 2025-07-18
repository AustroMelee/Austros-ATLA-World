# Troubleshooting Guide (2025 Update)

This guide covers common issues, their solutions, and debugging strategies for the Austros ATLA World application.

---

## 🔍 Data Pipeline Issues

### Character Classification Problems

**Issue:** Characters missing from age range filters
- **Cause:** Missing `ageRange` field in character data
- **Solution:** Add `ageRange` field to character markdown files and rebuild data
- **Example:** Hama, King Bumi, Monk Gyatso should have `ageRange: "elder"`

**Issue:** Animals appearing in age filters
- **Cause:** Animals like Appa, Momo, Bosco have ageRange fields
- **Solution:** Filtering logic excludes animals (bison, lemur, bear, animal, spirit) from age filters
- **Verification:** Check that animals don't appear in age range sub-filters

**Issue:** Characters missing from gender filters
- **Cause:** Missing `gender` field in character data
- **Solution:** Add `gender` field to character markdown files and rebuild data
- **Example:** All characters should have `gender: "male"` or `gender: "female"`

**Issue:** Characters missing from bender filters
- **Cause:** Missing `isBender` and `bendingElement` fields
- **Solution:** Add proper bender classification fields and rebuild data
- **Example:** Combustion Man should have `isBender: true, bendingElement: "fire"`

### Data Parsing Issues

**Issue:** Characters missing from enriched data
- **Cause:** Malformed JSON blocks in markdown files
- **Solution:** Ensure JSON blocks have proper ```json tags and valid JSON syntax
- **Example:** Yagoda's file was missing opening ```json tag

**Issue:** Unknown tags causing parsing failures
- **Cause:** Tags not in tag dictionary
- **Solution:** Add missing tags to `src/data/tag_dictionary.json`
- **Example:** "the_waterbending_master" was added to tag dictionary

**Issue:** Identity fields not being flattened
- **Cause:** Parsing script only flattens `metadata` object
- **Solution:** Updated parsing script to also flatten `identity` object fields
- **Example:** Yagoda's `isBender` and `bendingElement` were in `identity` object

### Data Validation

**Issue:** Inconsistent character classification
- **Cause:** Characters missing required fields for filtering
- **Solution:** Run `npm run build:data` to validate all data
- **Check:** Ensure all characters have ageRange, gender, isBender, bendingElement fields

---

## 🎨 UI & Filtering Issues

### Filter Button Problems

**Issue:** Nation filters not working correctly
- **Cause:** Partial string matching issues
- **Solution:** Nation filters use partial matching (e.g., "fire" matches "Fire Nation")
- **Verification:** Check that "fire" button shows Fire Nation characters

**Issue:** Sub-filters showing incorrect results
- **Cause:** OR logic instead of AND logic for sub-filters
- **Solution:** Sub-filters use AND logic (all selected filters must match)
- **Example:** "female" + "villain" shows only female villains

**Issue:** Age filters showing animals
- **Cause:** Animal exclusion logic not working
- **Solution:** Check that species field excludes bison, lemur, bear, animal, spirit
- **Verification:** Appa, Momo, Bosco should not appear in age filters

### Visual Issues

**Issue:** Filter buttons not highlighting properly
- **Cause:** Insufficient contrast or glow effects
- **Solution:** Enhanced button highlighting with increased brightness and glow
- **Verification:** Active filters should be clearly visible with green glow

**Issue:** Gender icons not displaying
- **Cause:** React Icons not imported or styled correctly
- **Solution:** Ensure proper icon imports and styling
- **Example:** Male (♂) and Female (♀) icons should be visible

**Issue:** "Subcategories" text still showing
- **Cause:** Text not removed from FilterBar component
- **Solution:** Remove "Subcategories" heading from FilterBar
- **Verification:** Only filter buttons should be visible, no text labels

---

## 🔧 Search & Indexing Issues

### Search Result Problems

**Issue:** Characters not appearing in search results
- **Cause:** Missing fields in searchable text
- **Solution:** Updated preprocessor to include ageRange and other metadata fields
- **Example:** "elder" search should find Hama, King Bumi, etc.

**Issue:** Partial tag matching not working
- **Cause:** Search logic not handling partial matches correctly
- **Solution:** Ensure search includes all relevant fields and tags
- **Example:** "knife" should match "knife_thrower" tag

**Issue:** Search results not ordered correctly
- **Cause:** Scoring system not prioritizing correctly
- **Solution:** Check search scoring hierarchy (exact match > partial match > etc.)
- **Verification:** Most relevant results should appear first

---

## 🏗️ Development & Build Issues

### Build Process Problems

**Issue:** Data pipeline failing
- **Cause:** Malformed data or missing files
- **Solution:** Run `npm run build:data` and check console for errors
- **Steps:**
  1. Check all markdown files for valid JSON blocks
  2. Ensure all required fields are present
  3. Verify tag dictionary includes all used tags
  4. Rebuild data: `npm run build:data`

**Issue:** TypeScript compilation errors
- **Cause:** Type mismatches or missing imports
- **Solution:** Run `npx tsc --noEmit` to check for type errors
- **Fix:** Update types or add proper type annotations

**Issue:** Tailwind CSS not generating correctly
- **Cause:** Configuration issues or missing classes
- **Solution:** Run `npm run build:tailwind` to regenerate CSS
- **Check:** Ensure all custom classes are properly defined

### Hot Module Reload Issues

**Issue:** Changes not reflecting in development
- **Cause:** HMR not working for certain file types
- **Solution:** 
  - For Tailwind config: Run `npm run build:tailwind` and reload
  - For global CSS: Full page reload required
  - For React components: Should hot reload automatically

**Issue:** Multiple HMR updates for single change
- **Cause:** Circular dependencies or cascading updates
- **Solution:** Check for circular imports and optimize component structure
- **Verification:** Single file changes should trigger minimal HMR updates

---

## 🐛 Common Data Fixes Applied

### Character Data Corrections

**Toph's Age Range:**
- **Issue:** Listed as "teen" but should be "child"
- **Fix:** Updated `ageRange` from "teen" to "child"
- **Reason:** Toph is 12 years old during main series

**June's Age Range:**
- **Issue:** Listed as "young adult" but should be "adult"
- **Fix:** Updated `ageRange` from "young adult" to "adult"
- **Reason:** June is middle-aged in the series

**Missing Bender Classification:**
- **Characters Fixed:** Combustion Man, Roku, Kyoshi, Gecko, Xin Fu, Kuruk, Yagoda, Yangchen
- **Fields Added:** `isBender` and `bendingElement` for all characters
- **Verification:** All characters now appear in correct bender/nonbender filters

**Missing Age Ranges:**
- **Characters Fixed:** Hama, Iroh, King Bumi, Pakku, Monk Gyatso, and other elder characters
- **Fields Added:** `ageRange: "elder"` for appropriate characters
- **Verification:** Elder characters now appear in "elder" filter

### Data Pipeline Improvements

**Identity Object Flattening:**
- **Issue:** Fields in `identity` object not being promoted to top level
- **Fix:** Updated parsing script to flatten `identity` object fields
- **Result:** All identity fields now available for filtering

**Tag Dictionary Updates:**
- **Issue:** Unknown tags causing parsing failures
- **Fix:** Added missing tags like "the_waterbending_master" to tag dictionary
- **Result:** All characters with custom tags now parse correctly

**JSON Block Formatting:**
- **Issue:** Missing opening ```json tags in markdown files
- **Fix:** Ensured all JSON blocks have proper opening and closing tags
- **Result:** All character data now parses correctly

---

## 🔍 Debugging Strategies

### Data Validation Process

1. **Check Raw Data:** Examine markdown files in `raw-data/characters/`
2. **Validate JSON Blocks:** Ensure proper ```json tags and valid syntax
3. **Check Required Fields:** Verify ageRange, gender, isBender, bendingElement
4. **Rebuild Data:** Run `npm run build:data`
5. **Check Enriched Data:** Examine `public/enriched-data.json`
6. **Test Filters:** Verify characters appear in correct filters

### Search Debugging

1. **Check Searchable Fields:** Verify preprocessor includes all relevant fields
2. **Test Search Terms:** Try exact matches and partial matches
3. **Check Index:** Verify FlexSearch index is built correctly
4. **Examine Results:** Check search result ordering and relevance

### UI Debugging

1. **Check Component Props:** Verify filter state is passed correctly
2. **Examine Filter Logic:** Check filtering pipeline in HomeContainer
3. **Test Button States:** Verify active/inactive states work correctly
4. **Check Visual Feedback:** Ensure active filters are highlighted

### Performance Debugging

1. **Monitor HMR Updates:** Check for excessive hot reloads
2. **Profile Components:** Use React DevTools Profiler
3. **Check Bundle Size:** Monitor for unnecessary dependencies
4. **Optimize Renders:** Use React.memo and useMemo where appropriate

---

## 📋 Quick Fix Checklist

When encountering issues, check these common solutions:

- [ ] Run `npm run build:data` to rebuild enriched data
- [ ] Check for malformed JSON in markdown files
- [ ] Verify all required fields are present (ageRange, gender, isBender, bendingElement)
- [ ] Ensure tags are in tag dictionary
- [ ] Check for proper ```json tags in markdown files
- [ ] Run `npx tsc --noEmit` for TypeScript errors
- [ ] Run `npm run build:tailwind` for CSS issues
- [ ] Clear browser cache and reload
- [ ] Check console for JavaScript errors
- [ ] Verify filter logic in HomeContainer.tsx

---

## 🆘 Getting Help

If you encounter an issue not covered in this guide:

1. **Check Console:** Look for error messages in browser console
2. **Examine Network Tab:** Check for failed requests
3. **Review Recent Changes:** Identify what might have caused the issue
4. **Test Isolated Components:** Try to reproduce in a minimal environment
5. **Check Documentation:** Review relevant docs for guidance
6. **Add to This Guide:** Document new issues and solutions for future reference

Remember: The data pipeline is the foundation of the application. Most issues can be resolved by ensuring data integrity and rebuilding the enriched data file.