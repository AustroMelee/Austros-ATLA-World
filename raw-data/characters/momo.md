# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - MOMO

---

## 🖼️ UI - CARD VIEW

```md
- Name: Momo
- Nation: Air Nomads
- Short Description: A curious and intelligent winged lemur from the Southern Air Temple. As one of the last vestiges of his species, he becomes a loyal companion and a cherished member of Team Avatar.
```

---

## 📖 UI - EXPANDED VIEW

```md
- Name: Momo
- Nation: Air Nomads
- Age: Unknown
- Overview: Discovered by Aang at the abandoned Southern Air Temple, Momo is believed to be one of the last of the winged lemurs. He quickly joins Team Avatar, providing comic relief, unexpected assistance, and a living connection to Aang's lost home. His strong bond with both Aang and Appa makes him an integral part of their found family.

- Narrative Highlights:
  - Discovered by Aang at the Southern Air Temple and named after a peach.
  - Befriended a pack of pygmy pumas in Ba Sing Se to escape capture.
  - Frequently helped the team in small but crucial ways with his agility and small size.
  - Engaged in a "samurai duel" with Appa during one of Aang's sleep-deprived hallucinations.

- Role in the Story: A loyal animal companion who serves as a source of levity, a resourceful scout, and a constant reminder of the Air Nomad culture that was lost.

- Relationships:
  - Aang (Owner, Best Friend)
  - Appa (Friend, "Big Brother," Rival for food)
  - Sokka (Frequent target of food theft)
  - Team Avatar (His Found Family)

- Personality Traits:
  - Curious & Mischievous
  - Intelligent & Resourceful
  - Loyal & Playful
  - Constantly hungry

- Notable Quotes:
  - (Communicates through a variety of expressive chitters, squeaks, and screeches)
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - MOMO

---

## 🪪 Identity & Demographics

```json
{
  "id": "momo",
  "fullName": "Momo",
  "titles": ["Aang's Pet Lemur"],
  "aliases": ["Twinklewings"],
  "species": "Winged Lemur",
  "gender": "male",
  "ageChronological": 100,
  "ageBiological": 1,
  "ageRange": "adult",
  "birthDate": "Unknown (before 12 BG)",
  "deathDate": "Unknown (after 124 AG)",
  "nationality": "Southern Air Temple",
  "ethnicity": "Air Nomad (species)",
  "nativeLocation": "Southern Air Temple",
  "currentLocation": "Deceased",
  "socioeconomicStanding": "monastic",
  "languagesSpoken": ["Winged Lemur Language"]
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
  "nonBendingSkills": ["flight (gliding)", "acrobatics", "enhanced senses (sight, smell)", "stealth", "scavenging"],
  "uniqueTechniques": [],
  "powerMetrics": {
    "rawPower": 1,
    "technicalSkill": 5,
    "strategicAptitude": 3
  },
  "combatStyle": "opportunistic",
  "vulnerabilities": ["larger predators", "Sokka's hunger"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Freed Katara from her bonds",
    "Befriended pygmy pumas to escape capture",
    "Helped create a distraction at the Crescent Island Fire Temple",
    "Stole a moon peach from Sokka"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Team Avatar", "Air Nomads"],
  "pastAffiliations": [],
  "allegianceHistory": [],
  "isRoyalty": false,
  "politicalPower": "none",
  "politicalLeanings": [],
  "moralAlignment": "true neutral",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "comic relief",
  "screenTimeLevel": "major",
  "firstAppearance": "103-The-Southern-Air-Temple",
  "finalAppearance": "Graphic Novel: Ramen Rumble",
  "deathStatus": "deceased",
  "causeOfDeath": "Natural causes (presumed)",
  "narrativeArcs": [],
  "keyTropes": ["Team Pet", "Animal Companion", "Last of His Kind (nearly)", "Plucky Comic Relief", "Non-Human Sidekick", "The Scrounger"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "Avatar: The Last Airbender - Book 1",
      "role": "supporting",
      "focus": "Joining the team as a pet and providing comic relief.",
      "keyEpisodes": ["103", "109"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 2",
      "role": "supporting",
      "focus": "His solo adventure in Ba Sing Se and grieving the loss of Appa.",
      "keyEpisodes": ["215"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "supporting",
      "focus": "Assisting the team in minor ways and featuring prominently in Aang's hallucinations.",
      "keyEpisodes": ["309"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "aang", "relationshipType": "ally", "status": "positive", "history": "His owner and best friend, who saved him from being Sokka's dinner." },
    { "characterId": "appa", "relationshipType": "ally", "status": "positive", "history": "His best friend, fellow Air Nomad animal, and sometimes a bed." },
    { "characterId": "sokka", "relationshipType": "ally", "status": "complicated", "history": "The one who initially wanted to eat him, now a source of food and friendly rivalry." }
  ],
  "groupMemberships": [
    { "groupId": "team-avatar", "roleInGroup": "specialist" }
  ],
  "petCompanions": []
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["loyal", "curious", "intelligent", "resourceful", "playful", "compassionate"],
  "negativeTraits": ["mischievous", "gluttonous", "easily distracted"],
  "motivations": ["food (especially peaches)", "curiosity", "staying with Aang and Appa"],
  "fears": ["larger predators", "being alone"],
  "internalConflicts": [],
  "emotionalWounds": ["loss of his home and species"],
  "copingMechanisms": ["seeking comfort with Aang or Appa", "finding food"],
  "worldview": "The world is full of interesting things to explore, and most of them are probably edible."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Small",
  "notableFeatures": ["Large ears", "large green eyes", "bat-like wings", "long striped tail"],
  "outfitStyles": ["Kimono (in hallucination)"],
  "signaturePossessions": ["Moon peach (when available)"],
  "ageProgression": false,
  "voiceActor": ["Dee Bradley Baker"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [],
  "speakingStyle": "eccentric",
  "linguisticQuirks": ["Communicates through a variety of chitters, squeaks, and screeches"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Jester",
  "thematicKeywords": ["survival", "loyalty", "friendship", "humor", "nature", "loss", "curiosity"],
  "tagCategories": {
    "narrativeTags": ["animal companion", "team pet", "comic relief", "last of his kind"],
    "combatTags": ["non-bender", "flight (gliding)"],
    "relationshipTags": ["friend of Aang", "friend of Appa", "rival of Sokka"],
    "emotionTags": ["curious", "mischievous", "loyal", "playful", "hungry"],
    "politicalTags": [],
    "arcTags": ["found at Southern Air Temple", "befriended pygmy pumas"],
    "worldTags": ["Air Nomads", "Southern Air Temple", "winged lemur"],
    "triviaTags": ["named after a peach", "almost eaten by Sokka", "reincarnation of Gyatso (scrapped idea)", "voiced by Dee Bradley Baker"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["aang", "appa", "sokka", "gyatso"],
  "filterWeight": 50,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.90,
  "searchableKeywords": ["momo", "lemur", "winged", "aang", "pet", "peach", "appa", "air", "nomad"],
  "fuzzySynonyms": ["the lemur", "aang's lemur", "the flying lemur", "twinklewings"],
  "isSuggestedInXContext": []
}
```