---
type: character
---

## 🖼️ UI - CARD VIEW

```md
- Name: Haru
- Nation: Earth Kingdom
- Short Description: A thoughtful and idealistic earthbender, Haru overcame oppression and imprisonment to become a courageous fighter for the Earth Kingdom, always striving to use his bending to build rather than destroy.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Haru grew up in a mining village under Fire Nation occupation, forced to hide his earthbending until Team Avatar inspired him to fight back. After escaping a prison rig with his father Tyro, Haru joined the anti-Fire Nation rebellion, later fighting in the Day of Black Sun invasion. Though a capable warrior, Haru's true desire is to create and build, not to wage war, reflecting his philosophical and compassionate nature.

### ✨ Narrative Highlights

- Imprisoned for earthbending and led a breakout with Team Avatar and his father.
- Joined "Team Tyro" and fought in the Earth Kingdom resistance.
- Participated in the Day of Black Sun invasion and escaped capture with Team Avatar.
- Reunited with his father and friends after the war.

### 🎭 Role in the Story

A supporting character whose journey from fearful youth to principled fighter highlights the cost of war and the hope for a better future.

### 🤝 Relationships

- **Tyro** – Father, mentor, and fellow rebel leader.
- **Team Avatar** – Allies and friends who inspired his courage.
- **The Duke, Teo, Hakoda, Boqin** – Fellow resistance fighters and friends.

### 🌟 Personality Traits

- Idealistic, thoughtful, compassionate, courageous, philosophical, creative.

### 💬 Notable Quotes

- "For years, I've been hiding my earthbending, out of fear of getting arrested by the Fire Nation… [...] To be honest... getting arrested was a gift. It freed me. After getting arrested, I didn't have to hide anymore. But now... Now that I'm seeing the ugliness of war firsthand... It's not that I don't want the Fire Nation to be defeated, but... I just want to create things... I'm not sure I'm cut out to be a soldier."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - HARU

---

## 🪪 Identity & Demographics

```json
{
  "id": "haru",
  "fullName": "Haru",
  "titles": [],
  "aliases": [],
  "species": "human",
  "gender": "male",
  "ageChronological": 17,
  "ageBiological": 17,
  "ageRange": "teen",
  "birthDate": null,
  "deathDate": null,
  "nationality": "Earth Kingdom",
  "ethnicity": "Earth Kingdom",
  "nativeLocation": "Mining village, Earth Kingdom",
  "currentLocation": "Earth Kingdom",
  "socioeconomicStanding": "commoner",
  "languagesSpoken": ["Standard Language"]
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": true,
  "bendingElement": "earth",
  "bendingProficiency": "proficient",
  "advancedBending": [],
  "nonBendingSkills": ["mining", "teamwork", "inspirational speeches"],
  "uniqueTechniques": ["rapid small rock manipulation", "earth shields", "coal compression"],
  "powerMetrics": {
    "rawPower": 5,
    "technicalSkill": 6,
    "strategicAptitude": 6
  },
  "combatStyle": "defensive",
  "vulnerabilities": ["insecurity", "reluctance to harm others", "haunted by war"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Led a prison breakout with Team Avatar",
    "Fought in the Day of Black Sun invasion",
    "Helped liberate his village and others from Fire Nation control"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Earth Kingdom", "Team Tyro", "Hakoda's forces"],
  "pastAffiliations": ["Fire Nation prisoner"],
  "allegianceHistory": [
    { "affiliation": "Fire Nation prisoner", "startDate": "99 AG", "endDate": "99 AG", "reasonForLeaving": "Escaped with Team Avatar" },
    { "affiliation": "Team Tyro", "startDate": "99 AG", "endDate": null, "reasonForLeaving": null }
  ],
  "isRoyalty": false,
  "politicalPower": "none",
  "politicalLeanings": ["resistance", "builder"],
  "moralAlignment": "neutral good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "supporting",
  "screenTimeLevel": "minor",
  "firstAppearance": "106-Imprisoned",
  "finalAppearance": "Avatar: Generations",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "growth", "status": "completed", "summary": "Haru overcomes fear and oppression to become a courageous fighter, but longs to create rather than destroy." }
  ],
  "keyTropes": ["The Reluctant Warrior", "The Builder", "Resistance Fighter", "Philosopher"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 1",
      "role": "supporting",
      "focus": "Imprisoned for earthbending, prison breakout, joining the resistance.",
      "keyEpisodes": ["Imprisoned"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "supporting",
      "focus": "Fighting in the Day of Black Sun invasion, escape with Team Avatar, postwar reunions.",
      "keyEpisodes": ["The Day of Black Sun, Part 1: The Invasion", "The Day of Black Sun, Part 2: The Eclipse", "The Western Air Temple", "Sozin's Comet, Part 4: Avatar Aang"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "tyro", "relationshipType": "family", "status": "positive", "history": "Father and mentor, led the resistance together." },
    { "characterId": "katara", "relationshipType": "ally", "status": "positive", "history": "Inspired him to fight back and helped engineer the prison breakout." },
    { "characterId": "team-avatar", "relationshipType": "ally", "status": "positive", "history": "Friends and fellow fighters in the war." },
    { "characterId": "the-duke", "relationshipType": "ally", "status": "positive", "history": "Became friends after the Day of Black Sun." },
    { "characterId": "teo", "relationshipType": "ally", "status": "positive", "history": "Became friends after the Day of Black Sun." },
    { "characterId": "hakoda", "relationshipType": "ally", "status": "positive", "history": "Fought together in the invasion." },
    { "characterId": "boqin", "relationshipType": "ally", "status": "positive", "history": "Fought together in the resistance." }
  ],
  "groupMemberships": [
    { "groupId": "team-tyro", "roleInGroup": "fighter" }
  ],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["thoughtful", "compassionate", "courageous", "idealistic", "creative"],
  "negativeTraits": ["insecure", "reluctant to harm", "haunted by war", "self-doubting"],
  "motivations": ["freedom", "family", "creation", "hope"],
  "fears": ["hurting others", "losing loved ones", "being forced to fight"],
  "internalConflicts": ["builder vs. soldier", "fear vs. courage"],
  "emotionalWounds": ["imprisonment", "war trauma"],
  "copingMechanisms": ["philosophy", "teamwork", "humor"],
  "worldview": "Believes that true strength is found in building and protecting, not destroying."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Green eyes", "brown hair", "light tan skin", "mustache (Book 3)"],
  "outfitStyles": ["Earth Kingdom villager clothing", "militia attire"],
  "signaturePossessions": ["earthbending wristbands"],
  "ageProgression": true,
  "voiceActor": ["Michael Dow", "Vincent Tong"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "For years, I've been hiding my earthbending, out of fear of getting arrested by the Fire Nation… [...] To be honest... getting arrested was a gift. It freed me. After getting arrested, I didn't have to hide anymore. But now... Now that I'm seeing the ugliness of war firsthand... It's not that I don't want the Fire Nation to be defeated, but... I just want to create things... I'm not sure I'm cut out to be a soldier."
  ],
  "speakingStyle": "thoughtful",
  "linguisticQuirks": ["philosophical musings", "gentle tone"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Builder",
  "thematicKeywords": ["freedom", "creation", "resistance", "hope", "war", "family", "compassion"],
  "tagCategories": {
    "narrativeTags": ["resistance fighter", "reluctant warrior", "builder", "supporting character"],
    "combatTags": ["earthbender", "defensive", "teamwork"],
    "relationshipTags": ["son of Tyro", "ally of Team Avatar", "friend of Teo and The Duke"],
    "emotionTags": ["thoughtful", "compassionate", "insecure", "courageous"],
    "politicalTags": ["Earth Kingdom", "resistance"],
    "arcTags": ["prison breakout", "invasion of Fire Nation", "postwar reunion"],
    "worldTags": ["Earth Kingdom", "prison rig", "Team Tyro"],
    "triviaTags": ["mustache", "earthbending with hands", "philosopher"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["tyro", "katara", "team-avatar", "the-duke", "teo", "hakoda", "boqin"],
  "filterWeight": 30,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.94,
  "searchableKeywords": ["haru", "earthbender", "resistance", "builder", "imprisoned", "team tyro"],
  "fuzzySynonyms": ["reluctant warrior", "earth kingdom builder", "philosopher bender"],
  "isSuggestedInXContext": []
}
```
