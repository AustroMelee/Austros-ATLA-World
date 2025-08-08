---
type: group
---

# 🏰 ULTIMATE GROUP METADATA SCHEMA (v1.0)

*Standardized for Avatar Encyclopedia, Maxi-Minimalist UX Engine*

**PHILOSOPHY:** Factions and organizations drive the world's conflicts and alliances. Their metadata must capture hierarchy, ideology, and historical impact.

---

## 🖼️ UI - CARD VIEW

*(Presentation Layer 1 - Unchanged)*

```md
- Name: Southern Raiders
- Affiliation: Fire Nation Military
- Group Type: military
- Short Description: An elite naval force of the Fire Nation tasked with eliminating all waterbenders from the Southern Water Tribe during the Hundred Year War.
```

---

## 📖 UI - EXPANDED VIEW

*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The Southern Raiders were an elite and ruthless unit of the Fire Nation Navy. Their specific mission during the Hundred Year War was to conduct numerous raids on the Southern Water Tribe with the primary objective of capturing and eliminating every last waterbender. They were distinguished by their unique sea raven insignia and modified black and red armor. The Raiders were responsible for the death of Katara and Sokka's mother, Kya, an event that profoundly shaped Katara's character.

### ✨ Historical Milestones

- **Southern Water Tribe Raids:** Systematically attacked the Southern Water Tribe over many years, capturing all of its waterbenders.
- **Murder of Kya:** The commander of the Raiders at the time, Yon Rha, personally killed Katara's mother after she claimed to be the last waterbender to protect her daughter.

### 🎭 Role in the Narrative

The Southern Raiders are a deeply personal antagonist group for Katara. While the Fire Nation military is a general foe, the Raiders represent the specific evil that destroyed her family and her culture's bending heritage. Katara and Zuko's hunt for the retired commander Yon Rha is a crucial moment for Katara's character development, forcing her to confront her desire for revenge and ultimately choose forgiveness, which solidifies her trust in Zuko.

### 🌟 Notable Members

- Yon Rha (Commander, retired)

```

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "southern-raiders",
  "name": "Southern Raiders",
  "slug": "southern-raiders",
  "type": "group",
  "nation": "Fire Nation",
  "description": "An elite naval force of the Fire Nation tasked with launching numerous raids on the Southern Water Tribe to eliminate all of its waterbenders.",
  "groupType": "military",
  "affiliation": "Fire Nation",
  "ideology": "Genocide, Military conquest",
  "baseOfOperations": "Mobile (Fire Nation Navy flagship)",
  "foundingDate": null,
  "dissolutionDate": null,
  "leadership": [
    "Yon Rha (formerly)"
  ],
  "membership": [
    "Elite naval soldiers"
  ],
  "notableMembers": [
    "Yon Rha"
  ],
  "size": null,
  "image": "southern-raiders.jpg",
  "tags": [
    "military",
    "fire_nation",
    "navy",
    "elite",
    "special_forces",
    "antagonists"
  ],
  "searchAliases": []
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Southern Water Tribe Raids",
    "Murder of Kya"
  ],
  "alliances": [
    "Fire Nation Military"
  ],
  "rivals": [
    "Southern Water Tribe"
  ],
  "relatedLocations": [
    "Southern Water Tribe"
  ],
  "historicalMilestones": [
    "Successfully eliminated (captured or killed) nearly every waterbender from the Southern Water Tribe"
  ],
  "roleInNarrative": [
    "Serve as the direct cause of Katara's childhood trauma and motivations",
    "Their retired commander is the focus of a major character development episode for Katara and Zuko"
  ],
  "politicalInfluence": [
    "An instrument of the Fire Lord's policy of cultural genocide against the Water Tribes"
  ],
  "militaryCapabilities": [
    "Elite naval force",
    "Operated an advanced flagship",
    "Specialized in raids on civilian populations to capture specific targets (benders)"
  ]
}
```
