# Core

Global configuration, auth, HTTP client, and routing. **No feature-specific UI or business logic.** All API calls are browser-side and decoupled from the backend.

- **config/** — App-wide configuration and env
- **auth/** — JWT auth: context, provider, token storage (headers), optional cookie mode. `useAuthContext()` for `token`, `setToken`, `logout`. JWT payload decoded for UI only (no verification). Listens to `auth:unauthorized` on 401.
- **http/** — Centralized fetch client: `get`, `post`, `put`, `del`, `request`. Request interceptor adds `Authorization: Bearer <token>`. 401 → clear token + dispatch event; optional `setGlobalErrorHandler()` for other errors. Base URL from `VITE_API_BASE_URL`.
- **routing/** — `ROUTES`, `AppRouter`, 404 page. Each route maps to a feature.

See [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) and [docs/API-INTEGRATION.md](../../docs/API-INTEGRATION.md).
