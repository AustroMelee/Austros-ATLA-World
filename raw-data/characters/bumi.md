---
type: character
---

## 🖼️ UI - CARD VIEW

```md
- Name: King Bumi
- Nation: Earth Kingdom
- Role: King of Omashu
- Short Description: The eccentric, wildly powerful King of Omashu. Aang's only surviving childhood friend, Bumi is a "mad genius" earthbending master and brilliant tactician.
```

---

## 📖 UI - EXPANDED VIEW

```md
### 📖 Overview

Bumi was the wild-eyed, eccentric, elderly King of Omashu. Prior to the Hundred Year War, he was a close friend of Avatar Aang and remained the only known friend from Aang's childhood still alive by 100 AG. Despite his apparent frailty, Bumi was an earthbending master, claiming to be "the most powerful earthbender you'll ever see." His eccentricity arose from always keeping his mind "open to the possibilities," earning him the nickname "mad genius." Bumi was a brilliant and patient tactician, willing to wait for the opportune moment to strike.

### ✨ Narrative Highlights

- Childhood friend of Aang; known for his "mad genius" and open-mindedness.
- Became King of Omashu and led the city through the Hundred Year War.
- Single-handedly liberated Omashu from Fire Nation control during the Day of Black Sun.
- Member of the Order of the White Lotus; helped liberate Ba Sing Se.
- Advised Aang to seek an earthbending teacher who waits and listens (Toph).

### 🎭 Role in the Story

A legendary earthbending master, comic relief, and wise mentor whose eccentricity hides deep wisdom and tactical brilliance.

### 🤝 Relationships

- **Aang** – Childhood friend, mentee.
- **Flopsie** – Loyal pet.
- **Order of the White Lotus** – Fellow grandmasters and allies.
- **Team Avatar** – Allies.
- **Ozai, Azula, Ukano** – Enemies.

### 🌟 Notable Traits

- Eccentric and unpredictable
- Brilliant strategist and tactician
- Loyal and caring
- Physically powerful despite age

### 💬 Notable Quotes

- "I hope you will think like a mad genius!"
- "You will always remember what you never expected."
- "Neutral jing is the key. It's the art of waiting and listening."
```

---

## ⚙️ BACKEND METADATA (v3.0 EXPANSION) - KING BUMI

---

## 🪪 Identity & Demographics

```json
{
  "id": "king-bumi",
  "fullName": "Bumi",
  "role": "King of Omashu",
  "titles": ["King", "Earthbending Master"],
  "aliases": [],
  "species": "human",
  "gender": "male",
  "ageChronological": 112,
  "ageBiological": 112,
  "ageRange": "elder",
  "birthDate": "12_BG",
  "deathDate": "Between_102_and_124_AG",
  "nationality": "earth_kingdom",
  "ethnicity": "earth_kingdom",
  "nativeLocation": "omashu",
  "currentLocation": "omashu",
  "socioeconomicStanding": "royalty",
  "languagesSpoken": ["standard_language"]
}
```

---

## 🔥 Abilities, Skills & Combat Profile

```json
{
  "isBender": true,
  "bendingElement": "earth",
  "bendingProficiency": "legendary",
  "advancedBending": [],
  "nonBendingSkills": ["strategy", "tactics", "leadership"],
  "uniqueTechniques": ["earthbending_with_face", "massive_earth_manipulation", "bending_jennamite"],
  "powerMetrics": {
    "rawPower": 9,
    "technicalSkill": 10,
    "strategicAptitude": 10
  },
  "combatStyle": "unpredictable",
  "vulnerabilities": ["eccentricity", "underestimation_by_others"],
  "isLegendaryFighter": true,
  "notableFeats": [
    "single_handedly_liberated_omashu",
    "fought_on_front_lines_liberation_ba_sing_se",
    "earthbent_while_encased_in_metal",
    "mentored_aang_in_creative_thinking"
  ]
}
```

---

## 🧭 Affiliations, Politics & Alignment

```json
{
  "currentAffiliations": ["earth_kingdom", "order_of_the_white_lotus"],
  "pastAffiliations": [],
  "allegianceHistory": [
    { "affiliation": "earth_kingdom", "startDate": "12_BG", "endDate": null, "reasonForLeaving": null }
  ],
  "isRoyalty": true,
  "politicalPower": "ruling",
  "politicalLeanings": ["defensive", "resistant", "open_minded"],
  "moralAlignment": "chaotic_good",
  "moralCompassDrift": false
}
```

---

## 🎭 Narrative Metrics

