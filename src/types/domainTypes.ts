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
  shortDescription?: string;
  description: string;
  slug: string;
  synonyms?: string[];
  tags?: string[];
  relations?: string[];
  nation?: string;
  bending?: string;
  expansion?: {
    fullBio?: string;
    notableEpisodes?: string[];
    quotes?: string[];
    [key: string]: unknown;
  };
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