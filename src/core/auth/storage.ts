/**
 * JWT token storage for Authorization header. Browser-side only.
 * - Token is sent via request interceptor (Authorization: Bearer <token>).
 * - For cookie-based auth: set VITE_API_USE_CREDENTIALS=true and have backend set httpOnly cookie;
 *   this storage is unused and no header is sent for auth (credentials: 'include' only).
 */

const TOKEN_KEY = 'app_jwt';

/** After logout we stop using VITE_DEV_BEARER_TOKEN until the user logs in again. */
let logoutRequested = false;

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    logoutRequested = false;
  } catch {
    // Storage full or unavailable
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    logoutRequested = true;
  } catch {
    // ignore
  }
}

export function isLogoutRequested(): boolean {
  return logoutRequested;
}
