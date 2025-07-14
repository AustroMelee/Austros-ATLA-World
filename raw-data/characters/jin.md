---
type: character
---

## 🖼️ UI - CARD VIEW

```md
- Name: Jin
- Nation: Earth Kingdom
- Short Description: A kind-hearted refugee and earthbender from Ba Sing Se, Jin is known for her resilience, compassion, and her brief but memorable connection with Zuko during the Hundred Year War.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Jin was born in Daying, Earth Kingdom, and became a refugee after her village was destroyed by the Fire Nation. She moved to Ba Sing Se with her grandfather, working hard to support him while attending school. Despite her hardships, Jin remained optimistic and compassionate, forming close bonds with friends and eventually developing a crush on Zuko. Her story is one of resilience, hope, and the search for connection in a city torn by war.

### ✨ Narrative Highlights

- Survived the destruction of her home village and adapted to life as a refugee in Ba Sing Se.
- Supported her ailing grandfather while attending a literature academy on scholarship.
- Developed a close friendship with Susu and found work at Wen Bakery.
- Became entangled in Ba Sing Se's criminal underworld to help her friend.
- Shared a memorable date with Zuko, leaving a lasting impression on both.

### 🎭 Role in the Story

A supporting character whose warmth and determination provide a glimpse into the lives of ordinary citizens affected by the war.

### 🤝 Relationships

- **Gong-gong** – Grandfather and mentor, source of wisdom and hardship.
- **Susu Wen** – Close friend and confidante, employer at Wen Bakery.
- **Zuko (as Lee)** – Brief romantic interest, shared a meaningful connection.
- **Iroh (as Mushi)** – Acquaintance through Zuko, supportive figure.

### 🌟 Personality Traits

- Compassionate, resilient, optimistic, resourceful, loyal, romantic.

### 💬 Notable Quotes

- "I have something for you, too. Now it's your turn to close your eyes."
- "Sometimes, you just have to believe things will get better."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - JIN

---

## 🪪 Identity & Demographics

```json
{
  "id": "jin",
  "fullName": "Jin",
  "titles": [],
  "aliases": [],
  "species": "human",
  "gender": "female",
  "ageChronological": 16,
  "ageBiological": 16,
  "ageRange": "teen",
  "birthDate": "84 AG",
  "deathDate": null,
  "nationality": "Earth Kingdom",
  "ethnicity": "Earth Kingdom",
  "nativeLocation": "Daying, Earth Kingdom",
  "currentLocation": "Lower Ring, Ba Sing Se",
  "socioeconomicStanding": "refugee",
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
  "nonBendingSkills": ["baking", "delivery work", "calligraphy", "resourcefulness"],
  "uniqueTechniques": [],
  "powerMetrics": {
    "rawPower": 3,
    "technicalSkill": 4,
    "strategicAptitude": 5
  },
  "combatStyle": "defensive",
  "vulnerabilities": ["emotional hardship", "lack of formal training", "attachment to loved ones"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Survived as a refugee in Ba Sing Se",
    "Protected and cared for her grandfather",
    "Assisted friends in times of need",
    "Stood up to adversity despite personal loss"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Wen Bakery", "Ba Sing Se Lower Ring"],
  "pastAffiliations": ["Daying Village"],
  "allegianceHistory": [
    { "affiliation": "Daying Village", "startDate": "84 AG", "endDate": "?", "reasonForLeaving": "Village destroyed by Fire Nation" },
    { "affiliation": "Ba Sing Se Lower Ring", "startDate": "?", "endDate": null, "reasonForLeaving": null }
  ],
  "isRoyalty": false,
  "politicalPower": "none",
  "politicalLeanings": ["neutral", "survivor"],
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
  "firstAppearance": "Tales of Ba Sing Se",
  "finalAppearance": "City of Echoes",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "growth", "status": "completed", "summary": "Jin adapts to life in Ba Sing Se and finds hope and connection despite hardship." }
  ],
  "keyTropes": ["The Everywoman", "Refugee", "Romantic Interest", "Survivor"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "supporting",
      "focus": "Life as a refugee, friendship, and her date with Zuko.",
      "keyEpisodes": ["Tales of Ba Sing Se"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "background",
      "focus": "Surviving the fall of Ba Sing Se, brief encounter with Zuko and Mai.",
      "keyEpisodes": ["The Day of Black Sun", "City of Echoes"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "zuko", "relationshipType": "romantic", "status": "complicated", "history": "Shared a brief but meaningful connection during Zuko's time in Ba Sing Se." },
    { "characterId": "iroh", "relationshipType": "ally", "status": "positive", "history": "Supportive figure through Zuko." },
    { "characterId": "susu-wen", "relationshipType": "ally", "status": "positive", "history": "Close friend and employer at Wen Bakery." },
    { "characterId": "gong-gong", "relationshipType": "family", "status": "positive", "history": "Grandfather and mentor, source of wisdom and hardship." }
  ],
  "groupMemberships": [
    { "groupId": "wen-bakery", "roleInGroup": "deliverywoman" }
  ],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["compassionate", "resilient", "optimistic", "resourceful", "loyal", "romantic"],
  "negativeTraits": ["self-sacrificing", "insecure", "overly trusting", "emotionally vulnerable"],
  "motivations": ["family", "friendship", "survival", "hope", "love"],
  "fears": ["losing loved ones", "abandonment", "failure"],
  "internalConflicts": ["duty to family vs. personal happiness", "trust vs. caution"],
  "emotionalWounds": ["loss of parents", "refugee trauma"],
  "copingMechanisms": ["work", "helping others", "optimism"],
  "worldview": "Believes that kindness and hope can endure even in the darkest times."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Dark olive green eyes", "brown hair", "light tan skin"],
  "outfitStyles": ["Ba Sing Se civilian clothing", "bakery delivery attire"],
  "signaturePossessions": ["Bakery delivery bag"],
  "ageProgression": false,
  "voiceActor": ["Marcella Lentz-Pope"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "I have something for you, too. Now it's your turn to close your eyes.",
    "Sometimes, you just have to believe things will get better."
  ],
  "speakingStyle": "casual",
  "linguisticQuirks": ["gentle tone", "hopeful phrasing"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Everywoman",
  "thematicKeywords": ["hope", "resilience", "love", "loss", "survival", "friendship", "refugee", "compassion"],
  "tagCategories": {
    "narrativeTags": ["refugee", "romantic interest", "survivor", "friend"],
    "combatTags": ["earthbender", "defensive"],
    "relationshipTags": ["friend of Susu", "granddaughter of Gong-gong", "romantic interest of Zuko"],
    "emotionTags": ["compassionate", "hopeful", "vulnerable", "resilient"],
    "politicalTags": ["refugee", "citizen of Ba Sing Se"],
    "arcTags": ["loss of home", "adaptation", "personal growth"],
    "worldTags": ["Ba Sing Se", "Wen Bakery", "Lower Ring"],
    "triviaTags": ["baker", "calligrapher", "Zuko's date"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["zuko", "iroh", "susu-wen", "gong-gong"],
  "filterWeight": 35,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.95,
  "searchableKeywords": ["jin", "ba sing se", "refugee", "earth kingdom", "zuko", "bakery", "hope", "survivor"],
  "fuzzySynonyms": ["zuko's date", "ba sing se girl", "earth kingdom refugee"],
  "isSuggestedInXContext": []
}
```
