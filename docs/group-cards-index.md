# Group Cards Index

## Overview

This document provides a comprehensive index of all group cards in the Austros ATLA World application, including their metadata, nation affiliations, type classifications, and display characteristics.

## 📊 Group Data Statistics

- **Total Groups:** ~10+ items
- **Nation Distribution:**
  - Fire Nation: Fire Sages, Royal Servants, Fire Nation Military, Yuyan Archers, Southern Raiders
  - Earth Kingdom: Dai Li, Kyoshi Warriors, Freedom Fighters, Earth Kingdom Military, Si Wong Tribes
  - Water Tribe: Foggy Swamp Tribe, Water Tribe Military
  - Air Nomads: Air Nomads
  - Four Nations: Order of the White Lotus, Team Avatar
  - Independent: Pirates
- **Type Classifications:** group, religious_organization, service_organization
- **Nation Fields:** All groups have nation fields for filtering
- **Type Labels:** Dynamic type detection with proper "Group" labeling

## 🎯 Group Card Features

### Core Display Elements
- **Name:** Primary group name with proper typography
- **Nation Symbol:** Nation icon with enhanced sizing (50% larger in grid cards)
- **Type Label:** Dynamic detection showing "Group" for all group types
- **Image:** Group representation image with fallback system
- **Short Description:** Concise group summary

### Enhanced UI Elements (2025 January Update)
- **Matrix Glow Effects:** CRT green glow on hover
- **Glassmorphism:** Semi-transparent backgrounds with backdrop blur
- **Collection Integration:** Matrix-themed collection buttons
- **Responsive Design:** Adapts to all screen sizes
- **Accessibility:** Proper ARIA labels and keyboard navigation

### Nation Field Integration
- **Comprehensive Filtering:** All groups filterable by nation
- **Visual Display:** Nation symbols on all group cards
- **Enhanced Sizing:** Nation icons increased for better visibility
- **Consistent Theming:** Nation symbols match overall Matrix theme

### Type Classification System
- **Dynamic Detection:** Proper type detection for all group types
- **Group Types:** "group", "religious_organization", "service_organization"
- **UI Labeling:** All group types display as "Group" in UI
- **Filter Integration:** Groups appear in group filter category

## 🔧 Technical Implementation

### ItemCardCollapsed Component
```typescript
// Dynamic type label logic for groups
{item.type === 'group' || item.type === 'religious_organization' || 
 item.type === 'service_organization' ? 'Group' : 
 item.type === 'location' ? 'Location' : 
 item.type === 'food' ? 'Food' : 
 item.type === 'fauna' ? 'Fauna' : 
 item.type === 'spirit-world' ? 'Spirit' : 
 'Character'}
```

### Filter Integration
```typescript
// Group type mapping in applyFilters.ts
const typeMap: Record<string, string[]> = {
  characters: ['character'],
  locations: ['location'],
  fauna: ['fauna'],
  foods: ['food'],
  groups: ['group', 'religious_organization', 'service_organization'],
  spirits: ['spirit-world'],
};
```

### Nation Integration
```typescript
// Nation field filtering for groups
if (activeNations.size > 0) {
  itemsToFilter = itemsToFilter.filter(item => 
    item.nation && activeNations.has(item.nation.toLowerCase())
  );
}
```

## 📋 Group Categories

### Fire Nation Groups
- **Religious Organizations:** Fire Sages (religious_organization)
- **Service Organizations:** Royal Servants (service_organization)
- **Military:** Fire Nation Military, Yuyan Archers, Southern Raiders
- **Nation Field:** "Fire Nation"

### Earth Kingdom Groups
- **Secret Societies:** Dai Li (secret_society)
- **Military:** Earth Kingdom Military
- **Resistance:** Freedom Fighters, Kyoshi Warriors
- **Tribes:** Si Wong Tribes
- **Nation Field:** "Earth Kingdom"

### Water Tribe Groups
- **Tribes:** Foggy Swamp Tribe
- **Military:** Water Tribe Military
- **Nation Field:** "Water Tribe"

### Air Nomads Groups
- **Monastic Orders:** Air Nomads (monastic_order)
- **Nation Field:** "Air Nomads"

### Multi-Nation Groups
- **Secret Societies:** Order of the White Lotus, Team Avatar
- **Nation Field:** "Four Nations"

### Independent Groups
- **Criminal Organizations:** Pirates
- **Nation Field:** "Independent"

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
1. **Card View Section:** Extracts name and short description
2. **Backend Metadata:** Separated from expanded view to prevent UI display
3. **Nation Field:** Promoted to top level for filtering
4. **Type Classification:** Proper type detection for group types

### Enrichment Process
1. **Nation Promotion:** Nation fields promoted to top level
2. **Type Classification:** Dynamic type detection for proper labeling
3. **Image Validation:** Ensures image paths match actual files
4. **Filter Mapping:** Groups mapped to group filter category

### UI Rendering
1. **Dynamic Type Labels:** Proper "Group" labeling for all group types
2. **Nation Integration:** Nation symbols on all group cards
3. **Collection Integration:** Matrix-themed collection management
4. **Filter Display:** Groups appear in group filter category

## 🛠️ Troubleshooting

### Common Issues
- **Groups Not Appearing:** Check filter mapping includes all group types
- **Groups Labeled as "Character":** Update type label logic to include group types
- **Missing Nation Fields:** Add nation field to group markdown metadata
- **Backend Metadata in UI:** Remove `---` separators from expanded view
- **Image Not Showing:** Add fallback mapping in `imageFallbacks.ts`

### Prevention Guidelines
1. **Separate Backend Metadata:** Keep backend metadata separate from expanded view
2. **Include Required Fields:** Ensure all groups have id, name, type, nation
3. **Update Filter Mapping:** Add new group types to filter mapping
4. **Update Type Labels:** Include new group types in type label logic
5. **Test Nation Filtering:** Verify groups can be filtered by nation

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
- **Alt Text:** Image alt text for group representations
- **Focus Management:** Proper focus handling for modals

## 🔗 Related Documentation

- **Data Flow:** See `docs/data_flow.md` for processing details
- **Frontend Architecture:** See `docs/frontend_architecture.md` for component structure
- **Troubleshooting:** See `docs/troubleshooting.md` for common issues
- **Data Pipeline:** See `docs/data_pipeline.md` for processing details

---

*Last Updated: January 2025*  
*Group Cards: Enhanced with Nation Integration*  
*Type Classification: Complete Group Support*  
*Performance: Optimized with Memoization* 