# 📖 Source of Truth: Project Documentation (2024 Refactor)

This document is the canonical, always-up-to-date reference for how all data is authored, processed, and rendered in this project. The system is now fully unified, robust, and client-side.

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

## 🔍 Search Result Ordering & Tag Matching (2024 Update)

- The search engine now uses a robust result hierarchy for all tag-based queries:
  1. **Direct name match** (always ranked first; e.g., searching 'toph' puts Toph Beifong first if her name matches the query exactly)
  2. Exact tag match
  3. Gender/age/role match for gendered queries
  4. Main cast/primary role
  5. Partial tag match
  6. Other matches
- Partial tag matching means queries like 'knife' will match 'knife_thrower', but exact matches are always prioritized.
- - Exception: For mutually exclusive queries like 'male' and 'female', partial tag matching is skipped and only exact matches are allowed. This prevents cross-matching between these categories.
- **Note:** As of July 2024, the search logic guarantees that any direct name match will always be ranked above all tag or partial tag matches, regardless of tag boosting or other factors. This ensures that searching for a character by name always returns the correct entity as the top result.
- See `docs/search engine.md` for full details on the logic and rationale.

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
- **Data Flow:** See `docs/data flow.md` for the complete data flow including filtering system.
- **Troubleshooting:** See `docs/troubleshooting.md` for debugging steps and lessons learned.

---

**This documentation is always kept current with the codebase. All contributors must reference these docs before making changes.**

