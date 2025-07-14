```markdown
---
type: character
---

## 🖼️ UI - CARD VIEW

```md
- Name: Aang
- Nation: Air Nomads
- Short Description: A fun-loving, 12-year-old boy and the last Airbender, Aang is the current incarnation of the Avatar, a master of all four elements destined to bring balance to a world ravaged by a hundred-year war.
```

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Discovered frozen in an iceberg after a hundred years, Aang awakens to a world where his people have been annihilated and the Fire Nation is on the brink of total victory. Burdened with the immense responsibility of being the Avatar, Aang must master the four elements and defeat the tyrannical Fire Lord Ozai. His journey is one of maturation, as he struggles to reconcile his pacifist nature with the grim duties of his role, ultimately finding a new way to restore balance without sacrificing his principles.

### ✨ Narrative Highlights

- Mastered all four elements in under a year.
- Learned the rare art of Energybending from a Lion Turtle.
- Defeated Fire Lord Ozai by taking away his bending, ending the Hundred Year War.
- Co-founded the United Republic of Nations and its capital, Republic City.
- Restored the Air Nomad culture by training the Air Acolytes.

### 🎭 Role in the Story

The protagonist of the series. His journey from a reluctant, playful child to a fully realized Avatar is the central arc of the narrative, driving the entire plot forward as he gathers allies and confronts the Fire Nation.

### 🤝 Relationships

- **Katara** – His closest friend, teacher, and eventual life partner.
- **Sokka** – His first human friend after the iceberg; a loyal, strategic, and brotherly figure.
- **Zuko** – Began as a relentless hunter, became his firebending master and a crucial ally.
- **Appa & Momo** – His loyal animal companions, representing his last living ties to his past.
- **Monk Gyatso** – His mentor and father figure from the Southern Air Temple.
- **Toph Beifong** – His earthbending master and a steadfast, tough-as-nails friend.

### 🌟 Notable Traits

- Pacifist and deeply spiritual.
- Naturally playful, optimistic, and sometimes goofy.
- Immensely powerful, especially in the Avatar State.
- Carries the heavy emotional weight of being the last of his kind.
- Creative and an expert glider.

### 💬 Notable Quotes

- "When we hit our lowest point, we are open to the greatest change."
- "Yip yip!"
- "The monks taught me that all life is sacred. Even the life of a tyrant."
```

---
---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - AANG

---

## 🪪 Identity & Demographics

