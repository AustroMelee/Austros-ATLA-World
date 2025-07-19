# Data Flow

## Overview

This document describes how data flows through the Austros ATLA World application, from raw markdown files to the user interface.

## 🔄 Data Flow Architecture

```mermaid
graph TD
    A[raw-data/] --> B[scripts/1-parse-markdown.mjs]
    B --> C[parsed-data.json]
    C --> D[scripts/2-enrich-data.mjs]
    D --> E[enriched-data.json]
    E --> F[HomeContainer]
    F --> G[useEnrichedData Hook]
    G --> H[useSearch Hook]
    H --> I[EntityGrid]
    I --> J[ItemCard Components]
    
    K[Search Input] --> L[useSearch Hook]
    L --> M[FlexSearch Index]
    M --> N[Filtered Results]
    N --> I
    
    O[Filter Controls] --> P[useFilters Hook]
    P --> Q[Filtered Data]
    Q --> I
    
    R[Collections] --> S[useCollections Hook]
    S --> T[localStorage]
    T --> U[Collection UI]
    
    V[Matrix Rain] --> W[useCardExpansion Hook]
    W --> X[Modal Display]
    
    style A fill:#e1f5fe
    style E fill:#c8e6c9
    style F fill:#fff3e0
    style I fill:#f3e5f5
    style J fill:#ffebee
```

## 📊 Detailed Flow Breakdown

### 1. Data Ingestion Phase
```mermaid
graph LR
    A[raw-data/characters/] --> B[Markdown Parser]
    C[raw-data/groups/] --> B
    D[raw-data/foods/] --> B
    E[raw-data/locations/] --> B
    F[raw-data/fauna/] --> B
    G[raw-data/episodes/] --> B
    
    B --> H[YAML Frontmatter Extraction]
    H --> I[JSON Metadata Parsing]
    I --> J[Expanded View Content]
    J --> K[parsed-data.json]
    
    style A fill:#e3f2fd
    style C fill:#e3f2fd
    style D fill:#e3f2fd
    style E fill:#e3f2fd
    style F fill:#e3f2fd
    style G fill:#e3f2fd
    style K fill:#c8e6c9
```

### 2. Data Enrichment Phase
```mermaid
graph TD
    A[parsed-data.json] --> B[enrichRecord.mjs]
    B --> C[Tag Processing]
    C --> D[Search Aliases]
    D --> E[Type Classification]
    E --> F[Image Validation]
    F --> G[enriched-data.json]
    
    H[tag_dictionary.json] --> C
    I[imageFallbacks.ts] --> F
    
    style A fill:#fff3e0
    style G fill:#c8e6c9
    style H fill:#f3e5f5
    style I fill:#e8f5e8
```

### 3. Frontend Data Consumption
```mermaid
graph TD
    A[enriched-data.json] --> B[useEnrichedData Hook]
    B --> C[Data State Management]
    C --> D[useSearch Hook]
    D --> E[FlexSearch Index]
    E --> F[Search Results]
    
    G[Filter Controls] --> H[useFilters Hook]
    H --> I[Filtered Data]
    
    F --> J[EntityGrid]
    I --> J
    J --> K[ItemCard Components]
    
    L[Collections State] --> M[useCollections Hook]
    M --> N[localStorage]
    N --> O[Collection UI]
    
    style A fill:#c8e6c9
    style J fill:#f3e5f5
    style K fill:#ffebee
    style N fill:#e8f5e8
```

### 4. Component Hierarchy
```mermaid
graph TD
    A[App.tsx] --> B[Layout.tsx]
    B --> C[HomeContainer.tsx]
    C --> D[SearchBar.tsx]
    C --> E[FilterBar.tsx]
    C --> F[EntityGrid.tsx]
    C --> G[CollectionsSidebar.tsx]
    
    F --> H[ItemCard.tsx]
    H --> I[ItemCardCollapsed.tsx]
    H --> J[ItemCardModal.tsx]
    
    E --> K[Filter Components]
    G --> L[Collection Components]
    
    M[MatrixRain.tsx] --> B
    
    style A fill:#e1f5fe
    style C fill:#fff3e0
    style F fill:#f3e5f5
    style H fill:#ffebee
    style M fill:#fce4ec
```

## 🔧 Hook Dependencies

### Core Data Hooks
```mermaid
graph LR
    A[useEnrichedData] --> B[enriched-data.json]
    C[useSearch] --> A
    D[useFilters] --> A
    E[useCollections] --> F[localStorage]
    
    G[useCardExpansion] --> H[Modal State]
    I[useImageFallback] --> J[Image Loading]
    K[useDebounce] --> L[Search Input]
    
    style A fill:#c8e6c9
    style C fill:#fff3e0
    style D fill:#fff3e0
    style E fill:#e8f5e8
```

