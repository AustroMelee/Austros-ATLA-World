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
- Name: Rough Rhinos
- Affiliation: Fire Nation Military (formerly)
- Group Type: military
- Short Description: An elite and infamous cavalry unit of the Fire Nation Army who ride komodo rhinos, each member wielding a different specialized weapon.
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The Rough Rhinos were an elite cavalry unit within the Fire Nation military, founded and led by Colonel Mongke. The group consisted of five members, each a specialist with a unique weapon, including an archer, a rock-flail wielder, and a explosives expert. They were renowned for their skill and their ability to ride their komodo rhino mounts silently through the brush, making them an effective raiding and intimidation force.

### ✨ Historical Milestones

- **Terrorizing Earth Kingdom Villages:** Under Colonel Mongke, they were tasked with intimidating Earth Kingdom villages and suppressing resistance.
- **Confrontation with Iroh:** The unit was famously defeated by General Iroh, who was defending a village.

### 🎭 Role in the Narrative

The Rough Rhinos are introduced as a veteran, intimidating force representing the Fire Nation's control over conquered Earth Kingdom territory. Their defeat at the hands of Iroh serves to establish his immense power, wisdom, and compassionate nature, as he chooses to defend the innocent rather than continue his siege of Ba Sing Se. They act as a benchmark for what a truly powerful master can accomplish.

### 🌟 Notable Members

- Colonel Mongke (Founder)

```


## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "rough-rhinos",
  "name": "Rough Rhinos",
  "slug": "rough-rhinos",
  "type": "group",
  "description": "An elite group of Fire Nation cavalry, founded by Colonel Mongke. There were five members of the group, each of whom carried a different specialized weapon. They were highly skilled and able to ride their komodo rhinos silently.",
  "groupType": "military",
  "affiliation": "Fire Nation",
  "ideology": "Military conquest, Intimidation",
  "baseOfOperations": "Mobile (in occupied Earth Kingdom)",
  "foundingDate": null,
  "dissolutionDate": null,
  "leadership": [
    "Colonel Mongke"
  ],
  "membership": [
    "Specialized weapon masters"
  ],
  "notableMembers": [
    "Colonel Mongke"
  ],
  "size": 5,
  "image": "rough-rhinos.jpg",
  "tags": [
    "military",
    "fire_nation",
    "cavalry",
    "elite",
    "komodo_rhino"
  ],
  "searchAliases": []
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Defeated by General Iroh"
  ],
  "alliances": [
    "Fire Nation Army"
  ],
  "rivals": [
    "General Iroh",
    "Earth Kingdom Resistance"
  ],
  "relatedLocations": [
    "Occupied Earth Kingdom territories"
  ],
  "historicalMilestones": [
    "Served as an elite raiding unit during the Hundred Year War"
  ],
  "roleInNarrative": [
    "Serve as antagonists to demonstrate General Iroh's power and change of heart"
  ],
  "politicalInfluence": [
    "Acted as enforcers of Fire Nation military policy in occupied territories"
  ],
  "militaryCapabilities": [
    "Komodo rhino cavalry",
    "Specialization in diverse weaponry (archery, explosives, flails)",
    "Stealth movement despite being a cavalry unit",
    "Raiding and intimidation tactics"
  ]
}
``` 