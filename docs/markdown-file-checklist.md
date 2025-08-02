# Markdown File Requirements Checklist

*Essential requirements for all markdown files to work with the data pipeline*

**Last Updated:** 2025-01-XX  
**Pipeline Version:** Type-agnostic v1.0

---

## 🚨 CRITICAL REQUIREMENTS

### 1. YAML Frontmatter (Required)
Every markdown file MUST have YAML frontmatter with these fields:

```yaml
---
type: [entity_type]
---
```

**Required Fields:**
- `type`: Entity type (character, episode, food, fauna, group, location)

**Common Issues:**
- ❌ Missing `type` field (parser will skip the file)
- ❌ Invalid `type` format (must match supported entity types)

---

### 2. Card View Section (Required)
Every file MUST have a card view section with this exact format:

```markdown
## 🖼️ UI - CARD VIEW
*(Presentation Layer 1 - Unchanged)*

```md
- Name: [Entity Name]
- [Other Key-Value Pairs]
```
```

**Required Format:**
- Must start with `## 🖼️ UI - CARD VIEW`
- Must include `*(Presentation Layer 1 - Unchanged)*` comment
- Content MUST be wrapped in ```md code blocks
- Must contain key-value pairs in format `- Key: Value`
- At minimum, should have a name/title field

**Common Issues:**
- ❌ Missing ```md code block wrappers
- ❌ Using markdown formatting instead of key-value pairs
- ❌ Missing card view section entirely
- ❌ Missing presentation layer comment

---

### 3. Expanded View Section (Required)
Every file MUST have an expanded view section:

```markdown
## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

[Detailed markdown content for expanded view]
```
```

**Required Format:**
- Must start with `## 📖 UI - EXPANDED VIEW`
- Must include `*(Presentation Layer 2 - Unchanged)*` comment
- Content MUST be wrapped in ```md code blocks
- Should contain detailed information about the entity
- Should start with `### 📖 Overview` subsection

**⚠️ IMPORTANT: Avoid Duplicate Titles**
- Do NOT include the entity title as a markdown heading (`# Title`) in the expanded view
- The title is already displayed from the card view data
- Start with content directly (e.g., `### 📖 Overview` or `**Character Details:**`)
- This prevents duplicate titles from appearing in the UI

**⚠️ IMPORTANT: Flexible Header Parsing (January 2025 Update)**
- Headers with emojis are now supported (e.g., `## 📖 UI - EXPANDED VIEW`)
- Parser uses flexible regex pattern that handles emoji presence
- All header variations are parsed correctly

---

### 4. Backend Metadata Section (Required)
Every file MUST have a backend metadata section with JSON blocks:

```markdown
## ⚙️ BACKEND METADATA
*The invisible, hyper-structured engine. **Never rendered directly to the user.***

```json
{
  "type": "entity_type",
  "id": "unique_identifier",
  "name": "Entity Name",
  "description": "Entity description",
  "tags": ["tag1", "tag2"]
}
```
```

**Required Format:**
- Must start with `## ⚙️ BACKEND METADATA`
- Must include description comment about invisible engine
- Must be wrapped in ```json code blocks
- Must be valid JSON
- Should include entity-specific metadata fields

---

### 5. Semantic Index Section (Required)
Every file MUST have a semantic index section:

```markdown
## 🧱 Semantic & Thematic Index
*(The true heart of the filtering engine)*

