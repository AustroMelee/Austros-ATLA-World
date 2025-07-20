# Character Cards Index

## Overview

This document provides a comprehensive index of all character cards in the Austros ATLA World application, including their metadata, badges, nation affiliations, and display characteristics.

## 📊 Character Data Statistics

- **Total Characters:** 67 items
- **Nation Distribution:**
  - Fire Nation: ~20 characters
  - Earth Kingdom: ~25 characters
  - Water Tribe: ~15 characters
  - Air Nomads: ~7 characters
- **Badge System:** Dynamic badges for all character types
- **Nation Fields:** All characters have nation fields for filtering
- **Type Labels:** Dynamic type detection with proper labeling

## 🎯 Character Card Features

### Core Display Elements
- **Name:** Primary character name with proper typography
- **Badge:** Dynamic badge display from card view section
- **Nation Symbol:** Nation icon with enhanced sizing (50% larger in grid cards)
- **Type Label:** Dynamic detection ("Character", "Group", "Location", etc.)
- **Image:** Character portrait with fallback system
- **Short Description:** Concise character summary

### Enhanced UI Elements (2025 January Update)
- **Matrix Glow Effects:** CRT green glow on hover
- **Glassmorphism:** Semi-transparent backgrounds with backdrop blur
- **Collection Integration:** Matrix-themed collection buttons
- **Responsive Design:** Adapts to all screen sizes
- **Accessibility:** Proper ARIA labels and keyboard navigation

### Badge System Integration
- **Dynamic Extraction:** Badges extracted from card view section
- **Display Logic:** Uses `getBadge` function for multiple sources
- **Visual Integration:** Prominent badge display on character cards
- **Fallback Handling:** Graceful handling when badges are missing

### Nation Field Integration
- **Comprehensive Filtering:** All characters filterable by nation
- **Visual Display:** Nation symbols on all character cards
- **Enhanced Sizing:** Nation icons increased for better visibility
- **Consistent Theming:** Nation symbols match overall Matrix theme

## 🔧 Technical Implementation

### ItemCardCollapsed Component
```typescript
// Dynamic type label logic
{item.type === 'group' || item.type === 'religious_organization' || 
 item.type === 'service_organization' ? 'Group' : 
 item.type === 'location' ? 'Location' : 
 item.type === 'food' ? 'Food' : 
 item.type === 'fauna' ? 'Fauna' : 
 item.type === 'spirit-world' ? 'Spirit' : 
 'Character'}
```

### Badge System
```typescript
// Badge extraction from multiple sources
const getBadge = (item: EnrichedItem) => {
  return item.role || item.metadata?.badge || item.metadata?.role || null;
};
```

### Nation Integration
```typescript
// Nation field filtering
if (activeNations.size > 0) {
  itemsToFilter = itemsToFilter.filter(item => 
    item.nation && activeNations.has(item.nation.toLowerCase())
  );
}
```

## 📋 Character Categories

### Fire Nation Characters
- **Royal Family:** Zuko, Azula, Ozai, Iroh, Ursa
- **Military:** Zhao, Jeong Jeong, Combustion Man
- **Civilians:** Cabbage Merchant, June, Nyla
- **Badges:** Fire Lord, Prince, Princess, General, Admiral, Bounty Hunter

### Earth Kingdom Characters
- **Royalty:** King Kuei, Long Feng
- **Military:** General Fong, Haru, Ty Lee
- **Civilians:** Toph, Jet, Smellerbee, Longshot
- **Badges:** King, General, Freedom Fighter, Earthbender

### Water Tribe Characters
- **Royalty:** Chief Arnook, Princess Yue
- **Military:** Pakku, Hahn
- **Civilians:** Katara, Sokka, Hakoda, Hama
- **Badges:** Chief, Princess, Waterbending Master, Warrior

### Air Nomads Characters
- **Avatars:** Aang, Roku, Kyoshi, Yangchen, Kuruk
- **Monks:** Monk Gyatso, Pathik
- **Badges:** Avatar, Airbending Master, Monk

