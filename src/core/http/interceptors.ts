/**
 * Request/response interceptors for the HTTP client.
 * Runs in browser only; token from storage (headers). Optional cookie mode via config.
 */

import { getAuthCookieName } from '@core/config/runtimeConfig';
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

/** Reads a cookie by name (only works for non-HttpOnly cookies). Used when token is set by another app. */
function getCookieToken(): string | null {
  try {
    const name = getAuthCookieName();
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`));
    const value = match && match[1] !== undefined ? decodeURIComponent(match[1]).trim() : null;
    return value && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

/**
 * Request interceptor: add JWT to headers (and optionally set credentials).
 * Token source order: localStorage, then cookie (name from config.json or .env).
 * Cookie is only read if not HttpOnly; otherwise set useCredentials in config and let the backend read the cookie.
 */
export function runRequestInterceptors(config: RequestConfig): RequestConfig {
  const token = getStoredToken() || getCookieToken();
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
