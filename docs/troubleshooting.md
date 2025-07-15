## 🩺 Troubleshooting & Lessons Learned

-   **Problem: My data file is being skipped.**
    *   **Cause 1 (Most Common):** The file is saved with a **UTF-8 BOM**. Re-save it as plain "UTF-8".
    *   **Cause 2:** The file is **missing the `---` YAML frontmatter block with a `type` field** at the very top.
    *   **Cause 3:** The file is **missing a ` ```json ` block** with the required `id` and `slug` fields.
    *   **Cause 4 (Characters Only):** The file is missing the exact `## UI - CARD VIEW` or `## UI - EXPANDED VIEW` headers.

-   **Problem: A character card's expanded info is missing in the UI.**
    *   **Cause:** The `expandedView` field for that character is missing or empty in the final `enriched-data.json`.
    *   **How to check:**
        1. Open `public/enriched-data.json` and search for the character's `id` or `slug`.
        2. Check if the `expandedView` field is present and contains content.
    *   **Solution:**
        1. Open the source markdown file (e.g., `raw-data/characters/[character].md`).
        2. Ensure it contains a properly formatted `## UI - EXPANDED VIEW` section with a fenced markdown block.
        3. Save the file as UTF-8 (no BOM).
        4. Run `npm run build:data` to regenerate the enriched data.
        5. Hard refresh the UI to see the update.

-   **Problem: The data pipeline fails unexpectedly.**
    *   **Cause:** The version of Node.js being used may have unstable or experimental features. The original `fs.readdir({ recursive: true })` call was unreliable for this reason.
    *   **Solution:** The pipeline now uses a robust, custom recursive file walker that is compatible with all modern Node.js versions.

-   **Problem: A linter error appears in a `.mjs` script.**
    *   **Cause:** The root `tsconfig.json` is configured for the `src` directory.
    *   **Solution:** The project now has a dedicated `tsconfig.node.json` for all scripts, which resolves tooling conflicts correctly. **Do not ignore these linter errors.**

-   **Problem: Vite fails to resolve a local import (e.g., "Failed to resolve import '../theme/nationThemes'") even though the file exists and all paths are correct.**
    *   **Cause:** This is a known Vite/Windows bug, especially in projects with long paths or spaces. The Vite dev server's resolver can fail to recognize valid TypeScript files due to path ambiguity or cache issues.
    *   **Solution (CRITICAL):**
        1. Open `vite.config.ts` and ensure the following alias is present in the `defineConfig` block:
            ```ts
            import path from 'path';
            // ...
            resolve: {
              alias: {
                '@': path.resolve(__dirname, './src'),
              },
            },
            ```
        2. Update all imports of local files to use the `@` alias and include the `.ts` extension. For example:
            ```ts
            // Instead of:
            import { nationThemeMap } from '../theme/nationThemes';
            // Use:
            import { nationThemeMap } from '@/theme/nationThemes.ts';
            ```
        3. Restart the Vite dev server. The import error will be resolved, as the alias gives Vite a direct, unambiguous path from the project root.
        4. After resolving, always run:
            ```bash
            npm run lint
            npx tsc --noEmit
            ```
            to verify the project is clean and error-free.