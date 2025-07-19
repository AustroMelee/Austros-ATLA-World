---
type: food
---

# 🍲 ULTIMATE FOOD METADATA SCHEMA (v1.0)

*Standardized for Avatar Encyclopedia, Maxi-Minimalist UX Engine*

**PHILOSOPHY:** Food reflects culture and history. Rich metadata lets users explore culinary traditions across the Four Nations.

---

## 🖼️ UI - CARD VIEW
*(Presentation Layer 1 - Unchanged)*

```md
- Name: 
- Region: 
- Short Description: (1-2 sentences summarizing the dish and its cultural significance)
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

[Detailed description of the dish, its preparation, and cultural context]

### ✨ Notable Uses

[When and how this food is typically consumed, special occasions, etc.]

### 🌟 Ingredients

[Key ingredients and their significance in the dish]

### 🍽️ Preparation

[How the dish is traditionally prepared and served]

### 🏛️ Cultural Significance

[What this food represents in the culture and its symbolic meaning]
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)
*The invisible, hyper-structured engine. **Never rendered directly to the user.***

---

## 🥘 Culinary Identity & Classification

```json
{
  "id": "string (slug format)",
  "name": "string",
  "slug": "string",
  "type": "food",
  "description": "string",
  "region": "string | null",
  "image": "string | null",
  "aliases": "string[]",
  "sources": "string[]",
  "tags": "string[]",
  "searchAliases": "string[]",
  "expandedView": "string"
}
```

---

## 🍽️ Culinary Profile & Characteristics

```json
{
  "flavorProfile": "string[]",
  "mainIngredients": "string[]",
  "preparationStyle": "string",
  "cookingMethod": "string",
  "servingTemperature": "hot | warm | room_temperature | cold",
  "texture": "string[]",
  "spiceLevel": "mild | medium | hot | very_hot",
  "dietaryRestrictions": "string[]",
  "seasonalAvailability": "string[]",
  "shelfLife": "string"
}
```

---

## 🏛️ Cultural & Historical Context

```json
{
  "culturalSignificance": "string",
  "originStory": "string",
  "traditionalOccasions": "string[]",
  "ceremonialUses": "string[]",
  "historicalPeriod": "string",
  "culturalEvolution": "string",
  "regionalVariations": "string[]",
  "socialSignificance": "string"
}
```

---

## 🗺️ Geographic & Regional Data

```json
{
  "primaryRegion": "string",
  "secondaryRegions": "string[]",
  "availabilityByNation": {
    "fire_nation": "common | uncommon | rare | unavailable",
    "earth_kingdom": "common | uncommon | rare | unavailable",
    "water_tribe": "common | uncommon | rare | unavailable",
    "air_nomads": "common | uncommon | rare | unavailable"
  },
  "localVariations": "string[]",
  "importExportStatus": "local_only | traded | imported | exported"
}
```

---

## 🍳 Preparation & Culinary Techniques

```json
{
  "preparationTime": "string",
  "cookingTime": "string",
  "difficultyLevel": "easy | medium | hard | expert",
  "requiredEquipment": "string[]",
  "cookingTechniques": "string[]",
  "specialInstructions": "string[]",
  "presentationStyle": "string",
  "garnishes": "string[]"
}
```

---

## 🎯 Nutritional & Dietary Information

```json
{
  "nutritionalProfile": {
    "calories": "string",
    "protein": "string",
    "carbohydrates": "string",
    "fat": "string",
    "fiber": "string"
  },
  "dietaryCategories": "string[]",
  "allergenInfo": "string[]",
  "healthBenefits": "string[]",
  "medicinalProperties": "string[]"
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
  "emotionalConnections": "string[]",
  "storytellingRole": "string"
}
```

---

## 🧱 Semantic & Thematic Index
*(The true heart of the filtering engine)*

```json
{
  "thematicKeywords": "string[]",
  "notableUses": "string[]",
  "servingOccasions": "string[]",
  "seasonalAvailability": "string[]",
  "dietaryRestrictions": "string[]",
  "tagCategories": {
    "culinaryTags": "string[]",
    "culturalTags": "string[]",
    "regionalTags": "string[]",
    "narrativeTags": "string[]",
    "thematicTags": "string[]",
    "ingredientTags": "string[]",
    "occasionTags": "string[]",
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