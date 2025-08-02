# 🚀 Developer Onboarding Guide

## Welcome to Austros ATLA World!

This guide will help you get up to speed with the project architecture, development workflow, and core principles. Whether you're a seasoned developer or new to the team, this onboarding will ensure you understand the system's "Interstellar" level engineering.

---

## 🎯 Your First Day Checklist

### ✅ Environment Setup (15 minutes)
1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd AUSTROS-ATLA-WORLD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the data pipeline**
   ```bash
   npm run build:data
   ```

4. **Generate Tailwind CSS**
   ```bash
   npm run build:tailwind
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Verify everything works**
   - Open `http://localhost:5173` (or the port shown)
   - Search for "Aang" - should show character cards
   - Filter by "groups" - should show group cards
   - Try expanding a card - should show detailed view

### ✅ Code Quality Tools (5 minutes)
1. **Run linting**
   ```bash
   npm run lint
   ```

2. **Check TypeScript types**
   ```bash
   npm run type-check
   ```

3. **Verify data integrity**
   ```bash
   npm run validate:data
   ```

---

## 🎬 The 5-Minute Tour

### What This App Does
Austros ATLA World is a **lightweight encyclopedia** for Avatar: The Last Airbender built with React, TypeScript, and Vite. It features:

- **📚 Rich Content:** 60+ characters, 12 groups, locations, foods, and more
- **🔍 Instant Search:** Client-side FlexSearch with partial matching
- **🎨 Beautiful UI:** Matrix rain effects, CRT styling, responsive design
- **📱 Collections System:** User-curated collections with localStorage persistence
- **⚡ Performance:** Optimized rendering, debounced search, image fallbacks

### Key Features
- **Real-time search** with partial tag matching
- **Multi-layered filtering** by type, tags, and attributes
- **Expanded card views** with rich markdown content
- **Collection management** with drag-and-drop interface
- **Responsive design** that works on all devices
- **Type-safe development** with strict TypeScript

### Architecture Overview
```
raw-data/ (Markdown files)
    ↓
scripts/ (Data pipeline)
    ↓
enriched-data.json (Processed data)
    ↓
React App (UI components)
    ↓
User Interface
```

---

## 🧠 The Core Philosophy

### The "Non-Negotiable Rule"
This project operates under a **single, unbreakable principle**:

**Every source file must be imported somewhere in the codebase.**

This rule is enforced by automated checks and prevents:
- Dead code accumulation
- Orphaned files
- Unused dependencies
- Build bloat

### Template Standardization (January 2025 Update)
All entity types follow a **consistent template structure**:

- **Frontmatter:** `type: [category]` (standardized)
- **Title Format:** `# [Emoji] ULTIMATE [CATEGORY] METADATA SCHEMA (v[version])`
- **UI Card View:** `## 🖼️ UI - CARD VIEW` with `*(Presentation Layer 1 - Unchanged)*`
- **UI Expanded View:** `## 📖 UI - EXPANDED VIEW` with `*(Presentation Layer 2 - Unchanged)*`
- **Backend Metadata:** `## ⚙️ BACKEND METADATA` with description comment
- **Semantic Index:** `## 🧱 Semantic & Thematic Index` with description comment

**No exceptions or special cases are allowed.** All entity types must follow this exact structure.

---

## 🛠️ Development Workflow

### Making Changes
1. **Understand the change scope**
   - Is it UI, data, or both?
   - Does it require data pipeline changes?
   - Are new types or components needed?

2. **Follow the data flow**
   - Raw data → Parsing → Enrichment → UI
   - Update appropriate files in order
   - Run `npm run build:data` after data changes

3. **Test thoroughly**
   - Run `npm run lint` and `npm run type-check`
   - Test in browser with various scenarios
   - Verify data integrity with `npm run validate:data`

### Adding New Content
1. **Create markdown file** in appropriate `raw-data/` folder
2. **Follow standardized template structure** with required sections and comments
3. **Add image** to `public/assets/images/`
4. **Run data pipeline:** `npm run build:data`
5. **Test in UI** and verify display

### Adding New Features
1. **Plan the architecture** - which components/hooks are needed?
2. **Create components** following existing patterns
3. **Add types** to `src/types/domainTypes.ts` if needed
4. **Update documentation** to reflect changes
5. **Test thoroughly** and ensure no orphaned files

---

## 🎯 Common Tasks

### Adding a New Character
```bash
# 1. Create markdown file
touch raw-data/characters/new-character.md

# 2. Add content following standardized character template
# 3. Add image to public/assets/images/
# 4. Rebuild data
npm run build:data

# 5. Test in browser
npm run dev
```

### Adding a New Episode
```bash
# 1. Create markdown file
touch raw-data/episodes/new-episode.md

# 2. Add content following standardized episode template
# 3. Include image field in JSON metadata (CRITICAL)
# 4. Use S1Ex title prefix in JSON metadata (CRITICAL)
# 5. Rebuild data pipeline
npm run build:data

# 6. Restart development server
npm run dev

# 7. Verify episode appears in UI
```

### Adding a New Filter
```bash
# 1. Update filterConfig.ts
# 2. Update useFilters hook
# 3. Update FilterBar component
# 4. Test filtering behavior
npm run lint && npm run type-check
```

### Fixing a Bug
```bash
# 1. Reproduce the issue
# 2. Check browser console for errors
# 3. Review related documentation
# 4. Make targeted fix
# 5. Test thoroughly
npm run lint && npm run type-check
```

---

## 🚨 Troubleshooting

### Common Issues

**"Data not updating"**
- Run `npm run build:data` after data changes
- Check `public/enriched-data.json` for updates
- Clear browser cache and reload

**"TypeScript errors"**
- Run `npm run type-check` to see all errors
- Check `src/types/domainTypes.ts` for missing types
- Ensure all imports are correct

**"Linting errors"**
- Run `npm run lint` to see all issues
- Fix unused imports and formatting
- Check for orphaned files

**"Build failures"**
- Check `package.json` scripts
- Verify all dependencies are installed
- Review error messages for specific issues

**"Template standardization errors"**
- Ensure all templates follow consistent format
- Check for required sections and comments
- Verify standardized structure across all entity types

### Getting Help
1. **Check documentation first** - most answers are here
2. **Review troubleshooting guide** - `docs/troubleshooting.md`
3. **Check markdown checklist** - `docs/markdown-file-checklist.md`
4. **Review automation guide** - `docs/automation.md` 