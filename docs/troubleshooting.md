# Troubleshooting Guide

## Common Issues and Solutions

### Data Pipeline Issues

#### Backend Metadata Appearing in UI Cards
**Problem:** "BACKEND METADATA" section appears in character/group cards in the UI
**Root Cause:** Backend metadata section is incorrectly included within the expanded view content
**Solution:** Remove the `---` separator that places backend metadata within the expanded view. Backend metadata should be separated from expanded view content.
**Files Affected:** All character and group markdown files
**Example Fix:**
```markdown
# Before (incorrect)
**Content here**
---

## 🔧 BACKEND METADATA

# After (correct)
**Content here**

## 🔧 BACKEND METADATA
```

#### Groups Not Appearing in UI
**Problem:** New groups (Fire Sages, Royal Servants) not appearing in UI
**Root Cause:** Filter mapping in `applyFilters.ts` only looked for "group" type, not new group types
**Solution:** Updated filter mapping to include "religious_organization" and "service_organization" types
**Files Affected:** `src/utils/applyFilters.ts`
**Code Fix:**
```typescript
const typeMap: Record<string, string[]> = {
  characters: ['character'],
  locations: ['location'],
  fauna: ['fauna'],
  foods: ['food'],
  groups: ['group', 'religious_organization', 'service_organization'],
  spirits: ['spirit-world'],
};
```

#### Groups Labeled as "Character" Instead of "Group"
**Problem:** Groups display as "Character" type in UI instead of "Group"
**Root Cause:** `ItemCardCollapsed.tsx` type label logic did not include new group types
**Solution:** Updated type label logic to include all group types
**Files Affected:** `src/components/ItemCard/ItemCardCollapsed.tsx`
**Code Fix:**
```tsx
<p className="text-[12px] text-neutral-400 font-bold mt-1">
  {item.type === 'group' || item.type === 'religious_organization' || item.type === 'service_organization' ? 'Group' : 
   item.type === 'location' ? 'Location' : 
   item.type === 'food' ? 'Food' : 
   item.type === 'fauna' ? 'Fauna' : 
   item.type === 'spirit-world' ? 'Spirit' : 
   'Character'}
</p>
```

#### Groups Missing Nation Fields
**Problem:** Groups cannot be filtered by nation because they lack nation fields
**Root Cause:** Groups only had "affiliation" fields, not "nation" fields required for filtering
**Solution:** Added nation fields to all groups in their markdown files
**Files Affected:** All group markdown files in `raw-data/groups/`
**Example Fix:**
```json
{
  "id": "fire-sages",
  "name": "Fire Sages",
  "type": "group",
  "nation": "Fire Nation",
  "affiliation": "fire_nation"
}
```

#### Missing Badges for Characters
**Problem:** Characters missing badges in UI
**Root Cause:** Badge field not included in card view section of markdown file
**Solution:** Add badge to card view section in character markdown file
**Files Affected:** Character markdown files
**Example Fix:**
```markdown
## CARD VIEW
```md
- Name: Character Name
- Badge: Badge Name
- Short Description: Description here
```
```

#### Image Not Showing
**Problem:** Images not displaying in cards
**Root Cause:** Filename mismatch between data slug and actual image filename
**Solution:** Add fallback mapping in `imageFallbacks.ts`
**Files Affected:** `src/components/ItemCard/imageFallbacks.ts`
**Example Fix:**
```typescript
export const imageFallbacks: Record<string, string> = {
  "tofu-fried-puffs": "tofu-(fried-puffs).jpg",
  // Add more fallbacks as needed
};
```

#### Character Not Parsing
**Problem:** New character not appearing in data
**Root Cause:** Missing "id" field in JSON metadata block
**Solution:** Add "id" field to backend metadata section
**Files Affected:** Character markdown files
**Example Fix:**
```json
{
  "id": "character-name",
  "name": "Character Name",
  // other fields...
}
```

### UI Issues

#### Matched Fields Pills Cluttering UI
**Problem:** "Matched tags/partial etc." pills cluttering card display
**Solution:** Removed pills and cleaned up unused variables
**Files Affected:** `src/components/ItemCard/ItemCardCollapsed.tsx`

#### Nation Normalization Issues
**Problem:** Character not registering correct nation in UI
**Root Cause:** Nation field normalized incorrectly in enriched data
**Solution:** Remove conflicting "nation" line in card view markdown and rebuild data pipeline
**Files Affected:** Character markdown files

### Data Pipeline Issues

#### Template Files Being Processed
**Problem:** Template files appearing in data
**Root Cause:** Parser not excluding template directories
**Solution:** Added template exclusion filter in parsing script
**Files Affected:** `scripts/1-parse-markdown.mjs`

#### JSON Syntax Errors
**Problem:** Parsing fails due to JSON syntax errors
**Root Cause:** Trailing commas in JSON arrays/objects
**Solution:** Remove trailing commas from all JSON blocks
**Files Affected:** All markdown files with JSON metadata

### Performance Issues

#### Slow Filtering
**Problem:** Filtering performance degrades with large datasets
**Solution:** Implemented memoized filtering with useMemo and useCallback
**Files Affected:** `src/pages/HomeContainer.tsx`, `src/hooks/useFilterState.ts`

## Prevention Guidelines

### Markdown File Structure
1. **Separate Backend Metadata:** Always keep backend metadata separate from expanded view content
2. **Include Required Fields:** Ensure all entities have required fields (id, name, type, nation)
3. **Validate JSON Syntax:** Check for trailing commas and valid JSON structure
4. **Add Badges:** Include badges in card view section for characters
5. **Verify Image Paths:** Ensure image paths match actual files

### UI Component Updates
1. **Update Type Logic:** When adding new entity types, update type label logic
2. **Update Filter Mapping:** When adding new types, update filter mapping
3. **Test Nation Filtering:** Verify all entities can be filtered by nation
4. **Check Badge Display:** Ensure badges appear correctly in UI

### Data Pipeline Maintenance
1. **Rebuild After Changes:** Always run `npm run build:data` after markdown changes
2. **Validate Data:** Check enriched data for correct field inclusion
3. **Test Filtering:** Verify all filters work with new data
4. **Check UI Display:** Verify new entities appear correctly in UI

## Quick Fix Commands

```bash
# Rebuild data pipeline
npm run build:data

# Check for parsing errors
node scripts/1-parse-markdown.mjs

# Validate enriched data
npm run validate:data

# Check TypeScript types
npm run type-check

# Run linting
npm run lint
```

---

*Last Updated: January 2025*
*Status: Comprehensive troubleshooting guide with prevention guidelines*