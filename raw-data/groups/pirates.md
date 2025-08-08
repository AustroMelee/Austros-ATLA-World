---
type: group
---

# 🏰 ULTIMATE GROUP METADATA SCHEMA (v1.0)

*Standardized for Avatar Encyclopedia, Maxi-Minimalist UX Engine*

**PHILOSOPHY:** Factions and organizations drive the world's conflicts and alliances. Their metadata must capture hierarchy, ideology, and historical impact.

---

## 🖼️ UI - CARD VIEW

*(Presentation Layer 1 - Unchanged)*

```md
- Name: Pirates
- Affiliation: Independent (Various Nations)
- Group Type: criminal_organization
- Short Description: Maritime, river, and air piracy groups operating across the world, ranging from small criminal crews to massive organizations like the Fifth Nation and Crimson Sails Armada.
```

---

## 📖 UI - EXPANDED VIEW

*(Presentation Layer 2 - Unchanged)*

```md
### 📖 Overview

Piracy in the World of Avatar encompasses various forms of criminal violence and robbery using ships, boats, and aerial means of transport. Historically common across many parts of the world, with regions like the Eastern Sea being notorious for high levels of naval crime. Most piracy aims at wealth acquisition through illegal means, though some groups operate as politically and socially motivated rebels.

### 🏴‍☠️ Notable Pirate Groups

**Fifth Nation:**
- Grew during the eras of Yangchen and Kuruk
- Became more like a maritime people than a crime group
- Controlled the Eastern Sea and South Sea
- Shattered by Avatar Kyoshi in 296 BG
- Remnant groups continued to persist

**Crimson Sails Armada:**
- Founded by disgraced Fire Navy officers
- Active during and after the Hundred Year War
- Made secret deal with Fire Lord Ozai in 95 AG
- Settled on island between Fire Islands and Earth Kingdom
- Launched large-scale raiding campaign under Head Captain Ningka
- Included factions: Pyre Howler, Burning Wave, Renegade Phoenix, Dancing Nobleman Fleet

**Other Notable Groups:**
- Black Koi Pirates
- Boru's pirates
- Fade-Red Devils
- Gayu's pirates
- Jiang's pirates
- Kiwaq's pirates
- Oh's crew
- Zheng's pirates

### 🌊 Practices & Operations

**Cooperation Networks:**
- Work with land-based crime groups (smugglers, urban gangs)
- Turn ill-gotten gains into money through criminal networks
- Some operate mobile black markets on their vessels

**Specialized Activities:**
- Slavery and kidnapping (Fifth Nation)
- Exotic goods and animal trafficking
- Family business operations across generations
- Status symbols including iguana parrots

**Base Operations:**
- Island fortresses and coastal caves
- Harbor sections in major cities
- Seedy merchant piers and unregulated areas
- Growing into major agglomerations

### 🏛️ Historical Context

**Early History:**
- Eastern Sea harbored many infighting pirate groups
- Fire Islands relatively free due to powerful Fire Navy
- 4th and 3rd centuries BG: High pirate activity
- Fifth Nation became dominant maritime power

**Hundred Year War Era:**
- Surge of piracy around Earth Kingdom waters
- River piracy in Earth Kingdom
- Corsairs around South Pole
- Some groups became anti-Fire Nation rebels
- Crimson Sails Armada threatened Fire Islands

**Post-War Period:**
- Crimson Sails Armada launched raiding campaigns
- United Forces clashed with pirates
- Republic City harbor criminal activity
- Air piracy with biplanes by 170s AG

### 🎭 Cultural Significance

**Social Dynamics:**
- Cultural melting pots uniting diverse backgrounds
- Family dynasties spanning generations
- Respected criminal circles based on heritage
- Some communities welcome pirates for economic benefits

**Political Impact:**
- Sometimes tolerated or enlisted by governments
- Operated as politically motivated rebels
- Threatened international peace and trade
- Influenced regional power dynamics

### 🗺️ Geographic Distribution

**Primary Operating Areas:**
- Eastern Sea (historically most active)
- Waters around Earth Kingdom
- South Pole regions
- Fire Nation waters (less common)
- Republic City harbors
- Various island bases and coastal locations

**Notable Locations:**
- Crimson Sails island
- Ketu Harbor
- Seedy merchant piers
- Coastal caves and fortresses
- Unregulated harbor sections
```

---

## ⚙️ BACKEND METADATA (v1.0 EXPANSION)

## 🏗️ Organizational Identity & Classification

```json
{
  "id": "pirates",
  "name": "Pirates",
  "slug": "pirates",
  "type": "group",
  "nation": "Independent",
  "description": "Maritime, river, and air piracy groups operating across the world, ranging from small criminal crews to massive organizations.",
  "affiliation": "independent",
  "groupType": "criminal_organization",
  "aliases": [
    "Corsairs",
    "Pirate Crews",
    "Maritime Raiders"
  ],
  "sources": [
    "Avatar: The Last Airbender",
    "The Kyoshi Novels",
    "Adventure Booklet: The Pirates of Crimson Sails"
  ],
  "tags": [
    "criminal_organization",
    "maritime_raiders",
    "independent_faction",
    "cross_national",
    "historical_significance"
  ],
  "searchAliases": [
    "piracy",
    "corsairs",
    "maritime crime",
    "pirate crews",
    "naval raiders"
  ],
  "expandedView": "Detailed markdown content for expanded view",
  "category": "criminal_organization",
  "categories": [
    "criminal_organization"
  ]
}
```

