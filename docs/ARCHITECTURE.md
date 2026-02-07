# Feature-Driven Architecture

This document defines the base structure and rules for the project. All code must follow these conventions.

---

## 1. Directory layout

```
src/
├── core/          # Global config, auth, http, routing
├── shared/        # Reusable components and utilities (no business logic)
├── features/      # Complete functionalities; one feature per user-visible page (or capability)
└── test/          # Global test setup
```

---

## 2. `/features` — Complete functionalities

- **Purpose:** Each **user-visible page** (or self-contained capability) is implemented as a **single feature**.
- **Rule:** One route / one main screen ≈ one feature (e.g. home, login, dashboard, settings).
- **Content:** All UI, hooks, services, types, and tests for that functionality live inside the feature folder.

### Feature folder contract

Every feature **must** contain:

| Folder       | Purpose |
|-------------|---------|
| `components/` | UI components for the feature (presentational; data via props) |
| `hooks/`      | Feature-specific hooks (data fetching, local state, side effects) |
| `services/`   | API calls, external integrations, business workflows |
| `types/`      | TypeScript types and interfaces for the feature |
| `tests/`      | Unit and integration tests for the feature |

Optional: `utils/`, `constants/`, `api/` when needed. Avoid “god” files; split by responsibility.

### Public API

- Each feature exposes a **single public API** via `index.ts` (components, hooks, types).
- The rest of the app imports from `@features/<feature-name>` only through this index.

### Example

```
src/features/home/
  components/
    HomePage.tsx
    index.ts
  hooks/
    useHome.ts
    index.ts
  services/     # empty until needed
  types/
    index.ts
  tests/
    HomePage.test.tsx
  index.ts      # public API
```

---

## 3. `/shared` — Reusable building blocks (no business logic)

- **Purpose:** Components, utilities, and types used by **multiple features** or by **core**.
- **Rule:** No business/domain logic. No direct API calls or feature-specific rules.

### Typical contents

| Folder        | Purpose |
|---------------|---------|
| `components/` | Buttons, inputs, cards, layout primitives (presentational only) |
| `utils/`      | Pure helpers (formatting, validation, etc.) |
| `types/`      | Shared TypeScript types |
| `constants/`  | App-wide constants |

Feature-specific types and components stay inside the feature.

---

## 4. `/core` — Global configuration, auth, http, routing

- **Purpose:** Application-wide infrastructure and cross-cutting concerns.
- **Rule:** No feature-specific UI or business rules. Only config, auth, HTTP client, and routing.

### Typical contents

| Area       | Purpose |
|-----------|---------|
| **config**  | Environment, feature flags, app-wide settings |
| **auth**    | Auth context, provider, session state, guards |
| **http**    | API client, base URL, interceptors, error handling |
| **routing** | Route definitions and router setup (paths map to features) |

Routes should map to features (e.g. `/` → home feature, `/login` → auth feature).

---

## 5. Page–feature mapping

- **Rule:** Every **page visible to the user** (route/screen) is implemented by **one feature**.
- Add a new feature under `src/features/<name>` and register its route in `core/routing`.
- Keep all page-specific UI, data, and logic inside that feature; use `shared` and `core` as above.

---

## 6. Summary

| Layer     | Contains |
|----------|----------|
| **features** | Full functionality per page/capability; components, hooks, services, types, tests |
| **shared**   | Reusable UI and utils; no business logic |
| **core**     | Config, auth, http, routing only |

- **No business logic in UI components** — use hooks and services.
- **Strict TypeScript** — no `any`.
- **Composition over inheritance.**
- **No “god” files** — one clear responsibility per file.
- **New features must include tests.**

These rules are also reflected in `.cursor/rules/project-architecture.mdc` for AI-assisted development.
