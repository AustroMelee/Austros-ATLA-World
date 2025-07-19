## Image Processing

### Image Path Validation
- **Requirement:** Image paths in JSON metadata must match actual filenames in `public/assets/images/`
- **Validation:** All image paths verified against actual files during processing
- **Pattern:** `"image": "exact-filename.jpg"` must match actual file

### Image Fallback System
- **Component:** `src/components/ItemCard/imageFallbacks.ts`
- **Purpose:** Handles cases where image filenames don't match data slugs
- **Implementation:** Maps data slugs to actual image filenames
- **Example:** `'mung-bean-tofu-curry': 'mung-bean-&-tofu-curry.jpg'` handles ampersand in filename
- **Fallback Chain:** Primary image → Fallback mapping → Universal fallback → Text icon
- **Universal Fallback:** `404.jpg` for missing images
- **Special Cases:** Handles character name variations (e.g., `'toph-beifong': 'toph.jpg'`)

### Image Processing Pipeline
1. **Data Parsing:** Image paths extracted from markdown frontmatter
2. **Path Validation:** Verify image files exist in assets directory
3. **Fallback Mapping:** Handle filename mismatches with fallback system
4. **Client-Side Loading:** Images loaded with fallback handling in UI 