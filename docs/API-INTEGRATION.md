# API integration

All backend calls are **browser-side** and **decoupled** from any legacy backend. Configuration is via environment variables only.

## Configuration

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for the API (e.g. `https://api.example.com`). No trailing slash. |
| `VITE_API_USE_CREDENTIALS` | Set to `"true"` to send cookies with requests (e.g. httpOnly cookie auth). |

Copy `.env.example` to `.env` and set these for local development.

## Authentication (JWT)

- **Token in headers (default):** After login, store the JWT with `setToken(token)` from `useAuthContext()`. The token is persisted in `localStorage` and sent on every request via the `Authorization: Bearer <token>` header.
- **Token in cookies:** If the backend sets an httpOnly cookie, set `VITE_API_USE_CREDENTIALS=true`. The client will send `credentials: 'include'`; no token is stored in the app.

## Request flow

1. **Request interceptor** (in `core/http/interceptors.ts`): Adds `Authorization: Bearer <token>` when a token exists in storage, and `Content-Type: application/json` when not set.
2. **Fetch** is called with the configured base URL and options (browser `fetch` only).
3. **Response:** If `!res.ok`, the response is handled by the centralized error layer.

## Centralized error handling

- **401 Unauthorized:** Token is cleared from storage and the event `auth:unauthorized` is dispatched. `AuthProvider` listens and updates state (logout). No coupling to legacy backend.
- **Other 4xx/5xx:** An `HttpError` is thrown (with `status`, `statusText`, `body`, optional `code` from JSON body). Callers can catch it. Optionally, register a global handler with `setGlobalErrorHandler(handler)` from `@core/http` (e.g. to show toasts or log to a service).

## JWT payload (UI only)

The app decodes the JWT payload (without verification) only to show user info (e.g. `sub` → id, `email`). Security is enforced by the backend; the frontend never trusts the token for access control.

## Usage in features

Use the HTTP client from feature services or hooks:

```ts
import { get, post } from '@core/http';

const data = await get<Profile>('/api/profile');
await post('/api/logout', {});
```

All requests use the same base URL, interceptors, and error handling. No direct coupling to a legacy backend.

## Development mock (profile)

When running `npm run dev` **without** a real backend, the profile page would get HTML or 404 from the dev server. To avoid that, the Vite dev server includes a **mock** so you can see the profile UI with sample data.

- **What it does:** Any `GET /api/profile` request to the dev server (same origin, so when `VITE_API_BASE_URL` is unset or points to the same host) is intercepted and answered with JSON from `scripts/mocks/profile.json`.
- **Where the data lives:** `scripts/mocks/profile.json`. Edit that file to change the mock user (id, email, displayName, avatarUrl, createdAt). The shape must match the `UserProfile` type used by the app.
- **When it applies:** Only in development (`vite` dev server). The mock is **not** included in the production build; in production the app always calls the real API.
- **Using a real API in dev:** Set `VITE_API_BASE_URL` to your backend (e.g. `https://api.example.com`). Then the app will request that host and the Vite mock is not used.
