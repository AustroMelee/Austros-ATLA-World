# ⚙️ Data Pipeline Workflow (2024 Refactor)

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

---

## 2. The Automated Scripts & Data Flow

### Stage 1: Parse Markdown (`scripts/1-parse-markdown.mjs`)
- Reads YAML frontmatter, UI blocks, and all JSON blocks.
- Merges all data into a single object per file.

### Stage 2: Enrich Data (`scripts/2-enrich-data.mjs`)
- Promotes UI-critical fields (e.g., image, role, nation) to the top level of each record.
- All other fields are placed in a `metadata` object.
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

---

## 4. Canonical Templates & Schema

See `docs/templates/character_template.md` for the full, up-to-date schema and required fields for all data types.

---

**Summary:**
- The only data file used by the frontend is `public/enriched-data.json`.
- All search and filtering is performed client-side, in-browser, using FlexSearch.
- The pipeline is strictly two-stage and robust, transparent, and easy to debug.
