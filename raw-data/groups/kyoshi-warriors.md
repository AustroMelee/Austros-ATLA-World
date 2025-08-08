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
- Name: Kyoshi Warriors
- Affiliation: Earth Kingdom
- Group Type: military
- Short Description: An all-female group of elite non-bending fighters from Kyoshi Island who model their fighting style and attire after their founder, Avatar Kyoshi.
```

---

## 📖 UI - EXPANDED VIEW

*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The Kyoshi Warriors are an order of elite female fighters dedicated to protecting their home, Kyoshi Island. Founded by Avatar Kyoshi herself, they honor her legacy by wearing her iconic kabuki-style makeup and green armor. Despite being non-benders, they are formidable combatants, utilizing metal fans and a unique fighting style that turns an opponent's strength against them. Led by Suki, they are initially isolationist but later join the war effort, becoming valuable allies to Team Avatar.

### ✨ Historical Milestones

- **Founding:** Established by Avatar Kyoshi to protect her home island.
- **Encounter with Team Avatar:** Initially capture the team but later befriend them, with Suki training Sokka.
- **Joining the War:** Left Kyoshi Island to help fight the Fire Nation, aiding refugees across the Serpent's Pass.
- **Capture and Imprisonment:** Suki and the other warriors were captured by Azula's forces and imprisoned at the Boiling Rock.
- **Liberation and Final Battle:** Suki was rescued from the Boiling Rock by Sokka and Zuko, and she and the other warriors later assisted in disabling the Fire Nation airship fleet during the finale.

### 🎭 Role in the Narrative

The Kyoshi Warriors serve as important recurring allies to Team Avatar. They represent the strength and capability of non-benders in a world dominated by bending. Their leader, Suki, becomes a key member of the group and Sokka's love interest. Their journey from isolationist protectors to active participants in the war demonstrates the conflict's global reach and the need for everyone to contribute to the fight for balance.

### 🌟 Notable Members

- Suki (Leader)
- Sokka (Honorary member, only male trained)

```

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "kyoshi-warriors",
  "name": "Kyoshi Warriors",
  "slug": "kyoshi-warriors",
  "type": "group",
  "nation": "Earth Kingdom",
  "description": "An all-female group of fighters from Kyoshi Island. Their fighting style and clothing mimic those of their founder, Avatar Kyoshi. They use metal fans and are skilled non-bending combatants.",
  "groupType": "military",
  "affiliation": "Earth Kingdom",
  "ideology": "Protection of Kyoshi Island, Honoring Avatar Kyoshi, Self-defense",
  "baseOfOperations": "Kyoshi Island",
  "foundingDate": "Era of Kyoshi",
  "dissolutionDate": null,
  "leadership": [
    "Suki"
  ],
  "membership": [
    "Female warriors of Kyoshi Island",
    "Sokka (honorary)"
  ],
  "notableMembers": [
    "Suki"
  ],
  "size": null,
  "image": "kyoshi-warriors.jpg",
  "tags": [
    "warriors",
    "non-benders",
    "earth_kingdom",
    "kyoshi_island",
    "allies",
    "female_fighters"
  ],
  "searchAliases": [
    "Warriors of Kyoshi"
  ]
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Training Sokka in their fighting style",
    "Assisting refugees across the Serpent's Pass",
    "Imprisonment at the Boiling Rock",
    "Disabling the Fire Nation airship fleet during Sozin's Comet"
  ],
  "alliances": [
    "Team Avatar",
    "Earth Kingdom"
  ],
  "rivals": [
    "Fire Nation Military",
    "Azula"
  ],
  "relatedLocations": [
    "Kyoshi Island",
    "Serpent's Pass",
    "The Boiling Rock"
  ],
  "historicalMilestones": [
    "Maintaining the legacy of Avatar Kyoshi for centuries",
    "Joining the Hundred Year War as an independent fighting force",
    "Playing a key role in the final battle against Phoenix King Ozai"
  ],
  "roleInNarrative": [
    "Serve as crucial allies to Team Avatar",
    "Showcase the power and importance of non-benders",
    "Provide a romantic storyline for Sokka through their leader, Suki"
  ],
  "politicalInfluence": [
    "Primary defense force and authority on the semi-autonomous Kyoshi Island"
  ],
  "militaryCapabilities": [
    "Elite non-bending martial arts",
    "Use of metal fans, katanas, and wrist shields",
    "Fighting style based on turning an opponent's strength against them",
    "Intimidation through traditional armor and makeup",
    "Stealth and agility"
  ]
}
```
