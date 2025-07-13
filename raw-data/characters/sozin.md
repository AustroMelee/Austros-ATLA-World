# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - SOZIN

---

## 🖼️ UI - CARD VIEW

```md
- Name: Sozin
- Nation: Fire Nation
- Short Description: The ambitious and visionary Fire Lord whose desire to spread the Fire Nation's prosperity led him to betray his best friend, Avatar Roku, and plunge the world into the Hundred Year War.
```

---

## 📖 UI - EXPANDED VIEW

```md
- Name: Sozin
- Nation: Fire Nation
- Age: 102 (at time of death)
- Overview: Once the best friend of Avatar Roku, Prince Sozin's ascension to Fire Lord ignited his ambition to expand his nation's influence across the globe. Believing he was sharing the Fire Nation's greatness, his vision was rejected by Roku. This ideological schism led to a bitter rivalry that culminated in Sozin betraying Roku, leaving him to die in a volcanic eruption. With the Avatar gone, Sozin harnessed the power of a great comet to commit genocide against the Air Nomads and begin the Hundred Year War.

- Narrative Highlights:
  - Grew up as the best friend of Roku, before Roku was identified as the Avatar.
  - Betrayed Roku by leaving him to die in a volcanic eruption to pursue his conquest.
  - Used the power of a comet to wipe out the Air Nomads.
  - Instigated the Hundred Year War.

- Role in the Story: The original antagonist of the Hundred Year War, whose past actions and friendship with Roku define the central conflict of the series.

- Relationships:
  - Roku (Best Friend turned Arch-Nemesis)
  - Azulon (Son, Successor)
  - Taiso (Father)
  - Aang (The target of his lifelong hunt)

- Personality Traits:
  - Ambitious & Visionary
  - Imperialistic & Ruthless
  - Cunning & Patient
  - Conflicted (initially)

- Notable Quotes:
  - "With Roku gone and the great comet returning, the timing was perfect to change the world."
  - "We have a chance to share our greatness with the rest of the world."
  - "Without you, all my plans are suddenly possible. I have a vision for the future, Roku."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - SOZIN

---

## 🪪 Identity & Demographics

```json
{
  "id": "sozin",
  "fullName": "Sozin",
  "titles": ["Fire Lord", "Prince"],
  "aliases": ["Lee (undercover)"],
  "species": "human",
  "gender": "male",
  "ageChronological": 102,
  "ageBiological": 102,
  "ageRange": "elder",
  "birthDate": "82 BG",
  "deathDate": "20 AG",
  "nationality": "Fire Nation",
  "ethnicity": "Fire Nation",
  "nativeLocation": "Fire Nation Capital",
  "currentLocation": "Deceased",
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
  "bendingProficiency": "master",
  "advancedBending": [],
  "nonBendingSkills": ["military strategy", "political manipulation", "long-term planning"],
  "uniqueTechniques": ["heat redirection"],
  "powerMetrics": {
    "rawPower": 9,
    "technicalSkill": 8,
    "strategicAptitude": 10
  },
  "combatStyle": "aggressive",
  "vulnerabilities": ["his friendship with Roku (initially)", "arrogance"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "Initiated the Hundred Year War",
    "Committed genocide against the Air Nomads",
    "Betrayed and outlived Avatar Roku",
    "Ruled as Fire Lord for 78 years"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Fire Nation (deceased)"],
  "pastAffiliations": ["Fire Nation Royal Family"],
  "allegianceHistory": [],
  "isRoyalty": true,
  "politicalPower": "ruling",
  "politicalLeanings": ["imperialist", "nationalist", "militarist", "industrialist"],
  "moralAlignment": "lawful evil",
  "moralCompassDrift": true
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "antagonist",
  "screenTimeLevel": "minor",
  "firstAppearance": "306-The-Avatar-and-the-Fire-Lord",
  "finalAppearance": "The Reckoning of Roku - Epilogue",
  "deathStatus": "deceased",
  "causeOfDeath": "Old age",
  "narrativeArcs": [
    { "arcType": "corruption", "status": "completed", "summary": "His transformation from a well-intentioned prince to a ruthless, world-conquering tyrant." }
  ],
  "keyTropes": ["The Emperor", "Well-Intentioned Extremist", "Best Friends-to-Enemies", "The Corrupter", "Face-Heel Turn", "Posthumous Character"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender",
      "role": "villain",
      "focus": "Appearing in flashbacks that detail the origins of the war and his tragic friendship with Roku.",
      "keyEpisodes": ["306"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "roku", "relationshipType": "rival", "status": "negative", "history": "His best friend, whom he betrayed and left to die for the sake of his ambitions." },
    { "characterId": "azulon", "relationshipType": "family", "status": "positive", "history": "His son and successor." },
    { "characterId": "taiso", "relationshipType": "family", "status": "negative", "history": "His father, whose traditionalist views he opposed." },
    { "characterId": "zeisan", "relationshipType": "family", "status": "negative", "history": "His non-bending sister, whom he viewed as a political rival." },
    { "characterId": "aang", "relationshipType": "enemy", "status": "resolved", "history": "The new Avatar he hunted for the remainder of his life." }
  ],
  "groupMemberships": [],
  "petCompanions": ["His Dragon"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["ambitious", "visionary", "intelligent", "charismatic (initially)"],
  "negativeTraits": ["ruthless", "imperialistic", "xenophobic", "manipulative", "sociopathic"],
  "motivations": ["spreading Fire Nation 'greatness'", "power", "legacy", "progress"],
  "fears": ["stagnation", "the Avatar thwarting his plans"],
  "internalConflicts": ["friendship with Roku vs. his ambition"],
  "emotionalWounds": ["familial pressure and rivalry"],
  "copingMechanisms": ["aggression", "long-term scheming", "propaganda"],
  "worldview": "Believes the Fire Nation is culturally and technologically superior and has a duty to share its prosperity with the world, by force if necessary."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Pointed beard (in youth)", "Fire Lord's topknot"],
  "outfitStyles": ["Fire Lord royal robes", "Fire Nation prince attire"],
  "signaturePossessions": ["Crown Prince headpiece (gifted to Roku)"],
  "ageProgression": true,
  "voiceActor": ["Ron Perlman", "Lex Lang", "Sean Marquette"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "I have a vision for the future, Roku.",
    "We have a chance to share our greatness with the rest of the world.",
    "Without you, all my plans are suddenly possible."
  ],
  "speakingStyle": "formal",
  "linguisticQuirks": ["Speaks with royal authority and conviction"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Tyrant",
  "thematicKeywords": ["ambition", "imperialism", "friendship", "betrayal", "war", "genocide", "legacy", "progress", "nationalism"],
  "tagCategories": {
    "narrativeTags": ["original antagonist", "well-intentioned extremist", "best friends to enemies", "posthumous character"],
    "combatTags": ["firebender", "master firebender", "heat redirection"],
    "relationshipTags": ["best friend of Roku", "father of Azulon", "grandfather of Iroh", "great-grandfather of Zuko"],
    "emotionTags": ["ambitious", "ruthless", "visionary", "conflicted (initially)"],
    "politicalTags": ["Fire Lord", "prince", "warmonger", "instigator of war"],
    "arcTags": ["started the Hundred Year War", "wiped out the Air Nomads", "betrayed Roku"],
    "worldTags": ["Fire Nation", "Fire Nation Royal Family", "Sozin's Comet"],
    "triviaTags": ["has a dragon", "lived to 102", "Sozin's Comet is named for him", "longest-reigning Fire Lord"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["roku", "aang", "azulon", "ozai", "zuko"],
  "filterWeight": 80,
  "canonicalImportance": "primary",
  "dataCompletenessScore": 1.0,
  "searchableKeywords": ["sozin", "fire", "lord", "roku", "comet", "war", "genocide", "air", "nomad", "betrayal"],
  "fuzzySynonyms": ["the fire lord who started the war", "roku's best friend", "the first villain"],
  "isSuggestedInXContext": []
}
```