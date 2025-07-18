# **Feature Plan: Matrix-Themed Collection System**

## 1. Overview & Vision

This document outlines the design and implementation of a **Matrix-Themed Collection System**. This feature will allow users to create and manage personal card collections (e.g., "Team Avatar," "Best Fight Scenes") while maintaining the project's distinctive Matrix/CRT aesthetic.

The system will be fully client-side, integrating with our existing Matrix rain background and CRT-styled components. All UI elements will follow our established "digital terminal" aesthetic.

## 2. Core Principles & Integration Strategy

Development will adhere to these principles:

* **Matrix-First Design:** All new UI elements will use our established CRT/Matrix aesthetic with scanlines, glow effects, and the digital terminal feel.
* **100% Client-Side:** All logic and state managed in browser via `localStorage`, consistent with our current architecture.
* **Dark Theme Native:** Following our "dark theme as default" principle [[memory:3061457]], all new components will be designed for dark mode first.
* **Tailwind Integration:** All styling will use Tailwind CSS [[memory:3062016]], maintaining consistency with our current components.
* **Single Responsibility:** Each component will follow SRP [[memory:3024130]] to maintain clean architecture.

## 3. UI Components & Styling

### a. Collection Card Button (`src/components/Collections/CollectionCardButton.tsx`)

```typescript
interface CollectionCardButtonProps {
  cardId: string;
  isInCollection: boolean;
  onClick: () => void;
}
```

**Styling Integration:**
* Position in top-right of existing `ItemCardCollapsed` component
* Matrix-themed glow effect matching our current CRT aesthetic
* States:
  - Default: Digital terminal-style "+" with subtle green glow
  - In Collection: Bright green checkmark with stronger glow
  - Hover: Increased glow intensity and slight scale
* Tailwind Classes:
```tsx
<button className={`
  absolute top-2 right-2 
  bg-black/40 backdrop-blur-sm
  border border-[#70ab6c]/20
  rounded-full p-1.5
  text-[#70ab6c] 
  hover:text-[#c8ffc8]
  transition-all
  shadow-[0_0_10px_rgba(112,171,108,0.2)]
  hover:shadow-[0_0_15px_rgba(112,171,108,0.4)]
  ${isInCollection ? 'text-[#c8ffc8] shadow-[0_0_15px_rgba(112,171,108,0.4)]' : ''}
`}>
  {isInCollection ? '✓' : '+'}
</button>
```

### b. Collection Sidebar (`src/components/Collections/CollectionsSidebar.tsx`)

**Integration with Matrix Theme:**
* Translucent black background with subtle scanlines
* Green terminal-style text matching MatrixRain colors
* Glowing borders on hover/active states
* Positioning to not interfere with matrix rain effect

```typescript
interface CollectionsSidebarProps {
  collections: Collection[];
  activeCollectionId: string | null;
  onCollectionSelect: (id: string | null) => void;
}
```

**Styling:**
```tsx
<aside className="
  fixed right-0 top-0 h-full w-64
  bg-black/80 backdrop-blur-sm
  border-l border-[#70ab6c]/20
  text-[#70ab6c]
  crt-screen
  transform transition-transform
  ${isOpen ? 'translate-x-0' : 'translate-x-full'}
">
  {/* Content */}
</aside>
```

### c. Collection Creation UI

**Matrix Terminal Style Form:**
* Input fields with terminal-style cursor
* Glowing focus states
* Success/error messages in Matrix theme colors

```tsx
<form className="
  mt-4 p-4
  border border-[#70ab6c]/20
  rounded
  bg-black/40
  crt-screen
">
  <input 
    type="text"
    className="
      w-full
      bg-black/60
      border border-[#70ab6c]/30
      text-[#c8ffc8]
      p-2
      rounded
      focus:border-[#c8ffc8]
      focus:shadow-[0_0_10px_rgba(200,255,200,0.2)]
      placeholder-[#70ab6c]/50
    "
    placeholder="Collection Name..."
  />
</form>
```

## 4. Data Model & State Management

### a. Types (`src/types/domainTypes.ts`)

```typescript
export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon?: string; // Using Matrix-theme compatible icons
  createdAt: string;
  cardIds: string[];
  theme?: {
    primaryColor?: string; // Default: #70ab6c
    glowIntensity?: 'low' | 'medium' | 'high';
  };
}
```

### b. Hook (`src/hooks/useCollections.ts`)

Standard hook implementation with Matrix theme awareness:
* Collection themes default to Matrix green
* Glow effects configurable per collection
* Performance optimized to not impact Matrix rain animation

## 5. Implementation Order & Integration Points

1. **Core Components First:**
   * Start with `CollectionCardButton` integration into `ItemCardCollapsed`
   * Ensure it doesn't break existing card hover/focus states
   * Test with Matrix rain background for visual conflicts

2. **Sidebar Implementation:**
   * Build and test sidebar layout with Matrix theme
   * Ensure proper z-indexing with matrix rain
   * Implement smooth transitions that don't affect performance

3. **Collection Management UI:**
   * Create terminal-style forms
   * Add collection CRUD operations
   * Implement drag-and-drop with Matrix visual feedback

4. **State Integration:**
   * Connect to `HomeContainer`
   * Implement filtering logic
   * Add localStorage persistence

## 6. Performance Considerations

* Use `React.memo` for collection components to prevent unnecessary re-renders
* Optimize matrix rain interaction with new UI elements
* Implement proper z-indexing to maintain performance
* Use CSS transforms for animations where possible
* Lazy load collection sidebar content

## 7. Testing & Edge Cases

* Test all UI states with matrix rain active
* Verify performance with large collections
* Test all hover/focus states with CRT effect
* Ensure accessibility with high-contrast Matrix theme
* Verify mobile responsiveness with matrix background

## 8. Documentation Updates

* Update `styling.md` with new Matrix-themed components
* Add collection-specific styling guidelines
* Document performance considerations with Matrix UI
* Update component hierarchy documentation
* Add new Tailwind utility classes if created