```json
{
  "narrativeFunction": "mentor",
  "screenTimeLevel": "supporting",
  "firstAppearance": "105_the_king_of_omashu",
  "finalAppearance": "avatar_the_last_airbender_quest_for_balance",
  "deathStatus": "deceased",
  "causeOfDeath": "old_age",
  "narrativeArcs": [
    { "arcType": "wisdom", "status": "completed", "summary": "Guided Aang and Team Avatar with unconventional wisdom and earthbending mastery." }
  ],
  "keyTropes": ["mad_genius", "eccentric_mentor", "old_master", "comic_relief"]
}
```

---

## 📚 Role By Era/Season

```json
{
  "eraAppearances": [
    {
      "era": "avatar_the_last_airbender_book_1_3",
      "role": "mentor",
      "focus": "ruling_omashu_aiding_team_avatar_fighting_white_lotus",
      "keyEpisodes": ["105", "203", "319", "320", "321"]
    }
  ]
}
```

---

## 🤝 Relational Matrix

```json
{
  "relationships": [
    { "characterId": "aang", "relationshipType": "friend", "status": "positive", "history": "childhood_friend_and_mentor" },
    { "characterId": "flopsie", "relationshipType": "pet", "status": "positive", "history": "loyal_animal_companion" },
    { "characterId": "order_of_the_white_lotus", "relationshipType": "ally", "status": "positive", "history": "fellow_grandmasters_and_allies" },
    { "characterId": "ozai", "relationshipType": "enemy", "status": "negative", "history": "opposed_fire_lord_ozai" },
    { "characterId": "azula", "relationshipType": "enemy", "status": "negative", "history": "enemy_during_occupation_of_omashu" }
  ],
  "groupMemberships": [
    { "groupId": "order_of_the_white_lotus", "roleInGroup": "grandmaster" }
  ],
  "petCompanions": ["flopsie"]
}
```

---

## 🧠 Psycho-Emotional Profile

```json
{
  "positiveTraits": ["open_minded", "brilliant", "loyal", "caring", "patient"],
  "negativeTraits": ["eccentric", "unpredictable", "cryptic"],
  "motivations": ["wisdom", "defense_of_omashu", "helping_friends", "freedom"],
  "fears": ["loss_of_omashu", "failure_to_protect_friends"],
  "internalConflicts": ["eccentricity_vs_responsibility"],
  "emotionalWounds": ["survived_hundred_year_war", "outlived_most_friends"],
  "copingMechanisms": ["humor", "eccentric_behavior", "strategic_patience"],
  "worldview": "keep_your_mind_open_to_the_possibilities"
}
```

---

## 📦 Physicality & Presentation

```json
{
  "heightEstimate": "tall",
  "notableFeatures": ["wild_eyes", "muscular_physique", "long_white_hair"],
  "outfitStyles": ["earth_kingdom_royal_robes", "battle_attire"],
  "signaturePossessions": ["omashu_crown", "flopsie"],
  "ageProgression": true,
  "voiceActor": ["andre_sogliuzzo", "kevin_ng", "sunil_malhotra"]
}
```

---

## 💬 Dialogue & Communication

```json
{
  "iconicQuotes": [
    "i_hope_you_will_think_like_a_mad_genius",
    "you_will_always_remember_what_you_never_expected",
    "neutral_jing_is_the_key"
  ],
  "speakingStyle": "eccentric",
  "linguisticQuirks": ["cackling_laughter", "cryptic_advice", "unexpected_wisdom"],
  "catchphrases": ["mad_genius"]
}
```

---

## 🧱 Semantic & Thematic Index

```json
{
  "archetype": "mad_genius",
  "thematicKeywords": ["wisdom", "eccentricity", "earthbending", "strategy", "friendship", "freedom", "resistance", "open_mindedness"],
  "tagCategories": {
    "narrativeTags": ["mentor", "comic_relief", "old_master", "mad_genius"],
    "combatTags": ["earthbender", "master_earthbender", "face_bending", "jennamite"],
    "relationshipTags": ["friend_of_aang", "member_of_white_lotus", "king_of_omashu"],
    "emotionTags": ["eccentric", "brilliant", "loyal", "caring"],
    "politicalTags": ["king", "royalty", "white_lotus"],
    "arcTags": ["liberated_omashu", "liberated_ba_sing_se", "mentor_to_aang"],
    "worldTags": ["earth_kingdom", "omashu", "order_of_the_white_lotus"],
    "triviaTags": ["earthbending_with_face", "mad_genius", "oldest_earthbender"]
  }
}
```

---

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": ["aang", "toph", "order_of_the_white_lotus", "flopsie", "ozai", "azula"],
  "filterWeight": 90,
  "canonicalImportance": "primary",
  "dataCompletenessScore": 1.0,
  "searchableKeywords": ["bumi", "king", "omashu", "earthbender", "mad_genius", "white_lotus", "aang", "flopsie"],
  "fuzzySynonyms": ["mad_genius", "king_of_omashu", "earth_kingdom_king", "aangs_friend"],
  "isSuggestedInXContext": []
}
```
