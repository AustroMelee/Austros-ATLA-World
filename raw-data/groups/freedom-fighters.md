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
- Name: Freedom Fighters
- Affiliation: Earth Kingdom (resistance)
- Group Type: organization
- Short Description: A group of teenage rebels led by Jet, dedicated to liberating the Earth Kingdom from Fire Nation occupation through guerrilla warfare.
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The Freedom Fighters were a small, independent group of teenage rebels who fought against the Fire Nation in the forests of the Earth Kingdom. Led by the charismatic but vengeful Jet, they used guerrilla tactics to sabotage Fire Nation operations. Their methods were often extreme, culminating in a plan to flood a Fire Nation-occupied village, which would have killed innocent civilians. After Jet's death, the remaining members joined the larger resistance movement.

### ✨ Historical Milestones

- **Formation:** Formed by Jet and other orphans of the war to fight the Fire Nation.
- **Encounter with Team Avatar:** Befriended Team Avatar but were abandoned after their plan to destroy a dam was revealed.
- **Relocation to Ba Sing Se:** Traveled to the capital city, where Jet was captured, brainwashed, and ultimately killed by the Dai Li.
- **Day of Black Sun:** The remaining members joined the invasion force against the Fire Nation.

### 🎭 Role in the Narrative

The Freedom Fighters serve as a cautionary tale about the cost of war and how a desire for justice can curdle into extremism. They present Team Avatar with a moral dilemma, forcing them to confront the idea that not all who fight the Fire Nation are necessarily noble. Jet's tragic arc, from rebel leader to brainwashed pawn, highlights the insidious nature of the Ba Sing Se conspiracy.

### 🌟 Notable Members

- Jet (Leader)
- Pipsqueak
- The Duke

```


## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "freedom-fighters",
  "name": "Freedom Fighters",
  "slug": "freedom-fighters",
  "type": "group",
  "description": "A group of teenage rebels who wanted to liberate the Earth Kingdom from Fire Nation occupation, even if it meant harming innocent people. They were led by Jet.",
  "groupType": "organization",
  "affiliation": "Earth Kingdom",
  "ideology": "Anti-Fire Nation extremism, Guerrilla resistance",
  "baseOfOperations": "Earth Kingdom forests (formerly)",
  "foundingDate": null,
  "dissolutionDate": "100 AG (de facto, after Jet's death)",
  "leadership": [
    "Jet"
  ],
  "membership": [
    "Teenage orphans"
  ],
  "notableMembers": [
    "Jet",
    "Pipsqueak",
    "The Duke"
  ],
  "size": null,
  "image": "freedom-fighters.jpg",
  "tags": [
    "rebels",
    "resistance",
    "earth_kingdom",
    "guerrilla_warfare"
  ],
  "searchAliases": []
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Attempted destruction of a dam and village",
    "Infiltration of Ba Sing Se",
    "Confrontation with the Dai Li at Lake Laogai",
    "Participation in the Day of Black Sun"
  ],
  "alliances": [
    "Team Avatar (briefly)",
    "Earth Kingdom Invasion Force"
  ],
  "rivals": [
    "Fire Nation",
    "Dai Li"
  ],
  "relatedLocations": [
    "Earth Kingdom forests",
    "Ba Sing Se",
    "Lake Laogai"
  ],
  "historicalMilestones": [
    "Represented an independent, extremist cell of the Earth Kingdom resistance"
  ],
  "roleInNarrative": [
    "Introduce a morally complex form of resistance to Team Avatar",
    "Jet's brainwashing and death serve to expose the Dai Li conspiracy",
    "Surviving members represent the widespread desire to fight back against the Fire Nation"
  ],
  "politicalInfluence": [
    "None; operated as an independent guerrilla cell"
  ],
  "militaryCapabilities": [
    "Guerrilla warfare and sabotage",
    "Skilled non-bending combat (hook swords, archery, etc.)",
    "Expertise in forest ambushes and traversal"
  ]
}
``` 