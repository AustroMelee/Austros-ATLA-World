// src/types/domainTypes.ts

export type EnrichedBending = {
  __type: 'bending';
  id: string;
  name: string;
  description: string;
  slug: string;
  synonyms?: string[];
  tags?: string[];
  relations?: string[];
};

export type EnrichedCharacter = {
  /** Character type marker */
  __type: 'character';
  /** Unique character ID */
  id: string;
  /** Display name */
  name: string;
  /** Short description or summary */
  description: string;
  /** Slug for routing/lookup */
  slug: string;
  /** Nation or origin (e.g., Fire Nation) */
  nation?: string | null;
  /** Character's main role/title */
  role?: string | null;
  /** Short overview/biography */
  overview?: string | null;
  /** List of highlights/major moments */
  highlights?: string[];
  /** List of general traits (legacy) */
  traits?: string[];
  /** List of notable quotes */
  quotes?: string[];
  /** List of relationships */
  relationships?: Array<{
    characterId: string;
    relationshipType: string;
    status: string;
    history: string;
  }>;
  /** Path to image asset or null */
  image?: string | null;
  /** List of tags */
  tags?: string[];
  /** List of synonyms */
  synonyms?: string[];
  /** List of sources */
  sources?: string[];
  /** Full name (if different from name) */
  fullName?: string | null;
  /** Bending element (e.g., Fire, Water) */
  bendingElement?: string | null;
  /** Narrative function (e.g., Protagonist) */
  narrativeFunction?: string | null;
  /** Age or age range */
  age?: string | number | null;
  ageRange?: string | null;
  /** Gender */
  gender?: string | null;
  /** Affiliations/groups */
  currentAffiliations?: string[];
  /** Archetype (e.g., Hero, Mentor) */
  archetype?: string | null;
  /** Moral alignment (e.g., Lawful Good) */
  moralAlignment?: string | null;
  /** Legendary fighter status */
  isLegendaryFighter?: boolean;
  /** Notable feats/accomplishments */
  notableFeats?: string[];
  /** Narrative arcs */
  narrativeArcs?: Array<{
    arcType: string;
    status: string;
    summary: string;
  }>;
  /** Positive traits */
  positiveTraits?: string[];
  /** Negative traits */
  negativeTraits?: string[];
  /** Motivations */
  motivations?: string[];
  /** Fears */
  fears?: string[];
  /** Internal conflicts */
  internalConflicts?: string[];
  /** Expanded view (markdown/html) */
  expandedView?: string;
  /** WIP: Avatar icon filename (if available) */
  avatarIcon?: string | null;
  /** Key-value pairs of thematic tags */
  tagCategories?: {
    narrativeTags?: string[];
    combatTags?: string[];
    relationshipTags?: string[];
    emotionTags?: string[];
    politicalTags?: string[];
    arcTags?: string[];
    worldTags?: string[];
    triviaTags?: string[];
    [key: string]: string[] | undefined;
  };
  /** Bending status (true if bender, false if non-bender) */
  isBender?: boolean;
};

export type EnrichedFauna = {
  __type: 'fauna';
  id: string;
  name: string;
  description: string;
  slug: string;
  synonyms?: string[];
  tags?: string[];
  relations?: string[];
};

export type EnrichedFood = {
  __type: 'food';
  id: string;
  name: string;
  description: string;
  slug: string;
  synonyms?: string[];
  tags?: string[];
  relations?: string[];
};

export type EnrichedLocation = {
  __type: 'location';
  id: string;
  name: string;
  description: string;
  slug: string;
  synonyms?: string[];
  tags?: string[];
  relations?: string[];
};

export type EnrichedSpiritWorld = {
  __type: 'spirit-world';
  id: string;
  name: string;
  description: string;
  slug: string;
  synonyms?: string[];
  tags?: string[];
  relations?: string[];
};

export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon?: string; // Matrix-theme compatible icon/emoji
  createdAt: string; // ISO 8601 string
  cardIds: string[];
}

export type EnrichedRecord =
  | EnrichedBending
  | EnrichedCharacter
  | EnrichedFauna
  | EnrichedFood
  | EnrichedLocation
  | EnrichedSpiritWorld;
