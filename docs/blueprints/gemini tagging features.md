## **Action Plan: Evolving to a Smarter Tagging & Search System**

### **Executive Summary**

The goal is to bridge the gap between how the *system* needs to store tags (`snake_case`) and how a *human* thinks and searches ("white lotus"). We will achieve this by introducing a **Tag Alias System** and a **Centralized Tag Dictionary**. This will make search smarter, results more relevant, and data entry more consistent, all without changing the fundamental architecture.

This plan is broken into four actionable phases, each building on the last.

---

### **Phase 1: The Foundation - The Tag Alias System**

This is the highest-impact change. It directly solves the problem of users not knowing the exact `snake_case` tag.

#### **1. The Concept:**
We will introduce a new metadata field, `searchAliases`, to the JSON blocks in our markdown files. This field will contain an array of human-friendly, multi-word phrases that map to the entity's official tags or identity.

#### **2. Actionable Steps:**

**A. Update the Markdown Schema:**
In your character templates and data, add a new JSON block or update an existing one for `searchAliases`.

**Example (`king-bumi.md`):**
```json
// In a new block or added to the "Semantic & Thematic Index" block
{
  "searchAliases": [
    "white lotus",
    "lotus order",
    "omashu king",
    "mad genius",
    "aangs friend"
  ]
}
```

**B. Update the Data Pipeline (`scripts/2-enrich-data.mjs`):**
Ensure the enrichment script promotes the `searchAliases` array to the top level of each record in `public/enriched-data.json`.

**C. Update the Search Hook (`src/hooks/useSearch.ts`):**
1.  **Index the New Field:** Add `searchAliases` to the list of fields that FlexSearch indexes.
    ```typescript
    // Inside useSearch.ts
    const index = new FlexSearch.Document({
      document: {
        id: 'id',
        index: ['name', 'role', 'tags', 'searchAliases', 'searchBlob'], // <-- Add searchAliases
      },
      // ...
    });
    ```
2.  **Update the Ranking Logic:** Treat a match in `searchAliases` as a high-priority match, almost as important as an exact tag match.

#### **3. Result:**
A user can now type **"white lotus"** into the search bar. The system will find it in King Bumi's `searchAliases` and return him as a top result. **The `snake_case` rule is preserved for the system, but invisible to the user.**

---

### **Phase 2: Intelligence & Consistency - The Centralized Tag Dictionary**

This phase makes the system smarter by understanding relationships between tags and makes data entry more consistent.

#### **1. The Concept:**
Create a single source of truth for all tags in the project: `src/data/tag_dictionary.json`. This file will define each tag's properties, including aliases, categories, and weights.

#### **2. Actionable Steps:**

**A. Create `tag_dictionary.json`:**
This file will be an object where keys are the `snake_case` tags.

**Example (`src/data/tag_dictionary.json`):**
```json
{
  "order_of_the_white_lotus": {
    "displayName": "Order of the White Lotus",
    "category": "affiliation",
    "aliases": ["white lotus", "lotus order"],
    "weight": 80,
    "description": "A secret society of masters dedicated to philosophy, beauty, and truth."
  },
  "main_cast": {
    "displayName": "Main Cast",
    "category": "narrative",
    "aliases": ["main character", "gaang"],
    "weight": 95,
    "description": "Core members of the main protagonist group."
  },
  "earthbender": {
    "displayName": "Earthbender",
    "category": "bending",
    "aliases": ["earth bender"],
    "weight": 50,
    "implies": ["earth_kingdom"] // <-- See Phase 3
  }
}
```
*Note: The `aliases` here are for the *tags themselves*, separate from the entity-specific aliases in Phase 1.*

**B. Update the Data Pipeline:**
- During the build (`npm run build:data`), the pipeline script should read `tag_dictionary.json`.
- It can validate that all tags used in the markdown files exist in the dictionary, flagging any "rogue" or misspelled tags. This enforces extreme consistency.

