# Type Definitions

## Core Types

### Collection
```typescript
interface Collection {
  id: string;          // Unique identifier (format: cTIMESTAMP)
  name: string;        // User-provided collection name
  description?: string; // Optional collection description
  createdAt: string;   // ISO 8601 timestamp
  cardIds: string[];   // Array of entity IDs in collection
}
```

### UseCollectionsReturn
```typescript
interface UseCollectionsReturn {
  collections: Collection[];
  getCollectionsForCard: (cardId: string) => Collection[];
  isCardInAnyCollection: (cardId: string) => boolean;
  createCollection: (name: string, initialCardId?: string) => void;
  addCardToCollection: (collectionId: string, cardId: string) => void;
  removeCardFromCollection: (collectionId: string, cardId: string) => void;
}
```

## Component Props

### CollectionCardButton
```typescript
interface Props {
  isInCollection: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
```

### AddToCollectionPopover
```typescript
interface Props {
  collections: Collection[];
  cardId: string;
  addCard: (collectionId: string, cardId: string) => void;
  removeCard: (collectionId: string, cardId: string) => void;
  onCreateNew: () => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
}
```

### CollectionsSidebar
```typescript
interface Props {
  collections: Collection[];
  activeId: string | null;
  onActivate: (id: string | null) => void;
  createCollection: (name: string) => void;
}
``` 