```json
{
  "archetype": "The Hero | The Rebel | The Mentor | The Trickster | The Ruler | The Innocent",
  "thematicKeywords": ["keyword1", "keyword2"],
  "tagCategories": {
    "narrativeTags": ["tag1", "tag2"],
    "combatTags": ["tag1", "tag2"],
    "relationshipTags": ["tag1", "tag2"],
    "emotionTags": ["tag1", "tag2"],
    "politicalTags": ["tag1", "tag2"],
    "arcTags": ["tag1", "tag2"],
    "worldTags": ["tag1", "tag2"],
    "triviaTags": ["tag1", "tag2"]
  }
}
```
```

**Required Format:**
- Must start with `## 🧱 Semantic & Thematic Index`
- Must include description comment about filtering engine
- Must be wrapped in ```json code blocks
- Must include archetype and thematicKeywords fields
- Must include tagCategories object with all required categories

---

## 📋 ENTITY-SPECIFIC REQUIREMENTS

### Characters
```yaml
---
type: character
---
```

**Card View Required Fields:**
- Name: [Character Name]
- Nation: [Air/Earth/Fire/Water/Other]
- Role: [Character role description]
- Short Description: [Brief description]

**JSON Block Required Fields:**
- `type: "character"`
- `id: "character-slug"`
- `name: "Character Name"`
- `nation: "Air/Earth/Fire/Water/Other"`
- `description: "Character description"`

### Episodes
```yaml
---
type: episode
---
```

**Card View Required Fields:**
- Title: [Episode Title]
- Book/Season: [Water/Earth/Fire]
- Episode #: [1x01 format]
- Short Description: [Brief description]
- Badge: [Episode badge]

**JSON Block Required Fields:**
- `type: "episode"`
- `id: "episode-slug"`
- `title: "S1Ex - Episode Title"` (must use S1Ex prefix, e.g., S1E1 - The Boy in the Iceberg)
- `book: "Water/Earth/Fire"`
- `episode: [number]`
- `image: "episode-image-filename.jpg"` (REQUIRED - must match actual image file)

**⚠️ CRITICAL: Episode Image Field**
- **Required:** All episode files MUST include an `image` field in JSON metadata
- **Filename Match:** Image filename must exactly match a file in `public/assets/images/`
- **Common Issue:** Episodes missing image fields show placeholder text instead of images
- **Example:** `"image": "winter-solstice,-part-1-the-spirit-world.jpg"`
- **Validation:** Parser checks for image field presence in episode metadata

**⚠️ CRITICAL: S1Ex Title Prefix**
- All episode titles in JSON metadata must use the `S1Ex -` prefix (e.g., `S1E2 - The Avatar Returns`)
- This is enforced by the parser and required for UI consistency

**⚠️ CRITICAL: Flexible Header Parsing (January 2025 Update)**
- Episode expanded view headers with emojis are now supported
- Headers like `## 📖 UI - EXPANDED VIEW` parse correctly
- Parser uses flexible regex pattern for all header variations

### Foods
```yaml
---
type: food
---
```

**Card View Required Fields:**
- Name: [Food Name]
- Nation: [Air/Earth/Fire/Water/Other]
- Short Description: [Brief description]

**JSON Block Required Fields:**
- `type: "food"`
- `id: "food-slug"`
- `name: "Food Name"`
- `nation: "Air/Earth/Fire/Water/Other"`
- `description: "Food description"`

### Fauna
```yaml
---
type: fauna
---
```

**Card View Required Fields:**
- Name: [Fauna Name]
- Type: [Animal/Hybrid/Spirit]
- Short Description: [Brief description]

**JSON Block Required Fields:**
- `type: "fauna"`
- `id: "fauna-slug"`
- `name: "Fauna Name"`
- `type: "Animal/Hybrid/Spirit"`
- `description: "Fauna description"`

### Groups
```yaml
---
type: group
---
```

**Card View Required Fields:**
- Name: [Group Name]
- Type: [Organization/Military/Other]
- Short Description: [Brief description]

**JSON Block Required Fields:**
- `type: "group"`
- `id: "group-slug"`
- `name: "Group Name"`
- `type: "Organization/Military/Other"`
- `description: "Group description"`

### Locations
```yaml
---
type: location
---
```

**Card View Required Fields:**
- Name: [Location Name]
- Nation: [Air/Earth/Fire/Water/Other]
- Short Description: [Brief description]

**JSON Block Required Fields:**
- `type: "location"`
- `id: "location-slug"`
- `name: "Location Name"`
- `nation: "Air/Earth/Fire/Water/Other"`
- `description: "Location description"`

---

## 🔍 VALIDATION CHECKLIST

Before creating any new markdown file, verify:

### File Structure
- [ ] YAML frontmatter with `type` field
- [ ] Card view section with ```md code blocks and presentation layer comment
- [ ] Expanded view section with ```md code blocks and presentation layer comment
- [ ] Backend metadata section with ```json code blocks and description comment
- [ ] Semantic index section with ```json code blocks and description comment

### Content Requirements
- [ ] Valid YAML syntax in frontmatter
- [ ] Valid JSON syntax in metadata blocks
- [ ] Key-value pairs in card view (not markdown formatting)
- [ ] Entity-specific required fields present
- [ ] No duplicate titles in expanded view (avoid `# Title` headings)
- [ ] Episode files include `image` field in JSON metadata (CRITICAL)
- [ ] Episode image filenames match actual files in `public/assets/images/`
- [ ] Episode titles use `S1Ex -` prefix in JSON metadata (CRITICAL)
- [ ] Episode expanded view headers parse correctly (emoji support available)
- [ ] All sections include required comments and descriptions

