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

#### Episodes Not Filtering by Book
**Problem:** Episodes don't appear when filtering by Book 1, Book 2, or Book 3
**Root Cause:** Filtering logic only checks `item.metadata?.book` but episodes have `book` field at top level
**Solution:** Update filtering logic to check both `item.book` and `item.metadata?.book`
**Files Affected:** `src/utils/applyFilters.ts`, `src/search/types.ts`
**Code Fix:**
```typescript
// In applyFilters.ts
if (subFilterLower === 'book_1') {
  return item.book === 'Water' || item.metadata?.book === 'Water';
}
if (subFilterLower === 'book_2') {
  return item.book === 'Earth' || item.metadata?.book === 'Earth';
}
if (subFilterLower === 'book_3') {
  return item.book === 'Fire' || item.metadata?.book === 'Fire';
}

// In types.ts - Add book field to EnrichedEntity
export interface EnrichedEntity {
  // ... existing fields
  book?: string; // Episode-specific field
}
```
**Prevention:** Always check both field locations when filtering episodes by book

#### Episode Title Duplication (RESOLVED - January 2025)
**Problem:** Episode "Winter Solstice, Part 2: Avatar Roku" displayed title twice in UI - once from card view data and once from expanded view content
**Root Cause:** Data pipeline was adding episode title to the beginning of expanded view content during processing
**Solution:** Rebuilt data pipeline using `npm run build:data` which regenerated enriched data with correct content
**Status:** ✅ RESOLVED - Episode now displays correctly with single title
**Prevention:** Always rebuild data pipeline after any data processing issues
**Files Affected:** `public/enriched-data.json`, episode markdown files
**Verification:** Expanded view content now starts with `### 📖 Episode Information` instead of duplicate title heading

#### Episode Images Not Showing (RESOLVED - January 2025)
**Problem:** Episode cards showing placeholder text "WW" and "WR" instead of actual episode images
**Root Cause:** Episode markdown files missing `image` field in JSON metadata, even when image files exist
**Solution:** Added missing `image` fields to episode JSON metadata blocks
**Status:** ✅ RESOLVED - Episode images now display correctly
**Files Affected:** `raw-data/episodes/winter-solstice-part-1-the-spirit-world.md`, `raw-data/episodes/winter-solstice-part-2-avatar-roku.md`
**Example Fix:**
```json
{
  "type": "episode",
  "id": "winter-solstice-part-1-the-spirit-world",
  "title": "Winter Solstice, Part 1: The Spirit World",
  "image": "winter-solstice,-part-1-the-spirit-world.jpg"
}
```
**Prevention:** Always include `image` field in episode JSON metadata when creating new episode files

#### Episode Title Parsing Issues (RESOLVED - January 2025)
**Problem:** Episode titles not parsing correctly from markdown files
**Root Cause:** Parser regex pattern was too strict and failed to match section headers with emojis
**Solution:** Updated parser regex to be more flexible and handle emoji-containing headers
**Status:** ✅ RESOLVED - All episode titles now parse correctly
**Files Affected:** `scripts/1-parse-markdown.mjs`
**Code Fix:**
```javascript
// Original regex (too strict)
/## [^\n]*UI - EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/

// Updated regex (more flexible)
/## [^\n]*EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/
```
**Result:** All expanded view content now parses correctly regardless of emoji presence in headers

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

#### Locations Not Appearing in UI
**Problem:** Location files not appearing in UI despite being created
**Root Cause:** Parser only accepting `['character', 'group', 'food']` types, not `'location'`
**Solution:** Updated parser to accept `type: location` in supported types array
**Files Affected:** `scripts/1-parse-markdown.mjs`
**Code Fix:**
```javascript
if (!['character', 'group', 'food', 'location'].includes(frontmatter.type)) {
  console.log(`[INFO]    Skipping ${filePath}: Type is "${frontmatter.type}", not supported.`);
  return null;
}
```
**Result:** All 4 Air Temple locations now parse correctly and appear in UI

