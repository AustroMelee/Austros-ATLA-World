# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0)

*Standardized for Avatar Encyclopedia, Maxi-Minimalist UX Engine*

**PHILOSOPHY:** This schema treats each character not as a collection of facts, but as a nexus of potential actions, relationships, and thematic currents. Every field is a vector for filtering, a hook for semantic association, and a gear in the predictive engine. We are building the character's soul in JSON format.

---

## 🖼️ UI - CARD VIEW
*(Presentation Layer 1 - Unchanged)*

```md
- Name: 
- Nation: 
- Role: (e.g., The Avatar, Loyal Mount, NWT Chief)
- Short Description: (1-2 sentences summarizing their core identity and role)
```

---

## 📖 UI - EXPANDED VIEW
*(Presentation Layer 2 - Unchanged)*

```md
- Name: 
- Nation: 
- Age: 
- Role: (Their most notable role or title)
- Overview: (A concise paragraph detailing their journey and significance)
- Narrative Highlights: [...]
- Role in the Story: (A single, defining sentence)
- Relationships: [...]
- Personality Traits: [...]
- Notable Quotes: [...]
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION)
*The invisible, hyper-structured engine. **Never rendered directly to the user.***

---

## 🪪 Identity & Demographics

```json
{
  "id": "string (slug format)",
  "fullName": "string",
  "role": "string", // e.g., The Avatar, Loyal Mount, NWT Chief
  "titles": "string[]", // e.g., "Fire Lord", "Master", "Chief"
  "aliases": "string[]", // Nicknames, cover identities
  "species": "string",
  "gender": "string",
  "ageChronological": "number", // Actual time passed since birth
  "ageBiological": "number", // Physical age (for cases like Aang)
  "ageRange": "child | teen | young adult | adult | elder",
  "birthDate": "string (e.g., 85 AG)",
  "deathDate": "string | null",
  "nationality": "string",
  "ethnicity": "string",
  "nativeLocation": "string",
  "currentLocation": "string",
  "socioeconomicStanding": "royalty | nobility | monastic | merchant | commoner | military | outcast | refugee",
  "languagesSpoken": "string[]"
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": "boolean",
  "bendingElement": "fire | earth | air | water | null",
  "bendingProficiency": "novice | proficient | master | legendary", // More granular than a boolean
  "advancedBending": "string[]", // lightning, metal, blood, healing, spiritual projection
  "nonBendingSkills": "string[]", // chi-blocking, swordsmanship, strategy, engineering
  "uniqueTechniques": "string[]", // Agni Kai, seismic sense, breath of fire, air scooter
  "powerMetrics": { // Replaces the single "powerLevel"
    "rawPower": "number (1-10)",
    "technicalSkill": "number (1-10)",
    "strategicAptitude": "number (1-10)"
  },
  "combatStyle": "overwhelming | evasive | defensive | opportunistic | technical | brutal",
  "vulnerabilities": "string[]", // e.g., "emotional manipulation", "overconfidence", "predictable patterns"
  "isLegendaryFighter": "boolean",
  "notableFeats": "string[]"
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": "string[]", // Team Avatar, Fire Nation, Dai Li
  "pastAffiliations": "string[]",
  "allegianceHistory": [ // Tracks shifts over time for complex characters
    { "affiliation": "string", "startDate": "string", "endDate": "string", "reasonForLeaving": "string" }
  ],
  "isRoyalty": "boolean",
  "politicalPower": "none | influential | ruling | subversive",
  "politicalLeanings": "string[]", // imperialist, isolationist, nationalist, reformist, anarchist
  "moralAlignment": "lawful good | neutral good | chaotic good | lawful neutral | true neutral | chaotic neutral | lawful evil | neutral evil | chaotic evil",
  "moralCompassDrift": "boolean" // Has their core morality shifted significantly?
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "protagonist | antagonist | deuteragonist | foil | mentor | catalyst | comic relief",
  "screenTimeLevel": "minor | supporting | major | main",
  "firstAppearance": "string (Episode ID)",
  "finalAppearance": "string (Episode ID)",
  "deathStatus": "alive | deceased | ambiguous | spiritual form",
  "causeOfDeath": "string | null",
  "narrativeArcs": [ // Granular tracking of character development
    { "arcType": "redemption | revenge | growth | corruption", "status": "active | completed | failed", "summary": "string" }
  ],
  "keyTropes": "string[]" // e.g., "The Chosen One", "Redemption Equals Death", "Surrogate-Parent"
}
```

---

## 📚 Role By Era/Season
*(Expanded for greater context)*

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 1",
      "role": "hero | villain | neutral | supporting",
      "focus": "string (e.g., 'Learning waterbending', 'Hunting the Avatar')",
      "keyEpisodes": "string[]"
    },
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "hero | villain | neutral | supporting",
      "focus": "string (e.g., 'Struggling with earthbending', 'Fugitive life')",
      "keyEpisodes": "string[]"
    } // ... and so on for Book 3, comics, LoK, etc.
  ]
}
```

