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
- Name: Team Avatar
- Affiliation: Four Nations
- Group Type: organization
- Short Description: Avatar Aang and his companions on their journey to master the four elements, end the Hundred Year War, and restore balance to the world.
```

---

## 📖 UI - EXPANDED VIEW

*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

Team Avatar is the name given to the group of friends and allies who accompanied Avatar Aang on his quest to defeat Fire Lord Ozai. Originating with Aang, Katara, and Sokka in the Southern Water Tribe, the group grew to include members from every nation, including the earthbender Toph Beifong, the Kyoshi Warrior Suki, and former Fire Nation Prince Zuko. Together, they traveled the world, sought out bending masters, aided those in need, and formed the core resistance against the Fire Nation's conquest.

### ✨ Historical Milestones

- **Formation:** Aang, Katara, and Sokka unite at the Southern Water Tribe.
- **Journey to the North:** The team travels to the Northern Water Tribe, where Aang and Katara master waterbending and defend the city from Admiral Zhao's siege.
- **Recruiting Toph:** The group finds Toph Beifong, a blind earthbending prodigy, who becomes Aang's earthbending master.
- **Fall of Ba Sing Se:** The team uncovers the Dai Li conspiracy but is ultimately defeated by Azula, resulting in Aang's temporary death.
- **Day of Black Sun:** Leads a failed invasion of the Fire Nation Capital.
- **Recruiting Zuko:** A reformed Prince Zuko joins the team at the Western Air Temple to teach Aang firebending.
- **Final Battles:** The team splits up to confront Fire Lord Ozai, Princess Azula, and the Fire Nation airship fleet, successfully ending the Hundred Year War.

### 🎭 Role in the Narrative

Team Avatar is the central protagonist group of the series. Their journey to help Aang master the elements and fulfill his destiny drives the entire plot. Their internal dynamics, friendships, and growth are the emotional core of the story, representing the unity of the four nations and the hope for a balanced world.

### 🌟 Notable Members

- Aang
- Katara
- Sokka
- Toph Beifong
- Suki
- Zuko
- Appa
- Momo
```

```


## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "team-avatar",
  "name": "Team Avatar",
  "slug": "team-avatar",
  "type": "group",
  "nation": "Four Nations",
  "description": "The group of companions who traveled with Avatar Aang during his quest to master the four elements and end the Hundred Year War. The team is notable for having members from every nation and mastery of all bending arts.",
  "groupType": "organization",
  "affiliation": "Four Nations",
  "ideology": "Restoring world balance, Peace, Friendship, Helping others",
  "baseOfOperations": "Mobile (Appa's back)",
  "foundingDate": "100 AG",
  "dissolutionDate": null,
  "leadership": [
    "Aang"
  ],
  "membership": [
    "Aang",
    "Katara",
    "Sokka",
    "Toph Beifong",
    "Suki",
    "Zuko",
    "Appa",
    "Momo"
  ],
  "notableMembers": [
    "Aang",
    "Katara",
    "Sokka",
    "Toph Beifong",
    "Zuko",
    "Suki"
  ],
  "size": 8,
  "image": "team-avatar.jpg",
  "tags": [
    "protagonists",
    "main_characters",
    "four_nations",
    "heroes",
    "avatar_aang"
  ],
  "searchAliases": [
    "Aang Gang",
    "Boomeraang Squad",
    "Fearsome Foursome"
  ]
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Siege of the North",
    "Battle of the Drill",
    "Uncovering the Ba Sing Se Conspiracy",
    "Invasion of the Fire Nation (Day of Black Sun)",
    "Escape from the Boiling Rock",
    "Defeat of Fire Lord Ozai"
  ],
  "alliances": [
    "Order of the White Lotus",
    "Southern Water Tribe",
    "Northern Water Tribe",
    "Earth Kingdom Resistance",
    "Kyoshi Warriors"
  ],
  "rivals": [
    "Fire Nation Military",
    "Azula",
    "Zuko (formerly)",
    "Admiral Zhao",
    "Long Feng",
    "Dai Li"
  ],
  "relatedLocations": [
    "Southern Water Tribe",
    "Northern Water Tribe",
    "Omashu",
    "Ba Sing Se",
    "Western Air Temple",
    "Fire Nation Capital"
  ],
  "historicalMilestones": [
    "Reawakening of the Avatar after 100 years",
    "Rediscovery of metalbending by Toph Beifong",
    "Leading the invasion on the Day of Black Sun",
    "Successfully ending the Hundred Year War"
  ],
  "roleInNarrative": [
    "The primary protagonist group driving the main plot",
    "Symbolizes the unity and cooperation of the four nations",
    "Responsible for training the Avatar and defeating the Fire Lord"
  ],
  "politicalInfluence": [
    "Directly influenced Earth King Kuei to recognize the war",
    "Instrumental in crowning the new Fire Lord Zuko",
    "Helped establish peace and the Harmony Restoration Movement post-war"
  ],
  "militaryCapabilities": [
    "Mastery of all four bending arts (Aang, Katara, Toph, Zuko)",
    "Exceptional strategic and inventive skills (Sokka)",
    "Elite non-bending combat skills (Sokka, Suki)",
    "Aerial superiority and transport via Appa the sky bison",
    "Capable of infiltrating high-security locations and defeating large forces"
  ]
}
```
