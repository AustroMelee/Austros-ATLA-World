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
- Name: Military of the Earth Kingdom
- Affiliation: Earth Kingdom
- Group Type: military
- Short Description: The largest military force in the world by number, responsible for the defense of the vast Earth Kingdom during the Hundred Year War.
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The military of the Earth Kingdom is the vast armed forces responsible for defending the continent. Commanded by the Council of Five in Ba Sing Se, it is the largest army in the world by sheer numbers. It consists of earthbenders, non-bending foot soldiers, and specialized cavalry. Though technologically inferior to the Fire Nation, the Earth Kingdom military was able to hold out for a century through stalwart defense, guerrilla tactics, and the sheer determination of its soldiers. The military includes several specialized divisions, such as the Kyoshi Warriors and the Royal Earthbender Guards.

### ✨ Historical Milestones

- **Hundred Year War:** Fought a century-long defensive war against the Fire Nation, suffering many defeats but preventing a total collapse for 100 years.
- **Siege of Ba Sing Se (95 AG):** Successfully repelled General Iroh's legendary siege of the capital city.
- **Battle of the Drill:** With help from Team Avatar, successfully defended Ba Sing Se's Outer Wall from a massive Fire Nation drill.
- **Coup of Ba Sing Se (100 AG):** The military's high command, the Council of Five, was neutralized by the Dai Li, leading to the city's fall and the army's fragmentation.
- **Day of Black Sun:** Remnant forces joined the invasion of the Fire Nation, but were captured after its failure.

### 🎭 Role in the Narrative

The Earth Kingdom military represents the primary force of resistance against the Fire Nation. Its soldiers and generals are frequent allies to Team Avatar, though some, like General Fong, prove to be misguided. The military's struggle highlights the immense scale of the war and the resilience of the Earth Kingdom people. Specialized groups within the military, like the Kyoshi Warriors, serve as important recurring allies.

### 🌟 Notable Members

- Council of Five (General How, General Sung)
- General Fong
- Captain Boqin
- Kyoshi Warriors
- Royal Earthbender Guards
- Terra Team

```


## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "earth-kingdom-military",
  "name": "Earth Kingdom Military",
  "slug": "earth-kingdom-military",
  "type": "group",
  "nation": "Earth Kingdom",
  "description": "The body primarily responsible for the defense of the Earth Kingdom, consisting of an army, navy, and several specialized divisions. It is the largest military in the world by number.",
  "groupType": "military",
  "affiliation": "Earth Kingdom",
  "ideology": "Defense, Nationalism, Resistance",
  "baseOfOperations": "Ba Sing Se",
  "foundingDate": "Ancient",
  "dissolutionDate": null,
  "leadership": [
    "Earth Monarch (Commander-in-chief)",
    "Council of Five"
  ],
  "membership": [
    "Earthbenders",
    "Nonbending foot soldiers",
    "Cavalry riders"
  ],
  "notableMembers": [
    "General How",
    "General Sung",
    "General Fong",
    "Suki"
  ],
  "size": null,
  "image": "earth-kingdom-military.jpg",
  "tags": [
    "military",
    "earth_kingdom",
    "earthbending",
    "army"
  ],
  "searchAliases": [
    "Earth Army",
    "Earth King's Army"
  ]
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Siege of Ba Sing Se (95 AG)",
    "Battle of the Drill",
    "Coup of Ba Sing Se",
    "Invasion of the Fire Nation (Day of Black Sun)"
  ],
  "alliances": [
    "Team Avatar",
    "Water Tribes (during invasion)"
  ],
  "rivals": [
    "Fire Nation Military",
    "Dai Li (during coup)"
  ],
  "relatedLocations": [
    "Ba Sing Se",
    "Omashu",
    "Kyoshi Island",
    "General Fong's Fortress"
  ],
  "historicalMilestones": [
    "Resisting the Fire Nation for one hundred years",
    "Successfully defending Ba Sing Se against General Iroh's siege",
    "Developing earthbending-powered tanks for the Day of Black Sun invasion"
  ],
  "roleInNarrative": [
    "The main organized resistance against the Fire Nation",
    "Provides allies and context for the scale of the war",
    "Its fall in Ba Sing Se marks a major turning point and low point for the heroes"
  ],
  "politicalInfluence": [
    "Controlled by the Council of Five, which held de facto power in Ba Sing Se",
    "The primary defense force of the largest nation in the world"
  ],
  "militaryCapabilities": [
    "Vast numbers of soldiers",
    "Widespread use of earthbending for defense and offense",
    "Ostrich horse cavalry for mobility",
    "Use of large stone discs as projectiles and mobile defenses",
    "Specialized elite units like the Kyoshi Warriors and Terra Team",
    "Late-war development of earthbending-powered tanks"
  ]
}
``` 