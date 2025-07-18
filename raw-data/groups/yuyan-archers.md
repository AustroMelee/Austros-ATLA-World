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
- Name: Yuyan Archers
- Affiliation: Fire Nation Military
- Group Type: military
- Short Description: An elite and highly skilled unit of archers within the Fire Nation Army, renowned for their incredible precision and ability to capture targets without killing them.
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The Yuyan Archers are an elite special task force within the Fire Nation Army. Commanded by Colonel Shinu, they are legendary for their unparalleled skill in archery. Admiral Zhao claimed they were capable of pinning a fly to a tree from one hundred yards away without killing it, a testament to their precision and discipline. Their primary role is to capture high-value targets, and they were deployed by Zhao to capture Avatar Aang.

### ✨ Historical Milestones

- **Capture of Avatar Aang:** Successfully captured Aang on Zhao's orders, demonstrating their formidable skill by overwhelming him, though he later escaped with the help of the Blue Spirit.

### 🎭 Role in the Narrative

The Yuyan Archers serve to establish the high level of skill and specialization within the Fire Nation military. Their successful capture of a fully alert Avatar Aang demonstrates that even powerful benders are vulnerable to highly skilled non-benders, raising the stakes of the conflict. Their appearance is brief but memorable, showcasing them as one of the most elite forces in the world.

### 🌟 Notable Members

- Colonel Shinu (Commander)

```


## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "yuyan-archers",
  "name": "Yuyan Archers",
  "slug": "yuyan-archers",
  "type": "group",
  "description": "An elite and highly skilled unit of archers within the Fire Nation Army, renowned for their incredible precision. They are capable of pinning a fly to a tree from one hundred yards away without killing it.",
  "groupType": "military",
  "affiliation": "Fire Nation",
  "ideology": "Military precision, Discipline, Capture of targets",
  "baseOfOperations": "Pohuai Stronghold",
  "foundingDate": null,
  "dissolutionDate": null,
  "leadership": [
    "Colonel Shinu"
  ],
  "membership": [
    "Elite archers"
  ],
  "notableMembers": [
    "Colonel Shinu"
  ],
  "size": null,
  "image": "yuyan-archers.jpg",
  "tags": [
    "military",
    "fire_nation",
    "archers",
    "elite",
    "special_forces",
    "non-benders"
  ],
  "searchAliases": [
    "Yuyan"
  ]
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Successful capture of Avatar Aang"
  ],
  "alliances": [
    "Admiral Zhao"
  ],
  "rivals": [
    "Avatar Aang"
  ],
  "relatedLocations": [
    "Pohuai Stronghold"
  ],
  "historicalMilestones": [
    "Recognized as one of the most skilled military units in the world"
  ],
  "roleInNarrative": [
    "Serve as a formidable, elite threat to demonstrate the Fire Nation's power",
    "Successfully capture the Avatar, a feat few others accomplish"
  ],
  "politicalInfluence": [
    "A specialized military unit deployed by high-ranking officers"
  ],
  "militaryCapabilities": [
    "Legendary archery skills with unparalleled precision",
    "Specialized in capturing targets alive",
    "Effective against powerful benders through overwhelming, accurate projectile fire"
  ]
}
``` 