#### Fauna Subfilters Defaulting to Single Entry
**Problem:** All fauna subfilters defaulting to komodo chicken instead of proper categorization
**Root Cause:** Subfilter tags (like "predators_hunters", "domesticated_mounts") were filtered out during enrichment, leaving only basic tags like "military", "cavalry"
**Solution:** Enhanced `applyFilters.ts` with comprehensive fauna subfilter mapping that checks existing tags, metadata fields, and behavioral characteristics
**Files Affected:** `src/utils/applyFilters.ts`
**Code Fix:**
```typescript
const faunaFilterMapping: Record<string, string[]> = {
  predators_hunters: ['military', 'cavalry', 'hunting', 'predator', 'dangerous', 'venomous', 'aggressive'],
  domesticated_mounts: ['military', 'cavalry', 'merchant', 'transportation', 'mount', 'domesticated'],
  aquatic_marine: ['aquatic', 'marine', 'fish', 'mollusk', 'cephalopod'],
  flying_aerial: ['flying', 'bird', 'aerial'],
  sacred_spiritual: ['sacred', 'spirit', 'spiritual'],
  hybrid_mixed: ['hybrid', 'mixed'],
  small_insects: ['insect', 'arachnid', 'small'],
  reptiles_amphibians: ['reptile', 'amphibian', 'lizard', 'snake']
};
```
**Result:** Fauna entries now properly categorized across all 8 subfilters based on their actual available tags and metadata

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

### Cached Data Issues (2025 January Update)

#### Unexpected Cards Appearing in UI
**Problem:** UI shows cards for entities that no longer exist in the filesystem (e.g., episode cards when no episode files exist)
**Root Cause:** Deleted markdown files leave cached data in `data/parsed-data.json` and `public/enriched-data.json`
**Symptoms:** 
- Episode cards appear despite no episode files
- Character cards appear for deleted characters
- Food cards appear for deleted food items
- Location cards appear for deleted locations
**Solution:** Complete data pipeline rebuild
**Emergency Fix:**
```bash
# 1. Stop development server
# 2. Delete cached data files
rm data/parsed-data.json
rm public/enriched-data.json

# 3. Rebuild data pipeline
npm run build:data:parse
npm run enrich:data

# 4. Restart development server
npm run dev
```
**Prevention:** Always run `npm run build:data` after deleting any markdown files

#### Orphaned Data Entries
**Problem:** Processed data contains entries for files that no longer exist
**Root Cause:** Data pipeline processes files that existed previously but were deleted
**Diagnosis:**
```bash
# Count actual markdown files
find raw-data -name "*.md" -not -path "*/templates/*" | wc -l

# Count processed entries
jq length data/parsed-data.json

# If counts don't match, orphaned data exists
```
**Solution:** Force complete rebuild from scratch
**Verification:**
```bash
# Check for specific orphaned types
grep -r '"type": "episode"' data/parsed-data.json
grep -r '"type": "episode"' public/enriched-data.json

# Should return no results if properly cleaned
```

#### Data Pipeline Inconsistencies
**Problem:** UI shows different data than what exists in filesystem
**Root Cause:** Cached data files not reflecting current filesystem state
**Solution:** Complete data pipeline rebuild
**Files Affected:** `data/parsed-data.json`, `public/enriched-data.json`
**Prevention Checklist:**
- [ ] Run `npm run build:data` after any file deletions
- [ ] Verify file counts match between filesystem and processed data
- [ ] Check for unexpected entity types in UI
- [ ] Monitor for orphaned entries in processed data

