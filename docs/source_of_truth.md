# 📖 Source of Truth: Project Documentation (2025 January Update)

This document is the canonical, always-up-to-date reference for how all data is authored, processed, and rendered in this project. The system is now fully unified, robust, and client-side with comprehensive support for multiple data types.

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

## 🔍 Search Result Ordering & Tag Matching (2025 Update)

- The search engine now uses a robust result hierarchy for all tag-based queries:
  1. **Direct name match** (always ranked first; e.g., searching 'toph' puts Toph Beifong first if her name matches the query exactly)
  2. Exact tag match
  3. Gender/age/role match for gendered queries
  4. Main cast/primary role
  5. Partial tag match
  6. Other matches
- Partial tag matching means queries like 'knife' will match 'knife_thrower', but exact matches are always prioritized.
- Exception: For mutually exclusive queries like 'male' and 'female', partial tag matching is skipped and only exact matches are allowed. This prevents cross-matching between these categories.
- **Note:** As of January 2025, the search logic guarantees that any direct name match will always be ranked above all tag or partial tag matches, regardless of tag boosting or other factors. This ensures that searching for a character by name always returns the correct entity as the top result.
- See `docs/search engine.md` for full details on the logic and rationale.

---

## 📊 Supported Data Types (2025 Update)

The system now supports multiple data types beyond characters:

### Characters (`type: character`)
- **Location:** `raw-data/characters/`
- **Template:** `raw-data/characters/templates/character_template.md`
- **Total:** 67 characters
- **Features:** Full character profiles with expanded views, images, and comprehensive metadata

### Groups (`type: group`)
- **Location:** `raw-data/groups/`
- **Template:** `raw-data/groups/templates/group_template.md`
- **Total:** 12 groups
- **Features:** Organizational profiles with leadership, membership, and historical data
- **Groups:** Dai Li, Order of the White Lotus, Team Avatar, Water Tribe Military, Fire Nation Military, Earth Kingdom Military, Si Wong Tribes, Kyoshi Warriors, Freedom Fighters, Yuyan Archers, Rough Rhinos, Southern Raiders

### Foods (`type: food`)
- **Location:** `raw-data/foods/`
- **Template:** `raw-data/foods/templates/food_template.md`
- **Features:** Culinary data with ingredients, cultural significance, and regional information

### Locations (`type: location`)
- **Location:** `raw-data/locations/`
- **Template:** `raw-data/locations/templates/location_template.md`
- **Features:** Geographical and historical data with notable events and cultural significance

### Episodes (`type: episode`)
- **Location:** `raw-data/episodes/`
- **Template:** `raw-data/episodes/templates/episode_template.md`
- **Features:** Narrative data with plot points, character focus, and thematic analysis

---

## 🔧 Data Pipeline Enhancements (2025 Update)

### Template Exclusion System
- **Parser Enhancement:** The markdown parser now automatically excludes files in `templates/` subdirectories
- **Implementation:** Added filter in `scripts/1-parse-markdown.mjs` to skip template files
- **Benefit:** Prevents template files from being parsed as real data entries
- **Pattern:** `!/[/\\\\]templates[/\\\\]/.test(p)`

### Expanded View Processing
- **Format Requirement:** Expanded view content must be wrapped in ```md code blocks
- **Parser Logic:** Extracts content between ```md and ``` markers
- **Validation:** Debug logging shows `[DEBUG] Found Expanded View block: true/false`
- **Issue Resolution:** Fixed double ```md blocks in group files that prevented content display

### Image Path Validation
- **Requirement:** Image paths in JSON metadata must match actual filenames in `public/assets/images/`
- **Validation:** All image paths verified against actual files
- **Fixes Applied:** Corrected image paths for Order of the White Lotus, Si Wong Tribes, and Water Tribe Military
- **Pattern:** `"image": "exact-filename.jpg"` must match actual file

### JSON Syntax Validation
- **Requirement:** All JSON blocks must have valid syntax
- **Common Issues:** Trailing commas in arrays and objects
- **Validation:** Parser checks for JSON syntax errors and reports them
- **Fixes Applied:** Removed trailing commas from all group files

---

## 🎯 UI Component Updates (2025 Update)

### Dynamic Type Labels
- **Component:** `src/components/ItemCard/ItemCardCollapsed.tsx`
- **Enhancement:** Dynamic type detection instead of hardcoded "Character"
- **Logic:** Displays "Group", "Location", "Food", "Fauna", "Spirit", or "Character" based on item type
- **Accessibility:** Updated aria-label from "Character details" to "Item details"

### Collections System Integration
- **Components:** `CollectionCardButton`, `AddToCollectionPopover`, `CreateCollectionModal`, `CollectionsSidebar`
- **Features:** Matrix-themed styling with CRT green glow effects
- **Storage:** Client-side localStorage persistence
- **Integration:** Seamlessly integrated with existing card system

### Filter System Enhancement
- **Component:** `src/components/Filters/FilterBar.tsx`
- **Update:** Replaced 'bending' filter with 'groups' filter
- **Logic:** Updated `typeMap` in `HomeContainer.tsx` to map 'groups' to 'group' type
- **Integration:** Groups now appear when "Groups" filter is selected

---

## Key Principles
- **Single Source of Truth:** All data is authored in markdown, processed by the two-stage pipeline, and output as `public/enriched-data.json`.
- **Client-Side Search:** All indexing and search logic is performed in-browser using FlexSearch and the `useSearch` hook.
- **No Pre-Built Index:** The app does not use or generate a pre-built search index file.
- **Strict Schema Adherence:** All data must follow the canonical schema in `docs/templates/character_template.md`.
- **Template Exclusion:** Template files are automatically excluded from data processing.
- **Image Path Validation:** All image paths must match actual files in the assets directory.
- **JSON Syntax Compliance:** All JSON blocks must have valid syntax without trailing commas.

---

## Canonical References
- **Data Pipeline:** See `docs/data pipeline.md` for the full authoring and build process.
- **Search Engine:** See `docs/search engine.md` for the client-side search architecture.
- **Frontend Architecture:** See `docs/frontend architecture.md` for the React component structure and data flow.
- **Data Flow:** See `docs/data flow.md` for the complete data flow including filtering system.
- **Troubleshooting:** See `docs/troubleshooting.md` for debugging steps and lessons learned.

---

**This documentation is always kept current with the codebase. All contributors must reference these docs before making changes.**