## 📈 Performance Flow

### Search Performance
```mermaid
graph TD
    A[User Types] --> B[useDebounce Hook]
    B --> C[500ms Delay]
    C --> D[useSearch Hook]
    D --> E[FlexSearch Index]
    E --> F[Filtered Results]
    F --> G[EntityGrid Re-render]
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style E fill:#c8e6c9
    style G fill:#f3e5f5
```

### Image Loading Flow
```mermaid
graph TD
    A[ItemCard Renders] --> B[useImageFallback Hook]
    B --> C[Primary Image Load]
    C --> D{Image Success?}
    D -->|Yes| E[Display Image]
    D -->|No| F[Fallback Image]
    F --> G{Fallback Success?}
    G -->|Yes| H[Display Fallback]
    G -->|No| I[Display Text Icon]
    
    style A fill:#f3e5f5
    style C fill:#e8f5e8
    style E fill:#c8e6c9
    style I fill:#ffebee
```

## 🔄 State Management Flow

### Collections State
```mermaid
graph TD
    A[User Action] --> B[useCollections Hook]
    B --> C[State Update]
    C --> D[localStorage Save]
    D --> E[UI Re-render]
    
    F[Page Load] --> G[localStorage Read]
    G --> H[State Restoration]
    H --> E
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style D fill:#e8f5e8
    style E fill:#f3e5f5
```

### Collections System Flow (2025 Update)
```mermaid
graph TD
    A[User Clicks + Button] --> B[CollectionCardButton]
    B --> C[AddToCollectionPopover]
    C --> D[Card Ref Positioning]
    D --> E[Fixed Position Popover]
    E --> F[Collection List Display]
    F --> G[Custom Checkboxes]
    G --> H[Click Outside Detection]
    H --> I[Popover Close]
    
    J[CollectionsSidebar] --> K[Dynamic Sizing]
    K --> L[Content-Based Height]
    L --> M[Responsive Width]
    M --> N[No Stretching]
    
    O[Layout Container] --> P[Height Management]
    P --> Q[Flexbox Optimization]
    Q --> R[Visual Balance]
    
    style A fill:#e3f2fd
    style C fill:#fff3e0
    style E fill:#f3e5f5
    style G fill:#e8f5e8
    style J fill:#c8e6c9
    style O fill:#ffebee
```

### Enhanced Collections Components Flow
```mermaid
graph TD
    A[ItemCardCollapsed] --> B[cardRef Creation]
    B --> C[CollectionCardButton]
    C --> D[Enhanced Matrix Styling]
    D --> E[Scale Animation]
    E --> F[Glow Effects]
    
    G[AddToCollectionPopover] --> H[Fixed Positioning]
    H --> I[Dynamic Sizing]
    I --> J[Scrollable Content]
    J --> K[Click Outside Detection]
    K --> L[Custom Checkboxes]
    
    M[CollectionsSidebar] --> N[Content-Based Height]
    N --> O[Responsive Width]
    O --> P[No Stretching]
    P --> Q[Visual Balance]
    
    style A fill:#f3e5f5
    style C fill:#fff3e0
    style G fill:#e8f5e8
    style M fill:#c8e6c9
```

## 🎯 Key Data Transformations

### Raw Markdown → Enriched JSON
1. **YAML Frontmatter** → Structured metadata
2. **Markdown Content** → Expanded view HTML
3. **Image References** → Validated file paths
4. **Tag Arrays** → Normalized and validated
5. **Search Aliases** → Generated from content

### Enriched JSON → UI Components
1. **Type Classification** → Component selection
2. **Image Loading** → Fallback handling
3. **Search Indexing** → FlexSearch optimization
4. **Filter Processing** → Real-time filtering
5. **Collection State** → localStorage persistence

## 📊 Data Volume Metrics

- **Raw Markdown Files:** ~165+ files
- **Parsed Records:** ~165+ JSON objects
- **Enriched Records:** ~165+ with additional metadata
- **Search Index:** ~165+ indexed documents
- **Image Assets:** ~165+ character/group/food images
- **Tag Dictionary:** ~200+ normalized tags
- **Food Items:** 98 items
- **Character Items:** 67 items
- **Group Items:** ~10+ items

## 🔗 Related Documentation

- **Data Pipeline:** See `docs/data_pipeline.md` for processing details
- **Frontend Architecture:** See `docs/frontend_architecture.md` for component structure
- **Troubleshooting:** See `docs/troubleshooting.md` for flow issues
- **Source of Truth:** See `docs/source_of_truth.md` for standards

---

*Last Updated: January 2025*  
*Flow Diagrams: Mermaid.js*

