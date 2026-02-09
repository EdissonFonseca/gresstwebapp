/**
 * Request/response interceptors for the HTTP client.
 * Runs in browser only; token from storage (headers). Optional cookie mode via config.
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

/** Dev-only: Bearer token from .env for local testing (e.g. copy from Swagger). Not used in production build. */
function getDevBearerToken(): string | null {
  const v = import.meta.env['VITE_DEV_BEARER_TOKEN'];
  if (typeof v !== 'string' || v.trim() === '') return null;
  const token = v.trim();
  return token.startsWith('Bearer ') ? token.slice(7) : token;
}

const DEFAULT_AUTH_COOKIE_NAME = 'gresst_access_token';

/** Reads a cookie by name (only works for non-HttpOnly cookies). Used when token is set by another app. */
function getCookieToken(): string | null {
  try {
    const raw = import.meta.env['VITE_AUTH_COOKIE_NAME'];
    const name = (typeof raw === 'string' && raw.trim() !== '' ? raw.trim() : DEFAULT_AUTH_COOKIE_NAME);
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`));
    const value = match && match[1] !== undefined ? decodeURIComponent(match[1]).trim() : null;
    return value && value.length > 0 ? value : null;
  } catch {
    return null;
  }
}

/**
 * Request interceptor: add JWT to headers (and optionally set credentials).
 * Token source order: localStorage, then VITE_DEV_BEARER_TOKEN, then cookie (VITE_AUTH_COOKIE_NAME, default gresst_access_token).
 * Cookie is only read if not HttpOnly; otherwise set VITE_API_USE_CREDENTIALS=true and let the backend read the cookie.
 */
export function runRequestInterceptors(config: RequestConfig): RequestConfig {
  const token = getStoredToken() || getDevBearerToken() || getCookieToken();
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
