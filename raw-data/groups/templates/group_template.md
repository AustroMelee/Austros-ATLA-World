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
- Name:
- Affiliation:
- Group Type: (order, tribe, military, secret society)
- Short Description:
```

---

## 📖 UI - EXPANDED VIEW

*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

...

### ✨ Historical Milestones

...

### 🎭 Role in the Narrative

...

### 🌟 Notable Members

...
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "string (slug)",
  "name": "string",
  "slug": "string",
  "type": "group",
  "description": "string",
  "groupType": "organization | tribe | military | secret_society | council",
  "affiliation": "string",
  "ideology": "string",
  "baseOfOperations": "string",
  "foundingDate": "string | null",
  "dissolutionDate": "string | null",
  "leadership": "string[]",
  "membership": "string[]",
  "notableMembers": "string[]",
  "size": "number | null",
  "image": "string | null",
  "tags": "string[]",
  "searchAliases": "string[]",
  "expandedView": "string"
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": "string[]",
  "alliances": "string[]",
  "rivals": "string[]",
  "relatedLocations": "string[]",
  "historicalMilestones": "string[]",
  "roleInNarrative": "string[]",
  "politicalInfluence": "string[]",
  "militaryCapabilities": "string[]"
}
```