---

## 🤝 Relational Matrix
*(Formalized for programmatic relationship mapping)*

```json
{
  "relationships": [
    { "characterId": "string", "relationshipType": "family | mentor | student | rival | romantic | ally | enemy", "status": "positive | negative | complicated | resolved | estranged", "history": "string (e.g., 'Former rival, now close friend')" }
  ],
  "groupMemberships": [
    { "groupId": "string (e.g., team-avatar)", "roleInGroup": "leader | heart | strategist | muscle | specialist" }
  ],
  "petCompanions": "string[]"
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": "string[]", // idealistic, loyal, brave
  "negativeTraits": "string[]", // stubborn, reckless, arrogant
  "motivations": "string[]", // honor, family, balance, power, survival, love
  "fears": "string[]", // failure, loneliness, losing control, becoming their parent
  "internalConflicts": "string[]", // duty vs. desire, pacifism vs. necessity
  "emotionalWounds": "string[]", // abandonment, betrayal, survivor's guilt, loss of identity
  "copingMechanisms": "string[]", // humor, aggression, isolation, meditation
  "worldview": "string (e.g., 'Believes in the inherent goodness of people')"
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "string",
  "notableFeatures": "string[]",
  "outfitStyles": "string[]",
  "signaturePossessions": "string[]", // e.g., "Mother's necklace", "Pai Sho tile", "Blue Spirit mask"
  "ageProgression": "boolean",
  "voiceActor": "string[]" // Array to handle multiple actors across different media
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": "string[]",
  "speakingStyle": "formal | casual | stoic | eccentric | poetic | blunt",
  "linguisticQuirks": "string[]", // e.g., "Frequent use of sarcasm", "Refers to self in third person"
  "catchphrases": "string[]"
}
```

---

## 🧱 Semantic & Thematic Index
*(The true heart of the filtering engine)*

```json
{
  "archetype": "The Hero | The Rebel | The Mentor | The Trickster | The Ruler | The Innocent", // Jungian/narrative archetype
  "thematicKeywords": "string[]", // e.g., "honor", "destiny", "forgiveness", "tradition vs progress", "war", "spirituality"
  "tagCategories": {
    "narrativeTags": "string[]",
    "combatTags": "string[]",
    "relationshipTags": "string[]",
    "emotionTags": "string[]",
    "politicalTags": "string[]",
    "arcTags": "string[]",
    "worldTags": "string[]",
    "triviaTags": "string[]"
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": "string[]", // Pre-computed primary relationships
  "filterWeight": "number (0-100)", // Importance in general search results
  "canonicalImportance": "core | primary | secondary | tertiary | background",
  "dataCompletenessScore": "number (0.0-1.0)", // For internal maintenance
  "searchableKeywords": "string[]", // Stemmed, lower-cased keywords
  "fuzzySynonyms": "string[]", // Common misspellings or alternative phrases
  "isSuggestedInXContext": "boolean[]" // Future use for predictive UI
}
```