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
- Title:
- Book/Season:
- Episode #: (e.g., 1x01)
- Short Description:
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Synopsis

...

### ✨ Key Moments

...

### 🎭 Characters Focus

...

### 🌟 Themes

...
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 📅 Episode Details

```json
{
  "id": "string (slug format)",
  "name": "string",
  "slug": "string",
  "type": "episode",
  "book": "string",
  "episodeNumber": "string",
  "title": "string",
  "airDate": "string",
  "director": "string",
  "writer": "string",
  "runningTime": "string",
  "chronologicalOrder": "number",
  "previousEpisode": "string | null",
  "nextEpisode": "string | null",
  "description": "string",
  "synopsis": "string",
  "image": "string | null",
  "tags": "string[]",
  "searchAliases": "string[]"
}
```

---

## 📚 Narrative & Canonical Context

```json
{
  "plotPoints": "string[]",
  "featuredCharacters": "string[]",
  "locationsVisited": "string[]",
  "notableQuotes": "string[]",
  "themes": "string[]",
  "keyMoments": "string[]",
  "characterFocus": "string[]",
  "bendingTechniques": "string[]",
  "culturalElements": "string[]",
  "expandedView": "string"
}
``` 