## 🏛️ Cultural & Historical Context

```json
{
  "culturalSignificance": "Pirates represent the darker side of maritime culture, operating as both criminals and sometimes political rebels. They demonstrate the complex relationship between lawlessness and social change.",
  "originStory": "Piracy emerged as a response to maritime trade and military conflicts, with some groups like the Fifth Nation growing into major powers before being defeated by Avatar Kyoshi.",
  "traditionalOccasions": [
    "maritime raids",
    "smuggling operations",
    "political rebellion",
    "criminal networking"
  ],
  "ceremonialUses": [],
  "historicalPeriod": "Ancient to modern (4th century BG to 170s AG)",
  "culturalEvolution": "From simple criminal groups to complex organizations with political agendas, some becoming maritime powers in their own right",
  "regionalVariations": [
    "Eastern Sea pirates",
    "Fire Nation corsairs",
    "Earth Kingdom river pirates",
    "South Pole raiders"
  ],
  "socialSignificance": "Pirates represent the intersection of crime, politics, and social change, sometimes operating as rebels against established powers"
}
```

## 🗺️ Geographic & Regional Data

```json
{
  "primaryRegion": "Eastern Sea",
  "secondaryRegions": [
    "Fire Nation waters",
    "Earth Kingdom rivers",
    "South Pole",
    "Republic City harbors"
  ],
  "availabilityByNation": {
    "Fire Nation": "limited due to strong navy",
    "Earth Kingdom": "common in waters and rivers",
    "Water Tribes": "some activity around South Pole",
    "Air Nomads": "minimal",
    "Republic City": "harbor criminal activity"
  },
  "localVariations": [
    "Eastern Sea dominance",
    "Fire Nation suppression",
    "Earth Kingdom river piracy",
    "Republic City harbor crime"
  ],
  "importExportStatus": "illegal trade networks"
}
```

## 🎭 Narrative & Thematic Significance

```json
{
  "narrativeAppearances": [
    "Fifth Nation conflict with Avatar Kyoshi",
    "Crimson Sails Armada during Hundred Year War",
    "Various pirate encounters with Team Avatar",
    "Post-war piracy resurgence"
  ],
  "characterAssociations": [
    "Avatar Kyoshi",
    "Avatar Yangchen",
    "Avatar Kuruk",
    "Fire Lord Ozai",
    "Fire Lord Zuko",
    "Team Avatar"
  ],
  "thematicKeywords": [
    "lawlessness",
    "rebellion",
    "maritime power",
    "criminal networks",
    "political resistance",
    "social change"
  ],
  "symbolicMeanings": [
    "Freedom from authority",
    "Economic desperation",
    "Political resistance",
    "Maritime independence"
  ],
  "emotionalConnections": [
    "Fear and intimidation",
    "Romanticized freedom",
    "Economic desperation",
    "Political resistance"
  ],
  "storytellingRole": "Antagonists, political forces, and catalysts for conflict and change"
}
```

## 🧱 Semantic & Thematic Index

```json
{
  "thematicKeywords": [
    "maritime crime",
    "political rebellion",
    "criminal networks",
    "maritime power",
    "social banditry"
  ],
  "notableUses": [
    "Maritime raids and piracy",
    "Smuggling operations",
    "Political resistance",
    "Criminal networking",
    "Economic disruption"
  ],
  "servingOccasions": [
    "Maritime conflict",
    "Political upheaval",
    "Economic desperation",
    "Social change"
  ],
  "seasonalAvailability": [
    "year_round"
  ],
  "dietaryRestrictions": [],
  "tagCategories": {
    "organizationalTags": [
      "criminal_organization",
      "maritime_raiders",
      "independent_faction"
    ],
    "culturalTags": [
      "cross_national",
      "maritime_culture",
      "criminal_networks"
    ],
    "regionalTags": [
      "eastern_sea",
      "fire_nation_waters",
      "earth_kingdom_rivers"
    ],
    "narrativeTags": [
      "antagonists",
      "political_forces",
      "conflict_catalysts"
    ],
    "thematicTags": [
      "lawlessness",
      "rebellion",
      "maritime_power",
      "social_change"
    ],
    "historicalTags": [
      "ancient_piracy",
      "hundred_year_war",
      "post_war_activity"
    ],
    "occasionTags": [
      "maritime_conflict",
      "political_upheaval",
      "economic_disruption"
    ],
    "triviaTags": [
      "fifth_nation",
      "crimson_sails_armada",
      "avatar_kyoshi_conflict"
    ]
  }
}
```

## 🔮 AI/Filtering & System Flags

```json
{
  "relatedCards": [
    "crimson-sails-armada",
    "fifth-nation",
    "avatar-kyoshi",
    "fire-nation-navy"
  ],
  "filterWeight": 75,
  "canonicalImportance": "major",
  "dataCompletenessScore": 0.8,
  "searchableKeywords": [
    "pirates",
    "corsairs",
    "maritime crime",
    "fifth nation",
    "crimson sails armada",
    "piracy",
    "maritime raiders"
  ],
  "fuzzySynonyms": [
    "corsairs",
    "maritime raiders",
    "naval criminals",
    "sea bandits"
  ],
  "searchAliases": [
    "piracy",
    "corsairs",
    "maritime crime",
    "pirate crews",
    "naval raiders"
  ],
  "isSuggestedInXContext": [
    "maritime conflict",
    "criminal organizations",
    "political resistance",
    "historical factions"
  ]
}
```
