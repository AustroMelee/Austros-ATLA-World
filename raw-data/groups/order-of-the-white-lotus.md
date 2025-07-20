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
- Name: Order of the White Lotus
- Affiliation: Neutral
- Group Type: secret society
- Short Description: An ancient, secret society of masters from all nations, dedicated to sharing knowledge and seeking philosophy, beauty, and truth, who emerge to aid the Avatar.
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The Order of the White Lotus is an ancient and formerly secret society that transcends the boundaries of the four nations. Formed by scholars and masters from around the world, the group is dedicated to the pursuit of philosophy, beauty, and truth. Members communicate their affiliation through the strategic placement of tiles in the game of Pai Sho. While historically operating from the shadows to guide and protect the Avatar, the Order revealed itself publicly at the end of the Hundred Year War to liberate Ba Sing Se from Fire Nation control.

### ✨ Historical Milestones

- **Ancient Origins:** Formed as a club for ancient masters to challenge one another at Pai Sho.
- **Hundred Year War:** Maintained a low profile, with key members like Iroh joining its ranks.
- **Liberation of Ba Sing Se:** Under the leadership of Grand Lotus Iroh, the Order's masters united and retook the Earth Kingdom capital from the Fire Nation during Sozin's Comet.
- **Public Debut:** After the war, the society stopped concealing itself and began to serve the world and the Avatar more openly.

### 🎭 Role in the Narrative

The Order of the White Lotus serves as a powerful, benevolent force that reveals itself in the final act of the Hundred Year War. They represent a level of wisdom and cooperation that transcends national conflict. Their intervention is crucial, as they single-handedly liberate Ba Sing Se, demonstrating the combined strength of the world's greatest masters and providing critical support to Team Avatar's final mission.

### 🌟 Notable Members

- Iroh (Grand Lotus)
- Bumi
- Jeong Jeong
- Pakku
- Piandao
```

```


## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "order-of-the-white-lotus",
  "name": "Order of the White Lotus",
  "slug": "order-of-the-white-lotus",
  "type": "group",
  "nation": "Four Nations",
  "description": "An ancient and formerly secret society that transcends the boundaries of the four nations, seeking philosophy, beauty, and truth. They are devoted to sharing ancient knowledge across national and political divides.",
  "groupType": "secret_society",
  "affiliation": "Neutral",
  "ideology": "Philosophy, Beauty, Truth, Sharing knowledge, Protection of the Avatar",
  "baseOfOperations": "Various (secret until 100 AG)",
  "foundingDate": "Ancient",
  "dissolutionDate": null,
  "leadership": [
    "Iroh (Grand Lotus)"
  ],
  "membership": [
    "Scholars and masters from all nations"
  ],
  "notableMembers": [
    "Iroh",
    "Bumi",
    "Jeong Jeong",
    "Pakku",
    "Piandao"
  ],
  "size": null,
  "image": "order-of-the-white-lotus.jpg",
  "tags": [
    "secret_society",
    "philosophy",
    "masters",
    "pai_sho",
    "neutral",
    "ancient"
  ],
  "searchAliases": [
    "White Lotus"
  ]
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Liberation of Ba Sing Se"
  ],
  "alliances": [
    "Team Avatar",
    "Avatar Aang"
  ],
  "rivals": [
    "Fire Nation (during liberation of Ba Sing Se)"
  ],
  "relatedLocations": [
    "Ba Sing Se"
  ],
  "historicalMilestones": [
    "Operating as a secret society for centuries",
    "Finding, training, and protecting past Avatars",
    "Publicly revealing their existence by liberating Ba Sing Se"
  ],
  "roleInNarrative": [
    "Serve as a powerful, unified force of good in the series finale",
    "Demonstrate cooperation between masters of all four nations",
    "Provide critical military support to end the war"
  ],
  "politicalInfluence": [
    "Operates outside of traditional political structures",
    "Subtly influences world events and Avatars",
    "Highly respected by world leaders after their public debut"
  ],
  "militaryCapabilities": [
    "Comprised of some of the most powerful bending masters and warriors in the world",
    "Coordinated strategic attacks, as seen in the liberation of Ba Sing Se",
    "Mastery of earthbending, waterbending, firebending, and swordsmanship"
  ]
}
``` 