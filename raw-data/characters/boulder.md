# 🧠 ULTIMATE CHARACTER METADATA SCHEMA (v3.0) - THE BOULDER

---

## 🖼️ UI - CARD VIEW

```md
- Name: The Boulder
- Nation: Earth Kingdom
- Short Description: A bombastic professional earthbending wrestler turned patriot, The Boulder is known for his third-person bravado, powerful earthbending, and surprising emotional depth beneath his stage persona.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

The Boulder, famed for his wrestling prowess and theatrical persona, was a star of the Earth Rumble tournaments in Gaoling. Though he projected arrogance and bravado, he was loyal to his friends and his nation, ultimately fighting for the Earth Kingdom in the war. His journey from entertainer to patriot, and his soft spot for his pet crococat The Pebble, reveal a more complex character than his stage act suggests.

### ✨ Narrative Highlights

- Starred in Earth Rumble VI, facing and losing to Toph, the Blind Bandit.
- Helped capture and later fought against Team Avatar, then joined the Earth Kingdom's cause.
- Fought in the Day of Black Sun invasion and was later imprisoned by the Fire Nation.
- Reunited with his beloved pet, The Pebble, and revealed his true self to the world.

### 🎭 Role in the Story

A comic relief and supporting fighter whose journey from showman to soldier highlights the diversity of Earth Kingdom heroes.

### 🤝 Relationships

- **The Pebble** – Beloved pet crococat, source of emotional vulnerability.
- **Toph Beifong** – Rival and later ally, defeated him in the ring.
- **Xin Fu** – Fellow Earth Rumble fighter and occasional ally.
- **Earth Kingdom Army** – Fought for his nation in the war.

### 🌟 Personality Traits

- Bombastic, loyal, determined, emotional, showy, surprisingly thoughtful.

### 💬 Notable Quotes

- "The Boulder and The Hippo no longer fight for others' entertainment. Now, we fight for our kingdom!"
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - THE BOULDER

---

## 🪪 Identity & Demographics

```json
{
  "id": "boulder",
  "fullName": "The Boulder",
  "titles": ["Professional Earthbending Fighter"],
  "aliases": ["The Pebble"],
  "species": "human",
  "gender": "male",
  "ageChronological": 35,
  "ageBiological": 35,
  "ageRange": "adult",
  "birthDate": null,
  "deathDate": null,
  "nationality": "Earth Kingdom",
  "ethnicity": "Earth Kingdom",
  "nativeLocation": "Gaoling, Earth Kingdom",
  "currentLocation": "Earth Kingdom",
  "socioeconomicStanding": "commoner",
  "languagesSpoken": ["Standard Language"]
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": true,
  "bendingElement": "earth",
  "bendingProficiency": "master",
  "advancedBending": [],
  "nonBendingSkills": ["wrestling", "showmanship", "pet care"],
  "uniqueTechniques": ["earth wave", "arena combat", "theatrical taunting"],
  "powerMetrics": {
    "rawPower": 7,
    "technicalSkill": 6,
    "strategicAptitude": 5
  },
  "combatStyle": "overwhelming",
  "vulnerabilities": ["thick-headed", "easily taunted", "emotional about pets"],
  "isLegendaryFighter": false,
  "notableFeats": [
    "Star of Earth Rumble VI",
    "Fought in the Day of Black Sun invasion",
    "Defeated by Toph in the ring",
    "Revealed his true self to the world"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Earth Kingdom", "Earth Rumble"],
  "pastAffiliations": ["Earth Kingdom Army"],
  "allegianceHistory": [
    { "affiliation": "Earth Rumble", "startDate": "?", "endDate": null, "reasonForLeaving": "Joined the war effort" },
    { "affiliation": "Earth Kingdom Army", "startDate": "?", "endDate": "?", "reasonForLeaving": "Became a professional fighter" }
  ],
  "isRoyalty": false,
  "politicalPower": "none",
  "politicalLeanings": ["patriot", "performer"],
  "moralAlignment": "chaotic good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "comic relief",
  "screenTimeLevel": "minor",
  "firstAppearance": "206-The Blind Bandit",
  "finalAppearance": "I Am Toph",
  "deathStatus": "alive",
  "causeOfDeath": null,
  "narrativeArcs": [
    { "arcType": "growth", "status": "completed", "summary": "The Boulder transitions from entertainer to patriot, embracing his true self." }
  ],
  "keyTropes": ["The Wrestler", "Comic Relief", "Hidden Depths", "Illeist"]
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
      "focus": "Earth Rumble tournaments, rivalry with Toph, and joining the war effort.",
      "keyEpisodes": ["The Blind Bandit"]
    },
    {
      "era": "Avatar: The Last Airbender - Book 3",
      "role": "supporting",
      "focus": "Fighting in the Day of Black Sun invasion, captured by Fire Nation, later freed.",
      "keyEpisodes": ["The Day of Black Sun, Part 1: The Invasion", "The Day of Black Sun, Part 2: The Eclipse", "Sozin's Comet, Part 4: Avatar Aang"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "toph", "relationshipType": "rival", "status": "resolved", "history": "Defeated by Toph in the ring, later allies." },
    { "characterId": "xin-fu", "relationshipType": "ally", "status": "positive", "history": "Fellow Earth Rumble fighter and occasional ally." },
    { "characterId": "the-pebble", "relationshipType": "pet", "status": "positive", "history": "Beloved crococat, source of emotional vulnerability." }
  ],
  "groupMemberships": [
    { "groupId": "earth-rumble", "roleInGroup": "star fighter" }
  ],
  "petCompanions": ["the-pebble", "the-pebblets"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["loyal", "determined", "emotional", "thoughtful", "patriotic"],
  "negativeTraits": ["bombastic", "thick-headed", "easily taunted", "overly concerned with image"],
  "motivations": ["entertainment", "patriotism", "friendship", "self-acceptance"],
  "fears": ["losing his pet", "public embarrassment", "letting down his fans"],
  "internalConflicts": ["stage persona vs. true self", "strength vs. vulnerability"],
  "emotionalWounds": ["defeats in the ring", "hiding his true self"],
  "copingMechanisms": ["showmanship", "third-person speech", "emotional outbursts"],
  "worldview": "Believes that strength comes from embracing both power and vulnerability."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Tall",
  "notableFeatures": ["Green eyes", "black hair", "tan skin", "muscular build", "badgermole tattoo"],
  "outfitStyles": ["wrestling attire", "Earth Kingdom armor"],
  "signaturePossessions": ["championship belt", "fan merchandise"],
  "ageProgression": false,
  "voiceActor": ["Mick Foley"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "The Boulder and The Hippo no longer fight for others' entertainment. Now, we fight for our kingdom!"
  ],
  "speakingStyle": "bombastic",
  "linguisticQuirks": ["refers to self in third person", "earth puns", "dramatic announcements"],
  "catchphrases": ["The Boulder is going to win this in a landslide!"]
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Wrestler",
  "thematicKeywords": ["strength", "performance", "patriotism", "vulnerability", "friendship", "self-acceptance", "entertainment"],
  "tagCategories": {
    "narrativeTags": ["wrestler", "comic relief", "supporting character"],
    "combatTags": ["earthbender", "arena fighter", "overwhelming"],
    "relationshipTags": ["rival of Toph", "pet owner", "ally of Xin Fu"],
    "emotionTags": ["bombastic", "emotional", "loyal", "vulnerable"],
    "politicalTags": ["Earth Kingdom", "performer"],
    "arcTags": ["from entertainer to patriot", "revealed true self"],
    "worldTags": ["Earth Rumble", "Gaoling", "Earth Kingdom"],
    "triviaTags": ["refers to self in third person", "badgermole tattoo", "pet crococat"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["toph", "xin-fu", "the-pebble"],
  "filterWeight": 22,
  "canonicalImportance": "secondary",
  "dataCompletenessScore": 0.92,
  "searchableKeywords": ["the boulder", "earthbender", "wrestler", "earth kingdom", "arena", "comic relief"],
  "fuzzySynonyms": ["earth rumble star", "wrestling bender", "the pebble's owner"],
  "isSuggestedInXContext": []
}
```
