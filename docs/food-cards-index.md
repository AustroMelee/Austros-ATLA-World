# Food Cards Index

## Overview

This document provides a comprehensive index of all food cards in the Austros ATLA World application, including their metadata, nation affiliations, category classifications, and display characteristics.

## 📊 Food Data Statistics

- **Total Foods:** 110 items
- **Nation Distribution:**
  - Fire Nation: ~30 foods
  - Earth Kingdom: ~40 foods
  - Water Tribe: ~25 foods
  - Air Nomads: ~15 foods
  - Republic City: ~5 foods
  - Spirit World: ~3 foods
- **Category System:** 12 comprehensive sub-categories
- **Nation Fields:** All foods have nation fields for filtering
- **Image System:** Robust fallback system for food images

## 🎯 Food Card Features

### Core Display Elements
- **Name:** Primary food name with proper typography
- **Nation Symbol:** Nation icon with enhanced sizing (50% larger in grid cards)
- **Type Label:** Dynamic detection showing "Food"
- **Image:** Food image with robust fallback system
- **Short Description:** Concise food summary

### Enhanced UI Elements (2025 January Update)
- **Matrix Glow Effects:** CRT green glow on hover
- **Glassmorphism:** Semi-transparent backgrounds with backdrop blur
- **Collection Integration:** Matrix-themed collection buttons
- **Responsive Design:** Adapts to all screen sizes
- **Accessibility:** Proper ARIA labels and keyboard navigation

### Nation Field Integration
- **Comprehensive Filtering:** All foods filterable by nation
- **Visual Display:** Nation symbols on all food cards
- **Enhanced Sizing:** Nation icons increased for better visibility
- **Consistent Theming:** Nation symbols match overall Matrix theme

### Category System (12 Sub-Categories)
- **Beverages:** Tea, juice, alcohol
- **Desserts:** Cakes, cookies, sweets
- **Soups:** Various soup types
- **Meat:** Meat-based dishes
- **Vegetables:** Vegetable dishes
- **Noodles:** Noodle-based dishes
- **Dumplings:** Various dumpling types
- **Preserved:** Pickled, dried, preserved foods
- **Street Food:** Quick, portable foods
- **Traditional:** Cultural traditional dishes
- **Vegetarian:** Plant-based dishes
- **Luxury:** High-end, expensive foods
- **Ceremonial:** Special occasion foods
- **Health:** Medicinal, health-focused foods
- **Fire-Themed:** Spicy, fire-related foods
- **Seafood:** Fish and marine-based dishes

## 🔧 Technical Implementation

### ItemCardCollapsed Component
```typescript
// Dynamic type label logic for foods
{item.type === 'food' ? 'Food' : 
 item.type === 'group' || item.type === 'religious_organization' || 
 item.type === 'service_organization' ? 'Group' : 
 item.type === 'location' ? 'Location' : 
 item.type === 'fauna' ? 'Fauna' : 
 item.type === 'spirit-world' ? 'Spirit' : 
 'Character'}
```

### Image Fallback System
```typescript
// Image fallback mapping in imageFallbacks.ts
export const imageFallbacks: Record<string, string> = {
  "tofu-fried-puffs": "tofu-(fried-puffs).jpg",
  // Add more fallbacks as needed
};
```

### Nation Integration
```typescript
// Nation field filtering for foods
if (activeNations.size > 0) {
  itemsToFilter = itemsToFilter.filter(item => 
    item.nation && activeNations.has(item.nation.toLowerCase())
  );
}
```

## 📋 Food Categories

### Fire Nation Foods
- **Spicy Dishes:** Fire cakes, flaming fire flakes, superspicy souffle, extra-spicy-fire-noodles
- **Luxury Foods:** Fire gummies, fire-nation-tea, ice-cream
- **Traditional:** Fire-themed dishes with heat elements, loco-moco
- **Seafood:** Elephant-koi-shui-zhu-yu, fried-bangus-fish
- **Nation Field:** "Fire Nation"

### Earth Kingdom Foods
- **Vegetables:** Steamed vegetables, kale wraps, kale smoothie
- **Grains:** Rice dishes, bread, noodles
- **Traditional:** Earth Kingdom cultural dishes
- **Desserts:** Cabbage cookies, cakes, chocolate mousse, cookie-of-the-white-lotus, moon-peach-cakes, pumpkin-pie, stuffed-apple-donuts, sugar-cookies, wagashi-desserts
- **Street Food:** Bean-curd-puffs
- **Nation Field:** "Earth Kingdom"

