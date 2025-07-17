 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/docs/data pipeline.md b/docs/data pipeline.md
index fda95206468d283a1dd7e77d4f024c0e6cafbbdf..c2f2cb976a061616331d5c6abb87e99d293b5192 100644
--- a/docs/data pipeline.md	
+++ b/docs/data pipeline.md	
@@ -1,43 +1,54 @@
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
 
+### Central Tag Dictionary
+
+All tags are validated against `src/data/tag_dictionary.json`. If a tag or alias
+isn't found in this dictionary, the build fails. Each dictionary entry defines
+its display name, category, optional aliases, weight, and implied tags.
+
+### Search Aliases
+
+Records may include a `searchAliases` array in their JSON metadata. These terms
+are promoted to the top level and indexed alongside regular tags.
+
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
diff --git a/docs/file index.md b/docs/file index.md
index ee224f756ff455b6b5fc7ead9401747a6a238074..846c318472333a63aa85fd8b621532cc773dff35 100644
--- a/docs/file index.md	
+++ b/docs/file index.md	
@@ -1,41 +1,44 @@
 # 📁 File Index (2024 Refactor)
 
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
 
+The dictionary of allowed tags lives in `src/data/tag_dictionary.json`. Aliases
+defined there are treated the same as the canonical tag during search.
+
 ---
 
 ## Root Configuration & Metadata
 | File | Description |
 |------|-------------|
 | README.md | Project overview and setup instructions. |
 | package.json | Node project manifest. Defines scripts like `build:data` for the data pipeline. |
 | package-lock.json | Exact dependency versions for reproducible installs. |
 | vite.config.ts | Vite build config (React plugin, PWA, module aliases). |
 | tailwind.config.js | Tailwind CSS theme and typography customization. |
 | postcss.config.cjs | PostCSS plugins (autoprefixer) for Tailwind. |
 | tsconfig.json | Main TypeScript compiler settings for the project. |
 | tsconfig.node.json | TypeScript config for Node.js scripts in `scripts/`. |
 | .eslintrc.json | ESLint rules for code quality. |
 | index.html | Main HTML entry point for the Vite application. |
 
 ---
 
 ## Documentation (`docs/`)
 | File | Description |
 |------|-------------|
 | docs/data pipeline.md | **Source of Truth.** Details the two-stage pipeline for processing markdown into `enriched-data.json`. |
 | docs/frontend architecture.md | **Source of Truth.** Describes the React component structure and data flow. |
 | docs/search engine.md | **Source of Truth.** Explains the client-side indexing and search architecture. |
 | docs/troubleshooting.md | **Source of Truth.** Practical guide for debugging data and UI issues. |
diff --git a/docs/search engine.md b/docs/search engine.md
index 14bb53eb8363e74496c6f474d37739ed28a16bc3..7a27afd9d99bd41df288a72a6c0673beeeb3b797 100644
--- a/docs/search engine.md	
+++ b/docs/search engine.md	
@@ -1,65 +1,65 @@
 # 🔍 Encyclopedia Search Engine: Client-Side Architecture (2024 Refactor)
 
 ## Overview
 
 The search engine is now fully client-side, leveraging FlexSearch to build and query a full-text index in the user's browser. This eliminates build-time index errors and ensures the UI always works with the latest data.
 
 ---
 
 ## 1. Data Flow & Indexing
 
 - **Source Data:** All data is authored in markdown, parsed and enriched into `public/enriched-data.json` by the data pipeline.
 - **Frontend:**
   - On load, the app fetches `public/enriched-data.json`.
   - The `useSearch` hook (see `src/hooks/useSearch.ts`) receives the full data array and the user's query.
   - The hook uses a preprocessor (`src/search/preprocessor.ts`) to create a `searchBlob` for each record (concatenating all searchable fields).
-  - FlexSearch builds an in-memory index on fields like `name`, `role`, `tags`, and the `searchBlob`.
+  - FlexSearch builds an in-memory index on fields like `name`, `role`, `tags`, `searchAliases`, and the `searchBlob`.
   - All searching and filtering is performed in-browser, with results mapped back to the full entity objects for display.
 
 ---
 
 ## 2. Key Files & Responsibilities
 
 - **`src/hooks/useSearch.ts`:**
   - Orchestrates client-side indexing and searching.
   - Memoizes the index for performance.
   - Returns results in the format expected by the UI.
 - **`src/search/preprocessor.ts`:**
   - Defines which fields are included in the `searchBlob`.
   - To add a new searchable field, add it to the `textParts` array in `createSearchBlob`.
 - **`public/enriched-data.json`:**
   - The only data file used by the frontend. If a record is present here, it will be indexed and searchable.
 
 ---
 
 ## 3. Result Ordering & Tag Matching Logic (2024 Update)
 
 - **Result Hierarchy:**
   - Results are ordered by a robust scoring system:
     1. **Direct name match** (e.g., searching 'toph' puts Toph Beifong first if her name matches the query exactly).
-    2. **Exact tag match** (e.g., searching 'bear' puts Bosco first if he has the tag 'bear').
+    2. **Exact tag or alias match** (e.g., searching 'white lotus' matches any entry tagged `order_of_the_white_lotus`).
     3. **Gender/age/role match** for gendered queries (e.g., 'boy', 'girl', 'male', 'female' boost characters with matching gender and age/role).
     4. **Main cast/primary role** (e.g., tags like 'protagonist', 'main', 'main_cast', 'lead').
     5. **Partial tag match** (e.g., searching 'knife' matches 'knife_thrower').
     6. **Other matches** (fallback).
   - **Note:** As of July 2024, the search logic guarantees that any direct name match will always be ranked above all tag or partial tag matches, regardless of tag boosting or other factors. This ensures that searching for a character by name always returns the correct entity as the top result.
   - The logic is modular and can be extended for future improvements.
 
 - **Partial Tag Matching:**
   - The search engine supports partial tag matching: if a query is a substring of a tag, the entity will be included in results (e.g., 'knife' matches 'knife_thrower').
   - However, exact matches are always prioritized above partials.
   - **Exception:** For mutually exclusive queries like 'male' and 'female', partial tag matching is completely skipped—only exact matches are allowed. This prevents 'female' from matching 'male' as a substring, and vice versa. All other queries retain partial tag matching as before.
   - This makes the search both flexible and precise, supporting discovery and typo-tolerance while keeping the most relevant results at the top.
 
 ---
 
 ## 4. Debugging & Extending Search
 
 - **To add a new searchable field:**
   - Update `createSearchBlob` in `preprocessor.ts` to include the new field.
   - Rebuild the data pipeline and refresh the app.
 - **To debug missing results:**
   - Check that the field is present in `enriched-data.json`.
   - Add a `console.log` in `preprocessor.ts` to inspect the `searchBlob` for a specific record.
   - Ensure the FlexSearch index in `useSearch.ts` includes the field.
 
diff --git a/docs/templates/character_template.md b/docs/templates/character_template.md
index c98564e4f74b91f40728d8685d0ea429f92a4685..ed6a778dbd6c5f656dc156ac46a82f40f7068224 100644
--- a/docs/templates/character_template.md
+++ b/docs/templates/character_template.md
@@ -227,28 +227,29 @@
   "tagCategories": {
     "narrativeTags": "string[]",
     "combatTags": "string[]",
     "relationshipTags": "string[]",
     "emotionTags": "string[]",
     "politicalTags": "string[]",
     "arcTags": "string[]",
     "worldTags": "string[]",
     "triviaTags": "string[]"
   }
 }
 ```
 
 ---
 
 ## 🔮 AI/Filtering & System Flags
 
 ```json
 {
   "relatedCards": "string[]", // Pre-computed primary relationships
   "filterWeight": "number (0-100)", // Importance in general search results
   "canonicalImportance": "core | primary | secondary | tertiary | background",
   "dataCompletenessScore": "number (0.0-1.0)", // For internal maintenance
   "searchableKeywords": "string[]", // Stemmed, lower-cased keywords
   "fuzzySynonyms": "string[]", // e.g., "the blue spirit", "zuko's mom"
+  "searchAliases": "string[]", // Extra terms indexed equally with tags
   "isSuggestedInXContext": "string[]" // For future context-aware suggestions
 }
 ```
\ No newline at end of file
diff --git a/public/enriched-data.json b/public/enriched-data.json
index 9b7fa9a16755268a76d19340e54061922ca02607..44781850653f0f4e00e0a2b5b2bef8189f8b6ca3 100644
--- a/public/enriched-data.json
+++ b/public/enriched-data.json
@@ -34,51 +34,51 @@
       "bridge_to_spirit_world",
       "the_boy_in_the_iceberg",
       "mastering_the_elements",
       "defeat_of_ozai",
       "the_promise",
       "air_nomads",
       "southern_air_temple",
       "team_avatar",
       "republic_city",
       "112_years_old",
       "yip_yip",
       "twinkle_toes",
       "marble_trick",
       "vegetarian",
       "male"
     ],
     "nation": "Air Nomads",
     "role": "Avatar",
     "gender": "male",
     "species": "human",
     "nationality": "Air Nomads",
     "ethnicity": "Air Nomad",
     "titles": [
       "Avatar"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nDiscovered frozen in an iceberg after a hundred years, Aang awakens to a world where his people have been annihilated and the Fire Nation is on the brink of total victory. Burdened with the immense responsibility of being the Avatar, Aang must master the four elements and defeat the tyrannical Fire Lord Ozai. His journey is one of maturation, as he struggles to reconcile his pacifist nature with the grim duties of his role, ultimately finding a new way to restore balance without sacrificing his principles.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Mastered all four elements in under a year.\r\n- Learned the rare art of Energybending from a Lion Turtle.\r\n- Defeated Fire Lord Ozai by taking away his bending, ending the Hundred Year War.\r\n- Co-founded the United Republic of Nations and its capital, Republic City.\r\n- Restored the Air Nomad culture by training the Air Acolytes.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe protagonist of the series. His journey from a reluctant, playful child to a fully realized Avatar is the central arc of the narrative, driving the entire plot forward as he gathers allies and confronts the Fire Nation.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Katara** – His closest friend, teacher, and eventual life partner.\r\n- **Sokka** – His first human friend after the iceberg; a loyal, strategic, and brotherly figure.\r\n- **Zuko** – Began as a relentless hunter, became his firebending master and a crucial ally.\r\n- **Appa & Momo** – His loyal animal companions, representing his last living ties to his past.\r\n- **Monk Gyatso** – His mentor and father figure from the Southern Air Temple.\r\n- **Toph Beifong** – His earthbending master and a steadfast, tough-as-nails friend.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Pacifist and deeply spiritual.\r\n- Naturally playful, optimistic, and sometimes goofy.\r\n- Immensely powerful, especially in the Avatar State.\r\n- Carries the heavy emotional weight of being the last of his kind.\r\n- Creative and an expert glider.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"When we hit our lowest point, we are open to the greatest change.\"\r\n- \"Yip yip!\"\r\n- \"The monks taught me that all life is sacred. Even the life of a tyrant.\"",
+    "expandedView": "### 📖 Overview\n\nDiscovered frozen in an iceberg after a hundred years, Aang awakens to a world where his people have been annihilated and the Fire Nation is on the brink of total victory. Burdened with the immense responsibility of being the Avatar, Aang must master the four elements and defeat the tyrannical Fire Lord Ozai. His journey is one of maturation, as he struggles to reconcile his pacifist nature with the grim duties of his role, ultimately finding a new way to restore balance without sacrificing his principles.\n\n### ✨ Narrative Highlights\n\n- Mastered all four elements in under a year.\n- Learned the rare art of Energybending from a Lion Turtle.\n- Defeated Fire Lord Ozai by taking away his bending, ending the Hundred Year War.\n- Co-founded the United Republic of Nations and its capital, Republic City.\n- Restored the Air Nomad culture by training the Air Acolytes.\n\n### 🎭 Role in the Story\n\nThe protagonist of the series. His journey from a reluctant, playful child to a fully realized Avatar is the central arc of the narrative, driving the entire plot forward as he gathers allies and confronts the Fire Nation.\n\n### 🤝 Relationships\n\n- **Katara** – His closest friend, teacher, and eventual life partner.\n- **Sokka** – His first human friend after the iceberg; a loyal, strategic, and brotherly figure.\n- **Zuko** – Began as a relentless hunter, became his firebending master and a crucial ally.\n- **Appa & Momo** – His loyal animal companions, representing his last living ties to his past.\n- **Monk Gyatso** – His mentor and father figure from the Southern Air Temple.\n- **Toph Beifong** – His earthbending master and a steadfast, tough-as-nails friend.\n\n### 🌟 Notable Traits\n\n- Pacifist and deeply spiritual.\n- Naturally playful, optimistic, and sometimes goofy.\n- Immensely powerful, especially in the Avatar State.\n- Carries the heavy emotional weight of being the last of his kind.\n- Creative and an expert glider.\n\n### 💬 Notable Quotes\n\n- \"When we hit our lowest point, we are open to the greatest change.\"\n- \"Yip yip!\"\n- \"The monks taught me that all life is sacred. Even the life of a tyrant.\"",
     "metadata": {
       "shortdescription": "A fun-loving, 12-year-old boy and the last Airbender, Aang is the current incarnation of the Avatar, a master of all four elements destined to bring balance to a world ravaged by a hundred-year war.",
       "slug": "aang",
       "fullName": "Aang",
       "aliases": [
         "The Avatar",
         "Twinkle Toes (by Toph)"
       ],
       "ageChronological": 112,
       "ageBiological": 12,
       "ageRange": "child",
       "birthDate": "12 BG",
       "deathDate": "153 AG",
       "nativeLocation": "Southern Air Temple",
       "socioeconomicStanding": "monastic",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "all",
       "bendingProficiency": "master",
       "advancedBending": [
         "Avatar State",
         "Energybending",
         "Seismic Sense (via shoes)"
@@ -350,51 +350,51 @@
       "fearful",
       "trusting",
       "frozen_in_iceberg",
       "appas_lost_days",
       "lake_laogai_rescue",
       "air_nomads",
       "eastern_air_temple",
       "sky_bison",
       "si_wong_desert",
       "ten_tons",
       "eats_hay",
       "afraid_of_fire",
       "voiced_by_dee_bradley_baker",
       "six_legs",
       "male"
     ],
     "nation": "Air Nomads",
     "role": "Animal Companion",
     "gender": "male",
     "species": "Sky Bison",
     "nationality": "Eastern Air Temple",
     "ethnicity": "Air Nomad (species)",
     "titles": [
       "Avatar's Animal Guide"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nChosen by Aang as a young calf, Appa shares an unbreakable bond with the Avatar, having been frozen alongside him for a century. More than just transportation, Appa is a powerful airbender, a fierce protector, and a beloved member of the found family of Team Avatar. His harrowing journey after being kidnapped and subsequent reunion with Aang highlights his resilience, intelligence, and deep loyalty.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Froze in an iceberg with Aang for 100 years.\r\n- Endured a traumatic solo journey across the Earth Kingdom after being kidnapped.\r\n- Was instrumental in the defeat of Long Feng and the Dai Li in Ba Sing Se.\r\n- Served as the steadfast transport and muscle for Team Avatar throughout the war.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe Avatar's loyal animal guide, providing transportation, combat support, and serving as a living, breathing connection to Aang's lost culture.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Aang** – Best friend, rider, lifelong companion.\r\n- **Momo** – Friend and fellow animal companion.\r\n- **Team Avatar** – His found family.\r\n- **Zuko** – Freed him from captivity.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Loyal and gentle.\r\n- Brave, protective, and intelligent.\r\n- Fearful of fire and being underground.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- (Communicates through expressive growls, groans, and sneezes)",
+    "expandedView": "### 📖 Overview\n\nChosen by Aang as a young calf, Appa shares an unbreakable bond with the Avatar, having been frozen alongside him for a century. More than just transportation, Appa is a powerful airbender, a fierce protector, and a beloved member of the found family of Team Avatar. His harrowing journey after being kidnapped and subsequent reunion with Aang highlights his resilience, intelligence, and deep loyalty.\n\n### ✨ Narrative Highlights\n\n- Froze in an iceberg with Aang for 100 years.\n- Endured a traumatic solo journey across the Earth Kingdom after being kidnapped.\n- Was instrumental in the defeat of Long Feng and the Dai Li in Ba Sing Se.\n- Served as the steadfast transport and muscle for Team Avatar throughout the war.\n\n### 🎭 Role in the Story\n\nThe Avatar's loyal animal guide, providing transportation, combat support, and serving as a living, breathing connection to Aang's lost culture.\n\n### 🤝 Relationships\n\n- **Aang** – Best friend, rider, lifelong companion.\n- **Momo** – Friend and fellow animal companion.\n- **Team Avatar** – His found family.\n- **Zuko** – Freed him from captivity.\n\n### 🌟 Notable Traits\n\n- Loyal and gentle.\n- Brave, protective, and intelligent.\n- Fearful of fire and being underground.\n\n### 💬 Notable Quotes\n\n- (Communicates through expressive growls, groans, and sneezes)",
     "metadata": {
       "shortdescription": "Avatar Aang's loyal, ten-ton sky bison and lifelong animal companion. As the primary mode of transportation for Team Avatar, he is a living symbol of the lost Air Nomad civilization.",
       "fullName": "Appa",
       "aliases": [],
       "ageChronological": 112,
       "ageBiological": 12,
       "ageRange": "teen",
       "birthDate": "c. 12 BG",
       "deathDate": null,
       "nativeLocation": "Eastern Air Temple",
       "currentLocation": "Deceased",
       "socioeconomicStanding": "monastic",
       "languagesSpoken": [
         "Sky Bison Language"
       ],
       "isBender": true,
       "bendingElement": "air",
       "bendingProficiency": "master",
       "advancedBending": [],
       "nonBendingSkills": [
         "immense physical strength",
         "high endurance",
         "swimming"
       ],
       "uniqueTechniques": [
@@ -1118,51 +1118,51 @@
       "fall_of_ba_sing_se",
       "mental_breakdown",
       "hunted_the_avatar",
       "hunted_her_mother",
       "kemurikage_plot",
       "fire_nation_royalty",
       "dai_li",
       "royal_fire_academy",
       "azulas_team",
       "zuzus_sister",
       "cant_flirt",
       "hates_being_called_a_monster",
       "female"
     ],
     "nation": "Fire Nation",
     "role": "Fire Nation Princess",
     "gender": "female",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Princess",
       "Crown Princess",
       "Fire Lord (uncrowned)"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nHailed as a prodigy and favored by her father, Fire Lord Ozai, Princess Azula was molded into the perfect weapon. Driven by a relentless pursuit of power and perfection, she uses fear and manipulation to achieve her goals, including the conquest of Ba Sing Se. However, beneath her confident and cruel exterior lies a deep-seated mental instability, fueled by the perceived rejection from her mother, which ultimately leads to her tragic downfall.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Mastered a uniquely powerful and intense form of blue firebending.\r\n- Conquered the Earth Kingdom capital of Ba Sing Se through pure cunning and manipulation.\r\n- Mortally wounded Avatar Aang, nearly ending the Avatar Cycle.\r\n- Suffered a complete mental breakdown after being betrayed and defeated.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe primary antagonist of the second and third acts, whose perfectionism and psychological cruelty provide a dark mirror to Zuko's struggle for honor.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Ozai** – Father, role model, source of ambition and cruelty.\r\n- **Zuko** – Brother, object of scorn and rivalry.\r\n- **Mai & Ty Lee** – Subordinates disguised as friends, ultimately betrayers.\r\n- **Ursa** – Mother, source of insecurity and hallucinations.\r\n- **Iroh** – Uncle, viewed as a traitor.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Perfectionist and sadistic.\r\n- Confident, narcissistic, and manipulative.\r\n- Cunning strategist with legendary firebending skill.\r\n- Deeply mentally unstable beneath her composed exterior.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Trust is for fools! Fear is the only reliable way.\"\r\n- \"Almost isn't good enough!\"\r\n- \"My own mother thought I was a monster... She was right, of course, but it still hurt.\"",
+    "expandedView": "### 📖 Overview\n\nHailed as a prodigy and favored by her father, Fire Lord Ozai, Princess Azula was molded into the perfect weapon. Driven by a relentless pursuit of power and perfection, she uses fear and manipulation to achieve her goals, including the conquest of Ba Sing Se. However, beneath her confident and cruel exterior lies a deep-seated mental instability, fueled by the perceived rejection from her mother, which ultimately leads to her tragic downfall.\n\n### ✨ Narrative Highlights\n\n- Mastered a uniquely powerful and intense form of blue firebending.\n- Conquered the Earth Kingdom capital of Ba Sing Se through pure cunning and manipulation.\n- Mortally wounded Avatar Aang, nearly ending the Avatar Cycle.\n- Suffered a complete mental breakdown after being betrayed and defeated.\n\n### 🎭 Role in the Story\n\nThe primary antagonist of the second and third acts, whose perfectionism and psychological cruelty provide a dark mirror to Zuko's struggle for honor.\n\n### 🤝 Relationships\n\n- **Ozai** – Father, role model, source of ambition and cruelty.\n- **Zuko** – Brother, object of scorn and rivalry.\n- **Mai & Ty Lee** – Subordinates disguised as friends, ultimately betrayers.\n- **Ursa** – Mother, source of insecurity and hallucinations.\n- **Iroh** – Uncle, viewed as a traitor.\n\n### 🌟 Notable Traits\n\n- Perfectionist and sadistic.\n- Confident, narcissistic, and manipulative.\n- Cunning strategist with legendary firebending skill.\n- Deeply mentally unstable beneath her composed exterior.\n\n### 💬 Notable Quotes\n\n- \"Trust is for fools! Fear is the only reliable way.\"\n- \"Almost isn't good enough!\"\n- \"My own mother thought I was a monster... She was right, of course, but it still hurt.\"",
     "metadata": {
       "shortdescription": "A firebending prodigy and princess of the Fire Nation, Azula is a ruthlessly ambitious and manipulative strategist who serves as one of the Avatar's most formidable and psychologically terrifying adversaries.",
       "fullName": "Azula",
       "aliases": [
         "Kemurikage (disguise)"
       ],
       "ageChronological": 16,
       "ageBiological": 16,
       "ageRange": "teen",
       "birthDate": "85 AG",
       "deathDate": null,
       "nativeLocation": "Fire Nation Capital",
       "currentLocation": "Unknown",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "legendary",
       "advancedBending": [
         "lightning generation",
         "lightning redirection"
       ],
       "nonBendingSkills": [
@@ -1520,51 +1520,51 @@
       "fire_lord",
       "general",
       "warmonger",
       "ordered_zukos_death",
       "annihilated_southern_water_tribe",
       "assassinated",
       "fire_nation",
       "fire_nation_royal_family",
       "hundred_year_war",
       "reigned_for_75_years",
       "azulas_namesake",
       "poisoned",
       "male"
     ],
     "nation": "Fire Nation",
     "role": "Fire Lord",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Fire Lord",
       "General",
       "Prince"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nAs the son of Fire Lord Sozin, Azulon inherited the Hundred Year War and prosecuted it with brutal efficiency for 75 years. A famed general and prodigy, he nearly annihilated the Southern Water Tribe and secured many victories against the Earth Kingdom. His reign was defined by military conquest and a cold, demanding demeanor, favoring his firstborn son Iroh and showing little affection for Ozai, which ultimately led to his own assassination at the hands of his ambitious second son.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Ruled as Fire Lord for 75 years, overseeing most of the Hundred Year War.\r\n- Ordered the raids that nearly wiped out the Southern Water Tribe.\r\n- Commanded his son Ozai to kill Zuko as punishment for disrespect.\r\n- Was poisoned by Ozai in a conspiracy with Ursa to seize the throne.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA posthumous antagonist whose actions shaped the world of the series and whose death set the final, most brutal stage of the war in motion.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Iroh** – Firstborn son, favored heir.\r\n- **Ozai** – Second son, usurper, killer.\r\n- **Ursa** – Daughter-in-law.\r\n- **Zuko & Azula** – Grandchildren.\r\n- **Sozin** – Father, predecessor.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Ruthless and cruel.\r\n- Demanding, perfectionistic, and traditionalist.\r\n- Uncaring except for Iroh.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"You dare suggest I betray Iroh? My first born? ... Your punishment has scarcely begun!\"",
+    "expandedView": "### 📖 Overview\n\nAs the son of Fire Lord Sozin, Azulon inherited the Hundred Year War and prosecuted it with brutal efficiency for 75 years. A famed general and prodigy, he nearly annihilated the Southern Water Tribe and secured many victories against the Earth Kingdom. His reign was defined by military conquest and a cold, demanding demeanor, favoring his firstborn son Iroh and showing little affection for Ozai, which ultimately led to his own assassination at the hands of his ambitious second son.\n\n### ✨ Narrative Highlights\n\n- Ruled as Fire Lord for 75 years, overseeing most of the Hundred Year War.\n- Ordered the raids that nearly wiped out the Southern Water Tribe.\n- Commanded his son Ozai to kill Zuko as punishment for disrespect.\n- Was poisoned by Ozai in a conspiracy with Ursa to seize the throne.\n\n### 🎭 Role in the Story\n\nA posthumous antagonist whose actions shaped the world of the series and whose death set the final, most brutal stage of the war in motion.\n\n### 🤝 Relationships\n\n- **Iroh** – Firstborn son, favored heir.\n- **Ozai** – Second son, usurper, killer.\n- **Ursa** – Daughter-in-law.\n- **Zuko & Azula** – Grandchildren.\n- **Sozin** – Father, predecessor.\n\n### 🌟 Notable Traits\n\n- Ruthless and cruel.\n- Demanding, perfectionistic, and traditionalist.\n- Uncaring except for Iroh.\n\n### 💬 Notable Quotes\n\n- \"You dare suggest I betray Iroh? My first born? ... Your punishment has scarcely begun!\"",
     "metadata": {
       "shortdescription": "The long-reigning Fire Lord who preceded Ozai. A ruthless military commander and firebending prodigy, he greatly expanded the Fire Nation's empire during the Hundred Year War.",
       "fullName": "Azulon",
       "aliases": [],
       "ageChronological": 95,
       "ageBiological": 95,
       "ageRange": "elder",
       "birthDate": "0 AG",
       "deathDate": "95 AG",
       "nativeLocation": "Fire Nation Capital",
       "currentLocation": "Deceased",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "master",
       "advancedBending": [],
       "nonBendingSkills": [
         "military strategy",
         "leadership"
       ],
       "uniqueTechniques": [],
       "powerMetrics": {
@@ -2483,51 +2483,51 @@
       "loyal",
       "caring",
       "king",
       "royalty",
       "white_lotus",
       "liberated_omashu",
       "liberated_ba_sing_se",
       "mentor_to_aang",
       "earth_kingdom",
       "omashu",
       "order_of_the_white_lotus",
       "earthbending_with_face",
       "oldest_earthbender",
       "male"
     ],
     "nation": "Earth Kingdom",
     "role": "King of Omashu",
     "gender": "male",
     "species": "human",
     "nationality": "earth_kingdom",
     "ethnicity": "earth_kingdom",
     "titles": [
       "King",
       "Earthbending Master"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nBumi was the wild-eyed, eccentric, elderly King of Omashu. Prior to the Hundred Year War, he was a close friend of Avatar Aang and remained the only known friend from Aang's childhood still alive by 100 AG. Despite his apparent frailty, Bumi was an earthbending master, claiming to be \"the most powerful earthbender you'll ever see.\" His eccentricity arose from always keeping his mind \"open to the possibilities,\" earning him the nickname \"mad genius.\" Bumi was a brilliant and patient tactician, willing to wait for the opportune moment to strike.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Childhood friend of Aang; known for his \"mad genius\" and open-mindedness.\r\n- Became King of Omashu and led the city through the Hundred Year War.\r\n- Single-handedly liberated Omashu from Fire Nation control during the Day of Black Sun.\r\n- Member of the Order of the White Lotus; helped liberate Ba Sing Se.\r\n- Advised Aang to seek an earthbending teacher who waits and listens (Toph).\r\n\r\n### 🎭 Role in the Story\r\n\r\nA legendary earthbending master, comic relief, and wise mentor whose eccentricity hides deep wisdom and tactical brilliance.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Aang** – Childhood friend, mentee.\r\n- **Flopsie** – Loyal pet.\r\n- **Order of the White Lotus** – Fellow grandmasters and allies.\r\n- **Team Avatar** – Allies.\r\n- **Ozai, Azula, Ukano** – Enemies.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Eccentric and unpredictable\r\n- Brilliant strategist and tactician\r\n- Loyal and caring\r\n- Physically powerful despite age\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"I hope you will think like a mad genius!\"\r\n- \"You will always remember what you never expected.\"\r\n- \"Neutral jing is the key. It's the art of waiting and listening.\"",
+    "expandedView": "### 📖 Overview\n\nBumi was the wild-eyed, eccentric, elderly King of Omashu. Prior to the Hundred Year War, he was a close friend of Avatar Aang and remained the only known friend from Aang's childhood still alive by 100 AG. Despite his apparent frailty, Bumi was an earthbending master, claiming to be \"the most powerful earthbender you'll ever see.\" His eccentricity arose from always keeping his mind \"open to the possibilities,\" earning him the nickname \"mad genius.\" Bumi was a brilliant and patient tactician, willing to wait for the opportune moment to strike.\n\n### ✨ Narrative Highlights\n\n- Childhood friend of Aang; known for his \"mad genius\" and open-mindedness.\n- Became King of Omashu and led the city through the Hundred Year War.\n- Single-handedly liberated Omashu from Fire Nation control during the Day of Black Sun.\n- Member of the Order of the White Lotus; helped liberate Ba Sing Se.\n- Advised Aang to seek an earthbending teacher who waits and listens (Toph).\n\n### 🎭 Role in the Story\n\nA legendary earthbending master, comic relief, and wise mentor whose eccentricity hides deep wisdom and tactical brilliance.\n\n### 🤝 Relationships\n\n- **Aang** – Childhood friend, mentee.\n- **Flopsie** – Loyal pet.\n- **Order of the White Lotus** – Fellow grandmasters and allies.\n- **Team Avatar** – Allies.\n- **Ozai, Azula, Ukano** – Enemies.\n\n### 🌟 Notable Traits\n\n- Eccentric and unpredictable\n- Brilliant strategist and tactician\n- Loyal and caring\n- Physically powerful despite age\n\n### 💬 Notable Quotes\n\n- \"I hope you will think like a mad genius!\"\n- \"You will always remember what you never expected.\"\n- \"Neutral jing is the key. It's the art of waiting and listening.\"",
     "metadata": {
       "shortdescription": "The eccentric, wildly powerful King of Omashu. Aang's only surviving childhood friend, Bumi is a \"mad genius\" earthbending master and brilliant tactician.",
       "fullName": "Bumi",
       "aliases": [],
       "ageChronological": 112,
       "ageBiological": 112,
       "ageRange": "elder",
       "birthDate": "12_BG",
       "deathDate": "Between_102_and_124_AG",
       "nativeLocation": "omashu",
       "currentLocation": "omashu",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "standard_language"
       ],
       "isBender": true,
       "bendingElement": "earth",
       "bendingProficiency": "legendary",
       "advancedBending": [],
       "nonBendingSkills": [
         "strategy",
         "tactics",
         "leadership"
       ],
       "uniqueTechniques": [
@@ -3153,51 +3153,51 @@
     "id": "combustion-man",
     "name": "Combustion Man",
     "summary": "A silent, towering firebending assassin with a third-eye tattoo, metal prosthetics, and the rare ability to project devastating explosions. Hired by Zuko to eliminate Avatar Aang, he became one of Team Avatar's most dangerous foes.",
     "type": "character",
     "slug": "combustion-man",
     "tags": [
       "fire_nation",
       "assassin",
       "combustionbender",
       "book_three",
       "the_headband",
       "the_western_air_temple",
       "villain",
       "firebending_master",
       "male"
     ],
     "image": "combustion-man.jpg",
     "nation": "Fire Nation",
     "role": "Assassin",
     "gender": "Male",
     "ethnicity": "Fire Nation",
     "titles": [
       "Assassin",
       "Firebending Master"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nCombustion Man, also known as \"Sparky Sparky Boom Man,\" was a fearsome firebending assassin infamous for his unique combustionbending technique. Towering at over seven feet tall, with a third-eye tattoo and metal prosthetic limbs, he was hired by Prince Zuko to hunt down and kill Avatar Aang. His silent demeanor, relentless pursuit, and overwhelming power made him one of the most dangerous adversaries Team Avatar ever faced.\r\n\r\n### 🧩 Role in the Story\r\n\r\nCombustion Man was introduced as a secondary antagonist in Book Three. Hired by Zuko, he relentlessly tracked Team Avatar across the Fire Nation, using his rare ability to create explosions with his mind. He orchestrated multiple assassination attempts, each more destructive than the last, and was ultimately defeated at the Western Air Temple when Sokka struck his third eye, causing his own power to backfire fatally.\r\n\r\n### 🤝 Relationships\r\n\r\n- Zuko: Employer, later adversary\r\n- Team Avatar: Targets\r\n- Sokka: Gave him the nickname \"Sparky Sparky Boom Man\"\r\n- Raven eagle: Animal companion\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Silent and stoic\r\n- Relentless and professional\r\n- Physically imposing (7'2\", metal prosthetics)\r\n- Master of combustionbending\r\n\r\n### 💬 Quotes\r\n\r\n> \"I've heard about you. They say you're good at what you do, and even better at keeping secrets. The Avatar is alive. I want you to find him, and end him.\"\r\n> — Zuko to Combustion Man\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Hired by Zuko to assassinate Aang\r\n- Nearly killed Team Avatar on multiple occasions\r\n- Defeated by Sokka's boomerang at the Western Air Temple\r\n- Inspired the later combustionbender P'Li\r\n- Never spoke a word on screen",
+    "expandedView": "### 📖 Overview\n\nCombustion Man, also known as \"Sparky Sparky Boom Man,\" was a fearsome firebending assassin infamous for his unique combustionbending technique. Towering at over seven feet tall, with a third-eye tattoo and metal prosthetic limbs, he was hired by Prince Zuko to hunt down and kill Avatar Aang. His silent demeanor, relentless pursuit, and overwhelming power made him one of the most dangerous adversaries Team Avatar ever faced.\n\n### 🧩 Role in the Story\n\nCombustion Man was introduced as a secondary antagonist in Book Three. Hired by Zuko, he relentlessly tracked Team Avatar across the Fire Nation, using his rare ability to create explosions with his mind. He orchestrated multiple assassination attempts, each more destructive than the last, and was ultimately defeated at the Western Air Temple when Sokka struck his third eye, causing his own power to backfire fatally.\n\n### 🤝 Relationships\n\n- Zuko: Employer, later adversary\n- Team Avatar: Targets\n- Sokka: Gave him the nickname \"Sparky Sparky Boom Man\"\n- Raven eagle: Animal companion\n\n### 🌟 Notable Traits\n\n- Silent and stoic\n- Relentless and professional\n- Physically imposing (7'2\", metal prosthetics)\n- Master of combustionbending\n\n### 💬 Quotes\n\n> \"I've heard about you. They say you're good at what you do, and even better at keeping secrets. The Avatar is alive. I want you to find him, and end him.\"\n> — Zuko to Combustion Man\n\n### ✨ Narrative Highlights\n\n- Hired by Zuko to assassinate Aang\n- Nearly killed Team Avatar on multiple occasions\n- Defeated by Sokka's boomerang at the Western Air Temple\n- Inspired the later combustionbender P'Li\n- Never spoke a word on screen",
     "metadata": {
       "shortdescription": "A silent, towering firebending assassin with a third-eye tattoo, metal prosthetics, and the rare ability to project devastating explosions. Hired by Zuko to eliminate Avatar Aang, he became one of Team Avatar's most dangerous foes.",
       "slug": "combustion-man",
       "badge": "Combustionbender",
       "shortDescription": "A silent, towering firebending assassin with a third-eye tattoo, metal prosthetics, and the rare ability to project devastating explosions. Hired by Zuko to eliminate Avatar Aang, he became one of Team Avatar's most dangerous foes.",
       "fullName": "Combustion Man",
       "aliases": [
         "Sparky Sparky Boom Man"
       ],
       "pronouns": "he/him",
       "age": null,
       "height": "7'2\" (218 cm)",
       "hairColor": "Black (shaved)",
       "eyeColor": "Dark",
       "skinColor": "Light",
       "loveInterest": null,
       "abilities": {
         "bending": [
           "Firebending",
           "Combustionbending"
         ],
         "weapons": [
           "Fire",
           "Metal prosthetics"
         ],
@@ -3314,51 +3314,51 @@
   },
   {
     "id": "fire-nation-man",
     "name": "Fire Nation Man",
     "summary": "",
     "type": "character",
     "slug": "fire-nation-man",
     "tags": [
       "performer",
       "comic_relief",
       "earthbender",
       "confident",
       "earth_kingdom",
       "earth_rumble",
       "gaoling",
       "stage_villain",
       "male"
     ],
     "nation": "Earth Kingdom",
     "role": "Earth Rumble Fighter",
     "gender": "male",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nAn immigrant from the Si Wong Desert, \"Fire Nation Man\" is a professional earthbender who fights in the Earth Rumble tournaments. His stage persona—a red cloak, Fire Nation flag, and singing the Fire Nation anthem—is a deliberate act to portray himself as a villain, or \"heel,\" to rile up the audience and amplify the drama.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Competed in Earth Rumble VI as a theatrical stage villain.\r\n- Was quickly defeated by both The Boulder and Toph Beifong.\r\n- Demonstrated a commitment to showmanship over actual victory.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor character serving as comic relief and establishing the entertainment-focused world of the Gaoling earthbending circuit.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Xin Fu** – His promoter and the organizer of the Earth Rumble tournament.\r\n- **The Boulder** – Rival who defeated him in the ring.\r\n- **Toph Beifong** – Rival who also easily defeated him.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Dramatic and thoroughly committed to his performance.\r\n- A showman at heart, prioritizing entertainment over winning.\r\n- Confident in his stage persona, despite his lack of fighting prowess.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Fire Lord, my flame burns for thee!\"",
+    "expandedView": "### 📖 Overview\n\nAn immigrant from the Si Wong Desert, \"Fire Nation Man\" is a professional earthbender who fights in the Earth Rumble tournaments. His stage persona—a red cloak, Fire Nation flag, and singing the Fire Nation anthem—is a deliberate act to portray himself as a villain, or \"heel,\" to rile up the audience and amplify the drama.\n\n### ✨ Narrative Highlights\n\n- Competed in Earth Rumble VI as a theatrical stage villain.\n- Was quickly defeated by both The Boulder and Toph Beifong.\n- Demonstrated a commitment to showmanship over actual victory.\n\n### 🎭 Role in the Story\n\nA minor character serving as comic relief and establishing the entertainment-focused world of the Gaoling earthbending circuit.\n\n### 🤝 Relationships\n\n- **Xin Fu** – His promoter and the organizer of the Earth Rumble tournament.\n- **The Boulder** – Rival who defeated him in the ring.\n- **Toph Beifong** – Rival who also easily defeated him.\n\n### 🌟 Notable Traits\n\n- Dramatic and thoroughly committed to his performance.\n- A showman at heart, prioritizing entertainment over winning.\n- Confident in his stage persona, despite his lack of fighting prowess.\n\n### 💬 Notable Quotes\n\n- \"Fire Lord, my flame burns for thee!\"",
     "metadata": {
       "shortdescription": "A professional earthbender whose stage persona is a Fire Nation heel, playing the villain to excite the crowd at Earth Rumble tournaments.",
       "slug": "fire-nation-man",
       "fullName": "Fire Nation Man",
       "aliases": [],
       "ageChronological": null,
       "ageBiological": null,
       "ageRange": "adult",
       "birthDate": null,
       "deathDate": null,
       "nativeLocation": "Si Wong Desert, Earth Kingdom",
       "socioeconomicStanding": "commoner",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "earth",
       "bendingProficiency": "proficient",
       "advancedBending": [],
       "nonBendingSkills": [
         "showmanship"
       ],
       "uniqueTechniques": [
         "dirt-based attacks"
       ],
@@ -3804,51 +3804,51 @@
       "mentor",
       "teacher",
       "friend",
       "survivor",
       "sage",
       "outcast",
       "hero",
       "prodigy",
       "optimist",
       "air_nomads",
       "southern_air_temple",
       "council_elder",
       "book_one",
       "male"
     ],
     "image": null,
     "nation": "Air Nomads",
     "role": "Air Nomad Mentor, Council Elder",
     "gender": "Male",
     "ethnicity": "Air Nomad",
     "titles": [
       "Monk",
       "Airbending Master",
       "Council Elder"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nMonk Gyatso was an airbending master, monk, and a member of the Southern Air Temple's Council of Elders. He was a lifelong friend to Avatar Roku and later became the beloved guardian and father figure to Avatar Aang. Known for his wisdom, humor, and compassion, Gyatso was a guiding force for both Avatars and a key figure in the Air Nomads' history.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Close personal friend of Avatar Roku.\r\n- Served as the primary guardian, mentor, and father figure to Avatar Aang.\r\n- His compassionate approach to Aang's training conflicted with the other council elders.\r\n- Died defending the Southern Air Temple, taking many Fire Nation soldiers with him.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA guiding father figure whose love and wisdom profoundly shaped Aang's character, and whose death represents Aang's greatest personal loss.\r\n\r\n### 🤝 Relationships\r\n\r\n- Aang (Student, Surrogate Son)\r\n- Roku (Best Friend)\r\n- Pathik (Friend)\r\n- The Council of Elders (Colleagues)\r\n- Lola (Sky Bison Companion)\r\n- Yama (Older Sister)\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Kind & Compassionate\r\n- Wise & Patient\r\n- Humorous & Playful\r\n- Fiercely Protective\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"We can't concern ourselves with what was. We must act on what is.\"\r\n- \"Come closer. I have some wisdom for you... *splat*\"\r\n- \"All I want is for him to be happy.\"",
+    "expandedView": "### 📖 Overview\n\nMonk Gyatso was an airbending master, monk, and a member of the Southern Air Temple's Council of Elders. He was a lifelong friend to Avatar Roku and later became the beloved guardian and father figure to Avatar Aang. Known for his wisdom, humor, and compassion, Gyatso was a guiding force for both Avatars and a key figure in the Air Nomads' history.\n\n### ✨ Narrative Highlights\n\n- Close personal friend of Avatar Roku.\n- Served as the primary guardian, mentor, and father figure to Avatar Aang.\n- His compassionate approach to Aang's training conflicted with the other council elders.\n- Died defending the Southern Air Temple, taking many Fire Nation soldiers with him.\n\n### 🎭 Role in the Story\n\nA guiding father figure whose love and wisdom profoundly shaped Aang's character, and whose death represents Aang's greatest personal loss.\n\n### 🤝 Relationships\n\n- Aang (Student, Surrogate Son)\n- Roku (Best Friend)\n- Pathik (Friend)\n- The Council of Elders (Colleagues)\n- Lola (Sky Bison Companion)\n- Yama (Older Sister)\n\n### 🌟 Notable Traits\n\n- Kind & Compassionate\n- Wise & Patient\n- Humorous & Playful\n- Fiercely Protective\n\n### 💬 Notable Quotes\n\n- \"We can't concern ourselves with what was. We must act on what is.\"\n- \"Come closer. I have some wisdom for you... *splat*\"\n- \"All I want is for him to be happy.\"",
     "metadata": {
       "badge": "Compassionate Mentor",
       "shortdescription": "A wise and kind-hearted airbending master from the Southern Air Temple. He was a lifelong friend to Avatar Roku and later became the beloved guardian and father figure to Avatar Aang.",
       "slug": "gyatso",
       "shortDescription": "A wise and kind-hearted airbending master from the Southern Air Temple. He was a lifelong friend to Avatar Roku and later became the beloved guardian and father figure to Avatar Aang.",
       "fullName": "Gyatso",
       "aliases": [],
       "pronouns": "he/him",
       "age": 78,
       "hairColor": "White (shaven)",
       "eyeColor": "Light brown",
       "skinColor": "Light",
       "loveInterest": null,
       "abilities": {
         "bending": [
           "Airbending"
         ],
         "weapons": [
           "Air"
         ],
         "fightingStyles": [
           "Airbending"
         ],
         "notableFeats": [
           "Considered one of the greatest airbenders of his time.",
@@ -3992,51 +3992,51 @@
     "tags": [
       "minor_antagonist",
       "comic_relief",
       "statusseeker",
       "warrior",
       "rival_of_sokka",
       "betrothed_to_yue",
       "arrogant",
       "insecure",
       "siege_of_the_north",
       "arranged_marriage",
       "northern_water_tribe",
       "defeated_by_zhao",
       "most_handsome_warrior_selfproclaimed",
       "male"
     ],
     "nation": "Northern Water Tribe",
     "role": "NWT Warrior",
     "gender": "male",
     "species": "human",
     "nationality": "Northern Water Tribe",
     "ethnicity": "Water Tribe",
     "titles": [
       "Warrior"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nHahn is a career-minded, ambitious young warrior of the Northern Water Tribe. Betrothed to Princess Yue, he is known for his arrogance, bravado, and desire to impress his superiors. Despite his high status and confidence, his skills are ultimately shown to be less impressive than he believes, especially during the Siege of the North.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Chosen by Chief Arnook to lead a secret attack on Admiral Zhao during the Siege of the North.\r\n- Betrothed to Princess Yue in an arranged marriage that never took place.\r\n- Known for his bravado and attempts to gain favor with the tribe's leadership.\r\n- Defeated and humiliated by Admiral Zhao during his mission.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor antagonist and comic relief, Hahn's overconfidence and social climbing serve as a foil to Sokka and highlight the political dynamics of the Northern Water Tribe.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Princess Yue** – Arranged fiancée, relationship never realized.\r\n- **Chief Arnook** – Future father-in-law, arranged the betrothal.\r\n- **Sokka** – Rival, often the target of Hahn's arrogance.\r\n- **Admiral Zhao** – Enemy, defeated Hahn during the siege.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Ambitious and egotistical.\r\n- Confident, but ultimately insecure.\r\n- Focused on status and recognition.\r\n- Not a bender, but skilled with weapons.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Let me tell you, Sokka, I've courted a lot of girls, but Yue is the finest and she comes with the most perks. [...] I mean, Yue's nice and everything, but the points I'll gain with the chief aren't bad either.\"",
+    "expandedView": "### 📖 Overview\n\nHahn is a career-minded, ambitious young warrior of the Northern Water Tribe. Betrothed to Princess Yue, he is known for his arrogance, bravado, and desire to impress his superiors. Despite his high status and confidence, his skills are ultimately shown to be less impressive than he believes, especially during the Siege of the North.\n\n### ✨ Narrative Highlights\n\n- Chosen by Chief Arnook to lead a secret attack on Admiral Zhao during the Siege of the North.\n- Betrothed to Princess Yue in an arranged marriage that never took place.\n- Known for his bravado and attempts to gain favor with the tribe's leadership.\n- Defeated and humiliated by Admiral Zhao during his mission.\n\n### 🎭 Role in the Story\n\nA minor antagonist and comic relief, Hahn's overconfidence and social climbing serve as a foil to Sokka and highlight the political dynamics of the Northern Water Tribe.\n\n### 🤝 Relationships\n\n- **Princess Yue** – Arranged fiancée, relationship never realized.\n- **Chief Arnook** – Future father-in-law, arranged the betrothal.\n- **Sokka** – Rival, often the target of Hahn's arrogance.\n- **Admiral Zhao** – Enemy, defeated Hahn during the siege.\n\n### 🌟 Notable Traits\n\n- Ambitious and egotistical.\n- Confident, but ultimately insecure.\n- Focused on status and recognition.\n- Not a bender, but skilled with weapons.\n\n### 💬 Notable Quotes\n\n- \"Let me tell you, Sokka, I've courted a lot of girls, but Yue is the finest and she comes with the most perks. [...] I mean, Yue's nice and everything, but the points I'll gain with the chief aren't bad either.\"",
     "metadata": {
       "badge": "Northern Warrior",
       "shortdescription": "Hahn is a young warrior of the Northern Water Tribe, betrothed to Princess Yue and known for his arrogance and bravado during the Siege of the North.",
       "slug": "hahn",
       "fullName": "Hahn",
       "aliases": [],
       "ageChronological": 17,
       "ageBiological": 17,
       "ageRange": "teen",
       "birthDate": null,
       "deathDate": null,
       "nativeLocation": "Northern Water Tribe",
       "socioeconomicStanding": "warrior class",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": null,
       "advancedBending": [],
       "nonBendingSkills": [
         "weapon mastery",
         "leadership",
         "combat tactics"
       ],
@@ -4237,51 +4237,51 @@
       "proud",
       "responsible",
       "chieftain",
       "head_chieftain",
       "war_leader",
       "day_of_black_sun_invasion",
       "boiling_rock_escapee",
       "southern_reconstruction",
       "southern_water_tribe",
       "wolf_cove",
       "mark_of_the_wise",
       "inventor",
       "sokkas_father",
       "voiced_by_andr_sogliuzzo",
       "male"
     ],
     "nation": "Southern Water Tribe",
     "role": "SWT Chieftain",
     "gender": "male",
     "species": "human",
     "nationality": "Southern Water Tribe",
     "ethnicity": "Water Tribe",
     "titles": [
       "Chief"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nHakoda is a respected warrior and leader, burdened by the difficult choice to leave his family to fight for the future of the world. A brilliant tactician and a loving father, his influence shapes his son Sokka's own journey into leadership. After enduring capture and imprisonment at the Boiling Rock, he reunites with his children and plays a pivotal role in the Day of Black Sun invasion and the post-war reconstruction of the Southern Water Tribe.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Led the warriors of the Southern Water Tribe against the Fire Nation.\r\n- Provided key leadership during the invasion of the Fire Nation.\r\n- Was imprisoned in and escaped from the high-security prison, the Boiling Rock.\r\n- Became Head Chieftain of the unified Southern Water Tribe after the war.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA guiding father figure whose courage and strategic mind inspire his children and represent the Water Tribe's resilience and contribution to the war.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Sokka** – Son and protégé.\r\n- **Katara** – Daughter.\r\n- **Kya** – Wife, deceased.\r\n- **Kanna** – Mother.\r\n- **Malina** – Girlfriend.\r\n- **Bato** – Close friend and fellow warrior.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Brave and courageous.\r\n- Strategic, ingenious, and respected leader.\r\n- Loving and fatherly.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"You and your brother are my entire world.\"\r\n- \"I'm the proudest father in the world.\"\r\n- \"We're going to show the Fire Nation that we believe in our cause as much as they believe in theirs.\"",
+    "expandedView": "### 📖 Overview\n\nHakoda is a respected warrior and leader, burdened by the difficult choice to leave his family to fight for the future of the world. A brilliant tactician and a loving father, his influence shapes his son Sokka's own journey into leadership. After enduring capture and imprisonment at the Boiling Rock, he reunites with his children and plays a pivotal role in the Day of Black Sun invasion and the post-war reconstruction of the Southern Water Tribe.\n\n### ✨ Narrative Highlights\n\n- Led the warriors of the Southern Water Tribe against the Fire Nation.\n- Provided key leadership during the invasion of the Fire Nation.\n- Was imprisoned in and escaped from the high-security prison, the Boiling Rock.\n- Became Head Chieftain of the unified Southern Water Tribe after the war.\n\n### 🎭 Role in the Story\n\nA guiding father figure whose courage and strategic mind inspire his children and represent the Water Tribe's resilience and contribution to the war.\n\n### 🤝 Relationships\n\n- **Sokka** – Son and protégé.\n- **Katara** – Daughter.\n- **Kya** – Wife, deceased.\n- **Kanna** – Mother.\n- **Malina** – Girlfriend.\n- **Bato** – Close friend and fellow warrior.\n\n### 🌟 Notable Traits\n\n- Brave and courageous.\n- Strategic, ingenious, and respected leader.\n- Loving and fatherly.\n\n### 💬 Notable Quotes\n\n- \"You and your brother are my entire world.\"\n- \"I'm the proudest father in the world.\"\n- \"We're going to show the Fire Nation that we believe in our cause as much as they believe in theirs.\"",
     "metadata": {
       "shortdescription": "The brave and strategic chieftain of the Southern Water Tribe and the father of Sokka and Katara. He leaves his children to lead his tribe's warriors against the Fire Nation in the Hundred Year War.",
       "fullName": "Hakoda",
       "aliases": [],
       "ageChronological": 45,
       "ageBiological": 45,
       "ageRange": "adult",
       "birthDate": "c. 55 AG",
       "deathDate": null,
       "nativeLocation": "Wolf Cove",
       "currentLocation": "Southern Water Tribe",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "strategy",
         "leadership",
         "weapon crafting",
         "ship captaining",
         "hand-to-hand combat"
@@ -4605,51 +4605,51 @@
       "maniacal",
       "proud",
       "prisoner_of_war",
       "escaped_prison",
       "invented_bloodbending",
       "terrorized_village",
       "corrupted_katara",
       "southern_water_tribe",
       "fire_nation_prisoner",
       "bloodbending",
       "inventor_of_bloodbending",
       "gray_eyes",
       "knew_kataras_grandmother",
       "voiced_by_tress_macneille",
       "female"
     ],
     "nation": "Southern Water Tribe",
     "role": "Puppetmaster",
     "gender": "female",
     "species": "human",
     "nationality": "Southern Water Tribe",
     "ethnicity": "Water Tribe",
     "titles": [
       "Master"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nOnce a proud defender of the Southern Water Tribe, Hama was the last waterbender captured during the Fire Nation raids. Decades of cruel imprisonment twisted her spirit, leading her to develop the terrifying ability to bend the water within living creatures. After escaping, she lives a quiet life as an innkeeper, secretly exacting her revenge on innocent Fire Nation villagers under the light of the full moon.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Sole inventor of the forbidden art of bloodbending.\r\n- Last waterbending master of the Southern Water Tribe before its devastation.\r\n- Used her dark abilities to imprison innocent Fire Nation civilians out of revenge.\r\n- Forced Katara to learn and use bloodbending against her will.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA tragic antagonist and a dark mirror for Katara, showcasing how trauma and a thirst for vengeance can corrupt even the most noble of intentions.\r\n\r\n### 🤝 Relationships\r\n\r\n- Katara (Protégée, Victim, Captor)\r\n- Kanna (Childhood Friend)\r\n- Aang & Sokka (Puppets)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Vengeful & Bitter\r\n- Cunning & Deceptive\r\n- Mentally Unstable\r\n- Proud & Resilient\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"Congratulations, Katara. You're a bloodbender.\"\r\n- \"They threw me in prison to rot... They deserve the same! You must carry on my work.\"\r\n- \"You've got to keep an open mind, Katara. There's water in places you never think about.\"",
+    "expandedView": "### 📖 Overview\n\nOnce a proud defender of the Southern Water Tribe, Hama was the last waterbender captured during the Fire Nation raids. Decades of cruel imprisonment twisted her spirit, leading her to develop the terrifying ability to bend the water within living creatures. After escaping, she lives a quiet life as an innkeeper, secretly exacting her revenge on innocent Fire Nation villagers under the light of the full moon.\n\n### ✨ Narrative Highlights\n\n- Sole inventor of the forbidden art of bloodbending.\n- Last waterbending master of the Southern Water Tribe before its devastation.\n- Used her dark abilities to imprison innocent Fire Nation civilians out of revenge.\n- Forced Katara to learn and use bloodbending against her will.\n\n### 🎭 Role in the Story\n\nA tragic antagonist and a dark mirror for Katara, showcasing how trauma and a thirst for vengeance can corrupt even the most noble of intentions.\n\n### 🤝 Relationships\n\n- Katara (Protégée, Victim, Captor)\n- Kanna (Childhood Friend)\n- Aang & Sokka (Puppets)\n\n### 🧬 Notable Traits\n\n- Vengeful & Bitter\n- Cunning & Deceptive\n- Mentally Unstable\n- Proud & Resilient\n\n### 🗣️ Notable Quotes\n\n- \"Congratulations, Katara. You're a bloodbender.\"\n- \"They threw me in prison to rot... They deserve the same! You must carry on my work.\"\n- \"You've got to keep an open mind, Katara. There's water in places you never think about.\"",
     "metadata": {
       "badge": "Puppetmaster",
       "shortdescription": "Hama is an old Southern Water Tribe waterbender master who was captured and imprisoned by the Fire Nation. To escape, she invented the dark and horrifying art of bloodbending.",
       "fullName": "Hama",
       "aliases": [],
       "ageChronological": 70,
       "ageBiological": 70,
       "ageRange": "elder",
       "birthDate": "c. 30 AG",
       "deathDate": null,
       "nativeLocation": "Wolf Cove",
       "currentLocation": "Fire Nation (imprisoned)",
       "socioeconomicStanding": "commoner",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "water",
       "bendingProficiency": "master",
       "advancedBending": [
         "bloodbending"
       ],
       "nonBendingSkills": [
         "acting",
         "storytelling",
@@ -5258,62 +5258,63 @@
       ],
       "isSuggestedInXContext": [],
       "__type": "character",
       "slug": "haru"
     }
   },
   {
     "id": "headhunter",
     "name": "Headhunter",
     "summary": "",
     "type": "character",
     "slug": "headhunter",
     "tags": [
       "minor_antagonist",
       "comic_relief",
       "tournament_fighter",
       "ally_of_xin_fu",
       "rival_of_toph",
       "rival_of_the_boulder",
       "resourceful",
       "loyal",
       "predictable",
       "earth_rumble",
       "earth_kingdom",
       "gaoling",
-      "male"
+      "male",
+      "earthbender"
     ],
     "nation": "Earth Kingdom",
     "role": "Earth Rumble Fighter",
     "gender": "male",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "Earth Rumble Fighter"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nHeadhunter is a professional earthbending fighter from Gaoling, Earth Kingdom, recognized for his distinctive face paint and aggressive fighting style. As a competitor in Earth Rumble VI, he was swiftly defeated by The Boulder but later helped Xin Fu kidnap Aang and Toph. During Toph’s escape, Headhunter was again defeated, this time by Toph’s clever use of the arena floor. His stage persona and appearance made him a memorable, if minor, figure in the earthbending circuit.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Competed in Earth Rumble VI, using an aggressive earthbending style.\r\n- Defeated by The Boulder in the tournament.\r\n- Helped Xin Fu kidnap Aang and Toph for ransom.\r\n- Defeated by Toph during her escape from captivity.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor antagonist and comic relief, Headhunter’s unique look and fighting style add variety to the Earth Rumble roster and highlight the diversity of earthbending techniques.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Xin Fu** – Ally and fellow Earth Rumble fighter.\r\n- **Earth Rumble fighters** – Colleagues and rivals.\r\n- **Toph Beifong** – Defeated him in combat.\r\n- **Aang** – Briefly held captive.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Distinctive face paint\r\n- Aggressive and showy\r\n- Loyal to fellow fighters\r\n\r\n### 💬 Notable Quotes\r\n\r\n- (No lines)",
+    "expandedView": "### 📖 Overview\n\nHeadhunter is a professional earthbending fighter from Gaoling, Earth Kingdom, recognized for his distinctive face paint and aggressive fighting style. As a competitor in Earth Rumble VI, he was swiftly defeated by The Boulder but later helped Xin Fu kidnap Aang and Toph. During Toph’s escape, Headhunter was again defeated, this time by Toph’s clever use of the arena floor. His stage persona and appearance made him a memorable, if minor, figure in the earthbending circuit.\n\n### ✨ Narrative Highlights\n\n- Competed in Earth Rumble VI, using an aggressive earthbending style.\n- Defeated by The Boulder in the tournament.\n- Helped Xin Fu kidnap Aang and Toph for ransom.\n- Defeated by Toph during her escape from captivity.\n\n### 🎭 Role in the Story\n\nA minor antagonist and comic relief, Headhunter’s unique look and fighting style add variety to the Earth Rumble roster and highlight the diversity of earthbending techniques.\n\n### 🤝 Relationships\n\n- **Xin Fu** – Ally and fellow Earth Rumble fighter.\n- **Earth Rumble fighters** – Colleagues and rivals.\n- **Toph Beifong** – Defeated him in combat.\n- **Aang** – Briefly held captive.\n\n### 🌟 Notable Traits\n\n- Distinctive face paint\n- Aggressive and showy\n- Loyal to fellow fighters\n\n### 💬 Notable Quotes\n\n- (No lines)",
     "metadata": {
       "badge": "Earth Rumble Fighter",
       "shortdescription": "A colorful earthbender from Gaoling, Headhunter is known for his face paint, aggressive style, and participation in the Earth Rumble tournaments.",
       "slug": "headhunter",
       "fullName": "Headhunter",
       "aliases": [],
       "ageChronological": null,
       "ageBiological": null,
       "ageRange": "adult",
       "birthDate": null,
       "deathDate": null,
       "nativeLocation": "Gaoling",
       "currentLocation": "Gaoling",
       "socioeconomicStanding": "fighter",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "earth",
       "bendingProficiency": "skilled",
       "advancedBending": [],
       "nonBendingSkills": [
         "stage performance"
       ],
       "uniqueTechniques": [
@@ -5474,62 +5475,63 @@
           "Earth Rumble"
         ]
       },
       "__type": "character"
     }
   },
   {
     "id": "hide",
     "name": "Hide",
     "summary": "",
     "type": "character",
     "slug": "hide",
     "tags": [
       "minor_antagonist",
       "comic_relief",
       "school_bully",
       "crush_on_on_ji",
       "rival_of_aang",
       "seeks_approval_from_headmaster",
       "aggressive",
       "possessive",
       "quicktempered",
       "fire_nation_school",
       "schoolyard_rivalry",
       "fire_nation",
-      "male"
+      "male",
+      "firebender"
     ],
     "nation": "Fire Nation",
     "role": "Student, Bully",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Star Pupil"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nHide is a student at a Fire Nation school, recognized for his muscular build, aggressive attitude, and possessive behavior toward On Ji. He regularly bullied other students and fancied himself On Ji’s boyfriend, though she did not reciprocate his feelings. Hide’s confrontations with Aang (posing as Kuzon) highlight his quick temper and lack of self-awareness. He is a star pupil in the Fire Nation system, destined for a strict military future, but is ultimately portrayed as a comic antagonist.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Bullied classmates and tried to assert dominance over On Ji.\r\n- Confronted Aang (as Kuzon) for talking to On Ji, leading to a failed fight.\r\n- Informed the Headmaster about Aang’s dance party, trying to get him in trouble.\r\n- Regularly weaseled out of trouble with authority figures.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor antagonist and comic relief, Hide’s character satirizes the Fire Nation’s school system and the archetype of the schoolyard bully.\r\n\r\n### 🤝 Relationships\r\n\r\n- **On Ji** – Unrequited crush; possessive and jealous.\r\n- **Headmaster** – Authority figure; Hide seeks approval and uses him to get others in trouble.\r\n- **Aang (as Kuzon)** – Rival; targeted by Hide for befriending On Ji.\r\n- **Shoji** – Another student; sometimes an enemy.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Muscular and physically imposing\r\n- Aggressive and possessive\r\n- Quick to anger, but easily outwitted\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Now listen, friend, I know you're from the colonies, so I'll say this slowly: On Ji. Is. My. Girlfriend. Don't forget it.\"",
+    "expandedView": "### 📖 Overview\n\nHide is a student at a Fire Nation school, recognized for his muscular build, aggressive attitude, and possessive behavior toward On Ji. He regularly bullied other students and fancied himself On Ji’s boyfriend, though she did not reciprocate his feelings. Hide’s confrontations with Aang (posing as Kuzon) highlight his quick temper and lack of self-awareness. He is a star pupil in the Fire Nation system, destined for a strict military future, but is ultimately portrayed as a comic antagonist.\n\n### ✨ Narrative Highlights\n\n- Bullied classmates and tried to assert dominance over On Ji.\n- Confronted Aang (as Kuzon) for talking to On Ji, leading to a failed fight.\n- Informed the Headmaster about Aang’s dance party, trying to get him in trouble.\n- Regularly weaseled out of trouble with authority figures.\n\n### 🎭 Role in the Story\n\nA minor antagonist and comic relief, Hide’s character satirizes the Fire Nation’s school system and the archetype of the schoolyard bully.\n\n### 🤝 Relationships\n\n- **On Ji** – Unrequited crush; possessive and jealous.\n- **Headmaster** – Authority figure; Hide seeks approval and uses him to get others in trouble.\n- **Aang (as Kuzon)** – Rival; targeted by Hide for befriending On Ji.\n- **Shoji** – Another student; sometimes an enemy.\n\n### 🌟 Notable Traits\n\n- Muscular and physically imposing\n- Aggressive and possessive\n- Quick to anger, but easily outwitted\n\n### 💬 Notable Quotes\n\n- \"Now listen, friend, I know you're from the colonies, so I'll say this slowly: On Ji. Is. My. Girlfriend. Don't forget it.\"",
     "metadata": {
       "badge": "Schoolyard Bully",
       "shortdescription": "A possessive and aggressive student at a Fire Nation school, Hide is known for bullying, firebending, and his unrequited crush on On Ji.",
       "slug": "hide",
       "fullName": "Hide",
       "aliases": [],
       "ageChronological": null,
       "ageBiological": null,
       "ageRange": "teen",
       "birthDate": null,
       "deathDate": null,
       "nativeLocation": null,
       "currentLocation": "Fire Nation school",
       "socioeconomicStanding": "student",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "student",
       "advancedBending": [],
       "nonBendingSkills": [
         "intimidation",
         "athletics"
       ],
@@ -5731,51 +5733,51 @@
       "forgave_zuko",
       "fire_nation_royalty",
       "order_of_the_white_lotus",
       "spirit_world_resident",
       "jasmine_dragon",
       "ba_sing_se",
       "dragon_of_the_west",
       "loves_pai_sho",
       "loves_tea",
       "invented_boba_tea",
       "originally_voiced_by_mako",
       "male"
     ],
     "nation": "Fire Nation",
     "role": "Grand Lotus",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "General (retired)",
       "Prince",
       "The Dragon of the West",
       "Grand Lotus"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nThe former Crown Prince of the Fire Nation, General Iroh abandoned his quest for power after the tragic death of his son, Lu Ten. Choosing a life of peace, wisdom, and tea, he accompanies his banished nephew Zuko, acting as his moral compass and father figure. Iroh's deep understanding of balance, spirituality, and all four elements makes him a powerful ally and a sage voice of reason in a world consumed by war.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Abandoned the 600-day siege of Ba Sing Se after the death of his son.\r\n- Invented the technique of lightning redirection by studying waterbenders.\r\n- As a Grand Lotus, led the Order of the White Lotus to liberate Ba Sing Se.\r\n- After the war, ascended to the Spirit World, leaving his mortal body behind.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe primary mentor figure whose wisdom, kindness, and guidance are crucial for Zuko's redemption and the restoration of balance.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Zuko** – Nephew, surrogate son.\r\n- **Ozai** – Younger brother, rival.\r\n- **Lu Ten** – Son, deceased.\r\n- **Aang & Team Avatar** – Allies and mentees.\r\n- **Order of the White Lotus** – Grand Lotus.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Wise and patient.\r\n- Kind, compassionate, and deeply spiritual.\r\n- Easy-going, humorous, and humble.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Pride is not the opposite of shame, but its source. True humility is the only antidote to shame.\"\r\n- \"Sometimes life is like this dark tunnel. You can't always see the light at the end of the tunnel, but if you just keep moving, you will come to a better place.\"\r\n- \"Sharing tea with a fascinating stranger is one of life's true delights.\"",
+    "expandedView": "### 📖 Overview\n\nThe former Crown Prince of the Fire Nation, General Iroh abandoned his quest for power after the tragic death of his son, Lu Ten. Choosing a life of peace, wisdom, and tea, he accompanies his banished nephew Zuko, acting as his moral compass and father figure. Iroh's deep understanding of balance, spirituality, and all four elements makes him a powerful ally and a sage voice of reason in a world consumed by war.\n\n### ✨ Narrative Highlights\n\n- Abandoned the 600-day siege of Ba Sing Se after the death of his son.\n- Invented the technique of lightning redirection by studying waterbenders.\n- As a Grand Lotus, led the Order of the White Lotus to liberate Ba Sing Se.\n- After the war, ascended to the Spirit World, leaving his mortal body behind.\n\n### 🎭 Role in the Story\n\nThe primary mentor figure whose wisdom, kindness, and guidance are crucial for Zuko's redemption and the restoration of balance.\n\n### 🤝 Relationships\n\n- **Zuko** – Nephew, surrogate son.\n- **Ozai** – Younger brother, rival.\n- **Lu Ten** – Son, deceased.\n- **Aang & Team Avatar** – Allies and mentees.\n- **Order of the White Lotus** – Grand Lotus.\n\n### 🌟 Notable Traits\n\n- Wise and patient.\n- Kind, compassionate, and deeply spiritual.\n- Easy-going, humorous, and humble.\n\n### 💬 Notable Quotes\n\n- \"Pride is not the opposite of shame, but its source. True humility is the only antidote to shame.\"\n- \"Sometimes life is like this dark tunnel. You can't always see the light at the end of the tunnel, but if you just keep moving, you will come to a better place.\"\n- \"Sharing tea with a fascinating stranger is one of life's true delights.\"",
     "metadata": {
       "shortdescription": "A retired Fire Nation general and the wise, tea-loving uncle to Prince Zuko. Once a fearsome warrior known as the \"Dragon of the West,\" Iroh guides his nephew on a path of redemption and serves as a mentor to all he meets.",
       "fullName": "Iroh",
       "aliases": [
         "Mushi",
         "Hong Mushi"
       ],
       "ageChronological": 60,
       "ageBiological": 60,
       "ageRange": "elder",
       "birthDate": "c. 45 AG",
       "deathDate": null,
       "nativeLocation": "Fire Nation Capital",
       "currentLocation": "Spirit World",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "legendary",
       "advancedBending": [
         "lightning generation",
         "lightning redirection"
       ],
@@ -6151,51 +6153,51 @@
       "calm",
       "admiral_defected",
       "deserter",
       "liberated_ba_sing_se",
       "taught_the_avatar",
       "fire_nation",
       "fire_nation_navy",
       "order_of_the_white_lotus",
       "earth_kingdom",
       "first_deserter",
       "hates_firebending",
       "had_a_vision_of_roku",
       "voiced_by_keone_young",
       "male"
     ],
     "nation": "Fire Nation",
     "role": "The Deserter",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Admiral (ex-Fire Nation)",
       "Master"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nOnce a celebrated admiral in the Fire Nation Navy, Jeong Jeong became horrified by the destruction wrought by his element and his students. He deserted his post, forever branded as \"The Deserter.\" Living as a nomad in the Earth Kingdom, he adopted a philosophy of discipline and restraint, viewing firebending as a dangerous curse. His wisdom and immense power make him a formidable, if reluctant, master and a key member of the Order of the White Lotus.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- First person known to have deserted the Fire Nation military and survived.\r\n- Reluctantly agreed to teach Avatar Aang after being visited by the spirit of Avatar Roku.\r\n- Emphasized discipline and control as the core of firebending, not rage.\r\n- As a member of the White Lotus, helped liberate Ba Sing Se from Fire Nation control.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA wise but embittered mentor who introduces Aang to the dangers and responsibilities of firebending, representing an alternative to the Fire Nation's philosophy of destruction.\r\n\r\n### 🤝 Relationships\r\n\r\n- Aang (Reluctant Student)\r\n- Zhao (Former Student, Greatest Failure)\r\n- Order of the White Lotus (Fellow Members)\r\n- Roku (Spiritual Guide)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Embittered & Jaded\r\n- Wise & Disciplined\r\n- Spiritual & Enlightened\r\n- Reluctant & Cautious\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"Fire brings only destruction and pain.\"\r\n- \"You have not yet mastered water, or earth. You are not ready for fire!\"\r\n- \"Destiny? What would a boy know of destiny?\"",
+    "expandedView": "### 📖 Overview\n\nOnce a celebrated admiral in the Fire Nation Navy, Jeong Jeong became horrified by the destruction wrought by his element and his students. He deserted his post, forever branded as \"The Deserter.\" Living as a nomad in the Earth Kingdom, he adopted a philosophy of discipline and restraint, viewing firebending as a dangerous curse. His wisdom and immense power make him a formidable, if reluctant, master and a key member of the Order of the White Lotus.\n\n### ✨ Narrative Highlights\n\n- First person known to have deserted the Fire Nation military and survived.\n- Reluctantly agreed to teach Avatar Aang after being visited by the spirit of Avatar Roku.\n- Emphasized discipline and control as the core of firebending, not rage.\n- As a member of the White Lotus, helped liberate Ba Sing Se from Fire Nation control.\n\n### 🎭 Role in the Story\n\nA wise but embittered mentor who introduces Aang to the dangers and responsibilities of firebending, representing an alternative to the Fire Nation's philosophy of destruction.\n\n### 🤝 Relationships\n\n- Aang (Reluctant Student)\n- Zhao (Former Student, Greatest Failure)\n- Order of the White Lotus (Fellow Members)\n- Roku (Spiritual Guide)\n\n### 🧬 Notable Traits\n\n- Embittered & Jaded\n- Wise & Disciplined\n- Spiritual & Enlightened\n- Reluctant & Cautious\n\n### 🗣️ Notable Quotes\n\n- \"Fire brings only destruction and pain.\"\n- \"You have not yet mastered water, or earth. You are not ready for fire!\"\n- \"Destiny? What would a boy know of destiny?\"",
     "metadata": {
       "shortdescription": "A disillusioned firebending master and the first admiral to successfully desert the Fire Nation military. He views his own bending as a curse and reluctantly agrees to become Aang's first firebending teacher.",
       "slug": "jeong-jeong",
       "fullName": "Jeong Jeong",
       "aliases": [],
       "ageChronological": 61,
       "ageBiological": 61,
       "ageRange": "elder",
       "birthDate": "39 AG",
       "deathDate": null,
       "nativeLocation": "Fire Nation",
       "currentLocation": "Unknown",
       "socioeconomicStanding": "refugee",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "master",
       "advancedBending": [],
       "nonBendingSkills": [
         "philosophy",
         "teaching"
       ],
       "uniqueTechniques": [
@@ -6509,51 +6511,51 @@
       "freedom_fighter",
       "vigilante",
       "attempted_to_flood_gaipan",
       "confronted_zuko_in_ba_sing_se",
       "brainwashed_by_dai_li",
       "died_at_lake_laogai",
       "earth_kingdom",
       "freedom_fighters",
       "ba_sing_se",
       "lake_laogai",
       "chews_wheat",
       "unclear_death",
       "crush_on_katara",
       "hook_swords",
       "male"
     ],
     "nation": "Earth Kingdom",
     "role": "Freedom Fighter",
     "gender": "male",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "Leader"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nAfter witnessing the death of his parents at the hands of the Fire Nation, Jet dedicated his life to a guerrilla war against them. As the leader of the Freedom Fighters, he used his charisma and combat prowess to rally other refugees to his cause. However, his all-consuming hatred led him to endanger innocent lives, creating a conflict with Team Avatar. After attempting to start a new life in Ba Sing Se, he was brainwashed by the Dai Li and ultimately sacrificed himself to save the Avatar.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Formed and led the Freedom Fighters, a group of Earth Kingdom refugees.\r\n- Attempted to destroy a dam to flood a town occupied by Fire Nation soldiers and civilians.\r\n- Was captured and brainwashed by the Dai Li in Ba Sing Se.\r\n- Fatally wounded by Long Feng after breaking free of his mind control to help Aang.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA tragic anti-hero whose story serves as a cautionary tale about how the desire for justice can be corrupted by hatred and revenge.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Katara** – Former crush, betrayed by his extremism.\r\n- **Sokka** – Rival, strategic and moral counterpoint.\r\n- **Smellerbee & Longshot** – Loyal lieutenants and friends.\r\n- **Zuko & Iroh** – Enemies, targets of his suspicion.\r\n- **Long Feng** – Captor and killer.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Charismatic and persuasive leader.\r\n- Vengeful and obsessive in his quest for justice.\r\n- Paranoid and ruthless when threatened.\r\n- Loyal to his cause and followers.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"You want to know my problem? I'm the one who's not confused.\"\r\n- \"The sacrifices are necessary.\"\r\n- \"I'm a freedom fighter.\"",
+    "expandedView": "### 📖 Overview\n\nAfter witnessing the death of his parents at the hands of the Fire Nation, Jet dedicated his life to a guerrilla war against them. As the leader of the Freedom Fighters, he used his charisma and combat prowess to rally other refugees to his cause. However, his all-consuming hatred led him to endanger innocent lives, creating a conflict with Team Avatar. After attempting to start a new life in Ba Sing Se, he was brainwashed by the Dai Li and ultimately sacrificed himself to save the Avatar.\n\n### ✨ Narrative Highlights\n\n- Formed and led the Freedom Fighters, a group of Earth Kingdom refugees.\n- Attempted to destroy a dam to flood a town occupied by Fire Nation soldiers and civilians.\n- Was captured and brainwashed by the Dai Li in Ba Sing Se.\n- Fatally wounded by Long Feng after breaking free of his mind control to help Aang.\n\n### 🎭 Role in the Story\n\nA tragic anti-hero whose story serves as a cautionary tale about how the desire for justice can be corrupted by hatred and revenge.\n\n### 🤝 Relationships\n\n- **Katara** – Former crush, betrayed by his extremism.\n- **Sokka** – Rival, strategic and moral counterpoint.\n- **Smellerbee & Longshot** – Loyal lieutenants and friends.\n- **Zuko & Iroh** – Enemies, targets of his suspicion.\n- **Long Feng** – Captor and killer.\n\n### 🌟 Notable Traits\n\n- Charismatic and persuasive leader.\n- Vengeful and obsessive in his quest for justice.\n- Paranoid and ruthless when threatened.\n- Loyal to his cause and followers.\n\n### 💬 Notable Quotes\n\n- \"You want to know my problem? I'm the one who's not confused.\"\n- \"The sacrifices are necessary.\"\n- \"I'm a freedom fighter.\"",
     "metadata": {
       "badge": "Freedom Fighter Leader",
       "shortdescription": "The charismatic, vengeful, and tragic male teen leader of the Freedom Fighters, Jet is a skilled swordsman whose hatred of the Fire Nation drives him to extremist measures and ultimately a tragic fate.",
       "fullName": "Jet",
       "aliases": [],
       "ageChronological": 16,
       "ageBiological": 16,
       "ageRange": "teen",
       "birthDate": "83 AG",
       "deathDate": "100 AG",
       "nativeLocation": "Unknown",
       "currentLocation": "Deceased",
       "socioeconomicStanding": "refugee",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "swordsmanship (dual hook swords)",
         "stealth",
         "guerrilla tactics",
         "leadership"
@@ -7217,51 +7219,51 @@
       "r",
       "comic_relief",
       "bureaucratic_foil",
       "brainwashed",
       "servant_of_dai_li",
       "subordinate_to_azula",
       "guide_to_team_avatar",
       "cheerful",
       "mechanical",
       "ba_sing_se_bureaucracy",
       "city_of_walls_and_secrets",
       "brainwashing",
       "earth_kingdom",
       "ba_sing_se",
       "multiple_joo_dees",
       "perpetual_smile",
       "female"
     ],
     "nation": "Earth Kingdom",
     "role": "Cultural Guide",
     "gender": "female",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nJoo Dee is the ever-smiling, brainwashed tour guide and bureaucrat of Ba Sing Se. She was programmed by the Dai Li to keep visitors compliant and neutralize outside influences, serving as both a guide and later as Supreme Bureaucratic Administrator.\r\n\r\n### 🧩 Role in the Story\r\n\r\nJoo Dee was one of a number of public servants in Ba Sing Se using the same name who had been brainwashed by the Dai Li to be a guide for important visitors to the city. Her robotic, cheery demeanor, mechanical mannerisms, and tendency to hold the party line were all the result of brainwashing. Joo Dee once served as a caretaker and tour guide for Team Avatar after their arrival in the city, and later as Supreme Bureaucratic Administrator under Azula. Her primary purpose was to neutralize unwanted outside influences and maintain the city's official narrative.\r\n\r\n### 🤝 Relationships\r\n\r\n- Dai Li: Controllers\r\n- Azula: Superior\r\n- Team Avatar: Charges\r\n- Fire Nation: Ally\r\n- Long Feng: Secondary affiliation\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Cheerful\r\n- Compliant\r\n- Mechanical\r\n- Diplomatic\r\n- Calm\r\n- Controlled\r\n\r\n### 💬 Quotes\r\n\r\n> \"You're in Ba Sing Se now. Everyone is safe here.\"\r\n> — Joo Dee\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Served as tour guide and caretaker for Team Avatar in Ba Sing Se.\r\n- Maintained composure and compliance under Dai Li brainwashing.\r\n- Appointed Supreme Bureaucratic Administrator by Azula.",
+    "expandedView": "### 📖 Overview\n\nJoo Dee is the ever-smiling, brainwashed tour guide and bureaucrat of Ba Sing Se. She was programmed by the Dai Li to keep visitors compliant and neutralize outside influences, serving as both a guide and later as Supreme Bureaucratic Administrator.\n\n### 🧩 Role in the Story\n\nJoo Dee was one of a number of public servants in Ba Sing Se using the same name who had been brainwashed by the Dai Li to be a guide for important visitors to the city. Her robotic, cheery demeanor, mechanical mannerisms, and tendency to hold the party line were all the result of brainwashing. Joo Dee once served as a caretaker and tour guide for Team Avatar after their arrival in the city, and later as Supreme Bureaucratic Administrator under Azula. Her primary purpose was to neutralize unwanted outside influences and maintain the city's official narrative.\n\n### 🤝 Relationships\n\n- Dai Li: Controllers\n- Azula: Superior\n- Team Avatar: Charges\n- Fire Nation: Ally\n- Long Feng: Secondary affiliation\n\n### 🌟 Notable Traits\n\n- Cheerful\n- Compliant\n- Mechanical\n- Diplomatic\n- Calm\n- Controlled\n\n### 💬 Quotes\n\n> \"You're in Ba Sing Se now. Everyone is safe here.\"\n> — Joo Dee\n\n### ✨ Narrative Highlights\n\n- Served as tour guide and caretaker for Team Avatar in Ba Sing Se.\n- Maintained composure and compliance under Dai Li brainwashing.\n- Appointed Supreme Bureaucratic Administrator by Azula.",
     "metadata": {
       "badge": "Ba Sing Se Guide",
       "shortdescription": "Joo Dee is the ever-smiling, eerily polite, and brainwashed female nonbender who serves as a government-appointed tour guide and bureaucrat for visitors to Ba Sing Se, maintaining order under the Dai Li and Azula.",
       "slug": "joo-dee",
       "fullName": "Joo Dee",
       "aliases": [],
       "ageChronological": null,
       "ageBiological": null,
       "ageRange": "adult",
       "birthDate": null,
       "deathDate": null,
       "nativeLocation": "Ba Sing Se",
       "socioeconomicStanding": "bureaucrat",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": null,
       "advancedBending": [],
       "nonBendingSkills": [
         "diplomacy",
         "protocol",
         "public relations",
         "compliance"
@@ -7481,51 +7483,51 @@
       "works_for_iroh",
       "confident",
       "sassy",
       "uncaring",
       "cynical",
       "professional",
       "mercenary",
       "hunted_the_avatar",
       "hunted_iroh",
       "became_a_tea_discoverer",
       "earth_kingdom",
       "jasmine_dragon",
       "has_a_shirshu",
       "irohs_crush",
       "voiced_by_jennifer_hale",
       "retired_bounty_hunter",
       "female"
     ],
     "nation": "Earth Kingdom",
     "role": "Bounty Hunter",
     "gender": "female",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nAn infamous bounty hunter with a reputation for success, June operates with a cool, professional detachment. Aided by her powerful, scent-tracking shirshu, Nyla, she is a master of capture and combat. Though she initially works only for money, she demonstrates a deeper sense of morality when it truly matters, eventually leaving her old life behind for a new, more peaceful career.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Hired by Zuko to track the Avatar using Katara's necklace.\r\n- Hired again by Zuko to find Iroh, leading Team Avatar to the Order of the White Lotus.\r\n- Retired from bounty hunting to become the \"tea discoverer\" for Iroh's Jasmine Dragon.\r\n- Rescued Iroh from a vengeful crime boss.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA recurring neutral party whose unique skills serve as a crucial plot device, and whose presence tests the resolve and morality of the main characters.\r\n\r\n### 🤝 Relationships\r\n\r\n- Nyla (Shirshu, Lifelong Companion)\r\n- Zuko (Client)\r\n- Iroh (Client, Admirer, Eventual Employer)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Confident & Self-assured\r\n- Sassy & Sarcastic\r\n- Uncaring & Professional (outwardly)\r\n- Pragmatic\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"I'm a little short on money.\"\r\n- \"Sounds like a nasty situation. Hope you find a way out of it.\"\r\n- \"My Snuffly Wuffly!\"",
+    "expandedView": "### 📖 Overview\n\nAn infamous bounty hunter with a reputation for success, June operates with a cool, professional detachment. Aided by her powerful, scent-tracking shirshu, Nyla, she is a master of capture and combat. Though she initially works only for money, she demonstrates a deeper sense of morality when it truly matters, eventually leaving her old life behind for a new, more peaceful career.\n\n### ✨ Narrative Highlights\n\n- Hired by Zuko to track the Avatar using Katara's necklace.\n- Hired again by Zuko to find Iroh, leading Team Avatar to the Order of the White Lotus.\n- Retired from bounty hunting to become the \"tea discoverer\" for Iroh's Jasmine Dragon.\n- Rescued Iroh from a vengeful crime boss.\n\n### 🎭 Role in the Story\n\nA recurring neutral party whose unique skills serve as a crucial plot device, and whose presence tests the resolve and morality of the main characters.\n\n### 🤝 Relationships\n\n- Nyla (Shirshu, Lifelong Companion)\n- Zuko (Client)\n- Iroh (Client, Admirer, Eventual Employer)\n\n### 🧬 Notable Traits\n\n- Confident & Self-assured\n- Sassy & Sarcastic\n- Uncaring & Professional (outwardly)\n- Pragmatic\n\n### 🗣️ Notable Quotes\n\n- \"I'm a little short on money.\"\n- \"Sounds like a nasty situation. Hope you find a way out of it.\"\n- \"My Snuffly Wuffly!\"",
     "metadata": {
       "badge": "Bounty Hunter",
       "shortdescription": "A confident, formidable, and sassy young adult female bounty hunter from the Earth Kingdom, June is known for her unmatched tracking skills, professional detachment, and her partnership with the shirshu Nyla. Her journey takes her from mercenary work to a new life at the Jasmine Dragon.",
       "fullName": "June",
       "aliases": [],
       "ageChronological": 25,
       "ageBiological": 25,
       "ageRange": "young adult",
       "birthDate": "c. 75 AG",
       "deathDate": null,
       "nativeLocation": "Unknown",
       "currentLocation": "Unknown (Nomadic)",
       "socioeconomicStanding": "merchant",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "whip mastery",
         "tracking",
         "hand-to-hand combat",
         "shirshu riding"
@@ -7769,51 +7771,51 @@
   {
     "id": "kanna",
     "name": "Kanna",
     "summary": "Kanna, affectionately known as Gran Gran, is Katara and Sokka's wise and loving grandmother in the Southern Water Tribe.",
     "type": "character",
     "slug": "kanna",
     "tags": [
       "southern_water_tribe",
       "northern_water_tribe",
       "elder",
       "midwife",
       "grandmother",
       "book_one",
       "the_boy_in_the_iceberg",
       "water_tribe",
       "female"
     ],
     "image": null,
     "nation": "Southern Water Tribe",
     "role": "Elder, Midwife, Grandmother",
     "gender": "Female",
     "ethnicity": "Water Tribe",
     "titles": [
       "Gran Gran"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nKanna, known as Gran Gran, is Katara and Sokka's wise and caring grandmother. A nonbender, she is the oldest resident of Wolf Cove and a respected elder, midwife, and healer in the Southern Water Tribe.\r\n\r\n### 🧩 Role in the Story\r\n\r\nBorn in the Northern Water Tribe, Kanna fled to the South to escape an arranged marriage to Pakku, later becoming a respected elder and midwife in the Southern Water Tribe. She raised Katara and Sokka after their mother's death and their father's departure. After the Siege of the North, she reunited with Pakku and eventually married him. Kanna is known for her wisdom, resilience, and deep love for her family and tribe.\r\n\r\n### 🤝 Relationships\r\n\r\n- Katara: Granddaughter\r\n- Sokka: Grandson\r\n- Hakoda: Son\r\n- Kya: Daughter-in-law\r\n- Pakku: Husband\r\n- Hama: Friend\r\n- Yagoda: Friend\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Wise\r\n- Caring\r\n- Resilient\r\n- Hopeful\r\n- Pragmatic\r\n- Loving\r\n- Protective\r\n\r\n### 💬 Quotes\r\n\r\n> \"It's been so long since I've had hope, but you brought it back to life, my little waterbender.\"\r\n> — Kanna\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Respected elder and midwife of the Southern Water Tribe.\r\n- Raised Katara and Sokka after their mother's death.\r\n- Escaped an arranged marriage and started a new life in the South.",
+    "expandedView": "### 📖 Overview\n\nKanna, known as Gran Gran, is Katara and Sokka's wise and caring grandmother. A nonbender, she is the oldest resident of Wolf Cove and a respected elder, midwife, and healer in the Southern Water Tribe.\n\n### 🧩 Role in the Story\n\nBorn in the Northern Water Tribe, Kanna fled to the South to escape an arranged marriage to Pakku, later becoming a respected elder and midwife in the Southern Water Tribe. She raised Katara and Sokka after their mother's death and their father's departure. After the Siege of the North, she reunited with Pakku and eventually married him. Kanna is known for her wisdom, resilience, and deep love for her family and tribe.\n\n### 🤝 Relationships\n\n- Katara: Granddaughter\n- Sokka: Grandson\n- Hakoda: Son\n- Kya: Daughter-in-law\n- Pakku: Husband\n- Hama: Friend\n- Yagoda: Friend\n\n### 🌟 Notable Traits\n\n- Wise\n- Caring\n- Resilient\n- Hopeful\n- Pragmatic\n- Loving\n- Protective\n\n### 💬 Quotes\n\n> \"It's been so long since I've had hope, but you brought it back to life, my little waterbender.\"\n> — Kanna\n\n### ✨ Narrative Highlights\n\n- Respected elder and midwife of the Southern Water Tribe.\n- Raised Katara and Sokka after their mother's death.\n- Escaped an arranged marriage and started a new life in the South.",
     "metadata": {
       "badge": "Gran Gran",
       "shortdescription": "Kanna, affectionately known as Gran Gran, is a wise, loving, and protective elderly female nonbender who serves as Katara and Sokka's grandmother, midwife, and respected elder of the Southern Water Tribe.",
       "slug": "kanna",
       "shortDescription": "Kanna, affectionately known as Gran Gran, is Katara and Sokka's wise and loving grandmother in the Southern Water Tribe.",
       "fullName": "Kanna",
       "aliases": [
         "Gran Gran"
       ],
       "pronouns": "she/her",
       "age": 80,
       "hairColor": "Gray (brown in youth)",
       "eyeColor": "Blue",
       "skinColor": "Brown",
       "loveInterest": "Hakoda's father (deceased), Pakku (husband)",
       "abilities": {
         "bending": [],
         "weapons": [],
         "fightingStyles": [],
         "notableFeats": [
           "Respected elder and midwife of the Southern Water Tribe.",
           "Raised Katara and Sokka after their mother's death.",
           "Escaped an arranged marriage and started a new life in the South."
         ]
       },
@@ -7985,51 +7987,51 @@
       "mastered_bloodbending",
       "confronted_mothers_killer",
       "revived_the_avatar",
       "defeated_azula",
       "southern_water_tribe",
       "northern_water_tribe",
       "team_avatar",
       "painted_lady",
       "spirit_water",
       "voiced_by_mae_whitman",
       "wore_mothers_necklace",
       "narrator_of_opening_sequence",
       "trained_two_avatars",
       "female"
     ],
     "nation": "Southern Water Tribe",
     "role": "Waterbending Master",
     "gender": "female",
     "species": "human",
     "nationality": "Southern Water Tribe",
     "ethnicity": "Water Tribe",
     "titles": [
       "Master",
       "The Painted Lady"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nShaped by the tragic loss of her mother, Katara became the nurturing heart of her family and tribe. Upon freeing Aang from the iceberg, she embarks on a global journey, transforming from an untrained bender into one of the most powerful waterbending masters and healers in the world, all while serving as the moral compass for Team Avatar.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Discovered and freed Avatar Aang from a century of slumber.\r\n- Mastered the dark art of bloodbending to defeat Hama.\r\n- Confronted her mother's killer, ultimately choosing forgiveness over revenge.\r\n- Intelligently defeated a comet-enhanced Princess Azula in single combat.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe heart and moral compass of Team Avatar, whose compassion and fierce determination anchor the group and drive her to become one of the world's most powerful masters.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Aang** – Husband, student, closest ally.\r\n- **Sokka** – Brother, confidant.\r\n- **Toph Beifong** – Friend, rival.\r\n- **Zuko** – Enemy turned trusted ally.\r\n- **Hakoda** – Father.\r\n- **Hama** – Dark mentor.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Compassionate and motherly.\r\n- Determined, fierce, and hopeful.\r\n- Idealistic, stubborn, and prone to anger.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"I will never, ever turn my back on people who need me!\"\r\n- \"But I believe Aang can save the world.\"\r\n- \"You can't knock me down!\"",
+    "expandedView": "### 📖 Overview\n\nShaped by the tragic loss of her mother, Katara became the nurturing heart of her family and tribe. Upon freeing Aang from the iceberg, she embarks on a global journey, transforming from an untrained bender into one of the most powerful waterbending masters and healers in the world, all while serving as the moral compass for Team Avatar.\n\n### ✨ Narrative Highlights\n\n- Discovered and freed Avatar Aang from a century of slumber.\n- Mastered the dark art of bloodbending to defeat Hama.\n- Confronted her mother's killer, ultimately choosing forgiveness over revenge.\n- Intelligently defeated a comet-enhanced Princess Azula in single combat.\n\n### 🎭 Role in the Story\n\nThe heart and moral compass of Team Avatar, whose compassion and fierce determination anchor the group and drive her to become one of the world's most powerful masters.\n\n### 🤝 Relationships\n\n- **Aang** – Husband, student, closest ally.\n- **Sokka** – Brother, confidant.\n- **Toph Beifong** – Friend, rival.\n- **Zuko** – Enemy turned trusted ally.\n- **Hakoda** – Father.\n- **Hama** – Dark mentor.\n\n### 🌟 Notable Traits\n\n- Compassionate and motherly.\n- Determined, fierce, and hopeful.\n- Idealistic, stubborn, and prone to anger.\n\n### 💬 Notable Quotes\n\n- \"I will never, ever turn my back on people who need me!\"\n- \"But I believe Aang can save the world.\"\n- \"You can't knock me down!\"",
     "metadata": {
       "badge": "Waterbender Master",
       "shortdescription": "The last waterbender of the Southern Water Tribe, Katara is a determined, compassionate, and heroic teen girl whose hope leads her to discover the Avatar, become his first teacher, and grow into a legendary master and healer.",
       "fullName": "Katara",
       "aliases": [
         "Sapphire Fire",
         "June Pippinpaddleopsicopolis",
         "Gran Gran"
       ],
       "ageChronological": 89,
       "ageBiological": 89,
       "ageRange": "teen",
       "birthDate": "85 AG",
       "deathDate": null,
       "nativeLocation": "Wolf Cove",
       "currentLocation": "Southern Water Tribe",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "water",
       "bendingProficiency": "legendary",
       "advancedBending": [
         "healing",
@@ -8430,51 +8432,51 @@
       "decisive_later",
       "sheltered",
       "king",
       "monarch",
       "figurehead",
       "overthrew_long_feng",
       "deposed_by_azula",
       "harmony_restoration_movement",
       "earth_kingdom",
       "ba_sing_se",
       "houting_dynasty",
       "has_a_pet_bear",
       "voiced_by_phil_lamarr",
       "first_earth_king_to_leave_ba_sing_se",
       "male"
     ],
     "nation": "Earth Kingdom",
     "role": "Earth King",
     "gender": "male",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "King"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nAscending to the throne as a child, Kuei spent most of his life as a figurehead, oblivious to the Hundred Year War raging outside his palace walls. His world is shattered when Team Avatar reveals the conspiracy orchestrated by his advisor, Long Feng. After a brief, humbling exile, Kuei strives to become a strong and decisive leader for his people, though his newfound assertiveness nearly plunges the world back into war.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Lived in blissful ignorance of the war due to Long Feng's manipulation.\r\n- His pet bear, Bosco, was his closest and only true companion.\r\n- Was overthrown in a coup by Azula and the Dai Li.\r\n- After his restoration, almost restarted the war with the Fire Nation over the colonies.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA symbol of political naivety and the dangers of isolation, whose personal growth reflects the Earth Kingdom's struggle to find its place in a changing world.\r\n\r\n### 🤝 Relationships\r\n\r\n- Bosco (Pet Bear, Best Friend)\r\n- Long Feng (Manipulator, former Advisor)\r\n- Aang & Team Avatar (Allies, Awakeners)\r\n- Hou-Ting (Daughter, Successor)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Naive & Sheltered (initially)\r\n- Determined & Assertive (later)\r\n- Well-meaning\r\n- Animal-lover\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"The Earth Kingdom... has fallen.\"\r\n- \"All my life, I've been weak! It's time for me to be a man!\"\r\n- \"Just take the bear.\"",
+    "expandedView": "### 📖 Overview\n\nAscending to the throne as a child, Kuei spent most of his life as a figurehead, oblivious to the Hundred Year War raging outside his palace walls. His world is shattered when Team Avatar reveals the conspiracy orchestrated by his advisor, Long Feng. After a brief, humbling exile, Kuei strives to become a strong and decisive leader for his people, though his newfound assertiveness nearly plunges the world back into war.\n\n### ✨ Narrative Highlights\n\n- Lived in blissful ignorance of the war due to Long Feng's manipulation.\n- His pet bear, Bosco, was his closest and only true companion.\n- Was overthrown in a coup by Azula and the Dai Li.\n- After his restoration, almost restarted the war with the Fire Nation over the colonies.\n\n### 🎭 Role in the Story\n\nA symbol of political naivety and the dangers of isolation, whose personal growth reflects the Earth Kingdom's struggle to find its place in a changing world.\n\n### 🤝 Relationships\n\n- Bosco (Pet Bear, Best Friend)\n- Long Feng (Manipulator, former Advisor)\n- Aang & Team Avatar (Allies, Awakeners)\n- Hou-Ting (Daughter, Successor)\n\n### 🧬 Notable Traits\n\n- Naive & Sheltered (initially)\n- Determined & Assertive (later)\n- Well-meaning\n- Animal-lover\n\n### 🗣️ Notable Quotes\n\n- \"The Earth Kingdom... has fallen.\"\n- \"All my life, I've been weak! It's time for me to be a man!\"\n- \"Just take the bear.\"",
     "metadata": {
       "badge": "Earth King",
       "shortdescription": "The naive, sheltered, and well-meaning young adult male Earth King of Ba Sing Se, Kuei was a puppet ruler manipulated by Long Feng before growing into a more assertive, if sometimes rash, leader. His journey reflects the Earth Kingdom's struggle for identity and change.",
       "fullName": "Kuei",
       "aliases": [
         "The 52nd Earth King"
       ],
       "ageChronological": 25,
       "ageBiological": 25,
       "ageRange": "young adult",
       "birthDate": "c. 75 AG",
       "deathDate": null,
       "nativeLocation": "Ba Sing Se",
       "currentLocation": "Ba Sing Se",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "animal husbandry",
         "ruling"
@@ -8723,51 +8725,51 @@
   },
   {
     "id": "kuruk",
     "name": "Kuruk",
     "summary": "A carefree, powerful, and tragic adult male Avatar from the Northern Water Tribe, Kuruk was a legendary bender whose secret war against dark spirits and personal losses defined his short life.",
     "type": "character",
     "slug": "kuruk",
     "tags": [
       "northern_water_tribe",
       "water_tribe",
       "avatar",
       "bender",
       "tragic_hero",
       "book_two",
       "spirit_world",
       "male"
     ],
     "image": null,
     "nation": "Northern Water Tribe",
     "role": "Past Avatar, Tragic Hero, Bender, Male",
     "gender": "Male",
     "ethnicity": "Water Tribe",
     "titles": [
       "Avatar"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nKuruk was a \"go with the flow\" Avatar from the Northern Water Tribe whose carefree public life hid a secret, tragic war against dark spirits that ultimately consumed him. A powerful and charismatic Avatar, Kuruk's era was publicly one of peace, allowing him to pursue a life of pleasure and challenges. Secretly, he was engaged in a brutal, lonely war against a plague of dark spirits, a conflict that corrupted his own spirit and drained his life force. This tragic battle culminated in the loss of his fiancée, Ummi, to Koh the Face Stealer, leaving a legacy of regret and a world unprepared for the strife that followed his early death.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Secretly hunted and destroyed dark spirits to protect the world from a spiritual plague.\r\n- Lost his fiancée, Ummi, to Koh the Face Stealer as a punishment for his arrogance.\r\n- His neglect of mortal affairs led to a chaotic era for his successor, Kyoshi.\r\n- Died at the young age of 33 due to the spiritual toll of his battles.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA tragic past Avatar whose life serves as a cautionary tale about the spiritual duties of the Avatar and the consequences of neglecting the physical world.\r\n\r\n### 🤝 Relationships\r\n\r\n- Ummi (Fiancée, Lost Love)\r\n- Jianzhu, Kelsang, & Hei-Ran (Companions)\r\n- Koh the Face Stealer (Arch-Nemesis)\r\n- Kyoshi (Successor)\r\n- Yangchen (Predecessor)\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Easy-going & \"Go with the flow\" (Publicly)\r\n- Hedonistic & Arrogant (as a coping mechanism)\r\n- Tragic & Regretful (Privately)\r\n- Brave & Self-sacrificing\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"I had to do it. The world would have been destroyed.\"\r\n- \"Actively shape your own destiny, and the destiny of the world.\"\r\n- \"My wife's face... it was stolen by Koh, the Face Stealer.\"",
+    "expandedView": "### 📖 Overview\n\nKuruk was a \"go with the flow\" Avatar from the Northern Water Tribe whose carefree public life hid a secret, tragic war against dark spirits that ultimately consumed him. A powerful and charismatic Avatar, Kuruk's era was publicly one of peace, allowing him to pursue a life of pleasure and challenges. Secretly, he was engaged in a brutal, lonely war against a plague of dark spirits, a conflict that corrupted his own spirit and drained his life force. This tragic battle culminated in the loss of his fiancée, Ummi, to Koh the Face Stealer, leaving a legacy of regret and a world unprepared for the strife that followed his early death.\n\n### ✨ Narrative Highlights\n\n- Secretly hunted and destroyed dark spirits to protect the world from a spiritual plague.\n- Lost his fiancée, Ummi, to Koh the Face Stealer as a punishment for his arrogance.\n- His neglect of mortal affairs led to a chaotic era for his successor, Kyoshi.\n- Died at the young age of 33 due to the spiritual toll of his battles.\n\n### 🎭 Role in the Story\n\nA tragic past Avatar whose life serves as a cautionary tale about the spiritual duties of the Avatar and the consequences of neglecting the physical world.\n\n### 🤝 Relationships\n\n- Ummi (Fiancée, Lost Love)\n- Jianzhu, Kelsang, & Hei-Ran (Companions)\n- Koh the Face Stealer (Arch-Nemesis)\n- Kyoshi (Successor)\n- Yangchen (Predecessor)\n\n### 🌟 Notable Traits\n\n- Easy-going & \"Go with the flow\" (Publicly)\n- Hedonistic & Arrogant (as a coping mechanism)\n- Tragic & Regretful (Privately)\n- Brave & Self-sacrificing\n\n### 💬 Notable Quotes\n\n- \"I had to do it. The world would have been destroyed.\"\n- \"Actively shape your own destiny, and the destiny of the world.\"\n- \"My wife's face... it was stolen by Koh, the Face Stealer.\"",
     "metadata": {
       "badge": "Tragic Hero",
       "shortdescription": "A carefree, powerful, and tragic adult male Avatar from the Northern Water Tribe, Kuruk was a legendary bender whose secret war against dark spirits and personal losses defined his short life.",
       "slug": "kuruk",
       "shortDescription": "A carefree, powerful, and tragic adult male Avatar from the Northern Water Tribe, Kuruk was a legendary bender whose secret war against dark spirits and personal losses defined his short life.",
       "fullName": "Kuruk",
       "aliases": [],
       "pronouns": "he/him",
       "age": 33,
       "ageRange": "adult",
       "hairColor": "Black",
       "eyeColor": "Blue",
       "skinColor": null,
       "loveInterest": "Ummi (fiancée)",
       "abilities": {
         "bending": [
           "Waterbending",
           "Earthbending",
           "Firebending",
           "Airbending"
         ],
         "weapons": [],
         "fightingStyles": [
           "Avatar State",
           "Spirit Tracking",
@@ -9251,51 +9253,51 @@
       "earth_kingdom",
       "avatar",
       "mentor",
       "warrior",
       "bender",
       "legendary",
       "elder",
       "founder",
       "justice",
       "book_two",
       "kyoshi_island",
       "dai_li",
       "kyoshi_warriors",
       "rangi",
       "chin_the_conqueror",
       "female"
     ],
     "image": null,
     "nation": "Earth Kingdom",
     "role": "Past Avatar, Mentor, Warrior, Founder, Legendary Bender",
     "gender": "Female",
     "ethnicity": "Air Nomad-Earth Kingdom",
     "titles": [
       "Avatar"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nKyoshi was the physically imposing and long-lived Earth Kingdom Avatar who believed that only true, uncompromising justice could bring peace, a philosophy that shaped the world for centuries. Abandoned as a child and not discovered as the Avatar until her teens, Kyoshi's early life was defined by hardship and survival. This forged her into a pragmatic and ruthlessly effective Avatar who valued justice above all else. During her 230-year lifespan, she ended the tyrannical conquest of Chin the Conqueror, founded both the elite Kyoshi Warriors and the Dai Li, and brought about an unprecedented era of peace, leaving a complex and enduring legacy.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Lived to be 230 years old, the oldest known human.\r\n- Used the Avatar State to separate her home peninsula, creating Kyoshi Island.\r\n- Founded two elite orders: the Kyoshi Warriors and the Dai Li of Ba Sing Se.\r\n- Defeated Chin the Conqueror, ending his reign of terror over the Earth Kingdom.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA legendary predecessor to Aang whose life and ruthless methods serve as a stark philosophical counterpoint, forcing Aang to question the nature of justice and peace.\r\n\r\n### 🤝 Relationships\r\n\r\n- Rangi – Girlfriend, firebending master.\r\n- Kelsang – Adoptive father, mentor.\r\n- Yun – Childhood friend, later enemy.\r\n- The Flying Opera Company – Found family, allies.\r\n- Roku – Successor.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Fierce and uncompromising.\r\n- Just, protective, and pragmatic.\r\n- Decisive, reserved, and self-doubting (internally).\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Only justice will bring peace.\"\r\n- \"My friend is not a diplomat. She is the failure of diplomacy.\"\r\n- \"I killed Chin the Conqueror.\"",
+    "expandedView": "### 📖 Overview\n\nKyoshi was the physically imposing and long-lived Earth Kingdom Avatar who believed that only true, uncompromising justice could bring peace, a philosophy that shaped the world for centuries. Abandoned as a child and not discovered as the Avatar until her teens, Kyoshi's early life was defined by hardship and survival. This forged her into a pragmatic and ruthlessly effective Avatar who valued justice above all else. During her 230-year lifespan, she ended the tyrannical conquest of Chin the Conqueror, founded both the elite Kyoshi Warriors and the Dai Li, and brought about an unprecedented era of peace, leaving a complex and enduring legacy.\n\n### ✨ Narrative Highlights\n\n- Lived to be 230 years old, the oldest known human.\n- Used the Avatar State to separate her home peninsula, creating Kyoshi Island.\n- Founded two elite orders: the Kyoshi Warriors and the Dai Li of Ba Sing Se.\n- Defeated Chin the Conqueror, ending his reign of terror over the Earth Kingdom.\n\n### 🎭 Role in the Story\n\nA legendary predecessor to Aang whose life and ruthless methods serve as a stark philosophical counterpoint, forcing Aang to question the nature of justice and peace.\n\n### 🤝 Relationships\n\n- Rangi – Girlfriend, firebending master.\n- Kelsang – Adoptive father, mentor.\n- Yun – Childhood friend, later enemy.\n- The Flying Opera Company – Found family, allies.\n- Roku – Successor.\n\n### 🌟 Notable Traits\n\n- Fierce and uncompromising.\n- Just, protective, and pragmatic.\n- Decisive, reserved, and self-doubting (internally).\n\n### 💬 Notable Quotes\n\n- \"Only justice will bring peace.\"\n- \"My friend is not a diplomat. She is the failure of diplomacy.\"\n- \"I killed Chin the Conqueror.\"",
     "metadata": {
       "badge": "Justice Incarnate",
       "shortdescription": "The physically imposing, legendary, and long-lived female elder Avatar of the Earth Kingdom, Kyoshi is a fierce bender, warrior, and founder of the Kyoshi Warriors and Dai Li, known for her uncompromising sense of justice and her relationship with Rangi.",
       "slug": "kyoshi",
       "shortDescription": "The physically imposing, legendary, and long-lived female elder Avatar of the Earth Kingdom, Kyoshi is a fierce bender, warrior, and founder of the Kyoshi Warriors and Dai Li, known for her uncompromising sense of justice and her relationship with Rangi.",
       "fullName": "Kyoshi",
       "aliases": [],
       "pronouns": "she/her",
       "age": 230,
       "ageRange": "elder",
       "hairColor": null,
       "eyeColor": null,
       "skinColor": null,
       "loveInterest": "Rangi (girlfriend)",
       "abilities": {
         "bending": [
           "Earthbending",
           "Firebending",
           "Waterbending",
           "Airbending",
           "Lavabending"
         ],
         "weapons": [
           "War Fans"
         ],
@@ -9722,51 +9724,51 @@
           "Earth Kingdom",
           "Cranefish Town",
           "Gaoling"
         ]
       },
       "__type": "character"
     }
   },
   {
     "id": "lo-and-li",
     "name": "Lo and Li",
     "summary": "",
     "type": "character",
     "slug": "lo-and-li",
     "tags": [
       "fire_nation",
       "adviser",
       "mentor",
       "instructor",
       "book_two",
       "book_three",
       "the_avatar_state",
       "the_beach"
     ],
     "nation": "Fire Nation",
-    "expandedView": "### 📖 Overview\r\n\r\nLo and Li are the twin advisers and firebending instructors to Princess Azula. Though not firebenders themselves, they are respected for their wisdom, strategy, and mentorship within the Fire Nation. They are known for their dignified yet playful personalities and for being the first known nonbender firebending teachers in the Avatar franchise.\r\n\r\n### 🧩 Role in the Story\r\n\r\nThey served as mentors for Azula's firebending training and as political advisers to the Fire Nation Royal Family. The sisters spent much of their lives at their Ember Island beach house, escaping the chaos of the Fire Nation Capital. They accompanied Azula on her journey to the Earth Kingdom and played a key role in her strategies, presiding over rallies and offering wisdom to the younger generation.\r\n\r\n### 🤝 Relationships\r\n\r\n- Azula: Mentee\r\n- Zuko: Ally\r\n- Mai: Ally\r\n- Ty Lee: Ally\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Focused\r\n- Dignified\r\n- Playful\r\n- Wise\r\n- Calm\r\n\r\n### 💬 Quotes\r\n\r\n> \"Azula, we are concerned for you and your well being.\"\r\n> — Lo and Li\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Served as firebending instructors and political advisers to Princess Azula.\r\n- Presided over Fire Nation rallies and ceremonies.\r\n- Mentored Azula in strategy and discipline.\r\n- Known for their dignified yet playful personalities.",
+    "expandedView": "### 📖 Overview\n\nLo and Li are the twin advisers and firebending instructors to Princess Azula. Though not firebenders themselves, they are respected for their wisdom, strategy, and mentorship within the Fire Nation. They are known for their dignified yet playful personalities and for being the first known nonbender firebending teachers in the Avatar franchise.\n\n### 🧩 Role in the Story\n\nThey served as mentors for Azula's firebending training and as political advisers to the Fire Nation Royal Family. The sisters spent much of their lives at their Ember Island beach house, escaping the chaos of the Fire Nation Capital. They accompanied Azula on her journey to the Earth Kingdom and played a key role in her strategies, presiding over rallies and offering wisdom to the younger generation.\n\n### 🤝 Relationships\n\n- Azula: Mentee\n- Zuko: Ally\n- Mai: Ally\n- Ty Lee: Ally\n\n### 🌟 Notable Traits\n\n- Focused\n- Dignified\n- Playful\n- Wise\n- Calm\n\n### 💬 Quotes\n\n> \"Azula, we are concerned for you and your well being.\"\n> — Lo and Li\n\n### ✨ Narrative Highlights\n\n- Served as firebending instructors and political advisers to Princess Azula.\n- Presided over Fire Nation rallies and ceremonies.\n- Mentored Azula in strategy and discipline.\n- Known for their dignified yet playful personalities.",
     "metadata": {
       "badge": "Royal Advisers",
       "shortdescription": "Lo and Li are enigmatic, dignified, and wise female elder twins who serve as royal advisers, mentors, and instructors to Princess Azula and the Fire Nation Royal Family. Known for their synchronized speech and mysterious presence, they are respected nonbenders and elders in the Fire Nation court.",
       "slug": "lo-and-li",
       "identity": {
         "name": "Lo and Li",
         "fullName": "Lo and Li",
         "aliases": [],
         "pronouns": "they/them",
         "nation": "Fire Nation",
         "ethnicity": "Fire Nation",
         "gender": "Female",
         "age": null,
         "hairColor": "White (brown in youth)",
         "eyeColor": null,
         "skinColor": null,
         "loveInterest": null,
         "image": null,
         "role": "Royal Tutors",
         "titles": [
           "Tutor"
         ]
       },
       "abilities": {
         "bending": [],
@@ -9922,51 +9924,51 @@
       "dictator",
       "cultural_minister",
       "grand_secretariat",
       "fall_of_ba_sing_se",
       "lake_laogai_conspiracy",
       "ba_sing_se",
       "earth_kingdom",
       "dai_li",
       "lake_laogai",
       "voiced_by_clancy_brown",
       "wears_a_queue",
       "book_2_villain",
       "was_never_a_player",
       "male"
     ],
     "nation": "Earth Kingdom",
     "role": "Dai Li Leader",
     "gender": "male",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "Grand Secretariat",
       "Dai Li Head"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nRising from humble origins, Long Feng became the most powerful man in the Earth Kingdom by manipulating the young Earth King and seizing control of the Dai Li. He maintains a fragile utopia within Ba Sing Se by brainwashing citizens and erasing any knowledge of the war. His absolute control is challenged by the arrival of Team Avatar, and his web of lies unravels, leading to his downfall and the conquest of the city by Azula.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Ruled Ba Sing Se as a de facto dictator, keeping the Earth King as a puppet.\r\n- Utilized the Dai Li and Lake Laogai to brainwash dissenters.\r\n- Kidnapped Appa to use as leverage against the Avatar.\r\n- Was out-manipulated and overthrown by Princess Azula.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe primary antagonist of the Ba Sing Se arc, representing political corruption, the dangers of censorship, and oppressive control disguised as peace.\r\n\r\n### 🤝 Relationships\r\n\r\n- Earth King Kuei (Puppet Ruler)\r\n- The Dai Li (Secret Police, Subordinates)\r\n- Jet (Victim of Brainwashing)\r\n- Azula (Co-conspirator, Usurper)\r\n- Team Avatar (Enemies)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Manipulative & Cunning\r\n- Charismatic & Composed\r\n- Power-hungry & Ruthless\r\n- Patient & Calculating\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"There is no war in Ba Sing Se.\"\r\n- \"You've beaten me at my own game.\"\r\n- \"By silencing talk of conflict, Ba Sing Se remains a peaceful, orderly utopia.\"",
+    "expandedView": "### 📖 Overview\n\nRising from humble origins, Long Feng became the most powerful man in the Earth Kingdom by manipulating the young Earth King and seizing control of the Dai Li. He maintains a fragile utopia within Ba Sing Se by brainwashing citizens and erasing any knowledge of the war. His absolute control is challenged by the arrival of Team Avatar, and his web of lies unravels, leading to his downfall and the conquest of the city by Azula.\n\n### ✨ Narrative Highlights\n\n- Ruled Ba Sing Se as a de facto dictator, keeping the Earth King as a puppet.\n- Utilized the Dai Li and Lake Laogai to brainwash dissenters.\n- Kidnapped Appa to use as leverage against the Avatar.\n- Was out-manipulated and overthrown by Princess Azula.\n\n### 🎭 Role in the Story\n\nThe primary antagonist of the Ba Sing Se arc, representing political corruption, the dangers of censorship, and oppressive control disguised as peace.\n\n### 🤝 Relationships\n\n- Earth King Kuei (Puppet Ruler)\n- The Dai Li (Secret Police, Subordinates)\n- Jet (Victim of Brainwashing)\n- Azula (Co-conspirator, Usurper)\n- Team Avatar (Enemies)\n\n### 🧬 Notable Traits\n\n- Manipulative & Cunning\n- Charismatic & Composed\n- Power-hungry & Ruthless\n- Patient & Calculating\n\n### 🗣️ Notable Quotes\n\n- \"There is no war in Ba Sing Se.\"\n- \"You've beaten me at my own game.\"\n- \"By silencing talk of conflict, Ba Sing Se remains a peaceful, orderly utopia.\"",
     "metadata": {
       "badge": "Grand Secretariat",
       "shortdescription": "The charismatic, cunning, and manipulative adult male Grand Secretariat of Ba Sing Se, Long Feng is a master earthbender and leader of the Dai Li who secretly rules the city as a dictator, suppressing all mention of the Hundred Year War.",
       "fullName": "Long Feng",
       "aliases": [],
       "ageChronological": 40,
       "ageBiological": 40,
       "ageRange": "adult",
       "birthDate": "c. 60 AG",
       "deathDate": null,
       "nativeLocation": "Ba Sing Se",
       "currentLocation": "Unknown (Imprisoned, presumably)",
       "socioeconomicStanding": "merchant",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "earth",
       "bendingProficiency": "master",
       "advancedBending": [],
       "nonBendingSkills": [
         "political manipulation",
         "hypnotism",
         "strategy",
         "espionage"
@@ -10636,51 +10638,51 @@
       "passionate_internally",
       "nobility",
       "traitor_amnestied",
       "governors_daughter",
       "betrayed_azula",
       "rekindled_romance_with_zuko",
       "boiling_rock_incident",
       "helped_zuko",
       "fire_nation",
       "azulas_team",
       "new_ozai",
       "royal_fire_academy",
       "hates_orange",
       "skilled_at_shurikenjutsu",
       "parents_are_politicians",
       "broke_up_with_zuko",
       "female"
     ],
     "nation": "Fire Nation",
     "role": "Noblewoman",
     "gender": "female",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nRaised to be a perfectly behaved and quiet daughter of a prominent politician, Mai developed a deeply apathetic and emotionally distant personality. Recruited by Princess Azula for her deadly marksmanship, she becomes a formidable foe. However, her deep-seated love for Prince Zuko ultimately forces her to make a choice between her fear of Azula and her loyalty to him, a decision that changes the course of her life and the war.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Recruited into Azula's elite team to hunt the Avatar and Zuko.\r\n- Rekindled her childhood crush into a serious relationship with Prince Zuko.\r\n- Defied Princess Azula at the Boiling Rock, declaring \"I love Zuko more than I fear you\".\r\n- Aided Zuko against her own father's traitorous New Ozai Society after the war.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA secondary antagonist turned ally whose character arc explores how love can triumph over fear and apathy.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Zuko** – Boyfriend, former.\r\n- **Azula** – Commander, former.\r\n- **Ty Lee** – Friend.\r\n- **Ukano** – Father.\r\n- **Kei Lo** – Boyfriend, former.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Apathetic and bored.\r\n- Stoic, emotionally repressed, and loyal (to Zuko).\r\n- Brave and decisive when it counts.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"I love Zuko more than I fear you.\"\r\n- \"You're so beautiful when you hate the world.\"\r\n- \"Please tell me you're not here to rescue me.\"",
+    "expandedView": "### 📖 Overview\n\nRaised to be a perfectly behaved and quiet daughter of a prominent politician, Mai developed a deeply apathetic and emotionally distant personality. Recruited by Princess Azula for her deadly marksmanship, she becomes a formidable foe. However, her deep-seated love for Prince Zuko ultimately forces her to make a choice between her fear of Azula and her loyalty to him, a decision that changes the course of her life and the war.\n\n### ✨ Narrative Highlights\n\n- Recruited into Azula's elite team to hunt the Avatar and Zuko.\n- Rekindled her childhood crush into a serious relationship with Prince Zuko.\n- Defied Princess Azula at the Boiling Rock, declaring \"I love Zuko more than I fear you\".\n- Aided Zuko against her own father's traitorous New Ozai Society after the war.\n\n### 🎭 Role in the Story\n\nA secondary antagonist turned ally whose character arc explores how love can triumph over fear and apathy.\n\n### 🤝 Relationships\n\n- **Zuko** – Boyfriend, former.\n- **Azula** – Commander, former.\n- **Ty Lee** – Friend.\n- **Ukano** – Father.\n- **Kei Lo** – Boyfriend, former.\n\n### 🌟 Notable Traits\n\n- Apathetic and bored.\n- Stoic, emotionally repressed, and loyal (to Zuko).\n- Brave and decisive when it counts.\n\n### 💬 Notable Quotes\n\n- \"I love Zuko more than I fear you.\"\n- \"You're so beautiful when you hate the world.\"\n- \"Please tell me you're not here to rescue me.\"",
     "metadata": {
       "badge": "Knife-Throwing Noblewoman",
       "shortdescription": "A stoic, skilled, and loyal female teen nonbender from a privileged Fire Nation family, Mai is a master of knife-throwing, a key member of Azula's team, and Zuko's primary love interest. Her journey explores the triumph of love over fear and apathy.",
       "fullName": "Mai",
       "aliases": [],
       "ageChronological": 17,
       "ageBiological": 17,
       "ageRange": "teen",
       "birthDate": "85 AG",
       "deathDate": null,
       "nativeLocation": "Fire Nation",
       "currentLocation": "Fire Nation",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "shuriken-jutsu (knife throwing)",
         "marksmanship",
         "stealth",
         "acrobatics"
@@ -11008,51 +11010,51 @@
       "coming_of_age",
       "crush_on_aang",
       "apprentice_to_aunt_wu",
       "friend_of_katara",
       "cheerful",
       "hopeful",
       "smitten",
       "innocent",
       "makapu_village",
       "earth_kingdom",
       "unrequited_love",
       "personal_growth",
       "aunt_wus_fortune_salon",
       "female"
     ],
     "nation": "Earth Kingdom",
     "role": "Assistant, Apprentice",
     "gender": "female",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "Apprentice",
       "Assistant"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nMeng is a young girl from Makapu Village, serving as Aunt Wu's assistant and apprentice fortuneteller. She is known for her boundless optimism, helpfulness, and her innocent crush on Aang, which adds warmth and comic relief to \"The Fortuneteller.\" Despite her clumsiness, Meng is beloved for her delicious bean curd puffs and her hopeful outlook on love and fate.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Became Aunt Wu's assistant and helped with fortune readings in Makapu Village.\r\n- Developed a crush on Aang, believing he was her destined love due to Aunt Wu's prediction.\r\n- Provided Aang with Aunt Wu's cloud reading book, helping him on his quest.\r\n- Known for her delicious bean curd puffs and cheerful personality.\r\n- Waved goodbye to Team Avatar, showing her good-natured spirit even after unrequited love.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor but memorable character whose subplot highlights themes of fate, hope, young love, and the bittersweetness of unrequited feelings. Meng's interactions with Aang and Team Avatar add warmth and humor to the episode \"The Fortuneteller.\" Her story is a gentle exploration of growing up and learning to accept reality with grace.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Aunt Wu** – Mentor and employer; Meng looks up to her as a grandmother figure.\r\n- **Aang** – Crush; she believed he was her destined love.\r\n- **Katara** – Friend and confidante; Meng is supportive but also a little jealous.\r\n- **Team Avatar** – Allies during their visit to Makapu Village.\r\n- **Makapu Village** – Community she serves as assistant.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Optimistic and cheerful\r\n- Helpful and kind\r\n- Persistent in her affections\r\n- Clumsy but well-meaning\r\n- Innocent and idealistic\r\n- Quick to forgive\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"It's just really hard when you like someone, but they don't think of you that way.\"\r\n- \"You have pretty big ears, don't you? I guess they're... kind of cute.\"",
+    "expandedView": "### 📖 Overview\n\nMeng is a young girl from Makapu Village, serving as Aunt Wu's assistant and apprentice fortuneteller. She is known for her boundless optimism, helpfulness, and her innocent crush on Aang, which adds warmth and comic relief to \"The Fortuneteller.\" Despite her clumsiness, Meng is beloved for her delicious bean curd puffs and her hopeful outlook on love and fate.\n\n### ✨ Narrative Highlights\n\n- Became Aunt Wu's assistant and helped with fortune readings in Makapu Village.\n- Developed a crush on Aang, believing he was her destined love due to Aunt Wu's prediction.\n- Provided Aang with Aunt Wu's cloud reading book, helping him on his quest.\n- Known for her delicious bean curd puffs and cheerful personality.\n- Waved goodbye to Team Avatar, showing her good-natured spirit even after unrequited love.\n\n### 🎭 Role in the Story\n\nA minor but memorable character whose subplot highlights themes of fate, hope, young love, and the bittersweetness of unrequited feelings. Meng's interactions with Aang and Team Avatar add warmth and humor to the episode \"The Fortuneteller.\" Her story is a gentle exploration of growing up and learning to accept reality with grace.\n\n### 🤝 Relationships\n\n- **Aunt Wu** – Mentor and employer; Meng looks up to her as a grandmother figure.\n- **Aang** – Crush; she believed he was her destined love.\n- **Katara** – Friend and confidante; Meng is supportive but also a little jealous.\n- **Team Avatar** – Allies during their visit to Makapu Village.\n- **Makapu Village** – Community she serves as assistant.\n\n### 🌟 Notable Traits\n\n- Optimistic and cheerful\n- Helpful and kind\n- Persistent in her affections\n- Clumsy but well-meaning\n- Innocent and idealistic\n- Quick to forgive\n\n### 💬 Notable Quotes\n\n- \"It's just really hard when you like someone, but they don't think of you that way.\"\n- \"You have pretty big ears, don't you? I guess they're... kind of cute.\"",
     "metadata": {
       "badge": "Fortuneteller's Apprentice",
       "shortdescription": "Meng is Aunt Wu's eager apprentice in Makapu Village—a cheerful, kind-hearted girl known for her crush on Aang, her optimism, and her interest in fortune-telling.",
       "slug": "meng",
       "fullName": "Meng",
       "aliases": [
         "Makapu Girl",
         "Aunt Wu's Assistant"
       ],
       "ageChronological": 10,
       "ageBiological": 10,
       "ageRange": "child",
       "birthDate": null,
       "deathDate": null,
       "nativeLocation": "Makapu Village",
       "currentLocation": "Makapu Village",
       "socioeconomicStanding": "villager",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": null,
       "advancedBending": [],
       "nonBendingSkills": [
@@ -11277,51 +11279,51 @@
       "book_two",
       "book_three",
       "new_ozai",
       "postwar",
       "family_loyalty",
       "personal_growth",
       "mother_of_mai",
       "mother_of_tomtom",
       "sister_of_mura",
       "estranged_wife_of_ukano",
       "caring",
       "emotional",
       "resilient",
       "fire_nation_nobility",
       "postwar_adjustment",
       "female"
     ],
     "image": null,
     "nation": "Fire Nation",
     "role": "Florist, Noblewoman, Mother",
     "gender": "Female",
     "ethnicity": "Fire Nation",
     "titles": [
       "Lady Michi"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nMichi was a Fire Nation noblewoman, the wife of Ukano (former governor of New Ozai), and mother to Mai and Tom-Tom. Proud of her social standing, she supported her husband's career but ultimately prioritized her family's safety and well-being. After the Hundred Year War, she became skeptical of Ukano's opposition to Fire Lord Zuko and separated from him when he tried to indoctrinate their children against the new government. Michi later helped her sister Mura run a flower shop and encouraged her children to seek new opportunities, supporting them through difficult times.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Maintained a high-status household in the Fire Nation and New Ozai.\r\n- Survived an attack by the Omashu Resistance and was saved by Team Avatar.\r\n- Separated from Ukano to protect her children from political indoctrination.\r\n- Assisted her sister Mura in running a flower shop after leaving Ukano.\r\n- Encouraged Mai to pursue new opportunities and praised her positive traits.\r\n- Supported her family through the abduction of Tom-Tom and the family's adjustment to postwar life.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA supporting character whose arc highlights the tension between loyalty to family and political allegiance. Michi's journey from a status-focused noblewoman to a protective, independent parent adds depth to the postwar Fire Nation narrative.\r\n\r\n### 🤝 Relationships\r\n\r\n- Ukano – Husband (estranged); former governor of New Ozai.\r\n- Mai – Daughter; Michi is strict but caring, encouraging Mai to blossom and seek new challenges.\r\n- Tom-Tom – Son; Michi is protective and deeply concerned for his safety.\r\n- Mura – Sister; business partner in the flower shop.\r\n- Warden – Sibling; warden of the Boiling Rock prison.\r\n- Fire Nation – Ally by birth and marriage.\r\n- Yung, Omashu Resistance – Enemies during the occupation of Omashu.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Caring and supportive parent\r\n- Emotional and resilient\r\n- Values family over politics\r\n- Proud of social standing but willing to change for her children\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"I finally realized he cares more about politics than his own children's safety. So we're here now, on our own.\"",
+    "expandedView": "### 📖 Overview\n\nMichi was a Fire Nation noblewoman, the wife of Ukano (former governor of New Ozai), and mother to Mai and Tom-Tom. Proud of her social standing, she supported her husband's career but ultimately prioritized her family's safety and well-being. After the Hundred Year War, she became skeptical of Ukano's opposition to Fire Lord Zuko and separated from him when he tried to indoctrinate their children against the new government. Michi later helped her sister Mura run a flower shop and encouraged her children to seek new opportunities, supporting them through difficult times.\n\n### ✨ Narrative Highlights\n\n- Maintained a high-status household in the Fire Nation and New Ozai.\n- Survived an attack by the Omashu Resistance and was saved by Team Avatar.\n- Separated from Ukano to protect her children from political indoctrination.\n- Assisted her sister Mura in running a flower shop after leaving Ukano.\n- Encouraged Mai to pursue new opportunities and praised her positive traits.\n- Supported her family through the abduction of Tom-Tom and the family's adjustment to postwar life.\n\n### 🎭 Role in the Story\n\nA supporting character whose arc highlights the tension between loyalty to family and political allegiance. Michi's journey from a status-focused noblewoman to a protective, independent parent adds depth to the postwar Fire Nation narrative.\n\n### 🤝 Relationships\n\n- Ukano – Husband (estranged); former governor of New Ozai.\n- Mai – Daughter; Michi is strict but caring, encouraging Mai to blossom and seek new challenges.\n- Tom-Tom – Son; Michi is protective and deeply concerned for his safety.\n- Mura – Sister; business partner in the flower shop.\n- Warden – Sibling; warden of the Boiling Rock prison.\n- Fire Nation – Ally by birth and marriage.\n- Yung, Omashu Resistance – Enemies during the occupation of Omashu.\n\n### 🌟 Notable Traits\n\n- Caring and supportive parent\n- Emotional and resilient\n- Values family over politics\n- Proud of social standing but willing to change for her children\n\n### 💬 Notable Quotes\n\n- \"I finally realized he cares more about politics than his own children's safety. So we're here now, on our own.\"",
     "metadata": {
       "badge": "Noble Florist",
       "shortdescription": "A caring, resilient, and supportive adult female noblewoman and florist, Michi is known for her compassion, emotional strength, and for ultimately choosing her family's safety over politics during the postwar era.",
       "slug": "michi",
       "shortDescription": "A caring, resilient, and supportive adult female noblewoman and florist, Michi is known for her compassion, emotional strength, and for ultimately choosing her family's safety over politics during the postwar era.",
       "fullName": "Michi",
       "aliases": [],
       "pronouns": "she/her",
       "age": null,
       "hairColor": "Black",
       "eyeColor": null,
       "skinColor": null,
       "loveInterest": "Ukano (estranged)",
       "abilities": {
         "bending": [],
         "weapons": [],
         "fightingStyles": [],
         "notableFeats": [
           "Maintained a high-status household in the Fire Nation and New Ozai.",
           "Separated from Ukano to protect her children.",
           "Helped run a flower shop with her sister Mura."
         ]
       },
       "affiliations": {
         "primary": "Fire Nation",
@@ -11439,51 +11441,51 @@
         "createdAt": "2024-06-09T00:00:00Z",
         "flags": []
       },
       "__type": "character"
     }
   },
   {
     "id": "ming",
     "name": "Ming",
     "summary": "Ming is a compassionate, kind-hearted, and empathetic female nonbender who served as a prison guard in the Fire Nation, remembered for her kindness to Uncle Iroh during his imprisonment.",
     "type": "character",
     "slug": "ming",
     "tags": [
       "fire_nation",
       "prison_guard",
       "book_three",
       "the_day_of_black_sun",
       "female"
     ],
     "image": null,
     "nation": "Fire Nation",
     "role": "Prison Guard",
     "gender": "Female",
     "ethnicity": "Fire Nation",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nMing was a compassionate guard at the Capital City Prison in the Fire Nation. She is best known for her kindness toward Iroh during his imprisonment, often sneaking him rare teas and extra food. Her empathy and gentle nature set her apart from the other guards, and her actions made Iroh's days in prison more bearable.\r\n\r\n### 🧩 Role in the Story\r\n\r\nMing appears in \"The Day of Black Sun, Part 1: The Invasion\" as Iroh's primary caretaker in prison. She develops a quiet friendship with Iroh, showing him small acts of kindness. On the Day of Black Sun, Iroh warns her to take the day off, which she understands as a sign to avoid the coming chaos, thus sparing her from the events of his escape.\r\n\r\n### 🤝 Relationships\r\n\r\n- Iroh: She is sympathetic to Iroh, sneaking him tea and food, and is trusted enough to receive his warning.\r\n- Fire Nation: Loyal to her nation but guided by her own sense of compassion.\r\n- Warden Poon: Disapproves of his harsh treatment of prisoners.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Kind-hearted and empathetic\r\n- Discreet and supportive\r\n- Appreciates rare teas\r\n- Courageous in her quiet way\r\n\r\n### 💬 Quotes\r\n\r\n> \"I snuck in some white jade tea. I know you like rare teas.\"\r\n> — Ming\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Showed compassion to Iroh during his imprisonment.\r\n- Snuck in white jade tea and extra food for Iroh.\r\n- Heeded Iroh's warning and avoided the Day of Black Sun chaos.",
+    "expandedView": "### 📖 Overview\n\nMing was a compassionate guard at the Capital City Prison in the Fire Nation. She is best known for her kindness toward Iroh during his imprisonment, often sneaking him rare teas and extra food. Her empathy and gentle nature set her apart from the other guards, and her actions made Iroh's days in prison more bearable.\n\n### 🧩 Role in the Story\n\nMing appears in \"The Day of Black Sun, Part 1: The Invasion\" as Iroh's primary caretaker in prison. She develops a quiet friendship with Iroh, showing him small acts of kindness. On the Day of Black Sun, Iroh warns her to take the day off, which she understands as a sign to avoid the coming chaos, thus sparing her from the events of his escape.\n\n### 🤝 Relationships\n\n- Iroh: She is sympathetic to Iroh, sneaking him tea and food, and is trusted enough to receive his warning.\n- Fire Nation: Loyal to her nation but guided by her own sense of compassion.\n- Warden Poon: Disapproves of his harsh treatment of prisoners.\n\n### 🌟 Notable Traits\n\n- Kind-hearted and empathetic\n- Discreet and supportive\n- Appreciates rare teas\n- Courageous in her quiet way\n\n### 💬 Quotes\n\n> \"I snuck in some white jade tea. I know you like rare teas.\"\n> — Ming\n\n### ✨ Narrative Highlights\n\n- Showed compassion to Iroh during his imprisonment.\n- Snuck in white jade tea and extra food for Iroh.\n- Heeded Iroh's warning and avoided the Day of Black Sun chaos.",
     "metadata": {
       "badge": "Kindly Jailer",
       "shortdescription": "Ming is a compassionate, kind-hearted, and empathetic female nonbender who served as a prison guard in the Fire Nation, remembered for her kindness to Uncle Iroh during his imprisonment.",
       "slug": "ming",
       "shortDescription": "Ming is a compassionate, kind-hearted, and empathetic female nonbender who served as a prison guard in the Fire Nation, remembered for her kindness to Uncle Iroh during his imprisonment.",
       "fullName": "Ming",
       "aliases": [],
       "pronouns": "she/her",
       "age": null,
       "hairColor": "Brown",
       "eyeColor": null,
       "skinColor": null,
       "loveInterest": null,
       "abilities": {
         "bending": [],
         "weapons": [],
         "fightingStyles": [],
         "notableFeats": [
           "Showed compassion to Iroh during his imprisonment.",
           "Snuck in white jade tea and extra food for Iroh.",
           "Heeded Iroh's warning and avoided the Day of Black Sun chaos."
         ]
       },
       "affiliations": {
         "primary": "Fire Nation Military",
@@ -11581,51 +11583,51 @@
       "a",
       "l",
       "e",
       "u",
       "r",
       "n",
       "i",
       "p",
       "t",
       "f",
       "d",
       "o",
       "y",
       "s",
       "v",
       "c",
       "male"
     ],
     "nation": "Air Nomads",
     "role": "Animal Companion",
     "gender": "male",
     "species": "Winged Lemur",
     "nationality": "Southern Air Temple",
     "ethnicity": "Air Nomad (species)",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nDiscovered by Aang at the abandoned Southern Air Temple, Momo is believed to be one of the last of the winged lemurs. He quickly joins Team Avatar, providing comic relief, unexpected assistance, and a living connection to Aang's lost home. His strong bond with both Aang and Appa makes him an integral part of their found family.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Discovered by Aang at the Southern Air Temple and named after a peach.\r\n- Befriended a pack of pygmy pumas in Ba Sing Se to escape capture.\r\n- Frequently helped the team in small but crucial ways with his agility and small size.\r\n- Engaged in a \"samurai duel\" with Appa during one of Aang's sleep-deprived hallucinations.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA loyal animal companion who serves as a source of levity, a resourceful scout, and a constant reminder of the Air Nomad culture that was lost.\r\n\r\n### 🤝 Relationships\r\n\r\n- Aang (Owner, Best Friend)\r\n- Appa (Friend, \"Big Brother,\" Rival for food)\r\n- Sokka (Frequent target of food theft)\r\n- Team Avatar (His Found Family)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Curious & Mischievous\r\n- Intelligent & Resourceful\r\n- Loyal & Playful\r\n- Constantly hungry\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- (Communicates through a variety of expressive chitters, squeaks, and screeches)",
+    "expandedView": "### 📖 Overview\n\nDiscovered by Aang at the abandoned Southern Air Temple, Momo is believed to be one of the last of the winged lemurs. He quickly joins Team Avatar, providing comic relief, unexpected assistance, and a living connection to Aang's lost home. His strong bond with both Aang and Appa makes him an integral part of their found family.\n\n### ✨ Narrative Highlights\n\n- Discovered by Aang at the Southern Air Temple and named after a peach.\n- Befriended a pack of pygmy pumas in Ba Sing Se to escape capture.\n- Frequently helped the team in small but crucial ways with his agility and small size.\n- Engaged in a \"samurai duel\" with Appa during one of Aang's sleep-deprived hallucinations.\n\n### 🎭 Role in the Story\n\nA loyal animal companion who serves as a source of levity, a resourceful scout, and a constant reminder of the Air Nomad culture that was lost.\n\n### 🤝 Relationships\n\n- Aang (Owner, Best Friend)\n- Appa (Friend, \"Big Brother,\" Rival for food)\n- Sokka (Frequent target of food theft)\n- Team Avatar (His Found Family)\n\n### 🧬 Notable Traits\n\n- Curious & Mischievous\n- Intelligent & Resourceful\n- Loyal & Playful\n- Constantly hungry\n\n### 🗣️ Notable Quotes\n\n- (Communicates through a variety of expressive chitters, squeaks, and screeches)",
     "metadata": {
       "badge": "Animal Companion",
       "shortdescription": "A curious, intelligent, and loyal male winged lemur from the Southern Air Temple, Momo is one of the last of his kind and a cherished member of Team Avatar, providing comic relief and a living link to Aang's lost home.",
       "fullName": "Momo",
       "aliases": [
         "Twinklewings"
       ],
       "ageChronological": 100,
       "ageBiological": 1,
       "ageRange": "adult",
       "birthDate": "Unknown (before 12 BG)",
       "deathDate": "Unknown (after 124 AG)",
       "nativeLocation": "Southern Air Temple",
       "currentLocation": "Deceased",
       "socioeconomicStanding": "monastic",
       "languagesSpoken": [
         "Winged Lemur Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "flight (gliding)",
         "acrobatics",
@@ -11731,51 +11733,51 @@
       "wise",
       "griefstricken",
       "monk",
       "council",
       "elder",
       "mentor_to_two_avatars",
       "last_stand_at_southern_air_temple",
       "air_nomads",
       "southern_air_temple",
       "council_of_elders",
       "fruit_pie_attacks",
       "baked_for_the_temple",
       "male"
     ],
     "nation": "Air Nomads",
     "role": "High Monk, Airbending Master, Council Elder",
     "gender": "male",
     "species": "human",
     "nationality": "Air Nomads",
     "ethnicity": "Air Nomad",
     "titles": [
       "Monk",
       "Master",
       "Council Elder"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nMonk Gyatso was a master airbender, high monk, and council elder of the Southern Air Temple. A close friend of Avatar Roku and later the mentor and father figure to Avatar Aang, Gyatso was known for his deep compassion, sense of humor, and wisdom. He taught Aang not only airbending but also the importance of joy, kindness, and balance. Gyatso was slain during the Fire Nation's genocide of the Air Nomads, but not before defeating many comet-enhanced firebenders in a heroic last stand.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Childhood friend and companion of Avatar Roku; helped shape Roku's diplomatic approach.\r\n- Became a council elder and high monk at the Southern Air Temple.\r\n- Served as Aang's airbending master, mentor, and father figure.\r\n- Advocated for Aang's happiness and resisted the council's decision to separate them.\r\n- Made a heroic last stand against the Fire Nation, defeating many soldiers before his death.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA wise mentor, comic relief, and tragic figure whose teachings and loss deeply shaped Aang's journey and the fate of the Air Nomads.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Aang** – Student, ward, and surrogate son.\r\n- **Roku** – Close friend and companion.\r\n- **Yama** – Older sister (deceased).\r\n- **Lola** – Sky bison companion.\r\n- **Pathik** – Friend.\r\n- **Southern Air Temple Council** – Colleagues.\r\n- **Fire Nation, Sozin** – Enemies.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Deeply compassionate and empathetic\r\n- Playful and humorous\r\n- Wise and diplomatic\r\n- Fiercely protective of loved ones\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"We can't concern ourselves with what was. We must act on what is.\"\r\n- \"There are things in this world that can break us, but I've learned there's always a way to heal.\"\r\n- \"Let us have some pie!\"",
+    "expandedView": "### 📖 Overview\n\nMonk Gyatso was a master airbender, high monk, and council elder of the Southern Air Temple. A close friend of Avatar Roku and later the mentor and father figure to Avatar Aang, Gyatso was known for his deep compassion, sense of humor, and wisdom. He taught Aang not only airbending but also the importance of joy, kindness, and balance. Gyatso was slain during the Fire Nation's genocide of the Air Nomads, but not before defeating many comet-enhanced firebenders in a heroic last stand.\n\n### ✨ Narrative Highlights\n\n- Childhood friend and companion of Avatar Roku; helped shape Roku's diplomatic approach.\n- Became a council elder and high monk at the Southern Air Temple.\n- Served as Aang's airbending master, mentor, and father figure.\n- Advocated for Aang's happiness and resisted the council's decision to separate them.\n- Made a heroic last stand against the Fire Nation, defeating many soldiers before his death.\n\n### 🎭 Role in the Story\n\nA wise mentor, comic relief, and tragic figure whose teachings and loss deeply shaped Aang's journey and the fate of the Air Nomads.\n\n### 🤝 Relationships\n\n- **Aang** – Student, ward, and surrogate son.\n- **Roku** – Close friend and companion.\n- **Yama** – Older sister (deceased).\n- **Lola** – Sky bison companion.\n- **Pathik** – Friend.\n- **Southern Air Temple Council** – Colleagues.\n- **Fire Nation, Sozin** – Enemies.\n\n### 🌟 Notable Traits\n\n- Deeply compassionate and empathetic\n- Playful and humorous\n- Wise and diplomatic\n- Fiercely protective of loved ones\n\n### 💬 Notable Quotes\n\n- \"We can't concern ourselves with what was. We must act on what is.\"\n- \"There are things in this world that can break us, but I've learned there's always a way to heal.\"\n- \"Let us have some pie!\"",
     "metadata": {
       "shortdescription": "A wise, compassionate, and playful airbending master, Gyatso was Aang's mentor, father figure, and a leading elder of the Southern Air Temple, renowned for his kindness, humor, and powerful airbending.",
       "fullName": "Gyatso",
       "aliases": [],
       "ageChronological": 78,
       "ageBiological": 78,
       "ageRange": "elder",
       "birthDate": "c. 78 BG",
       "deathDate": "0 AG",
       "nativeLocation": "Southern Air Temple",
       "currentLocation": "Deceased",
       "socioeconomicStanding": "monastic",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "air",
       "bendingProficiency": "legendary",
       "advancedBending": [],
       "nonBendingSkills": [
         "cooking",
         "diplomacy",
         "teaching",
         "pranks"
       ],
@@ -12402,51 +12404,51 @@
       "usurper",
       "war_criminal",
       "usurped_the_throne",
       "banished_zuko",
       "defeated_by_aang",
       "lost_his_bending",
       "fire_nation",
       "fire_nation_royal_family",
       "hundred_year_war",
       "sozins_comet",
       "voiced_by_mark_hamill",
       "never_shown_firebending_after_defeat",
       "male"
     ],
     "nation": "Fire Nation",
     "role": "Fire Lord",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Fire Lord",
       "Phoenix King",
       "Prince"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nAs Fire Lord, Ozai embodies the peak of Fire Nation ambition and cruelty. Usurping the throne from his brother Iroh, he rules with an iron fist, seeking to conquer the world and declare himself Phoenix King. His reign is marked by ruthless tactics, the abuse of his own family, and the near-destruction of the Earth Kingdom during Sozin's Comet. Ultimately, he is defeated by Avatar Aang, who removes his bending and ends his tyranny.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Usurped the throne from his brother Iroh after Azulon's death.\r\n- Permanently scarred and banished his son Zuko for speaking out of turn.\r\n- Planned to use Sozin's Comet to burn down the Earth Kingdom and rule as Phoenix King.\r\n- Defeated by Avatar Aang, who took away his firebending.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe main antagonist and final boss of the series, representing tyranny, abuse, and unbalanced ambition.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Zuko** – Son, object of abuse and scorn.\r\n- **Azula** – Daughter, favored child and weapon.\r\n- **Iroh** – Brother, rival and original heir.\r\n- **Ursa** – Wife, banished after conspiring to save Zuko.\r\n- **Azulon** – Father, murdered to secure the throne.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Megalomaniacal and power-hungry\r\n- Cruel, sadistic, and domineering\r\n- Charismatic and cunning\r\n- Lacks empathy\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"You will learn respect, and suffering will be your teacher.\"\r\n- \"There is no right or wrong apart from what you decide. What you choose, by definition, is right.\"\r\n- \"Prepare to join them. Prepare to die!\"",
+    "expandedView": "### 📖 Overview\n\nAs Fire Lord, Ozai embodies the peak of Fire Nation ambition and cruelty. Usurping the throne from his brother Iroh, he rules with an iron fist, seeking to conquer the world and declare himself Phoenix King. His reign is marked by ruthless tactics, the abuse of his own family, and the near-destruction of the Earth Kingdom during Sozin's Comet. Ultimately, he is defeated by Avatar Aang, who removes his bending and ends his tyranny.\n\n### ✨ Narrative Highlights\n\n- Usurped the throne from his brother Iroh after Azulon's death.\n- Permanently scarred and banished his son Zuko for speaking out of turn.\n- Planned to use Sozin's Comet to burn down the Earth Kingdom and rule as Phoenix King.\n- Defeated by Avatar Aang, who took away his firebending.\n\n### 🎭 Role in the Story\n\nThe main antagonist and final boss of the series, representing tyranny, abuse, and unbalanced ambition.\n\n### 🤝 Relationships\n\n- **Zuko** – Son, object of abuse and scorn.\n- **Azula** – Daughter, favored child and weapon.\n- **Iroh** – Brother, rival and original heir.\n- **Ursa** – Wife, banished after conspiring to save Zuko.\n- **Azulon** – Father, murdered to secure the throne.\n\n### 🌟 Notable Traits\n\n- Megalomaniacal and power-hungry\n- Cruel, sadistic, and domineering\n- Charismatic and cunning\n- Lacks empathy\n\n### 💬 Notable Quotes\n\n- \"You will learn respect, and suffering will be your teacher.\"\n- \"There is no right or wrong apart from what you decide. What you choose, by definition, is right.\"\n- \"Prepare to join them. Prepare to die!\"",
     "metadata": {
       "shortdescription": "The tyrannical Fire Lord and ultimate antagonist of the Hundred Year War, Ozai is a legendary firebender whose ambition, cruelty, and power threaten the balance of the world.",
       "fullName": "Ozai",
       "aliases": [],
       "ageChronological": 45,
       "ageBiological": 45,
       "ageRange": "adult",
       "birthDate": "c. 55 AG",
       "deathDate": null,
       "nativeLocation": "Fire Nation Capital",
       "currentLocation": "Capital City Prison",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "legendary",
       "advancedBending": [
         "lightning generation"
       ],
       "nonBendingSkills": [
         "political manipulation",
         "intimidation",
         "unarmed combat"
@@ -12775,51 +12777,51 @@
       "traditional",
       "caring",
       "tribal_leader",
       "siege_of_the_north",
       "liberated_ba_sing_se",
       "reunited_with_kanna",
       "northern_water_tribe",
       "southern_water_tribe",
       "order_of_the_white_lotus",
       "agna_qela",
       "sexist_formerly",
       "shadowed_waterbender_in_opening",
       "carved_betrothal_necklace",
       "grampakku",
       "male"
     ],
     "nation": "Northern Water Tribe",
     "role": "NWT Master",
     "gender": "male",
     "species": "human",
     "nationality": "Northern Water Tribe",
     "ethnicity": "Water Tribe",
     "titles": [
       "Master"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nAs the premier waterbending master of the Northern Water Tribe, Pakku is a formidable and disciplined teacher, deeply rooted in his tribe's patriarchal traditions. His refusal to teach female students brings him into direct conflict with Katara. Upon discovering she is the granddaughter of his long-lost love, he re-evaluates his rigid beliefs, accepts Katara as his student, and ultimately becomes a key member of the Order of the White Lotus, fighting to restore world balance.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Initially refused to teach Katara due to sexist tribal laws.\r\n- Dueled Katara and was moved by the sight of her grandmother's betrothal necklace.\r\n- Fought to defend the Northern Water Tribe during the Fire Nation siege.\r\n- As a member of the White Lotus, helped liberate Ba Sing Se.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA master of the old guard whose personal history forces him to confront his prejudices and embrace a changing world.\r\n\r\n### 🤝 Relationships\r\n\r\n- Kanna (Wife, former Fiancée)\r\n- Katara (Student, Step-Granddaughter)\r\n- Sokka (Step-Grandson)\r\n- Aang (Student)\r\n- Iroh & The Order of the White Lotus (Fellow Members)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Traditionalist & Strict\r\n- Sarcastic & Acerbic\r\n- Proud & Disciplined\r\n- Caring (beneath his gruff exterior)\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"Go back to the healing huts with the other women.\"\r\n- \"It is respectful to bow to an old master, but how about a hug for your new grandfather?\"\r\n- \"I'm not going to say 'no' to my new grandson-in-law, am I?\"",
+    "expandedView": "### 📖 Overview\n\nAs the premier waterbending master of the Northern Water Tribe, Pakku is a formidable and disciplined teacher, deeply rooted in his tribe's patriarchal traditions. His refusal to teach female students brings him into direct conflict with Katara. Upon discovering she is the granddaughter of his long-lost love, he re-evaluates his rigid beliefs, accepts Katara as his student, and ultimately becomes a key member of the Order of the White Lotus, fighting to restore world balance.\n\n### ✨ Narrative Highlights\n\n- Initially refused to teach Katara due to sexist tribal laws.\n- Dueled Katara and was moved by the sight of her grandmother's betrothal necklace.\n- Fought to defend the Northern Water Tribe during the Fire Nation siege.\n- As a member of the White Lotus, helped liberate Ba Sing Se.\n\n### 🎭 Role in the Story\n\nA master of the old guard whose personal history forces him to confront his prejudices and embrace a changing world.\n\n### 🤝 Relationships\n\n- Kanna (Wife, former Fiancée)\n- Katara (Student, Step-Granddaughter)\n- Sokka (Step-Grandson)\n- Aang (Student)\n- Iroh & The Order of the White Lotus (Fellow Members)\n\n### 🧬 Notable Traits\n\n- Traditionalist & Strict\n- Sarcastic & Acerbic\n- Proud & Disciplined\n- Caring (beneath his gruff exterior)\n\n### 🗣️ Notable Quotes\n\n- \"Go back to the healing huts with the other women.\"\n- \"It is respectful to bow to an old master, but how about a hug for your new grandfather?\"\n- \"I'm not going to say 'no' to my new grandson-in-law, am I?\"",
     "metadata": {
       "badge": "Waterbending Master",
       "shortdescription": "A powerful, traditionalist, and disciplined elder male waterbending master from the Northern Water Tribe, Pakku is a strict teacher who becomes a crucial mentor to Aang and Katara and a key member of the Order of the White Lotus.",
       "slug": "pakku",
       "fullName": "Pakku",
       "aliases": [],
       "ageChronological": 70,
       "ageBiological": 70,
       "ageRange": "elder",
       "birthDate": "c. 30 AG",
       "deathDate": null,
       "nativeLocation": "Agna Qel'a",
       "currentLocation": "Wolf Cove, Southern Water Tribe",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "water",
       "bendingProficiency": "master",
       "advancedBending": [],
       "nonBendingSkills": [
         "teaching",
         "unarmed combat"
       ],
@@ -13104,51 +13106,51 @@
       "nonbender",
       "elder",
       "book_two",
       "eastern_air_temple",
       "eccentric_sage",
       "mentor_to_aang",
       "friend_of_gyatso",
       "helper_of_appa",
       "wise",
       "compassionate",
       "humorous",
       "spirit_world",
       "spiritual_guidance",
       "male"
     ],
     "image": "pathik.jpg",
     "nation": "Air Nomads",
     "role": "Spiritual Mentor, Guru, Mentor, Spiritual Guide, Elder, Nonbender",
     "gender": "male",
     "species": "human",
     "nationality": "Air Nomads",
     "ethnicity": "Air Nomads",
     "titles": [
       "Guru"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nGuru Pathik was a supercentenarian spiritual master who resided at the Eastern Air Temple. A personal friend of Monk Gyatso and spiritual brother to the Air Nomads, Pathik possessed deep knowledge of the Spirit World, chakras, and the Avatar State. He guided Aang through the process of opening his chakras, helping him come closer to mastering the Avatar State. Pathik was known for his wisdom, compassion, and eccentric sense of humor, and he aided both people and animals in finding peace and balance.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Guided Aang through the process of opening his chakras to unlock the Avatar State.\r\n- Befriended and aided Appa during his journey to reunite with Aang.\r\n- Was a spiritual brother to the Air Nomads and a personal friend of Monk Gyatso.\r\n- Lived to at least 150 years old, making him one of the oldest known humans in the series.\r\n- Helped many people and animals achieve spiritual clarity and peace.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA wise and eccentric mentor, Pathik’s teachings on chakras and spiritual balance are pivotal to Aang’s journey. His presence bridges the gap between the lost Air Nomad culture and the new world.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Aang** – Student; Pathik is Aang’s spiritual mentor and guide.\r\n- **Appa** – Helped Appa find peace and reunite with Aang.\r\n- **Monk Gyatso** – Personal friend and spiritual brother.\r\n- **Air Nomads** – Spiritual kin.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Spiritually enlightened and wise\r\n- Compassionate and patient\r\n- Eccentric sense of humor\r\n- Master of meditation and chi sensing\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"I was a spiritual brother of your people and a personal friend of Monk Gyatso.\"",
+    "expandedView": "### 📖 Overview\n\nGuru Pathik was a supercentenarian spiritual master who resided at the Eastern Air Temple. A personal friend of Monk Gyatso and spiritual brother to the Air Nomads, Pathik possessed deep knowledge of the Spirit World, chakras, and the Avatar State. He guided Aang through the process of opening his chakras, helping him come closer to mastering the Avatar State. Pathik was known for his wisdom, compassion, and eccentric sense of humor, and he aided both people and animals in finding peace and balance.\n\n### ✨ Narrative Highlights\n\n- Guided Aang through the process of opening his chakras to unlock the Avatar State.\n- Befriended and aided Appa during his journey to reunite with Aang.\n- Was a spiritual brother to the Air Nomads and a personal friend of Monk Gyatso.\n- Lived to at least 150 years old, making him one of the oldest known humans in the series.\n- Helped many people and animals achieve spiritual clarity and peace.\n\n### 🎭 Role in the Story\n\nA wise and eccentric mentor, Pathik’s teachings on chakras and spiritual balance are pivotal to Aang’s journey. His presence bridges the gap between the lost Air Nomad culture and the new world.\n\n### 🤝 Relationships\n\n- **Aang** – Student; Pathik is Aang’s spiritual mentor and guide.\n- **Appa** – Helped Appa find peace and reunite with Aang.\n- **Monk Gyatso** – Personal friend and spiritual brother.\n- **Air Nomads** – Spiritual kin.\n\n### 🌟 Notable Traits\n\n- Spiritually enlightened and wise\n- Compassionate and patient\n- Eccentric sense of humor\n- Master of meditation and chi sensing\n\n### 💬 Notable Quotes\n\n- \"I was a spiritual brother of your people and a personal friend of Monk Gyatso.\"",
     "metadata": {
       "badge": "Spiritual Mentor",
       "shortdescription": "Enlightened, eccentric, and wise, Guru Pathik is a supercentenarian male nonbender, spiritual guide, and mentor to Aang, known for his deep connection to the Air Nomads, mastery of meditation and chakras, and friendship with Monk Gyatso.",
       "slug": "pathik",
       "fullName": "Guru Pathik",
       "aliases": [],
       "age": 150,
       "ageRange": "elder",
       "birthDate": "50 BG",
       "deathDate": null,
       "nativeLocation": null,
       "currentLocation": "Eastern Air Temple",
       "socioeconomicStanding": "nomad",
       "languagesSpoken": [
         "Standard Language"
       ],
       "tagCategories": {
         "narrativeTags": [
           "mentor",
           "spiritual guide",
           "eccentric sage"
         ],
         "relationshipTags": [
           "mentor to Aang",
           "friend of Gyatso",
@@ -13357,51 +13359,51 @@
       "patient",
       "calm",
       "humble",
       "creative",
       "deserter",
       "liberated_ba_sing_se",
       "forged_space_sword",
       "fire_nation",
       "order_of_the_white_lotus",
       "shu_jing",
       "nonbender_master",
       "voiced_by_robert_patrick",
       "calligrapher",
       "knew_sokkas_identity",
       "male"
     ],
     "nation": "Fire Nation",
     "role": "Swordmaster",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Master"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nOnce a celebrated and undefeated general in the Fire Nation army, Piandao grew weary of war and deserted to pursue a life of art and enlightenment. Living in a secluded castle, he is revered as the greatest swordmaster in the nation's history. He believes knowledge of the arts belongs to everyone and takes on the eager but unworthy Sokka as his student, guiding him to discover his own unique strengths.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Deserted the Fire Nation army and single-handedly defeated one hundred soldiers sent to arrest him.\r\n- Took Sokka as his student, teaching him swordsmanship and the importance of creativity.\r\n- Forged Sokka's unique \"space sword\" from a fallen meteorite.\r\n- As a member of the White Lotus, helped liberate Ba Sing Se from Fire Nation control.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA wise master who provides Sokka with the skills and confidence he needs to become a true warrior, reinforcing the theme that worth is not defined by one's nation or bending ability.\r\n\r\n### 🤝 Relationships\r\n\r\n- Sokka (Student)\r\n- Zuko (Former Student)\r\n- Iroh & The Order of the White Lotus (Fellow Members)\r\n- Fat (Butler)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Wise & Enlightened\r\n- Patient & Humble\r\n- Artistic & Creative\r\n- Unconventional\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"The way of the sword doesn't belong to any one nation. Knowledge of the arts belongs to us all.\"\r\n- \"The most important lesson is creativity.\"\r\n- \"It's not the sword, it's the swordsman.\"",
+    "expandedView": "### 📖 Overview\n\nOnce a celebrated and undefeated general in the Fire Nation army, Piandao grew weary of war and deserted to pursue a life of art and enlightenment. Living in a secluded castle, he is revered as the greatest swordmaster in the nation's history. He believes knowledge of the arts belongs to everyone and takes on the eager but unworthy Sokka as his student, guiding him to discover his own unique strengths.\n\n### ✨ Narrative Highlights\n\n- Deserted the Fire Nation army and single-handedly defeated one hundred soldiers sent to arrest him.\n- Took Sokka as his student, teaching him swordsmanship and the importance of creativity.\n- Forged Sokka's unique \"space sword\" from a fallen meteorite.\n- As a member of the White Lotus, helped liberate Ba Sing Se from Fire Nation control.\n\n### 🎭 Role in the Story\n\nA wise master who provides Sokka with the skills and confidence he needs to become a true warrior, reinforcing the theme that worth is not defined by one's nation or bending ability.\n\n### 🤝 Relationships\n\n- Sokka (Student)\n- Zuko (Former Student)\n- Iroh & The Order of the White Lotus (Fellow Members)\n- Fat (Butler)\n\n### 🧬 Notable Traits\n\n- Wise & Enlightened\n- Patient & Humble\n- Artistic & Creative\n- Unconventional\n\n### 🗣️ Notable Quotes\n\n- \"The way of the sword doesn't belong to any one nation. Knowledge of the arts belongs to us all.\"\n- \"The most important lesson is creativity.\"\n- \"It's not the sword, it's the swordsman.\"",
     "metadata": {
       "badge": "Swordmaster",
       "shortdescription": "A legendary, wise, and unconventional elder male swordmaster and bladesmith from the Fire Nation, Piandao deserted the army to pursue enlightenment and art, becoming Sokka's mentor and a key member of the Order of the White Lotus.",
       "slug": "piandao",
       "fullName": "Piandao",
       "aliases": [],
       "ageChronological": 60,
       "ageBiological": 60,
       "ageRange": "elder",
       "birthDate": "c. 40 AG",
       "deathDate": null,
       "nativeLocation": "Fire Nation",
       "currentLocation": "Shu Jing, Fire Nation",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "swordsmanship (jian)",
         "swordsmithing",
         "calligraphy",
@@ -13976,51 +13978,51 @@
     "id": "poppy-beifong",
     "name": "Poppy Beifong",
     "summary": "",
     "type": "character",
     "slug": "poppy-beifong",
     "tags": [
       "earth_kingdom",
       "gaoling",
       "mother",
       "matriarch",
       "nobility",
       "book_two",
       "the_blind_bandit",
       "female"
     ],
     "image": "poppy.jpg",
     "nation": "Earth Kingdom",
     "role": "Matriarch, Mother, Nobility",
     "gender": "Female",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "Lady Beifong"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nPoppy Beifong is the mother of Toph and wife of Lao Beifong, known for her wealth and status in Gaoling. Deeply caring but extremely protective, Poppy believed her daughter’s blindness made her weak, and she supported her husband’s efforts to shelter Toph from the world. After Toph ran away to join Team Avatar, Poppy’s relationship with Lao became strained, but she eventually reconciled with her family. Poppy is remembered for her warmth, politeness, and unwavering concern for her daughter’s safety.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Raised Toph in a sheltered environment, believing it was for her safety.\r\n- Supported Lao’s decisions but blamed him for Toph’s departure.\r\n- Commissioned Xin Fu and Yu to bring Toph home after her disappearance.\r\n- Reconciled with Lao after he accepted Toph’s true abilities.\r\n- Sheltered her granddaughter Suyin years later.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor but emotionally resonant character, Poppy’s arc explores the challenges of parental love, overprotection, and learning to let go. Her journey mirrors the struggles of many parents in a changing world.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Lao Beifong** – Husband; their relationship is tested by Toph’s departure.\r\n- **Toph Beifong** – Daughter; Poppy is loving but overprotective.\r\n- **Yu** – Toph’s earthbending instructor, trusted by Poppy.\r\n- **Beifong family** – Extended kinship and support.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Cheerful and polite\r\n- Deeply loving and protective\r\n- Submissive to her husband’s decisions (initially)\r\n- Grows more assertive after Toph’s departure\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Poor Toph. She must be so scared.\"",
+    "expandedView": "### 📖 Overview\n\nPoppy Beifong is the mother of Toph and wife of Lao Beifong, known for her wealth and status in Gaoling. Deeply caring but extremely protective, Poppy believed her daughter’s blindness made her weak, and she supported her husband’s efforts to shelter Toph from the world. After Toph ran away to join Team Avatar, Poppy’s relationship with Lao became strained, but she eventually reconciled with her family. Poppy is remembered for her warmth, politeness, and unwavering concern for her daughter’s safety.\n\n### ✨ Narrative Highlights\n\n- Raised Toph in a sheltered environment, believing it was for her safety.\n- Supported Lao’s decisions but blamed him for Toph’s departure.\n- Commissioned Xin Fu and Yu to bring Toph home after her disappearance.\n- Reconciled with Lao after he accepted Toph’s true abilities.\n- Sheltered her granddaughter Suyin years later.\n\n### 🎭 Role in the Story\n\nA minor but emotionally resonant character, Poppy’s arc explores the challenges of parental love, overprotection, and learning to let go. Her journey mirrors the struggles of many parents in a changing world.\n\n### 🤝 Relationships\n\n- **Lao Beifong** – Husband; their relationship is tested by Toph’s departure.\n- **Toph Beifong** – Daughter; Poppy is loving but overprotective.\n- **Yu** – Toph’s earthbending instructor, trusted by Poppy.\n- **Beifong family** – Extended kinship and support.\n\n### 🌟 Notable Traits\n\n- Cheerful and polite\n- Deeply loving and protective\n- Submissive to her husband’s decisions (initially)\n- Grows more assertive after Toph’s departure\n\n### 💬 Notable Quotes\n\n- \"Poor Toph. She must be so scared.\"",
     "metadata": {
       "badge": "Protective Matriarch",
       "shortdescription": "Cheerful, polite, and deeply loving, Poppy Beifong is Toph’s overprotective mother and a noble matriarch of Gaoling. Her journey explores the challenges of parental love and learning to let go.",
       "slug": "poppy-beifong",
       "fullName": "Poppy Beifong",
       "aliases": [],
       "age": 38,
       "ageRange": "adult",
       "nativeLocation": "Gaoling",
       "socioeconomicStanding": "nobility",
       "isBender": false,
       "nonBendingSkills": [
         "household management",
         "emotional support"
       ],
       "notableFeats": [
         "Raised Toph in a sheltered environment.",
         "Supported her family through crisis and reconciliation.",
         "Sheltered her granddaughter Suyin."
       ],
       "currentAffiliations": [
         "Beifong family"
       ],
       "moralAlignment": "Lawful Good",
       "narrativeFunction": "supporting",
@@ -14092,51 +14094,51 @@
     "summary": "Roku is a wise, compassionate, and legendary male Fire Nation Avatar, spirit advisor, and mentor to Aang. His friendship and rivalry with Sozin shaped the fate of the world.",
     "type": "character",
     "slug": "roku",
     "tags": [
       "fire_nation",
       "avatar",
       "mentor",
       "spirit_advisor",
       "bender",
       "past_avatar",
       "legendary",
       "book_one",
       "book_two",
       "book_three",
       "winter_solstice",
       "male"
     ],
     "image": null,
     "nation": "Fire Nation",
     "role": "Past Avatar, Mentor, Spirit Advisor, Legendary Bender",
     "gender": "Male",
     "ethnicity": "Fire Nation",
     "titles": [
       "Avatar"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nRoku was the Fire Nation-born Avatar who preceded Aang. He was a wise and compassionate leader, striving to maintain balance in the world. Roku’s friendship with Fire Lord Sozin ultimately led to tragedy, as he failed to stop Sozin’s ambitions in time, indirectly allowing the Hundred Year War to begin. Roku’s spirit later served as a mentor to Aang, offering guidance and wisdom from the Spirit World.\r\n\r\n### 🏷️ Key Traits\r\n- Wise\r\n- Dutiful\r\n- Compassionate\r\n- Haunted by regret\r\n\r\n### 🏆 Notable Achievements\r\n- Mastered all four elements\r\n- Maintained peace during his lifetime\r\n- Attempted to stop Sozin’s plans for conquest\r\n\r\n### 💬 Notable Quotes\r\n- \"If I had been more decisive and acted sooner, I could have stopped Sozin and stopped the War before it started.\"\r\n- \"You must be decisive.\"\r\n- \"Sometimes, the best way to solve your own problems is to help someone else.\"\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Grew up as the best friend of Prince Sozin, who would later become Fire Lord.\r\n- Confronted and defeated Sozin, sparing his life out of friendship.\r\n- Died fighting a volcanic eruption after being betrayed by Sozin.\r\n- Served as Aang's primary spiritual guide from beyond the grave.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA guiding spirit and tragic figure whose past mistakes serve as a crucial lesson for Aang on the importance of decisiveness.\r\n\r\n### 🤝 Relationships\r\n\r\n- Sozin (Best Friend turned Arch-Nemesis)\r\n- Aang (Successor, Mentee)\r\n- Gyatso (Close Friend, Aang's Guardian)\r\n- Ta Min (Wife)\r\n- Zuko (Great-Grandson)\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Wise & Merciful\r\n- Disciplined & Kind\r\n- Indecisive (at critical moments)\r\n- Regretful\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"If I had been more decisive and acted sooner, I could have stopped Sozin and stopped the War before it started.\"\r\n- \"Being the Avatar is an honor, but it's also a great burden.\"\r\n- \"Some friendships are so strong, they can even transcend lifetimes.\"",
+    "expandedView": "### 📖 Overview\n\nRoku was the Fire Nation-born Avatar who preceded Aang. He was a wise and compassionate leader, striving to maintain balance in the world. Roku’s friendship with Fire Lord Sozin ultimately led to tragedy, as he failed to stop Sozin’s ambitions in time, indirectly allowing the Hundred Year War to begin. Roku’s spirit later served as a mentor to Aang, offering guidance and wisdom from the Spirit World.\n\n### 🏷️ Key Traits\n- Wise\n- Dutiful\n- Compassionate\n- Haunted by regret\n\n### 🏆 Notable Achievements\n- Mastered all four elements\n- Maintained peace during his lifetime\n- Attempted to stop Sozin’s plans for conquest\n\n### 💬 Notable Quotes\n- \"If I had been more decisive and acted sooner, I could have stopped Sozin and stopped the War before it started.\"\n- \"You must be decisive.\"\n- \"Sometimes, the best way to solve your own problems is to help someone else.\"\n\n### ✨ Narrative Highlights\n\n- Grew up as the best friend of Prince Sozin, who would later become Fire Lord.\n- Confronted and defeated Sozin, sparing his life out of friendship.\n- Died fighting a volcanic eruption after being betrayed by Sozin.\n- Served as Aang's primary spiritual guide from beyond the grave.\n\n### 🎭 Role in the Story\n\nA guiding spirit and tragic figure whose past mistakes serve as a crucial lesson for Aang on the importance of decisiveness.\n\n### 🤝 Relationships\n\n- Sozin (Best Friend turned Arch-Nemesis)\n- Aang (Successor, Mentee)\n- Gyatso (Close Friend, Aang's Guardian)\n- Ta Min (Wife)\n- Zuko (Great-Grandson)\n\n### 🌟 Notable Traits\n\n- Wise & Merciful\n- Disciplined & Kind\n- Indecisive (at critical moments)\n- Regretful\n\n### 💬 Notable Quotes\n\n- \"If I had been more decisive and acted sooner, I could have stopped Sozin and stopped the War before it started.\"\n- \"Being the Avatar is an honor, but it's also a great burden.\"\n- \"Some friendships are so strong, they can even transcend lifetimes.\"",
     "metadata": {
       "badge": "Spirit Advisor",
       "shortdescription": "Roku is a wise, compassionate, and legendary male Fire Nation Avatar, spirit advisor, and mentor to Aang. His friendship and rivalry with Sozin shaped the fate of the world.",
       "slug": "roku",
       "shortDescription": "Roku is a wise, compassionate, and legendary male Fire Nation Avatar, spirit advisor, and mentor to Aang. His friendship and rivalry with Sozin shaped the fate of the world.",
       "fullName": "Roku",
       "aliases": [
         "Ro"
       ],
       "pronouns": "he/him",
       "age": 70,
       "ageRange": "elder",
       "hairColor": "White",
       "eyeColor": null,
       "skinColor": null,
       "loveInterest": "Ta Min (wife)",
       "abilities": {
         "bending": [
           "Firebending",
           "Airbending",
           "Waterbending",
           "Earthbending"
         ],
         "weapons": [],
         "fightingStyles": [
@@ -14648,51 +14650,51 @@
       "diplomat",
       "overcame_sexism",
       "became_a_master_swordsman",
       "mastermind_of_invasion",
       "boiling_rock_escapee",
       "southern_water_tribe",
       "team_avatar",
       "kyoshi_warriors_ally",
       "united_republic",
       "meat_and_sarcasm_guy",
       "bad_artist",
       "drank_cactus_juice",
       "wang_fire",
       "male"
     ],
     "nation": "Southern Water Tribe",
     "role": "SWT Warrior",
     "gender": "male",
     "species": "human",
     "nationality": "Southern Water Tribe",
     "ethnicity": "Water Tribe",
     "titles": [
       "Chieftain",
       "Chairman"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nLeft as the oldest male in his village, Sokka was a self-styled warrior desperate to prove himself. After discovering the Avatar, his worldview rapidly expands from cynical and pragmatic to one of a brilliant leader and strategist. Overcoming his insecurities as a non-bender, he becomes the indispensable \"idea guy\" of the group, masterminding the invasion of the Fire Nation and evolving into a master swordsman in his own right.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Formulated the plan for the invasion of the Fire Nation on the Day of Black Sun.\r\n- Trained under Master Piandao to become a master swordsman, forging his own space sword.\r\n- Single-handedly defeated the formidable assassin Combustion Man.\r\n- Led a prison break from the Boiling Rock, rescuing his father and Suki.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe non-bender strategist whose intellect, humor, and courage prove that you don't need powers to change the world.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Katara** – Sister, confidant.\r\n- **Suki** – Girlfriend, combat partner.\r\n- **Aang** – Best friend, \"the muscle\".\r\n- **Toph Beifong** – Friend, \"Captain Boomerang\".\r\n- **Yue** – First love.\r\n- **Hakoda** – Father, role model.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Sarcastic, witty, and inventive.\r\n- Strategic, loyal, and protective.\r\n- Goofy and a lover of meat.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"It's the quenchiest!\"\r\n- \"I'm just a guy with a boomerang. I didn't ask for all this flying and magic.\"\r\n- \"Boomerang! You do always come back!\"",
+    "expandedView": "### 📖 Overview\n\nLeft as the oldest male in his village, Sokka was a self-styled warrior desperate to prove himself. After discovering the Avatar, his worldview rapidly expands from cynical and pragmatic to one of a brilliant leader and strategist. Overcoming his insecurities as a non-bender, he becomes the indispensable \"idea guy\" of the group, masterminding the invasion of the Fire Nation and evolving into a master swordsman in his own right.\n\n### ✨ Narrative Highlights\n\n- Formulated the plan for the invasion of the Fire Nation on the Day of Black Sun.\n- Trained under Master Piandao to become a master swordsman, forging his own space sword.\n- Single-handedly defeated the formidable assassin Combustion Man.\n- Led a prison break from the Boiling Rock, rescuing his father and Suki.\n\n### 🎭 Role in the Story\n\nThe non-bender strategist whose intellect, humor, and courage prove that you don't need powers to change the world.\n\n### 🤝 Relationships\n\n- **Katara** – Sister, confidant.\n- **Suki** – Girlfriend, combat partner.\n- **Aang** – Best friend, \"the muscle\".\n- **Toph Beifong** – Friend, \"Captain Boomerang\".\n- **Yue** – First love.\n- **Hakoda** – Father, role model.\n\n### 🌟 Notable Traits\n\n- Sarcastic, witty, and inventive.\n- Strategic, loyal, and protective.\n- Goofy and a lover of meat.\n\n### 💬 Notable Quotes\n\n- \"It's the quenchiest!\"\n- \"I'm just a guy with a boomerang. I didn't ask for all this flying and magic.\"\n- \"Boomerang! You do always come back!\"",
     "metadata": {
       "shortdescription": "A warrior from the Southern Water Tribe, Sokka is the resident strategist and comic relief of Team Avatar. Though he lacks bending, his ingenuity, leadership, and trusty boomerang prove indispensable in the fight against the Fire Nation.",
       "fullName": "Sokka",
       "aliases": [
         "Wang Fire",
         "Captain Boomerang"
       ],
       "ageChronological": 74,
       "ageBiological": 74,
       "ageRange": "teen",
       "birthDate": "84 AG",
       "deathDate": "Between 158 and 170 AG",
       "nativeLocation": "Wolf Cove",
       "currentLocation": "Deceased",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "swordsmanship",
         "strategy",
@@ -15072,51 +15074,51 @@
       "fire_lord",
       "prince",
       "warmonger",
       "instigator_of_war",
       "started_the_hundred_year_war",
       "wiped_out_the_air_nomads",
       "betrayed_roku",
       "fire_nation",
       "fire_nation_royal_family",
       "sozins_comet",
       "has_a_dragon",
       "lived_to_102",
       "sozins_comet_is_named_for_him",
       "longestreigning_fire_lord",
       "male"
     ],
     "nation": "Fire Nation",
     "role": "Former Fire Lord",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Fire Lord"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nOnce the best friend of Avatar Roku, Prince Sozin's ascension to Fire Lord ignited his ambition to expand his nation's influence across the globe. Believing he was sharing the Fire Nation's greatness, his vision was rejected by Roku. This ideological schism led to a bitter rivalry that culminated in Sozin betraying Roku, leaving him to die in a volcanic eruption. With the Avatar gone, Sozin harnessed the power of a great comet to commit genocide against the Air Nomads and begin the Hundred Year War.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Grew up as the best friend of Roku, before Roku was identified as the Avatar.\r\n- Betrayed Roku by leaving him to die in a volcanic eruption to pursue his conquest.\r\n- Used the power of a comet to wipe out the Air Nomads.\r\n- Instigated the Hundred Year War.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe original antagonist of the Hundred Year War, whose past actions and friendship with Roku define the central conflict of the series.\r\n\r\n### 🤝 Relationships\r\n\r\n- Roku (Best Friend turned Arch-Nemesis)\r\n- Azulon (Son, Successor)\r\n- Taiso (Father)\r\n- Aang (The target of his lifelong hunt)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Ambitious & Visionary\r\n- Imperialistic & Ruthless\r\n- Cunning & Patient\r\n- Conflicted (initially)\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"With Roku gone and the great comet returning, the timing was perfect to change the world.\"\r\n- \"We have a chance to share our greatness with the rest of the world.\"\r\n- \"Without you, all my plans are suddenly possible. I have a vision for the future, Roku.\"",
+    "expandedView": "### 📖 Overview\n\nOnce the best friend of Avatar Roku, Prince Sozin's ascension to Fire Lord ignited his ambition to expand his nation's influence across the globe. Believing he was sharing the Fire Nation's greatness, his vision was rejected by Roku. This ideological schism led to a bitter rivalry that culminated in Sozin betraying Roku, leaving him to die in a volcanic eruption. With the Avatar gone, Sozin harnessed the power of a great comet to commit genocide against the Air Nomads and begin the Hundred Year War.\n\n### ✨ Narrative Highlights\n\n- Grew up as the best friend of Roku, before Roku was identified as the Avatar.\n- Betrayed Roku by leaving him to die in a volcanic eruption to pursue his conquest.\n- Used the power of a comet to wipe out the Air Nomads.\n- Instigated the Hundred Year War.\n\n### 🎭 Role in the Story\n\nThe original antagonist of the Hundred Year War, whose past actions and friendship with Roku define the central conflict of the series.\n\n### 🤝 Relationships\n\n- Roku (Best Friend turned Arch-Nemesis)\n- Azulon (Son, Successor)\n- Taiso (Father)\n- Aang (The target of his lifelong hunt)\n\n### 🧬 Notable Traits\n\n- Ambitious & Visionary\n- Imperialistic & Ruthless\n- Cunning & Patient\n- Conflicted (initially)\n\n### 🗣️ Notable Quotes\n\n- \"With Roku gone and the great comet returning, the timing was perfect to change the world.\"\n- \"We have a chance to share our greatness with the rest of the world.\"\n- \"Without you, all my plans are suddenly possible. I have a vision for the future, Roku.\"",
     "metadata": {
       "shortdescription": "The ambitious and visionary Fire Lord whose desire to spread the Fire Nation's prosperity led him to betray his best friend, Avatar Roku, and plunge the world into the Hundred Year War.",
       "fullName": "Sozin",
       "aliases": [
         "Lee (undercover)"
       ],
       "ageChronological": 102,
       "ageBiological": 102,
       "ageRange": "elder",
       "birthDate": "82 BG",
       "deathDate": "20 AG",
       "nativeLocation": "Fire Nation Capital",
       "currentLocation": "Deceased",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "master",
       "advancedBending": [],
       "nonBendingSkills": [
         "military strategy",
         "political manipulation",
         "long-term planning"
@@ -15375,51 +15377,51 @@
         "the first villain"
       ],
       "isSuggestedInXContext": [],
       "__type": "character",
       "slug": "sozin"
     }
   },
   {
     "id": "suki",
     "name": "Suki",
     "summary": "",
     "type": "character",
     "slug": "suki",
     "tags": [
       "female"
     ],
     "nation": "Earth Kingdom",
     "role": "Kyoshi Leader",
     "gender": "female",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Kyoshi Islander",
     "titles": [
       "Kyoshi Warrior Leader"
     ],
-    "expandedView": "- Name: Suki\r\n- Nation: Earth Kingdom (Kyoshi Island)\r\n- Age: 15 (in Avatar: The Last Airbender)\r\n- Overview: As the leader of a formidable band of female warriors, Suki initially upholds her island's isolationist traditions. Inspired by Team Avatar, she chooses to join the war effort, becoming a valuable ally with her exceptional combat skills and leadership. Her journey takes her from the shores of Kyoshi Island to the cells of the Fire Nation's most feared prison, all while maintaining her courage, loyalty, and unwavering warrior spirit.\r\n\r\n- Narrative Highlights:\r\n  - Defeated and later trained Sokka, challenging his sexism.\r\n  - Fought Princess Azula's team to protect Appa.\r\n  - Survived and escaped the Fire Nation's highest-security prison, the Boiling Rock.\r\n  - Helped Sokka and Toph disable the Fire Nation airship fleet during Sozin's Comet.\r\n\r\n- Role in the Story: A skilled supporting warrior whose growth from isolationist to global peacekeeper demonstrates the expanding scope of the war and the strength of non-benders.\r\n\r\n- Relationships:\r\n  - Sokka (Boyfriend, Combat Partner)\r\n  - Kyoshi Warriors (Her \"Sisters\" and Team)\r\n  - Aang & Team Avatar (Allies & Friends)\r\n  - Ty Lee (Rival turned Ally)\r\n  - Zuko (Ally, former Enemy)\r\n\r\n- Personality Traits:\r\n  - Brave & Assertive\r\n  - Loyal & Compassionate\r\n  - Disciplined & Focused\r\n  - Playful & Humorous\r\n\r\n- Notable Quotes:\r\n  - \"I am a warrior, but I'm a girl too.\"\r\n  - \"I'm the leader of the Kyoshi Warriors. I can handle a few navy guys.\"\r\n  - \"Looks like we're in this together.\"",
+    "expandedView": "- Name: Suki\n- Nation: Earth Kingdom (Kyoshi Island)\n- Age: 15 (in Avatar: The Last Airbender)\n- Overview: As the leader of a formidable band of female warriors, Suki initially upholds her island's isolationist traditions. Inspired by Team Avatar, she chooses to join the war effort, becoming a valuable ally with her exceptional combat skills and leadership. Her journey takes her from the shores of Kyoshi Island to the cells of the Fire Nation's most feared prison, all while maintaining her courage, loyalty, and unwavering warrior spirit.\n\n- Narrative Highlights:\n  - Defeated and later trained Sokka, challenging his sexism.\n  - Fought Princess Azula's team to protect Appa.\n  - Survived and escaped the Fire Nation's highest-security prison, the Boiling Rock.\n  - Helped Sokka and Toph disable the Fire Nation airship fleet during Sozin's Comet.\n\n- Role in the Story: A skilled supporting warrior whose growth from isolationist to global peacekeeper demonstrates the expanding scope of the war and the strength of non-benders.\n\n- Relationships:\n  - Sokka (Boyfriend, Combat Partner)\n  - Kyoshi Warriors (Her \"Sisters\" and Team)\n  - Aang & Team Avatar (Allies & Friends)\n  - Ty Lee (Rival turned Ally)\n  - Zuko (Ally, former Enemy)\n\n- Personality Traits:\n  - Brave & Assertive\n  - Loyal & Compassionate\n  - Disciplined & Focused\n  - Playful & Humorous\n\n- Notable Quotes:\n  - \"I am a warrior, but I'm a girl too.\"\n  - \"I'm the leader of the Kyoshi Warriors. I can handle a few navy guys.\"\n  - \"Looks like we're in this together.\"",
     "metadata": {
       "shortdescription": "The proud and capable leader of the Kyoshi Warriors. Suki is a highly skilled non-bender who overcomes her island's isolationism to fight for the world and becomes a key ally to Team Avatar.",
       "fullName": "Suki",
       "aliases": [],
       "ageChronological": 17,
       "ageBiological": 17,
       "ageRange": "teen",
       "birthDate": "c. 84-85 AG",
       "deathDate": null,
       "nativeLocation": "Suki's village, Kyoshi Island",
       "currentLocation": "Unknown",
       "socioeconomicStanding": "commoner",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "tessenjutsu (war fans)",
         "chi-blocking",
         "acrobatics",
         "leadership",
         "stealth",
@@ -15467,62 +15469,63 @@
       "h",
       "t",
       "r",
       "w",
       "s",
       "u",
       "v",
       "o",
       "c",
       "n",
       "y",
       "comic_relief",
       "minor_antagonist",
       "ally",
       "tournament_fighter",
       "rival_of_the_boulder",
       "ally_of_team_avatar",
       "rival_ally_of_toph",
       "loyal",
       "strong",
       "comic",
       "earth_rumble",
       "earth_kingdom",
       "redemption",
       "gaoling",
-      "male"
+      "male",
+      "earthbender"
     ],
     "nation": "Earth Kingdom",
     "role": "Earth Rumble Heavyweight, Soldier",
     "gender": "male",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "Earth Rumble Heavyweight"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nThe Big Bad Hippo is a professional earthbending fighter and former Earth Kingdom soldier from Gaoling. Famous for his enormous size, strength, and distinctive way of speaking, he was a crowd favorite in the Earth Rumble tournaments. His signature move, \"rocking the boat,\" and his habit of chewing and spitting rocks made him a formidable and entertaining opponent. After his wrestling days, The Hippo joined the invasion of the Fire Nation alongside The Boulder and Team Avatar, proving himself a capable ally in battle. He is remembered for his loyalty, physical prowess, and comic relief.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Competed in Earth Rumble VI, facing The Boulder in a memorable match.\r\n- Helped Xin Fu and other fighters capture Aang and Toph for ransom.\r\n- Defeated by Toph during her escape from captivity.\r\n- Joined the invasion of the Fire Nation, fighting alongside Team Avatar.\r\n- Attended Zuko’s coronation after being freed from Fire Nation prison.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA comic relief and minor antagonist-turned-ally, The Big Bad Hippo’s unique style and personality add color to the earthbending world and highlight the diversity of Team Avatar’s allies.\r\n\r\n### 🤝 Relationships\r\n\r\n- **The Boulder** – Rival and later ally in the Fire Nation invasion.\r\n- **Xin Fu** – Ally in Earth Rumble and kidnapping plot.\r\n- **Earth Rumble fighters** – Colleagues and rivals.\r\n- **Toph Beifong** – Defeated him in combat; later an ally.\r\n- **Team Avatar** – Ally during the invasion.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Enormous physical strength\r\n- Unique third-person speech\r\n- Loyal to friends and allies\r\n- Comic and memorable stage presence\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Hippo happy to see Blind Bandit!\"",
+    "expandedView": "### 📖 Overview\n\nThe Big Bad Hippo is a professional earthbending fighter and former Earth Kingdom soldier from Gaoling. Famous for his enormous size, strength, and distinctive way of speaking, he was a crowd favorite in the Earth Rumble tournaments. His signature move, \"rocking the boat,\" and his habit of chewing and spitting rocks made him a formidable and entertaining opponent. After his wrestling days, The Hippo joined the invasion of the Fire Nation alongside The Boulder and Team Avatar, proving himself a capable ally in battle. He is remembered for his loyalty, physical prowess, and comic relief.\n\n### ✨ Narrative Highlights\n\n- Competed in Earth Rumble VI, facing The Boulder in a memorable match.\n- Helped Xin Fu and other fighters capture Aang and Toph for ransom.\n- Defeated by Toph during her escape from captivity.\n- Joined the invasion of the Fire Nation, fighting alongside Team Avatar.\n- Attended Zuko’s coronation after being freed from Fire Nation prison.\n\n### 🎭 Role in the Story\n\nA comic relief and minor antagonist-turned-ally, The Big Bad Hippo’s unique style and personality add color to the earthbending world and highlight the diversity of Team Avatar’s allies.\n\n### 🤝 Relationships\n\n- **The Boulder** – Rival and later ally in the Fire Nation invasion.\n- **Xin Fu** – Ally in Earth Rumble and kidnapping plot.\n- **Earth Rumble fighters** – Colleagues and rivals.\n- **Toph Beifong** – Defeated him in combat; later an ally.\n- **Team Avatar** – Ally during the invasion.\n\n### 🌟 Notable Traits\n\n- Enormous physical strength\n- Unique third-person speech\n- Loyal to friends and allies\n- Comic and memorable stage presence\n\n### 💬 Notable Quotes\n\n- \"Hippo happy to see Blind Bandit!\"",
     "metadata": {
       "badge": "Earth Rumble Heavyweight",
       "shortdescription": "A massive, strong, and comic male earthbender from Gaoling, The Big Bad Hippo is known for his unique third-person speech, memorable stage presence, and role as both a minor antagonist and ally in the Earth Rumble tournaments and Fire Nation invasion.",
       "slug": "the-big-bad-hippo",
       "fullName": "The Big Bad Hippo",
       "aliases": [],
       "ageChronological": null,
       "ageBiological": null,
       "ageRange": "adult",
       "birthDate": null,
       "deathDate": null,
       "nativeLocation": "Gaoling",
       "currentLocation": "Earth Kingdom",
       "socioeconomicStanding": "fighter",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "earth",
       "bendingProficiency": "strong",
       "advancedBending": [
         "rock chewing",
         "rocking the boat"
       ],
       "nonBendingSkills": [
@@ -15709,51 +15712,51 @@
     }
   },
   {
     "id": "the-gecko",
     "name": "The Gecko",
     "summary": "The Gecko is a nimble, agile, and unconventional male Earth Kingdom earthbender and underground fighter, recognized for his quick movements and unique style in the Earth Rumble tournaments.",
     "type": "character",
     "slug": "the-gecko",
     "tags": [
       "earth_kingdom",
       "earth_rumble",
       "fighter",
       "earthbender",
       "underground",
       "book_two",
       "the_blind_bandit",
       "bender",
       "male"
     ],
     "image": null,
     "nation": "Earth Kingdom",
     "role": "Earth Rumble Fighter, Underground Fighter",
     "gender": "Male",
     "ethnicity": "Earth Kingdom",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nThe Gecko was a contestant in the underground earthbending competition Earth Rumble. He wore a distinct bright-green mask and used unique tactics during battle, such as crawling on all fours and using his earthbending to scale walls. He relied on his quick speed and agility to climb around the ring and stay out of the reach of his opponents.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Competed in Earth Rumble VI against The Boulder.\r\n- Used unique earthbending tactics, including scaling walls and crawling on all fours.\r\n- Assisted Xin Fu and other fighters in capturing Aang and Toph.\r\n- Was quickly defeated by The Boulder and later by Toph Beifong.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor but memorable Earth Rumble fighter, The Gecko is known for his agility and unconventional fighting style, adding color to the underground earthbending scene in Gaoling.\r\n\r\n### 🤝 Relationships\r\n\r\n- Xin Fu (Ally, Promoter)\r\n- Earth Rumble fighters (Allies)\r\n- Toph Beifong (Enemy)\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Nimble and agile\r\n- Quick reflexes\r\n- Unique fighting style\r\n\r\n### 💬 Notable Quotes\r\n\r\n- (No spoken lines)",
+    "expandedView": "### 📖 Overview\n\nThe Gecko was a contestant in the underground earthbending competition Earth Rumble. He wore a distinct bright-green mask and used unique tactics during battle, such as crawling on all fours and using his earthbending to scale walls. He relied on his quick speed and agility to climb around the ring and stay out of the reach of his opponents.\n\n### ✨ Narrative Highlights\n\n- Competed in Earth Rumble VI against The Boulder.\n- Used unique earthbending tactics, including scaling walls and crawling on all fours.\n- Assisted Xin Fu and other fighters in capturing Aang and Toph.\n- Was quickly defeated by The Boulder and later by Toph Beifong.\n\n### 🎭 Role in the Story\n\nA minor but memorable Earth Rumble fighter, The Gecko is known for his agility and unconventional fighting style, adding color to the underground earthbending scene in Gaoling.\n\n### 🤝 Relationships\n\n- Xin Fu (Ally, Promoter)\n- Earth Rumble fighters (Allies)\n- Toph Beifong (Enemy)\n\n### 🌟 Notable Traits\n\n- Nimble and agile\n- Quick reflexes\n- Unique fighting style\n\n### 💬 Notable Quotes\n\n- (No spoken lines)",
     "metadata": {
       "badge": "Earth Rumble Fighter",
       "shortdescription": "The Gecko is a nimble, agile, and unconventional male Earth Kingdom earthbender and underground fighter, recognized for his quick movements and unique style in the Earth Rumble tournaments.",
       "slug": "the-gecko",
       "shortDescription": "The Gecko is a nimble, agile, and unconventional male Earth Kingdom earthbender and underground fighter, recognized for his quick movements and unique style in the Earth Rumble tournaments.",
       "fullName": "The Gecko",
       "aliases": [],
       "pronouns": "he/him",
       "age": 22,
       "ageRange": "young adult",
       "hairColor": null,
       "eyeColor": null,
       "skinColor": null,
       "loveInterest": null,
       "abilities": {
         "bending": [
           "Earthbending"
         ],
         "weapons": [],
         "fightingStyles": [
           "Earthbending",
           "Agility",
           "Wall-crawling"
         ],
         "notableFeats": [
@@ -15868,62 +15871,63 @@
       "i",
       "g",
       "h",
       "t",
       "r",
       "w",
       "s",
       "u",
       "v",
       "o",
       "c",
       "n",
       "y",
       "minor_antagonist",
       "comic_relief",
       "tournament_fighter",
       "ally_of_xin_fu",
       "rival_of_toph",
       "rival_of_the_boulder",
       "resourceful",
       "loyal",
       "predictable",
       "earth_rumble",
       "earth_kingdom",
       "gaoling",
-      "male"
+      "male",
+      "earthbender"
     ],
     "nation": "Earth Kingdom",
     "role": "Earth Rumble Fighter",
     "gender": "male",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "Earth Rumble Fighter"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nThe Gopher is a professional earthbending fighter from Gaoling, Earth Kingdom, best known for his unique burrowing and tunneling style in the Earth Rumble tournaments. Wearing a headband-like mask, he used his earthbending to move underground and surprise his opponents. Though easily defeated by The Boulder, The Gopher later assisted Xin Fu in kidnapping Aang and Toph, only to be defeated by Toph in turn. His fighting style and stage persona made him a memorable, if minor, figure in the earthbending circuit.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Competed in Earth Rumble VI, using tunneling tactics in combat.\r\n- Defeated by The Boulder in the tournament.\r\n- Helped Xin Fu kidnap Aang and Toph for ransom.\r\n- Defeated by Toph during her escape from captivity.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor antagonist and comic relief, The Gopher’s unique earthbending style adds variety to the Earth Rumble roster and highlights the diversity of earthbending techniques.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Xin Fu** – Ally and fellow Earth Rumble fighter.\r\n- **Earth Rumble fighters** – Colleagues and rivals.\r\n- **Toph Beifong** – Defeated him in combat.\r\n- **Aang** – Briefly held captive.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Skilled in tunneling and underground movement\r\n- Loyal to fellow fighters\r\n- Wears a distinctive headband mask\r\n\r\n### 💬 Notable Quotes\r\n\r\n- (No lines)",
+    "expandedView": "### 📖 Overview\n\nThe Gopher is a professional earthbending fighter from Gaoling, Earth Kingdom, best known for his unique burrowing and tunneling style in the Earth Rumble tournaments. Wearing a headband-like mask, he used his earthbending to move underground and surprise his opponents. Though easily defeated by The Boulder, The Gopher later assisted Xin Fu in kidnapping Aang and Toph, only to be defeated by Toph in turn. His fighting style and stage persona made him a memorable, if minor, figure in the earthbending circuit.\n\n### ✨ Narrative Highlights\n\n- Competed in Earth Rumble VI, using tunneling tactics in combat.\n- Defeated by The Boulder in the tournament.\n- Helped Xin Fu kidnap Aang and Toph for ransom.\n- Defeated by Toph during her escape from captivity.\n\n### 🎭 Role in the Story\n\nA minor antagonist and comic relief, The Gopher’s unique earthbending style adds variety to the Earth Rumble roster and highlights the diversity of earthbending techniques.\n\n### 🤝 Relationships\n\n- **Xin Fu** – Ally and fellow Earth Rumble fighter.\n- **Earth Rumble fighters** – Colleagues and rivals.\n- **Toph Beifong** – Defeated him in combat.\n- **Aang** – Briefly held captive.\n\n### 🌟 Notable Traits\n\n- Skilled in tunneling and underground movement\n- Loyal to fellow fighters\n- Wears a distinctive headband mask\n\n### 💬 Notable Quotes\n\n- (No lines)",
     "metadata": {
       "badge": "Earth Rumble Fighter",
       "shortdescription": "An agile, resourceful, and comic male earthbender from Gaoling, The Gopher is known for his tunneling tactics, unique fighting style, and role as a minor antagonist and comic relief in the Earth Rumble tournaments.",
       "slug": "the-gopher",
       "fullName": "The Gopher",
       "aliases": [],
       "ageChronological": null,
       "ageBiological": null,
       "ageRange": "adult",
       "birthDate": null,
       "deathDate": null,
       "nativeLocation": "Gaoling",
       "currentLocation": "Gaoling",
       "socioeconomicStanding": "fighter",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "earth",
       "bendingProficiency": "skilled",
       "advancedBending": [
         "tunneling"
       ],
       "nonBendingSkills": [
         "stage performance"
@@ -16126,51 +16130,51 @@
       "reconciled_with_family",
       "achieved_enlightenment",
       "earth_kingdom",
       "gaoling",
       "earth_rumble",
       "metalbending_police_force",
       "foggy_swamp",
       "blind_bandit",
       "melon_lord",
       "hates_shoes",
       "cant_read",
       "female"
     ],
     "nation": "Earth Kingdom",
     "role": "Blind Bandit",
     "gender": "female",
     "species": "human",
     "nationality": "Earth Kingdom",
     "ethnicity": "Earth Kingdom",
     "titles": [
       "The Blind Bandit",
       "Chief",
       "Master",
       "Melon Lord"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nBorn blind and treated as a fragile doll by her overprotective parents, Toph secretly honed her earthbending skills with the original masters, the badgermoles. She developed a unique style using seismic sense to \"see\" the world, becoming an undefeated champion in underground fighting rings. After joining Team Avatar, her tough, independent, and brutally honest personality provides a necessary counterpoint, and her invention of metalbending single-handedly revolutionizes the art form and the future of the world.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Learned earthbending directly from badgermoles.\r\n- Single-handedly invented the art of metalbending to escape a metal cage.\r\n- Became Republic City's first Chief of Police and founded the Metalbending Police Force.\r\n- Reached enlightenment in the Foggy Swamp, connecting with the entire world.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe master earthbender who challenges Aang's methods and revolutionizes her element, proving strength comes from unexpected places.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Aang** – Student, friend, \"Twinkle Toes\".\r\n- **Katara** – Friend, rival, \"Sugar Queen\".\r\n- **Sokka** – Friend, crush.\r\n- **Lao & Poppy Beifong** – Estranged parents.\r\n- **Lin & Suyin Beifong** – Daughters.\r\n- **Badgermoles** – First teachers.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Tough, independent, and sarcastic.\r\n- Direct, uncouth, and rebellious.\r\n- Loyal and protective in her own way.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"I am the greatest earthbender in the world! Don't you two dunderheads ever forget it!\"\r\n- \"There's no different angle, no clever solution, no trickity-trick that's gonna move that rock. You've gotta face it head on.\"\r\n- \"I am not Toph! I am Melon Lord! Mwahahaha!\"",
+    "expandedView": "### 📖 Overview\n\nBorn blind and treated as a fragile doll by her overprotective parents, Toph secretly honed her earthbending skills with the original masters, the badgermoles. She developed a unique style using seismic sense to \"see\" the world, becoming an undefeated champion in underground fighting rings. After joining Team Avatar, her tough, independent, and brutally honest personality provides a necessary counterpoint, and her invention of metalbending single-handedly revolutionizes the art form and the future of the world.\n\n### ✨ Narrative Highlights\n\n- Learned earthbending directly from badgermoles.\n- Single-handedly invented the art of metalbending to escape a metal cage.\n- Became Republic City's first Chief of Police and founded the Metalbending Police Force.\n- Reached enlightenment in the Foggy Swamp, connecting with the entire world.\n\n### 🎭 Role in the Story\n\nThe master earthbender who challenges Aang's methods and revolutionizes her element, proving strength comes from unexpected places.\n\n### 🤝 Relationships\n\n- **Aang** – Student, friend, \"Twinkle Toes\".\n- **Katara** – Friend, rival, \"Sugar Queen\".\n- **Sokka** – Friend, crush.\n- **Lao & Poppy Beifong** – Estranged parents.\n- **Lin & Suyin Beifong** – Daughters.\n- **Badgermoles** – First teachers.\n\n### 🌟 Notable Traits\n\n- Tough, independent, and sarcastic.\n- Direct, uncouth, and rebellious.\n- Loyal and protective in her own way.\n\n### 💬 Notable Quotes\n\n- \"I am the greatest earthbender in the world! Don't you two dunderheads ever forget it!\"\n- \"There's no different angle, no clever solution, no trickity-trick that's gonna move that rock. You've gotta face it head on.\"\n- \"I am not Toph! I am Melon Lord! Mwahahaha!\"",
     "metadata": {
       "shortdescription": "A blind but prodigiously powerful earthbending master from a wealthy family. Toph rejects her sheltered life to teach the Avatar, inventing the revolutionary art of metalbending along the way.",
       "fullName": "Toph Beifong",
       "aliases": [
         "The Runaway",
         "Dung"
       ],
       "ageChronological": 86,
       "ageBiological": 86,
       "ageRange": "teen",
       "birthDate": "88 AG",
       "deathDate": null,
       "nativeLocation": "Gaoling",
       "currentLocation": "Foggy Swamp",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "earth",
       "bendingProficiency": "legendary",
       "advancedBending": [
         "metalbending",
         "sandbending",
         "seismic sense (lie detection)"
@@ -16539,51 +16543,51 @@
       "empathetic",
       "nobility",
       "traitor_amnestied",
       "circus_performer",
       "boiling_rock_incident",
       "joined_kyoshi_warriors",
       "betrayed_azula",
       "reunited_with_sisters",
       "fire_nation",
       "fire_nation_circus",
       "azulas_team",
       "kyoshi_warriors",
       "one_of_seven_sisters",
       "ran_away_to_join_the_circus",
       "reads_auras",
       "teaches_chiblocking",
       "female"
     ],
     "nation": "Fire Nation",
     "role": "Acrobat",
     "gender": "female",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nOne of seven identical sisters, Ty Lee ran away to join the circus to feel unique and gain individual recognition. Her acrobatic prowess and mastery of chi-blocking made her a prime recruit for Princess Azula's elite team. Though initially loyal out of fear, her empathetic nature and friendship with Mai ultimately lead her to defy Azula, choosing friendship over servitude.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Intimidated by Azula into leaving her circus life to join her quest.\r\n- Single-handedly defeated the Terra Team of elite earthbenders with her chi-blocking.\r\n- Betrayed Princess Azula at the Boiling Rock to save Mai.\r\n- After being imprisoned, she befriended and joined the Kyoshi Warriors.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA secondary antagonist whose bubbly personality conceals a deadly fighting style and whose arc demonstrates the courage to defy a toxic friendship.\r\n\r\n### 🤝 Relationships\r\n\r\n- Azula (Commander, former)\r\n- Mai (Best Friend)\r\n- Suki & The Kyoshi Warriors (Teammates)\r\n- Sokka (Crush)\r\n- Ty Sisters (Family)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Cheerful & Bubbly\r\n- Energetic & Flirtatious\r\n- Empathetic & Loyal\r\n- Attention-seeking\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"My aura has never been pinker!\"\r\n- \"Ooh, he's cute.\"\r\n- \"Circus freak is a compliment!\"",
+    "expandedView": "### 📖 Overview\n\nOne of seven identical sisters, Ty Lee ran away to join the circus to feel unique and gain individual recognition. Her acrobatic prowess and mastery of chi-blocking made her a prime recruit for Princess Azula's elite team. Though initially loyal out of fear, her empathetic nature and friendship with Mai ultimately lead her to defy Azula, choosing friendship over servitude.\n\n### ✨ Narrative Highlights\n\n- Intimidated by Azula into leaving her circus life to join her quest.\n- Single-handedly defeated the Terra Team of elite earthbenders with her chi-blocking.\n- Betrayed Princess Azula at the Boiling Rock to save Mai.\n- After being imprisoned, she befriended and joined the Kyoshi Warriors.\n\n### 🎭 Role in the Story\n\nA secondary antagonist whose bubbly personality conceals a deadly fighting style and whose arc demonstrates the courage to defy a toxic friendship.\n\n### 🤝 Relationships\n\n- Azula (Commander, former)\n- Mai (Best Friend)\n- Suki & The Kyoshi Warriors (Teammates)\n- Sokka (Crush)\n- Ty Sisters (Family)\n\n### 🧬 Notable Traits\n\n- Cheerful & Bubbly\n- Energetic & Flirtatious\n- Empathetic & Loyal\n- Attention-seeking\n\n### 🗣️ Notable Quotes\n\n- \"My aura has never been pinker!\"\n- \"Ooh, he's cute.\"\n- \"Circus freak is a compliment!\"",
     "metadata": {
       "shortdescription": "A cheerful and energetic acrobat from a noble Fire Nation family. Ty Lee is a master of chi-blocking, using her unique martial arts to disable benders as a key member of Azula's team.",
       "fullName": "Ty Lee",
       "aliases": [],
       "ageChronological": 16,
       "ageBiological": 16,
       "ageRange": "teen",
       "birthDate": "c. 85-86 AG",
       "deathDate": null,
       "nativeLocation": "Fire Nation",
       "currentLocation": "Unknown",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "chi-blocking",
         "acrobatics",
         "hand-to-hand combat",
         "parkour"
       ],
@@ -16899,51 +16903,51 @@
       "kind",
       "cunning",
       "haunted",
       "princess",
       "traitor_amnestied",
       "banished_from_fire_nation",
       "poisoned_azulon",
       "found_by_zuko",
       "regained_memory",
       "fire_nation_royal_family",
       "hiraa",
       "mother_of_faces",
       "master_herbalist",
       "changed_her_face",
       "had_a_second_family",
       "confronted_ozai_in_prison",
       "female"
     ],
     "nation": "Fire Nation",
     "role": "Fire Nation Royalty",
     "gender": "female",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nBorn in the small town of Hira'a, Ursa's life was forcibly changed when she was made to marry Prince Ozai. A loving mother caught in a web of royal intrigue, she made a terrible bargain to save her son Zuko's life, resulting in her banishment and the murder of Fire Lord Azulon. To escape her painful past, she had her memories and face changed by a spirit, living a new life as \"Noriko\" until her children finally found her.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Granddaughter of Avatar Roku, fulfilling a prophecy by marrying into the royal family.\r\n- Conspired with Ozai to poison Fire Lord Azulon in order to save Zuko's life.\r\n- Was banished and had her memory and face changed by the Mother of Faces.\r\n- Reunited with Zuko years later and had her memories and identity restored.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA mysterious and tragic figure whose absence haunts her children, acting as a symbol of lost love and the catalyst for Zuko's quest for truth.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Zuko** – Son.\r\n- **Azula** – Daughter.\r\n- **Ozai** – Husband, former.\r\n- **Noren / Ikem** – Husband, first love.\r\n- **Kiyi** – Daughter.\r\n- **Roku** – Grandfather.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Kind and loving.\r\n- Protective, brave, and cunning.\r\n- Pragmatic and haunted by her past.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Everything I've done, I've done to protect you.\"\r\n- \"Remember this, Zuko. No matter how things may seem to change, never forget who you are.\"\r\n- \"My only fault was not loving you enough.\" (to Azula)",
+    "expandedView": "### 📖 Overview\n\nBorn in the small town of Hira'a, Ursa's life was forcibly changed when she was made to marry Prince Ozai. A loving mother caught in a web of royal intrigue, she made a terrible bargain to save her son Zuko's life, resulting in her banishment and the murder of Fire Lord Azulon. To escape her painful past, she had her memories and face changed by a spirit, living a new life as \"Noriko\" until her children finally found her.\n\n### ✨ Narrative Highlights\n\n- Granddaughter of Avatar Roku, fulfilling a prophecy by marrying into the royal family.\n- Conspired with Ozai to poison Fire Lord Azulon in order to save Zuko's life.\n- Was banished and had her memory and face changed by the Mother of Faces.\n- Reunited with Zuko years later and had her memories and identity restored.\n\n### 🎭 Role in the Story\n\nA mysterious and tragic figure whose absence haunts her children, acting as a symbol of lost love and the catalyst for Zuko's quest for truth.\n\n### 🤝 Relationships\n\n- **Zuko** – Son.\n- **Azula** – Daughter.\n- **Ozai** – Husband, former.\n- **Noren / Ikem** – Husband, first love.\n- **Kiyi** – Daughter.\n- **Roku** – Grandfather.\n\n### 🌟 Notable Traits\n\n- Kind and loving.\n- Protective, brave, and cunning.\n- Pragmatic and haunted by her past.\n\n### 💬 Notable Quotes\n\n- \"Everything I've done, I've done to protect you.\"\n- \"Remember this, Zuko. No matter how things may seem to change, never forget who you are.\"\n- \"My only fault was not loving you enough.\" (to Azula)",
     "metadata": {
       "shortdescription": "The kind-hearted mother of Zuko and Azula, and wife of Prince Ozai. Her mysterious banishment from the Fire Nation is a driving force in her children's lives.",
       "fullName": "Ursa",
       "aliases": [
         "Noriko"
       ],
       "ageChronological": 40,
       "ageBiological": 40,
       "ageRange": "adult",
       "birthDate": "c. 64 AG",
       "deathDate": null,
       "nativeLocation": "Hira'a",
       "currentLocation": "Fire Nation Capital",
       "socioeconomicStanding": "nobility",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": false,
       "bendingElement": null,
       "bendingProficiency": "novice",
       "advancedBending": [],
       "nonBendingSkills": [
         "herbalism",
         "poison-making",
         "acting"
@@ -17224,51 +17228,51 @@
     "name": "Xin Fu",
     "summary": "Xin Fu is a shrewd, ambitious, and cunning male Earth Kingdom earthbender, fight promoter, and recurring antagonist. He schemes for profit and power as the host of the Earth Rumble tournaments and a persistent bounty hunter.",
     "type": "character",
     "slug": "xin-fu",
     "tags": [
       "earth_kingdom",
       "earth_rumble",
       "promoter",
       "bounty_hunter",
       "antagonist",
       "villain",
       "fighter",
       "earthbender",
       "underground",
       "book_two",
       "the_blind_bandit",
       "bender",
       "male"
     ],
     "image": null,
     "nation": "Earth Kingdom",
     "role": "Earth Rumble Promoter, Bounty Hunter, Antagonist, Villain, Fighter",
     "gender": "Male",
     "ethnicity": "Earth Kingdom",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nXin Fu was a prominent and ambitious Earth Kingdom fight promoter and bounty hunter. He was the host and referee of the Earth Rumble tournaments in Gaoling and was hired by Lao Beifong to capture Toph. Xin Fu was known for his cunning, persistence, and willingness to use underhanded tactics to achieve his goals. Despite his efforts, he was ultimately outsmarted by Toph and Team Avatar.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Hosted and refereed the Earth Rumble tournaments.\r\n- Hired by Lao Beifong to capture Toph.\r\n- Pursued Toph and Team Avatar across the Earth Kingdom.\r\n- Trapped in a metal box by Toph's metalbending.\r\n- Known for his cunning and persistence.\r\n\r\n### 🎭 Role in the Story\r\n\r\nXin Fu served as a recurring antagonist in Book 2, representing the Earth Kingdom's underground fighting scene and the lengths to which some would go for profit and reputation. His pursuit of Toph and Team Avatar added tension and showcased Toph's ingenuity and the dangers faced by the group.\r\n\r\n### 🤝 Relationships\r\n\r\n- Lao Beifong: Employer who hired Xin Fu to capture Toph.\r\n- Master Yu: Partnered with Xin Fu in the pursuit of Toph.\r\n- Toph Beifong: Target of Xin Fu's bounty hunt; ultimately outsmarted him.\r\n- Earth Rumble fighters: Allies and subordinates.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Cunning and resourceful\r\n- Persistent and ambitious\r\n- Skilled earthbender and fight promoter\r\n\r\n### 💬 Notable Quotes\r\n\r\n> \"Nobody cheats Xin Fu.\"",
+    "expandedView": "### 📖 Overview\n\nXin Fu was a prominent and ambitious Earth Kingdom fight promoter and bounty hunter. He was the host and referee of the Earth Rumble tournaments in Gaoling and was hired by Lao Beifong to capture Toph. Xin Fu was known for his cunning, persistence, and willingness to use underhanded tactics to achieve his goals. Despite his efforts, he was ultimately outsmarted by Toph and Team Avatar.\n\n### ✨ Narrative Highlights\n\n- Hosted and refereed the Earth Rumble tournaments.\n- Hired by Lao Beifong to capture Toph.\n- Pursued Toph and Team Avatar across the Earth Kingdom.\n- Trapped in a metal box by Toph's metalbending.\n- Known for his cunning and persistence.\n\n### 🎭 Role in the Story\n\nXin Fu served as a recurring antagonist in Book 2, representing the Earth Kingdom's underground fighting scene and the lengths to which some would go for profit and reputation. His pursuit of Toph and Team Avatar added tension and showcased Toph's ingenuity and the dangers faced by the group.\n\n### 🤝 Relationships\n\n- Lao Beifong: Employer who hired Xin Fu to capture Toph.\n- Master Yu: Partnered with Xin Fu in the pursuit of Toph.\n- Toph Beifong: Target of Xin Fu's bounty hunt; ultimately outsmarted him.\n- Earth Rumble fighters: Allies and subordinates.\n\n### 🌟 Notable Traits\n\n- Cunning and resourceful\n- Persistent and ambitious\n- Skilled earthbender and fight promoter\n\n### 💬 Notable Quotes\n\n> \"Nobody cheats Xin Fu.\"",
     "metadata": {
       "badge": "Earth Rumble Promoter",
       "shortdescription": "Xin Fu is a shrewd, ambitious, and cunning male Earth Kingdom earthbender, fight promoter, and recurring antagonist. He schemes for profit and power as the host of the Earth Rumble tournaments and a persistent bounty hunter.",
       "slug": "xin-fu",
       "shortDescription": "Xin Fu is a shrewd, ambitious, and cunning male Earth Kingdom earthbender, fight promoter, and recurring antagonist. He schemes for profit and power as the host of the Earth Rumble tournaments and a persistent bounty hunter.",
       "fullName": "Xin Fu",
       "aliases": [],
       "pronouns": "he/him",
       "age": 38,
       "ageRange": "adult",
       "hairColor": "Black",
       "eyeColor": "Gray",
       "skinColor": null,
       "loveInterest": null,
       "abilities": {
         "bending": [
           "Earthbending"
         ],
         "weapons": [],
         "fightingStyles": [
           "Earthbending (Hung Gar kung fu)",
           "Unarmed combat"
         ],
         "notableFeats": [
           "Hosted and refereed the Earth Rumble tournaments.",
@@ -17385,88 +17389,88 @@
         "episodeTags": [
           "Book Two",
           "The Blind Bandit"
         ],
         "identityTags": [
           "Male",
           "Underground"
         ]
       },
       "system": {
         "schemaVersion": "3.0",
         "createdBy": "AI Assistant",
         "createdAt": "2024-06-09T00:00:00Z",
         "flags": []
       },
       "__type": "character"
     }
   },
   {
     "id": "yagoda",
     "name": "Yagoda",
     "summary": "",
     "type": "character",
     "slug": "yagoda",
     "nation": "Northern Water Tribe",
-    "expandedView": "### 📖 Overview\r\n\r\nYagoda is a master healer and waterbending instructor from the Northern Water Tribe. She taught generations of young women the art of healing and was a close friend of Kanna.\r\n\r\n### 🧩 Role in the Story\r\n\r\nYagoda was a female waterbender from the Northern Water Tribe, specializing in the art of healing. She instructed young women of Agna Qel'a on how to use their waterbending abilities for healing. Yagoda was a kind and laid-back teacher, respected for her skill and wisdom. She was a close friend of Kanna, Katara and Sokka's grandmother, and recognized Katara's betrothal necklace as Pakku's work. Yagoda attempted to heal Princess Yue as a newborn, but was unable to help, leading Chief Arnook to seek aid from the Moon Spirit.\r\n\r\n### 🤝 Relationships\r\n\r\n- Katara: Student\r\n- Kanna: Friend\r\n- Northern Water Tribe: Community\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Kind\r\n- Patient\r\n- Laid-back\r\n- Traditional\r\n- Supportive\r\n- Calm\r\n\r\n### 💬 Quotes\r\n\r\n> \"Are you here for the healing lesson?\"\r\n> — Yagoda\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Master healer and instructor in the Northern Water Tribe.\r\n- Attempted to heal Princess Yue as a newborn.\r\n- Recognized Katara's betrothal necklace as Pakku's work.",
+    "expandedView": "### 📖 Overview\n\nYagoda is a master healer and waterbending instructor from the Northern Water Tribe. She taught generations of young women the art of healing and was a close friend of Kanna.\n\n### 🧩 Role in the Story\n\nYagoda was a female waterbender from the Northern Water Tribe, specializing in the art of healing. She instructed young women of Agna Qel'a on how to use their waterbending abilities for healing. Yagoda was a kind and laid-back teacher, respected for her skill and wisdom. She was a close friend of Kanna, Katara and Sokka's grandmother, and recognized Katara's betrothal necklace as Pakku's work. Yagoda attempted to heal Princess Yue as a newborn, but was unable to help, leading Chief Arnook to seek aid from the Moon Spirit.\n\n### 🤝 Relationships\n\n- Katara: Student\n- Kanna: Friend\n- Northern Water Tribe: Community\n\n### 🌟 Notable Traits\n\n- Kind\n- Patient\n- Laid-back\n- Traditional\n- Supportive\n- Calm\n\n### 💬 Quotes\n\n> \"Are you here for the healing lesson?\"\n> — Yagoda\n\n### ✨ Narrative Highlights\n\n- Master healer and instructor in the Northern Water Tribe.\n- Attempted to heal Princess Yue as a newborn.\n- Recognized Katara's betrothal necklace as Pakku's work.",
     "metadata": {
       "badge": "Healer",
       "shortdescription": "Yagoda is a skilled healer and respected elder of the Northern Water Tribe, known for teaching Katara and her compassion for her people.",
       "slug": "yagoda",
       "__type": "character"
     }
   },
   {
     "id": "yangchen",
     "name": "Yangchen",
     "summary": "A revered and powerful female Air Nomad Avatar, spiritual leader, and legendary bender, Yangchen was known for her fierce devotion to duty and willingness to do whatever was necessary to maintain global peace and stability.",
     "type": "character",
     "slug": "yangchen",
     "tags": [
       "air_nomads",
       "avatar",
       "mentor",
       "bender",
       "spiritual_leader",
       "legendary",
       "past_avatar",
       "diplomat",
       "peacemaker",
       "spirit_world",
       "book_two",
       "the_avatar_state",
       "female"
     ],
     "image": null,
     "nation": "Air Nomads",
     "role": "Past Avatar, Mentor, Spiritual Leader, Diplomat, Peacemaker",
     "gender": "Female",
     "ethnicity": "Air Nomad",
     "titles": [
       "Avatar"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nYangchen was a revered and powerful Air Nomad Avatar, known for her fierce devotion to her duty and her willingness to do whatever was necessary to maintain global peace and stability. Unlike many Air Nomads, she was not a strict pacifist and understood that maintaining peace sometimes required manipulation, espionage, and force. Her tireless efforts and difficult compromises secured an entire generation of peace after her death, though her focus on humanity's problems inadvertently led to a rise in dark spirits for her successor, Kuruk.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Plagued by visions of her past lives since childhood.\r\n- Defeated the spirit General Old Iron and established a pact to protect his sacred land.\r\n- Became deeply involved in the complex politics of the four nations to prevent war.\r\n- Was so effective as the Avatar that no major wars occurred for a generation after her death.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA legendary past Avatar who serves as a crucial spiritual guide, offering a pragmatic and duty-bound perspective that contrasts with Aang's idealism.\r\n\r\n### 🤝 Relationships\r\n\r\n- Kuruk (Successor)\r\n- Szeto (Predecessor)\r\n- Kavik (Companion, Informant)\r\n- Jetsun (Older Sister Figure, Spiritual Guide)\r\n- Aang (Future Successor)\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Dutiful & Determined\r\n- Compassionate & Empathetic\r\n- Pragmatic & Shrewd\r\n- Spiritually Troubled\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Selfless duty calls you to sacrifice your own spiritual needs and do whatever it takes to protect the world.\"\r\n- \"Many great and wise Air Nomads have detached themselves and achieved spiritual enlightenment. But the Avatar can never do it.\"\r\n- \"All Avatars are connected, like a chain. When you broke off your relationship with Roku, you damaged your connection with all of us.\"",
+    "expandedView": "### 📖 Overview\n\nYangchen was a revered and powerful Air Nomad Avatar, known for her fierce devotion to her duty and her willingness to do whatever was necessary to maintain global peace and stability. Unlike many Air Nomads, she was not a strict pacifist and understood that maintaining peace sometimes required manipulation, espionage, and force. Her tireless efforts and difficult compromises secured an entire generation of peace after her death, though her focus on humanity's problems inadvertently led to a rise in dark spirits for her successor, Kuruk.\n\n### ✨ Narrative Highlights\n\n- Plagued by visions of her past lives since childhood.\n- Defeated the spirit General Old Iron and established a pact to protect his sacred land.\n- Became deeply involved in the complex politics of the four nations to prevent war.\n- Was so effective as the Avatar that no major wars occurred for a generation after her death.\n\n### 🎭 Role in the Story\n\nA legendary past Avatar who serves as a crucial spiritual guide, offering a pragmatic and duty-bound perspective that contrasts with Aang's idealism.\n\n### 🤝 Relationships\n\n- Kuruk (Successor)\n- Szeto (Predecessor)\n- Kavik (Companion, Informant)\n- Jetsun (Older Sister Figure, Spiritual Guide)\n- Aang (Future Successor)\n\n### 🌟 Notable Traits\n\n- Dutiful & Determined\n- Compassionate & Empathetic\n- Pragmatic & Shrewd\n- Spiritually Troubled\n\n### 💬 Notable Quotes\n\n- \"Selfless duty calls you to sacrifice your own spiritual needs and do whatever it takes to protect the world.\"\n- \"Many great and wise Air Nomads have detached themselves and achieved spiritual enlightenment. But the Avatar can never do it.\"\n- \"All Avatars are connected, like a chain. When you broke off your relationship with Roku, you damaged your connection with all of us.\"",
     "metadata": {
       "badge": "Avatar of Duty",
       "shortdescription": "A revered and powerful female Air Nomad Avatar, spiritual leader, and legendary bender, Yangchen was known for her fierce devotion to duty and willingness to do whatever was necessary to maintain global peace and stability.",
       "slug": "yangchen",
       "shortDescription": "A revered and powerful female Air Nomad Avatar, spiritual leader, and legendary bender, Yangchen was known for her fierce devotion to duty and willingness to do whatever was necessary to maintain global peace and stability.",
       "fullName": "Yangchen",
       "aliases": [],
       "pronouns": "she/her",
       "age": 100,
       "ageRange": "elder",
       "hairColor": null,
       "eyeColor": "Gray",
       "skinColor": null,
       "loveInterest": null,
       "abilities": {
         "bending": [
           "Airbending",
           "Waterbending",
           "Earthbending",
           "Firebending"
         ],
         "weapons": [],
         "fightingStyles": [
           "Avatar State",
           "Espionage",
@@ -17610,51 +17614,51 @@
     "name": "Ying",
     "summary": "An optimistic, pregnant Earth Kingdom refugee and nonbender, Ying journeyed to Ba Sing Se with her family and gave birth to her daughter, Hope, with help from Team Avatar. Her resilience and hope inspired those around her during the war.",
     "type": "character",
     "slug": "ying",
     "tags": [
       "earth_kingdom",
       "ba_sing_se",
       "refugee",
       "mother",
       "nonbender",
       "civilian",
       "pregnant",
       "hope",
       "war_survivor",
       "team_avatar",
       "book_two",
       "serpents_pass",
       "female"
     ],
     "image": null,
     "nation": "Earth Kingdom",
     "role": "Refugee, Mother, Civilian",
     "gender": "Female",
     "ethnicity": "Earth Kingdom",
     "titles": [],
-    "expandedView": "### 📖 Overview\r\n\r\nYing is a refugee from the Earth Kingdom who, while heavily pregnant, traveled with her husband Than and sister-in-law to Ba Sing Se in search of safety. Forced to flee her village after a Rough Rhinos attack, Ying remained hopeful for her family's future. She met Team Avatar at the Serpent's Pass, where, with their help, she safely crossed the dangerous route and gave birth to her daughter, Hope. Ying’s optimism and resilience inspired those around her, and her story is a testament to perseverance in the face of adversity.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Fled her village after a Rough Rhinos attack, seeking safety in Ba Sing Se.\r\n- Traveled the Serpent’s Pass with Team Avatar while nine months pregnant.\r\n- Gave birth to her daughter, Hope, with Katara’s help.\r\n- Inspired Aang and others with her hope and resilience.\r\n- Witnessed the Fire Nation’s takeover of Ba Sing Se.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA minor but memorable character, Ying’s journey highlights the struggles of refugees and the importance of hope during war. Her story provides emotional depth and a sense of realism to Team Avatar’s travels.\r\n\r\n### 🤝 Relationships\r\n\r\n- Than – Husband; supportive partner during their journey.\r\n- Hope – Daughter, born at the Serpent’s Pass.\r\n- Than’s sister – Traveled with Ying and Than.\r\n- Team Avatar – Allies who helped her reach safety and deliver her baby.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Optimistic and resilient\r\n- Caring and hopeful\r\n- Remains positive in dire circumstances\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"I know what I want to name our baby now. Hope.\"",
+    "expandedView": "### 📖 Overview\n\nYing is a refugee from the Earth Kingdom who, while heavily pregnant, traveled with her husband Than and sister-in-law to Ba Sing Se in search of safety. Forced to flee her village after a Rough Rhinos attack, Ying remained hopeful for her family's future. She met Team Avatar at the Serpent's Pass, where, with their help, she safely crossed the dangerous route and gave birth to her daughter, Hope. Ying’s optimism and resilience inspired those around her, and her story is a testament to perseverance in the face of adversity.\n\n### ✨ Narrative Highlights\n\n- Fled her village after a Rough Rhinos attack, seeking safety in Ba Sing Se.\n- Traveled the Serpent’s Pass with Team Avatar while nine months pregnant.\n- Gave birth to her daughter, Hope, with Katara’s help.\n- Inspired Aang and others with her hope and resilience.\n- Witnessed the Fire Nation’s takeover of Ba Sing Se.\n\n### 🎭 Role in the Story\n\nA minor but memorable character, Ying’s journey highlights the struggles of refugees and the importance of hope during war. Her story provides emotional depth and a sense of realism to Team Avatar’s travels.\n\n### 🤝 Relationships\n\n- Than – Husband; supportive partner during their journey.\n- Hope – Daughter, born at the Serpent’s Pass.\n- Than’s sister – Traveled with Ying and Than.\n- Team Avatar – Allies who helped her reach safety and deliver her baby.\n\n### 🌟 Notable Traits\n\n- Optimistic and resilient\n- Caring and hopeful\n- Remains positive in dire circumstances\n\n### 💬 Notable Quotes\n\n- \"I know what I want to name our baby now. Hope.\"",
     "metadata": {
       "badge": "Hopeful Refugee",
       "shortdescription": "An optimistic, pregnant Earth Kingdom refugee and nonbender, Ying journeyed to Ba Sing Se with her family and gave birth to her daughter, Hope, with help from Team Avatar. Her resilience and hope inspired those around her during the war.",
       "slug": "ying",
       "shortDescription": "An optimistic, pregnant Earth Kingdom refugee and nonbender, Ying journeyed to Ba Sing Se with her family and gave birth to her daughter, Hope, with help from Team Avatar. Her resilience and hope inspired those around her during the war.",
       "fullName": "Ying",
       "aliases": [],
       "pronouns": "she/her",
       "age": 25,
       "ageRange": "adult",
       "hairColor": "Black",
       "eyeColor": null,
       "skinColor": "light",
       "loveInterest": "Than (husband)",
       "abilities": {
         "bending": [],
         "weapons": [],
         "fightingStyles": [],
         "notableFeats": [
           "Survived a Rough Rhinos attack and fled her village.",
           "Crossed the Serpent’s Pass while pregnant.",
           "Gave birth to her daughter, Hope, with Katara’s help."
         ]
       },
       "affiliations": {
@@ -17751,103 +17755,104 @@
         ],
         "identityTags": [
           "Female",
           "Pregnant",
           "War Survivor",
           "Hope",
           "Team Avatar"
         ]
       },
       "system": {
         "schemaVersion": "3.0",
         "createdBy": "AI Assistant",
         "createdAt": "2024-06-09T00:00:00Z",
         "flags": []
       },
       "__type": "character"
     }
   },
   {
     "id": "yu",
     "name": "Yu",
     "summary": "",
     "type": "character",
     "slug": "yu",
     "nation": "Earth Kingdom",
-    "expandedView": "### 📖 Overview\r\n\r\nYu is a renowned earthbending master and head of Gaoling’s earthbending academy. Known for his teaching, subtle earthbending style, and profit-driven approach, Yu was hired to retrieve Toph Beifong but ultimately returned to his teaching profession.\r\n\r\n### 🧩 Role in the Story\r\n\r\nYu was an earthbending master and a resident of the upper-class Earth Kingdom town of Gaoling. As manager and primary instructor of the town's earthbending academy, he was more interested in making money than passing on an art form. He later became a bounty hunter, searching for Toph upon her father's request, but returned to his teaching profession after failing to capture his target. Yu’s subtle, conservative earthbending style contrasted with Xin Fu’s brute force, and he was known for his patience, easygoing nature, and profit-driven mindset.\r\n\r\n### 🤝 Relationships\r\n\r\n- Lao Beifong: Client\r\n- Xin Fu: Ally\r\n- Toph Beifong: Enemy\r\n- Zuko: Enemy\r\n- Iroh: Enemy\r\n- Flyer distribution man: Ally\r\n- Earthbending academy teenagers: Allies\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Patient\r\n- Greedy\r\n- Level-headed\r\n- Easygoing\r\n\r\n### 💬 Quotes\r\n\r\n> \"If you pay for the whole year in advance, I'll bump you up to the next belt.\"\r\n> — Yu\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Head instructor of Gaoling's earthbending academy\r\n- Taught Toph Beifong basic earthbending\r\n- Became a bounty hunter to retrieve Toph\r\n- Captured Toph with Xin Fu using a metal cage\r\n- Escaped from a metal prison after being trapped by Toph",
+    "expandedView": "### 📖 Overview\n\nYu is a renowned earthbending master and head of Gaoling’s earthbending academy. Known for his teaching, subtle earthbending style, and profit-driven approach, Yu was hired to retrieve Toph Beifong but ultimately returned to his teaching profession.\n\n### 🧩 Role in the Story\n\nYu was an earthbending master and a resident of the upper-class Earth Kingdom town of Gaoling. As manager and primary instructor of the town's earthbending academy, he was more interested in making money than passing on an art form. He later became a bounty hunter, searching for Toph upon her father's request, but returned to his teaching profession after failing to capture his target. Yu’s subtle, conservative earthbending style contrasted with Xin Fu’s brute force, and he was known for his patience, easygoing nature, and profit-driven mindset.\n\n### 🤝 Relationships\n\n- Lao Beifong: Client\n- Xin Fu: Ally\n- Toph Beifong: Enemy\n- Zuko: Enemy\n- Iroh: Enemy\n- Flyer distribution man: Ally\n- Earthbending academy teenagers: Allies\n\n### 🌟 Notable Traits\n\n- Patient\n- Greedy\n- Level-headed\n- Easygoing\n\n### 💬 Quotes\n\n> \"If you pay for the whole year in advance, I'll bump you up to the next belt.\"\n> — Yu\n\n### ✨ Narrative Highlights\n\n- Head instructor of Gaoling's earthbending academy\n- Taught Toph Beifong basic earthbending\n- Became a bounty hunter to retrieve Toph\n- Captured Toph with Xin Fu using a metal cage\n- Escaped from a metal prison after being trapped by Toph",
     "metadata": {
       "badge": "Earthbending Instructor",
       "shortdescription": "Yu is a professional earthbending instructor from Gaoling, hired by the Beifong family to teach Toph and later involved in the Earth Rumble tournaments.",
       "slug": "yu",
       "__type": "character"
     }
   },
   {
     "id": "yue",
     "name": "Yue",
     "summary": "",
     "type": "character",
     "slug": "yue",
     "tags": [
       "sacrificial_lion",
       "tragic_love_interest",
       "ascended_to_godhood",
       "princess",
       "nonbender_mortal",
       "waterbender_spirit",
       "love_interest_of_sokka",
       "daughter_of_arnook",
       "friend_of_aang",
       "became_the_moon_spirit",
       "gentle",
       "kind",
       "dutiful",
       "courageous",
       "sad",
       "spirit",
       "siege_of_the_north",
       "sacrificed_herself",
       "northern_water_tribe",
       "spirit_world",
       "moon_spirit",
       "spirit_oasis",
       "white_hair",
       "saved_by_moon_spirit",
       "sokkas_first_girlfriend",
       "name_means_moon",
-      "female"
+      "female",
+      "waterbender"
     ],
     "nation": "Northern Water Tribe",
     "role": "NWT Princess",
     "gender": "female",
     "species": "human (formerly), spirit",
     "nationality": "Northern Water Tribe",
     "ethnicity": "Water Tribe",
     "titles": [
       "Princess"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nAs a sickly infant, Princess Yue's life was saved when the Moon Spirit gave her a piece of its own life force. Torn between her duty to her tribe and her feelings for Sokka, her kindness and bravery define her. During the Siege of the North, when the mortal form of the Moon Spirit is killed, Yue selflessly gives her life back, ascending to become the new Moon Spirit and saving waterbending for the entire world.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Saved from a mortal illness as a baby by the Moon Spirit.\r\n- Torn between her arranged marriage and her love for Sokka.\r\n- Sacrificed her mortal life to become the new Moon Spirit, Tui.\r\n- Guided Aang in the Spirit World after her transformation.\r\n\r\n### 🎭 Role in the Story\r\n\r\nA tragic love interest and key spiritual figure whose sacrifice is a pivotal moment in the war and for Sokka's personal development.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Sokka** – Boyfriend.\r\n- **Arnook** – Father.\r\n- **Hahn** – Fiancé (arranged).\r\n- **Aang & Katara** – Allies.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Gentle and kind.\r\n- Dutiful, loyal, spiritual, and graceful.\r\n- Courageous.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"It gave me life. Maybe I can give it back.\"\r\n- \"We can't. It's not right.\"\r\n- \"I'll always be with you.\"",
+    "expandedView": "### 📖 Overview\n\nAs a sickly infant, Princess Yue's life was saved when the Moon Spirit gave her a piece of its own life force. Torn between her duty to her tribe and her feelings for Sokka, her kindness and bravery define her. During the Siege of the North, when the mortal form of the Moon Spirit is killed, Yue selflessly gives her life back, ascending to become the new Moon Spirit and saving waterbending for the entire world.\n\n### ✨ Narrative Highlights\n\n- Saved from a mortal illness as a baby by the Moon Spirit.\n- Torn between her arranged marriage and her love for Sokka.\n- Sacrificed her mortal life to become the new Moon Spirit, Tui.\n- Guided Aang in the Spirit World after her transformation.\n\n### 🎭 Role in the Story\n\nA tragic love interest and key spiritual figure whose sacrifice is a pivotal moment in the war and for Sokka's personal development.\n\n### 🤝 Relationships\n\n- **Sokka** – Boyfriend.\n- **Arnook** – Father.\n- **Hahn** – Fiancé (arranged).\n- **Aang & Katara** – Allies.\n\n### 🌟 Notable Traits\n\n- Gentle and kind.\n- Dutiful, loyal, spiritual, and graceful.\n- Courageous.\n\n### 💬 Notable Quotes\n\n- \"It gave me life. Maybe I can give it back.\"\n- \"We can't. It's not right.\"\n- \"I'll always be with you.\"",
     "metadata": {
       "shortdescription": "The gentle and dutiful princess of the Northern Water Tribe. She makes the ultimate sacrifice to save her people and restore balance to the world by becoming the new Moon Spirit.",
       "fullName": "Yue",
       "aliases": [],
       "ageChronological": 16,
       "ageBiological": 16,
       "ageRange": "teen",
       "birthDate": "84 AG",
       "deathDate": "100 AG",
       "nativeLocation": "Agna Qel'a",
       "currentLocation": "Spirit World",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "water",
       "bendingProficiency": "legendary",
       "advancedBending": [],
       "nonBendingSkills": [],
       "uniqueTechniques": [
         "empowering all waterbenders",
         "global water manipulation"
       ],
       "powerMetrics": {
@@ -18128,51 +18133,51 @@
       "military_leader",
       "warmonger",
       "siege_of_the_north",
       "killed_the_moon_spirit",
       "trapped_in_spirit_world",
       "agni_kai_vs_zuko",
       "fire_nation_navy",
       "fire_nation",
       "spirit_world",
       "fog_of_lost_souls",
       "voiced_by_jason_isaacs",
       "terrible_balance",
       "hates_snow",
       "book_1_villain",
       "male"
     ],
     "nation": "Fire Nation",
     "role": "FN Admiral",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Admiral"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nA man driven by a pathological need for recognition, Zhao rapidly climbed the ranks of the Fire Nation military through a combination of skill, cunning, and cruelty. His rivalry with the banished Prince Zuko for the capture of the Avatar fuels much of his action. His ultimate ambition culminates in the Siege of the North, where he makes the fatal mistake of killing the Moon Spirit, leading to his own downfall at the hands of the enraged Ocean Spirit.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Discovered the location of the Moon and Ocean spirits in Wan Shi Tong's Library.\r\n- Became the primary rival to Prince Zuko in the hunt for the Avatar.\r\n- Led the massive Fire Nation naval invasion of the Northern Water Tribe.\r\n- Killed the Moon Spirit, Tui, and was subsequently dragged into the Spirit World for eternity.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe primary antagonist of Book One, whose arrogance and short-sighted pursuit of glory serve as a foil to both Zuko's honor-bound quest and Aang's spiritual journey.\r\n\r\n### 🤝 Relationships\r\n\r\n- Zuko (Rival)\r\n- Iroh (Rival, former subordinate)\r\n- Aang (Primary Target)\r\n- Jeong Jeong (Former Master)\r\n- Ozai (Superior)\r\n\r\n### 🧬 Notable Traits\r\n\r\n- Arrogant & Ambitious\r\n- Narcissistic & Egotistical\r\n- Short-tempered & Impatient\r\n- Cunning & Deceptive\r\n\r\n### 🗣️ Notable Quotes\r\n\r\n- \"I am a legend now! The Fire Nation will for generations tell stories about the great Zhao who darkened the moon!\"\r\n- \"I am Zhao the Conqueror! Zhao the Moon Slayer! Zhao... the Invincible!\"\r\n- \"You can't compete with me. I have hundreds of warships under my command.\"",
+    "expandedView": "### 📖 Overview\n\nA man driven by a pathological need for recognition, Zhao rapidly climbed the ranks of the Fire Nation military through a combination of skill, cunning, and cruelty. His rivalry with the banished Prince Zuko for the capture of the Avatar fuels much of his action. His ultimate ambition culminates in the Siege of the North, where he makes the fatal mistake of killing the Moon Spirit, leading to his own downfall at the hands of the enraged Ocean Spirit.\n\n### ✨ Narrative Highlights\n\n- Discovered the location of the Moon and Ocean spirits in Wan Shi Tong's Library.\n- Became the primary rival to Prince Zuko in the hunt for the Avatar.\n- Led the massive Fire Nation naval invasion of the Northern Water Tribe.\n- Killed the Moon Spirit, Tui, and was subsequently dragged into the Spirit World for eternity.\n\n### 🎭 Role in the Story\n\nThe primary antagonist of Book One, whose arrogance and short-sighted pursuit of glory serve as a foil to both Zuko's honor-bound quest and Aang's spiritual journey.\n\n### 🤝 Relationships\n\n- Zuko (Rival)\n- Iroh (Rival, former subordinate)\n- Aang (Primary Target)\n- Jeong Jeong (Former Master)\n- Ozai (Superior)\n\n### 🧬 Notable Traits\n\n- Arrogant & Ambitious\n- Narcissistic & Egotistical\n- Short-tempered & Impatient\n- Cunning & Deceptive\n\n### 🗣️ Notable Quotes\n\n- \"I am a legend now! The Fire Nation will for generations tell stories about the great Zhao who darkened the moon!\"\n- \"I am Zhao the Conqueror! Zhao the Moon Slayer! Zhao... the Invincible!\"\n- \"You can't compete with me. I have hundreds of warships under my command.\"",
     "metadata": {
       "shortdescription": "A ruthlessly ambitious and arrogant Fire Nation naval officer. Zhao's obsession with capturing the Avatar and achieving legendary status makes him a primary adversary in the early stages of the war.",
       "fullName": "Zhao",
       "aliases": [],
       "ageChronological": 100,
       "ageBiological": 40,
       "ageRange": "adult",
       "birthDate": "c. 60 AG",
       "deathDate": "100 AG",
       "nativeLocation": "Fire Islands",
       "currentLocation": "Fog of Lost Souls, Spirit World",
       "socioeconomicStanding": "military",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "master",
       "advancedBending": [],
       "nonBendingSkills": [
         "military strategy",
         "naval command",
         "intimidation"
       ],
       "uniqueTechniques": [],
@@ -18496,51 +18501,51 @@
       "found_his_mother",
       "became_fire_lord",
       "fire_nation_royalty",
       "team_avatar",
       "blue_spirit",
       "united_republic",
       "zuzu",
       "sifu_hotman",
       "bad_tea_maker",
       "has_a_scar",
       "reignited_romance_with_mai",
       "male"
     ],
     "nation": "Fire Nation",
     "role": "Exiled Prince",
     "gender": "male",
     "species": "human",
     "nationality": "Fire Nation",
     "ethnicity": "Fire Nation",
     "titles": [
       "Prince",
       "Fire Lord",
       "Lord",
       "Ambassador"
     ],
-    "expandedView": "### 📖 Overview\r\n\r\nBanished by his cruel father and marked by a brutal scar, Prince Zuko's singular goal is to capture the Avatar to restore his lost honor. Aided by his wise uncle Iroh, Zuko's relentless pursuit forces him to confront the tyranny of his nation and the turmoil within himself. Ultimately, he rejects his father's legacy, choosing instead to join his former enemies and help the Avatar bring peace and balance to the world.\r\n\r\n### ✨ Narrative Highlights\r\n\r\n- Banished and scarred by his own father, Fire Lord Ozai.\r\n- Hunted the Avatar across the world, often under the guise of the \"Blue Spirit\".\r\n- Made the difficult choice to defy his father and join Team Avatar.\r\n- Defeated his sister, Azula, in a final Agni Kai to claim the title of Fire Lord.\r\n\r\n### 🎭 Role in the Story\r\n\r\nThe primary antagonist turned deuteragonist whose redemption arc is central to the series' themes of honor, destiny, and change.\r\n\r\n### 🤝 Relationships\r\n\r\n- **Iroh** – Uncle, mentor, father figure.\r\n- **Aang** – Enemy turned student and friend.\r\n- **Azula** – Sister, primary rival.\r\n- **Ozai** – Father, abuser, enemy.\r\n- **Katara** – Enemy turned trusted ally.\r\n- **Mai** – Girlfriend.\r\n\r\n### 🌟 Notable Traits\r\n\r\n- Intense, brooding, and impatient.\r\n- Hot-headed, honorable, and determined.\r\n- Conflicted and compassionate.\r\n\r\n### 💬 Notable Quotes\r\n\r\n- \"Hello, Zuko here.\"\r\n- \"I've struggled for so long to do what's right; to even know what's right.\"\r\n- \"That's rough, buddy.\"",
+    "expandedView": "### 📖 Overview\n\nBanished by his cruel father and marked by a brutal scar, Prince Zuko's singular goal is to capture the Avatar to restore his lost honor. Aided by his wise uncle Iroh, Zuko's relentless pursuit forces him to confront the tyranny of his nation and the turmoil within himself. Ultimately, he rejects his father's legacy, choosing instead to join his former enemies and help the Avatar bring peace and balance to the world.\n\n### ✨ Narrative Highlights\n\n- Banished and scarred by his own father, Fire Lord Ozai.\n- Hunted the Avatar across the world, often under the guise of the \"Blue Spirit\".\n- Made the difficult choice to defy his father and join Team Avatar.\n- Defeated his sister, Azula, in a final Agni Kai to claim the title of Fire Lord.\n\n### 🎭 Role in the Story\n\nThe primary antagonist turned deuteragonist whose redemption arc is central to the series' themes of honor, destiny, and change.\n\n### 🤝 Relationships\n\n- **Iroh** – Uncle, mentor, father figure.\n- **Aang** – Enemy turned student and friend.\n- **Azula** – Sister, primary rival.\n- **Ozai** – Father, abuser, enemy.\n- **Katara** – Enemy turned trusted ally.\n- **Mai** – Girlfriend.\n\n### 🌟 Notable Traits\n\n- Intense, brooding, and impatient.\n- Hot-headed, honorable, and determined.\n- Conflicted and compassionate.\n\n### 💬 Notable Quotes\n\n- \"Hello, Zuko here.\"\n- \"I've struggled for so long to do what's right; to even know what's right.\"\n- \"That's rough, buddy.\"",
     "metadata": {
       "shortdescription": "The exiled crown prince of the Fire Nation, Zuko's obsession with capturing the Avatar to regain his honor leads him on a tumultuous journey of self-discovery and redemption.",
       "fullName": "Zuko",
       "aliases": [
         "The Blue Spirit",
         "Lee",
         "Junior"
       ],
       "ageChronological": 91,
       "ageBiological": 91,
       "ageRange": "teen",
       "birthDate": "83 AG",
       "deathDate": null,
       "nativeLocation": "Fire Nation Capital",
       "currentLocation": "Ember Island",
       "socioeconomicStanding": "royalty",
       "languagesSpoken": [
         "Standard Language"
       ],
       "isBender": true,
       "bendingElement": "fire",
       "bendingProficiency": "master",
       "advancedBending": [
         "lightning redirection"
       ],
diff --git a/scripts/2-enrich-data.mjs b/scripts/2-enrich-data.mjs
index d7a3083b30426abbcf58b84b83fdcc387c0cf4e9..2f4ef31a687157b29d65222c8d6944d756cc66f5 100644
--- a/scripts/2-enrich-data.mjs
+++ b/scripts/2-enrich-data.mjs
@@ -1,28 +1,31 @@
 import fs from 'fs/promises';
 import path from 'path';
 import enrichRecord from './lib/enrichRecord.mjs';
 
 const parsedDataPath = path.join(process.cwd(), 'data/parsed-data.json');
 const enrichedDataPath = path.join(process.cwd(), 'public/enriched-data.json');
+const tagDictionaryPath = path.join(process.cwd(), 'src/data/tag_dictionary.json');
 
 async function enrichData() {
   try {
     const data = await fs.readFile(parsedDataPath, 'utf8');
     const records = JSON.parse(data);
+    const tagDictData = await fs.readFile(tagDictionaryPath, 'utf8');
+    const tagDictionary = JSON.parse(tagDictData);
 
-    const enrichedRecords = records.map(enrichRecord);
+    const enrichedRecords = records.map(r => enrichRecord(r, tagDictionary));
 
     await fs.writeFile(
       enrichedDataPath,
       JSON.stringify(enrichedRecords, null, 2),
     );
     console.log(
       `✅ Successfully enriched ${enrichedRecords.length} records and saved to ${enrichedDataPath}`,
     );
   } catch (error) {
     console.error('Error during data enrichment:', error);
     process.exit(1);
   }
 }
 
 enrichData(); 
\ No newline at end of file
diff --git a/scripts/lib/enrichRecord.mjs b/scripts/lib/enrichRecord.mjs
index df84c858e445d8a43c10f5f2319ae6350bf9bc10..03b9e022d00bbbeac40cfcb0fb1a8584bfd06140 100644
--- a/scripts/lib/enrichRecord.mjs
+++ b/scripts/lib/enrichRecord.mjs
@@ -1,76 +1,109 @@
 export const UI_FIELDS_TO_PROMOTE = [
   'image',
   'nation',
   'role',
   'gender',
   'species',
   'nationality',
   'ethnicity',
   'affiliation',
   'titles',
+  'searchAliases',
   'expandedView',
 ];
 
 const generateSlug = (name) =>
   name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '';
 
-export default function enrichRecord(record) {
+export default function enrichRecord(record, tagDictionary = {}) {
   const id = record.id || generateSlug(record.name);
   const name = record.name || 'Unnamed Record';
   const summary = record.summary || record.shortDescription || '';
   const type = record.type || record.__type || 'character';
 
   const tags = [
     ...(record.tags || []),
     ...(record.tagCategories ? Object.values(record.tagCategories).flat() : []),
   ];
   // Remove any existing gender tags (case-insensitive, with or without prefix)
   let filteredTags = tags.filter(
     t => !/^male$|^female$/i.test(t.trim().toLowerCase()) && !/\bmale\b|\bfemale\b/i.test(t.trim().toLowerCase())
   );
 
   // Add normalized gender tag if present
   if (record.gender) {
     const gender = record.gender.trim().toLowerCase();
     if (gender === 'male' || gender === 'female') {
       filteredTags.push(gender);
     }
   }
 
   // Normalize all tags: replace spaces and slashes with underscores, remove non-word chars, and lowercase
   const normalizedTags = filteredTags
     .map(t => t.trim().toLowerCase().replace(/[\s\/]+/g, '_').replace(/[^a-z0-9_]/g, ''))
     .filter(t => t.length > 0 && !t.includes('__') && !t.startsWith('_') && !t.endsWith('_'));
 
   // Only keep single-word tags (no underscores at start/end, no double underscores)
   const singleWordTags = normalizedTags.filter(t => /^[a-z0-9_]+$/.test(t) && !t.includes(' '));
   const uniqueTags = [...new Set(singleWordTags)];
 
+  // Validate tags against the dictionary and resolve aliases
+  const finalTags = new Set();
+  for (const tag of uniqueTags) {
+    if (tagDictionary[tag]) {
+      finalTags.add(tag);
+      if (Array.isArray(tagDictionary[tag].implies)) {
+        tagDictionary[tag].implies.forEach(t => finalTags.add(t));
+      }
+    } else {
+      const canonical = Object.keys(tagDictionary).find(key =>
+        (tagDictionary[key].aliases || [])
+          .map(a => a.toLowerCase().replace(/\s+/g, '_'))
+          .includes(tag)
+      );
+      if (canonical) {
+        finalTags.add(canonical);
+        const entry = tagDictionary[canonical];
+        if (Array.isArray(entry.implies)) entry.implies.forEach(t => finalTags.add(t));
+      } else {
+        throw new Error(`Unknown tag '${tag}' on record ${id}`);
+      }
+    }
+  }
+
+  // Basic inference based on key fields
+  if (record.isBender && record.bendingElement) {
+    const element = String(record.bendingElement).toLowerCase();
+    if (['earth', 'fire', 'water', 'air'].includes(element)) {
+      finalTags.add(`${element}bender`);
+    }
+  }
+
   const promotedFields = {};
   for (const field of UI_FIELDS_TO_PROMOTE) {
     if (record[field] !== undefined) {
       promotedFields[field] = record[field];
     }
   }
 
   const metadata = { ...record };
   delete metadata.id;
   delete metadata.name;
   delete metadata.summary;
   delete metadata.type;
   delete metadata.tags;
   for (const field of UI_FIELDS_TO_PROMOTE) {
     delete metadata[field];
   }
 
   return {
     id,
     name,
     summary,
     type,
     slug: record.slug || id,
-    tags: uniqueTags.length > 0 ? uniqueTags : undefined,
+    tags: finalTags.size > 0 ? Array.from(finalTags) : undefined,
     ...promotedFields,
     metadata,
   };
-} 
\ No newline at end of file
+}
\ No newline at end of file
diff --git a/src/data/tag_dictionary.json b/src/data/tag_dictionary.json
new file mode 100644
index 0000000000000000000000000000000000000000..66f77689f982d3921c2bb5fb98d5c80eb9237e0c
--- /dev/null
+++ b/src/data/tag_dictionary.json
@@ -0,0 +1,6722 @@
+{
+  "112_years_old": {
+    "displayName": "112 Years Old",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "a": {
+    "displayName": "A",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "aangs_animal_guide": {
+    "displayName": "Aangs Animal Guide",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "abandoned_siege": {
+    "displayName": "Abandoned Siege",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "abusive_parent": {
+    "displayName": "Abusive Parent",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "achieved_enlightenment": {
+    "displayName": "Achieved Enlightenment",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "acrobat": {
+    "displayName": "Acrobat",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "acrobatic_fighter": {
+    "displayName": "Acrobatic Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "action_dad": {
+    "displayName": "Action Dad",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "adaptation": {
+    "displayName": "Adaptation",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "admiral": {
+    "displayName": "Admiral",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "admiral_defected": {
+    "displayName": "Admiral Defected",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "adviser": {
+    "displayName": "Adviser",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "advisor_to_pakku": {
+    "displayName": "Advisor To Pakku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "affectionate": {
+    "displayName": "Affectionate",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "afraid_of_fire": {
+    "displayName": "Afraid Of Fire",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "aggressive": {
+    "displayName": "Aggressive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "agna_qela": {
+    "displayName": "Agna Qela",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "agni_kai": {
+    "displayName": "Agni Kai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "agni_kai_vs_zuko": {
+    "displayName": "Agni Kai Vs Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "air_nomads": {
+    "displayName": "Air Nomads",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "airbender": {
+    "displayName": "Airbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ally": {
+    "displayName": "Ally",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ally_of_aang": {
+    "displayName": "Ally Of Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ally_of_team_avatar": {
+    "displayName": "Ally Of Team Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ally_of_xin_fu": {
+    "displayName": "Ally Of Xin Fu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ally_of_zuko": {
+    "displayName": "Ally Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ambassador": {
+    "displayName": "Ambassador",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ambitious": {
+    "displayName": "Ambitious",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "androgynous_appearance": {
+    "displayName": "Androgynous Appearance",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "angry": {
+    "displayName": "Angry",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "animal_companion": {
+    "displayName": "Animal Companion",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "annihilated_southern_water_tribe": {
+    "displayName": "Annihilated Southern Water Tribe",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "antagonist": {
+    "displayName": "Antagonist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "antihero": {
+    "displayName": "Antihero",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "antisexism_advocate": {
+    "displayName": "Antisexism Advocate",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "apathetic": {
+    "displayName": "Apathetic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "appas_lost_days": {
+    "displayName": "Appas Lost Days",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "apprentice_to_aunt_wu": {
+    "displayName": "Apprentice To Aunt Wu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "archer": {
+    "displayName": "Archer",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "arena_fighter": {
+    "displayName": "Arena Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "aristocracy": {
+    "displayName": "Aristocracy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "arranged_marriage": {
+    "displayName": "Arranged Marriage",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "arrogant": {
+    "displayName": "Arrogant",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ascended_to_godhood": {
+    "displayName": "Ascended To Godhood",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ascended_to_spirit_world": {
+    "displayName": "Ascended To Spirit World",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "assassin": {
+    "displayName": "Assassin",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "assassinated": {
+    "displayName": "Assassinated",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "assistant": {
+    "displayName": "Assistant",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "attempted_to_flood_gaipan": {
+    "displayName": "Attempted To Flood Gaipan",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "attempted_to_trigger_avatar_state": {
+    "displayName": "Attempted To Trigger Avatar State",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "aunt_wus_fortune_salon": {
+    "displayName": "Aunt Wus Fortune Salon",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "avatar": {
+    "displayName": "Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "avatar_state": {
+    "displayName": "Avatar State",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "azulas_namesake": {
+    "displayName": "Azulas Namesake",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "azulas_team": {
+    "displayName": "Azulas Team",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "b": {
+    "displayName": "B",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ba_sing_se": {
+    "displayName": "Ba Sing Se",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ba_sing_se_bureaucracy": {
+    "displayName": "Ba Sing Se Bureaucracy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "background_motivation": {
+    "displayName": "Background Motivation",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bad_artist": {
+    "displayName": "Bad Artist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bad_tea_maker": {
+    "displayName": "Bad Tea Maker",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "badass_normal": {
+    "displayName": "Badass Normal",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "badgermole_tattoo": {
+    "displayName": "Badgermole Tattoo",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "baked_for_the_temple": {
+    "displayName": "Baked For The Temple",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "baker": {
+    "displayName": "Baker",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "banished_from_fire_nation": {
+    "displayName": "Banished From Fire Nation",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "banished_zuko": {
+    "displayName": "Banished Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "became_a_master_swordsman": {
+    "displayName": "Became A Master Swordsman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "became_a_tea_discoverer": {
+    "displayName": "Became A Tea Discoverer",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "became_fire_lord": {
+    "displayName": "Became Fire Lord",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "became_the_moon_spirit": {
+    "displayName": "Became The Moon Spirit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "becomes_the_master": {
+    "displayName": "Becomes The Master",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "befriending_aang": {
+    "displayName": "Befriending Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bender": {
+    "displayName": "Bender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "best_friend_of_aang": {
+    "displayName": "Best Friend Of Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "best_friend_of_roku": {
+    "displayName": "Best Friend Of Roku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "best_friend_of_the_duke": {
+    "displayName": "Best Friend Of The Duke",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "best_friends_to_enemies": {
+    "displayName": "Best Friends To Enemies",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "betrayed_azula": {
+    "displayName": "Betrayed Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "betrayed_by_friends": {
+    "displayName": "Betrayed By Friends",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "betrayed_roku": {
+    "displayName": "Betrayed Roku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "betrothed_to_yue": {
+    "displayName": "Betrothed To Yue",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bitter": {
+    "displayName": "Bitter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bladesmith": {
+    "displayName": "Bladesmith",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "blind_bandit": {
+    "displayName": "Blind Bandit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bloodbender": {
+    "displayName": "Bloodbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bloodbender_inventor": {
+    "displayName": "Bloodbender Inventor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bloodbending": {
+    "displayName": "Bloodbending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "blue_fire": {
+    "displayName": "Blue Fire",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "blue_spirit": {
+    "displayName": "Blue Spirit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "boiling_rock_escapee": {
+    "displayName": "Boiling Rock Escapee",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "boiling_rock_incident": {
+    "displayName": "Boiling Rock Incident",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bombastic": {
+    "displayName": "Bombastic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "book_1_villain": {
+    "displayName": "Book 1 Villain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "book_2_villain": {
+    "displayName": "Book 2 Villain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "book_one": {
+    "displayName": "Book One",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "book_three": {
+    "displayName": "Book Three",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "book_two": {
+    "displayName": "Book Two",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "boomerang": {
+    "displayName": "Boomerang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bored": {
+    "displayName": "Bored",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bounty_hunter": {
+    "displayName": "Bounty Hunter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "boyfriend_of_mai": {
+    "displayName": "Boyfriend Of Mai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "boyfriend_of_malina": {
+    "displayName": "Boyfriend Of Malina",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "boyfriend_of_suki": {
+    "displayName": "Boyfriend Of Suki",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brainwashed": {
+    "displayName": "Brainwashed",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brainwashed_by_dai_li": {
+    "displayName": "Brainwashed By Dai Li",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brainwashing": {
+    "displayName": "Brainwashing",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brave": {
+    "displayName": "Brave",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bridge_to_spirit_world": {
+    "displayName": "Bridge To Spirit World",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brilliant": {
+    "displayName": "Brilliant",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "broke_up_with_zuko": {
+    "displayName": "Broke Up With Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brooding": {
+    "displayName": "Brooding",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brother_of_azula": {
+    "displayName": "Brother Of Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brother_of_iroh": {
+    "displayName": "Brother Of Iroh",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brother_of_katara": {
+    "displayName": "Brother Of Katara",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brother_of_ozai": {
+    "displayName": "Brother Of Ozai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brutal": {
+    "displayName": "Brutal",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "brute_strength": {
+    "displayName": "Brute Strength",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bubbly": {
+    "displayName": "Bubbly",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "builder": {
+    "displayName": "Builder",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "bureaucratic_foil": {
+    "displayName": "Bureaucratic Foil",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "business_partner_of_loban": {
+    "displayName": "Business Partner Of Loban",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "businessman": {
+    "displayName": "Businessman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "c": {
+    "displayName": "C",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cabbage_cart_destruction": {
+    "displayName": "Cabbage Cart Destruction",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cabbage_corp": {
+    "displayName": "Cabbage Corp",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "calligrapher": {
+    "displayName": "Calligrapher",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "calm": {
+    "displayName": "Calm",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cant_flirt": {
+    "displayName": "Cant Flirt",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cant_read": {
+    "displayName": "Cant Read",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "caring": {
+    "displayName": "Caring",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "carved_betrothal_necklace": {
+    "displayName": "Carved Betrothal Necklace",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "changed_her_face": {
+    "displayName": "Changed Her Face",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "charismatic": {
+    "displayName": "Charismatic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "charismatic_leader": {
+    "displayName": "Charismatic Leader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "charming": {
+    "displayName": "Charming",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cheerful": {
+    "displayName": "Cheerful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "chews_wheat": {
+    "displayName": "Chews Wheat",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "chiblocking": {
+    "displayName": "Chiblocking",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "chief": {
+    "displayName": "Chief",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "chief_of_police": {
+    "displayName": "Chief Of Police",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "chieftain": {
+    "displayName": "Chieftain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "child_prodigy": {
+    "displayName": "Child Prodigy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "childhood_trauma": {
+    "displayName": "Childhood Trauma",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "chin_the_conqueror": {
+    "displayName": "Chin The Conqueror",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "chosen_one": {
+    "displayName": "Chosen One",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "circus_performer": {
+    "displayName": "Circus Performer",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "citizen_of_ba_sing_se": {
+    "displayName": "Citizen Of Ba Sing Se",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "city_of_walls_and_secrets": {
+    "displayName": "City Of Walls And Secrets",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "civilian": {
+    "displayName": "Civilian",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "classmate_of_shoji": {
+    "displayName": "Classmate Of Shoji",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "club_fighter": {
+    "displayName": "Club Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cofounder_of_republic_city": {
+    "displayName": "Cofounder Of Republic City",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "combustionbender": {
+    "displayName": "Combustionbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "comic": {
+    "displayName": "Comic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "comic_relief": {
+    "displayName": "Comic Relief",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "coming_of_age": {
+    "displayName": "Coming Of Age",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "commander": {
+    "displayName": "Commander",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "commander_of_earth_kingdom_troops": {
+    "displayName": "Commander Of Earth Kingdom Troops",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "communicates_with_eyes": {
+    "displayName": "Communicates With Eyes",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "compassionate": {
+    "displayName": "Compassionate",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "composed": {
+    "displayName": "Composed",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "confidant_of_longshot": {
+    "displayName": "Confidant Of Longshot",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "confidant_of_smellerbee": {
+    "displayName": "Confidant Of Smellerbee",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "confident": {
+    "displayName": "Confident",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "conflicted": {
+    "displayName": "Conflicted",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "conflicted_initially": {
+    "displayName": "Conflicted Initially",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "confrontational": {
+    "displayName": "Confrontational",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "confronted_mothers_killer": {
+    "displayName": "Confronted Mothers Killer",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "confronted_ozai_in_prison": {
+    "displayName": "Confronted Ozai In Prison",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "confronted_zuko_in_ba_sing_se": {
+    "displayName": "Confronted Zuko In Ba Sing Se",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "conqueror": {
+    "displayName": "Conqueror",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cool_old_guy": {
+    "displayName": "Cool Old Guy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "corrupted_katara": {
+    "displayName": "Corrupted Katara",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "council": {
+    "displayName": "Council",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "council_chairman": {
+    "displayName": "Council Chairman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "council_elder": {
+    "displayName": "Council Elder",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "council_member": {
+    "displayName": "Council Member",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "council_of_elders": {
+    "displayName": "Council Of Elders",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "courageous": {
+    "displayName": "Courageous",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cranefish_town": {
+    "displayName": "Cranefish Town",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "creative": {
+    "displayName": "Creative",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cruel": {
+    "displayName": "Cruel",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "crush_on_aang": {
+    "displayName": "Crush On Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "crush_on_katara": {
+    "displayName": "Crush On Katara",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "crush_on_on_ji": {
+    "displayName": "Crush On On Ji",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "crush_on_sokka": {
+    "displayName": "Crush On Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cultural_minister": {
+    "displayName": "Cultural Minister",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cunning": {
+    "displayName": "Cunning",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "cynical": {
+    "displayName": "Cynical",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "d": {
+    "displayName": "D",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dai_li": {
+    "displayName": "Dai Li",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dai_li_style": {
+    "displayName": "Dai Li Style",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dance_partner": {
+    "displayName": "Dance Partner",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dance_party": {
+    "displayName": "Dance Party",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dark_mentor": {
+    "displayName": "Dark Mentor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dark_mirror": {
+    "displayName": "Dark Mirror",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "daughter_of_arnook": {
+    "displayName": "Daughter Of Arnook",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "daughter_of_ozai": {
+    "displayName": "Daughter Of Ozai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "daughter_of_ukano": {
+    "displayName": "Daughter Of Ukano",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "day_of_black_sun_invasion": {
+    "displayName": "Day Of Black Sun Invasion",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "deadpan_snarker": {
+    "displayName": "Deadpan Snarker",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "deceptive": {
+    "displayName": "Deceptive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "decisive_later": {
+    "displayName": "Decisive Later",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "defeat_of_ozai": {
+    "displayName": "Defeat Of Ozai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "defeated_azula": {
+    "displayName": "Defeated Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "defeated_by_aang": {
+    "displayName": "Defeated By Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "defeated_by_azula": {
+    "displayName": "Defeated By Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "defeated_by_zhao": {
+    "displayName": "Defeated By Zhao",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "defensive": {
+    "displayName": "Defensive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "defensive_firebending": {
+    "displayName": "Defensive Firebending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "demanding": {
+    "displayName": "Demanding",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "deposed_by_azula": {
+    "displayName": "Deposed By Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "descendant_of_roku": {
+    "displayName": "Descendant Of Roku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "deserter": {
+    "displayName": "Deserter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "determined": {
+    "displayName": "Determined",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "deuteragonist": {
+    "displayName": "Deuteragonist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "devoted": {
+    "displayName": "Devoted",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dictator": {
+    "displayName": "Dictator",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "died_at_lake_laogai": {
+    "displayName": "Died At Lake Laogai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "diplomat": {
+    "displayName": "Diplomat",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "disability_superpower": {
+    "displayName": "Disability Superpower",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "disciplined": {
+    "displayName": "Disciplined",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ditzy": {
+    "displayName": "Ditzy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "domineering": {
+    "displayName": "Domineering",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dragon_of_the_west": {
+    "displayName": "Dragon Of The West",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "drank_cactus_juice": {
+    "displayName": "Drank Cactus Juice",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dual_hook_swords": {
+    "displayName": "Dual Hook Swords",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dual_wielder": {
+    "displayName": "Dual Wielder",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "dutiful": {
+    "displayName": "Dutiful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "e": {
+    "displayName": "E",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "earth_kingdom": {
+    "displayName": "Earth Kingdom",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "earth_kingdom_fortress": {
+    "displayName": "Earth Kingdom Fortress",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "earth_rumble": {
+    "displayName": "Earth Rumble",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "earthbender": {
+    "displayName": "Earthbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "earthbending_with_face": {
+    "displayName": "Earthbending With Face",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "earthbending_with_hands": {
+    "displayName": "Earthbending With Hands",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "earthen_fire_refinery": {
+    "displayName": "Earthen Fire Refinery",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "eastern_air_temple": {
+    "displayName": "Eastern Air Temple",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "easygoing": {
+    "displayName": "Easygoing",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "eats_hay": {
+    "displayName": "Eats Hay",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "eccentric": {
+    "displayName": "Eccentric",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "eccentric_sage": {
+    "displayName": "Eccentric Sage",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "egomaniac": {
+    "displayName": "Egomaniac",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "elder": {
+    "displayName": "Elder",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "embittered": {
+    "displayName": "Embittered",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "embracing_identity": {
+    "displayName": "Embracing Identity",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "emotional": {
+    "displayName": "Emotional",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "empathetic": {
+    "displayName": "Empathetic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "enemy_of_aang": {
+    "displayName": "Enemy Of Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "enemy_of_azula": {
+    "displayName": "Enemy Of Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "enemy_of_team_avatar": {
+    "displayName": "Enemy Of Team Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "enemy_of_zuko": {
+    "displayName": "Enemy Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "energetic": {
+    "displayName": "Energetic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "energybending": {
+    "displayName": "Energybending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "entrepreneur": {
+    "displayName": "Entrepreneur",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "escaped_prison": {
+    "displayName": "Escaped Prison",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "estranged_wife_of_ukano": {
+    "displayName": "Estranged Wife Of Ukano",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "evil_counterpart": {
+    "displayName": "Evil Counterpart",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "f": {
+    "displayName": "F",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "face_bending": {
+    "displayName": "Face Bending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fall_of_ba_sing_se": {
+    "displayName": "Fall Of Ba Sing Se",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "family_loyalty": {
+    "displayName": "Family Loyalty",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_azula": {
+    "displayName": "Father Of Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_azulon": {
+    "displayName": "Father Of Azulon",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_houting": {
+    "displayName": "Father Of Houting",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_iroh": {
+    "displayName": "Father Of Iroh",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_katara": {
+    "displayName": "Father Of Katara",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_lau_ganlan": {
+    "displayName": "Father Of Lau Ganlan",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_lu_ten": {
+    "displayName": "Father Of Lu Ten",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_ozai": {
+    "displayName": "Father Of Ozai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_sokka": {
+    "displayName": "Father Of Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_toph": {
+    "displayName": "Father Of Toph",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_yue": {
+    "displayName": "Father Of Yue",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "father_of_zuko": {
+    "displayName": "Father Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "favoritism": {
+    "displayName": "Favoritism",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fearful": {
+    "displayName": "Fearful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "female": {
+    "displayName": "Female",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fighter": {
+    "displayName": "Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "figurehead": {
+    "displayName": "Figurehead",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "final_boss": {
+    "displayName": "Final Boss",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_lord": {
+    "displayName": "Fire Lord",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_nation": {
+    "displayName": "Fire Nation",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_nation_circus": {
+    "displayName": "Fire Nation Circus",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_nation_navy": {
+    "displayName": "Fire Nation Navy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_nation_nobility": {
+    "displayName": "Fire Nation Nobility",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_nation_prisoner": {
+    "displayName": "Fire Nation Prisoner",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_nation_royal_family": {
+    "displayName": "Fire Nation Royal Family",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_nation_royalty": {
+    "displayName": "Fire Nation Royalty",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fire_nation_school": {
+    "displayName": "Fire Nation School",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "firebender": {
+    "displayName": "Firebender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "firebending_master": {
+    "displayName": "Firebending Master",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "firebending_prodigy": {
+    "displayName": "Firebending Prodigy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "firebreath": {
+    "displayName": "Firebreath",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "first_deserter": {
+    "displayName": "First Deserter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "first_earth_king_to_leave_ba_sing_se": {
+    "displayName": "First Earth King To Leave Ba Sing Se",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "first_love_yue": {
+    "displayName": "First Love Yue",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "flight": {
+    "displayName": "Flight",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "florist": {
+    "displayName": "Florist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fog_of_lost_souls": {
+    "displayName": "Fog Of Lost Souls",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "foggy_swamp": {
+    "displayName": "Foggy Swamp",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "follower_of_jet": {
+    "displayName": "Follower Of Jet",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "foodloving": {
+    "displayName": "Foodloving",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "forgave_zuko": {
+    "displayName": "Forgave Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "forged_space_sword": {
+    "displayName": "Forged Space Sword",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fortuneteller": {
+    "displayName": "Fortuneteller",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "found_by_zuko": {
+    "displayName": "Found By Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "found_his_mother": {
+    "displayName": "Found His Mother",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "founder": {
+    "displayName": "Founder",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "freed_by_zuko": {
+    "displayName": "Freed By Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "freedom_fighter": {
+    "displayName": "Freedom Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "freedom_fighters": {
+    "displayName": "Freedom Fighters",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend": {
+    "displayName": "Friend",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_aang": {
+    "displayName": "Friend Of Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_azula_former": {
+    "displayName": "Friend Of Azula Former",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_gyatso": {
+    "displayName": "Friend Of Gyatso",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_kanna": {
+    "displayName": "Friend Of Kanna",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_katara": {
+    "displayName": "Friend Of Katara",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_mai": {
+    "displayName": "Friend Of Mai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_momo": {
+    "displayName": "Friend Of Momo",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_nini": {
+    "displayName": "Friend Of Nini",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_roku": {
+    "displayName": "Friend Of Roku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_smellerbee": {
+    "displayName": "Friend Of Smellerbee",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_sokka": {
+    "displayName": "Friend Of Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_susu": {
+    "displayName": "Friend Of Susu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_teo_and_the_duke": {
+    "displayName": "Friend Of Teo And The Duke",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_the_avatar": {
+    "displayName": "Friend Of The Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_the_duke": {
+    "displayName": "Friend Of The Duke",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friend_of_ty_lee": {
+    "displayName": "Friend Of Ty Lee",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "friendly": {
+    "displayName": "Friendly",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "from_entertainer_to_patriot": {
+    "displayName": "From Entertainer To Patriot",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "from_follower_to_coleader": {
+    "displayName": "From Follower To Coleader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "from_follower_to_friend": {
+    "displayName": "From Follower To Friend",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "from_outcast_to_leader": {
+    "displayName": "From Outcast To Leader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "from_unlucky_vendor_to_mogul": {
+    "displayName": "From Unlucky Vendor To Mogul",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "from_wild_to_royal_pet": {
+    "displayName": "From Wild To Royal Pet",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "frozen_in_iceberg": {
+    "displayName": "Frozen In Iceberg",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fruit_pie_attack": {
+    "displayName": "Fruit Pie Attack",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fruit_pie_attacks": {
+    "displayName": "Fruit Pie Attacks",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "fugitive": {
+    "displayName": "Fugitive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "g": {
+    "displayName": "G",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "gaoling": {
+    "displayName": "Gaoling",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "general": {
+    "displayName": "General",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "general_retired": {
+    "displayName": "General Retired",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "gentle": {
+    "displayName": "Gentle",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "gentle_giant": {
+    "displayName": "Gentle Giant",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "girl": {
+    "displayName": "Girl",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "girlfriend_of_hide_ambiguous": {
+    "displayName": "Girlfriend Of Hide Ambiguous",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "girlfriend_of_zuko": {
+    "displayName": "Girlfriend Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "glider": {
+    "displayName": "Glider",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "gloomy": {
+    "displayName": "Gloomy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "goofy": {
+    "displayName": "Goofy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "governors_daughter": {
+    "displayName": "Governors Daughter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "grampakku": {
+    "displayName": "Grampakku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "grand_lotus": {
+    "displayName": "Grand Lotus",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "grand_secretariat": {
+    "displayName": "Grand Secretariat",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "granddaughter_of_gonggong": {
+    "displayName": "Granddaughter Of Gonggong",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "granddaughter_of_roku": {
+    "displayName": "Granddaughter Of Roku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "grandfather_of_iroh": {
+    "displayName": "Grandfather Of Iroh",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "grandfather_of_zuko": {
+    "displayName": "Grandfather Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "grandmother": {
+    "displayName": "Grandmother",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "gray_eyes": {
+    "displayName": "Gray Eyes",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "greatgrandfather_of_zuko": {
+    "displayName": "Greatgrandfather Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "griefstricken": {
+    "displayName": "Griefstricken",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "grieving": {
+    "displayName": "Grieving",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "grows_the_beard": {
+    "displayName": "Grows The Beard",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "guardian_of_avatar": {
+    "displayName": "Guardian Of Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "guerrilla_fighter": {
+    "displayName": "Guerrilla Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "guide_to_team_avatar": {
+    "displayName": "Guide To Team Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "h": {
+    "displayName": "H",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "had_a_second_family": {
+    "displayName": "Had A Second Family",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "had_a_vision_of_roku": {
+    "displayName": "Had A Vision Of Roku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hakodas_forces": {
+    "displayName": "Hakodas Forces",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "handtohand_combat": {
+    "displayName": "Handtohand Combat",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "handtohand_combatant": {
+    "displayName": "Handtohand Combatant",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "harmony_restoration_movement": {
+    "displayName": "Harmony Restoration Movement",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "has_a_dragon": {
+    "displayName": "Has A Dragon",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "has_a_pet_bear": {
+    "displayName": "Has A Pet Bear",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "has_a_scar": {
+    "displayName": "Has A Scar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "has_a_shirshu": {
+    "displayName": "Has A Shirshu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "has_six_sisters": {
+    "displayName": "Has Six Sisters",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hates_being_called_a_monster": {
+    "displayName": "Hates Being Called A Monster",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hates_firebending": {
+    "displayName": "Hates Firebending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hates_orange": {
+    "displayName": "Hates Orange",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hates_shoes": {
+    "displayName": "Hates Shoes",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hates_snow": {
+    "displayName": "Hates Snow",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "haunted": {
+    "displayName": "Haunted",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "head_chieftain": {
+    "displayName": "Head Chieftain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "head_of_dai_li": {
+    "displayName": "Head Of Dai Li",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "headband": {
+    "displayName": "Headband",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "healer": {
+    "displayName": "Healer",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "heat_redirection": {
+    "displayName": "Heat Redirection",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "heelface_turn": {
+    "displayName": "Heelface Turn",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "helped_zuko": {
+    "displayName": "Helped Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "helper_of_appa": {
+    "displayName": "Helper Of Appa",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "herbalist": {
+    "displayName": "Herbalist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hero": {
+    "displayName": "Hero",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hidden_heart_of_gold": {
+    "displayName": "Hidden Heart Of Gold",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hiraa": {
+    "displayName": "Hiraa",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hired_by_zuko": {
+    "displayName": "Hired By Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "honorable": {
+    "displayName": "Honorable",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hook_swords": {
+    "displayName": "Hook Swords",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hope": {
+    "displayName": "Hope",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hopeful": {
+    "displayName": "Hopeful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "houting_dynasty": {
+    "displayName": "Houting Dynasty",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "humanitarian": {
+    "displayName": "Humanitarian",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "humble": {
+    "displayName": "Humble",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "humorous": {
+    "displayName": "Humorous",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hundred_year_war": {
+    "displayName": "Hundred Year War",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hunted_her_mother": {
+    "displayName": "Hunted Her Mother",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hunted_iroh": {
+    "displayName": "Hunted Iroh",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "hunted_the_avatar": {
+    "displayName": "Hunted The Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "husband": {
+    "displayName": "Husband",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "husband_of_kanna": {
+    "displayName": "Husband Of Kanna",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "husband_of_kya": {
+    "displayName": "Husband Of Kya",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "husband_of_poppy": {
+    "displayName": "Husband Of Poppy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "husband_of_ursa": {
+    "displayName": "Husband Of Ursa",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "i": {
+    "displayName": "I",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ice_bending": {
+    "displayName": "Ice Bending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "identity_amnesia": {
+    "displayName": "Identity Amnesia",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "immortalized_in_republic_city": {
+    "displayName": "Immortalized In Republic City",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "impulsive": {
+    "displayName": "Impulsive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "innocent": {
+    "displayName": "Innocent",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "insecure": {
+    "displayName": "Insecure",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "instigator_of_war": {
+    "displayName": "Instigator Of War",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "instructor": {
+    "displayName": "Instructor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "insurance_policies": {
+    "displayName": "Insurance Policies",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "interim_fire_lord": {
+    "displayName": "Interim Fire Lord",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "invasion_and_imprisonment": {
+    "displayName": "Invasion And Imprisonment",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "invasion_of_fire_nation": {
+    "displayName": "Invasion Of Fire Nation",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "invented_bloodbending": {
+    "displayName": "Invented Bloodbending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "invented_boba_tea": {
+    "displayName": "Invented Boba Tea",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "invented_metalbending": {
+    "displayName": "Invented Metalbending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "inventor": {
+    "displayName": "Inventor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "inventor_of_bloodbending": {
+    "displayName": "Inventor Of Bloodbending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "irohs_crush": {
+    "displayName": "Irohs Crush",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "jasmine_dragon": {
+    "displayName": "Jasmine Dragon",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "jennamite": {
+    "displayName": "Jennamite",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "jian": {
+    "displayName": "Jian",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "joined_kyoshi_warriors": {
+    "displayName": "Joined Kyoshi Warriors",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "joined_team_avatar": {
+    "displayName": "Joined Team Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "just_a_bear": {
+    "displayName": "Just A Bear",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "justice": {
+    "displayName": "Justice",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "k": {
+    "displayName": "K",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "kataras_necklace": {
+    "displayName": "Kataras Necklace",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "kemurikage_plot": {
+    "displayName": "Kemurikage Plot",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "kidnapped": {
+    "displayName": "Kidnapped",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "killed_by_long_feng": {
+    "displayName": "Killed By Long Feng",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "killed_by_the_narrative": {
+    "displayName": "Killed By The Narrative",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "killed_the_moon_spirit": {
+    "displayName": "Killed The Moon Spirit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "killer_of_jet": {
+    "displayName": "Killer Of Jet",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "kind": {
+    "displayName": "Kind",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "king": {
+    "displayName": "King",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "king_of_omashu": {
+    "displayName": "King Of Omashu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "knew_kataras_grandmother": {
+    "displayName": "Knew Kataras Grandmother",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "knew_sokkas_identity": {
+    "displayName": "Knew Sokkas Identity",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "knife_fighter": {
+    "displayName": "Knife Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "knifethrower": {
+    "displayName": "Knifethrower",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "kyoshi_island": {
+    "displayName": "Kyoshi Island",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "kyoshi_warriors": {
+    "displayName": "Kyoshi Warriors",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "kyoshi_warriors_ally": {
+    "displayName": "Kyoshi Warriors Ally",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "l": {
+    "displayName": "L",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lake_laogai": {
+    "displayName": "Lake Laogai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lake_laogai_conspiracy": {
+    "displayName": "Lake Laogai Conspiracy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lake_laogai_rescue": {
+    "displayName": "Lake Laogai Rescue",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "last_of_his_kind": {
+    "displayName": "Last Of His Kind",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "last_stand_at_southern_air_temple": {
+    "displayName": "Last Stand At Southern Air Temple",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "leader": {
+    "displayName": "Leader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "leader_of_freedom_fighters": {
+    "displayName": "Leader Of Freedom Fighters",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "leader_of_her_own_team": {
+    "displayName": "Leader Of Her Own Team",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "leader_of_team_avatar": {
+    "displayName": "Leader Of Team Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "leader_of_the_dai_li": {
+    "displayName": "Leader Of The Dai Li",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "legacy_of_courage": {
+    "displayName": "Legacy Of Courage",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "legendary": {
+    "displayName": "Legendary",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "legendary_archer": {
+    "displayName": "Legendary Archer",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "liberated_ba_sing_se": {
+    "displayName": "Liberated Ba Sing Se",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "liberated_omashu": {
+    "displayName": "Liberated Omashu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lie_detector": {
+    "displayName": "Lie Detector",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lightning": {
+    "displayName": "Lightning",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lightning_generation": {
+    "displayName": "Lightning Generation",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lightning_redirection": {
+    "displayName": "Lightning Redirection",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lightning_redirection_inventor": {
+    "displayName": "Lightning Redirection Inventor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lived_to_102": {
+    "displayName": "Lived To 102",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "longestreigning_fire_lord": {
+    "displayName": "Longestreigning Fire Lord",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "loss_of_home": {
+    "displayName": "Loss Of Home",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "loss_of_yue": {
+    "displayName": "Loss Of Yue",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lost_his_bending": {
+    "displayName": "Lost His Bending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "love_interest": {
+    "displayName": "Love Interest",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "love_interest_of_katara": {
+    "displayName": "Love Interest Of Katara",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "love_interest_of_sokka": {
+    "displayName": "Love Interest Of Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "loves_pai_sho": {
+    "displayName": "Loves Pai Sho",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "loves_tea": {
+    "displayName": "Loves Tea",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "loving": {
+    "displayName": "Loving",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "lower_ring": {
+    "displayName": "Lower Ring",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "loyal": {
+    "displayName": "Loyal",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "m": {
+    "displayName": "M",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mad_genius": {
+    "displayName": "Mad Genius",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "main_antagonist_book_1": {
+    "displayName": "Main Antagonist Book 1",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "makapu_village": {
+    "displayName": "Makapu Village",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "male": {
+    "displayName": "Male",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mama_bear": {
+    "displayName": "Mama Bear",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "manchild": {
+    "displayName": "Manchild",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "maniacal": {
+    "displayName": "Maniacal",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "manicured_claws": {
+    "displayName": "Manicured Claws",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "manipulated_by_long_feng": {
+    "displayName": "Manipulated By Long Feng",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "manipulative": {
+    "displayName": "Manipulative",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "manipulator_of_kuei": {
+    "displayName": "Manipulator Of Kuei",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "marble_trick": {
+    "displayName": "Marble Trick",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mark_of_the_wise": {
+    "displayName": "Mark Of The Wise",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "markswoman": {
+    "displayName": "Markswoman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_airbender": {
+    "displayName": "Master Airbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_bender": {
+    "displayName": "Master Bender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_earthbender": {
+    "displayName": "Master Earthbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_firebender": {
+    "displayName": "Master Firebender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_herbalist": {
+    "displayName": "Master Herbalist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_of_appa": {
+    "displayName": "Master Of Appa",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_swordsman": {
+    "displayName": "Master Swordsman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_tactician": {
+    "displayName": "Master Tactician",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "master_waterbender": {
+    "displayName": "Master Waterbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mastered_bloodbending": {
+    "displayName": "Mastered Bloodbending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mastering_the_elements": {
+    "displayName": "Mastering The Elements",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mastermind_of_invasion": {
+    "displayName": "Mastermind Of Invasion",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "maternal_wisdom": {
+    "displayName": "Maternal Wisdom",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "matriarch": {
+    "displayName": "Matriarch",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "meat_and_sarcasm_guy": {
+    "displayName": "Meat And Sarcasm Guy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mechanical": {
+    "displayName": "Mechanical",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "megalomaniacal": {
+    "displayName": "Megalomaniacal",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "melon_lord": {
+    "displayName": "Melon Lord",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "member_of_kyoshi_warriors": {
+    "displayName": "Member Of Kyoshi Warriors",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "member_of_white_lotus": {
+    "displayName": "Member Of White Lotus",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mental_breakdown": {
+    "displayName": "Mental Breakdown",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mentor": {
+    "displayName": "Mentor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mentor_to_aang": {
+    "displayName": "Mentor To Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mentor_to_korra": {
+    "displayName": "Mentor To Korra",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mentor_to_two_avatars": {
+    "displayName": "Mentor To Two Avatars",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mentored_zuko": {
+    "displayName": "Mentored Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mercenary": {
+    "displayName": "Mercenary",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "merchant": {
+    "displayName": "Merchant",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "metalbender_inventor": {
+    "displayName": "Metalbender Inventor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "metalbending_police_force": {
+    "displayName": "Metalbending Police Force",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "midwife": {
+    "displayName": "Midwife",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "military": {
+    "displayName": "Military",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "military_leader": {
+    "displayName": "Military Leader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "minor_antagonist": {
+    "displayName": "Minor Antagonist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "minor_character": {
+    "displayName": "Minor Character",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "misgendered": {
+    "displayName": "Misgendered",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "misnomer_name": {
+    "displayName": "Misnomer Name",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "monarch": {
+    "displayName": "Monarch",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "monk": {
+    "displayName": "Monk",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "monster_of_the_week": {
+    "displayName": "Monster Of The Week",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "moon_spirit": {
+    "displayName": "Moon Spirit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "moral_compass": {
+    "displayName": "Moral Compass",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "most_handsome_warrior_selfproclaimed": {
+    "displayName": "Most Handsome Warrior Selfproclaimed",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother": {
+    "displayName": "Mother",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_azula": {
+    "displayName": "Mother Of Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_faces": {
+    "displayName": "Mother Of Faces",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_katara_and_sokka": {
+    "displayName": "Mother Of Katara And Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_lin": {
+    "displayName": "Mother Of Lin",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_mai": {
+    "displayName": "Mother Of Mai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_suyin": {
+    "displayName": "Mother Of Suyin",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_tenzin": {
+    "displayName": "Mother Of Tenzin",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_tomtom": {
+    "displayName": "Mother Of Tomtom",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mother_of_zuko": {
+    "displayName": "Mother Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "multiple_joo_dees": {
+    "displayName": "Multiple Joo Dees",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mustache": {
+    "displayName": "Mustache",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "my_cabbages": {
+    "displayName": "My Cabbages",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "my_greatest_failure": {
+    "displayName": "My Greatest Failure",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "mystery_character": {
+    "displayName": "Mystery Character",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "n": {
+    "displayName": "N",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "naive": {
+    "displayName": "Naive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "name_means_moon": {
+    "displayName": "Name Means Moon",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "narcissistic": {
+    "displayName": "Narcissistic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "narrator_of_opening_sequence": {
+    "displayName": "Narrator Of Opening Sequence",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "naval_commander": {
+    "displayName": "Naval Commander",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "nephew_of_iroh": {
+    "displayName": "Nephew Of Iroh",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "never_shown_firebending_after_defeat": {
+    "displayName": "Never Shown Firebending After Defeat",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "new_ozai": {
+    "displayName": "New Ozai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "nobility": {
+    "displayName": "Nobility",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "noblewoman": {
+    "displayName": "Noblewoman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "nonbender": {
+    "displayName": "Nonbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "nonbender_master": {
+    "displayName": "Nonbender Master",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "nonbender_mortal": {
+    "displayName": "Nonbender Mortal",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "none": {
+    "displayName": "None",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "northern_style_waterbending": {
+    "displayName": "Northern Style Waterbending",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "northern_water_tribe": {
+    "displayName": "Northern Water Tribe",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "not_a_bender": {
+    "displayName": "Not A Bender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "nurturing": {
+    "displayName": "Nurturing",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "o": {
+    "displayName": "O",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "obsessive": {
+    "displayName": "Obsessive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "octopus_form": {
+    "displayName": "Octopus Form",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "old_master": {
+    "displayName": "Old Master",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "oldest_earthbender": {
+    "displayName": "Oldest Earthbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "omashu": {
+    "displayName": "Omashu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "one_of_seven_sisters": {
+    "displayName": "One Of Seven Sisters",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "oneepisode_wonder": {
+    "displayName": "Oneepisode Wonder",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "opportunistic": {
+    "displayName": "Opportunistic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "optimist": {
+    "displayName": "Optimist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "optimistic": {
+    "displayName": "Optimistic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "order_of_the_white_lotus": {
+    "displayName": "Order Of The White Lotus",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ordered_zukos_death": {
+    "displayName": "Ordered Zukos Death",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "original_antagonist": {
+    "displayName": "Original Antagonist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "originally_voiced_by_mako": {
+    "displayName": "Originally Voiced By Mako",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "outcast": {
+    "displayName": "Outcast",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "overcame_prejudice": {
+    "displayName": "Overcame Prejudice",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "overcame_sexism": {
+    "displayName": "Overcame Sexism",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "overthrew_long_feng": {
+    "displayName": "Overthrew Long Feng",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "overwhelming": {
+    "displayName": "Overwhelming",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "owner_of_bosco": {
+    "displayName": "Owner Of Bosco",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "owner_of_nyla": {
+    "displayName": "Owner Of Nyla",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "p": {
+    "displayName": "P",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "painted_lady": {
+    "displayName": "Painted Lady",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "paranoid": {
+    "displayName": "Paranoid",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "parent": {
+    "displayName": "Parent",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "parental_reconciliation": {
+    "displayName": "Parental Reconciliation",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "parents_are_politicians": {
+    "displayName": "Parents Are Politicians",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "partner_of_katara": {
+    "displayName": "Partner Of Katara",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "passionate_internally": {
+    "displayName": "Passionate Internally",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "past_avatar": {
+    "displayName": "Past Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "patient": {
+    "displayName": "Patient",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "peacemaker": {
+    "displayName": "Peacemaker",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "performer": {
+    "displayName": "Performer",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "perky": {
+    "displayName": "Perky",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "perpetual_smile": {
+    "displayName": "Perpetual Smile",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "persistent": {
+    "displayName": "Persistent",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "personal_growth": {
+    "displayName": "Personal Growth",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "pessimistic": {
+    "displayName": "Pessimistic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "pet_crococat": {
+    "displayName": "Pet Crococat",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "pet_of_earth_king_kuei": {
+    "displayName": "Pet Of Earth King Kuei",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "pet_owner": {
+    "displayName": "Pet Owner",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "philosopher": {
+    "displayName": "Philosopher",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "phoenix_king": {
+    "displayName": "Phoenix King",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "playful": {
+    "displayName": "Playful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "plot_device": {
+    "displayName": "Plot Device",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "plucky": {
+    "displayName": "Plucky",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "poisoned": {
+    "displayName": "Poisoned",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "poisoned_azulon": {
+    "displayName": "Poisoned Azulon",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "poisoner": {
+    "displayName": "Poisoner",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "possessive": {
+    "displayName": "Possessive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "posthumous_character": {
+    "displayName": "Posthumous Character",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "postwar": {
+    "displayName": "Postwar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "postwar_adjustment": {
+    "displayName": "Postwar Adjustment",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "postwar_reunion": {
+    "displayName": "Postwar Reunion",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "pragmatic": {
+    "displayName": "Pragmatic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "precision": {
+    "displayName": "Precision",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "predictable": {
+    "displayName": "Predictable",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "pregnant": {
+    "displayName": "Pregnant",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "pride_before_a_fall": {
+    "displayName": "Pride Before A Fall",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "prideful": {
+    "displayName": "Prideful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "prince": {
+    "displayName": "Prince",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "prince_former": {
+    "displayName": "Prince Former",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "princess": {
+    "displayName": "Princess",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "prison_breakout": {
+    "displayName": "Prison Breakout",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "prison_guard": {
+    "displayName": "Prison Guard",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "prison_rig": {
+    "displayName": "Prison Rig",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "prisoner_of_war": {
+    "displayName": "Prisoner Of War",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "prodigy": {
+    "displayName": "Prodigy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "professional": {
+    "displayName": "Professional",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "progress_and_peace": {
+    "displayName": "Progress And Peace",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "promoter": {
+    "displayName": "Promoter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "protagonist": {
+    "displayName": "Protagonist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "protective": {
+    "displayName": "Protective",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "protector_of_the_duke": {
+    "displayName": "Protector Of The Duke",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "protest_and_resistance": {
+    "displayName": "Protest And Resistance",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "protg_of_jet": {
+    "displayName": "Protg Of Jet",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "proud": {
+    "displayName": "Proud",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "provided_troops_for_invasion": {
+    "displayName": "Provided Troops For Invasion",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "puppet_king": {
+    "displayName": "Puppet King",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "puppetmaster": {
+    "displayName": "Puppetmaster",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "quicktempered": {
+    "displayName": "Quicktempered",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "quiet": {
+    "displayName": "Quiet",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "quiet_one": {
+    "displayName": "Quiet One",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "r": {
+    "displayName": "R",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ran_away_from_home": {
+    "displayName": "Ran Away From Home",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ran_away_to_join_the_circus": {
+    "displayName": "Ran Away To Join The Circus",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rangi": {
+    "displayName": "Rangi",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rarely_speaks": {
+    "displayName": "Rarely Speaks",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reads_auras": {
+    "displayName": "Reads Auras",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reasonable_authority_figure": {
+    "displayName": "Reasonable Authority Figure",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rebel": {
+    "displayName": "Rebel",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rebellious_rich_kid": {
+    "displayName": "Rebellious Rich Kid",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reconciled_with_family": {
+    "displayName": "Reconciled With Family",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "recurring_character": {
+    "displayName": "Recurring Character",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "recurring_gag": {
+    "displayName": "Recurring Gag",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "redemption": {
+    "displayName": "Redemption",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "redemption_arc": {
+    "displayName": "Redemption Arc",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "refers_to_self_in_third_person": {
+    "displayName": "Refers To Self In Third Person",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "refugee": {
+    "displayName": "Refugee",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "regained_memory": {
+    "displayName": "Regained Memory",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reigned_for_75_years": {
+    "displayName": "Reigned For 75 Years",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reignited_romance_with_mai": {
+    "displayName": "Reignited Romance With Mai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rekindled_romance_with_zuko": {
+    "displayName": "Rekindled Romance With Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reliable": {
+    "displayName": "Reliable",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reluctant_hero": {
+    "displayName": "Reluctant Hero",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reluctant_teacher": {
+    "displayName": "Reluctant Teacher",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reluctant_warrior": {
+    "displayName": "Reluctant Warrior",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "republic_city": {
+    "displayName": "Republic City",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "resilient": {
+    "displayName": "Resilient",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "resistance": {
+    "displayName": "Resistance",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "resistance_fighter": {
+    "displayName": "Resistance Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "resourceful": {
+    "displayName": "Resourceful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "responsible": {
+    "displayName": "Responsible",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "retired_bounty_hunter": {
+    "displayName": "Retired Bounty Hunter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reunited_with_kanna": {
+    "displayName": "Reunited With Kanna",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "reunited_with_sisters": {
+    "displayName": "Reunited With Sisters",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "revealed_true_self": {
+    "displayName": "Revealed True Self",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "revenge_arc": {
+    "displayName": "Revenge Arc",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "revived_the_avatar": {
+    "displayName": "Revived The Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rival_ally_of_toph": {
+    "displayName": "Rival Ally Of Toph",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rival_of_aang": {
+    "displayName": "Rival Of Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rival_of_sokka": {
+    "displayName": "Rival Of Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rival_of_the_boulder": {
+    "displayName": "Rival Of The Boulder",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rival_of_toph": {
+    "displayName": "Rival Of Toph",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "rival_of_zuko": {
+    "displayName": "Rival Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "romantic_interest": {
+    "displayName": "Romantic Interest",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "romantic_interest_of_zuko": {
+    "displayName": "Romantic Interest Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "royal_fire_academy": {
+    "displayName": "Royal Fire Academy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "royal_palace": {
+    "displayName": "Royal Palace",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "royal_pet": {
+    "displayName": "Royal Pet",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "royalty": {
+    "displayName": "Royalty",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ruthless": {
+    "displayName": "Ruthless",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "s": {
+    "displayName": "S",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sacrifice": {
+    "displayName": "Sacrifice",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sacrifice_for_family": {
+    "displayName": "Sacrifice For Family",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sacrificed_herself": {
+    "displayName": "Sacrificed Herself",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sacrificial_lion": {
+    "displayName": "Sacrificial Lion",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sad": {
+    "displayName": "Sad",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sadistic": {
+    "displayName": "Sadistic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sage": {
+    "displayName": "Sage",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sandbender": {
+    "displayName": "Sandbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sarcastic": {
+    "displayName": "Sarcastic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sassy": {
+    "displayName": "Sassy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "saved_by_moon_spirit": {
+    "displayName": "Saved By Moon Spirit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "school_bully": {
+    "displayName": "School Bully",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "schoolyard_rivalry": {
+    "displayName": "Schoolyard Rivalry",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "secondary_antagonist": {
+    "displayName": "Secondary Antagonist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "secret_dance_party": {
+    "displayName": "Secret Dance Party",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "secret_ruler": {
+    "displayName": "Secret Ruler",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "seeks_approval_from_headmaster": {
+    "displayName": "Seeks Approval From Headmaster",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "seismic_sense": {
+    "displayName": "Seismic Sense",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "serpents_pass": {
+    "displayName": "Serpents Pass",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "servant_of_dai_li": {
+    "displayName": "Servant Of Dai Li",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sexist_formerly": {
+    "displayName": "Sexist Formerly",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "shadowed_waterbender_in_opening": {
+    "displayName": "Shadowed Waterbender In Opening",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sheltered": {
+    "displayName": "Sheltered",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sheltered_aristocrat": {
+    "displayName": "Sheltered Aristocrat",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "shirshu_rider": {
+    "displayName": "Shirshu Rider",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "shu_jing": {
+    "displayName": "Shu Jing",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "shuriken": {
+    "displayName": "Shuriken",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "si_wong_desert": {
+    "displayName": "Si Wong Desert",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "siege_of_the_north": {
+    "displayName": "Siege Of The North",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sifu_hotman": {
+    "displayName": "Sifu Hotman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "silent": {
+    "displayName": "Silent",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sister_of_mura": {
+    "displayName": "Sister Of Mura",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sister_of_sokka": {
+    "displayName": "Sister Of Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sister_of_zuko": {
+    "displayName": "Sister Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "six_legs": {
+    "displayName": "Six Legs",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "skilled_at_shurikenjutsu": {
+    "displayName": "Skilled At Shurikenjutsu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sky_bison": {
+    "displayName": "Sky Bison",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "smitten": {
+    "displayName": "Smitten",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "smug_snake": {
+    "displayName": "Smug Snake",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sokkas_father": {
+    "displayName": "Sokkas Father",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sokkas_first_girlfriend": {
+    "displayName": "Sokkas First Girlfriend",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "son_of_azulon": {
+    "displayName": "Son Of Azulon",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "son_of_hakoda": {
+    "displayName": "Son Of Hakoda",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "son_of_kanna": {
+    "displayName": "Son Of Kanna",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "son_of_ozai": {
+    "displayName": "Son Of Ozai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "son_of_sozin": {
+    "displayName": "Son Of Sozin",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "son_of_tyro": {
+    "displayName": "Son Of Tyro",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "son_of_ursa": {
+    "displayName": "Son Of Ursa",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "southern_air_temple": {
+    "displayName": "Southern Air Temple",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "southern_reconstruction": {
+    "displayName": "Southern Reconstruction",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "southern_tribe_elder": {
+    "displayName": "Southern Tribe Elder",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "southern_water_tribe": {
+    "displayName": "Southern Water Tribe",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sozins_comet": {
+    "displayName": "Sozins Comet",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sozins_comet_is_named_for_him": {
+    "displayName": "Sozins Comet Is Named For Him",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "space_sword": {
+    "displayName": "Space Sword",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spirit": {
+    "displayName": "Spirit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spirit_advisor": {
+    "displayName": "Spirit Advisor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spirit_oasis": {
+    "displayName": "Spirit Oasis",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spirit_water": {
+    "displayName": "Spirit Water",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spirit_world": {
+    "displayName": "Spirit World",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spirit_world_resident": {
+    "displayName": "Spirit World Resident",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spiritual": {
+    "displayName": "Spiritual",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spiritual_guidance": {
+    "displayName": "Spiritual Guidance",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spiritual_guide": {
+    "displayName": "Spiritual Guide",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spiritual_leader": {
+    "displayName": "Spiritual Leader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "spiritual_vision": {
+    "displayName": "Spiritual Vision",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "stage_villain": {
+    "displayName": "Stage Villain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "started_the_hundred_year_war": {
+    "displayName": "Started The Hundred Year War",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "starter_villain": {
+    "displayName": "Starter Villain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "statue_in_republic_city": {
+    "displayName": "Statue In Republic City",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "statusseeker": {
+    "displayName": "Statusseeker",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "stepgrandfather_of_sokka": {
+    "displayName": "Stepgrandfather Of Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "stern_teacher": {
+    "displayName": "Stern Teacher",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "stiletto": {
+    "displayName": "Stiletto",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "stoic": {
+    "displayName": "Stoic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "strategic": {
+    "displayName": "Strategic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "strategist": {
+    "displayName": "Strategist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "strict": {
+    "displayName": "Strict",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "strong": {
+    "displayName": "Strong",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "strongarm": {
+    "displayName": "Strongarm",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "stubborn": {
+    "displayName": "Stubborn",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "student": {
+    "displayName": "Student",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "student_of_badgermoles": {
+    "displayName": "Student Of Badgermoles",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "student_of_hama": {
+    "displayName": "Student Of Hama",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "student_of_jeong_jeong": {
+    "displayName": "Student Of Jeong Jeong",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "student_of_pakku": {
+    "displayName": "Student Of Pakku",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "student_of_piandao": {
+    "displayName": "Student Of Piandao",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "student_of_toph": {
+    "displayName": "Student Of Toph",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "subordinate_to_azula": {
+    "displayName": "Subordinate To Azula",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "subplot": {
+    "displayName": "Subplot",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "supporting": {
+    "displayName": "Supporting",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "supporting_character": {
+    "displayName": "Supporting Character",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "supportive": {
+    "displayName": "Supportive",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "surrogate_parent": {
+    "displayName": "Surrogate Parent",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "survivor": {
+    "displayName": "Survivor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "sword_fighter": {
+    "displayName": "Sword Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "swordsman": {
+    "displayName": "Swordsman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "t": {
+    "displayName": "T",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tactician": {
+    "displayName": "Tactician",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tail_whip": {
+    "displayName": "Tail Whip",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "taught_the_avatar": {
+    "displayName": "Taught The Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "teacher": {
+    "displayName": "Teacher",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "teacher_of_aang": {
+    "displayName": "Teacher Of Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "teacher_of_katara": {
+    "displayName": "Teacher Of Katara",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "teacher_of_sokka": {
+    "displayName": "Teacher Of Sokka",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "teacher_of_zhao": {
+    "displayName": "Teacher Of Zhao",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "teacher_of_zuko": {
+    "displayName": "Teacher Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "teaches_chiblocking": {
+    "displayName": "Teaches Chiblocking",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "team_avatar": {
+    "displayName": "Team Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "team_mom": {
+    "displayName": "Team Mom",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "team_pet": {
+    "displayName": "Team Pet",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "team_tyro": {
+    "displayName": "Team Tyro",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "teamwork": {
+    "displayName": "Teamwork",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "technical": {
+    "displayName": "Technical",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "ten_tons": {
+    "displayName": "Ten Tons",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "terrible_balance": {
+    "displayName": "Terrible Balance",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "terrorized_village": {
+    "displayName": "Terrorized Village",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_atoner": {
+    "displayName": "The Atoner",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_avatar": {
+    "displayName": "The Avatar",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_avatar_state": {
+    "displayName": "The Avatar State",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_beach": {
+    "displayName": "The Beach",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_big_guy": {
+    "displayName": "The Big Guy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_blind_bandit": {
+    "displayName": "The Blind Bandit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_boy_in_the_iceberg": {
+    "displayName": "The Boy In The Iceberg",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_chessmaster": {
+    "displayName": "The Chessmaster",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_day_of_black_sun": {
+    "displayName": "The Day Of Black Sun",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_deserter": {
+    "displayName": "The Deserter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_ditz": {
+    "displayName": "The Ditz",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_dragon": {
+    "displayName": "The Dragon",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_emperor": {
+    "displayName": "The Emperor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_exile": {
+    "displayName": "The Exile",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_fortuneteller": {
+    "displayName": "The Fortuneteller",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_good_captain": {
+    "displayName": "The Good Captain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_good_king": {
+    "displayName": "The Good King",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_goth": {
+    "displayName": "The Goth",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_headband": {
+    "displayName": "The Headband",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_heart": {
+    "displayName": "The Heart",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_hermit": {
+    "displayName": "The Hermit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_lancer": {
+    "displayName": "The Lancer",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_leader": {
+    "displayName": "The Leader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_lost_lenore": {
+    "displayName": "The Lost Lenore",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_man_behind_the_man": {
+    "displayName": "The Man Behind The Man",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_promise": {
+    "displayName": "The Promise",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_rival": {
+    "displayName": "The Rival",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_smart_guy": {
+    "displayName": "The Smart Guy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_stoic": {
+    "displayName": "The Stoic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_strategist": {
+    "displayName": "The Strategist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_tyrant": {
+    "displayName": "The Tyrant",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_western_air_temple": {
+    "displayName": "The Western Air Temple",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "the_wise_old_man": {
+    "displayName": "The Wise Old Man",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "thoughtful": {
+    "displayName": "Thoughtful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tomboy": {
+    "displayName": "Tomboy",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tough": {
+    "displayName": "Tough",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tournament_fighter": {
+    "displayName": "Tournament Fighter",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "traditional": {
+    "displayName": "Traditional",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tragic_hero": {
+    "displayName": "Tragic Hero",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tragic_love_interest": {
+    "displayName": "Tragic Love Interest",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tragic_past": {
+    "displayName": "Tragic Past",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tragic_villain": {
+    "displayName": "Tragic Villain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "trained_two_avatars": {
+    "displayName": "Trained Two Avatars",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "traitor": {
+    "displayName": "Traitor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "traitor_amnestied": {
+    "displayName": "Traitor Amnestied",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "trapped_in_spirit_world": {
+    "displayName": "Trapped In Spirit World",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tribal_leader": {
+    "displayName": "Tribal Leader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tribal_leaders_family": {
+    "displayName": "Tribal Leaders Family",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "trusting": {
+    "displayName": "Trusting",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "tsungi_horn": {
+    "displayName": "Tsungi Horn",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "twinkle_toes": {
+    "displayName": "Twinkle Toes",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "u": {
+    "displayName": "U",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "uncaring": {
+    "displayName": "Uncaring",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "uncle_of_zuko": {
+    "displayName": "Uncle Of Zuko",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "unclear_death": {
+    "displayName": "Unclear Death",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "underdog": {
+    "displayName": "Underdog",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "underground": {
+    "displayName": "Underground",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "united_republic": {
+    "displayName": "United Republic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "unlucky": {
+    "displayName": "Unlucky",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "unrequited_love": {
+    "displayName": "Unrequited Love",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "unstable": {
+    "displayName": "Unstable",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "usurped_the_throne": {
+    "displayName": "Usurped The Throne",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "usurper": {
+    "displayName": "Usurper",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "v": {
+    "displayName": "V",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "vegetarian": {
+    "displayName": "Vegetarian",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "vengeful": {
+    "displayName": "Vengeful",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "vigilante": {
+    "displayName": "Vigilante",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "villain": {
+    "displayName": "Villain",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "villainous_breakdown": {
+    "displayName": "Villainous Breakdown",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "visionary": {
+    "displayName": "Visionary",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_andr_sogliuzzo": {
+    "displayName": "Voiced By Andr Sogliuzzo",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_clancy_brown": {
+    "displayName": "Voiced By Clancy Brown",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_dee_bradley_baker": {
+    "displayName": "Voiced By Dee Bradley Baker",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_jason_isaacs": {
+    "displayName": "Voiced By Jason Isaacs",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_jennifer_hale": {
+    "displayName": "Voiced By Jennifer Hale",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_keone_young": {
+    "displayName": "Voiced By Keone Young",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_mae_whitman": {
+    "displayName": "Voiced By Mae Whitman",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_mark_hamill": {
+    "displayName": "Voiced By Mark Hamill",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_phil_lamarr": {
+    "displayName": "Voiced By Phil Lamarr",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_robert_patrick": {
+    "displayName": "Voiced By Robert Patrick",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "voiced_by_tress_macneille": {
+    "displayName": "Voiced By Tress Macneille",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "vulnerable": {
+    "displayName": "Vulnerable",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "w": {
+    "displayName": "W",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wang_fire": {
+    "displayName": "Wang Fire",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "war_criminal": {
+    "displayName": "War Criminal",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "war_leader": {
+    "displayName": "War Leader",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "war_survivor": {
+    "displayName": "War Survivor",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "warmonger": {
+    "displayName": "Warmonger",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "warrior": {
+    "displayName": "Warrior",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "warrior_training": {
+    "displayName": "Warrior Training",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "was_never_a_player": {
+    "displayName": "Was Never A Player",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "water_tribe": {
+    "displayName": "Water Tribe",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "water_whip": {
+    "displayName": "Water Whip",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "waterbender": {
+    "displayName": "Waterbender",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "waterbender_spirit": {
+    "displayName": "Waterbender Spirit",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wears_a_queue": {
+    "displayName": "Wears A Queue",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wellintentioned_extremist": {
+    "displayName": "Wellintentioned Extremist",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wen_bakery": {
+    "displayName": "Wen Bakery",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "whip_master": {
+    "displayName": "Whip Master",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "white_hair": {
+    "displayName": "White Hair",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "white_lotus": {
+    "displayName": "White Lotus",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wife_of_aang": {
+    "displayName": "Wife Of Aang",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wife_of_hakoda": {
+    "displayName": "Wife Of Hakoda",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wife_of_noren": {
+    "displayName": "Wife Of Noren",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wife_of_ozai": {
+    "displayName": "Wife Of Ozai",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "winter_solstice": {
+    "displayName": "Winter Solstice",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wiped_out_the_air_nomads": {
+    "displayName": "Wiped Out The Air Nomads",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wise": {
+    "displayName": "Wise",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wolf_cove": {
+    "displayName": "Wolf Cove",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wooden_club": {
+    "displayName": "Wooden Club",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wore_mothers_necklace": {
+    "displayName": "Wore Mothers Necklace",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "workaholic": {
+    "displayName": "Workaholic",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "works_for_iroh": {
+    "displayName": "Works For Iroh",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "world_travels": {
+    "displayName": "World Travels",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "wrestler": {
+    "displayName": "Wrestler",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "y": {
+    "displayName": "Y",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "yip_yip": {
+    "displayName": "Yip Yip",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "yu_dao": {
+    "displayName": "Yu Dao",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "zukos_date": {
+    "displayName": "Zukos Date",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "zuzu": {
+    "displayName": "Zuzu",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  },
+  "zuzus_sister": {
+    "displayName": "Zuzus Sister",
+    "category": "general",
+    "aliases": [],
+    "weight": 50,
+    "description": ""
+  }
+}
\ No newline at end of file
diff --git a/src/hooks/useSearch.ts b/src/hooks/useSearch.ts
index 6d891fcf09f9d6fd3a663a1a8c65e94bbc07274c..9034fb23b1d3338fc25b9e9b502652e62e639873 100644
--- a/src/hooks/useSearch.ts
+++ b/src/hooks/useSearch.ts
@@ -6,50 +6,51 @@ interface MatchedField {
   field: string;
   token: string;
 }
 
 export function useSearch(
   allEntities: EnrichedEntity[],
   query: string,
 ): Array<{ entity: EnrichedEntity; matchedFields: MatchedField[] }> {
   // Build a map for quick lookup by id
   const entityMapById = useMemo(() => {
     const map = new Map<string, EnrichedEntity>();
     allEntities.forEach((entity) => map.set(entity.id, entity));
     return map;
   }, [allEntities]);
 
   // 1. Create a memoized FlexSearch index.
   const index = useMemo(() => {
     const newIndex = new FlexSearch.Document<EnrichedEntity>({
       document: {
         id: 'id',
         index: [
           'name',
           'nation',
           'role',
           'tags',
+          'searchAliases',
           'bendingElement',
         ],
       },
       tokenize: 'forward',
     });
     allEntities.forEach((entity) => {
       newIndex.add({ ...entity });
     });
     return newIndex;
   }, [allEntities]);
 
   // 2. Perform the search and process the results.
   return useMemo(() => {
     if (!query) {
       return allEntities.map((entity) => ({ entity, matchedFields: [] }));
     }
     const searchResults = index.search(query, { enrich: true }) as Array<{ field: string; result: string[] }>;
     const resultMap = new Map<string, { entity: EnrichedEntity; matchedFields: MatchedField[] }>();
     searchResults.forEach((fieldResult) => {
       const fieldName = fieldResult.field;
       fieldResult.result.forEach((id: string) => {
         const record = entityMapById.get(id);
         if (!record) return;
         if (!resultMap.has(id)) {
           resultMap.set(id, {
@@ -74,62 +75,62 @@ export function useSearch(
             resultMap.set(entity.id, {
               entity,
               matchedFields: [{ field: 'partialTag', token: query }],
             });
           } else {
             // If already present, add partialTag to matchedFields if not already present
             const existing = resultMap.get(entity.id)!;
             if (!existing.matchedFields.some(mf => mf.field === 'partialTag' && mf.token === query)) {
               existing.matchedFields.push({ field: 'partialTag', token: query });
             }
           }
         }
       });
     }
     // --- End partial tag matching ---
 
     // --- Broad tag match boosting and result sorting ---
     // Score: 5 = name match
     //        4 = exact tag match
     //        3 = gender+age/role match for gendered queries
     //        2 = main cast/primary role
     //        1 = partial tag match
     //        0 = other
     function getMatchPriority(matchedFields: MatchedField[]): number {
       if (matchedFields.some(f => f.field === 'name')) return 5;
-      if (matchedFields.some(f => f.field === 'tags')) return 4;
+      if (matchedFields.some(f => f.field === 'tags' || f.field === 'searchAliases')) return 4;
       if (matchedFields.some(f => f.field === 'gender' || f.field === 'role')) return 3;
       if (matchedFields.some(f => f.field === 'main')) return 2;
       if (matchedFields.some(f => f.field === 'partialTag')) return 1;
       return 0;
     }
 
     function getTagMatchScore(entity: EnrichedEntity): number {
-      if (!entity.tags || !Array.isArray(entity.tags)) return 0;
-      const lowerTags = entity.tags.map(t => t.toLowerCase());
-      // 1. Exact tag match
-      if (lowerTags.includes(lowerQuery)) return 4;
+      const lowerTags = (entity.tags || []).map(t => t.toLowerCase());
+      const lowerAliases = (entity.searchAliases || []).map(a => a.toLowerCase());
+      // 1. Exact tag or alias match
+      if (lowerTags.includes(lowerQuery) || lowerAliases.includes(lowerQuery)) return 4;
 
       // 2. Gender+age/role match for gendered queries
       const genderedQueries = ['boy', 'girl', 'male', 'female'];
       if (genderedQueries.includes(lowerQuery)) {
         // Gender field match
         const gender = (entity.gender || '').toLowerCase();
         // Age/role: look for 'child', 'teen', 'kid', 'boy', 'girl' in tags or role
         const role = (entity.role || '').toLowerCase();
         const ageTags = ['child', 'teen', 'kid', 'boy', 'girl'];
         const hasAgeTag = lowerTags.some(tag => ageTags.includes(tag)) || ageTags.some(age => role.includes(age));
         if (
           (lowerQuery === 'boy' && gender === 'male' && hasAgeTag) ||
           (lowerQuery === 'girl' && gender === 'female' && hasAgeTag) ||
           (lowerQuery === 'male' && gender === 'male') ||
           (lowerQuery === 'female' && gender === 'female')
         ) {
           return 3;
         }
         // --- Exception: For 'male' and 'female', do NOT allow partial tag matches ---
         // Only exact matches for these queries
         return 0;
       }
 
       // 3. Main cast/primary role boost
       // Look for tags like 'protagonist', 'main', 'main_cast', 'lead', etc.
diff --git a/src/search/types.ts b/src/search/types.ts
index bba3dcac7c4c9f9f5c417c08f95e684f7b079260..41070b9ca46cbac5f2f98eecdf380d1514ff81e3 100644
--- a/src/search/types.ts
+++ b/src/search/types.ts
@@ -1,41 +1,42 @@
 // src/search/types.ts
 
 export interface EnrichedEntity {
   id: string;
   name: string;
   summary: string;
   metadata: Record<string, string | string[]>;
   tags?: string[];
   type: string;
   // Added fields for search compatibility
   role?: string;
   nation?: string;
   gender?: string;
   titles?: string[];
   searchableKeywords?: string[];
   fuzzySynonyms?: string[];
   affiliation?: string[];
+  searchAliases?: string[];
   tagCategories?: Record<string, string[]>;
 }
 
 export interface IndexedEntity {
   id: string;
   original: EnrichedEntity;
   searchBlob: string;
   fieldMap: Map<string, string[]>;
 }
 
 export interface SearchToken {
   type: 'global' | 'structured';
   key?: string;
   value: string;
 }
 
 export interface MatchResult {
   entityId: string;
   score: number;
   matchedFields: {
     field: string;
     token: string;
   }[];
 } 
\ No newline at end of file
 
EOF
)