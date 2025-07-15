## ⚙️ The Data Pipeline Workflow

The project uses a modular, three-stage pipeline to transform raw data into a searchable, client-ready application. This process is identical for all data types (characters, locations, etc.).

### 1. Data Authoring: The Unified Markdown Format

All data for the encyclopedia—characters, locations, fauna, food, etc.—is authored in a single, unified markdown format. This structure is essential for the parser to work correctly.

#### **The Unifying Principle (MANDATORY)**

The single, unifying requirement for **all** data files is that they **must begin with a YAML frontmatter block** (`---`) at the absolute top of the file (no preceding characters or blank lines).

-   That frontmatter block **must** contain a `type` field, which determines how the rest of the file is parsed (e.g., `type: character`, `type: location`).
-   The body of the file **must** contain at least one fenced JSON code block (` ```json `) containing structured data. The parser will merge all JSON blocks found in a file into a single, rich data object.

#### **File Location & Encoding**

-   **Location:** Data is organized by type in `raw-data/`.
    -   `raw-data/characters/[character-slug].md`
    -   `raw-data/locations/[location-slug].md`
-   **Encoding:** All files **must** be saved as **UTF-8 (without BOM)**. Some editors add an invisible Byte Order Mark (BOM) at the start of the file, which will cause the parser to fail. In VS Code, use "Save with Encoding" and choose "UTF-8".

#### **Structure for Character Files (`type: character`)**

To support the rich detail required for characters, the parser uses a specific structure. This format is mandatory for all character files.

1.  **YAML Frontmatter (MANDATORY):**
    *   Must be at the absolute top of the file.
    *   Must contain `type: character`.

2.  **UI - CARD VIEW Block (MANDATORY):**
    *   Must start with the exact heading: `## UI - CARD VIEW`.
    *   Must be followed by a fenced ` ```md ` code block containing a dash-prefixed list of summary fields (e.g., `- Name: Azula`).

3.  **UI - EXPANDED VIEW Block (MANDATORY):**
    *   Must start with the exact heading: `## UI - EXPANDED VIEW`.
    *   Must be followed by a fenced ` ```md ` code block containing detailed, human-readable markdown.

4.  **Backend Metadata Block(s) (MANDATORY):**
    *   Include one or more sections, each starting with a heading (e.g., `## 🪪 Identity & Demographics`) followed by a fenced ` ```json ` code block.
    *   **Required Fields:** At least one JSON block must contain the `id` and `slug` fields, which must match the file's slug.

#### **Structure for All Other Data Types (e.g., `type: location`)**

For any non-character data type, the structure is simpler but follows the same core principles.

1.  **YAML Frontmatter (MANDATORY):**
    *   Must be at the absolute top of the file.
    *   Must contain the appropriate `type` (e.g., `type: location`, `type: fauna`).

2.  **Human-Readable Content (Optional):**
    *   Use standard markdown (headings, lists, paragraphs) to write descriptive content.

3.  **Backend Metadata Block(s) (MANDATORY):**
    *   Include one or more fenced ` ```json ` code blocks containing the structured data.
    *   **Required Fields:** Every record must have an `id` and a `slug` field within one of its JSON blocks.

### 2. The Automated Scripts

The data pipeline is composed of three single-responsibility scripts.

1.  **Parse Markdown (`scripts/1-parse-markdown.mjs`)**: This is a universal parser. It first reads the `type` from the YAML frontmatter. If `type` is 'character', it expects the rich UI block structure. For all other types, it parses the body for JSON blocks.
2.  **Enrich Data (`scripts/2-enrich-data.mjs`)**: Reads parsed data and adds machine-generated fields like a `slug`.
3.  **Build Search Index (`scripts/3-build-index.mjs`)**: Reads enriched data to build the final client-ready FlexSearch index.

### 3. How to Add or Update Data (The Full Pipeline)

To prevent errors, always use the master script in `package.json` which executes all steps in the correct order.

1.  **Create or Edit Markdown File:** Follow the required format described above precisely.
2.  **Run the Full Pipeline:** Open your terminal and run:
    ```bash
    npm run build:data
    ```
3.  **Check for Errors:** Watch the terminal for any parsing errors or warnings.
4.  **Refresh UI:** Hard refresh your browser (`Ctrl+F5` or `Cmd+Shift+R`) to see the changes live.