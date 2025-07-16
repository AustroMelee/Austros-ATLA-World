# ⚙️ The Data Pipeline Workflow (Updated & Current)

The project uses a modular pipeline to transform raw data into a client-ready format. This process is identical for all data types (characters, locations, etc.).

---

## 1. Data Authoring: The Unified Markdown Format

All data for the encyclopedia is authored in a unified markdown format. This structure is essential for the parser to work correctly.

### The Unifying Principle (MANDATORY)
- The single, unifying requirement for all data files is that they must begin with a YAML frontmatter block (`---`) at the absolute top of the file.
- The frontmatter must contain a `type` field (e.g., `type: character`).
- The body of the file must contain at least one fenced JSON code block (```json) containing structured data. The parser merges all JSON blocks into a single data object.

### File Location & Encoding
- **Location:** `raw-data/characters/[character-slug].md`, etc.
- **Encoding:** All files must be UTF-8 (without BOM) to prevent parser failure.

### Structure for Character Files (`type: character`)
This rich format is mandatory for all character files.
- **YAML Frontmatter:** Must contain `type: character`.
- **UI - CARD VIEW Block:** Must start with the heading `## UI - CARD VIEW`, followed by a fenced ```md block with a dash-prefixed list of summary fields (e.g., `- Name: Azula`, `- Role: Fire Nation Princess`).
- **UI - EXPANDED VIEW Block:** Must start with the heading `## UI - EXPANDED VIEW`, followed by a fenced ```md block with detailed markdown.
- **Backend Metadata Block(s):** One or more sections, each with a heading and a ```json block. At least one block must contain the `id` and `slug` fields.

### Structure for All Other Data Types (e.g., `type: location`)
- **YAML Frontmatter:** Must contain the appropriate type.
- **Backend Metadata Block(s):** At least one ```json block containing the required `id` and `slug` fields.

---

## 2. The Automated Scripts & The Frontend's Role

The pipeline is composed of two primary build scripts, which feed data to the frontend for final processing.

### Parse Markdown (`scripts/1-parse-markdown.mjs`):
- This is a universal parser. It reads the type from the YAML frontmatter.
- It extracts all UI fields (from CARD VIEW) and merges them with all JSON data into a single, comprehensive object for each file.

### Enrich Data (`scripts/2-enrich-data.mjs`):
- Reads the parsed data from the first step.
- "Promotes" UI-critical fields (like image, role, nation) to the top level of each record. This is essential for the UI to render cards correctly.
- Puts all other data into a `metadata` object.
- The final output is `public/enriched-data.json`. This is the only data file the frontend uses.

### Client-Side Indexing (In the Browser):
- The old `3-build-index.mjs` script is **no longer used** to build a search index.
- Instead, the React application fetches `public/enriched-data.json` on load.
- The `useSearch` hook then creates the search index in the browser. It does this by creating a `searchBlob` (a massive string of all searchable text) for each character and feeding it into FlexSearch.
- This architecture is more robust and prevents stale/broken index files.

---

## 3. How to Add or Update Data (The Full Pipeline)

1. **Create or Edit Markdown File:** Follow the required format precisely.
2. **Run the Build Script:** Open your terminal and run:
   ```bash
   npm run build:data
   ```
   This executes the parsing and enrichment scripts in the correct order.
3. **Check for Errors:** Watch the terminal for any parsing errors.
4. **Refresh UI:** Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R) to see the changes live.

---

## 4. Canonical Templates & Schema Adherence

(This section remains largely the same, as the source data format is unchanged.)

### Character Template (Canonical Example)

```markdown
---
type: character
---

## UI - CARD VIEW
````md
- Name: Example Character
- Role: Example Role
- Nation: Earth Kingdom
- Image: images/characters/example.png
- Short Description: A brief summary of the character.
````

## UI - EXPANDED VIEW
````md
### Overview
Detailed markdown content about the character.
````

🪪 Identity & Demographics
```json
{
  "id": "example-character",
  "slug": "example-character",
  "fullName": "Example Character",
  "titles": ["Title1"],
  "species": "human",
  "gender": "Female",
  "nationality": "Earth Kingdom"
}
```

(The rest of the template and warning sections remain valid.)
