# API integration

All backend calls are **browser-side** and **decoupled** from any legacy backend. Configuration is via environment variables only.

## Configuration

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL for the API (e.g. `https://qa.api.gresst.com`). No trailing slash. |
| `VITE_API_USE_CREDENTIALS` | Set to `"true"` to send cookies with every request. **Required** when the token is in an HttpOnly cookie (e.g. `gresst_access_token`). The backend must then read the token from the Cookie header. |
| `VITE_DEV_BEARER_TOKEN` | **Dev only.** Bearer token for local testing when the server normally uses HttpOnly cookie. See below. |

Copy `.env.example` to `.env` and set these for local development.

## Authentication (JWT)

- **Token in headers (default):** After login, store the JWT with `setToken(token)` from `useAuthContext()`. The token is persisted in `localStorage` and sent on every request via the `Authorization: Bearer <token>` header.
- **Token in cookies (production):** If the backend sets an httpOnly cookie, set `VITE_API_USE_CREDENTIALS=true`. The client will send `credentials: 'include'`; the cookie is sent automatically and no token is stored in the app.

- **Token in HttpOnly cookie (e.g. `gresst_access_token` set by another app):** JavaScript cannot read HttpOnly cookies. Do the following:
  1. **Frontend:** Set `VITE_API_USE_CREDENTIALS=true` in `.env` (or in the build env for the deployed app). The HTTP client will then call `fetch(..., { credentials: 'include' })`, so the browser sends the cookie with every request to the API.
  2. **Backend:** The API must accept the token from the **Cookie** header. When it does not receive `Authorization: Bearer <token>`, it should read the cookie named `gresst_access_token` (or the name you use) from the request and treat that value as the Bearer token for authentication. No change is needed in the frontend beyond `VITE_API_USE_CREDENTIALS=true`.
  3. **Same origin or CORS:** The cookie is only sent if the request is same-origin or the API allows credentials (CORS `Access-Control-Allow-Credentials: true` and a specific `Access-Control-Allow-Origin`, not `*`). If you use the dev proxy so the app and API share the same origin in the browser, the cookie is sent automatically.

- **Testing when the server uses HttpOnly cookie:** From localhost you cannot read that cookie. To call QA (e.g. `https://qa.api.gresst.com`) with a Bearer token:
  1. Get a token (e.g. log in via **Swagger UI** at the API base URL and copy the token from the response or from the “Authorize” dialog).
  2. In `.env` set `VITE_DEV_BEARER_TOKEN=<paste the token>` (no `Bearer ` prefix). Do **not** commit `.env`.
  3. Run `npm run dev`. The interceptor will send `Authorization: Bearer <token>` on every request. If you also log in via the app and call `setToken()`, the value in localStorage takes precedence.

- **CORS (localhost blocked):** If the API does not allow `http://localhost:5173`, the browser blocks requests. Use the **dev proxy**: in `.env` set `VITE_API_BASE_URL=` (empty) and `VITE_PROXY_API_TARGET=https://qa.api.gresst.com`. The app then sends requests to the same origin (localhost), and Vite proxies `/api/*` to that target so the browser never talks to the API directly and CORS does not apply.

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

const data = await get<Profile>('/api/me/profile');
await post('/api/logout', {});
```

All requests use the same base URL, interceptors, and error handling. No direct coupling to a legacy backend.

## Development mock (profile)

When running `npm run dev` **without** a real backend, the profile page would get HTML or 404 from the dev server. To avoid that, the Vite dev server includes a **mock** so you can see the profile UI with sample data.

- **What it does:** Any `GET /api/me/profile` request to the dev server (same origin, so when `VITE_API_BASE_URL` is unset or points to the same host) is intercepted and answered with JSON from `scripts/mocks/profile.json`.
- **Where the data lives:** `scripts/mocks/profile.json`. Edit that file to change the mock user. The shape must match the profile API response (id, accountId, firstName, lastName, name, email, status, isActive, personId, lastAccess, createdAt).
- **When it applies:** Only in development (`vite` dev server). The mock is **not** included in the production build; in production the app always calls the real API.
- **Using a real API in dev:** Set `VITE_API_BASE_URL` to your backend (e.g. `https://api.example.com`). Then the app will request that host and the Vite mock is not used.
