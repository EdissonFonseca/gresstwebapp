/**
 * Request/response interceptors for the HTTP client.
 * - When we have a token in localStorage we add Authorization header.
 * - Cookie auth: we do not read the cookie. The app sends credentials (credentials: 'include'
 *   from client) so the browser sends the cookie; the API treats the request as authenticated.
 */

import { getStoredToken } from '@core/auth/storage';

export interface RequestConfig {
  url: string;
  method: string;
  headers: Headers;
  body?: BodyInit | null;
  /** When true, send credentials (cookies) for same-origin or CORS with credentials. */
  credentials?: RequestCredentials;
}

export interface ResponseContext {
  status: number;
  statusText: string;
  ok: boolean;
}

const TOKEN_HEADER = 'Authorization';

/**
 * Request interceptor: add JWT to headers when we have a token in storage.
 * For cookie-only auth we rely on credentials: 'include' (no header, cookie sent by browser).
 */
export function runRequestInterceptors(config: RequestConfig): RequestConfig {
  const token = getStoredToken();
  if (token) {
    config.headers.set(TOKEN_HEADER, `Bearer ${token}`);
  }
  if (!config.headers.has('Content-Type')) {
    config.headers.set('Content-Type', 'application/json');
  }
  return config;
}

/**
 * Response interceptor context. Used by client after fetch to decide error handling.
 */
export function getResponseContext(res: Response): ResponseContext {
  return {
    status: res.status,
    statusText: res.statusText,
    ok: res.ok,
  };
}
