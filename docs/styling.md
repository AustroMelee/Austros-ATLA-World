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
-   **Card Content Scaling:** All internal card content (image, text, etc.) is scaled in `ItemCard` to match the card size for visual consistency.
-   **Card Name Wrapping:** Card names use `line-clamp-2` (multi-line clamping) for accessibility and to avoid hidden content. This requires the `@tailwindcss/line-clamp` plugin, which is enabled in `tailwind.config.js`.
-   **Grid Layout:** The card grid uses flexbox for layout, ensuring cards stretch to fill the row and maintain a consistent appearance.
-   **SRP:** All card styling and scaling should be handled in the relevant component (`EntityGrid` for layout/width, `ItemCard` for content), not globally.

### 5. Hiding/Unhiding UI Features (Filters & Collections)

-   **Convention:** To hide a UI feature (e.g., FilterSidebar, FilterPanel, CollectionsSidebar, CollectionsPanel), set the component to return `null` and add a comment at the top: "[Component] is hidden from the UI on user request. To re-enable, restore the original export."
-   **To Unhide:** Restore the original export and implementation in the component file.
-   **Canonical Toggle:** This is the canonical method for feature toggling in this project—no conditional rendering in parent components, no feature flags. All toggling is done at the component export level for clarity and maintainability.