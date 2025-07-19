# ⚙️ Data Pipeline Workflow (2025 January Update)

The project uses a robust, two-stage pipeline to transform raw markdown data into a single, client-ready JSON file. All search indexing is now performed client-side for maximum reliability and transparency.

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
- For characters, the file must also include:
  - `## UI - CARD VIEW` block (summary fields)
  - `## UI - EXPANDED VIEW` block (detailed markdown)

### Template Exclusion System (2025 Update)

- **Automatic Exclusion:** Files in `templates/` subdirectories are automatically excluded from processing
- **Implementation:** Added filter in `scripts/1-parse-markdown.mjs` using pattern `!/[/\\\\]templates[/\\\\]/.test(p)`
- **Benefit:** Prevents template files from being parsed as real data entries
- **Pattern:** Any file path containing `/templates/` or `\templates\` is skipped

### Expanded View Processing (2025 Update)

- **Format Requirement:** Expanded view content must be wrapped in ```md code blocks
- **Parser Logic:** Extracts content between ```md and ``` markers
- **Validation:** Debug logging shows `[DEBUG] Found Expanded View block: true/false`
- **Common Issues:** Double ```md blocks prevent content from being parsed correctly
- **Fix Applied:** Removed duplicate ```md markers from all group files

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

### Stage 2: Enrich Data (`scripts/2-enrich-data.mjs`)
- Promotes UI-critical fields (e.g., image, role, nation) to the top level of each record.
- All other fields are placed in a `metadata` object.
- Uses helper functions from `scripts/lib/enrichRecord.mjs` for record processing.
- **NEW (2025):** Enhanced nation mapping and food category processing
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

---

## 4. Canonical Templates & Schema

See `docs/templates/character_template.md` for the full, up-to-date schema and required fields for all data types.

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
