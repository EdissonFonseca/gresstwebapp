# ADR-0001: Feature-driven folder structure

**Status:** Accepted

## Context

We need a clear way to organize React code so that each user-visible page or capability is self-contained, testable, and easy to find. We want to avoid logic in UI components and keep the app decoupled from the backend.

## Decision

- Organize app code under `src/features/`, `src/shared/`, and `src/core/`.
- Each **feature** is one folder (e.g. `home`, `user-profile`) and contains: `components/`, `hooks/`, `services/`, `types/`, `tests/`.
- One route (or main screen) maps to one feature. Features expose a single public API via `index.ts`.
- **shared/** holds reusable UI and utils with no business logic. **core/** holds config, auth, http, routing.

## Consequences

- New features follow a fixed contract; onboarding is simple.
- Feature READMEs can be generated from the folder structure.
- We rely on path aliases (`@features/*`, `@shared/*`, `@core/*`) and forbid business logic in presentational components.
