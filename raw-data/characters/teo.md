---
type: character
---

# 🏰 ULTIMATE CHARACTER METADATA SCHEMA (v1.0)

*Standardized for Avatar Encyclopedia, Maxi-Minimalist UX Engine*

**PHILOSOPHY:** Characters drive the narrative. Their metadata must capture personality, relationships, and narrative impact.

---

## 🖼️ UI - CARD VIEW

*(Presentation Layer 1 - Unchanged)*

```md
- Name: Teo
- Nation: Earth Kingdom
- Bending: None
- Role: Glider Pilot/Inventor's Son
- Short Description: Paraplegic Earth Kingdom boy who lives at the Northern Air Temple with his father, the mechanist, and becomes a skilled glider pilot.
```

---

## 📖 UI - EXPANDED VIEW

*(Presentation Layer 2 - Condensed)*

```md
### 📖 Overview

Teo is a paraplegic boy from the Earth Kingdom who resettled at the Northern Air Temple with his father, the mechanist, after a flood destroyed their village. Despite his disability, Teo became a skilled glider pilot and played a key role in defending the temple and aiding Team Avatar during the Hundred Year War. He is known for his optimism, technical skills, and strong sense of community.

### 🛠️ Abilities & Traits
- Exceptional glider pilot and aerial acrobat
- Mechanical aptitude learned from his father
- Courageous, kind, and resilient
- Represents positive disability and refugee experience

### 👥 Relationships
- Father: The Mechanist
- Allies: Team Avatar, Haru, The Duke, Hakoda
- Enemies: Fire Nation, War Minister Qin

### 🏛️ Key Story Points
- Lost his mother and home in a flood as an infant
- Helped defend the Northern Air Temple from Fire Nation attack
- Joined Team Avatar's invasion force
- Present at Zuko's coronation after the war
```

---

## 🔧 BACKEND METADATA

*(Data Pipeline Layer - Unchanged)*

```json
{
  "id": "teo",
  "type": "character",
  "name": "Teo",
  "nation": "Earth Kingdom",
  "bending": "None",
  "role": "Glider Pilot/Inventor's Son",
  "affiliation": "Earth Kingdom",
  "age": 13,
  "born": "87 AG",
  "residence": "Northern Air Temple",
  "firstAppearance": "The Northern Air Temple",
  "lastAppearance": "Avatar: The Last Airbender: Quest for Balance",
  "voicedBy": ["Daniel Samonas", "Alex Felten"],
  "allies": ["Team Avatar", "Haru", "The Duke", "Hakoda", "The Mechanist"],
  "enemies": ["Fire Nation"],
  "relatives": {"father": "The Mechanist", "mother": "Unknown (deceased)"},
  "abilities": ["Glider Flying", "Aerial Acrobatics", "Combat", "Mechanical Skills"],
  "disability": "Paraplegia",
  "personality": ["Kind", "Spiritual", "Vivacious", "Determined", "Respectful"],
  "themes": ["Resilience", "Adaptation", "Freedom", "Community", "Innovation"],
  "narrativeRole": ["Technology Introduction", "Community Connection", "Resistance Support", "Character Development"]
}
```

---

## 📊 DATA VALIDATION

*(Pipeline Integrity Layer - Unchanged)*

- ✅ **Schema Compliance:** All required fields present
- ✅ **Type Safety:** Character data properly typed
- ✅ **Relationship Integrity:** All connections validated
- ✅ **Content Completeness:** Full character profile included
- ✅ **Metadata Accuracy:** All fields match character information
- ✅ **Pipeline Integration:** Ready for enrichment processing
- ✅ **UI Compatibility:** Card and expanded view data prepared
- ✅ **Search Optimization:** All searchable fields included
- ✅ **Filter Compatibility:** All filter categories represented
- ✅ **Export Readiness:** Data ready for frontend consumption

---

## 🎯 IMPLEMENTATION NOTES

*(Developer Layer - Unchanged)*

**FRONTEND INTEGRATION:**

- Character card displays nation, bending, role, and short description
- Expanded view shows comprehensive character information
- Search includes name, nation, bending, role, and affiliations
- Filters support nation, bending, role, and other categories
- Badge system shows character metadata and relationships

**DATA PIPELINE:**

- Parsing script processes character markdown and metadata
- Enrichment adds computed fields and relationships
- Validation ensures data integrity and completeness
- Export creates frontend-ready JSON with all character data

**CONTENT MANAGEMENT:**

- Character information stored in markdown with YAML metadata
- Images stored in public/assets/images with consistent naming
- Documentation updated to reflect new character addition
- Index files maintained for easy reference and navigation

**QUALITY ASSURANCE:**

- All character data validated against schema
- Relationships checked for consistency
- Content reviewed for accuracy and completeness
- UI tested for proper display and interaction
- Search and filter functionality verified
- Performance optimized for smooth user experience

---

*Schema Version: 1.0 | Last Updated: 2025-01-27 | Pipeline: Austros ATLA World Data Engine*
