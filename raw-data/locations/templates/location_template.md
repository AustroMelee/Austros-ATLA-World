---
type: location
---

# 🌍 ULTIMATE LOCATION METADATA SCHEMA (v1.0)

*Standardized for Avatar Encyclopedia, Maxi-Minimalist UX Engine*

**PHILOSOPHY:** Locations are the stage upon which history unfolds. Each field anchors the place in geography, politics, and narrative context.

---

## 🖼️ UI - CARD VIEW
*(Presentation Layer 1 - Unchanged)*

```md
- Name:
- Nation:
- Location Type: (city, fortress, region, spiritual site)
- Short Description:
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

...

### ✨ Notable Events

...

### 🎭 Role in the World

...

### 🌟 Notable Features

...
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)
*The invisible, hyper-structured engine. **Never rendered directly to the user.***

---

## 🧭 Geographical & Political Data

```json
{
  "id": "string (slug format)",
  "name": "string",
  "slug": "string",
  "type": "location",
  "description": "string",
  "fullName": "string",
  "locationType": "city | town | fortress | village | region | landmark | spiritual_site",
  "nation": "string",
  "coordinates": "string",
  "terrain": "string",
  "climate": "string",
  "population": "number | null",
  "governingBody": "string",
  "foundedIn": "string",
  "dissolvedIn": "string | null",
  "parentLocation": "string | null",
  "subLocations": "string[]",
  "image": "string | null",
  "tags": "string[]",
  "searchAliases": "string[]",
  "expandedView": "string"
}
```

---

## 📜 Historical & Cultural Context

```json
{
  "significantEvents": "string[]",
  "culturalSignificance": "string",
  "notableResidents": "string[]",
  "affiliatedGroups": "string[]",
  "episodeDebuts": "string[]",
  "notableAppearances": "string[]",
  "historicalMilestones": "string[]",
  "architecturalFeatures": "string[]",
  "defensiveCapabilities": "string[]",
  "economicActivities": "string[]"
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "thematicKeywords": "string[]",
  "notableFeatures": "string[]",
  "accessibility": "string[]",
  "strategicImportance": "string[]",
  "culturalPractices": "string[]"
}
``` 