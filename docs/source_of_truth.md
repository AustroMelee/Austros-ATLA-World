# 📖 Source of Truth: Project Documentation (2024 Refactor)

This document is the canonical, always-up-to-date reference for how all data is authored, processed, and rendered in this project. The system is now fully unified, robust, and client-side.

---

## Key Principles
- **Single Source of Truth:** All data is authored in markdown, processed by the two-stage pipeline, and output as `public/enriched-data.json`.
- **Client-Side Search:** All indexing and search logic is performed in-browser using FlexSearch and the `useSearch` hook.
- **No Pre-Built Index:** The app does not use or generate a pre-built search index file.
- **Strict Schema Adherence:** All data must follow the canonical schema in `docs/templates/character_template.md`.

---

## Canonical References
- **Data Pipeline:** See `docs/data pipeline.md` for the full authoring and build process.
- **Search Engine:** See `docs/search engine.md` for the client-side search architecture.
- **Frontend Architecture:** See `docs/frontend architecture.md` for the React component structure and data flow.
- **Troubleshooting:** See `docs/troubleshooting.md` for debugging steps and lessons learned.

---

**This documentation is always kept current with the codebase. All contributors must reference these docs before making changes.**

