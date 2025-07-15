---
type: character
---

## 🖼️ UI - CARD VIEW

```md
- Name: Sokka
- Nation: Southern Water Tribe
- Short Description: A warrior from the Southern Water Tribe, Sokka is the resident strategist and comic relief of Team Avatar. Though he lacks bending, his ingenuity, leadership, and trusty boomerang prove indispensable in the fight against the Fire Nation.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Left as the oldest male in his village, Sokka was a self-styled warrior desperate to prove himself. After discovering the Avatar, his worldview rapidly expands from cynical and pragmatic to one of a brilliant leader and strategist. Overcoming his insecurities as a non-bender, he becomes the indispensable "idea guy" of the group, masterminding the invasion of the Fire Nation and evolving into a master swordsman in his own right.

### ✨ Narrative Highlights

- Formulated the plan for the invasion of the Fire Nation on the Day of Black Sun.
- Trained under Master Piandao to become a master swordsman, forging his own space sword.
- Single-handedly defeated the formidable assassin Combustion Man.
- Led a prison break from the Boiling Rock, rescuing his father and Suki.

### 🎭 Role in the Story

The non-bender strategist whose intellect, humor, and courage prove that you don't need powers to change the world.

### 🤝 Relationships

- **Katara** – Sister, confidant.
- **Suki** – Girlfriend, combat partner.
- **Aang** – Best friend, "the muscle".
- **Toph Beifong** – Friend, "Captain Boomerang".
- **Yue** – First love.
- **Hakoda** – Father, role model.

### 🌟 Notable Traits

- Sarcastic, witty, and inventive.
- Strategic, loyal, and protective.
- Goofy and a lover of meat.

### 💬 Notable Quotes

- "It's the quenchiest!"
- "I'm just a guy with a boomerang. I didn't ask for all this flying and magic."
- "Boomerang! You do always come back!"
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - SOKKA

---

## 🪪 Identity & Demographics

```json
{
  "id": "sokka",
  "fullName": "Sokka",
  "role": "SWT Warrior",
  "titles": ["Chieftain", "Chairman"],
  "aliases": ["Wang Fire", "Captain Boomerang"],
  "species": "human",
  "gender": "male",
  "ageChronological": 74,
  "ageBiological": 74,
  "ageRange": "teen",
  "birthDate": "84 AG",
  "deathDate": "Between 158 and 170 AG",
  "nationality": "Southern Water Tribe",
  "ethnicity": "Water Tribe",
  "nativeLocation": "Wolf Cove",
  "currentLocation": "Deceased",
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
  "nonBendingSkills": ["swordsmanship", "strategy", "engineering", "weapon crafting", "leadership", "poetry (haiku)"],
  "uniqueTechniques": ["boomerang precision throws", "meteorite sword forging", "submarine design"],
  "powerMetrics": {
    "rawPower": 3,
    "technicalSkill": 8,
    "strategicAptitude": 9
  },
  "combatStyle": "opportunistic",
  "vulnerabilities": ["overconfidence in plans", "physical limitations (non-bender)", "distraction by food"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "Masterminded the Day of Black Sun invasion",
    "Defeated Combustion Man",
    "Led the destruction of the Fire Nation airship fleet",
    "Trained under Master Piandao and forged a space sword",
    "Served as Chairman of the United Republic Council"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Southern Water Tribe", "Team Avatar", "United Republic Council"],
  "pastAffiliations": ["Fire Nation Army (undercover)"],
  "allegianceHistory": [],
  "isRoyalty": false,
  "politicalPower": "ruling",
  "politicalLeanings": ["pragmatist", "nationalist (initially)", "unifier (later)"],
  "moralAlignment": "chaotic good",
  "moralCompassDrift": true
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "comic relief",
  "screenTimeLevel": "main",
  "firstAppearance": "101-The-Boy-in-the-Iceberg",
  "finalAppearance": "LOK-109-Out-of-the-Past",
  "deathStatus": "deceased",
  "causeOfDeath": "Unknown",
  "narrativeArcs": [
    { "arcType": "growth", "status": "completed", "summary": "Overcoming sexism and insecurity to become a respected leader and warrior." },
    { "arcType": "intellectual", "status": "completed", "summary": "Developing from a hap-hazard planner to a master strategist." }
  ],
  "keyTropes": ["The Strategist", "The Lancer", "Non-Action Guy (initially)", "The Smart Guy", "Deadpan Snarker", "The Load (initially)"]
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
      "focus": "Serving as the skeptical pragmatist, falling in love with Yue, and overcoming his sexism.",
      "keyEpisodes": ["101", "104", "117", "119"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "hero",
      "focus": "Developing his strategic mind, discovering key intelligence, and feeling overshadowed by benders.",
      "keyEpisodes": ["202", "210", "215", "218"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "hero",
      "focus": "Coming into his own as a warrior by training with Piandao and leading a prison break.",
      "keyEpisodes": ["304", "310", "314", "320"]
    },
    {
      "era": "The Legend of Korra",
      "role": "supporting",
      "focus": "Appearing in a flashback as a respected councilman and leader.",
      "keyEpisodes": ["LOK-109"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "katara", "relationshipType": "family", "status": "positive", "history": "Younger sister who he protects and argues with endlessly." },
    { "characterId": "suki", "relationshipType": "romantic", "status": "positive", "history": "Kyoshi warrior who challenged his sexism and became his long-term partner." },
    { "characterId": "aang", "relationshipType": "ally", "status": "positive", "history": "Best friend and Avatar, for whom he serves as the primary strategist." },
    { "characterId": "toph-beifong", "relationshipType": "ally", "status": "positive", "history": "A close friend who often mocks him but relies on his leadership." },
    { "characterId": "yue", "relationshipType": "romantic", "status": "resolved", "history": "His first love, who sacrificed herself and became the Moon Spirit." },
    { "characterId": "hakoda", "relationshipType": "family", "status": "positive", "history": "His father and the warrior he always aspired to be." },
    { "characterId": "piandao", "relationshipType": "mentor", "status": "positive", "history": "The swordmaster who taught him the way of the warrior." }
  ],
  "groupMemberships": [
    { "groupId": "team-avatar", "roleInGroup": "strategist" }
  ],
  "petCompanions": ["Hawky (temporary)"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["inventive", "loyal", "brave", "humorous", "adaptable", "strategic"],
  "negativeTraits": ["sarcastic", "sexist (initially)", "insecure", "pessimistic (occasionally)", "prideful"],
  "motivations": ["protecting his family", "proving his worth", "strategy", "meat"],
  "fears": ["being useless", "letting his team down", "not living up to his father's legacy"],
  "internalConflicts": ["insecurity as a non-bender", "pride vs. humility", "logic vs. spiritualism"],
  "emotionalWounds": ["mother's murder", "father's absence", "loss of Yue"],
  "copingMechanisms": ["sarcasm", "humor", "over-planning", "eating"],
  "worldview": "Believes that problems can be solved with logic, ingenuity, and a well-thrown boomerang."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Warrior's wolf tail hairstyle", "blue eyes", "Water Tribe warrior attire"],
  "outfitStyles": ["Southern Water Tribe warrior gear", "Fire Nation civilian/soldier disguise"],
  "signaturePossessions": ["Boomerang", "Space Sword", "Club"],
  "ageProgression": true,
  "voiceActor": ["Jack DeSena", "Chris Hardwick"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "My first girlfriend turned into the moon.",
    "That's rough, buddy.",
    "Drink cactus juice! It'll quench ya! Nothing's quenchier! It's the quenchiest!"
  ],
  "speakingStyle": "sarcastic",
  "linguisticQuirks": ["Frequent use of sarcasm", "tendency to over-explain plans"],
  "catchphrases": ["Boomerang!"]
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Trickster",
  "thematicKeywords": ["ingenuity", "strategy", "insecurity", "leadership", "humor", "pragmatism", "growth", "brotherhood"],
  "tagCategories": {
    "narrativeTags": ["comic relief", "the strategist", "the smart guy", "non-bender", "grows the beard"],
    "combatTags": ["swordsman", "boomerang", "non-bender", "leader", "tactician", "space sword"],
    "relationshipTags": ["brother of Katara", "boyfriend of Suki", "first love: Yue", "best friend of Aang", "son of Hakoda", "student of Piandao"],
    "emotionTags": ["sarcastic", "insecure", "loyal", "protective", "goofy"],
    "politicalTags": ["chieftain", "council chairman", "warrior", "diplomat"],
    "arcTags": ["overcame sexism", "became a master swordsman", "mastermind of invasion", "Boiling Rock escapee"],
    "worldTags": ["Southern Water Tribe", "Team Avatar", "Kyoshi Warriors (ally)", "United Republic"],
    "triviaTags": ["meat and sarcasm guy", "bad artist", "drank cactus juice", "Wang Fire"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["katara", "aang", "toph-beifong", "zuko", "suki", "hakoda", "yue", "piandao"],
  "filterWeight": 90,
  "canonicalImportance": "core",
  "dataCompletenessScore": 0.97,
  "searchableKeywords": ["sokka", "water", "tribe", "boomerang", "sword", "strategist", "meat", "sarcasm", "nonbender", "leader", "plan", "warrior"],
  "fuzzySynonyms": ["the boomerang guy", "captain boomerang", "wang fire", "the idea guy", "katara's brother"],
  "isSuggestedInXContext": []
}
```