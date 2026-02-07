/**
 * Centralized HTTP/API error types and handling.
 * All backend errors go through here. Browser-side only; no legacy coupling.
 */

import { clearStoredToken } from '@core/auth/storage';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

/** Thrown when a request fails (4xx/5xx). */
export interface HttpError {
  status: number;
  statusText: string;
  body?: unknown;
  /** Parsed error code from JSON body, e.g. { code: "INVALID_TOKEN" } */
  code?: string;
}

/** Build error from response for consistent handling. */
export function createHttpError(
  status: number,
  statusText: string,
  body?: unknown
): HttpError {
  const err: HttpError = { status, statusText, body };
  if (body && typeof body === 'object' && 'code' in body && typeof (body as { code: unknown }).code === 'string') {
    err.code = (body as { code: string }).code;
  }
  return err;
}

/**
 * Centralized response error handling.
 * - 401: clear token, dispatch event so AuthProvider can logout.
 * - Other: rethrow; optional global handler can be registered.
 */
export function handleResponseError(error: HttpError): never {
  if (error.status === 401) {
    clearStoredToken();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
    }
  }

  const globalHandler = getGlobalErrorHandler();
  if (globalHandler) {
    globalHandler(error);
  }

  throw error;
}

type GlobalErrorHandler = (error: HttpError) => void;
let globalErrorHandler: GlobalErrorHandler | null = null;

export function setGlobalErrorHandler(handler: GlobalErrorHandler | null): void {
  globalErrorHandler = handler;
}

export function getGlobalErrorHandler(): GlobalErrorHandler | null {
  return globalErrorHandler;
}
