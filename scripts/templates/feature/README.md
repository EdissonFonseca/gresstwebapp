# __FEATURE_TITLE__

Feature: **__FEATURE_NAME__**. One user-visible page or capability.

- **Route:** `__FEATURE_ROUTE__`

## Structure

| Folder | Contents |
|--------|----------|
| `components/` | __FEATURE_PASCAL__Page.tsx |
| `hooks/` | use__FEATURE_PASCAL__.ts |
| `services/` | featureApi.ts |
| `types/` | index.ts |
| `tests/` | __FEATURE_PASCAL__Page.test.tsx, use__FEATURE_PASCAL__.test.tsx, featureApi.test.ts |

## Public API

Import from `@features/__FEATURE_NAME__` (see `index.ts`). Do not import from internal paths.

## Contract

- **components/** — Presentational UI; data and callbacks via props
- **hooks/** — Data fetching, local state, side effects
- **services/** — API calls and business workflows
- **types/** — Feature-specific TypeScript types
- **tests/** — Unit and integration tests

## Migrating from WebForms

If this feature replaces a WebForms page:

1. **One .aspx page = one feature** — This folder is the migration target for one page.
2. **Code-behind logic** → Move to `hooks/` (state, load data) and `services/` (API calls, server calls).
3. **Markup / UI** → Rebuild in `components/` as React components; keep them presentational (props only).
4. **Events (click, submit)** → Handlers in hooks, passed as props to components.
5. **Session/ViewState** → Replace with React state in hooks or context; server state via services.
6. **URL/Query string** → Use route params or search params in the hook; route is `__FEATURE_ROUTE__`.

See [docs/MIGRATION-WEBFORMS.md](../../../docs/MIGRATION-WEBFORMS.md) for the full checklist.
