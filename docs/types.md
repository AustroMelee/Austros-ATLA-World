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

## Filtering System Types

### FilterBar
```typescript
interface FilterBarProps {
  activeNations: Set<string>;
  onToggleNation: (nation: string) => void;
  activeCoreFilter: string | null;
  onSetCoreFilter: (filter: string | null) => void;
  activeSubFilters: Set<string>;
  onToggleSubFilter: (subFilter: string) => void;
  subFilterOptions: string[];
}
```

### Home Props (Updated)
```typescript
interface HomeProps {
  searchResults: Array<{ entity: EnrichedEntity; matchedFields: MatchResult['matchedFields'] }>;
  loading: boolean;
  query: string;
  handleSearchChange: (query: string) => void;
  expandedCardId: string | null;
  onCardExpand: (cardId: string) => void;
  collectionsApi: UseCollectionsReturn;
  activeCollectionId: string | null;
  setActiveCollectionId: (id: string | null) => void;
  // New filtering props
  activeNations: Set<string>;
  onToggleNation: (nation: string) => void;
  activeCoreFilter: string | null;
  onSetCoreFilter: (filter: string | null) => void;
  activeSubFilters: Set<string>;
  onToggleSubFilter: (subFilter: string) => void;
}
``` 

## MatrixRain Component Types

### MatrixRainProps
```typescript
interface MatrixRainProps {
  modalOpen?: boolean; // Controls animation intensity when modal is open
}
```

### MatrixRain Internal Types
```typescript
// Canvas configuration
const fontSize = 16;
const characters = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン01';

// Animation state
let width: number;
let height: number;
let columns: number;
let drops: number[];
let lastTime = number;

// Performance settings
const frameSkip = modalOpen ? 3 : 1; // Frame skipping when modal is open
const fadeOpacity = modalOpen ? 0.15 : 0.2; // Reduced opacity when modal is open
const leadingColor = modalOpen ? '#70ab6c' : '#c8ffc8'; // Dimmed colors when modal is open
const trailOpacity = modalOpen ? 0.4 : 0.7; // Reduced trail opacity when modal is open
``` 