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
  __type: 'character';
  id: string;
  name: string;
  description: string;
  slug: string;
  nation?: string;
  role?: string;
  overview?: string;
  highlights?: string[];
  traits?: string[];
  quotes?: string[];
  relationships?: string;
  image?: string | null;
  tags?: string[];
  synonyms?: string[];
  sources?: string[];
  
  // Corrected v3.0 Fields
  fullName?: string;
  bendingElement?: string;
  narrativeFunction?: string;
  ageRange?: string;
  gender?: string;
  currentAffiliations?: string[];
  archetype?: string;
  moralAlignment?: string;
  isLegendaryFighter?: boolean;
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

export type EnrichedRecord =
  | EnrichedBending
  | EnrichedCharacter
  | EnrichedFauna
  | EnrichedFood
  | EnrichedLocation
  | EnrichedSpiritWorld;
