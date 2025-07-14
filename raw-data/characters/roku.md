# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - ROKU

---

## 🖼️ UI - CARD VIEW

```md
- Name: Roku
- Nation: Fire Nation
- Short Description: The Fire Nation-born Avatar who preceded Aang. His lifelong friendship and later rivalry with Fire Lord Sozin directly led to the beginning of the Hundred Year War.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

A kind and powerful Avatar, Roku's life was defined by his close friendship with Prince Sozin, which tragically soured as Sozin's imperial ambitions grew. Roku's struggle to balance his personal loyalty with his global duty resulted in a moment of hesitation that allowed Sozin to begin his conquest. He died protecting his home from a volcanic eruption, leaving a legacy of regret and a world on the brink of a century-long war for his successor, Aang, to resolve.

### ✨ Narrative Highlights

- Grew up as the best friend of Prince Sozin, who would later become Fire Lord.
- Confronted and defeated Sozin, sparing his life out of friendship.
- Died fighting a volcanic eruption after being betrayed by Sozin.
- Served as Aang's primary spiritual guide from beyond the grave.

### 🎭 Role in the Story

A guiding spirit and tragic figure whose past mistakes serve as a crucial lesson for Aang on the importance of decisiveness.

### 🤝 Relationships

- Sozin (Best Friend turned Arch-Nemesis)
- Aang (Successor, Mentee)
- Gyatso (Close Friend, Aang's Guardian)
- Ta Min (Wife)
- Zuko (Great-Grandson)

### 🧬 Notable Traits

- Wise & Merciful
- Disciplined & Kind
- Indecisive (at critical moments)
- Regretful

### 🗣️ Notable Quotes

- "If I had been more decisive and acted sooner, I could have stopped Sozin and stopped the War before it started."
- "Being the Avatar is an honor, but it's also a great burden."
- "Some friendships are so strong, they can even transcend lifetimes."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - ROKU

---

## 🪪 Identity & Demographics

```json
{
  "id": "roku",
  "fullName": "Roku",
  "titles": ["Avatar"],
  "aliases": ["Ro"],
  "species": "human",
  "gender": "male",
  "ageChronological": 70,
  "ageBiological": 70,
  "ageRange": "elder",
  "birthDate": "82 BG",
  "deathDate": "12 BG",
  "nationality": "Fire Nation",
  "ethnicity": "Fire Nation",
  "nativeLocation": "Fire Nation Capital",
  "currentLocation": "Deceased (Spirit World)",
  "socioeconomicStanding": "nobility",
  "languagesSpoken": ["Standard Language"]
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": true,
  "bendingElement": "fire",
  "bendingProficiency": "legendary",
  "advancedBending": ["lavabending"],
  "nonBendingSkills": ["diplomacy"],
  "uniqueTechniques": ["simultaneous multi-element bending", "volcano containment"],
  "powerMetrics": {
    "rawPower": 10,
    "technicalSkill": 10,
    "strategicAptitude": 8
  },
  "combatStyle": "defensive",
  "vulnerabilities": ["indecisiveness", "loyalty to friends"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "Mastered all four elements and the Avatar State",
    "Defeated Fire Lord Sozin in a one-on-one confrontation",
    "Temporarily subdued a massive volcanic eruption",
    "Destroyed the Fire Temple on Crescent Island"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Spirit World"],
  "pastAffiliations": ["Fire Nation"],
  "allegianceHistory": [],
  "isRoyalty": false,
  "politicalPower": "ruling",
  "politicalLeanings": ["traditionalist", "pacifist (conflicted)"],
  "moralAlignment": "lawful good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "mentor",
  "screenTimeLevel": "supporting",
  "firstAppearance": "108-Winter-Solstice-Part-2-Avatar-Roku",
  "finalAppearance": "Graphic Novel: The Rift trilogy",
  "deathStatus": "deceased",
  "causeOfDeath": "Volcanic gas inhalation, betrayal by Sozin",
  "narrativeArcs": [
    { "arcType": "tragic", "status": "completed", "summary": "His failure to stop his best friend's ambition, leading directly to the Hundred Year War." }
  ],
  "keyTropes": ["The Mentor", "My Greatest Failure", "Posthumous Character", "Spirit Advisor", "Tragic Hero"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender",
      "role": "mentor",
      "focus": "Appearing to Aang as his primary spiritual guide, providing crucial information and context for the war.",
      "keyEpisodes": ["108", "201", "306", "319"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "sozin", "relationshipType": "rival", "status": "negative", "history": "His childhood best friend who became his greatest adversary." },
    { "characterId": "aang", "relationshipType": "student", "status": "positive", "history": "His direct successor, whom he guides from the Spirit World." },
    { "characterId": "gyatso", "relationshipType": "ally", "status": "positive", "history": "A close friend from his time at the Southern Air Temple." },
    { "characterId": "fang", "relationshipType": "petCompanions", "status": "positive", "history": "His loyal dragon animal guide." },
    { "characterId": "kyoshi", "relationshipType": "mentor", "status": "positive", "history": "His predecessor in the Avatar Cycle." },
    { "characterId": "zuko", "relationshipType": "family", "status": "neutral", "history": "His great-grandson through his daughter, Rina." }
  ],
  "groupMemberships": [],
  "petCompanions": ["Fang (dragon)"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["wise", "kind", "merciful", "disciplined", "powerful"],
  "negativeTraits": ["indecisive", "reluctant to act"],
  "motivations": ["maintaining balance", "friendship", "peace"],
  "fears": ["failing the world", "making the wrong decision"],
  "internalConflicts": ["friendship with Sozin vs. his duty as the Avatar"],
  "emotionalWounds": ["betrayal by Sozin", "the guilt of allowing the war to start"],
  "copingMechanisms": ["showing restraint", "diplomacy"],
  "worldview": "Believes in maintaining peace between the four nations, but is haunted by the consequences of his indecisiveness."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Tall",
  "notableFeatures": ["Long white hair and beard", "Fire Nation topknot", "Crown Prince headpiece"],
  "outfitStyles": ["Fire Nation royal robes", "Avatar training attire"],
  "signaturePossessions": ["Crown Prince headpiece"],
  "ageProgression": true,
  "voiceActor": ["James Garrett", "Andrew Caldwell"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "If I had been more decisive and acted sooner, I could have stopped Sozin and stopped the War before it started.",
    "The four nations are meant to be separate. It is the Avatar's duty to maintain that balance.",
    "I offer you this wisdom, Aang: You must be decisive."
  ],
  "speakingStyle": "formal",
  "linguisticQuirks": ["Speaks with a commanding and wise tone"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Mentor",
  "thematicKeywords": ["friendship", "betrayal", "duty", "regret", "indecision", "war", "legacy", "balance"],
  "tagCategories": {
    "narrativeTags": ["past avatar", "spirit advisor", "my greatest failure", "tragic hero"],
    "combatTags": ["avatar", "firebender", "airbender", "waterbender", "earthbender", "lavabender"],
    "relationshipTags": ["best friend of Sozin", "mentor to Aang", "predecessor to Aang", "great-grandfather of Zuko"],
    "emotionTags": ["wise", "merciful", "regretful", "indecisive"],
    "politicalTags": ["diplomat"],
    "arcTags": ["died fighting volcano", "betrayed by Sozin", "failed to stop the war"],
    "worldTags": ["Fire Nation", "Spirit World", "Crescent Island"],
    "triviaTags": ["has a dragon", "Zuko's great-grandfather", "friends with Gyatso", "wore Sozin's headpiece"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["aang", "sozin", "gyatso", "kyoshi", "zuko", "fang"],
  "filterWeight": 85,
  "canonicalImportance": "primary",
  "dataCompletenessScore": 1.0,
  "searchableKeywords": ["roku", "avatar", "fire", "sozin", "volcano", "aang", "mentor", "spirit", "decisive", "regret"],
  "fuzzySynonyms": ["the avatar before aang", "sozin's friend", "zuko's great grandfather"],
  "isSuggestedInXContext": []
}
```