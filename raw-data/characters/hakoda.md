# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - HAKODA

---

## 🖼️ UI - CARD VIEW

```md
- Name: Hakoda
- Nation: Southern Water Tribe
- Short Description: The brave and strategic chieftain of the Southern Water Tribe and the father of Sokka and Katara. He leaves his children to lead his tribe's warriors against the Fire Nation in the Hundred Year War.
```

---

## 📖 UI - EXPANDED VIEW

```md
- Name: Hakoda
- Nation: Southern Water Tribe
- Age: Unknown (Adult)
- Overview: Hakoda is a respected warrior and leader, burdened by the difficult choice to leave his family to fight for the future of the world. A brilliant tactician and a loving father, his influence shapes his son Sokka's own journey into leadership. After enduring capture and imprisonment at the Boiling Rock, he reunites with his children and plays a pivotal role in the Day of Black Sun invasion and the post-war reconstruction of the Southern Water Tribe.

- Narrative Highlights:
  - Led the warriors of the Southern Water Tribe against the Fire Nation.
  - Provided key leadership during the invasion of the Fire Nation.
  - Was imprisoned in and escaped from the high-security prison, the Boiling Rock.
  - Became Head Chieftain of the unified Southern Water Tribe after the war.

- Role in the Story: A guiding father figure whose courage and strategic mind inspire his children and represent the Water Tribe's resilience and contribution to the war.

- Relationships:
  - Sokka (Son & Protégé)
  - Katara (Daughter)
  - Kya (Wife, Deceased)
  - Kanna (Mother)
  - Malina (Girlfriend)
  - Bato (Close Friend & Fellow Warrior)

- Personality Traits:
  - Brave & Courageous
  - Strategic & Ingenious
  - Loving & Fatherly
  - Respected Leader

- Notable Quotes:
  - "You and your brother are my entire world."
  - "I'm the proudest father in the world."
  - "We're going to show the Fire Nation that we believe in our cause as much as they believe in theirs."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - HAKODA

---

## 🪪 Identity & Demographics

```json
{
  "id": "hakoda",
  "fullName": "Hakoda",
  "titles": ["Chieftain", "Head Chieftain"],
  "aliases": [],
  "species": "human",
  "gender": "male",
  "ageChronological": 45,
  "ageBiological": 45,
  "ageRange": "adult",
  "birthDate": "c. 55 AG",
  "deathDate": null,
  "nationality": "Southern Water Tribe",
  "ethnicity": "Water Tribe",
  "nativeLocation": "Wolf Cove",
  "currentLocation": "Southern Water Tribe",
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
  "nonBendingSkills": ["strategy", "leadership", "weapon crafting", "ship captaining", "hand-to-hand combat"],
  "uniqueTechniques": ["tangle mine construction"],
  "powerMetrics": {
    "rawPower": 3,
    "technicalSkill": 4,
    "strategicAptitude": 9
  },
  "combatStyle": "strategic",
  "vulnerabilities": ["his children", "physical injury without a healer"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Led the Southern Water Tribe warriors in the war",
    "Key commander in the Day of Black Sun invasion",
    "Escaped the Boiling Rock prison",
    "Elected Head Chieftain of the Southern Water Tribe"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Southern Water Tribe"],
  "pastAffiliations": ["Fire Nation prisoner"],
  "allegianceHistory": [],
  "isRoyalty": false,
  "politicalPower": "ruling",
  "politicalLeanings": ["reconstructionist", "modernist", "nationalist"],
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
  "firstAppearance": "115-Bato-of-the-Water-Tribe",
  "finalAppearance": "Avatar: The Last Airbender: Quest for Balance",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "family", "status": "completed", "summary": "Reconciling with the children he left behind and rebuilding his family after the war." }
  ],
  "keyTropes": ["The Leader", "Action Dad", "The Good Captain", "Reasonable Authority Figure", "Frontline General"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "supporting",
      "focus": "Appearing to reunite briefly with his children and establish his role in the war.",
      "keyEpisodes": ["219"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "hero",
      "focus": "Reconciling with Katara, leading the invasion, getting captured, and escaping the Boiling Rock.",
      "keyEpisodes": ["301", "310", "315", "316"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "sokka", "relationshipType": "family", "status": "positive", "history": "His son and protégé, whom he trained to be a warrior and leader." },
    { "characterId": "katara", "relationshipType": "family", "status": "positive", "history": "His daughter, with whom he reconciled after years of absence." },
    { "characterId": "kya", "relationshipType": "romantic", "status": "resolved", "history": "His wife, whose death he avenged." },
    { "characterId": "kanna", "relationshipType": "family", "status": "positive", "history": "His mother, who raised his children in his absence." },
    { "characterId": "bato", "relationshipType": "ally", "status": "positive", "history": "His close friend and second-in-command." },
    { "characterId": "malina", "relationshipType": "romantic", "status": "positive", "history": "His girlfriend and partner in rebuilding the Southern Water Tribe." },
    { "characterId": "gilak", "relationshipType": "enemy", "status": "resolved", "history": "His former friend who became a nationalist adversary." }
  ],
  "groupMemberships": [],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["brave", "strategic", "loving", "inspirational", "resilient", "wise"],
  "negativeTraits": ["emotionally distant (due to duty)"],
  "motivations": ["protecting his family", "liberating his people", "ending the war", "avenging his wife"],
  "fears": ["failing his children", "his people losing their way"],
  "internalConflicts": ["duty as a warrior vs. duty as a father"],
  "emotionalWounds": ["death of his wife", "leaving his children behind"],
  "copingMechanisms": ["focusing on the mission", "strategic planning"],
  "worldview": "Believes in fighting for what is right, even at great personal cost, and that people are capable of change."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Tall",
  "notableFeatures": ["Warrior's wolf tail hairstyle", "blue eyes", "Water Tribe warrior attire"],
  "outfitStyles": ["Southern Water Tribe warrior gear"],
  "signaturePossessions": ["Water Tribe weapons"],
  "ageProgression": false,
  "voiceActor": ["André Sogliuzzo"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "You and your brother are my entire world.",
    "I am the proudest father in the world.",
    "People can change."
  ],
  "speakingStyle": "formal",
  "linguisticQuirks": ["Speaks with the authority and warmth of a leader"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Leader",
  "thematicKeywords": ["fatherhood", "duty", "leadership", "war", "sacrifice", "strategy", "family", "reconciliation"],
  "tagCategories": {
    "narrativeTags": ["action dad", "the good captain", "the leader", "reasonable authority figure"],
    "combatTags": ["non-bender", "warrior", "strategist"],
    "relationshipTags": ["father of Sokka", "father of Katara", "husband of Kya", "son of Kanna", "boyfriend of Malina"],
    "emotionTags": ["brave", "loving", "strategic", "proud", "responsible"],
    "politicalTags": ["chieftain", "head chieftain", "war leader"],
    "arcTags": ["Day of Black Sun invasion", "Boiling Rock escapee", "Southern Reconstruction"],
    "worldTags": ["Southern Water Tribe", "Wolf Cove"],
    "triviaTags": ["Mark of the Wise", "inventor", "Sokka's father", "voiced by André Sogliuzzo"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["sokka", "katara", "kya", "kanna", "bato", "gilak"],
  "filterWeight": 60,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.98,
  "searchableKeywords": ["hakoda", "father", "sokka", "katara", "chief", "chieftain", "water", "tribe", "south", "boiling", "rock", "invasion"],
  "fuzzySynonyms": ["sokka's dad", "katara's dad", "chief hakoda", "the southern water tribe leader"],
  "isSuggestedInXContext": []
}
```