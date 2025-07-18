# Type Definitions (2025 January Update)

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

### EnrichedGroup (NEW 2025)
```typescript
export type EnrichedGroup = {
  __type: 'group';
  id: string;
  name: string;
  description: string;
  slug: string;
  groupType?: string | null;
  affiliation?: string | null;
  ideology?: string | null;
  baseOfOperations?: string | null;
  foundingDate?: string | null;
  dissolutionDate?: string | null;
  leadership?: string[];
  membership?: string[];
  notableMembers?: string[];
  size?: number | null;
  image?: string | null;
  synonyms?: string[];
  tags?: string[];
  relations?: string[];
  expandedView?: string;
};
```

### EnrichedRecord (Updated 2025)
```typescript
export type EnrichedRecord =
  | EnrichedBending
  | EnrichedCharacter
  | EnrichedFauna
  | EnrichedFood
  | EnrichedGroup // Added this line
  | EnrichedLocation
  | EnrichedSpiritWorld;
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

### CreateCollectionModal
```typescript
interface Props {
  onSubmit: (name: string) => void;
  onCancel: () => void;
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

### Home Props (Updated 2025)
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

### HomeContainer State (Updated 2025)
```typescript
// NEW STATE VARIABLES
const [activeNations, setActiveNations] = useState<Set<string>>(new Set());
const [activeCoreFilter, setActiveCoreFilter] = useState<string | null>(null);
const [activeSubFilters, setActiveSubFilters] = useState<Set<string>>(new Set());

// NEW HANDLER FUNCTIONS
const handleToggleNation = (nation: string) => {
  setActiveNations(prev => {
    const newSet = new Set(prev);
    newSet.has(nation) ? newSet.delete(nation) : newSet.add(nation);
    return newSet;
  });
};

const handleSetCoreFilter = (filter: string | null) => {
  setActiveCoreFilter(prev => (prev === filter ? null : filter));
  setActiveSubFilters(new Set()); // Clear sub-filters when core changes
};

const handleToggleSubFilter = (subFilter: string) => {
  setActiveSubFilters(prev => {
    const newSet = new Set(prev);
    newSet.has(subFilter) ? newSet.delete(subFilter) : newSet.add(subFilter);
    return newSet;
  });
};
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

## Data Pipeline Types (2025 Update)

### Template Exclusion Pattern
```typescript
// Pattern used in scripts/1-parse-markdown.mjs
!/[/\\\\]templates[/\\\\]/.test(p)
```

### Expanded View Processing
```typescript
// Pattern for extracting expanded view content
const expandedViewMatch = content.match(/```md\s*([\s\S]*?)\s*```/);
if (expandedViewMatch) {
  console.log('[DEBUG] Found Expanded View block: true');
  // Process expanded view content
}
```

### Image Path Validation
```typescript
// Pattern for validating image paths
const imagePath = metadata.image;
if (imagePath && !fs.existsSync(`public/assets/images/${imagePath}`)) {
  console.warn(`[WARNING] Image not found: ${imagePath}`);
}
```

### JSON Syntax Validation
```typescript
// Pattern for removing trailing commas
const cleanJson = jsonString.replace(/,(\s*[}\]])/g, '$1');
```

## Search Engine Types

### Search Result Types
```typescript
interface SearchResult {
  entity: EnrichedEntity;
  matchedFields: MatchedField[];
  score: number;
}

interface MatchedField {
  field: string;
  token: string;
}
```

### Filter Mapping Types (2025 Update)
```typescript
// Type mapping for core filters
const typeMap: Record<string, string> = { 
  characters: 'character', 
  locations: 'location', 
  groups: 'group', // NEW 2025
  foods: 'food',
  fauna: 'fauna', 
  spirits: 'spirit-world' 
};

// Sub-filter mapping for comprehensive filtering
const subFilterMap: Record<string, string[]> = {
  characters: ['heroes', 'villains', 'mentors'],
  groups: ['military', 'secret_society', 'warriors'],
  foods: ['meat', 'vegetables', 'desserts'],
  locations: ['cities', 'temples', 'wilderness'],
  fauna: ['domestic', 'wild', 'spirit'],
  spirits: ['benign', 'malevolent', 'neutral']
};
``` 