#### Episode Processing Issues (January 2025 Update)
**Problem:** Episode files not appearing in UI despite being created correctly
**Root Cause:** Parser not recognizing `type: episode` in supported types array
**Symptoms:**
- Episode files exist in `raw-data/episodes/` but don't appear in UI
- Parser logs show "Type is 'episode', not supported" message
- Episode data missing from `enriched-data.json`
**Solution:** Ensure parser supports episode type
**Files Affected:** `scripts/1-parse-markdown.mjs`
**Code Fix:**
```javascript
// Update supported types array to include 'episode'
if (!['character', 'group', 'food', 'location', 'episode'].includes(frontmatter.type)) {
  console.log(`[INFO]    Skipping ${filePath}: Type is "${frontmatter.type}", not supported.`);
  return null;
}
```
**Verification:**
```bash
# Check if episodes are being parsed
node scripts/1-parse-markdown.mjs | grep "episode"

# Check enriched data for episodes
node -e "const data = require('./public/enriched-data.json'); const episodes = data.filter(item => item.type === 'episode'); console.log('Episodes found:', episodes.length);"
```
**Prevention:** Always verify new entity types are added to the supported types array in the parser

#### Episode Creation Timing Issues (January 2025 Update)
**Problem:** Episode file created correctly but doesn't appear in UI immediately
**Root Cause:** Data pipeline processing timing - episode file may not be included in initial processing run due to file system synchronization
**Symptoms:**
- Episode file exists in `raw-data/episodes/` but doesn't appear in UI
- Episode missing from `enriched-data.json` despite correct file structure
- Development server running but episode not visible
**Solution:** 
1. Rebuild data pipeline: `npm run build:data`
2. Restart development server: `npm run dev`
3. Verify episode is in enriched data
**Prevention:** Always rebuild data pipeline after creating new episode files
**Verification:**
```bash
# Check if episode is in enriched data
node -e "const data = require('./public/enriched-data.json'); const episodes = data.filter(i => i.type === 'episode'); console.log('Total episodes:', episodes.length); episodes.forEach(e => console.log(e.id, e.title));"

# Check if episode file exists
ls raw-data/episodes/ | grep "episode-name"
```
**Workflow:** Create episode file → Rebuild data pipeline → Restart development server → Verify episode appears

### Type-Agnostic Script Architecture Issues (January 2025 Update)

#### Special-Case Logic in Scripts
**Problem:** Scripts contain type-specific handling that can cause inconsistencies
**Root Cause:** Previous implementations included special-case logic for different entity types
**Solution:** Complete cleanup of all scripts to ensure type-agnostic processing
**Files Affected:** `scripts/lib/enrichRecord.mjs`, `scripts/1-parse-markdown.mjs`, `scripts/2-enrich-data.mjs`
**Cleanup Summary:**
- Removed episode-specific name handling (`record.title || record.name`)
- Removed episode-specific expandedView promotion
- Removed episode-specific debug logging
- Removed food-specific region→nation mapping logic
- Removed food-specific category tag handling
**Result:** All entity types now use unified processing logic
**Prevention:** Never introduce type-specific logic in any script

#### Canonical Structure Violations
**Problem:** Different entity types using different markdown structures
**Root Cause:** Some entity types deviated from the canonical structure
**Solution:** Enforce canonical structure for all entity types
**Required Structure:**
- YAML frontmatter with `type` field
- `## UI - CARD VIEW` section with ```md code block
- `## UI - EXPANDED VIEW` section with ```md code block
- Backend metadata in separate section
**Prevention:** All new entity types must follow this exact structure

### Nation icons missing on most location cards (RESOLVED – 2025 Aug)
**Problem:** Nation icon shows globe for locations; only Air entries show correct icon.
**Root Cause:** Location records use non‑canonical nation strings (e.g., "Northeastern Earth Kingdom", "Fire Nation archipelago", "north pole"), while the icon map expects canonical names.
**Solution:** Introduced normalization in `computeNationFromEntity` and made cards prefer the normalized value.
- Normalizes phrases → canonical nations:
  - Air Nomads
  - Water Tribe (includes “north pole”, “south pole”, “Northern/Southern Water Tribe”)
  - Earth Kingdom
  - Fire Nation
- Cards now call `computeNationFromEntity(entity)` before falling back to raw `nation`.
**Files Affected:**
- `src/utils/data.ts` (new `computeNationFromEntity` and mappings)
- `src/components/ItemCard/ItemCardCollapsed.tsx` and `ItemCardModal.tsx` (prefer computed nation)
**Verification:** Open any location card (e.g., Chin Village, Crescent Island); icon should match nation.
**Prevention:** Keep nation phrases canonical in content; if new phrasing appears, add it to normalization map.

