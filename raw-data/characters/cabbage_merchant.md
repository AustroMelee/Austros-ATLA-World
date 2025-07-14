# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - CABBAGE MERCHANT

---

## 🖼️ UI - CARD VIEW

```md
- Name: Cabbage Merchant
- Nation: Earth Kingdom
- Short Description: An endlessly unlucky but determined cabbage vendor, Cai is famous for his devotion to cabbages, his iconic exclamation, and his eventual rise as the founder of Cabbage Corp.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Cai, the Cabbage Merchant, began as a humble vendor from Gaoling, Earth Kingdom, whose cabbages were repeatedly destroyed by Team Avatar and others. Despite endless setbacks, his resilience and entrepreneurial spirit led him to found Cabbage Corp, a major company in Republic City. His journey is a testament to perseverance, family, and the power of never giving up on your dreams—or your cabbages.

### ✨ Narrative Highlights

- Suffered repeated destruction of his cabbage carts in Omashu, Ba Sing Se, and beyond.
- Coined the iconic catchphrase "My cabbages!"
- Hosted a cabbage feast for Team Avatar and the Fire Lord at the Jasmine Dragon.
- Founded Cabbage Corp, becoming a successful businessman and restaurateur.
- Inspired by technology, expanded his business into machinery and vehicles.

### 🎭 Role in the Story

A recurring comic relief and symbol of perseverance, whose misfortunes and eventual success became legendary in the Avatar world.

### 🤝 Relationships

- **His wife, daughter, and son (Lau Gan-Lan)** – Family, source of motivation and legacy.
- **Daisy** – Beloved pet turkey duck.
- **Team Avatar** – Accidental nemeses, later reconciled.
- **Cabbage Corp** – His business legacy.

### 🌟 Personality Traits

- Persistent, entrepreneurial, passionate, unlucky, caring, a bit vain, family-oriented.

### 💬 Notable Quotes

- "My cabbages!"
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - CABBAGE MERCHANT

---

## 🪪 Identity & Demographics

```json
{
  "id": "cabbage_merchant",
  "fullName": "Cai",
  "titles": ["Cabbage Merchant", "Founder of Cabbage Corp"],
  "aliases": ["Cabbage Merchant"],
  "species": "human",
  "gender": "male",
  "ageChronological": 55,
  "ageBiological": 55,
  "ageRange": "adult",
  "birthDate": null,
  "deathDate": null,
  "nationality": "Earth Kingdom",
  "ethnicity": "Earth Kingdom",
  "nativeLocation": "Gaoling, Earth Kingdom",
  "currentLocation": "Cranefish Town (later Republic City)",
  "socioeconomicStanding": "merchant",
  "languagesSpoken": ["Standard Language"]
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": false,
  "bendingElement": null,
  "bendingProficiency": null,
  "advancedBending": [],
  "nonBendingSkills": ["business acumen", "cooking", "salesmanship", "resilience"],
  "uniqueTechniques": ["cabbage-based cuisine", "cart repair", "insurance planning"],
  "powerMetrics": {
    "rawPower": 2,
    "technicalSkill": 5,
    "strategicAptitude": 8
  },
  "combatStyle": "none",
  "vulnerabilities": ["bad luck", "obsession with cabbages", "paranoia about loss"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Survived repeated cabbage cart destruction",
    "Founded Cabbage Corp",
    "Hosted a feast for Team Avatar and Fire Lord Zuko"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Cabbage Corp", "Earth Kingdom"],
  "pastAffiliations": [],
  "allegianceHistory": [
    { "affiliation": "Cabbage Corp", "startDate": "pre-120 AG", "endDate": null, "reasonForLeaving": null }
  ],
  "isRoyalty": false,
  "politicalPower": "influential",
  "politicalLeanings": ["entrepreneur", "innovator"],
  "moralAlignment": "neutral good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "comic relief",
  "screenTimeLevel": "minor",
  "firstAppearance": "105-The King of Omashu",
  "finalAppearance": "City of Echoes (comics)",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "growth", "status": "completed", "summary": "Cai rises from unlucky vendor to successful entrepreneur, never giving up on his cabbages." }
  ],
  "keyTropes": ["Lovable Loser", "Running Gag", "Perseverant Underdog", "Comic Relief"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 1",
      "role": "comic relief",
      "focus": "Cabbage cart destruction in Omashu and beyond.",
      "keyEpisodes": ["The King of Omashu", "The Waterbending Scroll"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "comic relief",
      "focus": "More misadventures, Ba Sing Se, cabbage cart destruction.",
      "keyEpisodes": ["The Serpent's Pass", "The Tales of Ba Sing Se"]
    },
    {
      "era": "Avatar: The Last Airbender - Comics",
      "role": "comic relief",
      "focus": "Feast at Jasmine Dragon, founding Cabbage Corp, restaurant in Cranefish Town.",
      "keyEpisodes": ["The Rift Part Two", "The Rift Part Three", "City of Echoes"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "lau-gan-lan", "relationshipType": "family", "status": "positive", "history": "Son and successor at Cabbage Corp." },
    { "characterId": "daisy", "relationshipType": "pet", "status": "positive", "history": "Beloved turkey duck." },
    { "characterId": "team-avatar", "relationshipType": "nemesis", "status": "complicated", "history": "Repeatedly destroyed his cabbages, later reconciled." },
    { "characterId": "wife", "relationshipType": "family", "status": "positive", "history": "Supportive spouse and mother of his children." }
  ],
  "groupMemberships": [
    { "groupId": "cabbage-corp", "roleInGroup": "founder" }
  ],
  "petCompanions": ["daisy"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["persistent", "entrepreneurial", "caring", "resilient", "family-oriented"],
  "negativeTraits": ["paranoid", "obsessive", "vain", "unlucky"],
  "motivations": ["success", "family", "cabbages", "legacy"],
  "fears": ["losing cabbages", "failure", "letting down family"],
  "internalConflicts": ["ambition vs. misfortune", "family vs. business"],
  "emotionalWounds": ["repeated business failures", "public embarrassment"],
  "copingMechanisms": ["humor", "hard work", "insurance"],
  "worldview": "Believes that perseverance and optimism can overcome any setback."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["gray hair", "tan skin", "dark brown eyes", "merchant attire"],
  "outfitStyles": ["Earth Kingdom merchant clothing", "apron", "business attire"],
  "signaturePossessions": ["cabbage cart", "apron", "Cabbage Corp pin"],
  "ageProgression": true,
  "voiceActor": ["James Sie", "Ricco Fajardo"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "My cabbages!"
  ],
  "speakingStyle": "dramatic",
  "linguisticQuirks": ["exclaims about cabbages", "dramatic tone", "business jargon"],
  "catchphrases": ["My cabbages!"]
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "Lovable Loser",
  "thematicKeywords": ["perseverance", "luck", "entrepreneurship", "family", "resilience", "comic relief"],
  "tagCategories": {
    "narrativeTags": ["comic relief", "merchant", "underdog", "supporting character"],
    "combatTags": ["none"],
    "relationshipTags": ["father of Lau Gan-Lan", "husband", "pet owner"],
    "emotionTags": ["persistent", "unlucky", "optimistic", "paranoid"],
    "politicalTags": ["entrepreneur", "Earth Kingdom"],
    "arcTags": ["from unlucky vendor to mogul", "cabbage cart destruction"],
    "worldTags": ["Gaoling", "Ba Sing Se", "Cranefish Town", "Republic City", "Cabbage Corp"],
    "triviaTags": ["my cabbages", "recurring gag", "insurance policies"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["lau-gan-lan", "team-avatar", "daisy"],
  "filterWeight": 12,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.93,
  "searchableKeywords": ["cabbage merchant", "cai", "cabbages", "cabbage corp", "earth kingdom", "comic relief"],
  "fuzzySynonyms": ["my cabbages guy", "cabbage vendor", "cabbage mogul"],
  "isSuggestedInXContext": []
}
```
