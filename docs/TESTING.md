# Testing strategy

This project uses **Vitest** and **Testing Library** for unit, hook, service, and integration tests. Minimum coverage is configurable via environment variables.

---

## 1. Test levels

### Component tests

- **Location:** Colocated in each feature’s `tests/` folder (e.g. `UserProfilePage.test.tsx`).
- **Scope:** Presentational components only. Pass data and callbacks via props; do not test business logic.
- **Tools:** `@testing-library/react` (`render`, `screen`, `userEvent`), `@testing-library/jest-dom` for matchers.
- **Guidelines:**
  - Test visible behavior: headings, labels, buttons, links, error messages.
  - Use `getByRole`, `getByLabelText`, `getByText`; avoid `getByTestId` unless necessary.
  - Test user interactions (click, type) and assert on side effects (e.g. callbacks, navigation).
  - Mock feature services/hooks when testing a component in isolation.

### Hook tests

- **Location:** Feature `tests/` (e.g. `useUserProfile.test.tsx`).
- **Scope:** Custom hooks that manage state or call services. Assert on returned values and state transitions.
- **Tools:** `@testing-library/react` `renderHook`, `waitFor`. Mock the hook’s dependencies (e.g. API service).
- **Guidelines:**
  - Mock services with `vi.mock('path/to/service')`.
  - Test loading → success, loading → error, and retry/refetch behavior.
  - Assert that dependencies are called with expected arguments and frequency.

### Service tests

- **Location:** Feature `tests/` (e.g. `profileApi.test.ts`).
- **Scope:** API/service functions that use `@core/http`. Mock the HTTP client.
- **Tools:** `vi.mock('@core/http')`, then assert on `get`/`post` calls and return values or thrown errors.
- **Guidelines:**
  - Mock `@core/http` (e.g. `get`, `post`) and resolve/reject as needed.
  - Test success path (correct endpoint, method, and response mapping).
  - Test error path (propagated errors, status handling if applicable).

### Integration tests

- **Location:** Feature `tests/` (e.g. `user-profile.integration.test.tsx`).
- **Scope:** Full flow: route + layout + feature hook + page. Mock only the API/service at the boundary.
- **Tools:** `MemoryRouter`, `Routes`, `Route`, providers (`AuthProvider`), `waitFor`, `userEvent`.
- **Guidelines:**
  - Render the minimal route tree that includes the feature (avoid testing the whole app router).
  - Mock the feature’s service so no real HTTP is called.
  - Assert on loading state, final content, and user actions (e.g. retry).

### Test utilities

- **`src/test/utils.tsx`** — `renderWithProviders(ui, { initialEntries? })` wraps the tree with `AuthProvider` and `MemoryRouter`. Use for feature tests that need auth or routing without repeating setup.
- **`src/test/setup.ts`** — Global setup (e.g. `@testing-library/jest-dom`). Do not put test logic here.

---

## 2. Configurable minimum coverage

Coverage thresholds are applied when running tests with coverage (e.g. `npm run test:coverage`). Defaults are **70%** for lines, functions, branches, and statements. Override via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `COVERAGE_LINES` | Minimum line coverage (%) | `70` |
| `COVERAGE_FUNCTIONS` | Minimum function coverage (%) | `70` |
| `COVERAGE_BRANCHES` | Minimum branch coverage (%) | `70` |
| `COVERAGE_STATEMENTS` | Minimum statement coverage (%) | `70` |

**Examples:**

```bash
# Use defaults (70%)
npm run test:coverage

# Stricter (80% everywhere)
COVERAGE_LINES=80 COVERAGE_FUNCTIONS=80 COVERAGE_BRANCHES=80 COVERAGE_STATEMENTS=80 npm run test:coverage

# Relaxed (50%)
COVERAGE_LINES=50 npm run test:coverage
```

Excluded from coverage: `node_modules/`, `src/test/`, `**/*.d.ts`, `**/*.config.*`, barrel `index.ts`, and route definition files.

**Scripts:**

- `npm run test` — watch mode
- `npm run test:run` — single run, no coverage
- `npm run test:coverage` — single run with coverage and thresholds (env-configurable)
- `npm run test:coverage:strict` — same with 80% thresholds

---

## 3. Feature quality bar (user-profile as reference)

Each feature should have:

- **Components:** At least one test per presentational component (page + any reusable pieces in the feature).
- **Hooks:** Tests for initial state, success path, error path, and retry/refetch if applicable.
- **Services:** Tests for the main API function(s): success and error propagation.
- **Integration:** At least one test that loads the feature via route and asserts on loading → content and, if relevant, error → retry.

Running `npm run test:coverage` (with optional env) should meet the configured thresholds; **user-profile** is the reference feature that meets this bar.

**Checklist per feature (see `src/features/user-profile/tests/`):**

- [ ] Component tests: every presentational component has at least one test (props, states, accessibility where relevant).
- [ ] Hook tests: initial/loading/success/error and retry; stable callback references if applicable.
- [ ] Service tests: success path (endpoint, method, response) and error propagation; mock `@core/http`.
- [ ] At least one integration test: route + layout + feature flow with mocked service.
- [ ] Coverage meets project thresholds (default or env-configured).
