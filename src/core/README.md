# Core

Global configuration, auth, HTTP client, and routing. **No feature-specific UI or business logic.** All API calls are browser-side and decoupled from the backend.

- **config/** — App-wide configuration and env
- **auth/** — Session auth: context, provider, token storage (optional), cookie mode. Unified entry: on load we probe session with `GET /api/me` (credentials: include). No cookie read in the app; APIs are told via credentials. `useAuthContext()` for `status`, `user`, `setToken`, `logout`. Listens to `auth:unauthorized` when session cannot be restored.
- **http/** — Centralized fetch client: `get`, `post`, `put`, `del`, `request`. All requests use credentials when configured. 401 → try refresh-token (POST, credentials), then retry request once; if still 401 → clear token + `auth:unauthorized`. Base URL from `VITE_API_BASE_URL`. Refresh endpoint: `VITE_REFRESH_ENDPOINT` or `/api/v1/authentication/refresh`.
- **routing/** — `ROUTES`, `AppRouter`, 404 page. Each route maps to a feature.

See [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) and [docs/API-INTEGRATION.md](../../docs/API-INTEGRATION.md).
