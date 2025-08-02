# ⚙️ Data Pipeline Workflow (2025 January Update)

The project uses a robust, two-stage pipeline to transform raw markdown data into a single, client-ready JSON file. All search indexing is now performed client-side for maximum reliability and transparency.

---

## 🚨 Canonical Markdown Structure Rule (2025 Update)

**All entity types (character, episode, group, food, location, fauna, etc.) must use the exact same markdown structure for UI blocks.**
- No special-case logic or exceptions are allowed in the parsing script for any type.
- The parser expects the following canonical format for all types:
  - YAML frontmatter with `type` field (e.g., `type: character`, `type: episode`)
  - `## 🖼️ UI - CARD VIEW` section with `*(Presentation Layer 1 - Unchanged)*` comment and ```md code block containing summary fields
  - `## 📖 UI - EXPANDED VIEW` section with `*(Presentation Layer 2 - Unchanged)*` comment and ```md code block containing detailed markdown
  - `## ⚙️ BACKEND METADATA` section with description comment and ```json code blocks
  - `## 🧱 Semantic & Thematic Index` section with description comment and ```json code blocks
- **No entity type may use a different structure.**
- Any new types must follow this canonical structure exactly.
- **Warning:** Introducing type-specific parsing logic is forbidden. All parsing and enrichment must be type-agnostic and use the same extraction logic for UI blocks.

### Template Standardization (January 2025 Update)

**Status:** ✅ COMPLETED - All templates now follow consistent format
**Standardized Elements:**
- **Frontmatter:** `type: [category]` (removed extra fields)
- **Title Format:** `# [Emoji] ULTIMATE [CATEGORY] METADATA SCHEMA (v[version])`
- **Philosophy Statement:** Consistent placement and style
- **UI Card View:** `## 🖼️ UI - CARD VIEW` with `*(Presentation Layer 1 - Unchanged)*`
- **UI Expanded View:** `## 📖 UI - EXPANDED VIEW` with `*(Presentation Layer 2 - Unchanged)*`
- **Backend Metadata:** `## ⚙️ BACKEND METADATA` with consistent description
- **JSON Structure:** Multiple categorized blocks instead of single blocks
- **Semantic Index:** Consistent `## 🧱 Semantic & Thematic Index` section
- **Comments:** All sections include required comments and descriptions

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

### Central Tag Dictionary

All tags are validated against `src/data/tag_dictionary.json`. If a tag or alias
isn't found in this dictionary, the build fails. Each dictionary entry defines
its display name, category, optional aliases, weight, and implied tags.

### Search Aliases

Records may include a `searchAliases` array in their JSON metadata. These terms
are promoted to the top level and indexed alongside regular tags.

---

## 1. Data Authoring: Unified Markdown Format

