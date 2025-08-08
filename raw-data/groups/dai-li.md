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
- Name: Dai Li
- Affiliation: Earth Kingdom (officially), Fire Nation (briefly)
- Group Type: secret society
- Short Description: The elite secret police of Ba Sing Se, founded to protect cultural heritage but later became a corrupt force for political control under Long Feng and briefly Princess Azula.
```

---

## 📖 UI - EXPANDED VIEW

*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

The Dai Li is the elite secret police force of Ba Sing Se, originally founded by Avatar Kyoshi to protect the city's cultural heritage. Over time, the organization became corrupt and ruthless. During the Hundred Year War, they fell under the control of Grand Secretariat Long Feng, enforcing a police state within the capital and suppressing all mention of the war. Their loyalty was so detached from the Earth Kingdom that they eventually sided with Princess Azula, aiding the Fire Nation in the successful Coup of Ba Sing Se.

### ✨ Historical Milestones

- **Founding:** Created by Avatar Kyoshi between 270 and 82 BG to preserve Ba Sing Se's culture after a peasant uprising.
- **Corruption:** Exploited by Long Feng to take control of Ba Sing Se, reducing the Earth King to a figurehead.
- **Conspiracy of Ba Sing Se:** Actively suppressed any mention of the Hundred Year War within the city walls and brainwashed dissidents under Lake Laogai.
- **Coup of Ba Sing Se:** Betrayed Long Feng to ally with Princess Azula, assisting the Fire Nation in conquering the city.
- **Allegiance to Azula:** Served as Princess Azula's personal bodyguards in the Fire Nation until being banished by her during a paranoid breakdown.

### 🎭 Role in the Narrative

The Dai Li serve as primary antagonists during the Ba Sing Se arc. They are the physical embodiment of the city's corruption, hindering Team Avatar's attempts to see the Earth King and enforcing Long Feng's conspiracy of silence about the war. Their formidable earthbending skills and ruthless tactics make them a significant threat, culminating in their critical role in Azula's defeat of Aang in the Crystal Catacombs.

### 🌟 Notable Members

- Long Feng (Leader, formerly)
- Azula (Leader, formerly)
```

```


## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

---

## 🧮 Organizational Profile

```json
{
  "id": "dai-li",
  "name": "Dai Li",
  "slug": "dai-li",
  "type": "group",
  "description": "The Dai Li is the elite secret police force of Ba Sing Se who work to capture, interrogate, and imprison political dissidents. Founded by Avatar Kyoshi, they became corrupt over time, serving the interests of Grand Secretariat Long Feng and briefly Princess Azula.",
  "groupType": "secret_society",
  "nation": "Earth Kingdom",
  "affiliation": "Earth Kingdom",
  "ideology": "Cultural preservation (originally), Authoritarianism, Political control",
  "baseOfOperations": "Ba Sing Se, Lake Laogai (formerly)",
  "foundingDate": "Between 270 and 82 BG",
  "dissolutionDate": null,
  "leadership": [
    "Avatar Kyoshi (Founder)",
    "Long Feng",
    "Azula"
  ],
  "membership": [
    "Elite earthbenders"
  ],
  "notableMembers": [
    "Long Feng"
  ],
  "size": null,
  "image": "dai-li.jpg",
  "tags": [
    "earthbending",
    "secret_police",
    "ba_sing_se",
    "earth_kingdom",
    "antagonists",
    "elite"
  ],
  "searchAliases": [
    "guardians of tradition",
    "cultural authority"
  ]
}
```

---

## 📜 Influence & Activities

```json
{
  "notableEvents": [
    "Founding by Avatar Kyoshi",
    "Night of Silenced Sages",
    "Conspiracy of Ba Sing Se",
    "Coup of Ba Sing Se"
  ],
  "alliances": [
    "Long Feng",
    "Fire Nation (briefly under Azula)"
  ],
  "rivals": [
    "Team Avatar",
    "Earth King Kuei",
    "Freedom Fighters"
  ],
  "relatedLocations": [
    "Ba Sing Se",
    "Lake Laogai",
    "Crystal Catacombs",
    "Fire Nation Capital"
  ],
  "historicalMilestones": [
    "Founded by an Avatar",
    "Seized control of the Earth Kingdom capital from within",
    "Betrayed their nation to assist in a foreign conquest"
  ],
  "roleInNarrative": [
    "Act as primary antagonists in Ba Sing Se",
    "Enforce the city's conspiracy of silence about the war",
    "Instrumental in the fall of Ba Sing Se and Aang's temporary defeat"
  ],
  "politicalInfluence": [
    "Effectively ruled Ba Sing Se under Long Feng",
    "Reduced the Earth King to a figurehead",
    "Capable of imprisoning high-ranking military officials (Council of Five)"
  ],
  "militaryCapabilities": [
    "Highly skilled and precise earthbending",
    "Stealth and espionage",
    "Use of rock gloves and shoes for enhanced mobility and combat",
    "Ability to cling to and travel along vertical surfaces and ceilings",
    "Use of surveyors' chains to restrain opponents",
    "Brainwashing and psychological conditioning"
  ]
}
```
