---
type: fauna
---

# 🐾 ULTIMATE FAUNA METADATA SCHEMA (v1.0)

*Standardized for Avatar Encyclopedia, Maxi-Minimalist UX Engine*

**PHILOSOPHY:** Animals reflect the world's diversity and cultural significance. Rich metadata captures their ecological roles, cultural importance, and narrative connections.

---

## 🖼️ UI - CARD VIEW
*(Presentation Layer 1 - Unchanged)*

```md
- Name: [Animal Name]
- Nation: [Air Nomads/Water Tribe/Earth Kingdom/Fire Nation/Neutral]
- Animal Type: [mammal/bird/reptile/fish/insect/amphibian/crustacean/hybrid]
- Habitat: [terrestrial/aquatic/aerial/arboreal/underground]
- Short Description: [Brief description of the animal]
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

[Detailed description of the animal, its characteristics, behavior, and significance in the Avatar world]

### ✨ Notable Examples

- **[Specific Animal Name]:** [Description of a notable individual or example of this species]

### 🌍 Habitat & Distribution

[Description of where this animal can be found, its natural habitat, and geographical distribution]

### 🔗 Cultural Significance

[How this animal relates to the culture, bending, or spiritual beliefs of the world]

### 🎭 Behavior & Characteristics

[Detailed information about the animal's behavior, abilities, and unique characteristics]
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)
*The invisible, hyper-structured engine. **Never rendered directly to the user.***

---

## 🧬 Biological Profile

```json
{
  "id": "[animal-name]",
  "slug": "[animal-name]",
  "name": "[Animal Name]",
  "nation": "[Air Nomads/Water Tribe/Earth Kingdom/Fire Nation/Neutral]",
  "animalType": "[mammal/bird/reptile/fish/insect/amphibian/crustacean/hybrid]",
  "habitat": "[terrestrial/aquatic/aerial/arboreal/underground]",
  "description": "[Brief description]",
  "tags": ["[relevant]", "tags"],
  "synonyms": ["[alternative names]"],
  "relations": [],
  "notableExamples": ["[specific animals]"],
  "culturalSignificance": "[How it relates to culture/bending]",
  "behavior": "[Behavioral characteristics]",
  "abilities": ["[special abilities]"],
  "diet": "[carnivore/herbivore/omnivore]",
  "size": "[small/medium/large]",
  "lifespan": "[short/medium/long]",
  "conservationStatus": "[common/rare/endangered/extinct]"
}
```

---

## 🌍 Ecological & Cultural Context

```json
{
  "habitatDetails": "string[]",
  "geographicDistribution": "string[]",
  "culturalUses": "string[]",
  "spiritualSignificance": "string[]",
  "economicValue": "string[]",
  "domesticationStatus": "wild | domesticated | semi_domesticated",
  "interactionWithHumans": "string[]"
}
```

---

## 🎭 Narrative & Thematic Significance

```json
{
  "narrativeAppearances": "string[]",
  "characterAssociations": "string[]",
  "thematicKeywords": "string[]",
  "symbolicMeanings": "string[]",
  "storytellingRole": "string"
}
```

---

## 🧱 Semantic & Thematic Index
*(The true heart of the filtering engine)*

```json
{
  "thematicKeywords": "string[]",
  "notableExamples": "string[]",
  "habitatTypes": "string[]",
  "tagCategories": {
    "biologicalTags": "string[]",
    "culturalTags": "string[]",
    "narrativeTags": "string[]",
    "thematicTags": "string[]",
    "ecologicalTags": "string[]",
    "triviaTags": "string[]"
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": "string[]",
  "filterWeight": "number (0-100)",
  "canonicalImportance": "core | primary | secondary | tertiary | background",
  "dataCompletenessScore": "number (0.0-1.0)",
  "searchableKeywords": "string[]",
  "fuzzySynonyms": "string[]",
  "searchAliases": "string[]",
  "isSuggestedInXContext": "string[]"
}
``` 