- All data is authored in markdown files in `raw-data/`.
- Each file must begin with a YAML frontmatter block (`---`) containing a `type` field (e.g., `type: character`).
- The body must include at least one fenced JSON code block (```json) with structured data. All JSON blocks are merged.
- For all entity types, the file must also include:
  - `## 🖼️ UI - CARD VIEW` block with `*(Presentation Layer 1 - Unchanged)*` comment and summary fields
  - `## 📖 UI - EXPANDED VIEW` block with `*(Presentation Layer 2 - Unchanged)*` comment and detailed markdown
  - `## ⚙️ BACKEND METADATA` block with description comment and structured JSON
  - `## 🧱 Semantic & Thematic Index` block with description comment and filtering metadata

### Template Exclusion System (2025 Update)

- **Automatic Exclusion:** Files in `templates/` subdirectories are automatically excluded from processing
- **Implementation:** Added filter in `scripts/1-parse-markdown.mjs` using pattern `!/[/\\\\]templates[/\\\\]/.test(p)`
- **Benefit:** Prevents template files from being parsed as real data entries
- **Pattern:** Any file path containing `/templates/` or `\templates\` is skipped

### Episode Filtering & Book Field Structure (2025 January Update)

**Critical Implementation Detail:** Episodes have the `book` field at the top level of the enriched data, not in the metadata object.

#### Episode Data Structure:
```json
{
  "id": "episode-id",
  "name": "Episode Name",
  "type": "episode",
  "book": "Water", // ← TOP LEVEL FIELD
  "metadata": {
    // Other metadata fields
  }
}
```

#### Filtering Logic Requirements:
- **Book Field Location:** Episodes have `book` field at top level (`item.book`)
- **Filtering Logic:** Must check both `item.book` and `item.metadata?.book`
- **Book Values:** "Water" (Book 1), "Earth" (Book 2), "Fire" (Book 3)
- **Type Definition:** `EnrichedEntity` interface must include `book?: string`

#### Common Issues & Prevention:
- **Issue:** Filtering logic only checks `item.metadata?.book` but episodes have `item.book`
- **Solution:** Always check both locations in filtering logic
- **Prevention:** Update filtering logic to handle both field locations
- **Validation:** Ensure `EnrichedEntity` type includes `book?: string` field

#### Episode Filtering Implementation:
```typescript
// CORRECT: Check both locations
if (subFilterLower === 'book_1') {
  return item.book === 'Water' || item.metadata?.book === 'Water';
}
if (subFilterLower === 'book_2') {
  return item.book === 'Earth' || item.metadata?.book === 'Earth';
}
if (subFilterLower === 'book_3') {
  return item.book === 'Fire' || item.metadata?.book === 'Fire';
}
```

#### Episode Distribution:
- **Book 1 (Water):** ~20 episodes
- **Book 2 (Earth):** ~14 episodes  
- **Book 3 (Fire):** ~20 episodes
- **Total:** ~54 episodes with book metadata

#### Prevention Guidelines:
- **Always Check Both:** Filtering logic must check both `item.book` and `item.metadata?.book`
- **Type Safety:** Ensure `EnrichedEntity` interface includes `book?: string`
- **Testing:** Verify episode filtering works for all three books
- **Documentation:** This structure is documented to prevent future issues

### Location Type Support (January 2025 Update)

- **Parser Enhancement:** Updated `scripts/1-parse-markdown.mjs` to accept `type: location`
- **Issue Resolution:** Parser was only accepting `['character', 'group', 'food']` but locations use `type: location`
- **Fix Applied:** Added `'location'` to the supported types array: `['character', 'group', 'food', 'location']`
- **Result:** All 4 Air Temple locations now parse correctly and appear in the UI
- **Data Pipeline:** Locations go through the same enrichment process as other data types
- **UI Integration:** Locations display with proper type labels and nation filtering

### Episode Type Support (January 2025 Update)

- **Parser Enhancement:** Updated `scripts/1-parse-markdown.mjs` to accept `type: episode`
- **Issue Resolution:** Parser was only accepting `['character', 'group', 'food', 'location']` but episodes use `type: episode`
- **Fix Applied:** Added `'episode'` to the supported types array: `['character', 'group', 'food', 'location', 'episode']`
- **Result:** All episode files now parse correctly and appear in the UI
- **Data Pipeline:** Episodes go through the same enrichment process as other data types
- **UI Integration:** Episodes display with proper type labels and episode-specific metadata
- **Episode Structure:** Episodes follow the canonical markdown structure with card view and expanded view sections
- **Episode Metadata:** Includes book/season, episode number, air date, and narrative context
- **Validation:** Episode files are validated against the same standards as other entity types
- **Creation Process:** Episode creation requires data pipeline rebuild and development server restart

### Expanded View Processing (2025 Update)

- **Format Requirement:** Expanded view content must be wrapped in ```md code blocks
- **Parser Logic:** Extracts content between ```md and ``` markers for all types, with no exceptions
- **Validation:** Debug logging shows `[DEBUG] Found Expanded View block: true/false`
- **Common Issues:** Double ```md blocks prevent content from being parsed correctly
- **Fix Applied:** Removed duplicate ```md markers from all group files
- **No Special Cases:** The parser does not and must not treat any type differently. All types are parsed identically.

### Expanded View Parsing Fix (2025 January Update)

- **Issue Identified:** The parser's regex pattern was too strict and failed to match section headers that included emojis
- **Original Regex:** `/## [^\n]*UI - EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/`
- **Problem:** Headers like `## 📖 UI - EXPANDED VIEW` with emojis weren't being matched
- **Solution:** Updated regex to be more flexible: `/## [^\n]*EXPANDED VIEW[^\n]*[\s\S]*?```md\r?\n([\s\S]*?)```/`
- **Result:** All expanded view content now parses correctly regardless of emoji presence
- **Debug Logging:** Enhanced debug output shows `[DEBUG] Found Expanded View block: true/false` and content length
- **Validation:** Parser now correctly extracts expanded view content for all entity types

### Image Path Validation (2025 Update)

- **Requirement:** Image paths in JSON metadata must match actual filenames in `public/assets/images/`
- **Validation:** All image paths verified against actual files during processing
- **Common Issues:** Mismatched filenames (e.g., `order-of-the-white-lotus.jpg` vs `order-of-the-white-lotus.jpg`)
- **Fixes Applied:** Corrected image paths for Order of the White Lotus, Si Wong Tribes, and Water Tribe Military
- **Pattern:** `"image": "exact-filename.jpg"` must match actual file in assets directory

### JSON Syntax Validation (2025 Update)

- **Requirement:** All JSON blocks must have valid syntax
- **Common Issues:** Trailing commas in arrays and objects
- **Validation:** Parser checks for JSON syntax errors and reports them
- **Fixes Applied:** Removed trailing commas from all group files
- **Pattern:** No trailing commas in arrays `["item1", "item2"]` or objects `{"key": "value"}`

### Image Field Validation (2025 January Update)

- **Requirement:** All food items must have an `image` field in their JSON metadata
- **Common Issues:** Missing `image` field in food markdown files, even when image files exist
- **Validation:** Parser checks for required `image` field in food items
- **Syntax Errors:** Extra backticks in markdown files can prevent JSON parsing
- **Fixes Applied:** Added missing `image` fields to freeze-dried-cucumberquats, fried-fish-balls, and fried-foods-on-sticks
- **Pattern:** `"image": "exact-filename.jpg"` must be included in food JSON metadata
- **Syntax Fix:** Removed extra backticks that were preventing JSON blocks from being parsed correctly

### Episode Image Field Validation (2025 January Update)

- **Requirement:** All episode items must have an `image` field in their JSON metadata
- **Common Issues:** Missing `image` field in episode markdown files, even when image files exist
- **UI Impact:** Episodes without image fields show placeholder text ("WW", "WR") instead of images
- **Validation:** Parser checks for required `image` field in episode items
- **Fixes Applied:** Added missing `image` fields to winter-solstice-part-1-the-spirit-world and winter-solstice-part-2-avatar-roku
- **Pattern:** `"image": "exact-filename.jpg"` must be included in episode JSON metadata
- **Prevention:** Always include image field when creating new episode files

### Episode Creation Workflow (2025 January Update)

- **Process:** Episode creation requires specific workflow to ensure proper processing
- **File Creation:** Use exact template structure from `raw-data/episodes/templates/episode_template.md`
- **Image Field:** Always include `"image": "episode-filename.jpg"` in JSON metadata (CRITICAL)
- **Data Pipeline:** Run `npm run build:data` after creating episode file
- **Development Server:** Restart `npm run dev` to pick up new episode data
- **Timing Issue:** Episode files may not be included in initial processing run due to file system synchronization
- **Verification:** Check enriched data and UI to confirm episode appears correctly
- **Prevention:** Always rebuild data pipeline after creating new episode files

### Food Data Processing (2025 Update)

- **98 Food Items:** Complete food database with comprehensive categorization
- **12 Sub-Categories:** Beverages, desserts, soups, meat, vegetables, noodles, dumplings, preserved, street food, traditional, vegetarian, luxury, ceremonial, health, fire-themed, seafood
- **Nation Integration:** All food items have nation affiliations with symbols
- **Category Tags:** All food items categorized into appropriate sub-filters
- **Enrichment Process:** Maps region to nation, adds category tags, validates data integrity

---

## 2. The Automated Scripts & Data Flow

### Stage 1: Parse Markdown (`scripts/1-parse-markdown.mjs`)
- Reads YAML frontmatter, UI blocks, and all JSON blocks.
- Merges all data into a single object per file.
- **NEW (2025):** Automatically excludes template files using path filtering
- **NEW (2025):** Enhanced expanded view parsing with proper ```md block detection
- **NEW (2025):** JSON syntax validation with error reporting
- **NEW (January 2025):** Location type support for geographical data processing
- **NEW (January 2025):** Episode type support for narrative content processing
- **NEW (January 2025):** Flexible regex pattern for expanded view parsing with emoji support

### Stage 2: Enrich Data (`scripts/2-enrich-data.mjs`)
- Promotes UI-critical fields (e.g., image, role, nation) to the top level of each record.
- All other fields are placed in a `metadata` object.
- Uses helper functions from `scripts/lib/enrichRecord.mjs` for record processing.
- **NEW (2025):** Enhanced nation mapping and food category processing
- **NEW (January 2025):** Type-agnostic processing for all entity types
- **Output:** `public/enriched-data.json` (the only data file used by the frontend).

### Client-Side Indexing (In the Browser)
- The React app fetches `public/enriched-data.json` on load.
- The `useSearch` hook builds a FlexSearch index in-browser, using a `searchBlob` (concatenated searchable text) for each record.
- **No pre-built index is used or generated.**

---

## 3. How to Add or Update Data

1. **Create/Edit Markdown:** Follow the canonical format.
2. **Run the Build Script:**
   ```bash
   npm run build:data
   ```
3. **Check for Errors:** Watch the terminal for parsing/enrichment errors.
4. **Refresh the UI:** Hard refresh your browser to see changes.

### Validation Checklist (2025 Update)

Before running `npm run build:data`, ensure:
- [ ] All JSON blocks have valid syntax (no trailing commas)
- [ ] Image paths match actual files in `public/assets/images/`
- [ ] Expanded view content is wrapped in ```md blocks
- [ ] Template files are in `templates/` subdirectories
- [ ] All tags are single, underscore-joined words
- [ ] Food items have proper nation affiliations
- [ ] Food items are categorized into appropriate sub-filters
- [ ] Location files use `type: location` in YAML frontmatter
- [ ] Episode files include `image` field in JSON metadata (CRITICAL)
- [ ] Episode image filenames match actual files in `public/assets/images/`
- [ ] Episode creation workflow followed (create file → rebuild pipeline → restart server)

---

## 4. Canonical Templates & Schema

See `docs/templates/character_template.md` for the full, up-to-date schema and required fields for all data types. All templates must use the same structure for UI blocks, regardless of type.

### New Template Types (2025 Update)

- **Group Template:** `raw-data/groups/templates/group_template.md`
- **Food Template:** `raw-data/foods/templates/food_template.md`
- **Location Template:** `raw-data/locations/templates/location_template.md`
- **Episode Template:** `raw-data/episodes/templates/episode_template.md`

---

## 5. Enhanced Enrichment Features (2025 Update)

### Nation Integration
- **Region to Nation Mapping:** Automatically maps `region` field to `nation` field
- **Consistent Formatting:** Normalizes nation values to proper format (e.g., "Fire Nation", "Earth Kingdom")
- **Symbol Integration:** All entity types display nation symbols in UI cards
- **Validation:** Ensures all entities have proper nation affiliations

### Food Category Processing
- **12 Sub-Categories:** Comprehensive food categorization system
- **Tag-Based Filtering:** Uses food category tags for sub-filter functionality
- **Multi-Select Support:** Supports selecting multiple food categories
- **React Emoji Integration:** Each sub-filter includes React emoji with descriptive text labels
- **Comprehensive Coverage:** All 98 food items categorized into appropriate sub-filters

### Age and Gender Classification
- **Age Ranges:** Child, teen, young adult, adult, elder classification
- **Gender Classification:** Male/female classification with proper validation
- **Bender Classification:** Bender/nonbender classification with element specification
- **Animal Exclusion:** Automatically excludes animals from age/gender filters

### Enhanced Tag Processing
- **Lenient Tag Enrichment:** More user-friendly tag system with fallback to simpler tags
- **Tag Normalization:** Ensures all tags follow single-word, underscore-joined format
- **Comprehensive Coverage:** Tags cover all entity types and categories
- **Search Integration:** Tags are properly indexed for search functionality

---

## 6. Data Quality Assurance

### Validation Scripts
- **`scripts/validate-data.mjs`:** Validates data integrity and schema compliance
- **Image Path Validation:** Ensures all image references exist
- **Tag Dictionary Validation:** Verifies all tags are in the central dictionary
- **Required Field Validation:** Checks for missing required fields

### Error Reporting
- **Detailed Error Messages:** Specific error messages for each validation failure
- **Build Failure Prevention:** Prevents commits with broken data
- **Debug Logging:** Comprehensive logging for troubleshooting
- **Graceful Degradation:** Handles missing data gracefully in UI

### Data Statistics (2025 Update)
- **98 Food Items:** Complete food database with nation affiliations
- **67 Character Items:** Full character roster with age/gender/bender classification
- **12+ Group Items:** Comprehensive group coverage with nation symbols
- **12 Food Sub-Categories:** Comprehensive food filtering system
- **4 Nation Types:** Fire, Water, Earth, Air with PNG images and React icons

---

**Summary:**
- The only data file used by the frontend is `public/enriched-data.json`.
- All search and filtering is performed client-side, in-browser, using FlexSearch.
- The pipeline is strictly two-stage and robust, transparent, and easy to debug.
- **NEW (2025):** Template exclusion, enhanced expanded view processing, image path validation, JSON syntax validation, food category processing, and nation integration.
- **NEW (January 2025):** Episode type support, flexible regex parsing, image field validation, and type-agnostic script architecture.

## Performance Considerations

### Data Processing
- The pipeline processes all markdown files in parallel for efficiency
- Large datasets (>1000 items) may take several seconds to process
- Memory usage scales linearly with data size
- Consider chunking very large datasets for better performance

### Frontend Integration
- Matrix Rain uses `requestAnimationFrame` for smooth 60fps animation
- Data loading doesn't affect rain performance due to separate rendering contexts
- Large datasets may cause brief loading delays but don't impact visual effects
- Canvas rendering is hardware-accelerated and independent of data operations

### Food Data Optimization
- **98 Food Items:** Optimized processing for comprehensive food database
- **Category Tagging:** Efficient tag-based filtering system
- **Nation Integration:** Streamlined nation symbol display
- **Multi-Select Performance:** Optimized for multiple category selection

---

## 7. Cached Data Management & Troubleshooting (2025 January Update)

### Cached Data Issue Prevention
- **Problem:** Deleted markdown files can leave cached data in `data/parsed-data.json` and `public/enriched-data.json`
- **Solution:** Complete data pipeline rebuild
- **Prevention:** Always run `npm run build:data` after deleting any markdown files

### Script Cleanup & Type-Agnostic Architecture (2025 January Update)

**Major Cleanup Completed:** All scripts have been cleaned to remove special-case logic and ensure type-agnostic processing.

#### Cleanup Summary:
- **`scripts/lib/enrichRecord.mjs`:** Removed all episode-specific handling, food-specific type checks, and special-case logic
- **`scripts/1-parse-markdown.mjs`:** Already clean - uses unified regex for expanded view extraction
- **All Scripts:** Now use type-agnostic logic that works identically for all entity types

#### Removed Special-Case Logic:
1. **Episode-Specific Handling:** Removed episode-specific name handling (`record.title || record.name`)
2. **Episode-Specific Promotion:** Removed episode-specific expandedView promotion
3. **Episode-Specific Debugging:** Removed episode-specific debug logging
4. **Food-Specific Type Checks:** Removed food-specific region→nation mapping logic
5. **Food-Specific Category Handling:** Removed food-specific category tag handling

#### Type-Agnostic Architecture:
- **Unified Name Handling:** All types use the same name extraction logic
- **Unified Field Promotion:** All types use the same UI field promotion logic
- **Unified Region Mapping:** Region→nation mapping works for any type with a region field
- **Unified Category Handling:** Category tag handling works for any type with a category field
- **Unified Parsing:** All types use the same markdown code block extraction logic

#### Prevention Guidelines:
- **No Special Cases:** Never introduce type-specific logic in any script
- **Type-Agnostic Only:** All parsing and enrichment must work identically for all types
- **Unified Logic:** Use the same extraction and processing logic for all entity types
- **Canonical Structure:** All types must follow the exact same markdown structure
- **Validation:** Any deviation from type-agnostic processing is a build-breaking error

#### Enforcement:
- **Build Validation:** Pre-commit hooks validate type-agnostic processing
- **Code Review:** All script changes must maintain type-agnostic architecture
- **Documentation:** This cleanup is documented to prevent regression
- **Testing:** All entity types are tested with the same processing pipeline

### Template Exclusion System (2025 Update)