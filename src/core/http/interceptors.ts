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

/**
 * Request interceptor: add JWT to headers (and optionally set credentials).
 * Token is read from storage (browser-side only). In dev, VITE_DEV_BEARER_TOKEN is used when storage is empty.
 */
export function runRequestInterceptors(config: RequestConfig): RequestConfig {
  const token = getStoredToken() || getDevBearerToken();
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
