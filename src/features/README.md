# Features

Each **user-visible page** (or self-contained capability) is implemented as **one feature** in this folder.

## Adding a new feature (recommended: use template)

From project root: **`npm run feature:new <feature-name> [route]`** (e.g. `npm run feature:new order-detail /orders/:id`). This creates the full structure, tests, and a WebForms migration checklist. Then add the route in `@core/routing`, export in `src/features/index.ts`, run `npm run docs:generate`. See [docs/MIGRATION-WEBFORMS.md](../../docs/MIGRATION-WEBFORMS.md).

## Adding a feature manually

1. Create a folder: `src/features/<feature-name>/`
2. Add the required subfolders: `components/`, `hooks/`, `services/`, `types/`, `tests/`
3. Implement the feature and expose its public API in `index.ts`
4. Register the route in `@core/routing` and wire the page in the app/router
5. Add tests in the feature’s `tests/` folder

## Feature contract

- **components/** — Presentational UI only; data and callbacks via props
- **hooks/** — Data fetching, local state, side effects
- **services/** — API calls and business workflows
- **types/** — Feature-specific TypeScript types
- **tests/** — Unit and integration tests

See [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for full rules.
