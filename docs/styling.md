## 🎨 Styling & UI Policy

### 1. CSS Source of Truth: Tailwind CSS (v3.4.3)

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

### 4. Card Styling & Scaling

-   **Card Width:** Card width is set in `EntityGrid` (currently `w-[188px]`).
    -   **Source of Truth:** To change the card size globally, update the `w-[188px]` value in `src/components/EntityGrid/EntityGrid.tsx`. All card content is sized relative to this width.
-   **Card Content Scaling:** All internal card content (image, text, etc.) is scaled in `ItemCard` to match the card size for visual consistency.
-   **Card Name Wrapping:** Card names use `line-clamp-2` (multi-line clamping) for accessibility and to avoid hidden content. This requires the `@tailwindcss/line-clamp` plugin, which is enabled in `tailwind.config.js`.
-   **Grid Layout:** The card grid uses flexbox for layout, ensuring cards stretch to fill the row and maintain a consistent appearance.
-   **SRP:** All card styling and scaling should be handled in the relevant component (`EntityGrid` for layout/width, `ItemCard` for content), not globally.
-   **Nation Colors:** Card border and background glow are themed by nation. The nation color is determined by the `nationThemeMap` in `src/theme/nationThemes.ts`, and applied via the `ThemedCard` component. To change or add a nation color, update `nationThemeMap`—all cards for that nation will update automatically. If a nation is missing, a neutral default color is used.
-   **Card Text Formatting:** Card text is beautifully formatted due to the use of the Tailwind Typography plugin (`prose` classes), which is enabled and customized in `tailwind.config.js` for the project's dark theme. The expanded card content uses a `prose`-styled div, and the `CustomMarkdownRenderer` component (with `react-markdown` and custom React components) further enhances markdown rendering for headings, lists, and emphasis. This combination ensures all card text is visually appealing, readable, and consistent.

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

### 8. Card Information Requirements: Titles, Categories, and Badges (2024-07)

**Every card must display all three of the following, without exception:**

- **Title (Name):**
  - The character’s (or entity’s) name is always shown at the top of the card, styled for prominence and accessibility.
  - If a NationIcon is present, it appears next to the name.

- **Category:**
  - The category (e.g., "Character", "Location", "Fauna") is always shown as plain text directly below the name.
  - This is never omitted, never shown as a badge, and never duplicated in the badge.
  - The category is derived from the entity type (for characters, always "Character").

- **Badge (Role):**
  - If the entity has a specific role/title (e.g., "NWT Chief", "Avatar"), a badge is shown floating at the bottom-right of the image area.
  - If there is no specific role/title, the badge is omitted (do not show a generic fallback like "Character" in the badge).
  - The badge must use the high-contrast, pill style described above for readability and visual hierarchy.

**Non-Negotiable:**
- All three elements (title, category, badge-if-present) are required for every card. Cards missing any of these are considered incomplete and must be fixed before release.
- Never duplicate information between the badge and the category text.
- The information hierarchy is: Name (with icon) → Category → Badge (if present) → Details.

**Rationale:**
- This ensures every card is instantly scannable, visually consistent, and accessible, regardless of content or background image.

**Reference:**
- See section 7 for badge styling and placement details.

These conventions ensure cards are visually clean, accessible, and maintain a clear information hierarchy, regardless of content or background image.

### 9. Expanded Card Header: Specificity War & Inline Style Solution (2024-07)

- **Problem:** The Tailwind Typography plugin (`prose`) applies high-specificity styles to all content within its scope, which can override even strong Tailwind utility classes (e.g., `text-3xl`). This caused the expanded card header (name and category) to render at the wrong size, regardless of utility class usage.
- **Failed Fixes:** Attempts to use `not-prose` wrappers, extra utility classes, or increased selector specificity failed due to the plugin's CSS strength.
- **Definitive Solution:** The name (`<h3>`) and category (`<p>`) in the expanded card view are rendered above the markdown and use inline `style` attributes for font size and line height. This guarantees correct appearance regardless of global or prose styles.
- **When to Use:** Only use inline styles for font size/line height as a last resort, when all other approaches (utility classes, not-prose, etc.) fail due to plugin or global CSS specificity. Document the rationale in the component and reference this section.
- **Reference:** See `ItemCard.tsx` (July 2024) for implementation and rationale.

This ensures the expanded card header is always visually prominent, accessible, and immune to future CSS/plugin changes.