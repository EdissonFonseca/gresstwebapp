# Home

Feature: **home**. One user-visible page or capability.

- **Route:** `/`

## Structure

| Folder | Contents |
|--------|----------|
| `components/` | HomePage.tsx |
| `hooks/` | useHome.ts |
| `services/` | — |
| `types/` | — |
| `tests/` | HomePage.test.tsx |

## Public API

Import from `@features/home` (see `index.ts`). Do not import from internal paths.

## Contract

- **components/** — Presentational UI; data and callbacks via props
- **hooks/** — Data fetching, local state, side effects
- **services/** — API calls and business workflows
- **types/** — Feature-specific TypeScript types
- **tests/** — Unit and integration tests

See [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md).
