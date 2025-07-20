# 🎨 Styling Guide & Standards

## CRT Terminal Effects (2025)

### Search Bar Effects

#### 1. Phosphor Persistence
- Characters briefly flash brighter green (#a8e6a8) when typed
- Smooth fade transition over 0.6s to standard color
- Subtle text shadow for authentic CRT glow
- Implementation in `custom.css`:
  ```css
  @keyframes phosphor-fade {
    0% {
      color: #a8e6a8;
      text-shadow: 
        0 0 6px rgba(168, 230, 168, 0.5),
        0 0 12px rgba(168, 230, 168, 0.3);
    }
    40% {
      color: #8fcc8f;
      text-shadow: 
        0 0 4px rgba(143, 204, 143, 0.4),
        0 0 8px rgba(143, 204, 143, 0.2);
    }
    100% {
      color: #70ab6c;
      text-shadow: 
        0 0 3px rgba(112, 171, 108, 0.3),
        0 0 6px rgba(112, 171, 108, 0.1);
    }
  }
  ```

#### 2. Cursor Wake-Up Animation
- 100ms elastic scale animation on first focus
- Smooth transition from invisible to visible state
- Implementation in `custom.css`:
  ```css
  @keyframes cursor-wake-up {
    0% { transform: scaleX(0); opacity: 0; }
    20% { transform: scaleX(1.2); opacity: 0.6; }
    40% { transform: scaleX(0.8); opacity: 0.8; }
    60% { transform: scaleX(1.1); opacity: 0.9; }
    80% { transform: scaleX(0.9); opacity: 1; }
    100% { transform: scaleX(1); opacity: 1; }
  }
  ```

#### 3. Scan Lines
- Subtle horizontal scan lines that drift upward
- Semi-transparent green lines for authentic CRT look
- Implementation in `custom.css`:
  ```css
  .search-scanlines::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 1px,
      rgba(112, 171, 108, 0.08) 2px,
      rgba(112, 171, 108, 0.08) 3px
    );
    pointer-events: none;
    z-index: 1;
    animation: scanline-drift 8s linear infinite;
  }
  ```

### UI Standards

#### Search Bar Typography
- Font: Glass_TTY_VT220 at 28px
- Padding: py-2 (reduced vertical padding)
- Text color: #70ab6c (standard), #a8e6a8 (phosphor flash)
- Cursor spacing: 4px from text

#### Grid Layout
- Empty state shows clean grid without "No results found" message
- Maintains consistent spacing regardless of result count
- Uses flex layout with proper gap handling

### 10. Smooth Scrolling Navigation (2025 Update)

#### Global CSS Implementation
- **Automatic Smooth Scrolling:** All native anchor links (`<a href="#section">`) automatically scroll smoothly due to the global CSS rule in `src/styles/custom.css`:
  ```css
  html {
    scroll-behavior: smooth;
  }
  ```
- **Browser Native:** Uses the browser's built-in smooth scrolling for optimal performance
- **No Additional Code:** No component-level implementation needed for standard anchor links

#### JavaScript Utility for Programmatic Scrolling
- **Utility Function:** Located in `src/utils/navigationUtils.ts`:
  ```typescript
  export function scrollToElementById(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      console.warn(`[scrollToElementById] Element with ID "${elementId}" not found.`);
    }
  }
  ```
- **Usage in Components:** Import and use in onClick handlers or other events:
  ```typescript
  import { scrollToElementById } from '../utils/navigationUtils';
  
  // In component
  <button onClick={() => scrollToElementById('my-section')}>
    Scroll to Section
  </button>
  ```

#### Implementation Guidelines
- **Consistent Experience:** Both CSS and JavaScript methods provide the same smooth behavior
- **Accessibility:** Maintains focus and provides visual continuity for screen readers
- **Performance:** Uses native browser smooth scrolling for optimal performance
- **Fallback:** Older browsers gracefully fall back to instant scrolling without breaking functionality

## 1. CSS Source of Truth: Tailwind CSS (v3.4.3)

The project is pinned to `tailwindcss@3.4.3` due to a critical, unrecoverable environmental bug with the v4+ CLI installer on the primary development machine.

-   **Policy:** **Never upgrade `tailwindcss` above `3.4.3`** without first verifying, in a disposable clone, that the CLI binary (`tailwindcss.cmd`) appears in `node_modules/.bin` after a clean install.
-   **Usage:** All styling must be done with Tailwind CSS utility classes. Always use the local CLI for builds:
    ```powershell
    .\node_modules\.bin\tailwindcss.cmd -i ./src/styles/pure-tailwind.css -o ./src/styles/generated-tailwind.css
    ```
-   **Manual Build Required:** The build process is not automated. **You must manually run the command above** after any change to Tailwind config, theme, or class usage for your changes to appear in the UI.
-   **Import Policy:** The main entry point (`main.tsx`) must import the correct generated CSS file (e.g., `generated-tailwind.css`).

### 2. Tailwind JIT: Literal Class Requirement & Troubleshooting

-   **JIT Literal Class Policy:** Tailwind JIT only generates classes it finds as literal strings in scanned files. If a class (e.g., `bg-neutral-900`) is missing from the output CSS, ensure it is present as a literal string in your codebase and restart the dev server or rebuild Tailwind.
-   **Dynamic Class Pitfall:** If you use dynamic class names or template strings, JIT may not detect them. Always add a dummy reference if needed, e.g.:
    ```jsx
    <div className="bg-neutral-900 hidden" />
    ```
-   **Manual Rebuild:** After adding new classes, always run the Tailwind build command and restart the dev server to ensure the new classes are generated and available.
-   **Validation:** If a class is still missing, check the generated CSS file for the class. If absent, add a literal reference and rebuild.

### 3. UI/UX Rules

-   **Card Grid Hover:** **Always use Flexbox (`flex flex-wrap`) for card grids**, never CSS Grid. Grid layouts will clip hover effects like scaling and shadows. The grid container must have sufficient padding (e.g., `p-8`) to prevent edge clipping.
-   **Modal/Overlay Borders:** **Never apply `border`, `rounded-*`, or `shadow-*` styles to both a modal container and its child card.** Only the innermost component should have these "card-like" styles to prevent double borders or visual artifacts.
-   **Responsive Layouts:** Use `flex-wrap` for tag/pill groups. Use `flex-shrink-0`, `flex-1`, and `truncate` for list items to ensure they adapt gracefully.

### 4. Card Styling & Scaling (2025 Performance Update)

-   **Card Width:** Card width is set in `ItemCardCollapsed` (currently `w-[113px]`).
    -   **Source of Truth:** To change the card size globally, update the `w-[113px]` value in `src/components/ItemCard/ItemCardCollapsed.tsx`. All card content is sized relative to this width.
-   **Card Content Scaling:** All internal card content (image, text, etc.) is scaled in `ItemCard` to match the card size for visual consistency.
-   **Card Name Wrapping:** Card names use `overflow-hidden text-ellipsis` with proper flex layout (`flex-1 min-w-0`) for accessibility and graceful text truncation. The deprecated `@tailwindcss/line-clamp` plugin has been removed in favor of built-in Tailwind utilities.
-   **Grid Layout:** The card grid uses flexbox for layout, ensuring cards stretch to fill the row and maintain a consistent appearance.
-   **SRP:** All card styling and scaling should be handled in the relevant component (`EntityGrid` for layout/width, `ItemCard` for content), not globally.
-   **Nation Colors:** Card border, background glow, and **card title text** (both grid/collapsed and modal/expanded) are themed by nation. The nation color is determined by the `nationThemeMap` in `src/theme/nationThemes.ts`.
    - **Collapsed Card Titles:** The grid card title (`<h3>`) now uses an inline style for color based on nation, matching the modal logic. The `text-white` class is removed from the `<h3>` in `ItemCardCollapsed.tsx`.
    - **Expanded Card Titles:** The modal title (`<h2>`) uses the same nation color logic.
    - **Nation Icons:** Nation symbols (Water Tribe droplet, Fire Nation flame, etc.) are displayed on both grid and modal cards with enhanced visibility and larger sizes for better prominence.
    - **Icon Sizing (2025 January Update):** Nation icons have been increased in size for better visibility:
      - **Grid Cards:** Increased from `size={8}` to `size={12}` (50% larger)
      - **Modal Cards:** Increased from `size={20}` to `size={24}` (20% larger)
      - **Visual Impact:** Nation icons are now significantly more prominent and easier to identify
    - To change or add a nation color, update `nationThemeMap`—all cards for that nation will update automatically. If a nation is missing, a neutral default color is used.
-   **Card Text Formatting:** Card text is beautifully formatted due to the use of the Tailwind Typography plugin (`prose` classes), which is enabled and customized in `tailwind.config.js` for the project's dark theme. The expanded card content uses a `prose`-styled div, and the `CustomMarkdownRenderer` component (with `react-markdown` and custom React components) further enhances markdown rendering for headings, lists, and emphasis. This combination ensures all card text is visually appealing, readable, and consistent.
-   **Performance Optimization:** ItemCard components are wrapped with React.memo to prevent unnecessary re-renders and improve performance.
-   **Image Loading:** All card images use `loading="lazy"` attribute for faster initial page load and better performance.

### 5. Hiding/Unhiding UI Features (Filters & Collections)

-   **Convention:** To hide a UI feature (e.g., FilterSidebar, FilterPanel, CollectionsSidebar, CollectionsPanel), set the component to return `null` and add a comment at the top: "[Component] is hidden from the UI on user request. To re-enable, restore the original export."
-   **To Unhide:** Restore the original export and implementation in the component file.
-   **Canonical Toggle:** This is the canonical method for feature toggling in this project—no conditional rendering in parent components, no feature flags. All toggling is done at the component export level for clarity and maintainability.

### 6. Card Image Sizing: Root Cause & Solution (2024-07)

- **Discovery:** Using fixed rem/pixel sizes (e.g., `w-22`, `h-22`, `w-[5.5rem]`) for card images can cause images to overflow or dominate the card, especially for portrait images or if the card width changes. This is because the image container is not sized relative to the card, and the card's width is set in `EntityGrid` (e.g., `w-[188px]`).
- **Root Cause:** Tailwind will silently ignore non-existent classes (like `w-22`), and fixed sizes do not scale with the card. This leads to brittle, non-responsive layouts and "giant" images.
- **Solution:** Always size the image container **relative to the card** using `w-full aspect-square max-w-[80%] max-h-[60%] mx-auto` (or similar). This ensures the image is always proportional, never overflows, and is visually balanced regardless of card or image aspect ratio.
- **Arbitrary Values:** Only use arbitrary values for image sizing if the card width is also fixed and you want a precise ratio. For responsive or dynamic cards, always use relative sizing.
- **SRP:** All image scaling and proportionality logic should be handled in `ItemCard`, not globally or in the card grid.
- **Reference:** See July 2024 root cause analysis and fix for details. If image size needs to be changed again, adjust the `max-w`/`max-h` or percentage values in `ItemCard` for safe, predictable results.

### 7. Card Badge Styling & Information Hierarchy (2024-07)

- **Floating Role Badge:**
  - Use a single, floating badge (modern pill style) at the bottom-right of the image area, not the card as a whole.
  - Badge uses `bg-neutral-900 text-neutral-100 text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-lg` for maximum readability and a premium look. This solid, opaque background ensures perfect contrast and legibility on both light and dark images. Do not use semi-transparent backgrounds or backdrop blur for badges.
  - Only render the badge if the character has a specific role/title (e.g., "NWT Chief"). Do **not** show a generic fallback (like "Character") in the badge—use the category text for that.
  - The badge must always be visually legible against any image background (high contrast, shadow, subtle border).

- **Category Text:**
  - Always display the category (e.g., "Character") as plain text below the name, not as a badge, for clarity and hierarchy.

- **Vertical Spacing:**
  - Increase card min-height (`min-h-[240px]` or greater) to ensure all elements have breathing room and avoid overlap.
  - Never allow the badge to overlap the name or category text—badge floats over the image only.

- **Information Hierarchy:**
  - Order: Image (with badge) → Name (+ NationIcon) → Category text → (optional) expanded details.
  - Never duplicate the same information in both badge and text.

- **Accessibility:**
  - Ensure badge text is always readable by screen readers (use semantic HTML and sufficient contrast).

### 8. Enhanced Collections Styling (2025 Update)

#### CollectionCardButton Styling
- **Enhanced Matrix Styling:** Larger size (`w-7 h-7`) with thicker border (`border-2`) for better visibility
- **Improved Glow Effects:** Stronger shadows (`shadow-[0_0_20px_rgba(112,171,108,0.8)]`) for dramatic CRT glow
- **Interactive Animations:** Scale animation (`hover:scale-110`) and smooth transitions (`duration-300`)
- **Better Typography:** Bold fonts with drop shadows for glowing text effect
- **Enhanced States:** Different colors and glows for add/remove states
- **Visual Hierarchy:** Plus icon (`text-lg`) and checkmark (`text-sm`) with proper proportions
- **Z-Index Management:** `z-10` ensures button stays above other elements

#### AddToCollectionPopover Styling
- **Fixed Positioning:** Uses `position: fixed` with dynamic positioning based on card location
- **Dynamic Sizing:** `min-width: 200px` with `overflow-y-auto` and `max-h-[80vh]` for scrolling
- **Enhanced Styling:** Semi-transparent background with CRT green borders and glow effects
- **Custom Checkboxes:** Matrix-themed checkboxes with green glow and rounded corners
- **Responsive Design:** Adapts to different collection counts with proper scrolling

#### CollectionsSidebar Styling
- **Content-Based Height:** Uses `h-fit` instead of fixed height to grow only as needed
- **Responsive Width:** `w-auto min-w-[200px] max-w-[280px]` for flexible sizing
- **No Stretching:** Removed `sticky top-20` and replaced with `self-start` to prevent forced height
- **Visual Result:** Sidebar appears as a compact, content-sized panel instead of a long column

#### Layout Integration Styling
- **Container Height Management:** Removed `min-h-screen` from Layout.tsx and Home.tsx containers
- **Flexbox Optimization:** Sidebar uses `self-start` instead of `sticky` positioning
- **Content Flow:** Main content area maintains proper height constraints
- **Visual Balance:** Sidebar and content area have proper proportions

#### Matrix Theme Integration
- **CRT Green Glow:** Consistent use of `#70ab6c` and `#c8ffc8` colors
- **Backdrop Blur:** `backdrop-blur-md` for glassmorphism effects
- **Drop Shadows:** Text drop shadows for glowing effects
- **Border Effects:** Thick borders with glow for definition

#### Interactive States
- **Hover Effects:** Scale animation and enhanced glow on hover
- **Active States:** Different colors and glows for different states
- **Transition Smoothness:** 300ms duration for all animations
- **Visual Hierarchy:** Clear distinction between add and remove states

### 9. Popover Positioning System (2025 Update)

### 9. Expanded Card Header: Specificity War & Inline Style Solution (2024-07)

- **Problem:** The Tailwind Typography plugin (`prose`) applies high-specificity styles to all content within its scope, which can override even strong Tailwind utility classes (e.g., `text-3xl`). This caused the expanded card header (name and category) to render at the wrong size, regardless of utility class usage.
- **Failed Fixes:** Attempts to use `not-prose` wrappers, extra utility classes, or increased selector specificity failed due to the plugin's CSS strength.
- **Definitive Solution:** The name (`<h3>`) and category (`<p>`) in the expanded card view are rendered above the markdown and use inline `style` attributes for font size and line height. This guarantees correct appearance regardless of global or prose styles.
- **When to Use:** Only use inline styles for font size/line height as a last resort, when all other approaches (utility classes, not-prose, etc.) fail due to plugin or global CSS specificity. Document the rationale in the component and reference this section.
- **Reference:** See `ItemCard.tsx` (July 2024) for implementation and rationale.

This ensures the expanded card header is always visually prominent, accessible, and immune to future CSS/plugin changes.

## 10. Terminal-Style Search Bar: Font & Block Cursor (2025 Update)

- **Search System Reference:** The search bar is the entry point to the new client-side search/indexing system. For a full explanation of the search architecture, see `docs/search engine.md`. For debugging and troubleshooting, see `docs/troubleshooting.md`.
- **Font:** The search bar uses the custom Glass_TTY_VT220.ttf font, loaded via @font-face in custom.css and applied with the .font-tty-glass utility class. This gives the input a retro terminal/CRT look.
- **Font Sizing:** The input, overlay, and block cursor use a font size of 28px for enhanced readability while maintaining the same input container size.
- **Input Dimensions:** The search bar uses reduced vertical padding (`py-2` instead of `py-4`) for a more compact terminal aesthetic while preserving the larger 28px text size.
- **CRT Effects:** The search bar now features authentic CRT styling with:
  - **CRT Glow Text:** Applied via `crt-glow-text` utility class for subtle text shadowing
  - **CRT Border Glow:** Applied via `crt-glow-border` for authentic terminal border effects
  - **CRT Dithering:** Applied via `crt-dither` and `crt-text-dither` for realistic scan-line effects
  - **Removed Standard Glow:** The previous `shadow-[0_0_16px_2px_rgba(112,171,108,0.5)]` effect has been replaced with CRT-specific styling
- **Block Cursor:** A custom blinking block cursor is rendered as an absolutely positioned overlay, using Tailwind's animate-blink utility (defined in tailwind.config.js as a 1s steps(2, start) infinite animation). The block is a green rectangle (w-2 h-6 bg-green-400) that blinks in sync with the input focus.
- **Cursor Spacing:** The block cursor now has 4px spacing from the text end (via `marginLeft: '4px'`) instead of being flush, improving readability and visual separation.
- **Removed Clear Button:** The X/clear button has been completely removed for a cleaner, more authentic terminal appearance.
- **Spell Check Disabled:** The search input now has `spellCheck={false}` to prevent browser spell-check underlining, maintaining the clean terminal aesthetic and improving the experience when searching for character names.
- **Text Selection Styling:** Custom selection colors use CRT green background with black text for authentic terminal feel, replacing the default blue selection highlight.
- **Pixel-Perfect Alignment:** The overlay uses a hidden span (visibility: hidden, whitespace-pre) to measure the exact rendered width of the input value. The block cursor is placed after this span with proper spacing, inside a flex container absolutely positioned with left: 1.5rem (matching px-6 input padding).
- **Caret Hiding:** The native input caret is hidden (caret-color: transparent) so only the custom block cursor is visible, for full terminal authenticity.
- **Accessibility:** The input remains fully accessible and keyboard navigable. The overlay is pointer-events-none and select-none, so it does not interfere with user interaction or screen readers.
- **Customization:** Font size, block size, spacing, and CRT effects can be tweaked in SearchBar.tsx and custom.css. The CRT dithering patterns and glow effects are fully customizable through CSS variables.

This approach delivers a visually authentic, highly readable, and fully accessible terminal search bar with proper CRT aesthetics, including dithering, glow effects, improved cursor positioning, and authentic terminal interactions.

## 11. Custom Scrollbar Styling: CRT-Themed Scrollbars (2025 Update)

- **System Integration:** Custom scrollbar styling is applied globally and affects both the main UI scrolling and modal content scrolling.
- **Visual Design:** Scrollbars use a green gradient theme that matches the overall CRT aesthetic:
  - **Track:** Dark background (#0D1117) with rounded corners matching the application theme
  - **Thumb:** Linear gradient from CRT green (#70ab6c) to darker green (#4a7c59) with rounded corners
  - **Glow Effects:** CRT-style glow applied via box-shadow using CSS variables for consistent theming
  - **Dithering Pattern:** Subtle repeating linear gradients create authentic scan-line effects
- **Interactive States:** 
  - **Default:** Standard CRT green gradient with subtle glow
  - **Hover:** Brighter gradient (#7bb872 to #5a8f6b) with enhanced glow effects
- **Cross-Browser Support:** Uses `-webkit-scrollbar` selectors for Webkit-based browsers (Chrome, Safari, Edge)
- **Accessibility:** Maintains sufficient contrast and clear visual boundaries for users with visual impairments
- **Performance:** Uses CSS-only approach with hardware-accelerated effects (box-shadow, linear-gradient)
- **Customization:** All colors, gradients, and effects are controlled through CSS variables defined in `custom.css`:
  - `--crt-green`: Primary CRT green color
  - `--crt-green-glow`: CRT glow effect with appropriate opacity
- **Implementation Details:**
  - 12px width for comfortable interaction on both desktop and touch devices
  - 2px border from container background to create visual separation
  - Subtle inset highlights for depth and dimension
  - Consistent border-radius (6px) throughout all scrollbar elements

This creates a cohesive CRT terminal experience where even the scrolling elements contribute to the authentic retro computing aesthetic.

---

## Matrix Rain & Glassmorphism Effects (2025 Update)

### **Matrix Digital Rain Background**

The application now features an authentic Matrix-style digital rain effect implemented using HTML5 Canvas for optimal performance and visual fidelity.

#### **Implementation Details:**
- **Component:** `src/components/MatrixRain/MatrixRain.tsx`
- **Rendering:** HTML5 Canvas with a static grid and brightness waves
- **Characters:** Expanded glyph set with flipped and rotated variations
- **Performance:** Hardware-accelerated with `will-change: transform`

#### **Visual Characteristics:**
- **Leading Characters:** Bright white head followed by glowing green trail
- **Trail Characters:** Fade smoothly with column-based drop speeds
- **Background Fade:** Optimized `rgba(13, 17, 23, 0.1)` to prevent muddy accumulation
- **Column Spacing:** Auto-calculated based on screen width
- **Variable Speed:** Streams fall at different rates with random delays

#### **CSS Integration:**
```css
.matrix-rain-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  will-change: transform;
}
```

### **Glassmorphism Card Effects**

Character cards now feature glassmorphism effects that allow the Matrix rain to show through while maintaining readability.

#### **ThemedCard Glassmorphism:**
```css
.glassmorphism-card {
  background: rgba(22, 27, 34, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.glassmorphism-card:hover {
  background: rgba(22, 27, 34, 0.9);
  transform: scale(1.02);
  box-shadow: 
    0 0 20px rgba(112, 171, 108, 0.3),
    0 0 40px rgba(112, 171, 108, 0.2),
    0 0 80px rgba(112, 171, 108, 0.1);
}
```

#### **Matrix Glow Effects:**
- **Multi-Layer Shadows:** Three-tier glow effect with varying opacity and distance
- **CRT Green Theme:** Uses Matrix rain color palette (`#70ab6c`, `#c8ffc8`)
- **Animated Pulse:** Subtle background pulse animation on hover
- **Nation Border Enhancement:** Maintains nation-specific borders with Matrix green overlay

#### **Transparency Integration:**
- **EntityGrid:** Uses `bg-transparent` to allow rain to flow through gaps
- **Layout Background:** Transparent containers prevent rain obstruction
- **Card Backgrounds:** Semi-transparent with backdrop blur for depth

### **Matrix Card Hover Animation**

#### **Pulse Animation:**
```css
@keyframes matrix-pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.matrix-card-glow::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(112, 171, 108, 0.1) 50%, 
    transparent 70%);
  border-radius: inherit;
  animation: matrix-pulse 3s ease-in-out infinite;
  pointer-events: none;
}
```

#### **Hover State Enhancement:**
- **Gentle Scale:** 1.02x scale to maintain card dimensions
- **Progressive Glow:** Three-layer box-shadow with increasing radius
- **Background Enhancement:** Increased opacity on hover for better content visibility
- **Border Glow:** CRT green border enhancement while preserving nation colors

### **Performance Optimizations**

#### **Canvas Rendering:**
- **RequestAnimationFrame:** Smooth 30fps animation loop
- **Efficient Redraw:** Only redraws changed areas
- **Memory Management:** Proper cleanup on component unmount
- **Resize Handling:** Auto-recalculates on window resize

#### **CSS Performance:**
- **Hardware Acceleration:** `will-change: transform` on animated elements
- **Backdrop Filter:** GPU-accelerated blur effects
- **Transform3d:** Uses 3D transforms for better performance
- **Layer Creation:** Strategic use of `transform` to create compositing layers

### **Cross-Browser Compatibility**

#### **Backdrop Filter Support:**
```css
.glassmorphism-card {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); /* Safari support */
}

/* Fallback for browsers without backdrop-filter */
@supports not (backdrop-filter: blur(8px)) {
  .glassmorphism-card {
    background: rgba(22, 27, 34, 0.95);
  }
}
```

#### **Canvas API:**
- **Fallback Handling:** Graceful degradation if Canvas not supported
- **Event Listener Cleanup:** Proper memory management across browsers
- **Resize Debouncing:** Prevents excessive recalculations

### **Accessibility Considerations**

#### **Motion Sensitivity:**
- **Reduced Motion Support:** Respects `prefers-reduced-motion` user preference
- **Performance Throttling:** Automatically reduces frame rate on slower devices
- **Contrast Maintenance:** Ensures sufficient contrast for text readability

#### **Visual Accessibility:**
- **High Contrast Mode:** Glassmorphism effects maintain readability
- **Focus Indicators:** Clear focus states maintained through transparent backgrounds
- **Color Independence:** Effects don't rely solely on color for information

#### **Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .matrix-rain-canvas {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
  
  .matrix-card-glow::before {
    animation: none;
  }
}
```

## Matrix Rain Styling & Performance

### Canvas Styling
The Matrix Rain canvas uses the following CSS properties:
```css
position: fixed;
top: 0;
left: 0;
z-index: -1;
pointer-events: none;
opacity: modalOpen ? 0.5 : 1;
```

### Performance Optimizations
- **requestAnimationFrame:** Replaces `setInterval` for smoother animation
- **Frame Skipping:** 3x frame skip when modal is open to reduce CPU usage
- **Adaptive Opacity:** Reduces fade opacity from 0.2 to 0.15 when modal is open
- **Color Dimming:** Leading characters use dimmed color when modal is open
- **Trail Opacity:** Reduces trail opacity from 0.7 to 0.4 when modal is open
- **Canvas Opacity:** Reduces overall canvas opacity from 1 to 0.5 when modal is open

### Browser Compatibility
- Requires Canvas API support (Chrome 76+, Firefox 103+, Safari 9+)
- Hardware acceleration recommended for optimal performance
- Graceful fallback for older browsers (static background)
- Respects `prefers-reduced-motion` accessibility setting

## Perfect DOS Font Integration (January 2025 Update)

### Font Loading
The Perfect DOS font is loaded via `@font-face` in `src/styles/custom.css`:
```css
@font-face {
  font-family: 'Perfect DOS VGA 437';
  src: url('/assets/fonts/perfect_dos_vga_437/Perfect DOS VGA 437.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

### Application
- **Core Filter Buttons:** Applied via `font-perfect-dos` class for better readability
- **Subfilter Buttons:** Applied via `font-perfect-dos` class for consistency
- **Clear All Filters Button:** Applied via `font-perfect-dos` class for matching styling

### Benefits
- **Enhanced Readability:** Better legibility against complex Matrix Rain background
- **Retro Terminal Aesthetic:** Matches the authentic CRT/terminal theme
- **Consistent Typography:** Uniform font usage across filter components
- **Visual Hierarchy:** Clear distinction between different UI elements

### Color Coding System (January 2025 Update)

#### Core Filter Icons and Colors
- **Characters**: `FaUsers` icon with `text-blue-400` color
- **Foods**: `FaUtensils` icon with `text-orange-400` color
- **Locations**: `FaMapMarkerAlt` icon with `text-green-400` color
- **Groups**: `FaLayerGroup` icon with `text-purple-400` color
- **Fauna**: `FaPaw` icon with `text-yellow-400` color
- **Spirits**: `FaGhost` icon with `text-cyan-400` color

#### Character Subfilter Color Coding
- **Age Groups:**
  - Child: `text-yellow-300` (bright yellow for youth)
  - Teen: `text-blue-300` (blue for adolescence)
  - Young Adult: `text-green-300` (green for growth)
  - Adult: `text-purple-300` (purple for maturity)
  - Elder: `text-gray-300` (gray for wisdom)

- **Character Types:**
  - Heroes: `text-green-400` (green for good/heroic)
  - Villains: `text-red-400` (red for evil/antagonistic)
  - Mentors: `text-blue-400` (blue for wisdom/guidance)

- **Bending Status:**
  - Bender: `text-orange-400` (orange for fire/energy)
  - Nonbender: `text-gray-400` (gray for lack of bending)

### Nation Button Opacity Enhancement (January 2025 Update)

#### Changes Made
- **Removed**: `backdrop-blur-sm` (semi-transparent background)
- **Removed**: `opacity-80 hover:opacity-100` (transparency effects)
- **Added**: Solid `bg-black` background
- **Result**: 100% opaque buttons for maximum readability

#### Benefits
- **Maximum Readability**: No transparency allows for crisp, clear visibility
- **Better Contrast**: Solid black background provides strong contrast against the Matrix Rain
- **Consistent Styling**: Matches the opaque styling of other UI elements
- **Enhanced UX**: Nation symbols are now clearly visible and easy to interact with
- **Professional Look**: Clean, solid appearance without any visual noise

### Clear All Filters Button Styling (January 2025 Update)

#### Smart Visibility
- **Conditional Rendering**: Only appears when any filters are active
- **Logic**: `(activeNations.size > 0 || activeCoreFilter || activeSubFilters.size > 0)`
- **Clean UI**: Keeps interface uncluttered when not needed

#### Styling Consistency
- **Perfect DOS Font**: Matches filter button typography
- **Matrix Theme**: Consistent with overall CRT aesthetic
- **Hover Effects**: Same interactive feedback as other buttons
- **Positioning**: Centered between subfilters and search bar

#### Functionality
- **One-Click Reset**: Clears all filter states instantly
- **Immediate Feedback**: All filters reset with visual confirmation
- **Performance**: Uses `useCallback` for efficiency
- **State Management**: Integrated with `useFilterState` hook

## Image Handling & Fallbacks

### Image Fallback System
- **Component:** `src/components/ItemCard/imageFallbacks.ts`
- **Purpose:** Handles cases where image filenames don't match data slugs
- **Implementation:** Maps data slugs to actual image filenames
- **Example:** `'mung-bean-tofu-curry': 'mung-bean-&-tofu-curry.jpg'` handles ampersand in filename
- **Fallback Chain:** Primary image → Fallback mapping → Universal fallback → Text icon
- **Universal Fallback:** `404.jpg` for missing images
- **Special Cases:** Handles character name variations (e.g., `'toph-beifong': 'toph.jpg'`)

### Image Loading States
- **Loading:** Shows placeholder while image loads
- **Success:** Displays image with proper aspect ratio
- **Error:** Falls back to text initials or universal fallback
- **Responsive:** Images adapt to different screen sizes
- **Lazy Loading:** Images load on demand for better performance