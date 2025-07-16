export interface GridItem {
  record: import('../search/types').EnrichedEntity;
  matchedFields: import('../search/types').MatchResult['matchedFields'];
}