### Animal Companions
- **Mounts:** Appa, Nyla
- **Pets:** Momo, Bosco
- **Badges:** Animal Companion, Shirshu, Flying Bison

## 🎨 Visual Design Elements

### Matrix Theme Integration
- **CRT Green Glow:** `#70ab6c` and `#c8ffc8` colors
- **Backdrop Blur:** `backdrop-blur-md` for glassmorphism
- **Drop Shadows:** Text drop shadows for glowing effects
- **Border Effects:** Thick borders with glow for definition

### Interactive States
- **Hover Effects:** Scale animation and enhanced glow
- **Active States:** Different colors and glows for different states
- **Transition Smoothness:** 300ms duration for all animations
- **Visual Hierarchy:** Clear distinction between states

### Enhanced Icon Sizing (2025 January Update)
- **Grid Cards:** Nation icons increased from `size={8}` to `size={12}` (50% larger)
- **Modal Cards:** Nation icons increased from `size={20}` to `size={24}` (20% larger)
- **Visual Impact:** Nation icons significantly more prominent and easier to identify

## 🔄 Data Flow Integration

### Markdown Processing
1. **Card View Section:** Extracts badge, name, and short description
2. **Backend Metadata:** Separated from expanded view to prevent UI display
3. **Nation Field:** Promoted to top level for filtering
4. **Image Validation:** Ensures image paths match actual files

### Enrichment Process
1. **Badge Extraction:** Badges extracted from card view section
2. **Nation Promotion:** Nation fields promoted to top level
3. **Type Classification:** Dynamic type detection for proper labeling
4. **Image Fallbacks:** Robust fallback system for missing images

### UI Rendering
1. **Dynamic Type Labels:** Proper type detection and display
2. **Badge Display:** Dynamic badge rendering from metadata
3. **Nation Integration:** Nation symbols on all character cards
4. **Collection Integration:** Matrix-themed collection management

## 🛠️ Troubleshooting

### Common Issues
- **Missing Badges:** Ensure badge is in card view section
- **Backend Metadata in UI:** Remove `---` separators from expanded view
- **Missing Nation Fields:** Add nation field to markdown metadata
- **Image Not Showing:** Add fallback mapping in `imageFallbacks.ts`

### Prevention Guidelines
1. **Separate Backend Metadata:** Keep backend metadata separate from expanded view
2. **Include Required Fields:** Ensure all characters have id, name, type, nation
3. **Add Badges:** Include badges in card view section
4. **Validate Image Paths:** Ensure image paths match actual files
5. **Test Nation Filtering:** Verify characters can be filtered by nation

## 📊 Performance Optimizations

### React Optimizations
- **React.memo:** ItemCard components wrapped to prevent unnecessary re-renders
- **useMemo:** Expensive operations memoized for performance
- **useCallback:** Event handlers optimized with useCallback
- **Lazy Loading:** Images loaded on demand with `loading="lazy"`

### Filtering Performance
- **Memoized Filtering:** Complex filtering pipeline cached with useMemo
- **useFilterState Hook:** Extracted filter state management
- **applyFilters Utility:** Pure function for filtering logic
- **Performance Impact:** Filtering only re-runs when filters change

## 🎯 Accessibility Features

### ARIA Labels
- **Dynamic Labels:** Updated from "Character details" to "Item details"
- **Proper Roles:** All interactive elements properly labeled
- **Keyboard Navigation:** Full keyboard support throughout

### Screen Reader Support
- **Semantic HTML:** Proper HTML structure for screen readers
- **Alt Text:** Image alt text for character portraits
- **Focus Management:** Proper focus handling for modals

## 🔗 Related Documentation

- **Data Flow:** See `docs/data_flow.md` for processing details
- **Frontend Architecture:** See `docs/frontend_architecture.md` for component structure
- **Troubleshooting:** See `docs/troubleshooting.md` for common issues
- **Data Pipeline:** See `docs/data_pipeline.md` for processing details

---

*Last Updated: January 2025*  
*Character Cards: Enhanced with Badge System*  
*Nation Integration: Complete Filtering Support*  
*Performance: Optimized with Memoization* 