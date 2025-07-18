# Codex Configuration for Austros ATLA World

## Container Image
- **Selection:** `universal` (Ubuntu 24.04 based)
- **Repository Path:** `/workspace/Austros-ATLA-World`

## Environment Variables
```
NODE_ENV=development
VITE_APP_TITLE=Austros ATLA World
```

## Setup Script
```bash
# Install Node.js dependencies
npm install

# Install TypeScript globally (if needed)
npm install -g typescript

# Build the data pipeline
npm run build:data

# Run linting and type checking
npm run lint:fix
npx tsc --noEmit

# Start development server (optional - for testing)
# npm run dev
```

## Project-Specific Configuration

### Why This Configuration Works

1. **Universal Container:** Provides Ubuntu 24.04 with common development tools
2. **Node.js Focus:** Your project is React/TypeScript with npm dependencies
3. **Data Pipeline:** The `build:data` script is crucial for your markdown-to-JSON pipeline
4. **TypeScript Strict:** Ensures type safety with `tsc --noEmit`
5. **Linting:** Maintains code quality with ESLint

### Key Scripts in package.json
- `npm run dev` - Development server
- `npm run build:data` - Data pipeline (validate → enrich → build index)
- `npm run lint:fix` - Code linting
- `npx tsc --noEmit` - TypeScript type checking

### File Structure Recognition
- **Source:** `src/` - React/TypeScript components
- **Data:** `raw-data/` → `public/enriched-data.json`
- **Scripts:** `scripts/` - Data processing pipeline
- **Docs:** `docs/` - Project documentation

### Development Workflow
1. Code changes in `src/`
2. Data changes in `raw-data/`
3. Run `npm run build:data` to update enriched data
4. Test with `npm run dev`
5. Validate with linting and type checking

This configuration ensures Codex can properly understand and work with your Avatar-themed encyclopedia project structure. 