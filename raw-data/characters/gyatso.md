# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - GYATSO

---

## 🖼️ UI - CARD VIEW

```md
- Name: Monk Gyatso
- Nation: Air Nomads
- Short Description: A wise and kind-hearted airbending master from the Southern Air Temple. He was a lifelong friend to Avatar Roku and later became the beloved guardian and father figure to Avatar Aang.
```

---

## 📖 UI - EXPANDED VIEW

```md
- Name: Monk Gyatso
- Nation: Air Nomads
- Age: Late 70s (at time of death)
- Overview: Known for his exceptional wisdom and mischievous sense of humor, Monk Gyatso was a high-ranking member of the Southern Air Temple. As a young man, he befriended and traveled with Avatar Roku, offering him crucial perspective. Decades later, he became the guardian and mentor to Aang, Roku's successor. He believed in balancing discipline with joy, a philosophy that put him at odds with the other council elders and ultimately led to Aang's departure.

- Narrative Highlights:
  - Was a close personal friend of Avatar Roku.
  - Served as the primary guardian, mentor, and father figure to Avatar Aang.
  - His compassionate approach to Aang's training conflicted with the other Air Nomad elders.
  - Died defending the Southern Air Temple, taking many Fire Nation soldiers with him.

- Role in the Story: A guiding father figure whose love and wisdom profoundly shaped Aang's character, and whose death represents Aang's greatest personal loss.

- Relationships:
  - Aang (Student, Surrogate Son)
  - Roku (Best Friend)
  - Pathik (Friend)
  - The Council of Elders (Colleagues)

- Personality Traits:
  - Kind & Compassionate
  - Wise & Patient
  - Humorous & Playful
  - Fiercely Protective

- Notable Quotes:
  - "We can't concern ourselves with what was. We must act on what is."
  - "Come closer. I have some wisdom for you... *splat*" (before a pie-throwing prank)
  - "All I want is for him to be happy."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - GYATSO

---

## 🪪 Identity & Demographics

```json
{
  "id": "gyatso",
  "fullName": "Gyatso",
  "titles": ["Monk", "Master", "High Monk"],
  "aliases": [],
  "species": "human",
  "gender": "male",
  "ageChronological": 78,
  "ageBiological": 78,
  "ageRange": "elder",
  "birthDate": "Late 70s BG",
  "deathDate": "0 AG",
  "nationality": "Southern Air Temple",
  "ethnicity": "Air Nomad",
  "nativeLocation": "Southern Air Temple",
  "currentLocation": "Deceased",
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
  "bendingProficiency": "master",
  "advancedBending": [],
  "nonBendingSkills": ["baking (fruit pies)", "Pai Sho", "philosophy"],
  "uniqueTechniques": ["using airbending to cheat at Pai Sho"],
  "powerMetrics": {
    "rawPower": 9,
    "technicalSkill": 9,
    "strategicAptitude": 8
  },
  "combatStyle": "evasive",
  "vulnerabilities": ["deep affection for his loved ones"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "Considered one of the greatest airbenders of his time",
    "Defeated numerous comet-enhanced Fire Nation soldiers before his death",
    "Invented the Air Nomad joke 'Flamey-O'"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Air Nomads (deceased)"],
  "pastAffiliations": ["Council of Elders"],
  "allegianceHistory": [],
  "isRoyalty": false,
  "politicalPower": "influential",
  "politicalLeanings": ["pacifist", "traditionalist (with reservations)"],
  "moralAlignment": "lawful good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "mentor",
  "screenTimeLevel": "minor",
  "firstAppearance": "103-The-Southern-Air-Temple",
  "finalAppearance": "Graphic Novel: The Promise Part Three",
  "deathStatus": "deceased",
  "causeOfDeath": "Killed during the Air Nomad Genocide",
  "narrativeArcs": [],
  "keyTropes": ["The Mentor", "Cool Old Guy", "Parental Substitute", "Posthumous Character", "Trickster Mentor", "Last Stand"]
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
      "focus": "Appearing in flashbacks that establish his loving, fatherly relationship with Aang and his friendship with Roku.",
      "keyEpisodes": ["103", "112", "306"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "aang", "relationshipType": "student", "status": "positive", "history": "His student and surrogate son, whom he loved dearly." },
    { "characterId": "roku", "relationshipType": "ally", "status": "positive", "history": "A close friend from his youth, with whom he traveled and trained." },
    { "characterId": "pathik", "relationshipType": "ally", "status": "positive", "history": "A friend from his younger years." },
    { "characterId": "yama", "relationshipType": "family", "status": "resolved", "history": "His older sister, whose death caused him great grief." }
  ],
  "groupMemberships": [
    { "groupId": "council-of-elders", "roleInGroup": "member" }
  ],
  "petCompanions": ["Lola (sky bison)"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["wise", "kind", "humorous", "compassionate", "patient"],
  "negativeTraits": ["prone to pranks", "argumentative (in youth)"],
  "motivations": ["Aang's happiness and well-being", "fun and games", "maintaining Air Nomad culture"],
  "fears": ["Aang losing his childhood", "separating from Aang"],
  "internalConflicts": ["his duty as a council elder vs. his love for Aang"],
  "emotionalWounds": ["death of his sister Yama"],
  "copingMechanisms": ["humor", "baking", "Pai Sho"],
  "worldview": "Believes that discipline and duty must be balanced with joy, freedom, and personal happiness."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Average",
  "notableFeatures": ["Air Nomad master tattoos", "shaved head", "long white mustache and eyebrows"],
  "outfitStyles": ["Air Nomad monk robes"],
  "signaturePossessions": ["Meditation beads", "Pai Sho tiles"],
  "ageProgression": true,
  "voiceActor": ["Sab Shimono", "Sean Marquette"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "We can't concern ourselves with what was. We must act on what is.",
    "Come closer. I have some wisdom for you.",
    "Sometimes, the best way to solve your own problems is to help someone else."
  ],
  "speakingStyle": "casual",
  "linguisticQuirks": ["Speaks with a gentle and playful wisdom", "often uses humor to teach"],
  "catchphrases": []
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Jester",
  "thematicKeywords": ["fatherhood", "mentorship", "wisdom", "humor", "joy", "balance", "grief", "friendship"],
  "tagCategories": {
    "narrativeTags": ["mentor", "father figure", "cool old guy", "posthumous character", "last stand"],
    "combatTags": ["airbender", "master airbender"],
    "relationshipTags": ["guardian of Aang", "friend of Roku", "friend of Pathik"],
    "emotionTags": ["kind", "wise", "humorous", "playful", "compassionate"],
    "politicalTags": ["council elder", "high monk"],
    "arcTags": ["killed in genocide", "trained the Avatar"],
    "worldTags": ["Air Nomads", "Southern Air Temple"],
    "triviaTags": ["greatest airbender", "reincarnation is Momo (scrapped idea)", "likes fruit pies", "cheats at Pai Sho"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["aang", "roku", "pathik", "momo"],
  "filterWeight": 70,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.98,
  "searchableKeywords": ["gyatso", "monk", "aang", "mentor", "guardian", "father", "air", "nomad", "south", "temple", "pie"],
  "fuzzySynonyms": ["aang's guardian", "the funny monk", "roku's friend"],
  "isSuggestedInXContext": []
}
```