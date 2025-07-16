import React from 'react';
import type { EnrichedEntity } from '../../search/types';
import ItemCardCollapsed from './ItemCardCollapsed';
import ItemCardModal from './ItemCardModal';

interface MatchedField {
  field: string;
  token: string;
}

interface ItemCardProps {
  item: EnrichedEntity;
  expanded: boolean;
  onExpand: () => void;
  matchedFields?: MatchedField[];
}

export default function ItemCard({ item, expanded, onExpand, matchedFields }: ItemCardProps) {
  return expanded ? (
    <ItemCardModal item={item} onClose={onExpand} />
  ) : (
    <ItemCardCollapsed item={item} matchedFields={matchedFields} onExpand={onExpand} />
  );
}
