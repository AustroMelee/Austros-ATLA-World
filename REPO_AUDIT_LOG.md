# Repository Audit Log

## Documentation Cleanup

- Removed duplicate docs: `docs/data_flow.md`, `docs/data_pipeline.md`, and `docs/frontend architecture.md`.
- Added feature list to `README.md` and removed shell prompt artifacts across docs.

## SRP Refactors

- Extracted filter configuration from `FilterBar.tsx` into new `filterConstants.tsx` for cleaner separation of concerns.

## Testing & Type Checking

- `npm run type-check` passes.
- `npm run lint` and `npm test` fail due to missing `semver/index.js` in this environment.

## Files Touched

- `README.md`
- `docs/ONBOARDING.md`
- `docs/frontend_architecture.md`
- `docs/styling.md`
- `docs/data_flow.md` (removed)
- `docs/data_pipeline.md` (removed)
- `docs/frontend architecture.md` (removed)
- `src/components/Filters/FilterBar.tsx`
- `src/components/Filters/filterConstants.tsx` (new)
- `REPO_AUDIT_LOG.md` (new)
