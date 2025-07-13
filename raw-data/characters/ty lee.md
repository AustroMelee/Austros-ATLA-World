# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - TY LEE

---

## 🖼️ UI - CARD VIEW

```md
- Name: Ty Lee
- Nation: Fire Nation
- Short Description: A cheerful and energetic acrobat from a noble Fire Nation family. Ty Lee is a master of chi-blocking, using her unique martial arts to disable benders as a key member of Azula's team.
```

---

## 📖 UI - EXPANDED VIEW

```md
- Name: Ty Lee
- Nation: Fire Nation
- Age: 14 (in Avatar: The Last Airbender)
- Overview: One of seven identical sisters, Ty Lee ran away to join the circus to feel unique and gain individual recognition. Her acrobatic prowess and mastery of chi-blocking made her a prime recruit for Princess Azula's elite team. Though initially loyal out of fear, her empathetic nature and friendship with Mai ultimately lead her to defy Azula, choosing friendship over servitude.

- Narrative Highlights:
  - Intimidated by Azula into leaving her circus life to join her quest.
  - Single-handedly defeated the Terra Team of elite earthbenders with her chi-blocking.
  - Betrayed Princess Azula at the Boiling Rock to save Mai.
  - After being imprisoned, she befriended and joined the Kyoshi Warriors.

- Role in the Story: A secondary antagonist whose bubbly personality conceals a deadly fighting style and whose arc demonstrates the courage to defy a toxic friendship.

- Relationships:
  - Azula (Commander, former)
  - Mai (Best Friend)
  - Suki & The Kyoshi Warriors (Teammates)
  - Sokka (Crush)
  - Ty Sisters (Family)

- Personality Traits:
  - Cheerful & Bubbly
  - Energetic & Flirtatious
  - Empathetic & Loyal
  - Attention-seeking

- Notable Quotes:
  - "My aura has never been pinker!"
  - "Ooh, he's cute."
  - "Circus freak is a compliment!"
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - TY LEE

---

## 🪪 Identity & Demographics

```json
{
  "id": "ty-lee",
  "fullName": "Ty Lee",
  "titles": ["Kyoshi Warrior"],
  "aliases": [],
  "species": "human",
  "gender": "female",
  "ageChronological": 16,
  "ageBiological": 16,
  "ageRange": "teen",
  "birthDate": "c. 85-86 AG",
  "deathDate": null,
  "nationality": "Fire Nation",
  "ethnicity": "Fire Nation",
  "nativeLocation": "Fire Nation",
  "currentLocation": "Unknown",
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
  "nonBendingSkills": ["chi-blocking", "acrobatics", "hand-to-hand combat", "parkour"],
  "uniqueTechniques": ["pressure-point strikes to disable bending"],
  "powerMetrics": {
    "rawPower": 2,
    "technicalSkill": 10,
    "strategicAptitude": 5
  },
  "combatStyle": "evasive",
  "vulnerabilities": ["heavily armored opponents", "being emotionally manipulated by Azula"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Paralyzed Princess Azula with chi-blocking",
    "Taught the Kyoshi Warriors the art of chi-blocking",
    "Defeated numerous powerful benders",
    "Became a Kyoshi Warrior"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Kyoshi Warriors"],
  "pastAffiliations": ["Azula's team", "Fire Nation circus", "Royal Fire Academy for Girls"],
  "allegianceHistory": [
    { "affiliation": "Azula's team", "startDate": "100 AG", "endDate": "100 AG", "reasonForLeaving": "Betrayed Azula to defend Mai." }
  ],
  "isRoyalty": false,
  "politicalPower": "none",
  "politicalLeanings": ["apolitical"],
  "moralAlignment": "chaotic good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "supporting",
  "screenTimeLevel": "supporting",
  "firstAppearance": "203-Return-to-Omashu",
  "finalAppearance": "Graphic Novel: Ashes of the Academy",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "growth", "status": "completed", "summary": "Finding true individuality and family by joining the Kyoshi Warriors, after a lifetime of feeling like part of a 'matched set'." }
  ],
  "keyTropes": ["The Ditz", "Perky Goth (in spirit)", "Acrobatic Archer (in principle)", "Heel-Face Turn", "The Heart (of Azula's team)", "Badass Normal"]
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
      "focus": "Serving as Azula's cheerful but deadly chi-blocking specialist.",
      "keyEpisodes": ["203", "208", "213"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "hero",
      "focus": "Confronting her identity issues and making the fateful choice to stand with Mai against Azula.",
      "keyEpisodes": ["305", "315"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "azula", "relationshipType": "enemy", "status": "negative", "history": "Her former friend and commander, whom she followed out of fear until the very end." },
    { "characterId": "mai", "relationshipType": "ally", "status": "positive", "history": "Her best friend, whose safety prompted her to betray Azula." },
    { "characterId": "suki", "relationshipType": "ally", "status": "positive", "history": "A former enemy who became her friend and teammate in the Kyoshi Warriors." },
    { "characterId": "sokka", "relationshipType": "romantic", "status": "resolved", "history": "A boy she found cute and flirted with during their encounters." },
    { "characterId": "zuko", "relationshipType": "ally", "status": "positive", "history": "Her friend's love interest and her former target." }
  ],
  "groupMemberships": [
    { "groupId": "kyoshi-warriors", "roleInGroup": "specialist" },
    { "groupId": "azulas-team", "roleInGroup": "specialist" }
  ],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["cheerful", "energetic", "empathetic", "friendly", "loyal"],
  "negativeTraits": ["airheaded", "attention-seeking", "easily intimidated (initially)"],
  "motivations": ["friendship", "attention", "individuality", "having fun"],
  "fears": ["being ignored", "being just one of a crowd", "Azula's wrath"],
  "internalConflicts": ["desire for individuality vs. desire to be part of a group", "fear of Azula vs. loyalty to Mai"],
  "emotionalWounds": ["loss of individuality due to identical siblings"],
  "copingMechanisms": ["cheerfulness", "flirting", "acrobatics"],
  "worldview": "Believes life should be fun and positive, and values personal connection and individuality above all."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Long brown hair in a single braid", "brown-gray eyes", "acrobatic build"],
  "outfitStyles": ["Fire Nation circus uniform", "Kyoshi Warrior uniform", "beachwear"],
  "signaturePossessions": [],
  "ageProgression": false,
  "voiceActor": ["Olivia Hack"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "Wow, you're pretty!",
    "My aura has never been pinker!",
    "Yeah! Let's go to the party!"
  ],
  "speakingStyle": "bubbly",
  "linguisticQuirks": ["Frequent giggling", "uses Valley Girl-esque slang"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Innocent",
  "thematicKeywords": ["individuality", "friendship", "fear", "loyalty", "conformity", "identity", "betrayal"],
  "tagCategories": {
    "narrativeTags": ["secondary antagonist", "the ditz", "heel-face turn", "the heart", "perky"],
    "combatTags": ["non-bender", "chi-blocking", "acrobat", "hand-to-hand combat"],
    "relationshipTags": ["friend of Mai", "friend of Azula (former)", "member of Kyoshi Warriors", "has six sisters"],
    "emotionTags": ["cheerful", "bubbly", "energetic", "ditzy", "empathetic"],
    "politicalTags": ["nobility", "traitor (amnestied)", "circus performer"],
    "arcTags": ["Boiling Rock incident", "joined Kyoshi Warriors", "betrayed Azula", "reunited with sisters"],
    "worldTags": ["Fire Nation", "Fire Nation circus", "Azula's team", "Kyoshi Warriors"],
    "triviaTags": ["one of seven sisters", "ran away to join the circus", "reads auras", "teaches chi-blocking"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["azula", "mai", "suki", "sokka", "zuko"],
  "filterWeight": 75,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.98,
  "searchableKeywords": ["ty", "lee", "chi", "block", "acrobat", "circus", "pink", "aura", "sisters", "kyoshi", "azula", "mai"],
  "fuzzySynonyms": ["the circus girl", "the chi blocker", "pink girl", "the flexible one"],
  "isSuggestedInXContext": []
}
```