### Water Tribe Foods
- **Seafood:** Fish dishes, sea soup, sea-squid-soup
- **Preserved:** Dried fish, salmon jerky, pickled fish
- **Traditional:** Water Tribe cultural dishes
- **Nation Field:** "Water Tribe"

### Air Nomad Foods
- **Vegetarian:** Plant-based dishes, steamed dumplings
- **Traditional:** Air Nomad cultural dishes
- **Nation Field:** "Air Nomads"

### Republic City Foods
- **Modern:** Contemporary fusion dishes
- **Street Food:** Quick, portable foods
- **Nation Field:** "Republic City"

### Spirit World Foods
- **Mystical:** Spirit-themed dishes
- **Unique:** Otherworldly food items
- **Nation Field:** "Spirit World"

## 🆕 New Food Items (January 2025)

### Earth Kingdom Additions
- **Cabbage Cookies** - Signature dessert from Cabbage Delicacies Bistro
- **Bean Curd Puffs** - Street food from Ba Sing Se markets
- **Cakes** - Traditional baked pastries enjoyed by Bosco
- **Chocolate Mousse** - Sophisticated dessert from Ba Sing Se's evolving culinary scene
- **Cookie of the White Lotus** - Pai Sho prize cookies with cultural significance
- **Moon Peach Cakes** - Rare fruit dessert showcasing culinary excellence
- **Pumpkin Pie** - Traditional Earth Kingdom seasonal dessert
- **Stuffed Apple Donuts** - Seasonal fried pastries with apple compote
- **Sugar Cookies** - Classic Earth Kingdom comfort cookies
- **Wagashi Desserts** - Artistic confections for tea ceremonies

### Fire Nation Additions
- **Loco Moco** - Hearty rice dish with burger patty and gravy
- **Extra Spicy Fire Noodles** - Legendary challenge dish with extreme heat
- **Ice Cream** - Cooling dessert providing relief from Fire Nation heat
- **Elephant Koi Shui Zhu Yu** - Fish dish prepared in Yokoya
- **Fried Bangus Fish** - Traditional fish dish from Lambak clan celebrations

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
4. **Category Tags:** Food category tags for sub-filtering

### Enrichment Process
1. **Nation Promotion:** Nation fields promoted to top level
2. **Category Mapping:** Food categories mapped to sub-filters
3. **Image Validation:** Ensures image paths match actual files
4. **Filter Mapping:** Foods mapped to food filter category

### UI Rendering
1. **Dynamic Type Labels:** Proper "Food" labeling
2. **Nation Integration:** Nation symbols on all food cards
3. **Collection Integration:** Matrix-themed collection management
4. **Category Display:** Food categories in sub-filters

## 🛠️ Troubleshooting

### Common Issues
- **Image Not Showing:** Add fallback mapping in `imageFallbacks.ts`
- **Missing Nation Fields:** Add nation field to food markdown metadata
- **Backend Metadata in UI:** Remove `---` separators from expanded view
- **Category Not Filtering:** Ensure food has proper category tags

### Prevention Guidelines
1. **Separate Backend Metadata:** Keep backend metadata separate from expanded view
2. **Include Required Fields:** Ensure all foods have id, name, type, nation
3. **Add Image Fallbacks:** Add fallback mappings for filename mismatches
4. **Test Nation Filtering:** Verify foods can be filtered by nation
5. **Validate Image Paths:** Ensure image paths match actual files

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

### Image Loading Performance
- **Lazy Loading:** All food images use `loading="lazy"` attribute
- **Fallback System:** Robust image fallback handling with graceful degradation
- **Performance Impact:** Browser only loads images when they're about to be visible

## 🎯 Accessibility Features

### ARIA Labels
- **Dynamic Labels:** Updated from "Character details" to "Item details"
- **Proper Roles:** All interactive elements properly labeled
- **Keyboard Navigation:** Full keyboard support throughout

### Screen Reader Support
- **Semantic HTML:** Proper HTML structure for screen readers
- **Alt Text:** Image alt text for food items
- **Focus Management:** Proper focus handling for modals

## 🔗 Related Documentation

- **Data Flow:** See `docs/data_flow.md` for processing details
- **Frontend Architecture:** See `docs/frontend_architecture.md` for component structure
- **Troubleshooting:** See `docs/troubleshooting.md` for common issues
- **Data Pipeline:** See `docs/data_pipeline.md` for processing details

---

*Last Updated: January 2025*  
*Food Cards: Enhanced with Nation Integration*  
*Category System: 12 Comprehensive Sub-Categories*  
*Performance: Optimized with Memoization*  
*New Items: 15 additional foods added* 