# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - AZULA

---

## 🖼️ UI - CARD VIEW

```md
- Name: Azula
- Nation: Fire Nation
- Short Description: A firebending prodigy and princess of the Fire Nation, Azula is a ruthlessly ambitious and manipulative strategist who serves as one of the Avatar's most formidable and psychologically terrifying adversaries.
```

---

## 📖 UI - EXPANDED VIEW

```md
- Name: Azula
- Nation: Fire Nation
- Age: 14 (in Avatar: The Last Airbender)
- Overview: Hailed as a prodigy and favored by her father, Fire Lord Ozai, Princess Azula was molded into the perfect weapon. Driven by a relentless pursuit of power and perfection, she uses fear and manipulation to achieve her goals, including the conquest of Ba Sing Se. However, beneath her confident and cruel exterior lies a deep-seated mental instability, fueled by the perceived rejection from her mother, which ultimately leads to her tragic downfall.

- Narrative Highlights:
  - Mastered a uniquely powerful and intense form of blue firebending.
  - Conquered the Earth Kingdom capital of Ba Sing Se through pure cunning and manipulation.
  - Mortally wounded Avatar Aang, nearly ending the Avatar Cycle.
  - Suffered a complete mental breakdown after being betrayed and defeated.

- Role in the Story: The primary antagonist of the second and third acts, whose perfectionism and psychological cruelty provide a dark mirror to Zuko's struggle for honor.

- Relationships:
  - Ozai (Father, Role Model)
  - Zuko (Brother, Object of Scorn and Rivalry)
  - Mai & Ty Lee (Subordinates disguised as Friends)
  - Ursa (Mother, Source of Insecurity and Hallucinations)
  - Iroh (Uncle, Viewed as a Traitor)

- Personality Traits:
  - Perfectionist & Sadistic
  - Confident & Narcissistic
  - Manipulative & Cunning
  - Mentally Unstable

- Notable Quotes:
  - "Trust is for fools! Fear is the only reliable way."
  - "Almost isn't good enough!"
  - "My own mother thought I was a monster... She was right, of course, but it still hurt."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - AZULA

---

## 🪪 Identity & Demographics

```json
{
  "id": "azula",
  "fullName": "Azula",
  "titles": ["Princess", "Crown Princess", "Fire Lord (uncrowned)"],
  "aliases": ["Kemurikage (disguise)"],
  "species": "human",
  "gender": "female",
  "ageChronological": 16,
  "ageBiological": 16,
  "ageRange": "teen",
  "birthDate": "85 AG",
  "deathDate": null,
  "nationality": "Fire Nation",
  "ethnicity": "Fire Nation",
  "nativeLocation": "Fire Nation Capital",
  "currentLocation": "Unknown",
  "socioeconomicStanding": "royalty",
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
  "advancedBending": ["lightning generation", "lightning redirection"],
  "nonBendingSkills": ["acrobatics", "psychological manipulation", "strategy", "stealth"],
  "uniqueTechniques": ["blue fire generation", "instantaneous lightning", "fire jets"],
  "powerMetrics": {
    "rawPower": 10,
    "technicalSkill": 10,
    "strategicAptitude": 10
  },
  "combatStyle": "overwhelming",
  "vulnerabilities": ["mental instability", "arrogance", "fear of betrayal", "need for control"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "Conquered Ba Sing Se with a small team",
    "Nearly ended the Avatar Cycle",
    "Dueled Zuko to a standstill during Sozin's Comet",
    "Mastered lightning generation at a young age",
    "Disbanded and controlled the Dai Li"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Fire Nation Royal Family (in exile)"],
  "pastAffiliations": ["Azula's team", "Dai Li", "Royal Fire Academy for Girls", "Fire Warriors"],
  "allegianceHistory": [],
  "isRoyalty": true,
  "politicalPower": "subversive",
  "politicalLeanings": ["imperialist", "authoritarian", "supremacist"],
  "moralAlignment": "lawful evil",
  "moralCompassDrift": true
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "antagonist",
  "screenTimeLevel": "main",
  "firstAppearance": "112-The-Storm",
  "finalAppearance": "Graphic Novel: Ashes of the Academy",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "corruption", "status": "completed", "summary": "Her descent from a confident prodigy into a paranoid, broken tyrant." },
    { "arcType": "power", "status": "completed", "summary": "Achieving ultimate power only to lose it due to her own psychological failings." }
  ],
  "keyTropes": ["The Dragon", "Foil", "Child Prodigy", "The Perfectionist", "Villainous Breakdown", "Sadist"]
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
      "focus": "Hunting her brother and the Avatar, conquering Omashu, and orchestrating the fall of Ba Sing Se.",
      "keyEpisodes": ["201", "203", "208", "218", "220"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "villain",
      "focus": "Dealing with the betrayal of her friends, asserting her dominance, and suffering a complete mental collapse.",
      "keyEpisodes": ["301", "305", "311", "315", "321"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "ozai", "relationshipType": "family", "status": "negative", "history": "Her father, whose approval she craved and whose cruelty she emulated." },
    { "characterId": "zuko", "relationshipType": "rival", "status": "negative", "history": "Her older brother, whom she viewed as inferior and relentlessly tormented." },
    { "characterId": "ursa", "relationshipType": "family", "status": "negative", "history": "Her mother, whose perceived favoritism of Zuko fueled her resentment and instability." },
    { "characterId": "mai", "relationshipType": "ally", "status": "negative", "history": "A childhood 'friend' she controlled through fear, who ultimately betrayed her." },
    { "characterId": "ty-lee", "relationshipType": "ally", "status": "negative", "history": "A childhood 'friend' she manipulated into service, who ultimately betrayed her." },
    { "characterId": "iroh", "relationshipType": "enemy", "status": "negative", "history": "Her uncle, whom she dismissed as a foolish traitor." }
  ],
  "groupMemberships": [
    { "groupId": "azulas-team", "roleInGroup": "leader" }
  ],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["intelligent", "confident", "determined", "charismatic", "ambitious"],
  "negativeTraits": ["sadistic", "manipulative", "narcissistic", "paranoid", "unempathetic", "perfectionist"],
  "motivations": ["power", "control", "perfection", "paternal approval"],
  "fears": ["betrayal", "losing control", "being seen as weak", "rejection (by her mother)"],
  "internalConflicts": ["need for control vs. fear of abandonment", "belief in superiority vs. deep-seated insecurity", "perceived maternal rejection vs. desire for love"],
  "emotionalWounds": ["maternal abandonment (perceived)", "conditional paternal love"],
  "copingMechanisms": ["cruelty", "manipulation", "projecting insecurity", "striving for perfection"],
  "worldview": "Believes that fear is the only reliable way to control others and that power is the ultimate measure of worth."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Amber gold eyes", "black hair", "often wears dark red lipstick"],
  "outfitStyles": ["Fire Nation royal armor", "Kyoshi Warrior disguise", "beachwear"],
  "signaturePossessions": ["Hairpin (used as a weapon)"],
  "ageProgression": false,
  "voiceActor": ["Grey DeLisle"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "That's a sharp outfit, Chan. Careful. You could puncture the hull of an empire-class Fire Nation battleship, leaving thousands to drown at sea... because it's so sharp.",
    "Almost isn't good enough!",
    "Don't flatter yourself. You were never even a player."
  ],
  "speakingStyle": "formal",
  "linguisticQuirks": ["Precise and cutting language", "uses condescending praise", "psychological taunts"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Tyrant",
  "thematicKeywords": ["power", "perfection", "fear", "control", "madness", "betrayal", "family", "psychology", "legacy", "narcissism"],
  "tagCategories": {
    "narrativeTags": ["antagonist", "the dragon", "villainous breakdown", "child prodigy", "dark mirror", "tragic villain"],
    "combatTags": ["firebender", "lightning generation", "blue fire", "master firebender", "Agni Kai", "acrobatic fighter"],
    "relationshipTags": ["daughter of Ozai", "sister of Zuko", "enemy of Team Avatar", "leader of her own team", "betrayed by friends"],
    "emotionTags": ["confident", "cruel", "manipulative", "sadistic", "paranoid", "unstable"],
    "politicalTags": ["princess", "conqueror", "usurper", "head of Dai Li"],
    "arcTags": ["fall of Ba Sing Se", "mental breakdown", "hunted the Avatar", "hunted her mother", "Kemurikage plot"],
    "worldTags": ["Fire Nation royalty", "Dai Li", "Royal Fire Academy", "Azula's team"],
    "triviaTags": ["Zuzu's sister", "blue fire", "can't flirt", "hates being called a monster"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["zuko", "ozai", "iroh", "ursa", "mai", "ty-lee", "aang", "katara"],
  "filterWeight": 96,
  "canonicalImportance": "core",
  "dataCompletenessScore": 0.99,
  "searchableKeywords": ["azula", "fire", "princess", "lightning", "blue", "prodigy", "betrayal", "madness", "conqueror", "ba", "sing", "se", "zuzu", "ozai"],
  "fuzzySynonyms": ["zuko's sister", "the fire princess", "blue flame bender", "the girl who beat ba sing se"],
  "isSuggestedInXContext": []
}
```