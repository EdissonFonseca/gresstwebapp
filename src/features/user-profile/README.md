# User Profile

Feature: **user-profile**. One user-visible page or capability.

- **Route:** `/profile`

## Structure

| Folder | Contents |
|--------|----------|
| `components/` | ProfileCard.tsx, ProfileField.tsx, UserProfilePage.tsx |
| `hooks/` | useUserProfile.ts |
| `services/` | profileApi.ts |
| `types/` | — |
| `tests/` | ProfileCard.test.tsx, ProfileField.test.tsx, UserProfilePage.test.tsx, profileApi.test.ts, useUserProfile.test.tsx, user-profile.integration.test.tsx |

## Public API

Import from `@features/user-profile` (see `index.ts`). Do not import from internal paths.

## Contract

- **components/** — Presentational UI; data and callbacks via props
- **hooks/** — Data fetching, local state, side effects
- **services/** — API calls and business workflows
- **types/** — Feature-specific TypeScript types
- **tests/** — Unit and integration tests

See [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md).
