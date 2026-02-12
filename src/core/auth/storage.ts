/**
 * JWT token storage. Browser-side only.
 * - When VITE_API_USE_CREDENTIALS is false: token in localStorage is sent (Authorization header).
 * - When VITE_API_USE_CREDENTIALS is true (cookie auth): we do not read or write token here.
 *   The app never stores the token; APIs set cookies and the browser sends them with credentials: 'include'.
 */

const TOKEN_KEY = 'app_jwt';

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
  } catch {
    // Storage full or unavailable
  }
}

export function clearStoredToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
}
