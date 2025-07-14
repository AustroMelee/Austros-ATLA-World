---
type: character
---

## 🖼️ UI - CARD VIEW

```md
- Name: Ursa
- Nation: Fire Nation
- Short Description: The kind-hearted mother of Zuko and Azula, and wife of Prince Ozai. Her mysterious banishment from the Fire Nation is a driving force in her children's lives.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Born in the small town of Hira'a, Ursa's life was forcibly changed when she was made to marry Prince Ozai. A loving mother caught in a web of royal intrigue, she made a terrible bargain to save her son Zuko's life, resulting in her banishment and the murder of Fire Lord Azulon. To escape her painful past, she had her memories and face changed by a spirit, living a new life as "Noriko" until her children finally found her.

### ✨ Narrative Highlights

- Granddaughter of Avatar Roku, fulfilling a prophecy by marrying into the royal family.
- Conspired with Ozai to poison Fire Lord Azulon in order to save Zuko's life.
- Was banished and had her memory and face changed by the Mother of Faces.
- Reunited with Zuko years later and had her memories and identity restored.

### 🎭 Role in the Story

A mysterious and tragic figure whose absence haunts her children, acting as a symbol of lost love and the catalyst for Zuko's quest for truth.

### 🤝 Relationships

- **Zuko** – Son.
- **Azula** – Daughter.
- **Ozai** – Husband, former.
- **Noren / Ikem** – Husband, first love.
- **Kiyi** – Daughter.
- **Roku** – Grandfather.

### 🌟 Notable Traits

- Kind and loving.
- Protective, brave, and cunning.
- Pragmatic and haunted by her past.

### 💬 Notable Quotes

- "Everything I've done, I've done to protect you."
- "Remember this, Zuko. No matter how things may seem to change, never forget who you are."
- "My only fault was not loving you enough." (to Azula)
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - URSA

---

## 🪪 Identity & Demographics

```json
{
  "id": "ursa",
  "fullName": "Ursa",
  "titles": ["Princess"],
  "aliases": ["Noriko"],
  "species": "human",
  "gender": "female",
  "ageChronological": 40,
  "ageBiological": 40,
  "ageRange": "adult",
  "birthDate": "c. 64 AG",
  "deathDate": null,
  "nationality": "Fire Nation",
  "ethnicity": "Fire Nation",
  "nativeLocation": "Hira'a",
  "currentLocation": "Fire Nation Capital",
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
  "nonBendingSkills": ["herbalism", "poison-making", "acting"],
  "uniqueTechniques": ["crafting untraceable poison"],
  "powerMetrics": {
    "rawPower": 1,
    "technicalSkill": 7,
    "strategicAptitude": 8
  },
  "combatStyle": "evasive",
  "vulnerabilities": ["love for her children", "fear of Ozai"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Successfully conspired to assassinate Fire Lord Azulon",
    "Tricked Ozai into revealing he read her mail",
    "Persuaded the Mother of Faces to change her identity"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Fire Nation Royal Family"],
  "pastAffiliations": ["Hira'a Acting Troupe"],
  "allegianceHistory": [],
  "isRoyalty": true,
  "politicalPower": "none",
  "politicalLeanings": [],
  "moralAlignment": "chaotic good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "catalyst",
  "screenTimeLevel": "minor",
  "firstAppearance": "207-Zuko-Alone",
  "finalAppearance": "Graphic Novel: Ashes of the Academy",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "mystery", "status": "completed", "summary": "Her mysterious disappearance and Zuko's subsequent quest to find her and learn the truth." }
  ],
  "keyTropes": ["The Lost Lenore", "Mama Bear", "The Chessmaster (briefly)", "Deal with the Devil", "Identity Amnesia", "Arranged Marriage"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender",
      "role": "supporting",
      "focus": "Appearing in flashbacks as a loving mother and a key figure in Zuko's past and trauma.",
      "keyEpisodes": ["207", "301"]
    },
    {
      "era": "Graphic Novels (The Search)",
      "role": "protagonist",
      "focus": "Her story is revealed, including her deal with Ozai, banishment, and new life as Noriko.",
      "keyEpisodes": []
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "zuko", "relationshipType": "family", "status": "positive", "history": "Her beloved son, for whom she sacrificed everything." },
    { "characterId": "azula", "relationshipType": "family", "status": "complicated", "history": "Her daughter, whose cruelty she struggled to understand and whose psyche was broken by her absence." },
    { "characterId": "ozai", "relationshipType": "enemy", "status": "resolved", "history": "Her abusive husband whom she was forced to marry and later conspired against." },
    { "characterId": "noren-ikem", "relationshipType": "romantic", "status": "positive", "history": "Her first love, with whom she reunited and started a new family." },
    { "characterId": "kiyi", "relationshipType": "family", "status": "positive", "history": "Her daughter from her second marriage." },
    { "characterId": "roku", "relationshipType": "family", "status": "neutral", "history": "Her maternal grandfather." },
    { "characterId": "mother-of-faces", "relationshipType": "ally", "status": "neutral", "history": "The spirit who granted her a new face and identity." }
  ],
  "groupMemberships": [],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["loving", "protective", "kind", "cunning", "brave"],
  "negativeTraits": ["deceptive (when necessary)"],
  "motivations": ["protecting her children", "love", "escaping a painful past"],
  "fears": ["Ozai", "losing her children"],
  "internalConflicts": ["her duty to the royal family vs. her love for her children", "the desire to forget vs. the responsibility to remember"],
  "emotionalWounds": ["forced marriage", "abusive relationship", "banishment and separation from her children"],
  "copingMechanisms": ["secrecy", "making deals", "escaping her identity"],
  "worldview": "Believes a mother's love and duty to protect her children supersedes all other obligations, including law and tradition."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Gold eyes"],
  "outfitStyles": ["Fire Nation royal robes", "Fire Nation commoner attire"],
  "signaturePossessions": ["Theater masks"],
  "ageProgression": false,
  "voiceActor": ["Jen Cohn"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "No matter how things may seem to change, never forget who you are.",
    "Zuko, please, my love, listen to me. Everything I've done, I've done to protect you."
  ],
  "speakingStyle": "formal",
  "linguisticQuirks": ["Speaks with a gentle, motherly tone"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Caregiver",
  "thematicKeywords": ["motherhood", "sacrifice", "love", "secrets", "identity", "memory", "abuse", "poison", "banishment"],
  "tagCategories": {
    "narrativeTags": ["mama bear", "the lost lenore", "mystery character", "identity amnesia", "arranged marriage"],
    "combatTags": ["non-bender", "herbalist", "poisoner"],
    "relationshipTags": ["mother of Zuko", "mother of Azula", "wife of Ozai", "wife of Noren", "granddaughter of Roku"],
    "emotionTags": ["loving", "protective", "kind", "cunning", "haunted"],
    "politicalTags": ["princess", "traitor (amnestied)"],
    "arcTags": ["banished from Fire Nation", "poisoned Azulon", "found by Zuko", "regained memory"],
    "worldTags": ["Fire Nation Royal Family", "Hira'a", "Mother of Faces"],
    "triviaTags": ["master herbalist", "changed her face", "had a second family", "confronted Ozai in prison"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["zuko", "azula", "ozai", "roku", "iroh", "noren-ikem", "kiyi", "mother-of-faces"],
  "filterWeight": 80,
  "canonicalImportance": "primary",
  "dataCompletenessScore": 1.0,
  "searchableKeywords": ["ursa", "noriko", "mother", "zuko", "azula", "ozai", "roku", "banished", "poison", "search", "face"],
  "fuzzySynonyms": ["zuko's mom", "the lost princess", "lady ursa", "noriko"],
  "isSuggestedInXContext": []
}
```