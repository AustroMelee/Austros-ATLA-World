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
  collectionsApi: import('../../hooks/useCollections').UseCollectionsReturn;
}

function ItemCardComponent({ item, expanded, onExpand, matchedFields, collectionsApi }: ItemCardProps) {
  return expanded ? (
    <ItemCardModal item={item} onClose={onExpand} />
  ) : (
    <ItemCardCollapsed item={item} matchedFields={matchedFields} onExpand={onExpand} collectionsApi={collectionsApi} />
  );
}

const ItemCard = React.memo(ItemCardComponent);

export default ItemCard;
