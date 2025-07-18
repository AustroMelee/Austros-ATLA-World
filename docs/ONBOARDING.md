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

> **"Every file must be connected unless it's documentation or tests"**

This means:
- ✅ All components are imported and used
- ✅ All hooks are consumed by components
- ✅ All utilities are called by other code
- ❌ No orphaned files floating in the codebase
- ❌ No dead code or unused imports

### Why This Matters
- **Maintainability:** Easy to understand what's actually used
- **Performance:** No unused code in the bundle
- **Clarity:** Clear dependency relationships
- **Quality:** Forces good architectural decisions

### How to Follow It
1. **Before committing:** Run `npm run lint` to catch unused imports
2. **When adding files:** Ensure they're imported somewhere
3. **When removing features:** Delete all related files
4. **When refactoring:** Update all import paths

---

## 📚 Required Reading (In Order)

### 1. Data Pipeline (`docs/data_pipeline.md`)
**Why read first:** Understanding how data flows is fundamental to everything else.

**Key concepts:**
- How markdown files become JSON data
- The enrichment process and tag normalization
- Template exclusion and validation rules
- The build process and error handling

**What you'll learn:**
- Raw data structure and YAML frontmatter
- Script execution order and dependencies
- Data validation and error reporting
- How to add new content types

### 2. Data Flow (`docs/data_flow.md`)
**Why read second:** See the visual flow diagrams and understand data movement.

**Key concepts:**
- Complete data journey from raw files to UI
- Hook dependencies and state management
- Performance optimizations and caching
- Component hierarchy and data consumption

**What you'll learn:**
- How search indexing works with FlexSearch
- Image loading and fallback strategies
- Collections state management with localStorage
- Component data flow patterns

### 3. Frontend Architecture (`docs/frontend_architecture.md`)
**Why read third:** Understand the React component structure and patterns.

**Key concepts:**
- Component hierarchy and responsibility separation
- Hook patterns and custom hook design
- TypeScript type safety and domain modeling
- Performance optimization strategies

**What you'll learn:**
- How to create new components following project patterns
- Hook composition and state management
- Type definitions and domain modeling
- Performance profiling and optimization

### 4. Styling (`docs/styling.md`)
**Why read fourth:** Master the visual design system and theming.

**Key concepts:**
- Tailwind CSS configuration and custom classes
- CRT screen effects and matrix rain styling
- Nation-based color theming
- Responsive design patterns

**What you'll learn:**
- How to style new components consistently
- Color palette and theming system
- Animation and visual effects
- Responsive design best practices

### 5. Source of Truth (`docs/source_of_truth.md`)
**Why read last:** Understand the project standards and non-negotiables.

**Key concepts:**
- Project rules and coding standards
- File organization and naming conventions
- Documentation requirements
- Quality gates and validation

**What you'll learn:**
- How to write code that meets project standards
- Documentation requirements and formats
- Testing and validation expectations
- Deployment and maintenance procedures

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
2. **Follow template structure** with YAML frontmatter
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

# 2. Add content following character template
# 3. Add image to public/assets/images/
# 4. Rebuild data
npm run build:data

# 5. Test in browser
npm run dev
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

### Getting Help
1. **Check documentation first** - most answers are here
2. **Review troubleshooting guide** - `docs/troubleshooting.md`
3. **Check recent changes** - what was modified recently?
4. **Ask specific questions** - include error messages and context

---

## 🎓 Next Steps

### After Onboarding
1. **Explore the codebase** - read through key components
2. **Make a small change** - add a test character or modify styling
3. **Review documentation** - ensure it's up to date
4. **Ask questions** - don't hesitate to seek clarification

### Advanced Topics
- **Performance optimization** - React.memo, useMemo, useCallback
- **Testing strategies** - unit tests, integration tests
- **Deployment** - build process and hosting
- **Data pipeline extensions** - adding new content types

### Resources
- **Project Rules:** `projectrules.mdc`
- **Character Index:** `docs/character-cards-index.md`
- **Group Index:** `docs/group-cards-index.md`
- **FAQ:** `docs/faq.md`

---

## 🏆 Success Metrics

You'll know you're successfully onboarded when you can:

- ✅ **Set up the environment** in under 15 minutes
- ✅ **Add new content** following the data pipeline
- ✅ **Create new components** following project patterns
- ✅ **Debug issues** using the troubleshooting guide
- ✅ **Follow the non-negotiable rule** consistently
- ✅ **Contribute to documentation** and keep it updated

---

*Welcome to the team! You're now ready to contribute to an "Interstellar" level codebase.* 🚀

*Last Updated: January 2025* 