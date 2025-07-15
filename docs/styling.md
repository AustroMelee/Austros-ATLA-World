## 🎨 Styling & UI Policy

### 1. CSS Source of Truth: Tailwind CSS (v3.4.3)

The project is pinned to `tailwindcss@3.4.3` due to a critical, unrecoverable environmental bug with the v4+ CLI installer on the primary development machine.

-   **Policy:** **Never upgrade `tailwindcss` above `3.4.3`** without first verifying, in a disposable clone, that the CLI binary (`tailwindcss.cmd`) appears in `node_modules/.bin` after a clean install.
-   **Usage:** All styling must be done with Tailwind CSS utility classes. Always use the local CLI for builds:
    ```powershell
    .\node_modules\.bin\tailwindcss.cmd -i ./src/styles/pure-tailwind.css -o ./src/styles/generated-tailwind.css
    ```
-   **Manual Build Required:** The build process is not automated. **You must manually run the command above** after any change to Tailwind config, theme, or class usage for your changes to appear in the UI.

### 2. UI/UX Rules

-   **Card Grid Hover:** **Always use Flexbox (`flex flex-wrap`) for card grids**, never CSS Grid. Grid layouts will clip hover effects like scaling and shadows. The grid container must have sufficient padding (e.g., `p-8`) to prevent edge clipping.
-   **Modal/Overlay Borders:** **Never apply `border`, `rounded-*`, or `shadow-*` styles to both a modal container and its child card.** Only the innermost component should have these "card-like" styles to prevent double borders or visual artifacts.
-   **Responsive Layouts:** Use `flex-wrap` for tag/pill groups. Use `flex-shrink-0`, `flex-1`, and `truncate` for list items to ensure they adapt gracefully.