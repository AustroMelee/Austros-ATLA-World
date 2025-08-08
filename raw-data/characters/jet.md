---
type: character
---

## 🖼️ UI - CARD VIEW

```md
- Name: Jet
- Nation: Earth Kingdom
- Badge: Freedom Fighter Leader
- Short Description: The charismatic, vengeful, and tragic male teen leader of the Freedom Fighters, Jet is a skilled swordsman whose hatred of the Fire Nation drives him to extremist measures and ultimately a tragic fate.
- Tags: Earth Kingdom, Freedom Fighters, Leader, Nonbender, Male, Teen, Charismatic, Tragic Hero, Anti-Hero, Book One, Book Two, Ba Sing Se, Lake Laogai, Swordsman
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

After witnessing the death of his parents at the hands of the Fire Nation, Jet dedicated his life to a guerrilla war against them. As the leader of the Freedom Fighters, he used his charisma and combat prowess to rally other refugees to his cause. However, his all-consuming hatred led him to endanger innocent lives, creating a conflict with Team Avatar. After attempting to start a new life in Ba Sing Se, he was brainwashed by the Dai Li and ultimately sacrificed himself to save the Avatar.

### ✨ Narrative Highlights

- Formed and led the Freedom Fighters, a group of Earth Kingdom refugees.
- Attempted to destroy a dam to flood a town occupied by Fire Nation soldiers and civilians.
- Was captured and brainwashed by the Dai Li in Ba Sing Se.
- Fatally wounded by Long Feng after breaking free of his mind control to help Aang.

### 🎭 Role in the Story

A tragic anti-hero whose story serves as a cautionary tale about how the desire for justice can be corrupted by hatred and revenge.

### 🤝 Relationships

- **Katara** – Former crush, betrayed by his extremism.
- **Sokka** – Rival, strategic and moral counterpoint.
- **Smellerbee & Longshot** – Loyal lieutenants and friends.
- **Zuko & Iroh** – Enemies, targets of his suspicion.
- **Long Feng** – Captor and killer.

### 🌟 Notable Traits

- Charismatic and persuasive leader.
- Vengeful and obsessive in his quest for justice.
- Paranoid and ruthless when threatened.
- Loyal to his cause and followers.

### 💬 Notable Quotes

- "You want to know my problem? I'm the one who's not confused."
- "The sacrifices are necessary."
- "I'm a freedom fighter."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - JET

---

## 🪪 Identity & Demographics

```json
{
  "id": "jet",
  "title": "Jet",
  "fullName": "Jet",
  "role": "Freedom Fighter",
  "titles": ["Leader"],
  "aliases": [],
  "species": "human",
  "gender": "male",
  "ageChronological": 16,
  "ageBiological": 16,
  "ageRange": "teen",
  "birthDate": "83 AG",
  "deathDate": "100 AG",
  "nationality": "Earth Kingdom",
  "ethnicity": "Earth Kingdom",
  "nativeLocation": "Unknown",
  "currentLocation": "Deceased",
  "socioeconomicStanding": "refugee",
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
  "nonBendingSkills": ["swordsmanship (dual hook swords)", "stealth", "guerrilla tactics", "leadership"],
  "uniqueTechniques": ["dual hook sword combat"],
  "powerMetrics": {
    "rawPower": 2,
    "technicalSkill": 8,
    "strategicAptitude": 7
  },
  "combatStyle": "opportunistic",
  "vulnerabilities": ["hatred of the Fire Nation", "paranoia", "susceptible to mind control"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Formed and led the Freedom Fighters",
    "Successfully dueled Zuko on even terms",
    "Broke free of Dai Li brainwashing through willpower"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": [],
  "pastAffiliations": ["Freedom Fighters", "Dai Li (brainwashed)"],
  "allegianceHistory": [],
  "isRoyalty": false,
  "politicalPower": "subversive",
  "politicalLeanings": ["rebel", "extremist", "nationalist"],
  "moralAlignment": "chaotic neutral",
  "moralCompassDrift": true
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "foil",
  "screenTimeLevel": "minor",
  "firstAppearance": "110-Jet",
  "finalAppearance": "217-Lake-Laogai",
  "deathStatus": "deceased",
  "causeOfDeath": "Internal injuries inflicted by Long Feng",
  "narrativeArcs": [
    { "arcType": "tragic", "status": "completed", "summary": "His fall from a charismatic leader to a paranoid extremist, followed by a brief, fatal redemption." }
  ],
  "keyTropes": ["Anti-Hero", "Well-Intentioned Extremist", "Tragic Hero", "Revenge Before Reason", "Brainwashed and Crazy", "The Leader"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 1",
      "role": "villain",
      "focus": "Leading the Freedom Fighters and attempting to wipe out a village to defeat the Fire Nation.",
      "keyEpisodes": ["110"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "supporting",
      "focus": "Attempting a new life in Ba Sing Se, becoming obsessed with Zuko, and his eventual brainwashing and death.",
      "keyEpisodes": ["212", "217"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "katara", "relationshipType": "romantic", "status": "negative", "history": "A girl he charmed and then betrayed with his extremism." },
    { "characterId": "sokka", "relationshipType": "rival", "status": "negative", "history": "A strategic and moral rival who saw through his charisma." },
    { "characterId": "smellerbee", "relationshipType": "ally", "status": "positive", "history": "A loyal follower who remained with him until his death." },
    { "characterId": "longshot", "relationshipType": "ally", "status": "positive", "history": "A silent and loyal follower who remained with him until his death." },
    { "characterId": "zuko", "relationshipType": "enemy", "status": "negative", "history": "A Fire Nation citizen he became obsessed with exposing." },
    { "characterId": "long-feng", "relationshipType": "enemy", "status": "resolved", "history": "The Dai Li leader who brainwashed and ultimately killed him." }
  ],
  "groupMemberships": [
    { "groupId": "freedom-fighters", "roleInGroup": "leader" }
  ],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["charismatic", "brave", "loyal (to his group)", "sympathetic (to refugees)"],
  "negativeTraits": ["vengeful", "paranoid", "extremist", "obsessive", "ruthless"],
  "motivations": ["revenge", "liberating the Earth Kingdom", "hatred of the Fire Nation"],
  "fears": ["the Fire Nation winning", "being powerless"],
  "internalConflicts": ["his desire for justice vs. his methods", "trust vs. paranoia"],
  "emotionalWounds": ["parents' murder", "destruction of his home"],
  "copingMechanisms": ["aggression", "forming a surrogate family (Freedom Fighters)", "projecting his hatred"],
  "worldview": "Believes the Fire Nation is an irredeemable evil and that any action, no matter how extreme, is justified to defeat them."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Hook swords", "piece of wheat in mouth", "messy brown hair"],
  "outfitStyles": ["Earth Kingdom refugee clothing"],
  "signaturePossessions": ["Dual hook swords"],
  "ageProgression": false,
  "voiceActor": ["Crawford Wilson"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "You want to know my problem? I'm the one who's not confused.",
    "The sacrifices are necessary.",
    "I'm a freedom fighter."
  ],
  "speakingStyle": "casual",
  "linguisticQuirks": ["Smooth and persuasive speaking style", "chews on a piece of wheat"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Rebel",
  "thematicKeywords": ["revenge", "extremism", "terrorism", "trauma", "justice", "hatred", "brainwashing", "redemption"],
  "tagCategories": {
    "narrativeTags": ["anti-hero", "tragic hero", "well-intentioned extremist", "brainwashed", "killed by the narrative", "charismatic leader"],
    "combatTags": ["non-bender", "swordsman", "dual hook swords", "guerrilla fighter"],
    "relationshipTags": ["leader of Freedom Fighters", "love interest of Katara", "enemy of Zuko", "killed by Long Feng"],
    "emotionTags": ["charismatic", "vengeful", "paranoid", "obsessive", "charming"],
    "politicalTags": ["rebel", "freedom fighter", "vigilante"],
    "arcTags": ["attempted to flood Gaipan", "confronted Zuko in Ba Sing Se", "brainwashed by Dai Li", "died at Lake Laogai"],
    "worldTags": ["Earth Kingdom", "Freedom Fighters", "Ba Sing Se", "Lake Laogai"],
    "triviaTags": ["chews wheat", "unclear death", "crush on Katara", "hook swords"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["katara", "sokka", "zuko", "iroh", "long-feng", "smellerbee", "longshot"],
  "filterWeight": 60,
  "canonicalImportance": "tertiary",
  "dataCompletenessScore": 0.95,
  "searchableKeywords": ["jet", "freedom", "fighter", "hook", "sword", "dam", "revenge", "ba", "sing", "se", "dai", "li", "brainwash"],
  "fuzzySynonyms": ["the freedom fighter", "the guy with hook swords", "the dam guy"],
  "isSuggestedInXContext": []
}
```
