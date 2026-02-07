/**
 * Centralized HTTP client. Browser-side only; base URL from env; no legacy coupling.
 * - JWT in Authorization header (from storage) via request interceptor.
 * - Optional credentials (cookies) via config.
 * - 401 → clear token + auth:unauthorized event; other errors → centralized handler.
 */

import { createHttpError, handleResponseError } from './errors';
import { runRequestInterceptors } from './interceptors';
import { buildApiUrl } from './config';
import { useCredentials } from './config';

export type { HttpError } from './errors';
export { setGlobalErrorHandler, AUTH_UNAUTHORIZED_EVENT } from './errors';

async function parseErrorBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get('Content-Type');
  try {
    if (contentType?.includes('application/json')) {
      return await res.json();
    }
    return await res.text();
  } catch {
    return undefined;
  }
}

export async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = buildApiUrl(path);
  const method = (options?.method ?? 'GET').toUpperCase();
  const headers = new Headers(options?.headers);
  const body = options?.body;

  const config = runRequestInterceptors({
    url,
    method,
    headers,
    body,
    credentials: useCredentials ? 'include' : 'same-origin',
  });

  const res = await fetch(config.url, {
    method: config.method,
    headers: config.headers,
    body: config.body,
    credentials: config.credentials ?? 'same-origin',
    signal: options?.signal,
  });

  if (!res.ok) {
    const bodyResult = await parseErrorBody(res);
    const error = createHttpError(res.status, res.statusText, bodyResult);
    handleResponseError(error);
  }

  const contentType = res.headers.get('Content-Type');
  if (contentType?.includes('application/json')) {
    return res.json() as Promise<T>;
  }
  return res.text() as Promise<T>;
}

export function get<T>(path: string, options?: RequestInit): Promise<T> {
  return request<T>(path, { ...options, method: 'GET' });
}

export function post<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
  return request<T>(path, {
    ...options,
    method: 'POST',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function put<T>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
  return request<T>(path, {
    ...options,
    method: 'PUT',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export function del<T>(path: string, options?: RequestInit): Promise<T> {
  return request<T>(path, { ...options, method: 'DELETE' });
}

export const httpClient = request;