/**
 * Refresh token / session. Called when a request returns 401 so the app can try to
 * restore the session (e.g. refresh cookie) and retry. Uses credentials: 'include'
 * so the browser sends the refresh cookie; does not use Authorization header.
 */

import { buildApiUrl, getUseCredentials } from '@core/http/config';

const DEFAULT_REFRESH_PATH = '/api/v1/authentication/refresh';

export function getRefreshPath(): string {
  const v = import.meta.env['VITE_REFRESH_ENDPOINT'];
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : DEFAULT_REFRESH_PATH;
}

/** True if the request path is the refresh endpoint (avoid 401 → refresh loop). */
export function isRefreshRequest(path: string): boolean {
  const p = path.startsWith('/') ? path : `/${path}`;
  const r = getRefreshPath().replace(/^\//, '');
  return p === `/${r}` || p.endsWith(`/${r}`);
}

/**
 * Call the refresh endpoint with credentials. Backend typically sets new cookies.
 * @returns true if response is 2xx, false otherwise (caller should then redirect to login).
 */
export async function refreshAuthSession(): Promise<boolean> {
  const url = buildApiUrl(getRefreshPath());
  const credentials: RequestCredentials = getUseCredentials() ? 'include' : 'same-origin';
  const res = await fetch(url, {
    method: 'POST',
    credentials,
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  });
  return res.ok;
}
