## 5. Card System & Modal Management

### ItemCard Component (`src/components/ItemCard/ItemCard.tsx`)

**Dual-Mode Rendering:**
- **Collapsed Mode:** Small grid card with basic information
- **Expanded Mode:** Full-screen modal with detailed view and large image

**Matrix Integration:**
- **Transparent Backgrounds:** Removed `bg-background` to prevent grey boxes blocking Matrix rain
- **Glassmorphism Effects:** Semi-transparent backgrounds with backdrop blur for depth
- **Matrix Glow on Hover:** CRT green glow effects using multiple box-shadow layers

**Image Handling:**
- **Fallback System:** Uses `useImageFallback` hook for robust image handling
- **Image Fallback System:** Handles cases where image filenames don't match data slugs
- **Fallback Mappings:** Maps data slugs to actual image filenames in `imageFallbacks.ts`
- **Example:** `'mung-bean-tofu-curry': 'mung-bean-&-tofu-curry.jpg'` handles ampersand in filename
- **Fallback Chain:** Primary image → Fallback mapping → Universal fallback → Text icon
- **Universal Fallback:** `404.jpg` for missing images
- **Special Cases:** Handles character name variations (e.g., `'toph-beifong': 'toph.jpg'`)
- **Responsive Images:** Adapts to different screen sizes
- **Loading States:** Graceful handling of image loading and errors 