---
type: character
---

## 🖼️ UI - CARD VIEW

```md
- Name: Mai
- Nation: Fire Nation
- Short Description: A stoic and skilled non-bender from a privileged Fire Nation family. Mai is a master of knife-throwing who serves as a key member of Azula's team and is Zuko's primary love interest.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Raised to be a perfectly behaved and quiet daughter of a prominent politician, Mai developed a deeply apathetic and emotionally distant personality. Recruited by Princess Azula for her deadly marksmanship, she becomes a formidable foe. However, her deep-seated love for Prince Zuko ultimately forces her to make a choice between her fear of Azula and her loyalty to him, a decision that changes the course of her life and the war.

### ✨ Narrative Highlights

- Recruited into Azula's elite team to hunt the Avatar and Zuko.
- Rekindled her childhood crush into a serious relationship with Prince Zuko.
- Defied Princess Azula at the Boiling Rock, declaring "I love Zuko more than I fear you".
- Aided Zuko against her own father's traitorous New Ozai Society after the war.

### 🎭 Role in the Story

A secondary antagonist turned ally whose character arc explores how love can triumph over fear and apathy.

### 🤝 Relationships

- **Zuko** – Boyfriend, former.
- **Azula** – Commander, former.
- **Ty Lee** – Friend.
- **Ukano** – Father.
- **Kei Lo** – Boyfriend, former.

### 🌟 Notable Traits

- Apathetic and bored.
- Stoic, emotionally repressed, and loyal (to Zuko).
- Brave and decisive when it counts.

### 💬 Notable Quotes

- "I love Zuko more than I fear you."
- "You're so beautiful when you hate the world."
- "Please tell me you're not here to rescue me."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - MAI

---

## 🪪 Identity & Demographics

```json
{
  "id": "mai",
  "fullName": "Mai",
  "role": "Noblewoman",
  "titles": [],
  "aliases": [],
  "species": "human",
  "gender": "female",
  "ageChronological": 17,
  "ageBiological": 17,
  "ageRange": "teen",
  "birthDate": "85 AG",
  "deathDate": null,
  "nationality": "Fire Nation",
  "ethnicity": "Fire Nation",
  "nativeLocation": "Fire Nation",
  "currentLocation": "Fire Nation",
  "socioeconomicStanding": "nobility",
  "languagesSpoken": ["Standard Language"]
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": false,
  "bendingElement": null,
  "bendingProficiency": "novice",
  "advancedBending": [],
  "nonBendingSkills": ["shuriken-jutsu (knife throwing)", "marksmanship", "stealth", "acrobatics"],
  "uniqueTechniques": ["concealed spring-loaded stiletto holsters"],
  "powerMetrics": {
    "rawPower": 1,
    "technicalSkill": 9,
    "strategicAptitude": 6
  },
  "combatStyle": "technical",
  "vulnerabilities": ["emotional attachment to Zuko", "powerful benders at close range"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Betrayed Azula and survived",
    "Held her own against multiple benders",
    "Aided in Zuko's escape from the Boiling Rock",
    "Mastered knife-throwing out of boredom"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Fire Nation", "Royal Fire Academy for Girls"],
  "pastAffiliations": ["Azula's team"],
  "allegianceHistory": [
    { "affiliation": "Azula's team", "startDate": "100 AG", "endDate": "100 AG", "reasonForLeaving": "Betrayed Azula to save Zuko." }
  ],
  "isRoyalty": false,
  "politicalPower": "influential",
  "politicalLeanings": ["apolitical (initially)", "reformist (later)"],
  "moralAlignment": "true neutral",
  "moralCompassDrift": true
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "love interest",
  "screenTimeLevel": "supporting",
  "firstAppearance": "203-Return-to-Omashu",
  "finalAppearance": "Graphic Novel: Ashes of the Academy",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "growth", "status": "completed", "summary": "Moving from detached apathy to actively choosing a side based on love rather than fear or duty." }
  ],
  "keyTropes": ["The Stoic", "The Cynic", "Deadpan Snarker", "Love Redeems", "Heel-Face Turn", "The Goth"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "villain",
      "focus": "Serving as a skilled and dangerous member of Azula's team while hunting the Avatar.",
      "keyEpisodes": ["203", "208", "213", "220"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "hero",
      "focus": "Rekindling her romance with Zuko, confronting her apathy, and ultimately betraying Azula.",
      "keyEpisodes": ["301", "305", "315"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "zuko", "relationshipType": "romantic", "status": "complicated", "history": "Her childhood crush, boyfriend, and the one person she truly cares about." },
    { "characterId": "azula", "relationshipType": "enemy", "status": "negative", "history": "Her former commander, whom she followed out of a mix of fear and duty, but ultimately defied." },
    { "characterId": "ty-lee", "relationshipType": "ally", "status": "positive", "history": "Her friend and teammate, whose cheerful personality contrasts with her own." },
    { "characterId": "ukano", "relationshipType": "family", "status": "negative", "history": "Her ambitious father whose political aspirations shaped her repressive childhood." },
    { "characterId": "kei-lo", "relationshipType": "romantic", "status": "resolved", "history": "A double-agent she pretended to date but developed feelings for." }
  ],
  "groupMemberships": [
    { "groupId": "azulas-team", "roleInGroup": "specialist" }
  ],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["calm", "level-headed", "brave", "honest (bluntly)", "loyal (to Zuko)"],
  "negativeTraits": ["apathetic", "gloomy", "emotionally repressed", "cynical", "pessimistic"],
  "motivations": ["Zuko", "escaping boredom"],
  "fears": ["Azula (formerly)"],
  "internalConflicts": ["apathy vs. love", "fear vs. loyalty"],
  "emotionalWounds": ["emotional neglect", "being forced to behave perfectly"],
  "copingMechanisms": ["stoicism", "apathy", "sarcasm", "knife-throwing"],
  "worldview": "Believes that most of life is dull and uninteresting, with rare exceptions for things—and people—worth caring about."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Elaborate hair buns", "tawny eyes", "gloomy expression", "dark lipstick"],
  "outfitStyles": ["Fire Nation noble attire", "beachwear", "Kyoshi Warrior disguise"],
  "signaturePossessions": ["Stilettos", "shuriken", "knives"],
  "ageProgression": false,
  "voiceActor": ["Cricket Leigh"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "I love Zuko more than I fear you.",
    "There is no fathoming my depths of passion for the Fire Nation.",
    "Orange is such an awful color."
  ],
  "speakingStyle": "stoic",
  "linguisticQuirks": ["Monotone delivery", "deadpan and dry wit"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Loner",
  "thematicKeywords": ["apathy", "love", "fear", "loyalty", "boredom", "betrayal", "stoicism", "emotion"],
  "tagCategories": {
    "narrativeTags": ["secondary antagonist", "love interest", "heel-face turn", "deadpan snarker", "the stoic", "the goth"],
    "combatTags": ["non-bender", "knife-thrower", "markswoman", "shuriken", "stiletto"],
    "relationshipTags": ["girlfriend of Zuko", "friend of Ty Lee", "enemy of Azula", "daughter of Ukano"],
    "emotionTags": ["apathetic", "bored", "gloomy", "stoic", "loyal", "passionate (internally)"],
    "politicalTags": ["nobility", "traitor (amnestied)", "governor's daughter"],
    "arcTags": ["betrayed Azula", "rekindled romance with Zuko", "Boiling Rock incident", "helped Zuko"],
    "worldTags": ["Fire Nation", "Azula's team", "New Ozai", "Royal Fire Academy"],
    "triviaTags": ["hates orange", "skilled at shuriken-jutsu", "parents are politicians", "broke up with Zuko"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["zuko", "azula", "ty-lee", "ukano", "kei-lo"],
  "filterWeight": 80,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.98,
  "searchableKeywords": ["mai", "knife", "knives", "stiletto", "goth", "bored", "apathetic", "zuko", "azula", "boiling", "rock"],
  "fuzzySynonyms": ["zuko's girlfriend", "the knife thrower", "the gloomy girl", "the one who betrayed azula"],
  "isSuggestedInXContext": []
}
```