#### **3. Result:**
Tagging is no longer a free-form text entry problem. It's a "pick from a list of approved tags" problem, drastically improving data integrity. The `weight` property will become critical for ranking in the next phase.

---

### **Phase 3: Automation & Robustness - The Smart Data Pipeline**

This phase reduces manual work and makes the system infer information automatically.

#### **1. The Concept:**
Use the data pipeline and the new `tag_dictionary.json` to automatically add tags to entities based on other data fields.

#### **2. Actionable Steps:**

**A. Introduce an `implies` Property:**
As shown in the `tag_dictionary.json` example above, add an `implies` key. This defines tag hierarchies.

**B. Supercharge the Enrichment Script (`scripts/2-enrich-data.mjs`):**
Modify the script to perform "Tag Inference":
1.  **Read an entity's existing tags.**
2.  For each tag, look it up in `tag_dictionary.json`.
3.  If the tag has an `implies` array, automatically add the implied tags to the entity's tag list (if not already present).
    *   *Example:* If an entity has the `king_of_omashu` tag, and the dictionary says that implies `royalty` and `earth_kingdom_leader`, those tags are added automatically.
4.  **Infer from other fields:**
    *   If `isBender: true` and `bendingElement: "earth"`, automatically add the `earthbender` tag.
    *   If `moralAlignment: "chaotic good"`, automatically add the `chaotic_good` tag.

#### **3. Result:**
Data entry is simpler and less error-prone. An author only needs to add the most specific tags, and the system fills in the rest. Searching for "royalty" now correctly finds Bumi, even if no one ever manually added that specific tag to his file.

---

### **Phase 4: An Unbeatable User Experience**

This phase surfaces all the new intelligence to the user.

#### **1. The Concept:**
Upgrade the UI to use the new, richer data for a guided and more powerful search experience.

#### **2. Actionable Steps:**

**A. Implement Search Autocomplete:**
- As the user types in the search bar, provide suggestions.
- The suggestions should come from:
  - Entity names (e.g., "King Bumi")
  - `displayName` from the tag dictionary (e.g., "Order of the White Lotus")
  - `aliases` from the tag dictionary (e.g., "white lotus")

**B. Create a Faceted Search/Filter UI:**
- Since you have tag `category` data in the dictionary, you can build a powerful filter panel.
- Display a list of clickable tags, grouped by category:
  - **Affiliation:** [Order of the White Lotus], [Earth Kingdom]
  - **Narrative:** [Main Cast], [Antagonist]
  - **Bending:** [Earthbender], [Firebender]

**C. Improve "No Results" Screen:**
- If a search yields no results, use a fuzzy search algorithm (like Levenshtein distance) on the query against all `aliases` and `displayNames`.
- Suggest: *"Did you mean 'Fire Nation'?"*

---

### **Updated Result Ordering & Scoring**

With these changes, we can now create an even more sophisticated ranking algorithm in `useSearch.ts`.

**New Result Hierarchy (Highest Priority First):**

1.  **Direct Name Match:** (Unchanged) The absolute highest priority.
2.  **Entity-Specific Alias Match:** A match in an entity's `searchAliases` field. (e.g., searching "aangs friend" for Bumi).
3.  **Exact Tag Match (Weighted):** A match on an entity's tag. The score is boosted by the `weight` value from `tag_dictionary.json`. A match on `main_cast` (weight 95) will rank higher than a match on `earthbender` (weight 50).
4.  **Tag Alias Match (Weighted):** The query matches an `alias` from the tag dictionary. The score is also boosted by the tag's weight.
5.  **Partial Tag/Alias Match:** (Unchanged) Substring matches, ranked lower.
6.  **Search Blob Match:** Generic matches in the full-text blob, ranked lowest.

This new hierarchy ensures that searches are not just accurate, but also contextually relevant, always bubbling the most important results to the top.