```json
{
  "id": "aang",
  "slug": "aang",
  "fullName": "Aang",
  "titles": ["Avatar"],
  "aliases": ["The Avatar", "Twinkle Toes (by Toph)"],
  "species": "human",
  "gender": "male",
  "ageChronological": 112,
  "ageBiological": 12,
  "ageRange": "child",
  "birthDate": "12 BG",
  "deathDate": "153 AG",
  "nationality": "Air Nomads",
  "ethnicity": "Air Nomad",
  "nativeLocation": "Southern Air Temple",
  "socioeconomicStanding": "monastic",
  "languagesSpoken": ["Standard Language"]
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": true,
  "bendingElement": "all",
  "bendingProficiency": "master",
  "advancedBending": ["Avatar State", "Energybending", "Seismic Sense (via shoes)"],
  "nonBendingSkills": ["gliding", "animal empathy", "spiritual projection", "mediation"],
  "uniqueTechniques": ["The Air Scooter"],
  "powerMetrics": {
    "rawPower": 9,
    "technicalSkill": 9,
    "strategicAptitude": 7
  },
  "combatStyle": "evasive",
  "vulnerabilities": ["emotional distress (triggers Avatar State)", "pacifism (reluctance to kill)", "inexperience with worldly matters"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "Ended the Hundred Year War",
    "Defeated Fire Lord Ozai",
    "Learned Energybending",
    "Created Republic City with Zuko",
    "First Avatar in generations to learn lightning redirection"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["Team Avatar", "Air Acolytes (as leader)"],
  "pastAffiliations": ["Air Nomads", "Southern Air Temple"],
  "allegianceHistory": [],
  "isRoyalty": false,
  "politicalPower": "supranational",
  "politicalLeanings": ["pacifist", "egalitarian", "traditionalist (Air Nomad culture)"],
  "moralAlignment": "neutral good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "protagonist",
  "screenTimeLevel": "protagonist",
  "firstAppearance": "101-The-Boy-in-the-Iceberg",
  "finalAppearance": "The Legend of Korra (in flashbacks)",
  "deathStatus": "deceased",
  "causeOfDeath": "Natural causes (due to decades spent in the iceberg)",
  "narrativeArcs": [
    { "arcType": "coming of age", "status": "completed", "summary": "From a fun-loving kid to a responsible, fully realized Avatar." },
    { "arcType": "mastery", "status": "completed", "summary": "His accelerated journey to master all four elements to save the world." }
  ],
  "keyTropes": ["The Chosen One", "Reluctant Hero", "Last of His Kind", "Fish out of Water", "All-Loving Hero", "Martial Pacifist"]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "katara", "relationshipType": "romantic", "status": "positive", "history": "His first friend, a constant source of support, and eventual wife." },
    { "characterId": "sokka", "relationshipType": "friendship", "status": "positive", "history": "His brother-in-arms and best friend, providing strategic and comic relief." },
    { "characterId": "zuko", "relationshipType": "rivalry-alliance", "status": "positive", "history": "A relentless pursuer who became his firebending master and partner in building a new world." },
    { "characterId": "toph-beifong", "relationshipType": "friendship-mentorship", "status": "positive", "history": "His tough, uncompromising earthbending teacher and loyal friend." },
    { "characterId": "ozai", "relationshipType": "enemy", "status": "negative", "history": "The primary antagonist whom Aang had to defeat to fulfill his destiny." }
  ],
  "groupMemberships": [
    { "groupId": "team-avatar", "roleInGroup": "leader" }
  ],
  "petCompanions": ["appa", "momo"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["compassionate", "optimistic", "peaceful", "adaptable", "courageous"],
  "negativeTraits": ["avoidant (initially)", "naive", "prone to emotional outbursts (Avatar State)"],
  "motivations": ["restoring balance", "protecting his friends", "preserving life", "rebuilding his culture"],
  "fears": ["failing the world", "losing his loved ones", "having to kill"],
  "internalConflicts": ["duty vs. desire", "pacifism vs. the need for violence", "grief for his people vs. hope for the future"],
  "emotionalWounds": ["the genocide of the Air Nomads"],
  "copingMechanisms": ["humor", "playfulness", "relying on his friends", "meditation"],
  "worldview": "Believes that all life is sacred and that balance, harmony, and understanding are the keys to a better world."
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "Short",
  "notableFeatures": ["Blue arrow tattoos", "grey eyes"],
  "outfitStyles": ["Air Nomad monk robes", "Fire Nation school uniform (disguise)"],
  "signaturePossessions": ["Glider staff"],
  "ageProgression": true,
  "voiceActor": ["Zach Tyler Eisen"]
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "The Hero",
  "thematicKeywords": ["balance", "destiny", "pacifism", "responsibility", "hope", "friendship", "spirituality", "war", "genocide"],
  "tagCategories": {
    "narrativeTags": ["protagonist", "the avatar", "chosen one", "last of his kind", "reluctant hero", "coming of age"],
    "combatTags": ["airbender", "waterbender", "earthbender", "firebender", "energybending", "master bender", "avatar state"],
    "relationshipTags": ["friend of Sokka", "partner of Katara", "student of Toph", "ally of Zuko", "master of Appa"],
    "emotionTags": ["optimistic", "compassionate", "playful", "conflicted", "grieving"],
    "politicalTags": ["leader of Team Avatar", "co-founder of Republic City", "bridge to Spirit World"],
    "arcTags": ["the boy in the iceberg", "mastering the elements", "defeat of Ozai", "energybending", "the promise"],
    "worldTags": ["Air Nomads", "Southern Air Temple", "Team Avatar", "Republic City"],
    "triviaTags": ["112 years old", "yip yip", "twinkle toes", "marble trick", "vegetarian"]
  }
}
```