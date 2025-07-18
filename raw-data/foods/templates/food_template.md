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
- Short Description:
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

...

### ✨ Notable Uses

...

### 🌟 Ingredients

...
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🥘 Culinary Data

```json
{
  "id": "string (slug)",
  "name": "string",
  "slug": "string",
  "type": "food",
  "description": "string",
  "region": "string | null",
  "image": "string | null",
  "aliases": "string[]",
  "sources": "string[]",
  "tags": "string[]",
  "flavorProfile": "string[]",
  "mainIngredients": "string[]",
  "preparationStyle": "string",
  "culturalSignificance": "string",
  "searchAliases": "string[]",
  "expandedView": "string"
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "thematicKeywords": "string[]",
  "notableUses": "string[]",
  "servingOccasions": "string[]",
  "seasonalAvailability": "string[]",
  "dietaryRestrictions": "string[]"
}
``` 