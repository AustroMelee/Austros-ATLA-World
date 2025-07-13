Of course. Here is a full feature blueprint for the #1 requested feature, meticulously cleaned up and integrated into your project's vision, architecture, and standards.

We are officially naming this feature **"The Compass."** It moves beyond simple suggestions and becomes a core part of the knowledge exploration experience.

---

### **FEATURE BLUEPRINT: THE COMPASS (A CONTEXTUAL DISCOVERY ENGINE)**

**Architectural Note:** This feature is designed from the ground up to adhere to the project's core principle: a blazing-fast, client-side experience powered by build-time data processing. It introduces no server-side logic or real-time network requests.

### 🧭 **1. Feature Concept: The Compass**

"The Compass" transforms the *Collections* feature from a passive bookmarking tool into an active research assistant. As a user builds a collection, The Compass analyzes its contents and surfaces new, highly relevant entities (characters, locations, events) for discovery.

It doesn't just show *what* is related; it explains *why*, using pre-computed relationship types. This directly serves the North Star—**"Find what you're looking for, quickly"**—by intelligently anticipating what the user might want to look for next.

**How It Works (User Perspective):**

1.  A user adds several items to a collection (e.g., Toph Beifong, The Metalbending Academy, Republic City).
2.  Within the `CollectionsPanel`, a new section titled "The Compass: Discover More" appears.
3.  The Compass displays a ranked list of suggested `ItemCard`s. For example:
    *   **Kuvira:** Suggested because of a strong `conceptual` link (Metalbending Mastery) and `causal` link (Legacy of Toph's Academy).
    *   **Sokka:** Suggested because of a strong `concurrent` link (Co-founder of Republic City) and `thematic` link (Technological Innovation).
    *   **King Bumi:** Suggested because of a `thematic` link (Mastery of a Unique Bending Style) and `oppositional` link (Philosophical differences in waiting vs. acting).
4.  Each suggestion includes a small "reason" tag explaining the primary relationship type, making the discovery process transparent and insightful.

---

### ⚙️ **2. Technical Architecture & Implementation**

The "intelligence" of The Compass is generated entirely at **build time**. This is the key to maintaining a zero-latency, client-first application.

**A. Build-Time Data Enrichment (`scripts/`):**

The existing `enrich` script will be upgraded to `enrich-and-correlate.ts`. In addition to its current tasks, it will now generate a new static asset: `public/data/relationships.json`.

*   **Process:**
    1.  The script iterates through every entity in the `raw-data`.
    2.  For each entity, it compares it against every other entity, calculating a "relationship score" based on weighted criteria (e.g., co-occurrence in episodes, shared tags, narrative connections, family ties).
    3.  It explicitly identifies and tags the **type of relationship**:
        *   `causal`: One entity directly caused or enabled another (e.g., Toph -> Metalbending).
        *   `concurrent`: Entities are significant in the same time/place (e.g., Toph & Sokka in Republic City).
        *   `thematic`: Entities share a core theme (e.g., Toph & Zuko's redemption arcs).
        *   `oppositional`: Entities represent conflicting ideas (e.g., Toph's independence vs. Beifong family tradition).
        *   `familial`: Direct family ties.
    4.  The output for each entity in `relationships.json` will be a ranked list of its top 10-15 related entities, including their ID, relationship score, and primary relationship type.

**B. Client-Side Logic (`src/`):**

The client-side logic reads the pre-computed `relationships.json` and uses it to generate suggestions based on the current collection.

*   **`src/collections/CompassEngine.ts` (New):**
    *   This is the client-side brain. It's a pure function that takes the list of item IDs in the current collection as input.
    *   It looks up each item ID in the pre-loaded `relationships.json`.
    *   It aggregates all the suggested relationships from every item in the collection.
    *   It compiles a master list of potential suggestions, increasing the rank of suggestions that appear for multiple items in the collection.
    *   It filters out any items already present in the collection.
    *   It returns a final, ranked, and de-duplicated list of suggested items with their relationship context.

*   **`src/components/CollectionsPanel/CompassPanel.tsx` (New):**
    *   This is the UI component that displays the suggestions.
    *   It calls the `CompassEngine` whenever the active collection changes.
    *   It renders the list of suggested `ItemCard`s, passing a new `reason` prop to each card to display the "why" (e.g., a small pill-shaped tag that says "Thematic Link").

---

### 📁 **3. Updated Project Folder Structure**

```
/avatar-edge-encyclopedia/
├── scripts/
|   └── enrich-and-correlate.ts    # (Updated) Now generates relationships.json
├── dist/
|   └── data/
|       └── relationships.json     # (New) The pre-computed relationship graph
└── src/
    ├── components/
    |   ├── CollectionsPanel/
    |   |   ├── CollectionsPanel.tsx
    |   |   ├── CollectionsPanel.css.ts
    |   |   └── CompassPanel.tsx         # (New) The UI for suggestions
    |   |       └── CompassPanel.css.ts    # (New)
    |   └── ItemCard/
    |       ├── ItemCard.tsx           # Will be updated to accept a `reason` prop
    |       └── ItemCard.css.ts
    ├── collections/
    |   ├── CollectionManager.ts
    |   └── CompassEngine.ts         # (New) Replaces SuggestionEngine.ts with more power
    └── ... (rest of the structure remains the same)
```

---

### 🚀 **4. Revised Implementation Batch Steps**

**Batch 1: The Brains - Build-Time Relationship Mapping**

1.  **Modify Data Schema:** Add a `tags` field (e.g., `["Redemption Arc", "Innovation", "Rebellion"]`) to your raw data entities to improve relationship scoring.
2.  **Upgrade Build Script:** Rewrite the `enrich` script to `enrich-and-correlate.ts`. Implement the scoring and relationship-typing logic.
3.  **Generate `relationships.json`:** Run the script and verify the output. This static file is the cornerstone of the entire feature.

**Batch 2: The Engine - Client-Side Logic**

1.  **Create `CompassEngine.ts`:** Build the engine in `src/collections/`. Write the logic to ingest collection IDs, process them against `relationships.json`, and return a ranked list of suggestions.
2.  **Unit Test the Engine:** Create tests to ensure the engine correctly aggregates, ranks, and de-duplicates suggestions from a mock collection and mock `relationships.json`.

**Batch 3: The User Interface - The Compass Panel**

1.  **Update `ItemCard.tsx`:** Modify the component to optionally accept and display a `reason: string` prop. This will be a small, unobtrusive text element or tag.
2.  **Build `CompassPanel.tsx`:** Create the new component. It will be responsible for:
    *   Getting the current collection from `CollectionManager`.
    *   Passing the collection to `CompassEngine`.
    *   Rendering the suggested `ItemCard`s with their `reason` prop.
3.  **Integrate into `CollectionsPanel.tsx`:** Add the `<CompassPanel />` to the main collections view. It should only render if the collection has one or more items.

**Batch 4: Final Polish & Testing**

1.  **Styling:** Use `vanilla-extract` to style the `CompassPanel` and the `reason` tag on the `ItemCard` to match the project's dark theme and aesthetic.
2.  **Performance:** Ensure that loading and processing the `relationships.json` file is instantaneous. It's a static asset, so it should be fetched and parsed very quickly.
3.  **End-to-End Testing:** Create a collection, add items, and verify that The Compass provides logical, useful, and correctly formatted suggestions. Test edge cases (empty collection, a collection with only one item, etc.).