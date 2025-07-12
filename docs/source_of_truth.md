Of course! Here is the content formatted into a clean, readable, and visually appealing Markdown document with emojis, spacing, and other formatting improvements.

***

# 📘 Source of Truth: Data Pipeline Workflow

This is the canonical, always-up-to-date reference for how curated data flows from Markdown or JSON into the live UI. This system is built to be type-safe, scalable, and fully automatable across any entity type.

---

##  Workflow Steps

### 1. ✍️ Data Authoring: User Curates or Edits Data

*   **Format:**
    *   Use Markdown (`.md`) files for human-friendly editing.
    *   JSON (`.json`) files are also supported for structured input.

*   **Location:**
    *   Place files in `raw-data/[entity-type]/` (e.g., `raw-data/characters/mai.md`)

*   **Schema:**
    *   Every entity type has a schema in `raw-data/schema/*.schema.json`.
    *   All required fields must be present; optional fields are supported and passed through.

### 2. ⚙️ Parsing: Markdown → Raw JSON

*   **Script:** `npm run parse:characters` (or other domain equivalents)
*   **What it does:**
    *   Converts `.md` files into structured `.json` arrays (e.g., `raw-data/characters/characters.json`).
    *   Handles multi-line fields, lists, and complex formats.

### 3. 🛡️ Validation: Schema Check

*   **Script:** `npm run validate:data`
*   **What it does:**
    *   Validates all raw `.json` files against their respective schemas.
    *   Blocks the pipeline on missing required fields, type mismatches, or schema violations.

### 4. ✨ Enrichment: Normalize and Finalize

*   **Script:** `npm run enrich:data`
*   **What it does:**
    *   Adds a unique `id`, canonical `slug`, and `__type` field.
    *   Applies defaults for optional fields.
    *   Outputs final normalized data to `dist/enriched-data.json`.

### 5. 🔍 Indexing: Build UI-Ready Search Index

*   **Script:** `npm run build:index`
*   **What it does:**
    *   Reads from `dist/enriched-data.json` (never raw or public).
    *   Builds a FlexSearch index and a records map keyed by `slug`.
    *   Outputs the result to `public/search-index.json`.

### 6. 🖥️ UI Consumption: Live App Reads Indexed Data

*   **Client:** React app (see `src/search/ClientSearchEngine.ts`)
*   **How it works:**
    *   At runtime, the app loads `public/search-index.json`.
    *   Filtering, search, and display logic use the `__type` field to determine entity behavior.

---

## ✅ How to Maintain the Data Pipeline System

This section supersedes all others. Follow this precisely for updates or additions.

1.  **Edit or Add Data**
    *   **Format:** Use `.md` for easy editing, or `.json` if preferred.
    *   **Location:** Add to `raw-data/[entity]/` (e.g., `raw-data/characters/`).
    *   **Schema:** Follow `raw-data/schema/[type].schema.json` for the correct structure.

2.  **Parse Markdown to JSON**
    *   **Script:** `npm run parse:characters`

3.  **Validate Data**
    *   **Script:** `npm run validate:data`

4.  **Enrich Data**
    *   **Script:** `npm run enrich:data`

5.  **Build the Search Index**
    *   **Script:** `npm run build:index`

6.  **Run the Full Pipeline (Recommended)**
    *   **Script:** `npm run build:data`

7.  **Refresh the UI**
    *   Hard refresh your browser (`Ctrl + F5` or `Cmd + Shift + R`) to see live changes.

---

## 👍 Best Practices

*   Always run the full pipeline (`npm run build:data`) after editing or adding data.
*   Check the terminal for validation or enrichment errors.
*   **Never** edit `dist/enriched-data.json` or `public/search-index.json` directly.
*   To add a new entity type: Add a schema, a parser script, and enrichment logic.

---

## 🛠️ Troubleshooting

If a record is missing from the UI, check the following:

*   Confirm no schema or parse errors occurred in the terminal.
*   Check that the `__type` field exists in both `dist/enriched-data.json` and `public/search-index.json`.
*   Verify your client-side logic is filtering correctly using the `__type`.
*   **Always re-run the full pipeline after making any changes.**

---

> **Summary:** Edit markdown. Run the pipeline. Refresh the UI.

As long as you follow this system, your data will remain clean, robust, searchable, and production-grade.

*Last updated: 2024-06-09*