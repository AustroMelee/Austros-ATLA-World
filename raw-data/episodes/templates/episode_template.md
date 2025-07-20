---
type: template
id: episode-template
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

<FaBookOpen className="inline mr-2" />

...

### ✨ Key Moments

<FaStar className="inline mr-2" />

...

### 🎭 Characters Focus

<FaUsers className="inline mr-2" />

...

### 🌟 Themes

<FaLightbulb className="inline mr-2" />

...

### 📍 Locations Visited

<FaMapMarkerAlt className="inline mr-2" />

...

### 💬 Notable Quotes

<FaQuoteLeft className="inline mr-2" />

...

### 🎬 Plot Points

<FaFilm className="inline mr-2" />

...

### 🔥 Bending Techniques

<FaFire className="inline mr-2" />

...

### 🏛️ Cultural Elements

<FaLandmark className="inline mr-2" />

...
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

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