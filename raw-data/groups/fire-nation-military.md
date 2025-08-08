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
- Name: Military of the Fire Nation
- Affiliation: Fire Nation
- Group Type: military
- Short Description: The world's most powerful and technologically advanced armed forces during the Hundred Year War, responsible for global conquest under the Fire Lord.
```

---

## 📖 UI - EXPANDED VIEW

*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The military of the Fire Nation is the unified armed forces of the nation, comprising a massive army, the world's largest navy, and the first functional air force. As the primary instrument of the Fire Lord's will, it was responsible for prosecuting the Hundred Year War, committing atrocities such as the Air Nomad Genocide and the Southern Water Tribe raids. Its strength was derived from its vast number of firebenders, industrial superiority, advanced technology like tanks and airships, and aggressive military doctrine.

### ✨ Historical Milestones

- **Start of the War:** Under Fire Lord Sozin, the military carried out the Air Nomad Genocide, wiping out an entire nation.
- **Naval Dominance:** Defeated the Water Tribe fleets early in the war, securing control over the world's oceans.
- **Siege of the North:** Launched a massive but unsuccessful invasion of the Northern Water Tribe led by Admiral Zhao.
- **Technological Advancement:** Developed and deployed war balloons, tanks, and massive airships, revolutionizing warfare.
- **Fall of Ba Sing Se:** Successfully conquered the Earth Kingdom capital through a coup led by Princess Azula and the Dai Li.
- **Final Campaign:** Attempted to burn the Earth Kingdom continent under the power of Sozin's Comet, but was defeated by Team Avatar.

### 🎭 Role in the Narrative

The Fire Nation military serves as the primary antagonistic force for the entire series. Its soldiers, ships, and commanders are the most frequent obstacles faced by Team Avatar. The military represents the overwhelming and oppressive power of Fire Lord Ozai's regime, and its various specialized units, like the Southern Raiders and Yuyan Archers, provide specific and dangerous threats to the heroes.

### 🌟 Notable Members

- General Iroh (formerly)
- Admiral Zhao
- Princess Azula
- Colonel Mongke (Rough Rhinos)
- Yon Rha (Southern Raiders)
- Colonel Shinu (Yuyan Archers)

```

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "fire-nation-military",
  "name": "Fire Nation Military",
  "slug": "fire-nation-military",
  "type": "group",
  "nation": "Fire Nation",
  "description": "The unified armed forces of the Fire Nation and the world's most powerful military during the Hundred Year War. It consists of the Fire Army, Fire Nation Navy, and the world's first air force.",
  "groupType": "military",
  "affiliation": "Fire Nation",
  "ideology": "Imperialism, Nationalism, Conquest, Spreading 'greatness'",
  "baseOfOperations": "Fire Nation Capital",
  "foundingDate": "Ancient",
  "dissolutionDate": null,
  "leadership": [
    "Fire Lord (Commander-in-chief)",
    "War Minister"
  ],
  "membership": [
    "Firebending soldiers",
    "Nonbending soldiers",
    "Engineers and technicians"
  ],
  "notableMembers": [
    "General Iroh",
    "Admiral Zhao",
    "Princess Azula"
  ],
  "size": null,
  "image": "fire-nation-military.jpg",
  "tags": [
    "military",
    "fire_nation",
    "firebending",
    "antagonists",
    "navy",
    "army",
    "air_force"
  ],
  "searchAliases": [
    "Fire Army",
    "Fire Navy"
  ]
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Air Nomad Genocide",
    "Southern Water Tribe Raids",
    "Siege of the North",
    "Siege of Ba Sing Se",
    "Battle of the Drill",
    "Invasion of the Fire Nation (Day of Black Sun)",
    "Battle at Wulong Forest"
  ],
  "alliances": [],
  "rivals": [
    "Military of the Earth Kingdom",
    "Military of the Water Tribe",
    "Team Avatar",
    "Order of the White Lotus"
  ],
  "relatedLocations": [
    "Fire Nation Capital",
    "Ba Sing Se",
    "Northern Water Tribe",
    "Southern Water Tribe",
    "Pohuai Stronghold"
  ],
  "historicalMilestones": [
    "Perpetrated the Air Nomad Genocide",
    "Maintained a century-long global war of conquest",
    "Developed the world's first military air force",
    "Successfully conquered the Earth Kingdom capital"
  ],
  "roleInNarrative": [
    "The main antagonistic force of the series",
    "Represents the power and oppression of the Fire Lord's regime",
    "Provides the physical conflicts and battles for the heroes to overcome"
  ],
  "politicalInfluence": [
    "The primary tool of the Fire Lord's absolute power and foreign policy"
  ],
  "militaryCapabilities": [
    "Largest and most powerful navy in the world",
    "Technologically superior weaponry, including tanks, drills, and warships",
    "The world's only air force, consisting of war balloons and airships",
    "Elite specialized units like the Yuyan Archers and Southern Raiders",
    "Aggressive, deception-based warfare tactics",
    "Extensive use of powerful firebending, especially when enhanced by Sozin's Comet"
  ]
}
```
