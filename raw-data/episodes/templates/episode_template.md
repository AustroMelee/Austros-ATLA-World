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
- Badge: [Episode metadata badge]
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Updated)*

```md
### 📖 Synopsis

[Detailed episode summary and plot overview]

### ✨ Key Moments

[Pivotal scenes and important narrative beats]

### 🎭 Characters Focus

[Main characters featured and their roles in this episode]

### 🌟 Themes

[Thematic elements and messages explored]

### 📍 Locations Visited

[Places featured or visited during the episode]

### 💬 Notable Quotes

[Memorable dialogue and significant lines]

### 🎬 Plot Points

[Major story developments and plot progression]

### 🔥 Bending Techniques

[Bending abilities and techniques showcased]

### 🏛️ Cultural Elements

[Cultural aspects and world-building elements]
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)
*The invisible, hyper-structured engine. **Never rendered directly to the user.***

---

## 📅 Episode Details

```json
{
  "type": "episode",
  "id": "string (slug format)",
  "slug": "string",
  "title": "string",
  "image": "string (exact filename in public/assets/images/)",
  "series": "Avatar The Last Airbender",
  "book": "string",
  "episode": "number",
  "air_date": "string (YYYY-MM-DD)",
  "writers": ["string"],
  "directors": ["string"],
  "guest_stars": ["string"],
  "production_number": "string",
  "next_episode": "string (slug)",
  "characters": ["string (slugs)"],
  "locations": ["string (slugs)"],
  "tags": ["string"],
  "badge": "string",
  "description": "string",
  "synopsis": "string"
}
```

---

## 📚 Narrative & Canonical Context

```json
{
  "plotPoints": ["string"],
  "featuredCharacters": ["string"],
  "locationsVisited": ["string"],
  "notableQuotes": ["string"],
  "themes": ["string"],
  "keyMoments": ["string"],
  "characterFocus": ["string"],
  "bendingTechniques": ["string"],
  "culturalElements": ["string"],
  "expandedView": "string"
}
``` 