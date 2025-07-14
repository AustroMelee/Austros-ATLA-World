# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - PIANDAO

---

## 🖼️ UI - CARD VIEW

```md
- Name: Piandao
- Nation: Fire Nation
- Short Description: A legendary swordmaster and bladesmith who deserted the Fire Nation army. He believes the way of the sword belongs to no single nation and takes on Sokka as his student.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Once a celebrated and undefeated general in the Fire Nation army, Piandao grew weary of war and deserted to pursue a life of art and enlightenment. Living in a secluded castle, he is revered as the greatest swordmaster in the nation's history. He believes knowledge of the arts belongs to everyone and takes on the eager but unworthy Sokka as his student, guiding him to discover his own unique strengths.

### ✨ Narrative Highlights

- Deserted the Fire Nation army and single-handedly defeated one hundred soldiers sent to arrest him.
- Took Sokka as his student, teaching him swordsmanship and the importance of creativity.
- Forged Sokka's unique "space sword" from a fallen meteorite.
- As a member of the White Lotus, helped liberate Ba Sing Se from Fire Nation control.

### 🎭 Role in the Story

A wise master who provides Sokka with the skills and confidence he needs to become a true warrior, reinforcing the theme that worth is not defined by one's nation or bending ability.

### 🤝 Relationships

- Sokka (Student)
- Zuko (Former Student)
- Iroh & The Order of the White Lotus (Fellow Members)
- Fat (Butler)

### 🧬 Notable Traits

- Wise & Enlightened
- Patient & Humble
- Artistic & Creative
- Unconventional

### 🗣️ Notable Quotes

- "The way of the sword doesn't belong to any one nation. Knowledge of the arts belongs to us all."
- "The most important lesson is creativity."
- "It's not the sword, it's the swordsman."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - PIANDAO

---

## 🪪 Identity & Demographics

```json
{
  "id": "piandao",
  "fullName": "Piandao",
  "titles": ["Master"],
  "aliases": [],
  "species": "human",
  "gender": "male",
  "ageChronological": 60,
  "ageBiological": 60,
  "ageRange": "elder",
  "birthDate": "c. 40 AG",
  "deathDate": null,
  "nationality": "Fire Nation",
  "ethnicity": "Fire Nation",
  "nativeLocation": "Fire Nation",
  "currentLocation": "Shu Jing, Fire Nation",
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
  "nonBendingSkills": ["swordsmanship (jian)", "swordsmithing", "calligraphy", "painting", "strategy"],
  "uniqueTechniques": ["incorporating techniques from all four nations into his fighting style"],
  "powerMetrics": {
    "rawPower": 3,
    "technicalSkill": 10,
    "strategicAptitude": 9
  },
  "combatStyle": "technical",
  "vulnerabilities": ["prefers not to fight"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "Defeated one hundred Fire Nation soldiers single-handedly",
    "Considered the greatest swordmaster and maker in Fire Nation history",
    "Helped liberate Ba Sing Se"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Order of the White Lotus"],
  "pastAffiliations": ["Fire Army"],
  "allegianceHistory": [
    { "affiliation": "Fire Army", "startDate": "Unknown", "endDate": "Unknown", "reasonForLeaving": "Grew tired of war and sought enlightenment." }
  ],
  "isRoyalty": false,
  "politicalPower": "none",
  "politicalLeanings": ["pacifist", "internationalist"],
  "moralAlignment": "lawful good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "mentor",
  "screenTimeLevel": "minor",
  "firstAppearance": "304-Sokkas-Master",
  "finalAppearance": "Uncle Iroh's Adventure Guide - Return & Regrowth",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [],
  "keyTropes": ["The Mentor", "Old Master", "The Hermit", "Master Swordsman", "The Deserter", "Renaissance Man"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "hero",
      "focus": "Training Sokka in the art of the sword and joining the Order of the White Lotus.",
      "keyEpisodes": ["304", "319", "320"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "sokka", "relationshipType": "student", "status": "positive", "history": "A student whose humility and creativity he admired and fostered." },
    { "characterId": "zuko", "relationshipType": "student", "status": "neutral", "history": "A former student he trained in dual broadswords." },
    { "characterId": "iroh", "relationshipType": "ally", "status": "positive", "history": "Fellow high-ranking member of the Order of the White Lotus." }
  ],
  "groupMemberships": [
    { "groupId": "order-of-the-white-lotus", "roleInGroup": "specialist" }
  ],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["wise", "patient", "humble", "creative", "enlightened"],
  "negativeTraits": ["reclusive"],
  "motivations": ["art", "knowledge", "self-improvement", "peace"],
  "fears": [],
  "internalConflicts": ["his past as a soldier vs. his present as an artist"],
  "emotionalWounds": ["disillusionment with war"],
  "copingMechanisms": ["artistic pursuits (calligraphy, painting)", "teaching", "isolation"],
  "worldview": "Believes that knowledge, art, and skill transcend national boundaries and belong to all who seek them."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Long black hair in a topknot", "gray eyes"],
  "outfitStyles": ["Fire Nation robes"],
  "signaturePossessions": ["Jian (straight sword)"],
  "ageProgression": false,
  "voiceActor": ["Robert Patrick"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "The way of the sword doesn't belong to any one nation.",
    "The blade is a tool. It is a part of your arm. Its only purpose is to transmit your will into the world.",
    "Even I'm not that good."
  ],
  "speakingStyle": "formal",
  "linguisticQuirks": ["Speaks calmly and with wisdom", "uses artistic metaphors"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Sage",
  "thematicKeywords": ["art", "wisdom", "swordsmanship", "mastery", "creativity", "humility", "peace", "enlightenment"],
  "tagCategories": {
    "narrativeTags": ["mentor", "old master", "the deserter", "master swordsman"],
    "combatTags": ["non-bender", "swordsman", "jian", "bladesmith"],
    "relationshipTags": ["teacher of Sokka", "teacher of Zuko", "member of White Lotus"],
    "emotionTags": ["wise", "patient", "calm", "humble", "creative"],
    "politicalTags": ["deserter"],
    "arcTags": ["liberated Ba Sing Se", "forged space sword"],
    "worldTags": ["Fire Nation", "Order of the White Lotus", "Shu Jing"],
    "triviaTags": ["non-bender master", "voiced by Robert Patrick", "calligrapher", "knew Sokka's identity"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["sokka", "zuko", "iroh", "pakku", "jeong-jeong"],
  "filterWeight": 60,
  "canonicalImportance": "tertiary",
  "dataCompletenessScore": 0.95,
  "searchableKeywords": ["piandao", "sword", "master", "sokka", "deserter", "white", "lotus", "blade", "smith", "art"],
  "fuzzySynonyms": ["sokka's master", "the swordmaster", "the guy who made the space sword"],
  "isSuggestedInXContext": []
}
```