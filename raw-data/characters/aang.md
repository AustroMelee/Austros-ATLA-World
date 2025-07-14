
# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - AANG

---

## 🖼️ UI - CARD VIEW

```md
- Name: Aang
- Nation: Air Nomads
- Short Description: A fun-loving, reluctant hero and the last of the Air Nomads, Aang is the long-lost Avatar destined to master all four elements and end the Hundred Year War.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Frozen in an iceberg for a century, Aang awoke to a world ravaged by a war he was meant to prevent. Burdened by survivor's guilt and the immense responsibility of the Avatar, he embarks on a journey with his friends to master the elements, restore balance, and rebuild his lost culture, all while trying to hold on to his pacifist ideals and childhood innocence.

### ✨ Narrative Highlights

- Discovered in an iceberg by Katara and Sokka.
- Merged with the Ocean Spirit to defend the Northern Water Tribe.
- Mastered energybending to defeat Fire Lord Ozai without killing him.
- Co-founded the United Republic of Nations with Fire Lord Zuko.

### 🎭 Role in the Story

The protagonist and catalyst for the world's salvation, whose journey explores the conflict between duty and personal desire.

### 🤝 Relationships

- **Katara** – Wife, closest ally, emotional anchor.
- **Sokka** – Brother figure, travel companion, comic foil.
- **Zuko** – Former enemy turned ally and spiritual mirror.
- **Toph Beifong** – Earthbending master, loyal friend.
- **Appa & Momo** – Animal companions and sources of comfort.
- **Monk Gyatso** – Mentor and father figure.

### 🌟 Notable Traits

- Airbending prodigy and pacifist monk.
- Struggles with responsibility and legacy.
- Deep connection to animal companions and the spiritual world.
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - AANG

---

## 🪪 Identity & Demographics

```json
{
  "id": "aang",
  "fullName": "Aang",
  "titles": ["Avatar", "Master"],
  "aliases": ["Bonzu Pippinpaddleopsicopolis III", "Kuzon", "Twinkle Toes"],
  "species": "human",
  "gender": "male",
  "ageChronological": 165,
  "ageBiological": 66,
  "ageRange": "teen",
  "birthDate": "12 BG",
  "deathDate": "153 AG",
  "nationality": "Southern Air Temple",
  "ethnicity": "Air Nomad",
  "nativeLocation": "Southern Air Temple",
  "currentLocation": "Deceased (Spirit World)",
  "socioeconomicStanding": "monastic",
  "languagesSpoken": ["Standard Language"]
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": true,
  "bendingElement": "air",
  "bendingProficiency": "legendary",
  "advancedBending": ["energybending", "seismic sense", "lightning redirection"],
  "nonBendingSkills": ["acrobatics", "animal empathy", "spiritual projection"],
  "uniqueTechniques": ["air scooter", "Avatar State", "glider staff combat"],
  "powerMetrics": {
    "rawPower": 10,
    "technicalSkill": 9,
    "strategicAptitude": 7
  },
  "combatStyle": "evasive",
  "vulnerabilities": ["emotional attachments", "pacifist reluctance to strike", "survivor's guilt"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "Defeated Fire Lord Ozai",
    "Ended the Hundred Year War",
    "Founded Republic City",
    "Removed Yakone's bending",
    "Mastered all four elements in under a year",
    "Became youngest airbending master in history"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Air Nomads", "Team Avatar", "Order of the White Lotus", "United Republic of Nations"],
  "pastAffiliations": [],
  "allegianceHistory": [],
  "isRoyalty": false,
  "politicalPower": "influential",
  "politicalLeanings": ["pacifist", "unifier", "traditionalist", "reconstructionist"],
  "moralAlignment": "lawful good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "protagonist",
  "screenTimeLevel": "main",
  "firstAppearance": "101-The-Boy-in-the-Iceberg",
  "finalAppearance": "LOK-408-Remembrances",
  "deathStatus": "deceased",
  "causeOfDeath": "Life-force depletion from being frozen in the Avatar State",
  "narrativeArcs": [
    { "arcType": "growth", "status": "completed", "summary": "Accepting the burden of being the Avatar and mastering the elements." },
    { "arcType": "psychological", "status": "completed", "summary": "Overcoming survivor's guilt and the loss of his people." }
  ],
  "keyTropes": ["The Chosen One", "Last of His Kind", "Man Out of Time", "Reluctant Hero", "All-Loving Hero", "Beware the Nice Ones"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 1",
      "role": "hero",
      "focus": "Learning waterbending and evading capture while coming to terms with the lost world.",
      "keyEpisodes": ["101", "103", "112", "120"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "hero",
      "focus": "Struggling to learn earthbending, losing Appa, and facing a major defeat in Ba Sing Se.",
      "keyEpisodes": ["201", "206", "211", "220"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "hero",
      "focus": "Mastering firebending, confronting his pacifist dilemma, and defeating Fire Lord Ozai.",
      "keyEpisodes": ["301", "313", "318", "321"]
    },
    {
      "era": "The Legend of Korra",
      "role": "mentor",
      "focus": "Appearing in visions to guide Korra and Tenzin, establishing his legacy.",
      "keyEpisodes": ["LOK-109", "LOK-112", "LOK-213"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "katara", "relationshipType": "romantic", "status": "positive", "history": "Close friend, teacher, and eventual wife." },
    { "characterId": "sokka", "relationshipType": "ally", "status": "positive", "history": "One of his first friends, provides strategic and comic relief." },
    { "characterId": "zuko", "relationshipType": "rival", "status": "resolved", "history": "Primary pursuer who became his firebending master and close friend." },
    { "characterId": "toph-beifong", "relationshipType": "mentor", "status": "positive", "history": "His earthbending teacher and loyal, albeit abrasive, friend." },
    { "characterId": "roku", "relationshipType": "mentor", "status": "positive", "history": "His past life, providing guidance from the Spirit World." },
    { "characterId": "gyatso", "relationshipType": "mentor", "status": "positive", "history": "Father figure and airbending mentor from his childhood." },
    { "characterId": "ozai", "relationshipType": "enemy", "status": "resolved", "history": "The final antagonist he had to defeat to end the war." }
  ],
  "groupMemberships": [
    { "groupId": "team-avatar", "roleInGroup": "leader" }
  ],
  "petCompanions": ["Appa", "Momo"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["idealistic", "fun-loving", "compassionate", "spiritual", "adaptable", "forgiving"],
  "negativeTraits": ["irresponsible (initially)", "avoidant", "prone to guilt", "naive"],
  "motivations": ["balance", "peace", "friendship", "preserving his culture", "honoring the past"],
  "fears": ["failing the world", "being alone", "having to kill", "losing his friends"],
  "internalConflicts": ["duty vs. personal desire", "pacifism vs. necessity", "childhood vs. adulthood"],
  "emotionalWounds": ["survivor's guilt", "cultural genocide", "abandonment"],
  "copingMechanisms": ["humor", "playfulness", "meditation", "avoidance"],
  "worldview": "Believes all life is sacred and that balance can be achieved through harmony and understanding."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Short (teen) / Average (adult)",
  "notableFeatures": ["Air Nomad master tattoos (blue arrows)", "shaved head", "grey eyes"],
  "outfitStyles": ["Air Nomad monk robes", "Fire Nation school uniform", "Water Tribe parka"],
  "signaturePossessions": ["Glider staff"],
  "ageProgression": true,
  "voiceActor": ["Zach Tyler Eisen", "D. B. Sweeney"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "I wasn't there when the Fire Nation attacked my people. I'm gonna make a difference this time.",
    "Violence is never the answer.",
    "Flameo, hotman!"
  ],
  "speakingStyle": "casual",
  "linguisticQuirks": ["Frequent use of playful exclamations"],
  "catchphrases": ["Yip yip!"]
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Hero",
  "thematicKeywords": ["balance", "destiny", "forgiveness", "spirituality", "war", "peace", "legacy", "childhood", "responsibility", "pacifism", "grief"],
  "tagCategories": {
    "narrativeTags": ["protagonist", "chosen one", "last of his kind", "man out of time", "reluctant hero", "found family"],
    "combatTags": ["avatar", "airbender", "waterbender", "earthbender", "firebender", "energybender", "glider staff", "air scooter", "evasive"],
    "relationshipTags": ["friend of Zuko", "husband of Katara", "father of Tenzin", "successor to Roku", "animal companion"],
    "emotionTags": ["fun-loving", "burdened", "spiritual", "joyful", "guilty"],
    "politicalTags": ["monk", "diplomat", "unifier", "founder"],
    "arcTags": ["fully realized Avatar", "escaped iceberg", "healed from mortal wound", "mastered elements"],
    "worldTags": ["Air Nomad culture", "Spirit World traveler", "Republic City", "Southern Air Temple"],
    "triviaTags": ["nickname: Twinkle Toes", "revived by spirit water", "invented air scooter", "faced Yakone"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["katara", "sokka", "toph-beifong", "zuko", "appa", "momo", "roku", "ozai", "gyatso", "korra", "tenzin"],
  "filterWeight": 100,
  "canonicalImportance": "core",
  "dataCompletenessScore": 0.98,
  "searchableKeywords": ["aang", "avatar", "air", "water", "earth", "fire", "bend", "monk", "nomad", "balance", "war", "iceberg", "last", "spirit", "glider", "arrow", "tattoo"],
  "fuzzySynonyms": ["the boy in the iceberg", "the last airbender", "twinkle toes", "fully realized avatar", "arrow-headed boy"],
  "isSuggestedInXContext": []
}
```