### Pipeline Compatibility
- [ ] `type` field matches expected entity types
- [ ] Card view contains required fields for entity type
- [ ] JSON blocks contain required metadata fields
- [ ] Semantic index contains all required tag categories

---

## 🚫 COMMON FAILURES

### Parser Will Skip File If:
- Missing `type` field in YAML frontmatter
- Invalid YAML syntax in frontmatter
- No JSON blocks found in file
- Invalid JSON syntax in metadata blocks

### Parser Will Process But May Have Issues If:
- Card view not wrapped in ```md code blocks
- Card view contains markdown instead of key-value pairs
- Missing required fields for entity type
- Inconsistent field names between card view and JSON blocks
- Duplicate titles in expanded view (causes UI display issues)
- Episode files missing `image` field (shows placeholder text instead of images)
- Episode titles missing `S1Ex -` prefix (causes UI inconsistency)
- **NEW EPISODE CREATION:** Episode file created but not appearing in UI (timing issue)
- **NEW HEADER PARSING:** Episode expanded view headers with emojis not parsing (resolved January 2025)
- **MISSING SECTIONS:** Backend metadata or semantic index sections missing
- **MISSING COMMENTS:** Presentation layer comments or description comments missing

---

## 🛠️ DEBUGGING & PREVENTION (2025 January Update)

### Template Standardization (January 2025 Update)
**Status:** ✅ COMPLETED - All templates now follow consistent format
**Standardized Elements:**
- **Frontmatter:** `type: [category]` (removed extra fields)
- **Title Format:** `# [Emoji] ULTIMATE [CATEGORY] METADATA SCHEMA (v[version])`
- **Philosophy Statement:** Consistent placement and style
- **UI Card View:** `## 🖼️ UI - CARD VIEW` with `*(Presentation Layer 1 - Unchanged)*`
- **UI Expanded View:** `## 📖 UI - EXPANDED VIEW` with `*(Presentation Layer 2 - Unchanged)*`
- **Backend Metadata:** `## ⚙️ BACKEND METADATA` with consistent description
- **JSON Structure:** Multiple categorized blocks instead of single blocks
- **Semantic Index:** Consistent `## 🧱 Semantic & Thematic Index` section
- **Comments:** All sections include required comments and descriptions

### Episode Creation Workflow
1. **Create Episode File:** Use exact template structure from `raw-data/episodes/templates/episode_template.md`
2. **Include Image Field:** Always add `"image": "episode-filename.jpg"` to JSON metadata (CRITICAL)
3. **Use S1Ex Title Prefix:** Always use `"title": "S1Ex - Episode Title"` in JSON metadata (CRITICAL)
4. **Rebuild Data Pipeline:** Run `npm run build:data` to process new episode
5. **Restart Development Server:** Run `npm run dev` to pick up new data
6. **Verify Episode Appears:** Check UI for new episode card

### Common Episode Creation Issues

#### Episode Not Appearing in UI After Creation
**Problem:** Episode file created correctly but doesn't appear in UI
**Root Cause:** Data pipeline processing timing - episode file may not be included in initial processing run
**Solution:** 
1. Rebuild data pipeline: `npm run build:data`
2. Restart development server: `npm run dev`
3. Verify episode is in enriched data
**Prevention:** Always rebuild data pipeline after creating new episode files

#### Episode Missing Image Field
**Problem:** Episode shows placeholder text instead of image
**Root Cause:** Missing `image` field in episode JSON metadata
**Solution:** Add `"image": "exact-filename.jpg"` to episode JSON metadata
**Example:**
```json
{
  "type": "episode",
  "id": "episode-slug",
  "title": "S1Ex - Episode Title",
  "image": "episode-filename.jpg"
}
```

