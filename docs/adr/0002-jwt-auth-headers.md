# ADR-0002: JWT in Authorization header

**Status:** Accepted

## Context

The app needs to authenticate with a backend API. We need a single, consistent way to send the token and handle 401s without coupling the frontend to a specific backend.

## Decision

- Store JWT in memory/localStorage and send it on every request via the `Authorization: Bearer <token>` header.
- Use a centralized HTTP client with a request interceptor to attach the token and a response handler to clear it and dispatch an event on 401. AuthProvider listens and updates UI state.
- Optional: support cookie-based auth via `VITE_API_USE_CREDENTIALS` (no token in header; backend sets httpOnly cookie).

## Consequences

- All API calls go through one client; 401 handling is in one place.
- JWT payload is decoded client-side only for UI (e.g. user id, email); security is enforced by the backend.
- Cookie mode is available for teams that prefer httpOnly cookies.