### Water nation filter not returning locations (RESOLVED – 2025 Aug)
**Problem:** Selecting the Water nation filter returns no locations.
**Root Cause:** Filter matched only the literal word "water" or "water tribe"; many water entries use “north pole”, “south pole”, or explicit tribe names.
**Solution:** Expanded nation filter synonyms and applied them to normalized nation, raw nation, and region fields.
- Water synonyms: ["water", "water tribe", "north pole", "south pole", "northern water tribe", "southern water tribe"].
- Also normalized synonyms for air/earth/fire.
**Files Affected:** `src/utils/applyFilters.ts` (nation filter uses `computeNationFromEntity` + synonyms)
**Verification:** Water filter now returns Northern/Southern Water Tribe and polar entries.
**Prevention:** When adding new data, prefer canonical `nation`; keep synonyms list updated if new phrasings appear.

### Location subfilters not working / too many options (RESOLVED – 2025 Aug)
**Problem:** Location subfilters didn’t match real data; UI showed non‑functional or overly granular options.
**Root Cause:** Subfilters didn’t correspond to fields present in enriched data (`locationType`, `region`, `terrain`, or names).
**Solution:** Reduced to a data‑backed set and implemented heuristic matching over multiple fields.
- Current subfilters: `capital`, `city`, `village`, `temple`, `island`, `desert`, `swamp`.
- Heuristic checks: `locationType`, `region`, `terrain`, `name`, and `slug` with term synonyms (e.g., island ↔ archipelago/coast).
**Files Affected:**
- `src/pages/Home.tsx` (subfilter options list)
- `src/utils/applyFilters.ts` (location subfilter heuristic)
**How to add a new subfilter:**
1) Add `{ key: '<new_key>' }` to the `locations` array in `Home.tsx`.
2) Extend the `synonyms` map for locations in `applyFilters.ts` to include the terms to match.
3) Run `npm run type-check && npm run lint`.

## Prevention Guidelines

### Markdown File Structure
1. **Canonical Structure for All Types:** All entity types (character, episode, group, food, location, fauna, etc.) must use the exact same markdown structure for UI blocks (CARD VIEW and EXPANDED VIEW), with summary and expanded content in ```md code blocks. No special-case logic or exceptions are allowed in the parsing script for any type.
2. **Separate Backend Metadata:** Always keep backend metadata separate from expanded view content
3. **Include Required Fields:** Ensure all entities have required fields (id, name, type, nation)
4. **Validate JSON Syntax:** Check for trailing commas and valid JSON structure
5. **Add Badges:** Include badges in card view section for characters
6. **Verify Image Paths:** Ensure image paths match actual files
7. **Use Correct Type:** Ensure location files use `type: location` in YAML frontmatter
8. **Use Correct Episode Type:** Ensure episode files use `type: episode` in YAML frontmatter
9. **Episode Image Fields:** Always include `image` field in episode JSON metadata (CRITICAL - prevents placeholder text)
10. **No Special-Case Parsing:** Never introduce type-specific parsing logic. All parsing and enrichment must be type-agnostic and use the same extraction logic for UI blocks.

### Script Architecture (2025 January Update)
1. **Type-Agnostic Only:** All scripts must use unified logic that works identically for all entity types
2. **No Special Cases:** Never introduce type-specific handling in any script (`scripts/1-parse-markdown.mjs`, `scripts/2-enrich-data.mjs`, `scripts/lib/enrichRecord.mjs`)
3. **Unified Processing:** All entity types must go through the same parsing and enrichment pipeline
4. **Canonical Structure Enforcement:** Any deviation from the canonical markdown structure is a build-breaking error
5. **Validation:** Pre-commit hooks validate type-agnostic processing
6. **Code Review:** All script changes must maintain type-agnostic architecture
7. **Documentation:** This cleanup is documented to prevent regression
8. **Testing:** All entity types are tested with the same processing pipeline

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