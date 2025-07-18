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
- Name: Si Wong Tribes
- Affiliation: Earth Kingdom (loosely)
- Group Type: tribe
- Short Description: Indigenous nomadic people of the Si Wong Desert, known for their unique style of sandbending and use of sand-sailers for transportation.
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The Si Wong tribes, also known as sandbenders, are the nomadic people indigenous to the vast Si Wong Desert. They have adapted to the harsh environment, developing a unique form of earthbending to manipulate loose sand. They travel across the dunes on wind-powered sand-sailers. While some tribes act as guides, others have turned to raiding and scavenging to survive, giving them a poor reputation among outsiders. Their culture is distinct, with unique protective clothing and goggles to survive the desert sun.

### ✨ Historical Milestones

- **Ancient History:** Became the predominant ethnic group in the desert, maintaining a relationship with Wan Shi Tong's Spirit Library.
- **Deteriorating Relations:** Were eventually banned from the Spirit Library after outsiders they guided sought knowledge for personal gain.
- **Appa's Capture:** A group of sandbenders captured Appa and traded him to beetle-headed merchants, which led to a confrontation with an enraged Avatar Aang.

### 🎭 Role in the Narrative

The Si Wong tribes are introduced as a neutral, opportunistic force. Their capture of Appa creates a major emotional crisis for Aang and a significant plot arc for the team as they are stranded in the desert. The confrontation with the sandbenders showcases a darker, more vengeful side of Aang when he enters the Avatar State out of grief and anger, highlighting the depth of his bond with Appa.

### 🌟 Notable Members

- Ghashiun
- Sha-Mo

```


## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "si-wong-tribes",
  "name": "Si Wong Tribes",
  "slug": "si-wong-tribes",
  "type": "group",
  "description": "A people indigenous to the Si Wong Desert in the Earth Kingdom, divided into several loosely-organized tribes. The tribes are notable for their special style of sandbending and their use of sand-sailers.",
  "groupType": "tribe",
  "affiliation": "Earth Kingdom",
  "ideology": "Survival, Nomadism",
  "baseOfOperations": "Si Wong Desert",
  "foundingDate": "Ancient",
  "dissolutionDate": null,
  "leadership": [],
  "membership": [
    "Sandbenders",
    "Desert nomads"
  ],
  "notableMembers": [
    "Ghashiun",
    "Sha-Mo"
  ],
  "size": null,
  "image": "si-wong-tribes.jpg",
  "tags": [
    "tribe",
    "sandbenders",
    "earth_kingdom",
    "desert",
    "nomads"
  ],
  "searchAliases": [
    "Sandbenders",
    "Si Wong people"
  ]
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Capture of Appa",
    "Confrontation with Avatar Aang in the Avatar State"
  ],
  "alliances": [
    "Wan Shi Tong (formerly)"
  ],
  "rivals": [
    "Team Avatar (briefly)"
  ],
  "relatedLocations": [
    "Si Wong Desert",
    "Wan Shi Tong's Library",
    "Misty Palms Oasis"
  ],
  "historicalMilestones": [
    "Developing the unique art of sandbending",
    "Losing access to the Spirit Library",
    "Inadvertently causing Aang to enter the Avatar State out of rage"
  ],
  "roleInNarrative": [
    "Serve as antagonists in the desert arc by capturing Appa",
    "Represent the morally ambiguous nature of survival in a harsh environment",
    "Trigger a significant emotional and spiritual crisis for Aang"
  ],
  "politicalInfluence": [
    "Largely independent and unsubdued by the central Earth Kingdom government"
  ],
  "militaryCapabilities": [
    "Skilled in sandbending, a specialized form of earthbending",
    "Use of sand-sailers for high-speed desert travel and ambushes",
    "Guerrilla tactics suited to the desert environment",
    "Scavenging and raiding"
  ]
}
``` 