#### Episode Title Duplication
**Problem:** Episode title appears twice in UI
**Root Cause:** Expanded view content includes episode title heading
**Solution:** Ensure expanded view starts with content, not title heading
**Correct Format:**
```markdown
## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview
- **Series:** Avatar: The Last Airbender
- **Book:** Water
```
```

#### Episode Header Parsing Issues (RESOLVED - January 2025)
**Problem:** Episode expanded view headers with emojis not parsing correctly
**Root Cause:** Parser regex pattern was too strict for emoji-containing headers
**Solution:** Updated parser regex to be more flexible
**Status:** ✅ RESOLVED - All episode headers now parse correctly regardless of emoji presence
**Prevention:** All header variations are now supported by the flexible regex pattern

### Episode Validation Checklist
- [ ] Episode file uses exact template structure
- [ ] YAML frontmatter includes `type: episode`
- [ ] JSON metadata includes `image` field with exact filename
- [ ] Card view section contains all required fields
- [ ] Expanded view starts with content, not title heading
- [ ] Data pipeline rebuilt after creation
- [ ] Development server restarted
- [ ] Episode appears in UI with correct image and S1Ex title
- [ ] Episode expanded view headers parse correctly (emoji support available)

### Episode Template Requirements
```markdown
---
type: episode
---

# 🎬 ULTIMATE EPISODE METADATA SCHEMA (v1.0)

*Standardized for Avatar Encyclopedia, Maxi-Minimalist UX Engine*

**PHILOSOPHY:** Episodes mark the beats of the story. Detailed metadata captures narrative arcs, character focus, and thematic resonance.

---

## 🖼️ UI - CARD VIEW
*(Presentation Layer 1 - Unchanged)*

```md
- Title: S1Ex - Episode Title
- Book/Season: Water/Earth/Fire
- Episode #: 1x01 format
- Short Description: Brief description
- Badge: Episode badge
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

[Detailed episode summary and plot overview]

### ✨ Key Moments

[Pivotal scenes and important narrative beats]

### 🎭 Characters Focus

[Main characters featured and their roles in this episode]

### 🌟 Themes

[Thematic elements and narrative significance]
```

---

## ⚙️ BACKEND METADATA
*The invisible, hyper-structured engine. **Never rendered directly to the user.***

```json
{
  "type": "episode",
  "id": "episode-slug",
  "title": "S1Ex - Episode Title",
  "image": "episode-filename.jpg",
  "series": "Avatar The Last Airbender",
  "book": "Water/Earth/Fire",
  "episode": "number",
  "air_date": "YYYY-MM-DD",
  "writers": ["Author Name"],
  "directors": ["Director Name"],
  "guest_stars": ["Guest Star Name"],
  "production_number": "string",
  "next_episode": "next-episode-slug",
  "characters": ["character-slug"],
  "locations": ["location-slug"],
  "tags": ["tag1", "tag2"],
  "badge": "Episode Badge",
  "description": "Episode description",
  "synopsis": "Episode synopsis"
}
```

---

## 🧱 Semantic & Thematic Index
*(The true heart of the filtering engine)*

```json
{
  "archetype": "The Hero | The Rebel | The Mentor | The Trickster | The Ruler | The Innocent",
  "thematicKeywords": ["keyword1", "keyword2"],
  "tagCategories": {
    "narrativeTags": ["tag1", "tag2"],
    "combatTags": ["tag1", "tag2"],
    "relationshipTags": ["tag1", "tag2"],
    "emotionTags": ["tag1", "tag2"],
    "politicalTags": ["tag1", "tag2"],
    "arcTags": ["tag1", "tag2"],
    "worldTags": ["tag1", "tag2"],
    "triviaTags": ["tag1", "tag2"]
  }
}
```
```

### Type-Agnostic Script Architecture (January 2025 Update)

#### Canonical Structure Enforcement
- **Purpose:** All entity types must use identical markdown structure for UI blocks
- **Requirement:** No special-case parsing logic for any entity type
- **Validation:** Parser uses unified logic for all types
- **Prevention:** Any deviation from canonical structure is a build-breaking error

#### Unified Processing Pipeline
- **Character Processing:** Uses same logic as episodes, foods, locations, etc.
- **Episode Processing:** Uses same logic as characters, foods, locations, etc.
- **Food Processing:** Uses same logic as characters, episodes, locations, etc.
- **Location Processing:** Uses same logic as characters, episodes, foods, etc.
- **Group Processing:** Uses same logic as all other entity types
- **Fauna Processing:** Uses same logic as all other entity types

#### Prevention Guidelines
- **No Special Cases:** Never introduce type-specific logic in any script
- **Unified Logic:** Use the same extraction and processing logic for all entity types
- **Canonical Structure:** All types must follow the exact same markdown structure
- **Validation:** Any deviation from type-agnostic processing is a build-breaking error

---

*This checklist ensures all markdown files work correctly with the type-agnostic data pipeline.* 